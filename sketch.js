// PRELOAD
let hiddenTexture, revealedTexture, flagTexture, mineTexture;
let mineFont;

function preload() {
  hiddenTexture = loadImage("assets/textures/hidden.png");
  revealedTexture = loadImage("assets/textures/revealed.png");
  flagTexture = loadImage("assets/textures/flag.png");
  mineTexture = loadImage("assets/textures/mine.png");

  mineFont = loadFont("assets/fonts/mine-sweeper.ttf");
}

// GAME
let colsSlider;
let rowsSlider;
let difficultySlider;

let lastCols = 10;
let lastDifficulty = 10;
let lastRows = 10;

let minesweeper;

function generateMinesweeper() {
  lastCols = colsSlider.value();
  lastRows = rowsSlider.value();
  lastDifficulty = difficultySlider.value();

  let dimX = screen.width / (2 * lastCols);
  let dimY = screen.height / (2 * lastRows);

  let cellDim = Math.min(dimX, dimY);

  minesweeper = new Minesweeper(lastCols, lastRows, cellDim, lastDifficulty);

  createCanvas(
    minesweeper.cols * minesweeper.cellDim,
    minesweeper.rows * minesweeper.cellDim
  );
}

function setup() {
  colsSlider = createSlider(10, 30, 20, 1);
  rowsSlider = createSlider(10, 20, 16, 1);
  difficultySlider = createSlider(10, 90, 20, 1);

  colsSlider.position(colsSlider.width, 40);
  rowsSlider.position(rowsSlider.width, 80);
  difficultySlider.position(difficultySlider.width, 120);

  generateMinesweeper();
  textFont(mineFont);
}

function draw() {
  background(220);

  if (
    lastCols != colsSlider.value() ||
    lastRows != rowsSlider.value() ||
    lastDifficulty != difficultySlider.value()
  ) {
    generateMinesweeper();
  }

  minesweeper.render();
}

function keyPressed() {
  if (key == "r") {
    minesweeper.reset();
  }
}

function mouseClicked(event) {
  // TRIGGER LEFT CLICK
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    let x = floor(mouseX / minesweeper.cellDim);
    let y = floor(mouseY / minesweeper.cellDim);
    if (!minesweeper.isFlagged(x, y)) minesweeper.uncover(x, y);
  }
}

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();

  // TRIGGER RIGHT CLICK
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    let x = floor(mouseX / minesweeper.cellDim);
    let y = floor(mouseY / minesweeper.cellDim);
    minesweeper.toggleFlag(x, y);
  }
});
