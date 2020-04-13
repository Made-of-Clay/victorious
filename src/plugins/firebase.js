// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from 'firebase/app';

// Add the Firebase services that you want to use
import 'firebase/auth';
import 'firebase/firestore';

/* const fbApp =  */firebase.initializeApp({
    apiKey: 'AIzaSyBAqTed5sSoQGflprtOFFgUrNZGIL0Gct0',
    authDomain: 'victorious-f35d3.firebaseapp.com',
    databaseURL: 'https://victorious-f35d3.firebaseio.com',
    projectId: 'victorious-f35d3',
    storageBucket: 'victorious-f35d3.appspot.com',
    messagingSenderId: '890675602817',
    appId: '1:890675602817:web:e31469a26058f5b5577480'
});
const provider = new firebase.auth.GoogleAuthProvider(); // https://firebase.google.com/docs/auth/web/google-signin#handle_the_sign-in_flow_with_the_firebase_sdk

const firebasePlugin = {
    // app: fbApp, // not used?
    db: firebase.firestore(),
    get victories() {
        return this.db.collection('victories');
    },

    popupAuth: () => firebase.auth().signInWithPopup(provider),

    /**
     * Set victory to Firebase (add/update?) - schema is as follows
     * @param Object data Victory data
     * @property mixed   id  Firebase-generated id for updates (undefined for new records)
     * @property String  date  Date of victory
     * @property String  game  Game of victory
     * @property String  note  Optional note about victory
     * @property mixed   player  Victorious player(s) - Array | String
     * @property Boolean victorious  Was the game victorious (for group games)
     */
    addVictory(data) {
        return this.victories.doc().set(data);
    },
    updateVictory(data) {
        return this.victories.doc(data.id).update(data);
    },

    /**
     * Remove record from Firebase
     * @param {string} id Firebase-generated id of record to remove
     * @returns void
     */
    removeVictory(id) {
        this.victories.doc(id).delete();
    },
};

export default firebasePlugin;