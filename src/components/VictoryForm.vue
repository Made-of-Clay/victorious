<template>
    <v-dialog
        scrollable
        max-width="300"
        :value="showing"
        @input="$emit('update:showing', $event)"
    >
        <v-card>
            <v-card-title>Add Victory</v-card-title>
            <v-form>

            </v-form>
            <v-card-actions>
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
export default {
    props: {
        showing: Boolean,
    },

    methods: {
        closeDialog() {
            this.$emit('update:showing', false);
        },
        saveForm() {
            console.log('save');
        },
    },
};
</script>

<style>

</style>