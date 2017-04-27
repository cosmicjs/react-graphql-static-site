import React from "react";
import { graphql, } from "react-apollo";
import { Route, Switch, } from "react-router";
import styled from "styled-components";

import { getPostQuery, } from "./graphql";

const PostContainerStyled = styled.div`
	flex: 7;
`;

const PostImage = styled.img`
`;

const PostTitle = styled.h1`

`;

const PostContents = styled.div`
`;

const Post = graphql(getPostQuery)(props => (
	<PostContainerStyled>

		<PostImage
			src = { R.path(["data", "object", "metadata", "hero", "imgix_url",])(
				props,
			) }
		/>

		<PostTitle>
			{R.path(["data", "object", "title",])(props)}
		</PostTitle>

		<PostContents
			dangerouslySetInnerHTML = { {
				__html: R.path(["data", "object", "content",])(props),
			} }
		/>

	</PostContainerStyled>
));

const PostWrapper = props => (
	<Post postSlug = { R.path(["match", "params", "postSlug",])(props) } />
);

const HomeWrapper = () => <Post postSlug = "home" />;

const FourOhFourWrapper = () => <Post postSlug = "404" />;

export default () => (
	<Switch>
		<Route path = "/post/:postSlug" component = { PostWrapper } />

		<Route exact path = "/" component = { HomeWrapper } />

		<Route component = { FourOhFourWrapper } />
	</Switch>
);
