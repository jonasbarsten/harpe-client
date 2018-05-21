import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./Home";
import PuffSingle from "./PuffSingle";
import NotFound from "./NotFound";

export default ({ childProps }) =>
  <Switch>
    <Route path="/" exact component={Home} props={childProps} />
    <Route path="/puff/:id" exact component={PuffSingle} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;