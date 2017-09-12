import firebase from 'firebase'

  const config = {
    apiKey: "AIzaSyDwuwvqbnjFpxEDEGFaQgvnRIKTlyQlbDg",
    authDomain: "idea-board-a7a87.firebaseapp.com",
    databaseURL: "https://idea-board-a7a87.firebaseio.com",
    projectId: "idea-board-a7a87",
    storageBucket: "",
    messagingSenderId: "759290521804"
  };
  firebase.initializeApp(config);
  export const provider = new firebase.auth.GoogleAuthProvider();
  export const auth = firebase.auth();
  export default firebase;