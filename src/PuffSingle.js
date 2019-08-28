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
	  value: 0,
	  duration: 100,
	  amount: 1
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

	// runLedCommand(functionName, args) {
	//   this.state.socket.emit('runFunction', functionName, args);
	// }

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
		for (let i = 0; i <= 16; i++) {
			this.state.socket.emit('pwm', i, 0);
		}
	}

	solenoid() {
		console.log('Boom');
		const channel = this.state.channel;
		this.state.socket.emit('pwm', channel, this.state.amount * 1000);
		setTimeout(() => {
			this.state.socket.emit('pwm', channel, 0);
		}, this.state.duration);

	}

	render () {

		const { response } = this.state;

		if (!response) {
			return (
				<div>Loading ...</div>
			);
		};

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
					<Row>
						<Col>
							<div style={{textAlign: 'center'}}>
								<h2>FADE</h2>
							</div>
							<div style={{height: '200px', textAlign: 'center'}}>
							  <Slider style={{margin: 'auto auto'}} min={0} max={1000} vertical={true} onChange={(value) => this.pwm(value)} />
							  <br />
							</div>
						</Col>
						<Col>
							<div style={{textAlign: 'center'}}>
								<h2>HIT</h2>
								<div style={{marginTop: '45px', textAlign: 'center', width: '100px'}}>
									<Button color="primary" size="lg" block onClick={() => this.solenoid()}>BOOM</Button>
								</div>
								<br />
								<label>Duration (ms): </label>
								<input type="number" min="0" value={this.state.duration} onChange={(e) => this.setState({duration: e.target.value})} style={{width: '100px'}} />
								<br />
								<label>Amount (0-1): </label>
								<input type="number" step="0.01" min="0" max="1" value={this.state.amount} onChange={(e) => this.setState({amount: e.target.value})} style={{width: '100px'}} />
							</div>
						</Col>
					</Row>
					<Row>
						<Col>
							<div style={{textAlign: 'center', marginTop: '10px', marginBottom: '10px'}}>
								<label>Channel: </label>
								<input type="number" min="0" max="15" value={this.state.channel} onChange={(e) => this.setState({channel: e.target.value})} style={{width: '50px', marginLeft: '10px'}} />
							</div>
						</Col>
					</Row>
					<Row>
						<Col>
							<div>
								<Button color="warning" size="lg" block onClick={() => this.allOff()}>All PWM off</Button>
								<Button color="danger" size="lg" block onClick={() => this.restartPuff()}>Restart harp</Button>
								<Button color="primary" size="lg" block onClick={() => this.updatePuff()}>Update harp</Button>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default PuffSingle;