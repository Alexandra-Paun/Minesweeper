let nrRows;
let nrCols;
let matrix = [];
let level;
let numberOfMines;
let hiddenBoard = [];
let flag = 0;
let gameOver = 0;
let minesRemained;

function startgame(level) {
    if (level == "easy") {
        numberOfMines = 10;
        nrRows = 9;
        nrCols = 9;
    } else if (level == "medium") {
        numberOfMines = 40;
        nrRows = 16;
        nrCols = 16;
    } else if (level == "hard") {
        numberOfMines = 99;
        nrRows = 16;
        nrCols = 30;
    }
    for (let i = 0; i < 3; ++i) {
        document.getElementsByClassName("level")[i].disabled = true;
    }
    minesRemained = numberOfMines;
    addHiddenBoard();
    addMines();
    addNumbers();
    let mat = document.getElementById('matrix');
    for (let i = 0; i < nrRows; i++) {
        matrix[i] = document.createElement('tr');
        mat.append(matrix[i]);
        for (let j = 0; j < nrCols; j++) {
            matrix[i][j] = document.createElement('td');
            matrix[i][j].innerText = "";
            matrix[i][j].value = 0;
            matrix[i].append(matrix[i][j]);
            clickedCell(matrix, i, j);
        }
    }
}

function addHiddenBoard() {
    for (let i = 0; i < nrRows; ++i) {
        hiddenBoard.push([0])
        for (let j = 0; j < nrCols; ++j) {
            hiddenBoard[i][j] = "0";
        }
    }
}

function addMines() {
    for (let mines = 1; mines <= numberOfMines; ++mines) {
        let r = Math.floor(Math.random() * nrRows);
        let c = Math.floor(Math.random() * nrCols);
        if (hiddenBoard[r][c] == "💣") {
            --mines;
        } else {
            hiddenBoard[r][c] = "💣";
        }
    }
}

function addNumbers() {
    let bombs = 0;
    for (let i = 0; i < nrRows; ++i) {
        for (let j = 0; j < nrCols; ++j) {
            for (let x = i - 1; x <= i + 1; ++x) {
                for (let y = j - 1; y <= j + 1; ++y) {
                    if (x >= 0 && x < nrRows && y >= 0 && y < nrCols) {
                        if (hiddenBoard[x][y] == "💣") {
                            ++bombs;
                        }
                    }
                }
            }
            if (hiddenBoard[i][j] != "💣") {
                if (bombs == 0) {
                    hiddenBoard[i][j] = "";
                } else {
                    hiddenBoard[i][j] = bombs;
                }
            }
            bombs = 0;
        }
    }
}

function switchFlag() {
    if (flag == 0) {
        flag = 1;
        document.getElementById("flag").style = "background-color: grey";
    } else {
        flag = 0;
        document.getElementById("flag").style = "background-color: white";
    }
}

function clickedCell(matrix, i, j) {
    matrix[i][j].addEventListener('mousedown', function (event) {
        if (gameOver) {
            return;
        }
        if (matrix[i][j].innerText == "🚩" && flag == 0) {
            return;
        } else if (matrix[i][j].innerText == "🚩" && flag == 1) {
            matrix[i][j].innerText = "";
            matrix[i][j].value == 0;
            return;
        }
        if (flag == 1 && matrix[i][j].value == 0) {
            matrix[i][j].innerText = "🚩";
        } else if (flag == 0) {
            if (hiddenBoard[i][j] == "0") {
                matrix[i][j].innerText = "";
            } else {
                matrix[i][j].innerText = hiddenBoard[i][j];
            }
            matrix[i][j].value = 1;
            matrix[i][j].style = "background-color: #e0e0e0";
            if (matrix[i][j].innerText == "💣") {
                revealMines();
                gameOver = 1;
                document.getElementById("id-win").innerHTML = "You Lost";
                document.getElementById("id-win").style = "font-size: 20px";
            }
        }
        if (hiddenBoard[i][j] == "" && flag == 0) {
            findEmptyCells(i, j);
        }
        checkTheWinner();
    });
}

function checkTheWinner() {
    let counter = 0;
    for (let i = 0; i < nrRows; ++i) {
        for (let j = 0; j < nrCols; ++j) {
            if (matrix[i][j].value == 0) {
                ++counter;
            }
        }
    }
    if (counter == numberOfMines) {
        displayMessage();
        gameOver = 1;
    }
}

function displayMessage() {
    document.getElementById("id-win").innerHTML = "You Won";
    document.getElementById("id-win").style = "font-size: 20px";
    addFlags();
}

function revealMines() {
    for (let i = 0; i < nrRows; ++i) {
        for (let j = 0; j < nrCols; ++j) {
            if (hiddenBoard[i][j] == "💣") {
                matrix[i][j].innerText = hiddenBoard[i][j];
                matrix[i][j].style = "background-color: red";
            }
        }
    }
}

function addFlags() {
    for (let i = 0; i < nrRows; ++i) {
        for (let j = 0; j < nrCols; ++j) {
            if (hiddenBoard[i][j] == "💣") {
                matrix[i][j].innerText = "🚩";
            }
        }
    }
}

function findEmptyCells(i, j) {
    for (let x = i - 1; x <= i + 1; ++x) {
        for (let y = j - 1; y <= j + 1; ++y) {
            if (x >= 0 && x < nrRows && y >= 0 && y < nrCols) {
                if (hiddenBoard[x][y] != "💣" && matrix[x][y].value == 0) {
                    matrix[x][y].innerText = hiddenBoard[x][y];
                    matrix[x][y].value = 1;
                    matrix[x][y].style = "background-color: #e0e0e0";
                    if (hiddenBoard[x][y] == "") {
                        findEmptyCells(x, y);
                    }
                }
            }
        }
    }
}
