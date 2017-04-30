import {
	ApolloClient,
	createNetworkInterface,
} from "react-apollo";

// ------------------------------

const networkInterface = createNetworkInterface({
	uri: "https://graphql.cosmicjs.com/v1",
});

const client = new ApolloClient({
	networkInterface: networkInterface,
});

// ------------------------------

export default client;

export { default as getAllPostsQuery, } from "./getAllPosts.graphql";
export { default as getPostQuery, } from "./getPost.graphql";
