import React from "react"

const Button = ({ children, onClick }) => {
  return <button className="button" onClick={onClick}>{children}</button>
}

export default function App() {
  const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
  ]
  
  const [friends, setFriends] = React.useState(initialFriends)
  const [showAddFriend, setShowAddFriend] = React.useState(false);
  const [selectedFriend, setSelectedFriend] = React.useState(null);

  const handleFriend = () => {
    setShowAddFriend(preV => !preV)
  }

  const handleAddFriend = (friend) => {
    setFriends(friends => [...friends, friend])
    setShowAddFriend(false)
  }

  const handleSelection = (friend) => {
    setSelectedFriend(preV => preV?.id === friend.id ? null : friend)
    setShowAddFriend(false)
  }

  const handleSplitBill = (value) => {

    setFriends(friends => friends.map((friend) => friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend))
    
    setSelectedFriend(null)
  }

  return (
    <div className="app">
      <div className="sidebar">

        <FriendList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend} />

        {showAddFriend && <FormAddFriend addFriend={handleAddFriend} />} 

        <Button onClick={handleFriend}>{showAddFriend ? "Close": "Add Friend"}</Button>
      </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} handleSplitBill={handleSplitBill} />}
    </div>
  )
}

const FriendList = ({friends, onSelection, selectedFriend}) => {
  return  <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelection={onSelection}
          selectedFriend={selectedFriend} />
      ))}
    </ul>
}

const Friend = ({ friend, onSelection, selectedFriend }) => {
  const isSelected = selectedFriend?.id === friend.id;
  return (
      <li className={isSelected ? "selected": null}>
        <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      
      {friend.balance < 0 && (<p className='red'>You owe {friend.name} Rs.{Math.abs(friend.balance)}</p>)}

      {friend.balance > 0 && (<p className='green'>{friend.name} owes you Rs.{Math.abs(friend.balance)}</p>)}

      {friend.balance === 0 && (<p >You and  {friend.name} are even.</p>)}

      <Button onClick={() => onSelection(friend)}>{isSelected ? "Close": "Select"}</Button>
      </li>
  )
}

const FormAddFriend = ({ addFriend }) => {
  const [name, setName] = React.useState('')
  const [image, setImage] = React.useState('https://i.pravatar.cc/48')

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID()
    const newFriend = {
      id: id,
      name,
      image: `${image}?=${id}`,
      balance: 0
    };

    addFriend(newFriend)

    setName('')
    setImage('https://i.pravatar.cc/48')
  }

  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label>👯 Friend name</label>
      <input type="text" value={name} onChange={e=>setName(e.target.value)} />

      <label>🌄 Image URL</label>
      <input type="text" value={image} onChange={e=>setImage(e.target.value)} />

      <Button>Add</Button>
    </form>
  )
}

const FormSplitBill = ({ selectedFriend, handleSplitBill}) => {
  const [bill, setBill] = React.useState('');
  const [paidByUser, setPaidByUser] = React.useState('')
  const paidByFriend = bill ? bill - paidByUser : ""
  const [payer, setPayer] = React.useState('user')

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    handleSplitBill(payer === 'user' ? paidByFriend : -paidByUser)
  }
  
  return <form className='form-split-bill' onSubmit={handleSubmit}>
    <h2>Split Bill with {selectedFriend.name}</h2>

    <label>💰 Bill Value</label>
    <input type="text" value={bill} onChange={e=>setBill(Number(e.target.value))} />

    <label>🙋🏻‍♂️ Your expense</label>
      <input type="text" value={paidByUser} onChange={e=>setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))}/>

    <label>👬 {selectedFriend.name}'s expense</label>
    <input type="text" disabled value={paidByFriend} />
    
    <label>🤑 Who is Paying the Bill?</label>
    <select value={payer} onChange={e=>setPayer(e.target.value)}>
      <option value='user'>You</option>
      <option value='friend'>friend</option>
    </select>
    
    <Button>Split Bill</Button>
  </form>
}