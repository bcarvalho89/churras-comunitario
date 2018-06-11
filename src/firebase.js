import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyB7EkxuleqWaS3vZlUUpF2Gq7OPv-ktvDU',
  authDomain: 'churras-comunitario.firebaseapp.com',
  databaseURL: 'https://churras-comunitario.firebaseio.com',
  projectId: 'churras-comunitario',
  storageBucket: 'churras-comunitario.appspot.com',
  messagingSenderId: '193325398465'
};

firebase.initializeApp(config);

export default firebase;