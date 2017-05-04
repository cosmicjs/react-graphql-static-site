import React from "react";
import { graphql, } from "react-apollo";
import { Route, Switch, } from "react-router";
import styled from "styled-components";

import { getPostQuery, } from "./graphql";
import config from "../config";

// ------------------------------

const PostContainerStyled = styled.div`
	align-items: center;
	flex: 7;
	padding: 8px;
	height: 100vh;
	overflow: scroll;
`;

const PostInner = styled.div`
	max-width: 600px;
	min-width: 300px;
	text-align: left;
	width: 100%;
	padding: 2em 1em;
	display: block;
`;

const PostImage = styled.img`
	max-width: 100%;
	height: auto;
`;

const PostTitle = styled.h1`

`;

const PostContents = styled.div`
`;

const Post = graphql(getPostQuery)(props => (
	<PostContainerStyled>
		<PostInner>
			<PostImage
				src = { R.path([
					"data",
					"object",
					"metadata",
					"hero",
					"imgix_url",
				])(props) }
			/>

			<PostTitle>
				{R.path(["data", "object", "title",])(props)}
			</PostTitle>

			<PostContents
				dangerouslySetInnerHTML = { {
					__html: R.path(["data", "object", "content",])(props),
				} }
			/>
		</PostInner>
	</PostContainerStyled>
));

Post.defaultProps = {
	bucketSlug: config.bucket.slug,
	readKey: config.bucket["read_key"]
};

const PostWrapper = props => (
	<Post postSlug = { R.path(["match", "params", "postSlug",])(props) } />
);

const HomeWrapper = () => <Post postSlug = "home" />;

const FourOhFourWrapper = () => <Post postSlug = "404" />;

// ------------------------------

export default () => (
	<Switch>
		<Route path = "/post/:postSlug" component = { PostWrapper } />

		<Route exact path = "/" component = { HomeWrapper } />

		<Route component = { FourOhFourWrapper } />
	</Switch>
);
