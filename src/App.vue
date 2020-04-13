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

        <!-- <v-btn fab fixed bottom left @click="importVictories">
            <v-icon>mdi-import</v-icon>
        </v-btn> -->

        <!-- TODO reconsider if this is necessary... leave for now -->
        <!-- <AppNav v-if="showBottomNav" component="v-bottom-navigation" /> -->
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
        // importVictories() {
        //     import('./victory-data.json')
        //         .then(data => data.default)
        //         .then(json => {
        //             const batch = this.firebase.db.batch();
        //             json.forEach(v => {
        //                 batch.set(this.firebase.victories.doc(), v);
        //             })
        //             batch.commit().then(result => {
        //                 console.log('batch commit result:', result);
        //             })
        //         })
        //         .catch(console.error)
        //     ;
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