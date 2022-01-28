import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
    let list = localStorage.getItem("list");
    if (list) {
        return JSON.parse(localStorage.getItem("list"));
    } else {
        return [];
    }
};
function App() {
    const [name, setName] = useState("");
    const [list, setList] = useState(getLocalStorage());
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [alert, setAlert] = useState({
        show: false,
        msg: "",
        type: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            if (!name) {
                // display alert
                showAlert(true, "please enter value", "danger");
            } else if (name && isEdit) {
                // deal with edit
                setList(
                    list.map((item) => {
                        if (item.id === editId) {
                            return { ...item, title: name };
                        }
                        return item;
                    })
                );
                setName("");
                setEditId(null);
                setIsEdit(false);
                showAlert(true, "success", "Value is changed");
            } else {
                // show alert
                showAlert(true, "success", "Value added to the list");
                const newItem = {
                    id: new Date().getTime().toString(),
                    title: name,
                };
                setList([...list, newItem]);
                setName("");
            }
        } catch (error) {}
    };
    const showAlert = (show = false, type = "", msg = "") => {
        setAlert({ show, type, msg });
    };
    const clearList = () => {
        showAlert(true, "danger", "The list is deleted");
        setList([]);
    };
    const removeItem = (id) => {
        showAlert(true, "danger", "This value was deleted");
        let newItem = list.filter((item) => item.id !== id);
        setList(newItem);
    };
    const editItem = (id) => {
        let specificItem = list.find((item) => item.id === id);
        setIsEdit(true);
        setEditId(id);
        setName(specificItem.title);
    };
    useEffect(() => {
        localStorage.setItem("list", JSON.stringify(list));
    }, [list]);

    return (
        <section className="section-center">
            <form className="grocery-form" onSubmit={handleSubmit}>
                {alert.show && (
                    <Alert {...alert} removeAlert={showAlert} list={list} />
                )}
                <h3>Todo App in React</h3>
                <div className="form-control">
                    <input
                        type={"text"}
                        className="grocery"
                        placeholder="enter the value"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button type="submit" className="submit-btn">
                        {isEdit ? "Edit" : "Add"}
                    </button>
                </div>
            </form>
            {list.length > 0 && (
                <div className="grocery-container">
                    <List
                        items={list}
                        removeItem={removeItem}
                        editItem={editItem}
                    />
                    <button className="clear-btn" onClick={clearList}>
                        Clear items
                    </button>
                </div>
            )}
        </section>
    );
}

export default App;
