console.log('hi')

// will be determined by the user choice
var gLevel = {
  size: 4,
  mines: 2,
}

gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
}

var gBoard

function initGame() {
  gGame.isOn = true
  gBoard = createBoard(gLevel.size)
  console.table(gBoard)
  console.log('gBoard', gBoard)
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
  board[1][1].isMine = true
  board[1][0].isMine = true
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
      const className = `cell type-${type} ${shown} i-${i}j-${j}`

      strHTML += `<td data-i="${i}" data-j="${j}" 
      class="${className}"
      onclick="onCellClicked(this, ${i}, ${j})">
      ${cellContent}
      </td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody>'

  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

function setMinesNegsCount(cellI, cellJ, board) {
  var MinesNegsCount = 0
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === cellI && j === cellJ) continue
      if (board[i][j].isMine) MinesNegsCount++
    }
  }
  //   update the checked cell object data key minesAroundCount = value to the key
  board[cellI][cellJ].minesAroundCount = MinesNegsCount
  console.log('cell.minesAroundCount', board[cellI][cellJ].minesAroundCount)
  //   return the value
  return MinesNegsCount
}

function onCellClicked(elCell, i, j) {
  console.log('elCell', elCell)
  //   console.log('j', j)
  //   console.log('i', i)
  //   check type - if mine
  if (elCell.classList.contains('type-mine')) {
    // execute game over
    // todo: show all mines (should be in game over?)
    gameOver()
  }

  //   check type - if not mine
  if (elCell.classList.contains('type-not-mine')) {
    console.log('open cell')
    // console.log('gBoard[i][j].isShown', gBoard[i][j].isShown)
    if (gBoard[i][j].isShown) return

    // check negs
    var MinesNegsCount = setMinesNegsCount(i, j, gBoard)
    // update cell
    updateCell(i, j, MinesNegsCount)

    // if no mines are negs - open negs
    if (!MinesNegsCount) {
      expandShown(gBoard, elCell, i, j)
    }
  }
}

function updateCell(i, j, MinesNegsCount) {
  // update cell object data - key isShown:true
  gBoard[i][j].isShown = true
  const elCurrCell = document.querySelector(`.i-${i}j-${j}`)
  // show how many negs are mines only if its a valid value
  elCurrCell.innerText = `${MinesNegsCount}`
  //   update style
  console.log('elCurrCell', elCurrCell)
  elCurrCell.classList.add('shown')
}

function expandShown(board, elCell, i, j) {
  console.log('elCell', elCell)
  var negs = []
  for (var iIdx = i - 1; iIdx <= i + 1; iIdx++) {
    if (iIdx < 0 || iIdx >= board.length) continue
    for (var jIdx = j - 1; jIdx <= j + 1; jIdx++) {
      if (jIdx < 0 || jIdx >= board[iIdx].length) continue
      if (iIdx === i && jIdx === j) continue
      console.log('iIdx, jIdx', iIdx, jIdx)

      updateCell(iIdx, jIdx, '')
    }
  }
}

// function renderCell(cellI, cellJ, newClass) {
//   console.log('newClass', newClass)
//   console.log('cellI, cellJ', cellI, cellJ)
//   // Select the elCell and set the value
//   const elCurrCell = document.querySelector(`.i-${cellI}j-${cellJ}`)
//   console.log('elCurrCell', elCurrCell)
//   elCurrCell.classList.add(`${newClass}`)
// }

function gameOver() {
  console.log('Game Over')
  // todo: stop timer
  // todo: change smiley
  // todo: don't allow any more clicking until starting a new game
}
