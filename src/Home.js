import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import { CardDeck } from 'reactstrap';

import PuffCard from './PuffCard.js';

import './Home.css';

// For some reason, cannot use 127.0.0.1
const endpoint = window.location.hostname + ':4001';
const socket = socketIOClient(endpoint);


class Home extends Component {
  state = {
    response: false
  }

  runLedCommand(functionName, args) {
    socket.emit('runFunction', functionName, args);
  }

  restartServer() {
    socket.emit('restart');
  }s

  componentDidMount() {
    socket.on("FromAPI", data => this.setState({ response: data }));
  }

  render() {
    const { response } = this.state;

    if (!response) {
      return (
        <div><h1>No puffz or loading ...</h1></div>
      );
    }

    return (
      <div className="Home">
        <CardDeck>
        {
          response.map((puff) => {
            return (
              <PuffCard key={puff.ip} puff={puff} childProps={this.props}/>
            );
          })
        }
        </CardDeck>
      </div>
    );
  }
}

export default Home;
