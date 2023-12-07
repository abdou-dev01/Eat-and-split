import { useState } from "react";

const initialFriends = [
  {
    id: crypto.randomUUID(),
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: crypto.randomUUID(),
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: crypto.randomUUID(),
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handelIsOpen() {
    setIsOpen((isOpen) => !isOpen);
  }

  function selectFriend(friend) {
    setSelectedFriend((select) => (select?.id === friend.id ? null : friend));
  }

  function handelFriends(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    handelIsOpen();
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <Friends
        isOpen={isOpen}
        handelIsOpen={handelIsOpen}
        friends={friends}
        handelFriends={handelFriends}
        selectFriend={selectFriend}
        selectedFriend={selectedFriend}
      />
      {selectedFriend && (
        <FormSplitBill
          friend={friends}
          selectedFriend={selectedFriend}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function Friends({
  isOpen,
  handelIsOpen,
  friends,
  handelFriends,
  selectFriend,
  selectedFriend,
}) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  function handelName(event) {
    setName(event.target.value);
  }

  function handelImage(event) {
    setImage(event.target.value);
  }

  function addFriend(event) {
    event.preventDefault();
    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `https://i.pravatar.cc/48?u=${Date.now()}`,
      balance: 0,
    };

    handelFriends(newFriend);
    setName("");
    setImage("");
  }

  return (
    <div className="sidebar">
      <ul>
        {friends.map((friend) => (
          <FriendList
            selectFriend={selectFriend}
            friend={friend}
            key={friend.id}
            selectedFriend={selectedFriend}
          />
        ))}
      </ul>
      {isOpen && (
        <AddFriend
          name={name}
          image={image}
          onSetName={handelName}
          onSetImage={handelImage}
          onAddFriend={addFriend}
        />
      )}
      <Button onClick={handelIsOpen}>{isOpen ? "Close" : "Add friend"}</Button>
    </div>
  );
}

function FriendList({ friend, selectFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <div>
      <li className={isSelected ? "selected" : ""}>
        <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>
        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owes you ${friend.balance}
          </p>
        )}
        {friend.balance < 0 && (
          <p className="red">
            you owe {friend.name} ${friend.balance}
          </p>
        )}
        {friend.balance === 0 && <p>you and {friend.name} are even</p>}
        <Button onClick={() => selectFriend(friend)} id={friend.id}>
          {isSelected ? "Close" : "Select"}
        </Button>
      </li>
    </div>
  );
}

function AddFriend({ name, image, onSetName, onSetImage, onAddFriend }) {
  return (
    <form className="form-add-friend">
      <label>
        <span>👯‍♀️</span>Friend name
      </label>
      <input
        type="text"
        autoFocus
        value={name}
        onChange={(event) => onSetName(event)}
      />
      <label>
        <span>🏢</span> Image URL
      </label>
      <input
        type="text"
        value={image}
        onChange={(event) => onSetImage(event)}
      />
      <Button onClick={onAddFriend}>add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, handleSplitBill }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const friendExpense = bill - yourExpense;
  const [whoPay, setWhoPay] = useState("user");

  function handelSubmit(event) {
    event.preventDefault();

    if (!bill) return;
    const value = whoPay === "user" ? friendExpense : -yourExpense;
    handleSplitBill(value);
  }
  return (
    <form className="form-split-bill" onSubmit={handelSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>
        <span>💰</span>bill value
      </label>
      <input
        type="number"
        value={bill}
        onChange={(event) => setBill(event.target.value)}
        autoFocus
      />
      <label>
        <span>💲</span> your expense
      </label>
      <input
        type="number"
        value={yourExpense}
        onChange={(event) =>
          setYourExpense(
            +event.target.value > bill ? yourExpense : +event.target.value
          )
        }
      />
      <label>
        <span>💲</span> {selectedFriend.name}'s expense
      </label>
      <input type="number" value={friendExpense} disabled />
      <label>
        <span>💲</span> who is paying the bill?
      </label>
      <select
        value={whoPay}
        onChange={(event) => setWhoPay(event.target.value)}
      >
        <option value="user">You</option>
        <option value={selectedFriend.name}>{selectedFriend.name}</option>
      </select>
      <Button>add</Button>
    </form>
  );
}

function Button({ children, onClick, id }) {
  return (
    <button id={id} className="button" onClick={onClick}>
      {children}
    </button>
  );
}
