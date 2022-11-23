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

const MINE = '💣'
const FLAG = '🚩'

var gBoard

function initGame() {
  gGame.isOn = true
  gBoard = createBoard(gLevel.size)
  setMinesRnd(gBoard)

  //   console.table(gBoard)
  //   console.log('gBoard', gBoard)
  // todo: set timer (will be activated with first board click)
  // todo: set mines count
  renderBoard(gBoard)
}

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
  //   board[1][1].isMine = true
  //   board[1][0].isMine = true
  return board
}

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

function onCellClicked(elCell, i, j, event) {
  console.log('elCell', elCell)
  //   console.log('event', event)
  //   check if game is on
  if (!gGame.isOn) return

  //   check which mouse button was clicked
  switch (event.button) {
    case 0:
      console.log('left')

      //   check cell type - if mine
      if (elCell.classList.contains('type-mine')) {
        // execute game over
        // todo: show all mines (should be in game over?)
        gameOver()
      }

      //   check cell type - if not mine
      if (elCell.classList.contains('type-not-mine')) {
        console.log('open cell')
        // console.log('gBoard[i][j].isShown', gBoard[i][j].isShown)
        // check if already shown
        if (gBoard[i][j].isShown) return

        // check negs
        var minesNegsCount = setMinesNegsCount(i, j, gBoard)
        // update cell
        updateCellShown(i, j, minesNegsCount)

        // if no mines are negs - open negs
        if (!minesNegsCount) {
          expandShown(gBoard, elCell, i, j)
        }
      }
      break

    case 2:
      if (gBoard[i][j].isShown) return
      console.log('right')
      updateCellMarked(elCell, i, j)
      break
  }
}

function updateCellMarked(elCell, i, j) {
  // update cell object data - key isMarked:true
  gBoard[i][j].isMarked = true
  //   update style
  elCell.classList.toggle('marked')
  //   elCell.innerText = FLAG
}

function updateCellShown(i, j, minesNegsCount) {
  // update cell object data - key isShown:true
  gBoard[i][j].isShown = true
  const elCurrCell = document.querySelector(`.i-${i}j-${j}`)
  console.log('elCurrCell', elCurrCell)
  // show how many negs are mines only if its a valid value
  if (minesNegsCount) elCurrCell.innerText = `${minesNegsCount}`
  //   update style
  elCurrCell.classList.add('shown')
}

function expandShown(board, elCell, cellI, cellJ) {
  //   console.log('elCell', elCell)
  var negs = []
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === cellI && j === cellJ) continue

      updateCellShown(i, j, setMinesNegsCount(i, j, gBoard))
    }
  }
}

function setMinesNegsCount(cellI, cellJ, board) {
  var minesNegsCount = 0
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === cellI && j === cellJ) continue
      if (board[i][j].isMine) minesNegsCount++
    }
  }
  //   update the checked cell object data key minesAroundCount = value to the key
  board[cellI][cellJ].minesAroundCount = minesNegsCount
  console.log('cell.minesAroundCount', board[cellI][cellJ].minesAroundCount)
  //   return the value
  return minesNegsCount
}

function gameOver() {
  console.log('Game Over')
  // todo: stop game
  gGame.isOn = false
  // todo: stop timer
  // todo: change smiley
}

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

function shuffle(items) {
  var randIdx, keep, i
  for (i = items.length - 1; i > 0; i--) {
    randIdx = getRandomInt(0, items.length - 1)

    keep = items[i]
    items[i] = items[randIdx]
    items[randIdx] = keep
  }
  return items
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
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
