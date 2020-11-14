import React from "react";
import ElementList from "./ElementList.js";
import PropTypes from "prop-types";

function CustomList({ list }) {
  return (
    <div>
      <ul>
        {list.map((el, index) => (
          <div key={el.id}>
            <li>
              <ElementList
                id={el.id}
                parentId={el.parentId}
                name={el.name}
                children={el.children}
                notFirst={!!index}
                notLast={list.length > 1 && index !== list.length - 1}
                item={el}
              />
            </li>
            <CustomList list={el.children} />
          </div>
        ))}
      </ul>
    </div>
  );
}

CustomList.propTypes = {
  list: PropTypes.array.isRequired
};

CustomList.defaultProps = {
  list: []
};

export default CustomList;
