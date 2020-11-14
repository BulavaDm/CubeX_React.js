import React, { useState, useEffect } from "react";
import "./styles.css";
import CustomList from "./components/CustomList.js";
import { store } from "./store";
import { actionTypes } from "./store/actionTypes.js";

function App() {
  const [list, setList] = useState([]);

  useEffect(() => {
    store.dispatch({ type: actionTypes.LIST_TO_TREE });
    setList(store.getState().recursiveList);

    const unsubscribe = store.subscribe(() => {
      setList(store.getState().recursiveList);
    });

    return unsubscribe;
  }, []);

  return (
    <div>
      <CustomList list={list} />
    </div>
  );
}

export default App;
