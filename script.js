const mockGameboardArray = ["X", "X", "X", "O", "X", "O", "X", "X", "X"]

function createPlayer(marker) {
    let playerName;
    const playerMarker = marker

    function setName(name) {
        playerName = name
    }

    function resetName() {
        playerName = undefined
    }

    function getName() {
        return playerName
    }

    function getMarker() {
        return playerMarker
    }

    return {getName, getMarker, setName, resetName}
}

const gameBoard = (function () {
    const gameArray = ["","","","","","","","",""]
    let lastMove = "O"

    function setMarker(marker, position) {
        if (gameArray[position] == "") {
            gameArray[position] = marker
            console.log(marker + " set at " + position)
            lastMove = marker
            displayController.updateDisplay(position, marker)
            displayController.updateCurrentPlayerDisplay()
        } else {
            console.log("Field has already been set")
        }
  
    }

    function getLastMove() {
        return lastMove
    }

    function getBoard() {
        return gameArray
    }

    function resetGame() {
        for(let i = 0; i < 9; i++) {
            gameArray[i] = ""
        }

        playerFirst.resetName()
        playerSecond.resetName()
        lastMove = "O"
        displayController.updateCurrentPlayerDisplay()
        displayController.showDisplay(gameBoard.getBoard())
    }

    function checkGame(currentPlayer) {
        console.log(gameArray)
        console.log(currentPlayer.getMarker())
        //check rows
        for(let i = 0; i < 9; i = i + 3) {
            console.log(gameArray[i])
            if( gameArray[i] == currentPlayer.getMarker() &&
                gameArray[i] == gameArray[i + 1] && 
                gameArray[i] == gameArray[i + 2]) {
                displayController.showDialogOnWin(currentPlayer)
            }
        }

        //check columns
        for(let j = 0; j < 3; j++) {
            if( gameArray[j] == currentPlayer.getMarker() &&
                gameArray[j] == gameArray[j + 3] &&
                gameArray[j] == gameArray[j + 6]) {
                displayController.showDialogOnWin(currentPlayer)
            }
        }

        if((gameArray[0] == currentPlayer.getMarker() &&
            gameArray[0] == gameArray[4] &&
            gameArray[0] == gameArray[8]) ||
            (gameArray[2] == currentPlayer.getMarker() &&
            gameArray[2] == gameArray[4] &&
            gameArray[2] == gameArray[6])) {
                displayController.showDialogOnWin(currentPlayer)
        }
        
        if(!gameArray.includes("")) {
            // draw
            displayController.showDialogOnDraw()
        }

    }

    return {setMarker, getBoard, resetGame, getLastMove, checkGame}
})()

const displayController = (function() {

    function showDisplay(gameBoardArray) {
        document.querySelectorAll(".gameboard-container .gamefield").forEach(field => {
            field.innerText = gameBoardArray[field.dataset.id]
        })
        
    }

    function updateDisplay(position, value) {
        document.querySelector(`.gameboard-container [data-id= "${position}"]`).innerText = value
    }

    function setPlayerNames(event) {
        event.preventDefault()

        let player1Name = document.getElementById("player1").value
        let player2Name = document.getElementById("player2").value

        playerFirst.setName(player1Name)
        playerSecond.setName(player2Name)

        updateCurrentPlayerDisplay()

        event.target.reset()

    }

    function updateCurrentPlayerDisplay() {
        const latestMove = gameBoard.getLastMove()
        let currentPlayerDiv = document.querySelector(".currentplayer-container")
        if(latestMove == "X") {
            if(playerSecond.getName() != undefined) {
                currentPlayerDiv.innerText = "It is " + playerSecond.getName() + "'s turn."
            } else {
                currentPlayerDiv.innerText = "It is the second player's turn."
            }
        } else {
            if(playerFirst.getName() != undefined) {
                currentPlayerDiv.innerText = "It is " + playerFirst.getName() + "'s turn."
            } else {
                currentPlayerDiv.innerText = "It is the first player's turn."
            }
        }
    }

    function putMoveIntoArray(event, currentGameBoard, currentPlayer) {
        let clickedFieldIndex = event.target.getAttribute("data-id")
        let currentMarker = currentPlayer.getMarker()
        currentGameBoard.setMarker(currentMarker, clickedFieldIndex)
        currentGameBoard.checkGame(currentPlayer)
    }

    function showDialogOnWin(winner) {
        const dialog = document.querySelector("dialog")
        const dialogText = document.querySelector("dialog p")
        if(winner.getName() != undefined) {
            dialogText.innerText = winner.getName() + " has won!"
        } else {
            if (winner.getMarker() == "X") {
                dialogText.innerText = "The first player has won!"
            } else {
                dialogText.innerText = "The second player has won!"
            }
        }
        dialog.showModal()
    }

    function showDialogOnDraw() {
        const dialog = document.querySelector("dialog")
        const dialogText = document.querySelector("dialog p")
        dialogText.innerText = "Draw!"
        dialog.showModal()
    }

    return {showDisplay, updateDisplay, setPlayerNames, putMoveIntoArray, updateCurrentPlayerDisplay, showDialogOnWin, showDialogOnDraw}
})()

const playerFirst = createPlayer("X")
const playerSecond = createPlayer("O")

// Set Playernames after Buttonclick
document.getElementById("playerform").addEventListener("submit", displayController.setPlayerNames)

// Set Marker after Click on Field
document.querySelectorAll(".gameboard-container .gamefield").forEach(field => {
    field.addEventListener("click", function(e) {
        let latestMove = gameBoard.getLastMove()
        if(latestMove == "O") {
            displayController.putMoveIntoArray(e, gameBoard, playerFirst)
        } else {
            displayController.putMoveIntoArray(e, gameBoard, playerSecond)
        }
    })
})

// Reset Game after Dialog Buttonclick
document.querySelector("dialog button").addEventListener("click", (e) => {
    gameBoard.resetGame()
    e.target.parentNode.close()
})

// Reset Player Names after Buttonclick
document.getElementById("resetNameButton").addEventListener("click", (e) => {
    playerFirst.resetName()
    playerSecond.resetName()
    displayController.updateCurrentPlayerDisplay()
})

// Reset Game after Buttonclick
document.getElementById("resetGameButton").addEventListener("click", gameBoard.resetGame)

// Show Display after Page Load
displayController.showDisplay(gameBoard.getBoard())

