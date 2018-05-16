import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

import './App.css';

// For some reason, cannot use 127.0.0.1
const endpoint = window.location.hostname + ':4001';
const socket = socketIOClient(endpoint);


class App extends Component {
  state = {
    response: false
  }

  runLedCommand(functionName, args) {
    socket.emit('runFunction', functionName, args);
  }

  restartServer() {
    socket.emit('restart');
  }

  // oscSend(address, value) {
  //   socket.emit('oscSend', address, value);
  // }

  componentDidMount() {
    socket.on("FromAPI", data => this.setState({ response: data }));
  }

  render() {
    const { response } = this.state;
    console.log(response);

    return (
      <div className="App">
        <div onClick={() => this.runLedCommand('allOn', "0")}>All on</div>
        <div onClick={() => this.runLedCommand('allOff', "0")}>All off</div>
        <div onClick={() => this.runLedCommand('rotatePuffDiagonally', "0", 1)}>Diagonal</div>
        <div onClick={() => this.restartServer()}>Restart</div>
      </div>
    );
  }
}

export default App;
