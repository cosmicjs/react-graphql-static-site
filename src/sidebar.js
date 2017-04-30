import React from "react";
import { graphql, } from "react-apollo";
import { Route, Switch, } from "react-router";
import { BrowserRouter as Router, NavLink, } from "react-router-dom";
import styled, { ThemeProvider, css } from "styled-components";

import { getPostQuery, } from "./graphql";

// ------------------------------

const SideBarStyled = styled.div`
	align-items: left;
	background-color: ${ R.path([ "theme", "blue", ]) };
	display: flex;
	flex-direction: column;
	flex: 2;
	height: 100vh;
	max-width: 200px;
	min-width: 150px;
	padding: 1em;

`;

const SideBarStyling = css`
	margin: 2px;
	text-decoration: none;
	color: ${ R.path([ "theme", "white", ]) };

	&:hover {
		color: ${ R.path([ "theme", "lightgray", ]) };
	}

	&.active {
		color: ${ R.path([ "theme", "darkBlue", ]) };

		&:hover {
			color: ${ R.path([ "theme", "darkBlueLight", ]) };
		}
	}
`;

const SideBarText = styled.p`
	${SideBarStyling}
	font-size: 1.2em;
	color: ${ R.path([ "theme", "lightgray", ]) };
`;

const SideBarLink = styled(NavLink)`
	${SideBarStyling}
	font-size: 1.2em;
`;

const SubSideBarLink = styled(NavLink)`
	${SideBarStyling}
	font-size: 2em;
`;

const Nav = styled.div`
	flex: 1;
`;

const Credit = styled.div`
	color: ${ R.path([ "theme", "white", ]) };
	font-size: 0.8em;

	a {
		text-decoration: none;
		color: ${ R.path([ "theme", "white", ]) };

		&:hover {
			color: ${ R.path([ "theme", "darkBlueLight", ]) };
		}
	}
`;

// ------------------------------

export default props => (
	<SideBarStyled>
		<Nav>
			<SideBarLink exact to = "/">
				Home
			</SideBarLink>

			<SideBarText>
				Posts
			</SideBarText>

			{
				props.posts.map(({ title, slug, }) => (
					<SubSideBarLink key = { slug } to = { `/post/${slug}` }>
						{title}
					</SubSideBarLink>
				))
			}
		</Nav>

		<Credit>
			<span>By <a href="https://consulting.codogo.io">Codogo</a></span>

			<span>Made using <a href="https://cosmicjs.com/">Cosmic JS</a></span>
		</Credit>
	</SideBarStyled>
);