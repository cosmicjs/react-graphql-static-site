# React GraphQL Static Site
This is an example of a simple blog add build using [create-react-app](https://github.com/facebookincubator/create-react-app). It's powered by [GraphQL](http://graphql.org/) connected to the [Cosmic JS API](https://cosmicjs.com/) for easy content management.

## Getting Started
1. Go to Cosmic JS and create a new Bucket to store your todos.
2. Download the app:
```
git clone https://github.com/tonyspiro/react-graphql-static-site
cd react-graphql-static-site
yarn
```
## Starting the app
### Run in development
Connect to your Bucket on Cosmic JS with the ENV Variable `COSMIC_BUCKET` or edit the `config.js` file
```
COSMIC_BUCKET=your-bucket-slug yarn start
```
### Build for production
```
COSMIC_BUCKET=your-bucket-slug yarn build
```
