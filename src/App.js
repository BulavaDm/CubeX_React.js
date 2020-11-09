import React from "react";
import "./styles.css";
import CustomList from "./components/CustomList.js";
import { store } from "./store";
import { actionTypes } from "./store/actionTypes.js";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recursiveList: []
    };

    store.subscribe(() => {
      this.setState({
        recursiveList: store.getState().recursiveList
      });
    });
  }

  componentDidMount() {
    store.dispatch({ type: actionTypes.LIST_TO_TREE });
  }

  render() {
    return (
      <div>
        <CustomList list={this.state.recursiveList} />
      </div>
    );
  }
}

export default App;
