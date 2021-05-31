import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyD-c35iWv6DMdWoa4dRbeX4ztN0JXuO4ag",
  authDomain: "firestore-d46ac.firebaseapp.com",
  projectId: "firestore-d46ac",
  storageBucket: "firestore-d46ac.appspot.com",
  messagingSenderId: "113636937926",
  appId: "1:113636937926:web:9ca3b0c082b1822c8c47c7",
  measurementId: "G-J0LF8YZ41B",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header></header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle}>Sign in With Google</button>;
}

// function SignOut() {
//   return (
//     auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
//   );
// }

function ChatRoom() {

  const dummy = useRef()

  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({behavior: 'smooth'})
  }

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}>

        </div>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e)=>setFormValue(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt='User' />
      <p>{text}</p>
    </div>
  );
}

export default App;
