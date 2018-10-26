import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyDIOOPn3GUZWFoxwMlUj49f17bjCSv_Rz8",
  authDomain: "react-slack-clone-8833e.firebaseapp.com",
  databaseURL: "https://react-slack-clone-8833e.firebaseio.com",
  projectId: "react-slack-clone-8833e",
  storageBucket: "react-slack-clone-8833e.appspot.com",
  messagingSenderId: "841708468243"
};

firebase.initializeApp( config );

export default firebase;