import { createStore } from "redux";
import { actionTypes } from "./actionTypes.js";

const initialState = {
  list: [
    {
      parentId: null,
      id: 1,
      name: "root"
    }
  ],
  recursiveList: []
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LIST_TO_TREE:
      const nextState = JSON.parse(JSON.stringify(state));
      nextState.recursiveList = [];
      const map = {};

      nextState.list.forEach((item, index) => {
        map[item.id] = index;
        item.children = [];
      });

      nextState.list.forEach((item, _, array) => {
        if (item.parentId !== null) {
          array[map[item.parentId]].children.push(item);
        } else {
          nextState.recursiveList.push(item);
        }
      });

      return nextState;
    case actionTypes.CREATE_ELEMENT:
      const stateForCreate = JSON.parse(JSON.stringify(state));
      stateForCreate.list.push(action.element);

      return stateForCreate;
    case actionTypes.REPLACE_ELEMENTS:
      const stateForReplace = JSON.parse(JSON.stringify(state));
      const list = stateForReplace.list;
      const [index, targetIndex] = action.elementsIdToReplace;

      [list[index], list[targetIndex]] = [list[targetIndex], list[index]];

      return stateForReplace;
    case actionTypes.REMOVE_ELEMENTS:
      const stateForRemove = JSON.parse(JSON.stringify(state));

      action.elementsId.forEach((id) => {
        const index = stateForRemove.list.findIndex((item) => {
          return id === item.id;
        });

        stateForRemove.list.splice(index, 1);
      });

      return stateForRemove;
    default:
      return state;
  }
}

export const store = createStore(reducer, initialState);
