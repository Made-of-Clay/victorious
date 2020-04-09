<template>
    <component
        :is="component"
        v-model="selected"
        :centered="isTabs"
        :icons-and-text="isTabs"
        :fixed="!isTabs"
        :grow="!isTabs"
        :class="computedClasses"
        :color="computedColor"
    >
        <component :is="itemComponent">
            History
            <v-icon v-text="'mdi-history'" />
        </component>
        <component :is="itemComponent">
            Stats
            <v-icon v-text="'mdi-chart-line'" />
        </component>
    </component>
</template>

<script>
import {VTabs, VBottomNavigation, VTab, VBtn} from 'vuetify/lib';

export default {
    components: {
        VTabs,
        VBottomNavigation,
        VTab,
        VBtn,
    },

    props: {
        component: {
            type: String,
            required: true,
        },
    },

    data: () => ({
        selected: 0,
    }),
    computed: {
        isTabs: vm => vm.component === 'v-tabs',
        itemComponent: vm => vm.isTabs ? 'v-tab' : 'v-btn',
        computedClasses: vm => !vm.isTabs ? 'elevation-2' : '',
        computedColor: vm => !vm.isTabs ? 'primary' : '',
    },
};
</script>

<style>

</style>