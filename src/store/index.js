import Vue from 'vue';
import Vuex from 'vuex';
import firebase from '../plugins/firebase';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        victories: [],
        selected: 0,
        authenticatedUser: '',
        authorizedUsers: [],
    },
    getters: {
        players: state => state.victories.reduce((players, victory) => {
            victory.players.forEach(player => {
                if (!players.includes(player)) {
                    players.push(player);
                }
            });
            return players;
        }, []),
        games: state => state.victories.reduce((games, victory) => {
            if (!games.includes(victory.game)) {
                games.push(victory.game);
            }
            return games.sort();
        }, []),
        userIsAuthorized: state => state.authorizedUsers.includes(state.authenticatedUser),
    },
    mutations: {
        updateVictories(state, victories) {
            state.victories = victories;
        },
        updateSelected(state, selected) {
            state.selected = selected;
        },
        setAuthUser(state, email = '') {
            state.authenticatedUser = email;
        },
        setAuthorized(state, authorizedUsers) {
            if (Array.isArray(authorizedUsers) && authorizedUsers.length) {
                state.authorizedUsers = authorizedUsers;
            }
        },
    },
    actions: {
        getAuthorizedUsers({commit}) {
            firebase.db.collection('users').onSnapshot(querySnapshot => {
                const users = querySnapshot.docs.map(doc => doc.data().email);
                commit('setAuthorized', users);
            });
        },
        getVictories({commit}) {
            firebase.db.collection('victories').onSnapshot(querySnapshot => {
                let docs = [];
                querySnapshot.forEach(doc => {
                    docs.push(Object.assign({ id: doc.id }, doc.data()))
                });
                docs.sort((a, b) => {
                    if (a.date < b.date) return -1;
                    if (a.date === b.date) return 0;
                    if (a.date > b.date) return 1;
                }); // sorts by date asc
                commit('updateVictories', docs);
            });
        },
        popupAuth({commit}) {
            firebase.popupAuth()
                .then(result => {
                    if (result && result.user) {
                        const {email} = result.user;
                        if (email) {
                            commit('setAuthUser', email);
                        }
                    }
                })
                .catch(thrown => console.error('Firebase Auth Error >> ', thrown))
            ;
        },
    },
});
