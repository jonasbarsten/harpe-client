import React, { Component } from "react";
import socketIOClient from 'socket.io-client';
import moment from 'moment';
import { Container, Col, Button, Row, Badge } from 'reactstrap';
import Slider from 'rc-slider';

import "./PuffSingle.css";
import 'rc-slider/assets/index.css';

class PuffSingle extends Component {
	state = {
	  response: false,
	  socket: null,
	  channel: 0,
	  value: 0
	}

	componentDidMount() {
		const endpoint = this.props.match.params.id + ':4001';
		const socket = socketIOClient(endpoint);
		this.setState({
			socket: socket
		});
	  socket.on("FromAPI", data => this.setState({ response: data }));
	}

	componentWillUnmount() {
		this.state.socket.disconnect();
	}

	runLedCommand(functionName, args) {
	  this.state.socket.emit('runFunction', functionName, args);
	}

	restartPuff() {
	  this.state.socket.emit('restart');
	}

	updatePuff() {
	  this.state.socket.emit('update');
	}

	pwm(value) {
	  this.state.socket.emit('pwm', this.state.channel, value);
	}

	allOff() {

		console.log('All off')

		for (let i = 0; i <= 16; i++) {
			this.state.socket.emit('pwm', i, 0);
		}

	  // this.state.socket.emit('pwm', this.state.channel, value);
	}

	// oscSend(address, value) {
	//   socket.emit('oscSend', address, value);
	// }

	render () {

		const { response, value } = this.state;

		console.log(value);

		if (!response) {
			return (
				<div>Loading ...</div>
			);
		};

		console.log(response);

		const hostName = response.hostName;
		let lastSeen = '';

		if (response.neighbours) {
			response.neighbours.map((puff) => {
				if (puff.ip === this.props.match.params.id) {
					lastSeen = moment(puff.lastSeen).format('HH:mm:ss');
				};
				return null;
			});
		};

		return (
			<div className="PuffSingle">
				<Container>
					<Row>
						<Col>
							<Button outline color="secondary" onClick={() => this.props.history.push("/")} style={{marginBottom: "8px"}}>Home</Button>
						</Col>
						<Col>
							<div className="text-right"><Badge color="success">{hostName}</Badge></div>
						</Col>
						<Col>
							<div className="text-right">Last seen <Badge color="primary">{lastSeen}</Badge></div>
						</Col>
					</Row>
				</Container>
				<div style={{height: '200px', textAlign: 'center '}}>
				  <Slider style={{margin: 'auto auto'}} min={0} max={1000} vertical={true} onChange={(value) => this.pwm(value)} />
				  <br />
				</div>
				<div>
					<label>Channel: </label>
					<input type="number" value={this.state.channel} onChange={(e) => this.setState({channel: e.target.value})} style={{width: '50px', marginLeft: '10px'}} />
				</div>
				<div>

					<Button color="warning" size="lg" block  onClick={() => this.allOff()}>All off</Button>
					<Button color="danger" size="lg" block  onClick={() => this.restartPuff()}>Restart puff</Button>
					<Button color="primary" size="lg" block  onClick={() => this.updatePuff()}>Update puff</Button>
				</div>
			</div>
		);
	}
}

export default PuffSingle;