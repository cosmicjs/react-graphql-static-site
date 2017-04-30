import {
	ApolloClient,
	ApolloProvider,
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

export default props => (
	<ApolloProvider client = { client }>
		{props.children}
	</ApolloProvider>
);

export { default as getAllPostsQuery, } from "./getAllPosts.graphql";
export { default as getPostQuery, } from "./getPost.graphql";
