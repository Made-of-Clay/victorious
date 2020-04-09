import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        victories: [],
    },
    mutations: {
        updateVictories(state, victories) {
            state.victories = victories;
        },
    },
    actions: {
    },
})
