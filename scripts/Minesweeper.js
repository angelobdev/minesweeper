const STATE_PLAYING = 0;
const STATE_LOST = 1;
const STATE_WIN = 2;

class Minesweeper {
  constructor(cols, rows, cellDim, difficulty) {
    // Initializing class members
    this.cols = cols;
    this.rows = rows;
    this.cellDim = cellDim;
    this.difficulty = difficulty;

    this.grid = [];
    this.state = STATE_PLAYING;

    this.generateGrid();
  }

  generateGrid() {
    // Generating grid
    this.grid = Array(this.cols)
      .fill()
      .map(() =>
        Array(this.rows)
          .fill()
          .map(() => {
            let rand = Math.floor(Math.random() * 100) + 1;
            let mine = rand > 100 - this.difficulty ? true : false;
            return new Cell(mine);
          })
      );

    // Calculating cell values
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        let cell = this.grid[x][y];
        if (cell.isMine) {
          ///DEBUG
          //console.log("Mine in " + x + ", " + y);

          //LEFT SIDE
          if (x > 0) {
            if (y > 0) this.setNearMine(x - 1, y - 1);
            this.setNearMine(x - 1, y);
            if (y < this.rows - 1) this.setNearMine(x - 1, y + 1);
          }

          // SAME SIDE
          if (y > 0) this.setNearMine(x, y - 1);
          if (y < this.rows - 1) this.setNearMine(x, y + 1);

          // RIGHT SIDE
          if (x < this.cols - 1) {
            if (y > 0) this.setNearMine(x + 1, y - 1);
            this.setNearMine(x + 1, y);
            if (y < this.rows - 1) this.setNearMine(x + 1, y + 1);
          }
        }
      }
    }
  }

  render() {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        let cell = this.grid[x][y];

        /// RENDERING
        stroke(0);
        strokeWeight(1);
        if (cell.isCovered) {
          /// COVERED RENDERING
          image(
            hiddenTexture,
            x * this.cellDim,
            y * this.cellDim,
            this.cellDim,
            this.cellDim
          );
          /// FLAG RENDERING
          if (cell.flag) {
            image(
              flagTexture,
              x * this.cellDim,
              y * this.cellDim,
              this.cellDim,
              this.cellDim
            );
          }
        } else {
          /// UNCOVERED RENDERING
          image(
            revealedTexture,
            x * this.cellDim,
            y * this.cellDim,
            this.cellDim,
            this.cellDim
          );

          if (cell.isMine) {
            /// MINE RENDERING
            image(
              mineTexture,
              x * this.cellDim,
              y * this.cellDim,
              this.cellDim,
              this.cellDim
            );
          } else if (cell.nearMines != 0) {
            translate(this.cellDim / 2, this.cellDim / 2);
            /// VALUE RENDERING
            this.fillValue(cell.nearMines);
            textAlign(CENTER, CENTER);
            textSize(this.cellDim / 2);
            text(cell.nearMines, x * this.cellDim, y * this.cellDim);
            translate(-this.cellDim / 2, -this.cellDim / 2);
          }
        }
      }
    }

    if (this.state === STATE_LOST) {
      //LOST
      stroke(255);
      strokeWeight(6);
      fill(255, 0, 0);
      textAlign(CENTER, CENTER);
      textSize(height / 10);
      text("YOU LOST", width / 2, height / 2);
    } else if (this.state === STATE_WIN) {
      //WIN
      stroke(0);
      strokeWeight(6);
      fill(0, 255, 0);
      textAlign(CENTER, CENTER);
      textSize(height / 10);
      text("YOU WON!", width / 2, height / 2);
    }

    /// I DONT LIKE THIS
    // if (this.state === STATE_LOST || this.state === STATE_WIN) {
    //   //RESTART
    //   stroke(255);
    //   strokeWeight(3);
    //   fill(0);
    //   textAlign(CENTER, CENTER);
    //   textSize(height / 16);
    //   text(
    //     "Press 'R' to restart the game!",
    //     width / 2,
    //     height / 2 + height / 12
    //   );
    // }
  }

  fillValue(value) {
    switch (value) {
      case 1:
        fill(32, 24, 255); // blue
        break;
      case 2:
        fill(25, 255, 32); // green
        break;
      case 3:
        fill(255, 24, 32); // red
        break;
      case 4:
        fill(106, 13, 173); // light purple
        break;
      case 5:
        fill(48, 25, 52); // dark purple
        break;
      case 6:
        fill(0, 255, 255); // cyan
        break;
      case 7:
        fill(0); // black
        break;
      case 8:
        fill(24); // dark gray
        break;
      default:
        fill(0);
        break;
    }
  }

  setNearMine(x, y) {
    let cell = this.grid[x][y];
    if (!cell.isMine) cell.incrementNearMines();
  }

  endGame(state) {
    this.uncoverAll();
    this.state = state;
  }

  uncoverAll() {
    this.grid.forEach((cellArray) => {
      cellArray.forEach((cell) => {
        if (cell.isCovered) cell.uncover();
      });
    });
  }

  uncover(x, y) {
    /// UNCOVERING
    let cell = this.grid[x][y];

    // uncover
    if (cell.isCovered) {
      cell.uncover();

      //if it is a mine end the game
      if (cell.isMine) {
        this.endGame(STATE_LOST);
        return;
      }

      // if cell has no near mines -> uncover its neighbor
      if (cell.nearMines == 0) {
        //LEFT SIDE
        if (x > 0) {
          if (y > 0) this.uncover(x - 1, y - 1);
          this.uncover(x - 1, y);
          if (y < this.rows - 1) this.uncover(x - 1, y + 1);
        }

        //SAME SIDE
        if (y > 0) this.uncover(x, y - 1);
        if (y < this.rows - 1) this.uncover(x, y + 1);

        // RIGHT SIDE
        if (x < this.cols - 1) {
          if (y > 0) this.uncover(x + 1, y - 1);
          this.uncover(x + 1, y);
          if (y < this.rows - 1) this.uncover(x + 1, y + 1);
        }
      }
    }
  }

  checkWin() {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        let cell = this.grid[x][y];
        if (cell.isMine && !cell.flag) return false;
      }
    }
    return true;
  }

  toggleFlag(x, y) {
    this.grid[x][y].toggleFlag();
    if (this.checkWin()) {
      this.endGame(STATE_WIN);
    }
  }

  isFlagged(x, y) {
    return this.grid[x][y].flag;
  }

  reset() {
    this.state = STATE_PLAYING;
    this.generateGrid();
  }
}
