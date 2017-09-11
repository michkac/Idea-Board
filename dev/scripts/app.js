import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import logo from '../styles/assets/logo.png';
import firebase from './firebase.js'

// const dbRef = firebase.database().ref("/items");


// change user.loggedIn: true when user logs in and changes the state of the app
// class Login extends React.Component {
// 	constructor() {
// 		super();
// 		this.state = {
// 			user = {
// 				loggedIn: false
// 			}
// 		}
// 	}
// }


//have a header that floats logo, name, new idea and logout in one line
class Header extends Component {
	render(){
		return(
			<div className="logged-in-home">
				<img src="../styles/assets/logo.png"/>
				<p>name of user</p>
				<h1>Idea Garden</h1>
				<button className="log-out-btn">Log Out</button>
				<button className="new-idea-btn">New Idea</button> 
			</div>
		)
	}
}


// display ideas in the form of square tiles
// function for editing existing ideas and delete ideas
class CardContainer extends Component {
	render() {
		return (
			<div className= "card-content">
			</div>
		)
	}
}


class App extends Component {
	constructor(){
		super()
		this.state = {
		}

		// this.handleCardClicked = this.handleCardClicked.bind(this);
	}
    render() {
      return (
        <main>
	        <Header />
	        <CardContainer />
        </main>
      )
    }
    // componentDidMount() {

    // }
}


ReactDOM.render(<App />, document.getElementById('app'));