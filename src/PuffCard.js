import React from 'react';
import moment from 'moment';
import { Card, Button, CardTitle, CardText, Col, Badge } from 'reactstrap';
import './PuffCard.css';

const PuffCard = (props) => {

  const ip = props.puff.ip;
  const lastSeen = moment(props.puff.lastSeen).format('HH:mm:ss');

  return (
    <Col sm="6">
      <Card body className="text-center">
        <CardTitle>{ip}</CardTitle>
        <CardText>Last seen <Badge color="primary">{lastSeen}</Badge></CardText>
        <Button onClick={() => props.childProps.history.push(`/puff/${ip}`)}>Go to puff</Button>
      </Card>
    </Col>
  );
};

export default PuffCard;