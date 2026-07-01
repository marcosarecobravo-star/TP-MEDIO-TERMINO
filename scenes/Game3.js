export default class Game3 extends Phaser.Scene {
  constructor() {
    // Define el nombre de la escena para Phaser
    super("Game3");
  }

  init() {
    // Estado general del nivel y condiciones de fin de juego
    // Se inicializa antes de crear objetos y controles
    //this.levelTime = 60;
    this.isGameOver = false;
    this.playerAtGoal = false;
    this.npcAtGoal = false;
    this.npcInCement = false;
    this.npcOnOil = false;
    if (!this.registry.has("score")) {
      this.registry.set("score", 0);
    }
    if (!this.registry.has("lives")) {
      this.registry.set("lives", 3);
    }
    this.strongPushReady = true;
    this.strongPushCooldown = 2500;
    this.npcStrongPushActive = false;
    this.npcStrongPushAirborne = false;

    // Primer ascensor: sube y baja en el lado derecho
    this.elevatorX = 960;
    this.elevatorTopY = 310;
    this.elevatorBottomY = 480;
    this.elevatorSpeed = 90;
    this.elevatorDirection = -1;
    this.elevator = null;

    // Segundo ascensor: sube y baja en el lado izquierdo
    this.elevator2X = 30;
    this.elevator2TopY = 470;
    this.elevator2BottomY = 780;
    this.elevator2Speed = 90;
    this.elevator2Direction = 1;
    this.elevator2 = null;
    // Tercer ascensor: sube y baja en el lado izquierdo
    this.elevator3X = 30;
    this.elevator3TopY = 210;
    this.elevator3BottomY = 400;
    this.elevator3Speed = 70;
    this.elevator3Direction = 1;
    this.elevator3 = null;



  
  }



  create() {
    // Orden de inicialización del nivel:
    // 1) crear objetos del escenario
    // 2) crear personajes
    // 3) activar peligros
    // 4) mostrar UI
    // 5) configurar controles
    // 6) configurar colisiones
    // 7) iniciar el temporizador
    this.createEnvironment();
    this.createCharacters();
    this.createHazards();
    this.createBill();
    this.createUI();
    this.createScoreAndLives();
    this.createInput();
    this.setupCollisions();
    this.startTimer();
  }

  createEnvironment() {
    // Crea el fondo y las plataformas estáticas del nivel
    const { width, height } = this.scale;

    // Fondo de nivel principal
    this.add.rectangle(width / 2, height / 2, width, height, 0x202038);

    // Crear un grupo de plataformas estáticas para el jugador y el NPC
    this.platforms = this.physics.add.staticGroup();

    // Definición de plataformas con posición y ancho
    const platformPositions = [
      { x: 520, y: 760, width: 1200 },
      { x: 250, y: 720, width: 50 },
      { x: 520, y: 720, width: 50 },
      { x: 790, y: 720, width: 50 },
      { x: 570, y: 480, width: 930 },
     { x: 520, y: 380, width: 90 },
     { x : 250, y: 380, width: 90 },
     { x: 790, y: 380, width: 90 },
     { x: 520, y: 220, width: 90 },
     { x: 250, y: 220, width: 90 },
     { x: 790, y: 220, width: 90 },
     { x: 980, y: 180, width: 90 },
     { x: 790, y: 60, width: 90 },
     { x: 250, y: 60, width: 90 },
     { x: 520, y: 60, width: 90 },
     { x: 30, y: 60, width: 150 },
     
    ];

    platformPositions.forEach((platform) => {
      const item = this.platforms.create(platform.x, platform.y, "platform");
      item.setDisplaySize(platform.width, 40);
      item.refreshBody();
    });

    // ZONAS DE CEMENTO - Ajusta los objetos de este array para mover o agregar más cuadros.
    const cementPositions = [
      { x: 380, y: 720, width: 220, height: 40 },
      { x: 660, y: 720, width: 220, height: 40 },
      { x: 250, y: 300, width: 80, height: 72 },
    ];

    this.cementZones = this.physics.add.staticGroup();
    cementPositions.forEach((pos) => {
      const zone = this.cementZones.create(pos.x, pos.y, "cement");
      zone.setAlpha(0.8);
      zone.setDisplaySize(pos.width, pos.height);
      zone.refreshBody();
    });

    // ZONAS DE ACEITE - Ajusta los objetos de este array para mover o agregar más cuadros.
    const oilPositions = [
      { x: 520, y: 280, width: 80, height: 72 },
      { x: 780, y: 160, width: 80, height: 72 },
      { x: 250, y: 120, width: 80, height: 72 },
      { x: 520, y: 450, width: 80, height: 72 },
      { x: 250, y: 450, width: 80, height: 72 },
      { x: 980, y: 400, width: 180, height: 222 },
    ];

    this.oilZones = this.physics.add.staticGroup();
    oilPositions.forEach((pos) => {
      const zone = this.oilZones.create(pos.x, pos.y, "oil");
      zone.setAlpha(0.85);
      zone.setDisplaySize(pos.width, pos.height);
      zone.refreshBody();
    });

    // ZONA META (GOAL) - Modifica X e Y para cambiar su posición
    // X: posición horizontal (izquierda-derecha), Y: posición vertical (arriba-abajo)
    this.goalZone = this.add.image(980, 100, "goal");
    this.goalZone.setAlpha(0.9);
    this.physics.add.existing(this.goalZone, true);

    // Primer ascensor en el lado derecho
    this.elevator = this.physics.add.sprite(this.elevatorX, this.elevatorBottomY, "elevator");
    this.elevator.setImmovable(true);
    this.elevator.body.allowGravity = false;
    this.elevator.setDepth(1);
    this.elevator.setSize(140, 24);

    // Segundo ascensor en el lado izquierdo
    this.elevator2 = this.physics.add.sprite(this.elevator2X, this.elevator2BottomY, "elevator");
    this.elevator2.setImmovable(true);
    this.elevator2.body.allowGravity = false;
    this.elevator2.setDepth(1);
    this.elevator2.setSize(140, 24);

    // tercer ascensor en el lado izquierdo
    this.elevator3 = this.physics.add.sprite(this.elevator3X, this.elevator3BottomY, "elevator");
    this.elevator3.setImmovable(true);
    this.elevator3.body.allowGravity = false;
    this.elevator3.setDepth(1);
    this.elevator3.setSize(140, 24);
  }

  createCharacters() {
    // Crea el jugador con físicas de plataforma y colisión con bordes
    this.player = this.physics.add.sprite(1000, 520, "player");
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.05);
    this.player.body.setSize(32, 48);
    this.player.body.setMaxVelocity(260, 800);

    // Crea el NPC compañero con menor velocidad y fricción personalizada
    this.npc = this.physics.add.sprite(960, 520, "npc");
    this.npc.setCollideWorldBounds(true);
    this.npc.setBounce(0.05);
    this.npc.body.setSize(28, 44);
    this.npc.body.setDrag(400, 0);
    this.npc.body.setMaxVelocity(180, 800);
  }

  createHazards() {
    // Grupo de ladrillos que caen desde arriba como peligro
    this.bricks = this.physics.add.group({
      defaultKey: "brick",
      maxSize: 12,
    });

    // Temporizador que genera ladrillos cada cierto tiempo
    this.brickTimer = this.time.addEvent({
      delay: 1700,
      callback: this.spawnBrick,
      callbackScope: this,
      loop: true,
    });
  }

  createBill() {
    // Aquí se crean los billetes. Cambia las posiciones para moverlos en el mapa.
    const billConfigs = [
      { x: 700, y: 300, points: 100 },
      { x: 320, y: 180, points: 100 },
      { x: 520, y: 120, points: 100 },
      { x: 30, y: 260, points: 100 },
    ];

    this.bills = [];

    billConfigs.forEach((config) => {
      const bill = this.add.rectangle(config.x, config.y, 40, 22, 0xF4C542);
      bill.setDepth(4);
      bill.setData("points", config.points);
      bill.setData("collected", false);
      const billText = this.add.text(config.x, config.y, "$", {
         font: "20px Arial",
         fill: "#000000",
         fontStyle: "bold",
      }).setOrigin(0.5).setDepth(5);

      this.physics.add.existing(bill, true);
      bill.body.setSize(40, 22);

      this.physics.add.overlap(this.player, bill, this.collectBill, null, this);
      this.bills.push({ bill, billText });
    });
  }

  collectBill(player, bill) {
    if (!bill || bill.getData("collected")) {
      return;
    }

    bill.setData("collected", true);
    this.addScore(bill.getData("points"));
    this.statusText.setText(`¡Billete recogido! +${bill.getData("points")} puntos.`);
    bill.destroy();
  }

  createUI() {
    this.timerText = this.add.text(0, 0, "", {
      font: "24px Arial",
      fill: "#ffffff",
    }).setVisible(false);

    this.scoreText = this.add.text(this.scale.width - 20, 20, `Puntos: ${this.registry.get("score")}`, {
      font: "24px Arial",
      fill: "#ffffff",
    }).setOrigin(1, 0);

    this.livesText = this.add.text(this.scale.width - 20, 50, `Vida: ${this.registry.get("lives")}`, {
      font: "24px Arial",
      fill: "#ffffff",
    }).setOrigin(1, 0);

    this.statusText = this.add.text(this.scale.width / 2, this.scale.height / 2, "", {
      font: "22px Arial",
      fill: "#ffffff",
      align: "center",
      wordWrap: { width: 720 },
    }).setOrigin(0.5).setVisible(false);

    this.effectText = this.add.text(0, 0, "", {
      font: "18px Arial",
      fill: "#ffffff",
    }).setVisible(false);

    this.instructionsText = this.add.text(0, 0, "", {
      font: "18px Arial",
      fill: "#ffffff",
      wordWrap: { width: 760 },
    }).setVisible(false);
  }

  createScoreAndLives() {
    this.updateScoreText = () => {
      this.scoreText.setText(`Puntos: ${this.registry.get("score")}`);
    };

    this.updateLivesText = () => {
      this.livesText.setText(`Vida: ${this.registry.get("lives")}`);
    };

    this.addScore = (value) => {
      const score = this.registry.get("score") + value;
      this.registry.set("score", score);
      this.updateScoreText();
    };

    this.addLife = (value) => {
      const lives = Phaser.Math.Clamp(this.registry.get("lives") + value, 0, 99);
      this.registry.set("lives", lives);
      this.updateLivesText();
      return lives;
    };
  }

  createInput() {
    // Mapea las teclas de movimiento y acciones del jugador
    this.cursors = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
      rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      pushRight: Phaser.Input.Keyboard.KeyCodes.E,
      pushLeft: Phaser.Input.Keyboard.KeyCodes.Q,
      strongPush: Phaser.Input.Keyboard.KeyCodes.R,
      restart: Phaser.Input.Keyboard.KeyCodes.ENTER,
    });
  }

  setupCollisions() {
    // Colisiones entre jugador/NPC y plataformas estáticas
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.npc, this.platforms);

    // Colisiones entre jugador/NPC y ascensores móviles
    this.physics.add.collider(this.player, this.elevator);
    this.physics.add.collider(this.npc, this.elevator);
    this.physics.add.collider(this.player, this.elevator2);
    this.physics.add.collider(this.npc, this.elevator2);
    this.physics.add.collider(this.player, this.elevator3);
    this.physics.add.collider(this.npc, this.elevator3);

    this.physics.add.collider(this.player, this.elevator4);
    this.physics.add.collider(this.npc, this.elevator4);

    // Los ladrillos se detienen al chocar con las plataformas y entre sí
    this.physics.add.collider(this.bricks, this.platforms, this.stopBrick, null, this);
    this.physics.add.collider(this.bricks, this.bricks);

    // Si un ladrillo toca al jugador o al NPC, se termina el juego
    this.physics.add.overlap(this.bricks, this.player, () => this.endGame("¡Te aplastó un ladrillo!"), null, this);
    this.physics.add.overlap(this.bricks, this.npc, () => this.endGame("¡Tu compañero fue aplastado!"), null, this);
  }

  startTimer() {
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateCountdown,
      callbackScope: this,
      loop: true,
    });
  }

 

  spawnBrick() {
    // Genera un ladrillo nuevo en una posición horizontal aleatoria
    if (this.isGameOver) {
      return;
    }

    const x = Phaser.Math.Between(120, 680);
    const warning = this.add.rectangle(x, 20, 60, 12, 0xff4444, 0.8);
    warning.setDepth(3);

    this.tweens.add({
      targets: warning,
      alpha: 0.2,
      duration: 400,
      yoyo: true,
      repeat: 1,
      onComplete: () => warning.destroy()
    });

    const brick = this.bricks.get(x, -20);

    if (!brick) {
      return;
    }

    // Ajusta este valor para cambiar el tiempo de respawn del ladrillo.
    this.time.delayedCall(300, () => {
      if (!this.isGameOver && brick.active) {
        brick
          .setActive(true)
          .setVisible(true)
          // Ajusta estos valores si quieres que caigan más o menos rápido.
          .setGravityY(1100)
          .setVelocity(0, 180)
          .setBounce(0.2)
          .setCollideWorldBounds(true);

        brick.body.setSize(40, 20);
        brick.setData("stopped", false);
      }
    });
  }

  stopBrick(brick) {
    if (!brick || brick.getData("stopped")) {
      return;
    }

    brick.setData("stopped", true);
    brick.setVelocity(0, 0);
    brick.body.setAllowGravity(false);
    brick.body.setImmovable(true);

    this.time.delayedCall(2000, () => {
      if (brick && brick.active) {
        brick.destroy();
      }
    });
  }

  tryPushNPC(direction) {
    // Empuja al NPC solo si el jugador está lo suficientemente cerca
    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);

    if (distance > 80) {
      this.statusText.setText("Acércate al compañero para empujarlo.");
      return;
    }

    // Empuja al NPC en la dirección indicada por la tecla Q o E
    const force = this.npcOnOil ? 320 : 220;
    this.npc.setVelocityX(force * direction);
    this.npc.setVelocityY(-40);
    this.statusText.setText(
      direction === 1
        ? "Empujaste al compañero hacia la derecha. ¡Cuidado con los peligros!"
        : "Empujaste al compañero hacia la izquierda. ¡Cuidado con los peligros!"
    );
  }
 // Empujón fuerte horizontal que lanza al NPC a distancia, con un tiempo de recarga
  fireStrongPush() {
    if (!this.strongPushReady) {
      this.statusText.setText("El empujón fuerte aún está cargando...");
      return;
    }

    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);

    if (distance > 120) {
      this.statusText.setText("Acércate más para darle un empujón fuerte al compañero.");
      return;
    }

    const direction = this.npc.x >= this.player.x ? 1 : -1;
    const forceX = this.npcOnOil ? 480 : 620;
    const forceY = -1200;

    this.npcStrongPushActive = true;
    this.npcStrongPushAirborne = false;
    this.npc.body.setGravityY(300);
    this.npc.body.setDrag(0, 0);
    this.npc.body.setMaxVelocity(420, 420); 
    /*El lado izquierdo significa la distancia horizontal máxima que puede alcanzar 
    el NPC durante el empujón fuerte, la derecha significa la distancia vertical máxima */
    this.npc.setVelocityX(forceX * direction);
    this.npc.setVelocityY(forceY);
    this.strongPushReady = false;
    this.statusText.setText("¡Tiro parabólico! El compañero viaja en arco y cae más realista.");

    this.time.delayedCall(180, () => {
      if (this.npc && this.npc.body) {
        this.npc.body.setGravityY(900);
        this.npc.body.setDrag(220, 0);
      }
    });

    this.npc.body.onWorldBounds = true;

    this.time.delayedCall(this.strongPushCooldown, () => {
      this.strongPushReady = true;
      this.npcStrongPushActive = false;
      this.statusText.setText("El empujón fuerte ya está listo otra vez.");
    });
  }

  applyNpcEffects() {
    if (this.npcStrongPushActive) {
      const onGround = this.npc.body.blocked.down || this.npc.body.touching.down;

      if (!this.npcStrongPushAirborne && !onGround) {
        this.npcStrongPushAirborne = true;
        return;
      }

      if (this.npcStrongPushAirborne && onGround) {
        this.npc.setVelocityX(0);
        this.npc.setVelocityY(0);
        this.npc.body.setDrag(2000, 0);
        this.npc.body.setMaxVelocity(0, 0);
        this.npc.body.setGravityY(0);
        this.npcStrongPushActive = false;
        this.npcStrongPushAirborne = false;
        this.strongPushReady = true;
        this.statusText.setText("El NPC cayó y quedó inmóvil en la plataforma.");
        return;
      }

      return;
    }

    // Detecta si el NPC está en alguna zona de cemento o aceite
    const npcBounds = this.npc.getBounds();
    this.npcInCement = this.cementZones
      ? this.cementZones.getChildren().some((zone) => Phaser.Geom.Intersects.RectangleToRectangle(npcBounds, zone.getBounds()))
      : false;
    this.npcOnOil = this.oilZones
      ? this.oilZones.getChildren().some((zone) => Phaser.Geom.Intersects.RectangleToRectangle(npcBounds, zone.getBounds()))
      : false;

    // Ajusta la física del NPC según el terreno donde se encuentra
    if (this.npcInCement) {
      this.npc.body.setDrag(900, 0);
      this.npc.body.setMaxVelocity(90, 600);
      this.effectText.setText("El cemento reduce su movilidad.");
    } else if (this.npcOnOil) {
      this.npc.body.setDrag(40, 0);
      this.npc.body.setMaxVelocity(260, 800);
      this.effectText.setText("El aceite lo hace deslizarse.");
    } else {
      this.npc.body.setDrag(400, 0);
      this.npc.body.setMaxVelocity(180, 800);
      this.effectText.setText("");
    }
  }

  // Verifica si el jugador está parado sobre el ascensor proporcionado.
  isPlayerOnElevator(elevator) {
    if (!elevator) {
      return false;
    }

    const playerBounds = this.player.getBounds();
    const elevatorBounds = elevator.getBounds();

    return (
      Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, elevatorBounds) &&
      (this.player.body.touching.down || this.player.body.blocked.down) &&
      this.player.body.velocity.y >= 0
    );
  }

  updateElevator(elevator, topY, bottomY, speed, directionKey, labelText) {
    if (!elevator) {
      return;
    }

    // Cambia de dirección cuando alcanza los límites superior o inferior
    if (elevator.y <= topY) {
      elevator.y = topY;
      this[directionKey] = 1;
      this.statusText.setText(`${labelText} baja.`);
    } else if (elevator.y >= bottomY) {
      elevator.y = bottomY;
      this[directionKey] = -1;
      this.statusText.setText(`${labelText} sube.`);
    }

    elevator.setVelocityY(this[directionKey] * speed);

    // Si el jugador está sobre el ascensor, su velocidad vertical se ajusta al del ascensor
    if (this.isPlayerOnElevator(elevator)) {
      this.player.body.velocity.y = elevator.body.velocity.y;
    }
  }

  update(time, delta) {
    if (this.isGameOver) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.restart)) {
        this.scene.restart();
      }
      return;
    }

    const movingLeft = this.cursors.left.isDown || this.cursors.leftArrow.isDown;
    const movingRight = this.cursors.right.isDown || this.cursors.rightArrow.isDown;
    const canJump = this.player.body.blocked.down || this.player.body.touching.down;

    if (movingLeft) {
      this.player.setVelocityX(-220);
    } else if (movingRight) {
      this.player.setVelocityX(220);
    } else {
      this.player.setVelocityX(0);
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.jump) && canJump) {
      this.player.setVelocityY(-430);
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.pushRight)) {
      this.tryPushNPC(1);
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.pushLeft)) {
      this.tryPushNPC(-1);
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.strongPush)) {
      this.fireStrongPush();
    }

    // Aplica efectos de terreno sobre el NPC antes de actualizar el movimiento
    this.applyNpcEffects();

    // Mueve y actualiza cada ascensor del nivel
    this.updateElevator(
      this.elevator,
      this.elevatorTopY,
      this.elevatorBottomY,
      this.elevatorSpeed,
      "elevatorDirection",
      "Ascensor 1"
    );
    this.updateElevator(
      this.elevator2,
      this.elevator2TopY,
      this.elevator2BottomY,
      this.elevator2Speed,
      "elevator2Direction",
      "Ascensor 2"
    );
    this.updateElevator(
      this.elevator3,
      this.elevator3TopY,
      this.elevator3BottomY,
      this.elevator3Speed,
      "elevator3Direction",
      "Ascensor 3"
    );


    // Comprueba si el jugador y el NPC llegaron a la meta juntos
    this.playerAtGoal = Phaser.Geom.Intersects.RectangleToRectangle(
      this.player.getBounds(),
      this.goalZone.getBounds()
    );
    this.npcAtGoal = Phaser.Geom.Intersects.RectangleToRectangle(
      this.npc.getBounds(),
      this.goalZone.getBounds()
    );

    if (this.playerAtGoal && this.npcAtGoal) {
      this.winLevel();
    }

    if (this.player.y > this.scale.height + 60) {
      this.endGame("Caíste al vacío.");
    }

    if (this.npc.y > this.scale.height + 60) {
      this.endGame("El compañero se cayó.");
    }

    this.bricks.children.iterate((brick) => {
      if (!brick || !brick.active) {
        return;
      }

      if (brick.y > this.scale.height + 100) {
        brick.destroy();
      }
    });
  }

  winLevel() {
    if (this.isGameOver) {
      return;
    }
    this.addScore(100);
    this.endGame("¡Nivel completado! Llegaron juntos a la meta.");
  }

  endGame(message) {
    if (this.isGameOver) {
      return;
    }

    this.isGameOver = true;
    let livesRemaining = this.registry.get("lives");

    if (!message.includes("Nivel completado")) {
      livesRemaining = this.addLife(-1);
    }

    this.statusText.setPosition(this.scale.width / 2, this.scale.height / 2);
    this.statusText.setOrigin(0.5);
    this.statusText.setVisible(true);

    if (message.includes("Nivel completado")) {
      this.statusText.setText(`${message}\nSe reintenta con la tecla ENTER.`);
      this.time.delayedCall(300, () => this.scene.start("Win"));
    } else if (livesRemaining > 0) {
      this.statusText.setText(`${message}\nPerdiste una vida. Te quedan ${livesRemaining} vidas. Se reintenta con la tecla ENTER.`);
    } else {
      this.statusText.setText(`${message}\nNo quedan vidas. FIN DEL JUEGO.`);
      this.time.delayedCall(300, () => this.scene.start("Lose"));
    }

    this.statusText.setColor("#ffd500");

    if (this.timerEvent) {
      this.timerEvent.remove(false);
    }
    if (this.brickTimer) {
      this.brickTimer.remove(false);
    }
  }
}