# Building a super fast static site using AWS S3 and CloudFront

## Intro
So you've read all the great reasons to [go API-first](https://cosmicjs.com/why-cms-api), and you've produced a great looking single page app to display your content. But how do you serve it to the user?

You COULD  set up a full Node server to host, route and serve your site. Or you could just host your website statically using AWS S3 and CloudFront! This means you simply put your website source files online, and they're served immediately to the user, no server processing needed.

There are several big advantages to static hosting with client-side rendering:
+ Blazing Fast (no server preprocessing)
+ Really simply (no server architecture to maintain)
+ Crazy Available (your server can't break if there isn't one)
+ Instant Updates (don't have to wait for the site to rebuild to see your changes)

Setting up a static site is easier than you might think, and this tutorial walks you through how to set up a static website that gets its data from CosmicJS and renders on the client in under 10 minutes!

We'll also cover some tips and tricks on getting the most out of your static site that you might not have known, which will be useful, even if you're not building a purely static site.

## TL;DR
+ Create a single page app
+ Serve it as a static S3 website
+ Configure CloudFront to distribute it

## The site we'll be hosting

Our example website is a static single page app, in our case using `webpack` and `react`, with `react-router` handling routing, and CosmicJS's [GraphQL](https://cosmicjs.com/docs/graphql) API to fetch data (tutorial coming soon).

If you'd like to follow along at home, you can download our demo code [here](https://bitbucket.org/codogo/cosmic-js-cloudfront-blog-post).

Our demo site is structured as follows:

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

`index.html` is the only HTML file we need to deploy, and it's minimal:

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

With this single page app structure, we're ready to start serving it as a static site using AWS S3!

## S3 setup

AWS S3 buckets can serve their contents as static web pages with little setup. This provides a hassle free solution for serving static files, like our website, quickly and simply.

Enabling website hosting on S3 requires a few steps:

### 1. Bucket Policy
![Enable Permissions](/img/s3_permissions_1.png)

First, you need to set permissions for all files in your S3 bucket so they can be read by anyone. You can copy-paste the code we've used, and replace our bucket name (`codogo-cosmic-js-demo-blog`) with your own:

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

### 2. Website Hosting

![Enable Website Hosting](/img/s3_website_1.png)

Click on `Static website hosting`, and fill in the details as below.

![Enable index.html](/img/s3_website_2.png)

The _Index Document_ is required, and tells the S3 bucket which file to serve if we navigate to the root of our website.

The _Error Document_ is the file that's served whenever a client navigates to a file that doesn't exist in the bucket. This is the most important setting for this tutorial, as it means no matter which path the user navigates to, they are still served our `index.html` file.

### 3. Upload your files

![Show Files](/img/s3_files_1.png)

Upload your site to the root of your S3 bucket and your site will be ready to serve.

### Testing the hosting out

Navigate to the _Endpoint_ URL shown in the `Static Website Hosting` box, and you should see your web app! You can check out our demo [here](http://codogo-cosmic-js-demo-blog.s3-website-eu-west-1.amazonaws.com/).

Try navigating to other pages and refreshing the page - you should see that your web app loads as if the pages you're navigating to actually exist on the server.

### Next steps

For a small site with low, unimportant traffic - for example, a company internal website - this hosting would be sufficient. However, there are two main issues with this hosting solution:

1. __Served from one region__: The website will only be served from the AWS region where your bucket lives, so people in other parts of the world will see poor performance.
2. __HTTP 404 Response code__: If you open your browser network inspector and navigate to a page, you'll see that the server is responding with a `404` code, instead of the `200`/`302` that we want.

Having every page of our site return a `404` code is terrible for SEO as any web-crawler that checks the HTTP response code will think every link on our site is broken! In the next section we'll look at how we can use AWS CloudFront to cache our site, handle our traffic, and fix our error code issue.

## CloudFront Config

### 1. Create A CloudFront Distribution

![Create A Distribution](/img/cf_create_1.png)

We need to create a CloudFront web distribution through which all our web traffic will flow. This will handle the world wide distribution of our S3 website, and can intercept and correct our `404` codes.

![Point CF at our S3 website](/img/cf_create_2.png)

In the `Origin Domain Name` field you'll be given the option to pick your S3 bucket. __Do Not Do This!__ Instead, set the `Origin Domain Name` to be your S3 website URL. For example, for our demo it would be [`codogo-cosmic-js-demo-blog.s3-website-eu-west-1.amazonaws.com`](codogo-cosmic-js-demo-blog.s3-website-eu-west-1.amazonaws.com), not `codogo-cosmic-js-demo-blog.s3.amazonaws.com`.
### 2. Cache long term files

![Create New Behaviour](/img/cf_edit_1.png)

Now we're going to tell CloudFront how to cache our `static` files. To do this we need to create a new Behaviour.

![Cache Behaviour Settings](/img/cf_edit_2.png)

We want our `Path Pattern` to match everything in our static folder. The `Object Settings` should be left as they are.

### 3. Correct Response Code

![Create Error Response](/img/cf_edit_4.png)

Now we create a new error page to intercept the errors from S3.

![Custom Error Response Settings](/img/cf_edit_5.png)

Fill out the custom response as above.

You'll need to give your CloudFront distribution around 15 minutes to fully deploy, but then it should be accessible at it's domain name, ours looks like this: [d2hqptkles3gsg.cloudfront.net](d2hqptkles3gsg.cloudfront.net).

## Conclusion 

And there you have it: A simple client-side rendered static site to display content from CosmicJS that's super fast and super simple.

If you're making a static site, or anything else, with CosmicJS get in touch on out [slack](https://cosmicjs.com/community) or [twitter](https://twitter.com/cosmic_js); we'd love to see what you're making.
This post was written by [Codogo](https://codogo.io/), a fresh new digital agency with a passion for creating amazing digital experiences. Keep an eye out for our next post, on best practice for making a CosmicJS site using react.js and GraphQL.
