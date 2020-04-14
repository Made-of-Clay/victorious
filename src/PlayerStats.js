export default class PlayerStats {
    constructor(players) {
        this.players = players.reduce((players, player) => {
            players[player] = {
                totalWins: 0,
                totalWinsYear: 0,
                latestWin: '',
                longestStreak: 0,
                bestGame: '',
                gamesWon: new Map(), // gameName: count
            };
            return players;
        }, {});
        this.currentPlayer = '';
        this.streak = {
            prevWinner: '',
            curCount: 0,
        };
    }

    get player() {
        return this.players[this.currentPlayer];
    }

    calcTotalWinsYear(date) {
        const curYear = (new Date()).getFullYear();
        if (date.substr(0, 4) === curYear) {
            this.player.totalWinsYear++;
        }
    }

    calcStreak(victory) {
        if (this.streak.lastWinner === victory.victoriousPlayer) {
            this.streak.curCount++;
            if (this.player.longestStreak < this.streak.curCount) {
                this.player.longestStreak = this.streak.curCount;
            }
        } else { // reset
            this.streak.prevWinner = victory.victoriousPlayer;
            this.streak.curCount = 1;
        }
    }

    updateGamesWon(victory) {
        const {gamesWon} = this.player;
        const {game} = victory;
        if (!gamesWon.has(game)) {
            gamesWon.set(game, 0);
        }
        gamesWon.set(game, gamesWon.get(victory.game)+1); // +1 to this game's win count
    }

    calcBestGames() {
        const resetBest = () => ({
            game: '',
            wins: 0,
        });
        let bestGame = resetBest();
        Object.keys(this.players).forEach(player => {
            this.currentPlayer = player;
            this.player.gamesWon.forEach((wins, game) => {
                if (bestGame.wins < wins) {
                    bestGame.wins = wins;
                    bestGame.game = game;
                }
            });
            this.player.bestGame = bestGame.game;
            bestGame = resetBest();
        });
    }
}