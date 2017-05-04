import React from "react";
import { graphql, ApolloProvider, } from "react-apollo";
import { BrowserRouter as Router, } from "react-router-dom";
import styled, { ThemeProvider, } from "styled-components";

import client, { getAllPostsQuery, } from "./graphql";

import SideBar from "./sidebar";
import Post from "./post";
import theme from "./theme";
import config from "../config";

// ------------------------------

const RootStyled = styled.div`
	flex: 1;
	flex-direction: row;
	align-items: stretch;
`;

const Root = graphql(getAllPostsQuery)(props => (
	<RootStyled>
		<SideBar posts = { R.pathOr([], ["data", "objects",])(props) } />

		<Post />
	</RootStyled>
));

Root.defaultProps = {
	bucketSlug: config.bucket.slug,
	readKey: config.bucket["read_key"]
};

// ------------------------------

export default () => (
	<ThemeProvider theme = { theme }>
		<ApolloProvider client = { client  } >
			<Router>
				<Root />
			</Router>
		</ApolloProvider>
	</ThemeProvider>
);
