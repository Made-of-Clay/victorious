<template>
    <v-container tag="article" style="position:relative">
        <h1 :class="isSmallScreen ? '' : 'text-center'">History of Victory</h1>

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
                v-for="v in $store.state.victories"
                :key="v.id"
                color="secondary"
                small
            >
                <template v-slot:opposite>
                    <span>{{v.date | formatDate}}</span>
                </template>
                <v-card max-width="500">
                    <v-card-title class="headline">
                        <span>
                            {{v.game}} -
                            <b class="primary--text" v-text="getWinner(v.players).name" />
                        </span>
                        <v-spacer />
                        <small v-if="isSmallScreen">{{v.date | formatDate}}</small>
                    </v-card-title>
                    <v-list dense>
                        <v-list-item v-for="player in v.players" :key="`${v.id}-${player.name}`">
                            <span :class="playerIsWinner(player, v.players) ? 'primary--text' : ''">
                                {{player.name}} - {{player.points}}
                            </span>
                            <v-icon
                                v-if="playerIsWinner(player, v.players)"
                                color="primary"
                                class="ml-2"
                                v-text="'mdi-star'"
                            />
                        </v-list-item>
                    </v-list>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn text small color="error" @click="deleteVictoryPrompt = v">
                            <v-icon small>mdi-delete</v-icon>
                            Delete
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-timeline-item>
        </v-timeline>

        <VictoryForm :showing.sync="formShowing" />

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
    }),
    computed: {
        isSmallScreen: vm => vm.$vuetify.breakpoint.smAndDown,
    },

    methods: {
        getWinner(players) {
            let winner = (Array.isArray(players) && players.length) ? players[0] : { points:0 };
            players.forEach(player => {
                if (player.points > winner.points) {
                    winner = player;
                }
            });
            return winner;
        },

        getPointColor(player, players) {
            const winner = this.getWinner(players);
            const color = player.name === winner.name ? 'primary' : 'accent';
            return `${color}--text`;
        },

        playerIsWinner(player, players) {
            const winner = this.getWinner(players);
            return player.name === winner.name;
        },
    },
};
</script>

<style>
</style>