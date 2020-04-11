<template>
    <v-dialog
        scrollable
        max-width="500"
        :value="showing"
        @input="$emit('update:showing', $event)"
    >
        <v-card>
            <v-card-title>Add Victory</v-card-title>
            <v-form ref="form" v-model="formIsValid" class="pa-4 victoryForm__form">
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-combobox
                            v-model="formData.game"
                            label="Game Played"
                            :items="$store.getters.games"
                            :rules="[rules.required]"
                        />
                    </v-col>
                    <v-col cols="12" sm="6">
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
                                    :rules="[rules.required]"
                                    v-on="on"
                                />
                            </template>
                            <v-date-picker v-model="formData.date" @input="datePickerShowing = false" />
                        </v-menu>
                    </v-col>
                </v-row>

                <fieldset class="pa-2">
                    <legend class="px-1">Players</legend>
                    <v-checkbox v-model="formData.teamVictory" label="Team Victory" />
                    <template v-if="formData.players.length">
                        <v-row v-for="(player, i) in formData.players" :key="`${i}-${player.name}`">
                            <v-col cols="7" md="6">
                                <v-combobox
                                    v-model="player.name"
                                    label="Player"
                                    :items="$store.getters.players"
                                    :rules="[rules.required]"
                                />
                            </v-col>
                            <v-col cols="3" md="4">
                                <v-text-field
                                    v-model="player.points"
                                    type="number"
                                    :min="pointCaps.min"
                                    :max="pointCaps.max"
                                    maxlength="3"
                                    label="Points"
                                />
                                <!-- removed required rule; just set empty to 0 when saving -->
                            </v-col>
                            <v-col cols="2" class="d-flex">
                                <v-tooltip v-if="i !== 0" top>
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

                <v-textarea
                    v-model="formData.notes"
                    label="Notes (optional)"
                    :counter="noteCharCap"
                    :rules="[rules.longFieldMax]"
                    class="mt-2"
                />
            </v-form>

            <v-alert v-if="errorMessage" type="error" tile>
                {{errorMessage}}
            </v-alert>

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

const isNumber = value => !isNaN(Number(value));
const noteCharCap = 200;
const getDefaultFormData = () => (Object.assign({}, {
    game: '',
    date: '',
    teamVictory: false,
    players: [Object.assign({}, {
        name: '',
        points: 0,
    })], // { name, points }
    notes: '',
}));

export default {
    inject: [
        'firebase',
    ],

    props: {
        showing: Boolean,
    },

    data: () => ({
        formIsValid: true,
        formData: getDefaultFormData(),
        datePickerShowing: false,
        pointCaps: { min: -100, max: 500 },
        noteCharCap,
        rules: {
            required: value => !!value || 'Field required',
            number: value => isNumber(value) || 'Value must be a number',
            longFieldMax: value => String(value).length <= noteCharCap || 'Value too long',
        },
        errorMessage: '',
    }),
    computed: {
        computedDate: {
            get() {
                if (!this.formData.date) return '';
                const [year, month, day] = this.formData.date.split('-');
                return `${twoDigits(month)}-${twoDigits(day)}-${year}`;
            },
            set: () => undefined, // only called when dialog closes - noop
        },
    },

    watch: {
        showing(showing) {
            if (!showing) {
                this.resetForm();
            } else {
                this.formData = getDefaultFormData(); // eventually init formData when victory is passed in to edit
                this.$nextTick(() => {
                    this.$refs.form.resetValidation();
                });
            }
        },
    },

    methods: {
        resetForm() {
            this.$refs.form.reset();
            this.$refs.form.resetValidation();
            this.errorMessage = '';
        },
        closeDialog() {
            this.$emit('update:showing', false);
        },
        saveForm() {
            this.$refs.form.validate();
            this.$nextTick(() => {
                if (this.formIsValid) {
                    this.formData.players.forEach(player => {
                        player.points = Number(player.points);
                    });
                    // save to firebase
                    this.firebase.saveVictory(this.formData)
                        .then(() => this.closeDialog())
                        .catch(thrown => {
                            console.error(thrown);
                            this.errorMessage = thrown.message;
                        })
                    ;
                }
            });
        },
        addBlankPlayer() {
            this.formData.players.push({
                name: '',
                points: 0,
            });
        },
        removePlayer(index) {
            this.formData.players = this.formData.players.filter((p, i) => index !== i);
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