export default class Lose extends Phaser.Scene {
  constructor() {
    super("Lose");
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1d1d2c);

    this.add
      .text(width / 2, height / 2 - 40, "FIN DEL JUEGO", {
        font: "56px Arial",
        fill: "#ff4d4d",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 40, "Presiona ENTER para volver a jugar", {
        font: "24px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    const score = this.registry.get("score") || 0;
    const lives = this.registry.get("lives") || 0;

    this.add
      .text(width / 2, height / 2 + 90, `Puntos totales: ${score}`, {
        font: "20px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 130, `Vidas restantes: ${lives}`, {
        font: "20px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-ENTER", () => {
      this.registry.set("score", 0);
      this.registry.set("lives", 3);
      this.scene.start("Game3");
    });
  }
}
