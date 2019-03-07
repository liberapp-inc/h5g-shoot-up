// Liberapp 2019 - Tahiti Katagai
// ゲームシーン

const PLAYER_RADIUS_PER_WIDTH = (1/12);
const BLOCK_SIZE_PER_WIDTH = 1/6;

class Game {

    static loadSceneGamePlay() {
        new Background();
        new Score();
        new Player();
    }
}
