import React from 'react';
import moment from 'moment';
import { Card, Button, CardTitle, CardText, Col, Badge } from 'reactstrap';
import './PuffCard.css';

const PuffCard = (props) => {

  const id = props.puff.id;
  const ip = props.puff.ip;
  const lastSeen = moment(props.puff.lastSeen).format('HH:mm:ss');
  const monitorUrl = `http://${ip}:8888`;
  // const olaUrl = `http://${ip}:9090`;

  return (
    <Col sm="6">
      <Card body className="text-center">
        <CardTitle>ID: {id}</CardTitle>
        <CardText>Last seen <Badge color="primary">{lastSeen}</Badge></CardText>
        <CardText>IP <Badge color="success">{ip}</Badge></CardText>
        <Button style={{marginBottom: "8px"}} color="primary" onClick={() => props.childProps.history.push(`/puff/${ip}`)}>Config / test</Button>
        <Button style={{marginBottom: "8px"}} color="primary" onClick={() => window.location = monitorUrl}>System</Button>
      </Card>
    </Col>
  );
};

export default PuffCard;