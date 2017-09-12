import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase, {provider, auth} from './firebase.js';

const cardRef = firebase.database().ref('/cards');

// landing page
class Landing extends Component {
	render(){
		return(
			<div className="login-page">
				<div className="headerContent">
					<h1>Idea Garden</h1>
					<p>Plant your ideas here.</p>
					<button className="login-btn" onClick={this.props.login}>Log In</button>
				</div>
				<img className="logo" src="../../dev/styles/assets/logo2.png"/>
			</div>
		)
	}
}

// logged in home header
class Header extends Component {
	render(){
		return(
			<div className="logged-in-home">
				<div className="header-left">
					<img className="logo" src="../../dev/styles/assets/logo2.png"/>
					<p>user name's</p>
					<h1>Idea Garden</h1>
				</div>
				<div className="header-right">
					<button className="new-idea-btn" onClick={() => this.props.createForm()} >New Idea</button>
					<button className="log-out-btn" onClick={this.props.logout}>Log out</button>
				</div>
			</div>
		)
	}
}

// container for displaying ideas
class CardContainer extends Component {
	render() {
		return (
			<ul className= "card-content">
				{this.props.cards.map( (card, index)=> {
					return(
						<li key={index}>
							<h3>{card.title}</h3>
							<p>{card.details}</p>
						</li>
					)
				})}
			</ul>
		)
	}
}

class App extends Component {
	constructor(){
		super()
		this.state = {
			ideaName: '',
			ideaDetails: '',
			showForm: false,
			showCard: false,
			cards: [],
			user: null,
		}
		this.createForm = this.createForm.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}
	login(e) {
		e.preventDefault()
		auth.signInWithPopup(provider) 
		.then((result) => {
			const user = result.user;
			this.setState({ user });
		});
	}
	logout(e) {
		e.preventDefault();
		auth.signOut()
		.then(() => {
			this.setState({ user: null });
		});
	}
	handleChange(e) {
	    this.setState({
	    	[e.target.name]: e.target.value
	    });
	}
	handleSubmit(e) {
		e.preventDefault();
		const card = {
			ideatitle: this.state.ideaName,
			ideadetails: this.state.ideaDetails
		}
		cardRef.push(card);
		this.setState({
			ideatitle: '',
			ideadetails: ''
		});
	}
	componentDidMount() {
		cardRef.on('value', (snapshot) => {
			let cards = snapshot.val();
			let newState = [];
			for (let card in cards) {
		    	newState.push({
		    		id: card,
		    		title: cards[card].ideatitle,
		    		details: cards[card].ideadetails,
		    	});
		    }
		    this.setState({
		    	cards: newState
		    });
		});
	}
	removeItem(itemId) {
		const cardRef = firebase.database().ref(`/cards/${cardId}`);
		cardRef.remove();
	}
	createForm(){
		this.setState({
			showForm: true
		})
	}
    render() {
	    let showForm = (
	    	<form className="new-idea-form" onSubmit={this.handleSubmit}>
	    		<button className="close-btn">
	    			<img src="../../dev/styles/assets/close.png" />
	    		</button>
	    		<input className="ideaName" type="text" name= "ideaName" placeholder="Idea title" onChange={this.handleChange} value={this.state.ideaName}/>
	    		<textarea className="ideaDetails" name="ideaDetails" cols="30" rows="8" placeholder="Idea details" onChange={this.handleChange} value={this.state.ideaDetails}/>
	    		<button className="create-btn">Create</button>
	    	</form>
	    )
	    return (
	        <main>
		        <div className="wrapper">
		        	{ !this.state.user && <Landing login={this.login} />}
			        { this.state.user && <Header createForm={this.createForm} logout={this.logout} />}
			        <div className="add-card">
			        	{this.state.showForm === true ? showForm : null}
			        </div>
			        { this.state.user && <CardContainer cards={this.state.cards}/>}
		        </div>
	        </main>
	    )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));