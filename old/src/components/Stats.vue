<template>
    <v-container tag="article">
        <div class="text-center">
            <v-select
                v-model="statView"
                :items="statList"
                class="stats__list d-inline-block mr-4"
                hide-details
            />
            <!-- following select isn't necessary for player stats (since only really 4 players...) -->
            <v-select
                v-if="totalsShowing"
                v-model="selectedValue"
                :items="selectedStatItems"
                class="stats__list d-inline-block"
                :disabled="!selectedStatItems.length"
                hide-details
            />
        </div>

        <VictoryTotals v-if="totalsShowing" :view="selectedValue" />

        <!-- <pre v-html="playerStats" /> -->
        <v-row>
            <v-col
                v-for="(stats, player) in playerStats"
                :key="`player-${player}`"
                cols="12"
                sm="6"
            >
                <v-card>
                    <v-card-title>
                        {{player}}
                        <v-spacer />
                        <b class="primary--text">
                            {{stats.totalWinsYear}} Wins in {{(new Date()).getFullYear()}}
                        </b>
                    </v-card-title>
                    <!-- <pre v-html="stats" /> -->
                    <v-row class="pa-4">
                        <v-col
                            v-for="{text, key} in playerStatOrder"
                            :key="`${player}-${key}`"
                            cols="12"
                            sm="6"
                        >
                            {{text}}: {{stats[key]}}
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <!--
            Bar chart of wins per year (y-wins, x-player)
         -->
    </v-container>
</template>

<script>
import VictoryTotals from './VictoryTotals';
import PlayerStats from '../PlayerStats';

export default {
    components: {
        VictoryTotals,
    },

    data() {
        const statList = [
            'Victory Totals', // pie - totals this year or a specific game
            'Player Stats',
        ];
        const sessionKey = 'stats-view';
        return {
            statView: sessionStorage.getItem(sessionKey) || statList[0],
            statList,
            selectedValue: '',
            playerStatOrder: [
                { text: 'Total Wins', key: 'totalWins' },
                // { text: `Wins in ${(new Date()).getFullYear()}`, key: 'totalWinsYear' },
                { text: 'Latest Win', key: 'latestWin' },
                { text: 'Longest Streak', key: 'longestStreak' },
                { text: 'Best Game', key: 'bestGame' },
            ],
            sessionKey,
        };
    },
    computed: {
        totalsShowing: vm => vm.statView === vm.statList[0],
        playerStatsShowing: vm => vm.statView === vm.statList[1],
        selectedStatItems: vm => {
            if (vm.totalsShowing) {
                return [
                    'Grand Total',
                    ...(vm.$store.getters.games),
                ];
            } else if (vm.playerStatsShowing) {
                return vm.$store.getters.players;
            } else return [];
        },
        playerStats() {
            if (!this.playerStatsShowing) return [];
            const playerStats = new PlayerStats(this.$store.getters.players);
            this.$store.state.victories.forEach(victory => { // in ascending date order (i.e. oldest is first)
                if (victory.victoriousPlayer) {
                    playerStats.currentPlayer = victory.victoriousPlayer;
                    playerStats.player.totalWins++;
                    playerStats.calcTotalWinsYear(victory.date);
                    playerStats.player.latestWin = victory.game;
                    playerStats.calcStreak(victory);
                    playerStats.updateGamesWon(victory);
                }
            });
            playerStats.calcBestGames();
            return playerStats.players;
        },
    },

    watch: {
        selectedStatItems: {
            handler(items) {
                this.selectedValue = items[0] || '';
            },
            immediate: true,
        },
        statView: {
            handler(view) {
                sessionStorage.setItem(this.sessionKey, view);
            },
            immediate: true,
        }
    },
};
</script>

<style>
.stats__list {
    max-width: 200px;
}
</style>