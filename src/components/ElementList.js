import React, { useState } from "react";
import FormList from "./FormList.js";
import { store } from "../store";
import { actionTypes } from "../store/actionTypes.js";
import PropTypes from "prop-types";

function ElementList(props) {
  const [showForm, setShowForm] = useState(false);

  function showInputForm() {
    setShowForm(true);
  }

  function hideInputForm() {
    setShowForm(false);
  }

  function removeElements(item, isSubList) {
    const childrenId = [];

    findChildren(item.children, childrenId);

    if (!isSubList) {
      childrenId.push(item.id);
    }

    hideInputForm();

    store.dispatch({
      type: actionTypes.REMOVE_ELEMENTS,
      elementsId: childrenId
    });
    store.dispatch({
      type: actionTypes.LIST_TO_TREE
    });

    childrenId.length = 0;
  }

  function findChildren(children, childrenId) {
    children.forEach((item) => {
      childrenId.push(item.id);

      if (item.children.length) {
        this.findChildren(item.children, childrenId);
      }
    });
  }

  function replaceElements(id, direction) {
    const list = store.getState().list;
    const index = list.findIndex((item) => item.id === id);

    switch (direction) {
      case "up":
        movingUpElement(index, list);
        break;
      case "down":
        movingDownElement(index, list);
        break;
      default:
        break;
    }
  }

  function movingUpElement(index, list) {
    for (let i = index - 1; i > -1; i--) {
      if (list[i].parentId === props.parentId) {
        store.dispatch({
          type: actionTypes.REPLACE_ELEMENTS,
          elementsIdToReplace: [index, i]
        });
        store.dispatch({
          type: actionTypes.LIST_TO_TREE
        });
        break;
      }
    }
  }

  function movingDownElement(index, list) {
    for (let i = index + 1; i < list.length; i++) {
      if (list[i].parentId === props.parentId) {
        store.dispatch({
          type: actionTypes.REPLACE_ELEMENTS,
          elementsIdToReplace: [index, i]
        });
        store.dispatch({
          type: actionTypes.LIST_TO_TREE
        });
        break;
      }
    }
  }

  return (
    <div className="element">
      {props.parentId ? (
        <div>
          <div>
            <div className="element__item">{props.name}</div>
          </div>
          {props.notFirst ? (
            <button
              type="button"
              onClick={() => replaceElements(props.id, "up")}
            >
              UP
            </button>
          ) : null}
          {props.notLast ? (
            <button
              type="button"
              onClick={() => replaceElements(props.id, "down")}
            >
              DOWN
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => removeElements(props.item, false)}
          >
            REMOVE
          </button>
          {props.children.length || showForm ? (
            <button
              type="button"
              onClick={() => removeElements(props.item, true)}
            >
              REMOVE SUBLIST
            </button>
          ) : null}
          {!showForm ? (
            <button type="button" onClick={showInputForm}>
              ADD SUBLIST
            </button>
          ) : null}
        </div>
      ) : null}
      {!props.parentId || showForm ? <FormList id={props.id} /> : null}
    </div>
  );
}

ElementList.propTypes = {
  id: PropTypes.number.isRequired,
  parentId: PropTypes.number,
  name: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
  notFirst: PropTypes.bool.isRequired,
  notLast: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired
};

ElementList.defaultProps = {
  id: null,
  parentId: null,
  name: "",
  children: [],
  notFirst: false,
  notLast: false,
  item: {}
};

export default ElementList;
