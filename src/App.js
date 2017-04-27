import React from "react";
import { graphql, } from "react-apollo";
import { BrowserRouter as Router, NavLink, } from "react-router-dom";
import styled from "styled-components";

import ApolloProvider, { getAllPostsQuery, } from "./graphql";

import Post from "./post";

const RootStyled = styled.div`
	display: flex;
	flex-direction: row;
	align-items: stretch;
`;

const SideBarStyled = styled.div`
	background-color: blue;
	flex: 3 100px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const StyledSideBarLink = styled(NavLink)`
	margin: 4px;
`;

const SideBar = props => (
	<SideBarStyled>
		<StyledSideBarLink to = "/">
			Home
		</StyledSideBarLink>

		{props.posts.map(({ title, slug, }) => (
			<StyledSideBarLink key = { slug } to = { `/post/${slug}` }>
				{title}
			</StyledSideBarLink>
		))}
	</SideBarStyled>
);

const Root = graphql(getAllPostsQuery)(props => (
	<RootStyled>
		<SideBar posts = { R.pathOr([], ["data", "objects",])(props) } />

		<Post />
	</RootStyled>
));

export default () => (
	<ApolloProvider>
		<Router>
			<Root />
		</Router>
	</ApolloProvider>
);
