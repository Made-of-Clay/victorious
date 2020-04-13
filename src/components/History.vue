<template>
    <v-container tag="article" style="position:relative">
        <h1 :class="isSmallScreen ? '' : 'text-center'">History of Victory</h1>

        <!-- if bottom nav is kept, put mb-12 on this push it above the bottom nav - looks a little weird though... -->
        <v-btn
            v-if="!$store.getters.userIsAuthorized"
            fab fixed bottom right
            @click="$store.dispatch('popupAuth')"
        >
            <v-icon>mdi-key</v-icon>
        </v-btn>

        <v-timeline :dense="isSmallScreen">
            <v-timeline-item>
                <template v-slot:icon>
                    <v-tooltip bottom>
                        <template v-slot:activator="{on}">
                            <v-btn
                                fab
                                color="primary"
                                @click.stop="formShowing = true"
                                v-on="on"
                            >
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </template>
                        Add Victory&hellip;
                    </v-tooltip>
                </template>
            </v-timeline-item>
            <v-timeline-item
                v-for="v in sortedVictories"
                :key="v.id"
                color="secondary"
                small
            >
                <template v-slot:opposite>
                    <span class="title">{{v.date | formatDate}}</span>
                </template>
                <v-card max-width="500">
                    <v-card-title class="headline">
                        <span>
                            {{v.game}} -
                            <b class="primary--text">
                                <template v-if="v.teamVictory">
                                    Team Victory! 🎉
                                </template>
                                <template v-else-if="teamLoss(v)">
                                    Team Loss ☹️
                                </template>
                                <template v-else>
                                    {{getWinner(v.players).name}}
                                </template>
                            </b>
                        </span>
                        <v-spacer />
                        <small v-if="isSmallScreen">{{v.date | formatDate}}</small>
                    </v-card-title>
                    <v-row dense class="pl-4">
                        <v-col cols="12" md="6">
                            <div
                                v-for="player in v.players"
                                :key="`${v.id}-${player.name}`"
                                class="mb-1"
                            >
                                <span :class="playerIsWinner(player, v) ? 'primary--text' : ''">
                                    {{player.name}}
                                </span>
                                <v-icon
                                    v-if="playerIsWinner(player, v)"
                                    color="primary"
                                    class="ml-2"
                                    v-text="'mdi-star'"
                                />
                            </div>
                        </v-col>
                        <v-col cols="12" md="6">
                            <template v-if="v.notes">
                                Notes
                                <pre class="ma-0 body-2 grey--text lighten-1" v-text="`${v.notes}`" />
                            </template>
                        </v-col>
                    </v-row>
                    <v-card-actions v-if="$store.getters.userIsAuthorized">
                        <v-spacer />
                        <v-btn text small color="error" @click="deleteVictoryPrompt = v">
                            <v-icon small>mdi-delete</v-icon>
                            Delete
                        </v-btn>
                        <v-btn text small color="accent" @click="editVictory(v)">
                            <v-icon small>mdi-pencil</v-icon>
                            Edit
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-timeline-item>
        </v-timeline>

        <VictoryForm :showing.sync="formShowing" :victory.sync="editingVictory" />

        <RmVictoryConfirm :victory.sync="deleteVictoryPrompt" />
    </v-container>
</template>

<script>
import VictoryForm from './VictoryForm';
import RmVictoryConfirm from './RmVictoryConfirm';
import formatDate from '../formatDate.filter.js';

export default {
    components: {
        VictoryForm,
        RmVictoryConfirm,
    },

    inject: [
        'firebase',
    ],
    filters: {
        formatDate,
    },

    data: () => ({
        formShowing: false,
        deleteVictoryPrompt: {},
        editingVictory: {},
    }),
    computed: {
        isSmallScreen: vm => vm.$vuetify.breakpoint.smAndDown,
        sortedVictories: vm => vm.$store.state.victories.sort((a, b) => {
            if (a.date < b.date) return -1;
            if (a.date === b.date) return 0;
            if (a.date > b.date) return 1;
        }).reverse(),
    },

    methods: {
        getWinner(players = []) {
            return players.reduce((winner, player) => {
                if (player.points > winner.points) {
                    winner = player;
                }
                return winner;
            }, {points:0});
        },

        getPointColor(player, players) {
            const winner = this.getWinner(players);
            const color = player.name === winner.name ? 'primary' : 'accent';
            return `${color}--text`;
        },

        teamLoss(victory) {
            if (victory.teamVictory) return false;
            const points = victory.players.map(player => Number(player.points));
            const dedupPoints = [...new Set(points)];
            return dedupPoints.length === 1;
        },

        playerIsWinner(player, victory) {
            if (victory.teamVictory || this.teamLoss(victory)) return false; // no highlighting when everyone wins
            const winner = this.getWinner(victory.players);
            return player.name === winner.name;
        },

        editVictory(victory) {
            this.formShowing = true;
            this.editingVictory = victory;
        },
    },
};
</script>

<style>
</style>