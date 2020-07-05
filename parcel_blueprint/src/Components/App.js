import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import AppProvider from './AppProvider.js'; 
import { AppContext } from './AppProvider.js';

const StyledApp = styled.div`
	font-size: 1.6rem;
	
	#app-social-bar	{
		position: absolute;
		top: 50%;
		left: 50%;
		
		transform: translate(-50%, -50%);
		
		
		padding: 2rem;
		border: 1px solid #000;
		
		width: 40rem;
		height: 20rem;
		
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		
		#app-social-bar-icons-wrapper {
			display: flex;
			justify-content: space-between;
			
			
			.app-social-bar-button {
				border: 1px dashed #000;
				padding: 1rem;
				
			
				&:hover {
					cursor:pointer;
				}
				
				display: flex;
				text-align: center;
				align-items: center;
			}
		}
		
		#app-social-bar-status {
			width: 100%;
			height: 2rem;
			border: 1px solid #000;
			
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
`;

export function App() {
	return(
		<AppProvider>
			<AppContext.Consumer>
				{({ rs, wsId, handleGoogleLogin }) => (
					<StyledApp>
						<div id="app-social-bar">
							<div id="app-social-bar-icons-wrapper">
								<div className="app-social-bar-button google" onClick={(e) => handleGoogleLogin()}>Google</div>
								<div className="app-social-bar-button twitter">Twitter</div>
								<div className="app-social-bar-button facebook">Facebook</div>
							</div>
							<div id="app-social-bar-status">
								<span>{ rs } </span>
								<span>{ wsId }</span>
							</div>
						</div>
						
					</StyledApp>
				)}
			</AppContext.Consumer>
		</AppProvider>	
	)
}

if (document.getElementById('react_root')) {
    ReactDOM.render(<App />,document.getElementById('react_root'));
}