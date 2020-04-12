import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

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
                if (!players.includes(player.name)) {
                    players.push(player.name);
                }
            });
            return players;
        }, []),
        games: state => state.victories.reduce((games, victory) => {
            if (!games.includes(victory.game)) {
                games.push(victory.game);
            }
            return games;
        }, []),
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
            state.authorizedUsers = authorizedUsers;
        },
    },
    actions: {
    },
});
