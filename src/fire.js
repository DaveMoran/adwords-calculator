import firebase from 'firebase';
var config = {
  apiKey: "AIzaSyDp_Zq51lyBIfbkA4esoIAMSm1Ni7Qq_no",
  authDomain: "adwords-calculator.firebaseapp.com",
  databaseURL: "https://adwords-calculator.firebaseio.com",
  projectId: "adwords-calculator",
  storageBucket: "adwords-calculator.appspot.com",
  messagingSenderId: "907781281006"
}

var fire = firebase.initializeApp(config);
export default fire;