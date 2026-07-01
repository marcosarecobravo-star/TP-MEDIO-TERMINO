export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1d1d2c);

    this.add
      .text(width / 2, height / 3, "Mi Primera Chamba", {
        font: "56px Arial",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 3 + 80, "Presiona Jugar para comenzar", {
        font: "24px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    const startButton = this.add
      .text(width / 2, height / 2 + 40, "Jugar", {
        font: "32px Arial",
        fill: "#000000",
        backgroundColor: "#ffd500",
        padding: { x: 24, y: 14 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startButton.on("pointerover", () => {
      startButton.setStyle({ fill: "#000000", backgroundColor: "#ffffff" });
    });

    startButton.on("pointerout", () => {
      startButton.setStyle({ fill: "#000000", backgroundColor: "#ffd500" });
    });

    startButton.on("pointerup", () => {
      this.registry.set("score", 0);
      this.registry.set("lives", 3);
      this.scene.start("Game");
    });
  }
}
