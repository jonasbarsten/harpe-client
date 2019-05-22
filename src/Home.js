import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import { CardDeck, Button, Row, Col, Container } from 'reactstrap';

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
  }

  updateAll() {
    socket.emit('updateAll');
  }

  componentDidMount() {
    socket.on("FromAPI", data => this.setState({ response: data }));
  }

  render() {
    const { response } = this.state;

    if (!response) {
      return (
        <div><h1>No harps or loading ...</h1></div>
      );
    }

    const numberOfNeighbours = response.neighbours.length;

    return (
      <div className="Home">
        <Container>
          <Row>
            <Col>
              <Button onClick={() => {this.updateAll();}} color="primary" size="lg" block>Update all {numberOfNeighbours} harps</Button>
            </Col>
          </Row>
          <br />
          <CardDeck>
          {
            response.neighbours.map((puff) => {
              return (
                <PuffCard key={puff.ip} puff={puff} childProps={this.props}/>
              );
            })
          }
          </CardDeck>
        </Container>
      </div>
    );
  }
}

export default Home;
