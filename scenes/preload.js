export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  create() {
    const textureBuilder = this.add.graphics();

    textureBuilder.fillStyle(0xffd500, 1);
    textureBuilder.fillRect(0, 0, 32, 48);
    textureBuilder.generateTexture("player", 32, 48);
    textureBuilder.clear();

    textureBuilder.fillStyle(0x4ea6ff, 1);
    textureBuilder.fillRect(0, 0, 28, 44);
    textureBuilder.generateTexture("npc", 28, 44);
    textureBuilder.clear();

    textureBuilder.fillStyle(0x8b8b8b, 1);
    textureBuilder.fillRect(0, 0, 200, 40);
    textureBuilder.generateTexture("platform", 200, 40);
    textureBuilder.clear();

    textureBuilder.fillStyle(0xcc3e33, 1);
    textureBuilder.fillRect(0, 0, 40, 20);
    textureBuilder.generateTexture("brick", 40, 20);
    textureBuilder.clear();

    textureBuilder.fillStyle(0x3ecf3e, 1);
    textureBuilder.fillRect(0, 0, 80, 80);
    textureBuilder.generateTexture("goal", 80, 80);
    textureBuilder.clear();

    textureBuilder.fillStyle(0x333333, 0.85);
    textureBuilder.fillRect(0, 0, 160, 60);
    textureBuilder.generateTexture("cement", 160, 60);
    textureBuilder.clear();

    textureBuilder.fillStyle(0x222222, 0.85);
    textureBuilder.fillRect(0, 0, 160, 60);
    textureBuilder.generateTexture("oil", 160, 60);
    textureBuilder.clear();

    textureBuilder.fillStyle(0x7d5b3b, 1);
    textureBuilder.fillRect(0, 0, 140, 24);
    textureBuilder.generateTexture("elevator", 140, 24);
    textureBuilder.clear();

    textureBuilder.destroy();

    this.add
      .text(20, 20, "Mi Primera Chamba", {
        font: "32px Arial",
        fill: "#ffffff",
      })
      .setShadow(2, 2, "#000", 2, true, true);

    this.add
      .text(20, 80, "Cargando nivel...", {
        font: "20px Arial",
        fill: "#ffffff",
      })
      .setShadow(1, 1, "#000", 2, true, true);

    this.time.delayedCall(400, () => {
      this.scene.start("Menu");
    });
  }
}
