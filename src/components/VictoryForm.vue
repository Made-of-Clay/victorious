<template>
    <v-dialog
        scrollable
        max-width="500"
        :value="showing"
        @input="$emit('update:showing', $event)"
    >
        <v-card>
            <v-card-title>{{action}} Victory</v-card-title>
            <v-form ref="form" v-model="formIsValid" class="pa-4 victoryForm__form">
                <v-alert v-if="!formEditable" type="warning" outlined>
                    <template v-if="!authenticated">
                        <p>You must prove yourself worthy of victory tracking! Only if you are accepted by the mighty victors can you make history. (i.e. login to authenticate; only authorized users can make changes)</p>
                        <v-btn text color="primary" @click="authenticate">
                            <v-icon class="mr-2">mdi-key</v-icon>
                            Login
                        </v-btn>
                    </template>
                    <template v-else-if="!authorized">
                        You have no power here! (not authorized user)
                    </template>
                </v-alert>
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-combobox
                            v-model="formData.game"
                            label="Game Played"
                            :items="$store.getters.games"
                            :rules="[rules.required]"
                            :disabled="!formEditable"
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
                                    :disabled="!formEditable"
                                    v-on="on"
                                />
                            </template>
                            <v-date-picker v-model="formData.date" @input="datePickerShowing = false" />
                        </v-menu>
                    </v-col>
                </v-row>

                <v-combobox
                    v-model="formData.players"
                    :items="$store.getters.players"
                    label="Players"
                    :disabled="!formEditable"
                    :rules="[rules.requiredPlayers]"
                    multiple chips
                />
                <v-row dense>
                    <v-col cols="12" sm="6">
                        <v-checkbox
                            v-model="formData.teamVictory"
                            :disabled="!formData.players.length"
                            label="Team Victory"
                        />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-select
                            v-model="formData.victoriousPlayer"
                            :items="formData.players"
                            :disabled="!formData.players.length || formData.teamVictory"
                            label="Victorious Player"
                            clearable
                        />
                    </v-col>
                </v-row>

                <v-textarea
                    v-model="formData.notes"
                    label="Notes"
                    :counter="noteCharCap"
                    :rules="[rules.longFieldMax]"
                    class="mt-2"
                    :disabled="!formEditable"
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
                <v-btn
                    color="accent"
                    :disabled="!formEditable"
                    text
                    @click="saveForm"
                >
                    {{action}}
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
    players: [],
    teamVictory: false,
    victoriousPlayer: '',
    notes: '',
}));

export default {
    inject: [
        'firebase',
    ],

    props: {
        showing: Boolean,
        victory: {
            type: Object,
            default: () => ({}),
        },
    },

    data: vm => ({
        formIsValid: true,
        formData: vm.editExistingVictory ? vm.victory : getDefaultFormData(), // probably always default values, but this scales better
        datePickerShowing: false,
        pointCaps: { min: -100, max: 500 },
        noteCharCap,
        rules: {
            required: value => !!value || 'Field required',
            requiredPlayers: players => !!players.length || 'At least 1 required',
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
        authenticated: vm => !!vm.$store.state.authenticatedUser,
        formEditable: vm => vm.authenticated && vm.$store.getters.userIsAuthorized,
        editExistingVictory: vm => Object.keys(vm.victory).length > 0,
        action: vm => vm.editExistingVictory ? 'Update' : 'Add',
    },

    watch: {
        showing(showing) {
            if (showing) {
                const clone = value => JSON.parse(JSON.stringify(value)); // a bit hackey and not super performant, but sufficient at this scale
                this.formData = this.editExistingVictory ? clone(this.victory) : getDefaultFormData(); // eventually init formData when victory is passed in to edit
                this.$nextTick(() => {
                    this.$refs.form.resetValidation();
                });
            } else {
                this.resetForm();
            }
        },
        'formData.victoriousPlayer'(player) {
            if (typeof player === 'undefined') {
                this.formData.victoriousPlayer = '';
            }
        },
        'formData.teamVictory'(teamVictory) {
            if (teamVictory) {
                this.formData.victoriousPlayer = '';
            }
        },
    },
    created() {
        this.$store.dispatch('getAuthorizedUsers');
    },

    methods: {
        resetForm() {
            this.$refs.form.reset();
            this.$refs.form.resetValidation();
            this.errorMessage = '';
            this.$emit('update:victory', {});
            this.formData = getDefaultFormData();
        },
        closeDialog() {
            this.$emit('update:showing', false);
        },
        saveForm() {
            this.$refs.form.validate();
            this.$nextTick(() => {
                if (this.formIsValid) {
                    const method = this.editExistingVictory ? 'updateVictory' : 'addVictory';
                    this.firebase[method](this.formData)
                        .then(() => this.closeDialog())
                        .catch(thrown => {
                            console.error(thrown);
                            this.errorMessage = thrown.message;
                        })
                    ;
                }
            });
        },

        authenticate() {
            this.$store.dispatch('popupAuth');
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