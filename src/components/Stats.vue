<template>
    <v-container tag="article">
        <ul>
            <li>Game Win Totals (pie)</li>
            <li>Player Stats (total wins, longest streak, best game, total wins this year, last win, )</li>
            <li>Bar chart of wins per year (y-wins, x-player)</li>
        </ul>

        <v-select
            v-model="selectedView"
            :items="statList"
            class="stats__list"
        />

        <div class="stats__chartWrapper mx-auto">
            <apexchart :options="chartOptions" :series="totalWinSeries" />
        </div>
    </v-container>
</template>

<script>
import apexchart from 'vue-apexcharts';

export default {
    components: {
        apexchart,
    },

    data() {
        const statList = [
            'Victory Totals', // pie - totals this year or a specific game
            'Player Stats',
        ];
        return {
            selectedView: statList[0],
            statList,
            chartOpts: {
                chart: {
                    type: 'donut',
                    width: '50%'
                },
                theme: {
                    palette: 'palette6',
                },
            },
        };
    },
    computed: {
        victoryTotals() {
            const totals = this.$store.getters.players.map(player => ({ player, wins: 0 }));
            this.$store.state.victories.forEach(victory => {
                totals.forEach(total => {
                    if (victory.teamVictory || victory.victoriousPlayer === total.player) {
                        total.wins++
                    }
                });
            });
            return totals;
        },
        totalWinSeries: vm => vm.victoryTotals.map(({wins}) => wins),
        chartOptions() {
            return Object.assign({
                labels: this.victoryTotals.map(({player}) => player),
            }, this.chartOpts);
        },
    },
};
</script>

<style>
.stats__list {
    max-width: 200px;
}
.stats__chartWrapper {
    max-width: 400px;
}
</style>