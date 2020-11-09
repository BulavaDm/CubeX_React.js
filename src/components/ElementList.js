import React from "react";
import FormList from "./FormList.js";
import { store } from "../store";
import { actionTypes } from "../store/actionTypes.js";
import PropTypes from "prop-types";

class ElementList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false
    };

    this.showInputForm = this.showInputForm.bind(this);
    this.hideInputForm = this.hideInputForm.bind(this);
    this.removeElements = this.removeElements.bind(this);
    this.findChildren = this.findChildren.bind(this);
    this.replaceElements = this.replaceElements.bind(this);
    this.movingUpElement = this.movingUpElement.bind(this);
    this.movingDownElement = this.movingDownElement.bind(this);
  }

  showInputForm() {
    this.setState({ showForm: true });
  }

  hideInputForm() {
    this.setState({ showForm: false });
  }

  removeElements(item, isSubList) {
    const childrenId = [];

    this.findChildren(item.children, childrenId);

    if (!isSubList) {
      childrenId.push(item.id);
    }

    this.hideInputForm();

    store.dispatch({
      type: actionTypes.REMOVE_ELEMENTS,
      elementsId: childrenId
    });
    store.dispatch({
      type: actionTypes.LIST_TO_TREE
    });

    childrenId.length = 0;
  }

  findChildren(children, childrenId) {
    children.forEach((item) => {
      childrenId.push(item.id);

      if (item.children.length) {
        this.findChildren(item.children, childrenId);
      }
    });
  }

  replaceElements(id, direction) {
    const list = store.getState().list;
    const index = list.findIndex((item) => item.id === id);

    switch (direction) {
      case "up":
        this.movingUpElement(index, list);
        break;
      case "down":
        this.movingDownElement(index, list);
        break;
      default:
        break;
    }
  }

  movingUpElement(index, list) {
    for (let i = index - 1; i > -1; i--) {
      if (list[i].parentId === this.props.parentId) {
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

  movingDownElement(index, list) {
    for (let i = index + 1; i < list.length; i++) {
      if (list[i].parentId === this.props.parentId) {
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

  render() {
    return (
      <div className="element">
        {this.props.parentId ? (
          <div>
            <div>
              <div className="element__item">{this.props.name}</div>
            </div>
            {this.props.notFirst ? (
              <button
                type="button"
                onClick={() => this.replaceElements(this.props.id, "up")}
              >
                UP
              </button>
            ) : null}
            {this.props.notLast ? (
              <button
                type="button"
                onClick={() => this.replaceElements(this.props.id, "down")}
              >
                DOWN
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => this.removeElements(this.props.item, false)}
            >
              REMOVE
            </button>
            {this.props.children.length || this.state.showForm ? (
              <button
                type="button"
                onClick={() => this.removeElements(this.props.item, true)}
              >
                REMOVE SUBLIST
              </button>
            ) : null}
            {!this.state.showForm ? (
              <button type="button" onClick={this.showInputForm}>
                ADD SUBLIST
              </button>
            ) : null}
          </div>
        ) : null}
        {!this.props.parentId || this.state.showForm ? (
          <FormList id={this.props.id} />
        ) : null}
      </div>
    );
  }
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
