<template>
    <v-container tag="article" style="position:relative" fluid>
        <v-row dense>
            <v-col cols="12" sm="4" md="3" lg="2" xl="1">
                <v-text-field
                    v-model="searchFilter"
                    label="Search"
                    class="d-inline-block mr-4"
                    clearable
                />
            </v-col>
            <v-col cols="12" sm="4" md="3" lg="2" xl="1">
                <v-select
                    v-model="showLimit"
                    :items="showLimitItems"
                    label="Show"
                    class="d-inline-block"
                    hide-details
                />
            </v-col>
            <v-col cols="12" sm="4" md="3" lg="2" xl="1">
                <v-checkbox v-model="sortHistoryDesc" label="Reverse Order" class="d-inline-block" />
            </v-col>
        </v-row>

        <h1 :class="isSmallScreen ? '' : 'text-center'">
            History of Victory
            <small
                class="d-block body-1"
                v-text="`(${filteredVictories.length} Showing)`"
            />
        </h1>

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
            <v-alert
                v-if="!filteredVictories.length"
                class="text-center mx-auto"
                max-width="300"
                elevation="2"
            >
                No history to show
            </v-alert>
            <v-timeline-item
                v-for="v in filteredVictories"
                :key="v.id"
                color="secondary"
                small
            >
                <template v-slot:opposite>
                    <span class="title">{{v.date | formatDate}}</span>
                </template>
                <v-card max-width="500">
                    <v-card-title class="headline " :class="xsDisplay ? 'd-block' : ''">
                        <span class="d-block history__itemTitle">
                            {{v.game}} -
                            <b class="primary--text">
                                <template v-if="v.teamVictory">
                                    Team Victory! 🎉
                                </template>
                                <template v-else-if="!v.victoriousPlayer">
                                    Team Loss ☹️
                                </template>
                                <template v-else>
                                    {{getWinner(v)}}
                                </template>
                            </b>
                        </span>
                        <v-spacer />
                        <small v-if="isSmallScreen">
                            {{v.date | formatDate}}
                        </small>
                    </v-card-title>
                    <v-row dense class="pl-4">
                        <v-col cols="12" md="6">
                            <div
                                v-for="player in v.players"
                                :key="`${v.id}-${player}`"
                                class="mb-1"
                            >
                                <span :class="player === getWinner(v) ? 'primary--text' : ''">
                                    {{player}}
                                </span>
                                <v-icon
                                    v-if="player === getWinner(v)"
                                    color="primary"
                                    class="ml-2"
                                    v-text="'mdi-star'"
                                />
                            </div>
                        </v-col>
                        <v-col cols="12" md="6">
                            <template v-if="v.notes">
                                Notes
                                <pre class="ma-0 body-2 grey--text lighten-1 history__notes" v-text="`${v.notes}`" />
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
import {clone} from '../utils';

const newestLimit = 'Newest 20';

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
        searchFilter: '',
        sortHistoryDesc: true,
        showLimit: newestLimit,
    }),
    computed: {
        isSmallScreen: vm => vm.$vuetify.breakpoint.smAndDown,
        filteredVictories() {
            let victories = clone(this.$store.state.victories, true); // deep clone
            if (this.searchFilter) {
                const searchTerms = this.searchFilter.replace(' ', '|');
                const reSearch = new RegExp(searchTerms, 'i');
                victories = victories.filter(victory => {
                    const valuesToSearch = [victory.game, victory.date, ...victory.players];
                    return valuesToSearch.find(toSearch => reSearch.test(toSearch));
                });
            }
            if (this.sortHistoryDesc) {
                victories = victories.reverse();
            }
            victories = this.showLimit === newestLimit
                ? victories.slice(0, Number(newestLimit.substr(7)))
                : (/20\d\d/.test(this.showLimit)
                    ? victories.filter(v => v.date.substr(0, 4) === this.showLimit)
                    : victories);
            return victories;
        },
        xsDisplay: vm => vm.$vuetify.breakpoint.xs,
        showLimitItems() {
            let years = this.$store.state.victories.map(v => v.date.substr(0, 4)).sort().reverse();
            return [
                newestLimit,
                ...(new Set(years)),
                'Show All',
            ];
        },
    },

    methods: {
        getWinner(victory) {
            const index = victory.players.indexOf(victory.victoriousPlayer);
            return index > -1 ? victory.players[index] : 'no winner';
        },

        getPointColor(player, players) {
            const winner = this.getWinner(players);
            const color = player.name === winner.name ? 'primary' : 'accent';
            return `${color}--text`;
        },

        editVictory(victory) {
            this.formShowing = true;
            this.editingVictory = victory;
        },
    },
};
</script>

<style>
.history__notes {
    white-space: pre-wrap;
}
.history__itemTitle {
    word-break: break-word;
}
</style>