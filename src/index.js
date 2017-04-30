import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { injectGlobal } from "styled-components";

injectGlobal`
	html {  
		height: 100%;
	}

	body {
		display: flex;
		margin: 0;
		min-height: 100%;
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
`;

ReactDOM.render(<App />, document.getElementById("root"));
