import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase, {provider, auth} from './firebase.js';

const cardRef = firebase.database().ref('/cards');

// landing page
class Landing extends Component {
	render(){
		return(
			<div className="wrapper">
				<div className="login-page">
					<div className="headerContent">
						<h1>Idea Garden</h1>
						<p>Plant your ideas here.</p>
						<button className="login-btn" onClick={this.props.login}>Log In</button>
					</div>
					<img className="logo" src="../../dev/styles/assets/logo2.png"/>
				</div>
			</div>
		)
	}
}

// logged-in page header
class Header extends Component {
	render(){
		return(
			<div className="logged-in-home">
				<img className="landingbackdrop" src="../../dev/styles/assets/logo2.png"/>
				<div className="header-left">
					<p>{(this.props.user) ? `${this.props.user.displayName}'s` : "Not logged in." }</p>
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

// logged-in page container for displaying ideas
class CardContainer extends Component {
	render() {
		return (
			<div className="card-container">
				{this.props.cards.map((card)=> {
					return(
						<div className= "card-content" key={card.id}>
							<button className="close-btn" onClick={() => this.props.handleRemoveItem(card.id)}>
								<img className="close-btn-img" src="../../dev/styles/assets/close.png" />
							</button>
							<h3>{card.title}</h3>
							<p>{card.details}</p>
						</div>
					)
				})}
			</div>
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
		this.closeForm = this.closeForm.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.getCards = this.getCards.bind(this);
	}
	login(e) {
		e.preventDefault()
		auth.signInWithPopup(provider) 
		.then((result) => {
			this.getCards();
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
		if (this.state.ideaName !== "" && this.state.ideaDetails !== "") { 
			const card = {
			ideatitle: this.state.ideaName,
			ideadetails: this.state.ideaDetails
			}
			cardRef.push(card);
			this.setState({
				showForm: false,
				ideaName: '',
				ideaDetails: '',
			}); 
		} else {
			alert('Plant an idea!');
		}
	}
	getCards() {
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
	componentDidMount() {
		this.getCards();
	}
	removeItem(key) {
		const cardRef = firebase.database().ref(`/cards/${key}`);
		cardRef.remove();
	}
	createForm(){
		this.setState({
			showForm: true
		})
	}
	closeForm(){
		this.setState({
			showForm: false,
			ideaName: '',
			ideaDetails: '',
		})
	}

    render() {
	    let showForm = (
	    	<div className="form-modal">
		    	<form className="new-idea-form" onSubmit={this.handleSubmit}>
		    		<button className="close-btn" onClick={this.closeForm}>
		    			<img src="../../dev/styles/assets/close.png" />
		    		</button>
		    		<input className="ideaName" type="text" name= "ideaName" placeholder="Idea title" onChange={this.handleChange} value={this.state.ideaName}/>
		    		<textarea className="ideaDetails" name="ideaDetails" cols="30" rows="8" placeholder="Idea details" onChange={this.handleChange} value={this.state.ideaDetails}/>
		    		<button className="create-btn">Create</button>
		    	</form>
	    	</div>
	    )
	    return (
	        <main>
		        <div>
		        	{ !this.state.user && <Landing login={this.login} />}
			        { this.state.user && <Header user={this.state.user} createForm={this.createForm} logout={this.logout} />}
			        <div className="add-card">
			        	{this.state.showForm === true ? showForm : null}
			        </div>
			        { this.state.user && <CardContainer cards={this.state.cards} handleRemoveItem={this.removeItem}/>}
		        </div>
	        </main>
	    )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));