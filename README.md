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
        ├── vendorReactApollo.c8e28b23.js
```

We've broken our `js` into several different files so that they can be cached independently; if `vendorReactApollo` is the only file that changes, it's the only file that our clients will have to re-get when they revisit our site.

The `index.html` is the only actual webpage we'll deploy, and is also very minimal

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

## S3 setup

## Cloudfront Config

## Show Network Requests

## React Snapshot
