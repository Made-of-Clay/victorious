<template>
    <v-app>
        <img :src="crown" alt="" class="app__bgCrown" />
        <v-app-bar
            app dark
            color="primary"
            :hide-on-scroll="$vuetify.breakpoint.xsOnly"
        >
            <AppNav component="v-tabs" />
        </v-app-bar>

        <v-content :class="$vuetify.breakpoint.xsOnly ? 'pb-6' : ''">
            <component :is="selectedComponent" />
        </v-content>

        <AppNav v-if="showBottomNav" component="v-bottom-navigation" />
    </v-app>
</template>

<script>
import AppNav from './components/AppNav';
import History from './components/History';
import Stats from './components/Stats';
import crown from './assets/crown.svg';

export default {
    name: 'App',

    components: {
        AppNav,
        History,
        Stats,
    },

    inject: [
        'firebase',
    ],

    data: () => ({
        crown,
    }),
    computed: {
        showBottomNav: vm => vm.$vuetify.breakpoint.xsOnly,
        selectedComponent: vm => vm.$store.state.selected === 0 ? 'History' : 'Stats',
    },

    mounted() {
        this.$store.dispatch('getVictories');
    },

    methods: {
        // getVictories() {
        //     this.firebase.getVictories(victories => {
        //         this.$store.commit('updateVictories', victories);
        //     });
        // },
    },
};
</script>

<style>
.app__bgCrown {
    filter: grayscale(1);
    opacity: 0.2;
    position: fixed;
    top: 0;
    width: 100%;
}
</style>