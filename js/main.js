// console.log('hi')

// will be determined by the user choice
var gLevel = {
  size: 4,
  mines: 2,
}

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
}

var gBoard
var gInterval
var gStartTime

// * set board
function initGame() {
  gGame.isOn = true
  if (gInterval) clearInterval(gInterval)
  resetTime()
  gBoard = createBoard(gLevel.size)
  setMinesRnd(gBoard)
  updateControlMinesCount(gLevel.mines, gGame.markedCount)
  updateControlSmiley('restart')

  //   console.table(gBoard)
  //   console.log('gBoard', gBoard)
  // todo: set timer (will be activated with first board click)
  // todo: set mines count
  renderBoard(gBoard)
}

// * set board
function createBoard(boardSize) {
  var board = []
  for (var i = 0; i < boardSize; i++) {
    board.push([])
    for (var j = 0; j < boardSize; j++) {
      // insert object / array / variable to each cell
      board[i][j] = {
        //negs loop will calculate this
        minesAroundCount: null,
        isShown: false,
        isMine: false,
        isMarked: false,
        i: i,
        j: j,
      }
    }
  }
  // locating mines manually
  //   board[1][1].isMine = true
  //   board[1][0].isMine = true
  return board
}

// * set board
function renderBoard(board) {
  var strHTML = '<tbody>'
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      const cellContent = ''
      var type = board[i][j].isMine ? 'mine' : 'not-mine'
      var shown = board[i][j].isShown ? 'shown' : ''
      const classes = `cell type-${type} ${shown} i-${i}j-${j}`

      strHTML += `<td id="cell-${i}-${j}" 
      class="${classes}"
      onmousedown="onCellClicked(this, ${i}, ${j},event)">
      ${cellContent}
      </td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody>'

  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

// * set board
function setLevel(elLvlBtn) {
  console.log('elLvlBtn', elLvlBtn)
  switch (elLvlBtn.innerText) {
    case 'Beginner':
      gLevel.size = 4
      gLevel.mines = 2
      initGame()
      break
    case 'Medium':
      gLevel.size = 8
      gLevel.mines = 13
      initGame()
      break
    case 'Expert':
      gLevel.size = 12
      gLevel.mines = 30
      initGame()
      break
  }
}

// * set board
function setMinesRnd(board) {
  var minesCount = gLevel.mines
  const possiblesCoords = []
  //   get all possible locations for mines
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      possiblesCoords.push({ i, j })
    }
  }
  // shuffle locations array
  shuffle(possiblesCoords)

  // locate mines
  for (var i = 0; i < possiblesCoords.length; i++) {
    const posI = possiblesCoords[i].i
    const posJ = possiblesCoords[i].j

    if (board[posI][posJ].isShown) continue
    if (board[posI][posJ].isMine) continue
    board[posI][posJ].isMine = true

    minesCount--
    if (minesCount === 0) return
  }
}

// * set board / game flow?
function startTimer() {
  gStartTime = Date.now()
  gInterval = setInterval(() => {
    const seconds = (Date.now() - gStartTime) / 1000
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = seconds.toFixed(0)
  }, 1)
}

function resetTime() {
  var elTimer = document.querySelector('.timer')
  elTimer.innerText = '0'
}

// function restartGame() {
//   gGame.isOn = true
//   gBoard = createBoard(gLevel.size)
//   //   console.table(gBoard)
//   //   console.log('gBoard', gBoard)
//   renderBoard(gBoard)
// }

// function renderCell(cellI, cellJ, newClass) {
//   console.log('newClass', newClass)
//   console.log('cellI, cellJ', cellI, cellJ)
//   // Select the elCell and set the value
//   const elCurrCell = document.querySelector(`.i-${cellI}j-${cellJ}`)
//   console.log('elCurrCell', elCurrCell)
//   elCurrCell.classList.add(`${newClass}`)
// }

// * to be located in cellclicked function
if (isFirstClick()) firstClickSetup()

function isFirstClick() {
  if (!gInterval && gGame.isOn) {
    return true
  }
}

// function firstClickSetup() {
//   startTimer()

//   // gGame.setMines()
//   gGame.cellsLeft = gLevel.size ** 2 - gGame.marksLeft
// }

// function startTimer(secsPassed = 0) {
//   const startTime = Date.now()
//   gGame.timerIntrvlIdx = setInterval(
//     () => updateTime(startTime, secsPassed),
//     1000
//   )
// }
