<template>
    <v-dialog
        max-width="300"
        :value="Object.keys(victory).length"
        @input="handleDeleteDialog"
    >
        <v-card v-if="Object.keys(victory).length">
            <v-card-title>Delete Victory?</v-card-title>

            <v-card-text>
                This will perminantly delete <b>{{victory.game}}</b> on <b>{{victory.date | formatDate}}</b>.
            </v-card-text>

            <v-alert v-if="errorMessage" type="error" tile>
                {{errorMessage}}
            </v-alert>

            <v-card-actions>
                <v-spacer />
                <v-btn text @click="clearVictory">
                    Cancel
                </v-btn>
                <v-btn color="error" @click="deleteVictory">
                    Delete
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import formatDate from '../formatDate.filter.js';

export default {
    inject: [
        'firebase',
    ],
    filters: {
        formatDate,
    },

    props: {
        victory: {
            type: Object,
            default: () => ({}),
        },
    },

    data: () => ({
        errorMessage: '',
    }),

    methods: {
        handleDeleteDialog(inputValue) {
            if (!inputValue) {
                this.clearVictory();
            }
        },
        clearVictory() {
            this.$emit('update:victory', undefined);
        },
        deleteVictory() {
            this.firebase.removeVictory(this.victory.id)
                .then(() => this.clearVictory())
                .catch(thrown => this.errorMessage = thrown.message)
            ;
        },
    },
}
</script>

<style>

</style>