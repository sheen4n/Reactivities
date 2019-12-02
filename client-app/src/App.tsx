import React, { Component } from "react";
import { Header, Icon, List } from "semantic-ui-react";
import "./App.css";
import axios from "axios";

class App extends Component {
  state = {
    values: []
  };

  async componentDidMount() {
    let response = await axios.get("http://localhost:5000/api/values");
    let values = response.data;

    this.setState({ values });
  }

  render() {
    return (
      <div>
        <Header as="h2">
          <Icon name="plug" />
          <Header.Content>Reactivities</Header.Content>
        </Header>
        <List>
          {this.state.values.map((value: any) => (
            <List.Item key={value.id}>{value.name}</List.Item>
          ))}
        </List>
      </div>
    );
  }
}

export default App;
