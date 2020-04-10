<template>
    <v-dialog
        scrollable
        max-width="500"
        :value="showing"
        @input="$emit('update:showing', $event)"
    >
        <v-card>
            <v-card-title>Add Victory</v-card-title>
            <v-form class="pa-4 victoryForm__form">
                <v-combobox
                    v-model="game"
                    label="Game Played"
                    :items="$store.getters.games"
                />
                <v-menu
                    v-model="datePickerShowing"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                    <template v-slot:activator="{on}">
                        <v-text-field
                            v-model="computedDate"
                            label="Date"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-on="on"
                        />
                    </template>
                    <v-date-picker v-model="date" @input="datePickerShowing = false" />
                </v-menu>

                <fieldset class="pa-2">
                    <legend class="px-1">Players</legend>
                    <template v-if="players.length">
                        <v-row v-for="(player, i) in players" :key="`${i}-${player.name}`">
                            <v-col cols="7" md="6">
                                <v-combobox
                                    v-model="player.name"
                                    label="Player"
                                    :items="$store.getters.players"
                                />
                            </v-col>
                            <v-col cols="3" md="4">
                                <v-text-field
                                    v-model="player.points"
                                    type="number"
                                    :min="dateCaps.min"
                                    :max="dateCaps.max"
                                    maxlength="3"
                                    label="Points"
                                />
                            </v-col>
                            <v-col cols="2" class="d-flex">
                                <v-tooltip top>
                                    <template v-slot:activator="{on}">
                                        <v-btn
                                            text icon small
                                            class="align-self-center"
                                            @click="removePlayer(i)"
                                            v-on="on"
                                        >
                                            <v-icon small>mdi-minus-circle</v-icon>
                                        </v-btn>
                                    </template>
                                    Remove Player
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </template>
                    <v-btn text @click="addBlankPlayer">
                        <v-icon>mdi-plus</v-icon>
                        Add Player
                    </v-btn>
                </fieldset>
            </v-form>
            <v-card-actions>
                <v-spacer />
                <v-btn text @click="closeDialog">
                    Close
                </v-btn>
                <v-btn color="accent" text @click="saveForm">
                    Add Victory
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import twoDigits from '../twoDigits';

export default {
    props: {
        showing: Boolean,
    },

    data: () => ({
        game: '',
        date: (new Date()).toISOString().substr(0, 10),
        players: [], // { name, points }
        datePickerShowing: false,
        dateCaps: { min: -100, max: 500 },
    }),
    computed: {
        computedDate() {
            if (!this.date) {
                console.warn('Date was empty for some reason');
                return '';
            }
            const [year, month, day] = this.date.split('-');
            return `${twoDigits(month)}-${twoDigits(day)}-${year}`;
        },
    },

    methods: {
        closeDialog() {
            this.$emit('update:showing', false);
        },
        saveForm() {
            console.log('save');
        },
        addBlankPlayer() {
            this.players.push({
                name: '',
                points: 0,
            });
        },
        removePlayer(index) {
            this.players = this.players.filter((p, i) => index !== i);
        },
    },
};
</script>

<style>
.victoryForm__form {
    max-height: 75vh;
    overflow-y: auto;
}
</style>