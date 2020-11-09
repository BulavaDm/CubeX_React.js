import React from "react";
import { store } from "../store";
import { actionTypes } from "../store/actionTypes.js";
import PropTypes from "prop-types";

class FormList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      error: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.createElement = this.createElement.bind(this);
    this.generateId = this.generateId.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  handleChange(e) {
    if (this.state.error) {
      this.setState({ error: "" });
    }

    this.setState({ text: e.target.value });
  }

  createElement(parentId) {
    if (!this.state.text) {
      this.setState({ error: "Enter at least one character" });
      return;
    }

    const id = this.generateId();

    const element = {
      id: id,
      parentId: parentId,
      name: this.state.text
    };

    store.dispatch({
      type: actionTypes.CREATE_ELEMENT,
      element: element
    });
    store.dispatch({
      type: actionTypes.LIST_TO_TREE
    });
    this.clearForm();
  }

  generateId() {
    return Date.now();
  }

  clearForm() {
    this.setState({ text: "" });
  }

  render() {
    return (
      <form className="form">
        <label>
          Element of list:
          <input
            type="text"
            value={this.state.text}
            placeholder={this.state.error}
            onChange={this.handleChange}
          />
        </label>
        <button type="button" onClick={() => this.createElement(this.props.id)}>
          ADD
        </button>
      </form>
    );
  }
}

FormList.propTypes = {
  id: PropTypes.number.isRequired
};

FormList.defaultProps = {
  id: null
};

export default FormList;
