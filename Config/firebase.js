import firebase from 'firebase'

 if (!firebase.apps.length) {
var firebaseConfig = {
    apiKey: "AIzaSyB0WslZ0HppAeKPBUcQG6SOKoKwx8AEgGE",
    authDomain: "chatapp-native.firebaseapp.com",
    databaseURL: "https://chatapp-native.firebaseio.com",
    projectId: "chatapp-native",
    storageBucket: "chatapp-native.appspot.com",
    messagingSenderId: "293767174977",
    appId: "1:293767174977:web:d27d440a86ced7ff"
  };
  firebase.initializeApp(firebaseConfig);
 }
var db = firebase.database();
var auth = firebase.auth();
var storage = firebase.storage();

export {
    auth,
    db,
    storage,
}
export default firebase;