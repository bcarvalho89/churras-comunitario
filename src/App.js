import React, { Component } from 'react';
import firebase from './firebase';

import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      currentItem: '',
      items: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
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

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      user: this.state.username
    };

    itemsRef.push(item);

    this.setState({
      currentItem: '',
      username: ''
    });
  }

  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);

    itemRef.remove();
  }

  render() {
    return (
      <div className="app">
        <header>
          <div className="wrapper">
            <h1>Churras comunitário</h1>
            <i className="fas fa-shopping-basket"></i>
          </div>
        </header>
        <div className="container">
          <section className="add-item">
            <form onSubmit={this.handleSubmit}>
              <input type="text" name="username" placeholder="Seu nome" value={this.state.username} onChange={this.handleChange} />
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
                      <p>Trazido por: {item.user}</p>
                      <button onClick={() => this.removeItem(item.id)}>Remover item</button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default App;
