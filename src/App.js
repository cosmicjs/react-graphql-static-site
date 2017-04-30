import React from "react";
import { graphql, } from "react-apollo";
import { BrowserRouter as Router, NavLink, } from "react-router-dom";
import styled, { ThemeProvider, } from "styled-components";

import ApolloProvider, { getAllPostsQuery, } from "./graphql";

import Post from "./post";
import theme from "./theme";

const RootStyled = styled.div`
	flex: 1;
	flex-direction: row;
	align-items: stretch;
`;

const SideBarStyled = styled.div`
	background-color: ${ R.path([ "theme", "blue", ]) };
	flex: 2;
	min-width: 100px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
	/* offset-x | offset-y | blur-radius | spread-radius | color */
	box-shadow: 0 0 8px 2px ${ R.path([ "theme", "darkBlue", ]) };
	border-radius: 4px;
`;

const StyledSideBarLink = styled(NavLink)`
	font-size: 2rem;
	margin: 8px;
	text-decoration: none;
	color: ${ R.path([ "theme", "white", ]) };

	&.active {
		color: ${ R.path([ "theme", "darkBlue", ]) };
	}
`;

const SideBar = props => (
	<SideBarStyled>
		<StyledSideBarLink exact to = "/">
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
	<ThemeProvider theme = { theme } >
		<ApolloProvider>
			<Router>
				<Root />
			</Router>
		</ApolloProvider>
	</ThemeProvider>
);
