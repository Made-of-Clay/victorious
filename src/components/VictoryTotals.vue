<template>
    <div class="stats__chartWrapper mx-auto">
        <apexchart :options="chartOptions" :series="totalWinSeries" />
    </div>
</template>

<script>
import apexchart from 'vue-apexcharts';

export default {
    components: {
        apexchart,
    },

    props: {
        view: {
            type: String,
            default: '',
        },
    },

    data: () => ({
        chartOpts: {
            chart: {
                type: 'donut',
                // width: '50%'
            },
            theme: {
                palette: 'palette6',
            },
        },
    }),
    computed: {
        victoryTotals() {
            const totals = this.$store.getters.players.map(player => ({ player, wins: 0 }));
            this.$store.state.victories.forEach(victory => {
                if (this.view !== 'Grand Total' && this.view !== victory.game) return; // ignore this victory/game
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
.stats__chartWrapper {
    max-width: 400px;
}
</style>