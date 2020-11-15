import React, { useState } from "react";
import { store } from "../store";
import { actionTypes } from "../store/actionTypes.js";
import PropTypes from "prop-types";

function FormList({ id }) {
  const [formParams, setFormParams] = useState({ text: "", error: "" });

  function handleChange(e) {
    if (formParams.error) {
      setFormParams((prevState) => {
        return { ...prevState, error: "" };
      });
    }

    setFormParams((prevState) => {
      return { ...prevState, text: e.target.value };
    });
  }

  function createElement(parentId) {
    if (!formParams.text) {
      setFormParams((prevState) => {
        return { ...prevState, error: "Enter a least one character" };
      });
      return;
    }

    const id = generateId();

    const element = {
      id: id,
      parentId: parentId,
      name: formParams.text
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
    setFormParams((prevState) => {
      return { ...prevState, text: "" };
    });
  }

  return (
    <form className="form">
      <label>
        Element of list:
        <input
          type="text"
          value={formParams.text}
          placeholder={formParams.error}
          onChange={handleChange}
        />
      </label>
      <button type="button" onClick={() => createElement(id)}>
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
