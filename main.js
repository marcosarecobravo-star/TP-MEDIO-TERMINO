import PreloadScene from "./scenes/preload.js";
import MenuScene from "./scenes/Menu.js";
import GameScene1 from "./scenes/Game.js";
import GameScene2 from "./scenes/Game2.js";
import GameScene3 from "./scenes/Game3.js";
import LoseScene from "./scenes/Lose.js";
import WinScene from "./scenes/Win.js";


const config = {
  type: Phaser.AUTO,
 
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    }
  },
  backgroundColor: "#1d1d2c",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 },
      debug: false,
    },
  },
  scene: [PreloadScene, MenuScene, GameScene1, GameScene2, GameScene3, LoseScene, WinScene],
};

new Phaser.Game(config);
