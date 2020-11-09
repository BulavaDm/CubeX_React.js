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
      return { ...state, list: [...state.list, action.element] };
    case actionTypes.REPLACE_ELEMENTS:
      const stateForReplace = { ...state };
      const list = [...stateForReplace.list];
      const [index, targetIndex] = action.elementsIdToReplace;

      [list[index], list[targetIndex]] = [list[targetIndex], list[index]];

      return { ...stateForReplace, list };
    case actionTypes.REMOVE_ELEMENTS:
      const idsForRemove = {};

      action.elementsId.forEach((id) => {
        idsForRemove[id] = true;
      });

      return {
        ...state,
        list: state.list.filter((item) => !idsForRemove[item.id])
      };
    default:
      return state;
  }
}

export const store = createStore(reducer, initialState);
