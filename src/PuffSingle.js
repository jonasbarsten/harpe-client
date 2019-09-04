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
	  value: [0.00, 0.00, 0.00, 0.00, 0.00, 0.00],
	  solenoidDuration: [0, 0, 0],
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

	pwm(value, channel) {
		let oldValueArray = this.state.value;
		oldValueArray[channel] = value / 1000;
		this.setState({value: oldValueArray});
	  this.state.socket.emit('pwm', this.state.channel, value);
	}

	allOff() {
		for (let i = 0; i <= 16; i++) {
			this.state.socket.emit('pwm', i, 0);
		}
	}

	pwmHit() {
		console.log('Boom');
		const channel = this.state.channel;
		this.state.socket.emit('pwm', channel, this.state.amount * 1000);
		setTimeout(() => {
			this.state.socket.emit('pwm', channel, 0);
		}, this.state.duration);
	}

	solenoidHit(number) {
		this.state.socket.emit('solenoid', number, 1);
		setTimeout(() => {
			this.state.socket.emit('solenoid', number, 0);
		}, 500);

	}

	render () {

		console.log(this.state);

		const { response } = this.state;
		const faders = [0, 1, 2, 3, 4, 5];
		const solenoids = [0, 1, 2];

		if (!response) {
			return (
				<div>Loading ...</div>
			);
		};

		const hostName = response.hostName;
		const type = response.type;
		// const type = 'solenoid';
		let lastSeen = '';

		if (response.neighbours) {
			response.neighbours.map((puff) => {
				if (puff.ip === this.props.match.params.id) {
					lastSeen = moment(puff.lastSeen).format('HH:mm:ss');
				};
				return null;
			});
		};

		const pwmOff = (type === 'ebow') ? <Button color="warning" size="lg" block onClick={() => this.allOff()}>All PWM off</Button> : null;

		const controller = (type === 'ebow') ? 
			<div>
				<Row style={{marginTop: '20px', marginBottom: '100px'}}>
					<Col>
						<Row>
							<Col>
								<div style={{textAlign: 'center', marginBottom: '30px'}}>
									<h2>FADE</h2>
								</div>
							</Col>
						</Row>
						<Row>
							{faders.map((fader) => {
								return (
									<Col key={fader}>
										<div style={{textAlign: 'center'}}>
											<h2>{fader}</h2>
										</div>
										<div style={{height: '200px', textAlign: 'center'}}>
										  <Slider style={{margin: 'auto auto'}} min={0} max={1000} vertical={true} onChange={(value) => this.pwm(value, fader)} />
										  <br />
										  <p>{this.state.value[fader]}</p>
										</div>
									</Col>
								);
							})}
						</Row>
					</Col>
				</Row>
				<span style={{clear: 'both'}}></span>
				<Row>
					<Col>
						<div style={{textAlign: 'center'}}>
							<h2>HIT</h2>
							<div style={{margin: '45px auto 0 auto', width: '100px'}}>
								<Button color="success" size="lg" block onClick={() => this.pwmHit()}>BOOM</Button>
							</div>
							<br />
							<label>Duration (ms): </label>
							<input type="number" min="0" value={this.state.duration} onChange={(e) => this.setState({duration: e.target.value})} style={{width: '100px', marginLeft: '10px'}} />
							<br />
							<label>Amount (0-1): </label>
							<input type="number" step="0.01" min="0" max="1" value={this.state.amount} onChange={(e) => this.setState({amount: e.target.value})} style={{width: '100px', marginLeft: '10px'}} />
							<br />
							<label>Channel: </label>
							<input type="number" min="0" max="15" value={this.state.channel} onChange={(e) => this.setState({channel: e.target.value})} style={{width: '100px', marginLeft: '10px'}} />
						</div>
					</Col>
				</Row>
			</div> : 
			<div style={{marginTop: '100px'}}>
				<Row>
					{solenoids.map((solenoid) => {
						return (
							<Col key={solenoid} style={{textAlign: 'center'}}>
								<Row>
									<Col>
										<Button color="success" onClick={() => this.solenoidHit(solenoid)}>{solenoid}</Button>
									</Col>
								</Row>
								<Row style={{marginTop: '15px'}}>
									<Col>
										<input type="number" min="0" max="10000" value={this.state.solenoidDuration[solenoid]} onChange={(e) => {const old = this.state.solenoidDuration; old[solenoid] = e.target.value; this.setState({solenoidDuration: old})}} style={{width: '70px'}} /> ms
									</Col>
								</Row>
							</Col>
						);
					})}
				</Row>
			</div>;

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
							<div className="text-right"><Badge color="danger">{type}</Badge></div>
						</Col>
						<Col>
							<div className="text-right">Last seen <Badge color="primary">{lastSeen}</Badge></div>
						</Col>
					</Row>

					{controller}

					<Row>
						<Col>
							<div style={{marginTop: '100px'}}>
								{pwmOff}
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