# Building a super fast static site using AWS S3 and CloudFront

## Into
+ Why have a static client rendered site? Pros/Cons
+ How to fix cons:

Pros:
+ Faster updates
+ No need to redeploy/flush cache for every content update
+ Single Page apps

Cons:
+ No clever server-side dynamic routing

## TL;DR
+ Create a single page app
+ Serve it as an S3 website
+ Configure Cloudfront to serve it

## The site we'll be hosting

Our website is build as a static single page app; in our case using `webpack` and `react`, with `react-router` to handle routing.
Once we've compiled our site ready for deployment it has a structure like this:

```
.
├── asset-manifest.json
├── favicon.ico
├── index.html
└── static
    └── js
        ├── main.3c8c3c1e.js
        ├── manifest.4a707e54.js
        ├── vendor.94287fcf.js
        ├── vendorConstant.0e34bc16.js
        └── vendorReactApollo.c8e28b23.js
```

We've broken our `js` into several different files so that they can be cached independently; if `vendorReactApollo` is the only file that changes, it's the only file that our clients will have to re-get when they revisit our site.

The `index.html` is the only actual web page we'll deploy, and it is also very minimal

``` html
<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
      <link rel="shortcut icon" href="/favicon.ico">
      <title>React App</title>
   </head>
   <body>
      <div id="root"> </div>
      <script type="text/javascript" src="/static/js/manifest.4a707e54.js"> </script>
      <script type="text/javascript" src="/static/js/vendorConstant.0e34bc16.js"></script>
      <script type="text/javascript" src="/static/js/vendorReactApollo.c8e28b23.js"></script>
      <script type="text/javascript" src="/static/js/vendor.94287fcf.js"></script>
      <script type="text/javascript" src="/static/js/main.3c8c3c1e.js"></script>
   </body>
</html>
```

Once we've got this single page app structure, we're ready to start serving it as a static site using AWS S3!

## S3 setup

Every AWS S3 bucket has built in capabilities to serve its contents as a static webpage. This provides a hassle free solution to serving static files like our website quickly and simply.

To enable website hosting on S3 requires a few steps:

### Bucket Policy
![Enable Permissions](/img/s3_permissions_1.png)

First, you need to open all files in your S3 bucket to be read by anyone. You can copy-paste the code we've used, and replace our bucket name (`codogo-cosmic-js-demo-blog`) with your own:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AddPerm",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::codogo-cosmic-js-demo-blog/*"
        }
    ]
t}
```

### Website Hosting

![Enable Website Hosting](/img/s3_website_1.png)

Click on `Static website hosting`, and fill in the details as below.

![Enable index.html](/img/s3_website_2.png)

The _Index Document_ is required, and tells the S3 bucket which file to serve if we navigate to the root of our website.

The _Error Document_ is the file that's served whenever a client navigates to a file that doesn't exist in the bucket. This is the important value for this tutorial, as it means we can serve our `index.html` file regardless of where our users navigate to.

### Uploaded files

![Show Files](/img/s3_files_1.png)

These are the files we've uploaded to the root of our S3 bucket, ready for hosting.

### Testing the hosting out

Navigate to the _Endpoint_ URL shown in the `Static Website Hosting` box, and you should see your web app! The S3 website for this tutorial can be found at [http://codogo-cosmic-js-demo-blog.s3-website-eu-west-1.amazonaws.com/](http://codogo-cosmic-js-demo-blog.s3-website-eu-west-1.amazonaws.com/)

Try navigating to other routes, and refreshing the page. You should see that your web app loads as if the pages you're navigating to actually exist on the server.

### Still to do

For a small site with low, unimportant traffic: a company internal website for example, this hosting would be sufficient. However, there are two main issues with this hosting solution.

1. __Served from one origin__: The website will only be served from the AWS region where your bucket lives, so people in other parts of the world will see poor performance.
2. __HTTP 404 Response code__: If you open your browser network inspector and navigate to a page, you'll see that the server is responding with a `404` code, instead of the `200`/`302` that we want.

Having every page of our site return a `404` code is terrible for SEO, any web-crawler that checks the HTTP response code will think every link on our site is broken! In the next section we look at how we can use AWS CloudFront to cache and distribute all our traffic, and fix our error code issue.

## Cloudfront Config

### Create A Cloudfront Distribution

![Create A Distribution](/img/cf_create_1.png)

We need to create a cloudfront web distribution through which all our web traffic will flow. This will handle the world wide distribution of our S3 website, and can intercept our `404` codes.

![Point CF at our S3 website](/img/cf_create_2.png)

In the `Origin Domain Name` field you'll be given the option to pick your S3 bucket. __Do Not Do This!__ Instead, set the `Origin Domain Name` to be your S3 website URL. So for our example it would be [`codogo-cosmic-js-demo-blog.s3-website-eu-west-1.amazonaws.com`](codogo-cosmic-js-demo-blog.s3-website-eu-west-1.amazonaws.com).

### Cache long term files

![Create New Behaviour](/img/cf_edit_1.png)

Now we're going to tell cloudfront how to cache our `static` files, to do this we need to create a new Behaviour.

![Cache Behaviour Settings](/img/cf_edit_2.png)

We want our `Path Pattern` to match everything in our static folder. The `Object Settings` should be left as they are.

### Correct Response Code

![Create Error Response](/img/cf_edit_4.png)

Now we create a new error page to intercept the errors from S3

![Custom Error Response Settings](/img/cf_edit_5.png)

Fill out the custom response as above.

## React Snapshot


