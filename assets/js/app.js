const lightBlue = document.getElementById("lightBlue");
const violet = document.getElementById("violet");
const orange = document.getElementById("orange");
const green = document.getElementById("green");
const btnEmpezar = document.getElementById("btnEmpezar");
const score = document.getElementById("score");
const lives = document.getElementById("lives");
const gameTime = document.getElementById("gameTime");
const level = document.getElementById("level");

const LAST_LEVEL = 10;
const TOTAL_LIVES = 3;
const SCORE_BY_LEVE = 100;
const GAME_TIME = 60;

class Game {
  constructor() {
    this.initialization = this.initialization.bind(this);
    setTimeout(() => {
      this.initialization();
      this.generateSequence();

      setTimeout(this.nextLevel, 500);
    }, 500);
  }

  initialization() {
    this.nextLevel = this.nextLevel.bind(this);
    this.chooseColor = this.chooseColor.bind(this);
    this.timer = this.timer.bind(this);
    this.validateChooseColor = this.validateChooseColor.bind(this);

    this.interval = null;
    this.currentLevel = 1;
    this.colors = {
      lightBlue,
      violet,
      orange,
      green,
    };
    this.scoreCounter = 0;
    this.lives = TOTAL_LIVES;
    this.toggleBtnEmpezar();
    this.printLevel();
    this.incrementScore();
    this.printLives();
    this.resetTimer(true);
  }

  toggleBtnEmpezar() {
    if (btnEmpezar.classList.contains("hide")) {
      btnEmpezar.classList.remove("hide");
    } else {
      btnEmpezar.classList.add("hide");
    }
  }

  generateSequence() {
    this.sequence = new Array(10)
      .fill(0)
      .map((number) => Math.floor(Math.random() * 4));
  }

  nextLevel() {
    this.currentColorSelected = 0;
    this.incrementScore();
    this.printLevel();
    this.illuminateSequence();
    this.timer();
  }

  printLevel() {
    level.textContent = this.currentLevel;
  }

  incrementScore() {
    if (this.currentLevel > 1) {
      this.scoreCounter += SCORE_BY_LEVE;
      score.textContent = this.scoreCounter;
    } else {
      score.textContent = this.scoreCounter;
    }
  }

  convertNumberToColor(number) {
    switch (number) {
      case 0:
        return "lightBlue";
      case 1:
        return "violet";
      case 2:
        return "orange";
      case 3:
        return "green";
    }
  }

  convertColorToNumber(color) {
    switch (color) {
      case "lightBlue":
        return 0;
      case "violet":
        return 1;
      case "orange":
        return 2;
      case "green":
        return 3;
    }
  }

  illuminateSequence() {
    for (let i = 0; i < this.currentLevel; i++) {
      const color = this.convertNumberToColor(this.sequence[i]);
      setTimeout(() => this.illuminateColor(color), 1000 * i);
    }
    this.addEventsClick();
  }

  illuminateColor(color, cb) {
    this.colors[color].classList.add("light");
    setTimeout(() => {
      this.turnOffColor(color);

      if (cb) {
        cb();
      }
    }, 350);
  }

  turnOffColor(color) {
    this.colors[color].classList.remove("light");
  }

  addEventsClick() {
    this.colors.lightBlue.addEventListener("click", this.chooseColor);
    this.colors.violet.addEventListener("click", this.chooseColor);
    this.colors.orange.addEventListener("click", this.chooseColor);
    this.colors.green.addEventListener("click", this.chooseColor);
  }

  removeEventsClick() {
    this.colors.lightBlue.removeEventListener("click", this.chooseColor);
    this.colors.violet.removeEventListener("click", this.chooseColor);
    this.colors.orange.removeEventListener("click", this.chooseColor);
    this.colors.green.removeEventListener("click", this.chooseColor);
  }

  chooseColor(event) {
    const colorName = event.target.dataset.color;
    const colorNumber = this.convertColorToNumber(colorName);
    this.illuminateColor(colorName, () => {
      this.validateChooseColor(colorNumber);
    });
  }

  validateChooseColor = (colorNumber) => {
    if (colorNumber === this.sequence[this.currentColorSelected]) {
      this.currentColorSelected++;
      if (this.currentColorSelected === this.currentLevel) {
        this.currentLevel++;
        this.removeEventsClick();
        this.resetTimer();

        if (this.currentLevel === LAST_LEVEL + 1) {
          this.wonTheGame();
        } else {
          setTimeout(this.nextLevel.bind(this), 1500);
        }
      }
    } else {
      this.removeEventsClick();
      this.restartLevel("Sorry, you lost");
    }
  };

  restartLevel(title) {
    this.resetTimer();

    if (this.lives === 0) {
      this.lostTheGame();
      return;
    }

    swal({
      title,
      text: `Come on you have ${this.lives} tries!`,
      timer: 3000,
      buttons: false,
    }).then(() => {
      setTimeout(() => {
        this.lives -= 1;
        lives.textContent = this.lives;
        this.currentColorSelected = 0;

        this.timer();
        this.illuminateSequence();
      }, 2000);
    });
  }

  printLives() {
    lives.textContent = this.lives;
  }

  timer() {
    let count = 0;
    gameTime.textContent = GAME_TIME;

    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      count++;
      gameTime.textContent = GAME_TIME - count;

      if (GAME_TIME - count === 0) {
        clearInterval(this.interval);
        this.restartLevel("Sorry, time is up");
      }
    }, 1000);
  }

  resetTimer(full) {
    if (full) {
      gameTime.textContent = GAME_TIME;
    }
    this.interval && clearInterval(this.interval);
  }

  wonTheGame() {
    swal("Congratulations", "You won the game!", "").then(this.initialization);
  }

  lostTheGame() {
    swal("Sorry", "You lost the game :(", "").then(this.initialization);
  }
}

function startGame() {
  window.game = new Game();
}
