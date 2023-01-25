class Cell {
  constructor(isMine) {
    this.isCovered = true;
    this.isMine = isMine; // (bool)
    this.flag = false;
    this.nearMines = 0;
  }

  incrementNearMines() {
    this.nearMines += 1;
  }

  cover() {
    this.isCovered = true;
  }

  uncover() {
    this.isCovered = false;
  }

  toggleFlag() {
    this.flag = !this.flag;
  }
}
