import React, { Component } from 'react';
// import socketIOClient from 'socket.io-client';
// import UDPPort from 'osc';

import './App.css';

// For some reason, cannot use 127.0.0.1
// const endpoint = window.location.hostname + ':4001';
// const socket = socketIOClient(endpoint);


// const udpPort = osc.UDPPort({
//   localAddress: "10.0.255.255",
//   localPort: 8050,
//   metadata: true,
//   broadcast: true
// });


class App extends Component {
  state = {
    response: false,
    oscPortReady: false
  }

  runLedCommand(functionName, args) {
    // socket.emit('runFunction', functionName, args);
  }

  restartServer() {
    // socket.emit('restart');
  }

  componentDidMount() {
    // socket.on("FromAPI", data => this.setState({ response: data }));

    // udpPort.open();

    // udpPort.on("ready", () => {
    //   this.setState({
    //     oscPortReady: true
    //   });
    // });

  }
  render() {
    // const { response } = this.state;
    // console.log(response);

    return (
      <div className="App">
        <div onClick={() => this.runLedCommand('allOn', "0")}>All on</div>
        <div onClick={() => this.runLedCommand('allOff', "0")}>All off</div>
        <div onClick={() => this.restartServer()}>Restart</div>
      </div>
    );
  }
}

export default App;
