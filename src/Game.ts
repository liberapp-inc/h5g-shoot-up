// Liberapp 2019 - Tahiti Katagai
// ゲームシーン

const PLAYER_POSITION_PER_HEIGHT = 0.75;
const PLAYER_RADIUS_PER_WIDTH = (1/18);
const SHOT_RADIUS_PER_WIDTH = (1/40);
const BLOCK_IN_WIDTH = 5;
const BLOCK_IN_HEIGHT = 7;
const BLOCK_SIZE_PER_WIDTH = 1/BLOCK_IN_WIDTH;
const BLOCK_SIZE_PER_HEIGHT = 1/BLOCK_IN_HEIGHT;
const SCROLL_SPEED_PER_HEIGHT = (1/60/3);

const SAVE_KEY_BESTSCORE = "ShootUp-bestScore";

class Game {

    static loadSceneGamePlay() {
        new Background();
        new StartMessage();
        new Score();
        new Player();
        new Wave();
    }
}
