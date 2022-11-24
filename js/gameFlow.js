// * game flow
function onCellClicked(elCell, i, j, event) {
  console.log('elCell', elCell)
  //   console.log('event', event)
  //   check if game is on
  if (!gGame.isOn) return
  if (isFirstClick()) firstClickSetup()

  //   check which mouse button was clicked
  switch (event.button) {
    case 0:
      console.log('left')

      //   check cell type - if mine
      if (elCell.classList.contains('type-mine')) {
        // check if already exploded - if yes - skip, if not - explode
        if (elCell.classList.contains('expld')) break
        elCell.classList.add('expld')

        // reduce lives
        gGame.lives--
        console.log('gGame.lives', gGame.lives)
        // render lives
        var elLives = document.querySelector('.life-shown')
        elLives.classList.remove('life-shown')
        // reduce control mines count
        updateControlMinesCount()
        // check lives - if 0 game over, otherwise continue game
        if (gGame.lives === 0) gameOver()
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
      checkVictory()
      break

    case 2:
      if (gBoard[i][j].isShown) return
      if (elCell.classList.contains('expld')) return
      console.log('right')
      updateCellMarked(elCell, i, j)
      checkVictory()
      break
  }
}

// * game flow
function updateCellMarked(elCell, i, j) {
  // check if cell is already marked and unmark it
  if (gBoard[i][j].isMarked) gBoard[i][j].isMarked = false
  // update cell object data - key isMarked:true
  else gBoard[i][j].isMarked = true
  //   update style
  elCell.classList.toggle('marked')
  //   elCell.innerText = FLAG
}

// * game flow
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

// * game flow
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

// * game flow
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
  // console.log('cell.minesAroundCount', board[cellI][cellJ].minesAroundCount)
  //   return the value
  return minesNegsCount
}

// * game flow
function checkVictory() {
  // reset counters each check
  var markedCount = 0
  var shownCount = 0
  // check if all mines are marked
  // check if all cells are shown
  for (var i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].isMarked) markedCount++
      if (gBoard[i][j].isShown) shownCount++
    }
  }

  // apply counters values in global variables
  gGame.markedCount = markedCount
  gGame.shownCount = shownCount
  console.log('gGame.markedCount', gGame.markedCount)
  console.log('gGame.shownCount', gGame.shownCount)
  // update control panel
  updateControlMinesCount(gLevel.mines, gGame.markedCount)

  // check winning condition
  if (
    gGame.markedCount === gLevel.mines &&
    gGame.shownCount === gLevel.size ** 2 - gLevel.mines
  ) {
    console.log('you won')
    // update smiley
    updateControlSmiley('win')
    gGame.isOn = false
  }
}

// * game flow
function gameOver() {
  console.log('Game Over')
  // explode all mines
  var elMines = document.querySelectorAll('.type-mine')
  for (var i = 0; i < elMines.length; i++) {
    elMines[i].classList.add('expld')
  }
  // stop game
  gGame.isOn = false
  // todo: stop timer
  // resetTime()
  //update smiley
  updateControlSmiley('die')
}

// * game flow
function updateControlMinesCount(minesTotal, minesMarked) {
  // calc mines left to mark
  var minesLeft = minesTotal - minesMarked
  //   render count
  var elMinesCounter = document.querySelector('.mines-counter')
  elMinesCounter.innerText = minesLeft
}

// * game flow
function updateControlSmiley(cause) {
  const ALIVE = '😬'
  const WINNER = '😎'
  const DEAD = '😵'
  var smileyStatus
  // check cause for status change
  // if restarting game - update smiley to alive
  // if victory - update smiley to winner
  // if game over - update smiley to dead

  if (cause === 'restart') smileyStatus = ALIVE
  if (cause === 'win') smileyStatus = WINNER
  if (cause === 'die') smileyStatus = DEAD
  // render status
  var elSmiley = document.querySelector('.smiley')
  elSmiley.innerHTML = smileyStatus
}
