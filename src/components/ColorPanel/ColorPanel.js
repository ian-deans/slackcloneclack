import React from "react";
import { Sidebar, Menu, Divider, Button } from "semantic-ui-react";

export default class ColorPanel extends React.Component {
  render() {
    return (
      <Sidebar
        as={ Menu }
        icon="labeled"
        inverted
        visibile="true"
        vertical
        width="very thin"
      >
        <Divider />
        <Button icon="add" size="small" color="blue" />
      </Sidebar>
    );
  }
}
