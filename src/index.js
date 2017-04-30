import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { injectGlobal } from "styled-components";

// ------------------------------

injectGlobal`
	@import url('https://fonts.googleapis.com/css?family=Eczar|Work+Sans');

	* {
		box-sizing: border-box;
	}

	html {  
		height: 100%;
	}

	body {
		display: flex;
		margin: 0;
		min-height: 100%;
		font-family: 'Work Sans', sans-serif;
	}

	#root {
		align-self: stretch;
		flex: 1;
		min-height: 100%;
	}

	div {
		display: flex;
		flex-direction: column;
	}

	h1, h2, h3, h4, h5, h6 {
		font-family: 'Eczar', sans-serif;
	}
`;

// ------------------------------

ReactDOM.render(<App />, document.getElementById("root"));
