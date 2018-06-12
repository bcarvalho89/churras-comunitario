import React, { Component } from 'react';
import firebase, { auth, provider } from './firebase';

import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      currentItem: '',
      items: [],
      user: null
    };
  }

  componentDidMount() {
    this.fetchItems();

    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          user
        });
      }
    });
  }

  fetchItems() {
    const itemsRef = firebase.database().ref('items');

    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];

      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
        });
      }

      this.setState({
        items: newState
      });
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      user: this.state.user.displayName || this.state.user.email
    };

    itemsRef.push(item);

    this.setState({
      currentItem: '',
      username: ''
    });
  }

  removeItem = (itemId) => {
    const itemRef = firebase.database().ref(`/items/${itemId}`);

    itemRef.remove();
  }

  login = () => {
    auth.signInWithPopup(provider)
      .then(result => {
        const user = result.user;

        this.fetchItems();
        this.setState({
          user
        });
      });
  }

  logout = () => {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null,
          items: []
        })
      });
  }

  render() {
    return (
      <div className="app">
        <header>
          <div className="wrapper">
            <h1>Churras comunitário <i className="fas fa-shopping-basket"></i></h1>
            { this.state.user ?
              <button onClick={this.logout}>Sair</button> :
              <button onClick={this.login}>Entrar</button>
            }
          </div>
        </header>
        { this.state.user ?
          <div>
            <div className="user-profile">
              <img src={this.state.user.photoURL} />
            </div>
            <div className="container">
              <section className="add-item">
                <form onSubmit={this.handleSubmit}>
                  <input type="text" name="username" placeholder="Seu nome" value={this.state.user.displayName || this.state.user.email} disabled />
                  <input type="text" name="currentItem" placeholder="O que você irá trazer?" value={this.state.currentItem} onChange={this.handleChange} />
                  <button>Adicionar item</button>
                </form>
              </section>
              <section className="display-item">
                <div className="wrapper">
                  <ul>
                    {this.state.items.map((item) => {
                      return (
                        <li key={item.id}>
                          <h3>{item.title}</h3>
                          <p>Quem irá trazer: {item.user}</p>
                          { item.user === this.state.user.displayName || this.user === this.state.user.email ?
                            <button onClick={() => this.removeItem(item.id)}>Remover item</button> :
                            null
                          }                          
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </section>
            </div>
          </div> :
          <div className="wrapper">
            <p>Você precisa estar logado para ver a lista de itens.</p>
          </div>
        }
      </div>
    );
  }
}

export default App;
