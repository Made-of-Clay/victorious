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
            <pre v-html="$store.state.victories" />
            <HelloWorld/>
        </v-content>

        <AppNav v-if="showBottomNav" component="v-bottom-navigation" />
    </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import AppNav from './components/AppNav';
import crown from './assets/crown.svg';

export default {
    name: 'App',

    components: {
        HelloWorld,
        AppNav,
    },

    inject: [
        'firebase',
    ],

    data: () => ({
        crown,
    }),
    computed: {
        showBottomNav: vm => vm.$vuetify.breakpoint.xsOnly,
    },

    mounted() {
        this.getVictories();
    },

    methods: {
        getVictories() {
            this.firebase.getVictories(victories => {
                this.$store.commit('updateVictories', victories);
            });
        },
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