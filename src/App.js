import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
const DataFromLocal = window.localStorage.getItem('ItemAdded');

const getFromLocalStorage = (newItem) => {
  if (DataFromLocal) {
    JSON.parse(DataFromLocal);
    console.log(DataFromLocal);
  }
  else {
    return newItem;
  }
} 
// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

const toDoItems = [
  {
    key: uuidv4(),
    label: "Have fun",
    important: false,
  },
  {
    key: uuidv4(),
    label: "Spread Empathy",
    important: false,
  },
  {
    key: uuidv4(),
    label: "Generate Value",
    important: false,
  },
];


// helpful links:
// useState crash => https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/
function App() {

  getFromLocalStorage();
  const [itemToAdd, setItemToAdd] = useState("");
  //arrow declaration => expensive computation ex: API calls
  const [items, setItems] = useState(JSON.parse(localStorage.getItem('itemAdded')) || []);

  const [filterType, setFilterType] = useState("");

  const [changeInput, setChangeInput] = useState("");

  const [searchedValue, setSearchedValue] = useState("");

  // const giveEventTarget = (event) => console.log(event);

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleChangeInput = (event) => {
    setChangeInput(event.target.value);
  };

  const handleAddItem = () => {
    // mutating !WRONG!
    // const oldItems = items;
    // oldItems.push({ label: itemToAdd, key: uuidv4() });
    // setItems(oldItems);

    // not mutating !CORRECT!
    const newItem = { label: itemToAdd, key: uuidv4()};
    // const getItemFromLocalStorage = () => {
    //   window.localStorage.getItem('itemAdded');
    // }
    setItems((prevItems) => [newItem, ...prevItems]
    );

    
    setItemToAdd("");
    
  };

  useEffect(() => {
    window.localStorage.setItem('itemAdded',JSON.stringify(items));
  }, [items])

  const handleItemDone = ({ key }) => {
    //first way
    // const itemIndex = items.findIndex((item) => item.key === key);
    // const oldItem = items[itemIndex];
    // const newItem = { ...oldItem, done: !oldItem.done };
    // const leftSideOfAnArray = items.slice(0, itemIndex);
    // const rightSideOfAnArray = items.slice(itemIndex + 1, items.length);
    // setItems([...leftSideOfAnArray, newItem, ...rightSideOfAnArray]);

    //  second way
    // const changedItem = items.map((item) => {
    //   if (item.key === key) {
    //     return { ...item, done: item.done ? false : true };
    //   } else return item;
    // });




    //second way updated
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;

      })
    );
  };
  // const handleDeletedItems = setItems((prevItems)=>{
  //   prevItems.map(item=>item.key===)
  // })
  const handleFilterItems = (type) => {
    setFilterType(type);
  };

  const searchedItems = (e) => {
    setSearchedValue(e.target.value);
  };
// Deleting Items ////
/////////////////////////
  const deleteItems = (item, key) => {
    setItems((prevItems)=>prevItems.filter(item=>{if(item.key!==key) {
      return item}
      
    }))
    window.localStorage.setItem('item',JSON.stringify(item));
  }

  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;

  const searchedFilteredItems = items.filter((item) =>
    item.label.includes(searchedValue)
  );

  const filteredItems =
    !filterType || filterType === "all"
      ? searchedFilteredItems
      : filterType === "active"
      ? searchedFilteredItems.filter((item) => !item.done)
      : searchedFilteredItems.filter((item) => item.done);

      
  return (
    // Below is toDo HEADER//
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {amountLeft} more to do, {amountDone} done
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={searchedItems}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {/*  Filter by input text */}

      {/* List-group */}
      {/* <ul>
        {items.map((item) => {
          return (
            <button>
              <div
                onClick={() => {
                  console.log(item);

                }}
              >
                {item.label}
              </div>
            </button>
          );
        })}
      </ul> */}
      <ul className="list-group todo-list">
        {filteredItems.length > 0 &&
          filteredItems.map((item) => (
            <li key={item.key} className="list-group-item">
              <span
                className={`todo-list-item${item.done ? " done" : ""} ${
                  item.important ? "important" : ""
                }`}
              >
                <span
                  className="todo-list-item-label"
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                  onClick={() => {
                    setItems(
                      items.map((itemInsideMap) => {
                        if (item.key === itemInsideMap.key) {
                          return {
                            label: itemInsideMap.label,
                            important: !itemInsideMap.important,
                            key: itemInsideMap.key,
                          };
                        }
                        return itemInsideMap;
                      })
                    );
                  }}
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick = {()=>{deleteItems(item, item.key)}}>
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
