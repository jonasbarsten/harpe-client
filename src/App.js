import React, { Component } from 'react';
import {withRouter } from "react-router-dom";
// import socketIOClient from 'socket.io-client';
// import { CardDeck } from 'reactstrap';

// import PuffCard from './PuffCard.js';

// import './App.css';
import Routes from './Routes';

// For some reason, cannot use 127.0.0.1
// const endpoint = window.location.hostname + ':4001';
// const socket = socketIOClient(endpoint);


class App extends Component {
  // state = {
  //   response: false
  // }

  // runLedCommand(functionName, args) {
  //   socket.emit('runFunction', functionName, args);
  // }

  // restartServer() {
  //   socket.emit('restart');
  // }

  // oscSend(address, value) {
  //   socket.emit('oscSend', address, value);
  // }

  // componentDidMount() {
  //   socket.on("FromAPI", data => this.setState({ response: data }));
  // }

  render() {
    // const { response } = this.state;
    // console.log(response);

    // if (!response) {
    //   return (
    //     <div><h1>No puffz</h1></div>
    //   );
    // }

    return (
      <div>
        <Routes childProps={this.props} />
      </div>
    );

    // return (
    //   <div className="App">
    //     <div onClick={() => this.runLedCommand('allOn', ["0"])}>All on</div>
    //     <div onClick={() => this.runLedCommand('allOff', ["0"])}>All off</div>
    //     <div onClick={() => this.runLedCommand('rotatePuffDiagonally', ["0", 1])}>Diagonal</div>
    //     <div onClick={() => this.restartServer()}>Restart</div>
    //     <CardDeck>
    //     {
    //       response.map((puff) => {
    //         return (
    //           <PuffCard key={puff.ip} puff={puff}/>
    //         );
    //       })
    //     }
    //     </CardDeck>
    //   </div>
    // );
  }
}

export default withRouter(App);
