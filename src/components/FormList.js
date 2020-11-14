import React, { useState } from "react";
import { store } from "../store";
import { actionTypes } from "../store/actionTypes.js";
import PropTypes from "prop-types";

function FormList(props) {
  const [state, setState] = useState({ text: "", error: "" });

  function handleChange(e) {
    if (state.error) {
      setState((prevState) => {
        return { ...prevState, error: "" };
      });
    }

    setState((prevState) => {
      return { ...prevState, text: e.target.value };
    });
  }

  function createElement(parentId) {
    if (!state.text) {
      setState((prevState) => {
        return { ...prevState, error: "Enter a least one more character" };
      });
      return;
    }

    const id = generateId();

    const element = {
      id: id,
      parentId: parentId,
      name: state.text
    };

    store.dispatch({
      type: actionTypes.CREATE_ELEMENT,
      element: element
    });
    store.dispatch({
      type: actionTypes.LIST_TO_TREE
    });
    clearForm();
  }

  function generateId() {
    return Date.now();
  }

  function clearForm() {
    setState((prevState) => {
      return { ...prevState, text: "" };
    });
  }

  return (
    <form className="form">
      <label>
        Element of list:
        <input
          type="text"
          value={state.text}
          placeholder={state.error}
          onChange={handleChange}
        />
      </label>
      <button type="button" onClick={() => createElement(props.id)}>
        ADD
      </button>
    </form>
  );
}

FormList.propTypes = {
  id: PropTypes.number.isRequired
};

FormList.defaultProps = {
  id: null
};

export default FormList;
