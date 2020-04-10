import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        victories: [],
        selected: 0,
    },
    mutations: {
        updateVictories(state, victories) {
            state.victories = victories;
        },
        updateSelected(state, selected) {
            state.selected = selected;
        },
    },
    actions: {
    },
})
