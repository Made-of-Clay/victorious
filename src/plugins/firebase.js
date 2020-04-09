// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";

const fbApp = firebase.initializeApp({
    apiKey: "AIzaSyBAqTed5sSoQGflprtOFFgUrNZGIL0Gct0",
    authDomain: "victorious-f35d3.firebaseapp.com",
    databaseURL: "https://victorious-f35d3.firebaseio.com",
    projectId: "victorious-f35d3",
    storageBucket: "victorious-f35d3.appspot.com",
    messagingSenderId: "890675602817",
    appId: "1:890675602817:web:e31469a26058f5b5577480"
});

const clone = obj => JSON.parse(JSON.stringify(obj));

const firebasePlugin = {
    app: fbApp,
    db: firebase.firestore(),

    getVictories(saveFunc) {
        this.unsubscribeGames = this.db.collection('victories')
            .onSnapshot(querySnapshot => {
                let docs = [];
                querySnapshot.forEach(doc => {
                    docs.push(Object.assign({ id: doc.id }, doc.data()))
                });
                saveFunc(docs);
            });
    },
    /**
     * Add victory to Firebase - schema is as follows
     * @param Object data Victory data
     * @property String  date  Date of victory
     * @property String  game  Game of victory
     * @property String  note  Optional note about victory
     * @property mixed   player  Victorious player(s) - Array | String
     * @property Boolean victorious  Was the game victorious (for group games)
     */
    addVictory(data) {
        const dataClone = clone(data);
        if (!Array.isArray(dataClone.player)) {
            dataClone.player = [dataClone.player];
        }

        return this.db.collection('victories').doc().set(dataClone)
            .catch(thrown => {
                console.error("Error adding victory: ", thrown);
                throw thrown; // so I can tell the user
            })
        ;
    },

    removeVictory(id) {
        return this.db.collection('victories').doc(id).delete();
    },

    updateVictory(data) {
        console.log("updateVictory > data", data);
    },
};

// firebasePlugin.db.sett;

export default firebasePlugin;