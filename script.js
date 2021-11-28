'use strict'
var modal = document.getElementById("myModal");

window.onclick = function(event) {
    if (event.target != modal) {
      modal.style.visibility = "hidden";
    }
  } 

const gameBoard = (() =>{
    const board = document.querySelector("#board");
    let _board = new Array(9)

    /**
    * @param {*} index will be retrieved when user clicks
    * @param {*} mark will be retrieved from player factory
    */
    const setMarker = (index, mark)=>{
        if(_board[index] === undefined){
            _board[index] = mark
            render(board)
            return "ok"
        }else return "no"

    }
    const setMarkerAI = (index, mark) =>{
        if(!board.children[index]){
            announceWinner('Its a tie!')
            endGame()
            return
        }
        if(_board[index] === undefined){
            _board[index] = mark
            gameController.checkWinner()
            render(board)
        }else return
    }
    const getEmptyFields = () => {
        let sqaures = []
        for(let i = 0; i < 9; i++){
            if(_board[i] == undefined){
                sqaures.push(i)
            }
        }
        return sqaures
    }
    const clear = () => {
        for(let i = 0; i < 9; i++){
            _board[i] = undefined
        }
        render(board)
    }

    return {setMarker, setMarkerAI, getEmptyFields, clear, _board}
})();


const AI = (() =>{
    const getEmptyFields = () => {
        return gameBoard.getEmptyFields()
    }

    const getRandomInt = () => Math.floor((Math.random() * 9)) 

    const placeMarker = () => {
        let emptyFields = getEmptyFields()
        let randomInt = getRandomInt()
        if(emptyFields.includes(randomInt)){
            gameBoard.setMarkerAI(randomInt, "O")
        }else if(!emptyFields.includes(randomInt)){
            randomInt = Math.floor((Math.random() * emptyFields.length))
            gameBoard.setMarkerAI(emptyFields[randomInt], "O")
        }
    }
 
    return {placeMarker}
    
})();

const gameController = (() => {
    const board = document.querySelector("#board");

    function checkWinner(){
        let gameWon = null
        const winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        //we need to refactor this
        winningConditions.forEach((item)=>{

            if(item.every((it) => gameBoard._board[it] === 'X')){
                gameWon = item
                announceWinner("Player", gameWon)
                endGame();
                return gameWon

            }
            else if(item.every((it) => gameBoard._board[it] === 'O')){
                gameWon = item
                announceWinner("CPU", gameWon)
                endGame();
                return gameWon
            }
        })
        return gameWon
    }

    const playerMove = (square) =>{
        if(checkWinner()) return
        if(gameBoard.setMarker(square.target.id, 'X') === "ok"){
            aiMove()
        }else{
            return 'WOOPS'
        }
             
    }
    const aiMove = () => {
        if(checkWinner()) return
        setTimeout(() => {
            AI.placeMarker()
        }, 100)

    }

    return{playerMove, checkWinner}
})();

function announceWinner(player, index=[0,1,2,3,4,5,6,7,8]){
    const board = document.querySelector('#board')
    if(player !== 'Its a tie!'){
        for(let i = 0; i < 3; i++){
            board.children[index[i]].style.backgroundColor = player === 'CPU' ? 'red' :'green'
        }
    }else{
        for(let j = 0; j < 9; j++ ){
            board.children[j].style.backgroundColor = 'green'
        }
    }
    setTimeout(() => {
        modal.style.visibility = "visible";
        modal.textContent = player === 'Its a tie!'? 'Its a tie!' :  `${player} wins!!!`
    }, 100)

    endGame();
}
function render(board){
    let gameData = gameBoard._board
    for(let i = 0; i < 9; i++){
        board.children[i].textContent = gameData[i]
    }
}
const Player = function(name, mark){
    this.name = name;
    this.mark = mark;
}

const player1 = new Player("Player One", "X");
const player2 = new Player("Player Two", "0");


function Reset(){
    let flag;
    gameBoard.clear()
    flag = true;
    const sqaures = document.querySelectorAll('.square');
    sqaures.forEach((sqaure) => {
        sqaure.style.backgroundColor = ''
    })
    startGame();


}

const startGame = () =>{
    const sqaures = document.querySelectorAll('.square');
    sqaures.forEach((sqaure) => {
        sqaure.addEventListener('click',gameController.playerMove)
    })

};
startGame()


function endGame(){
    const sqaures = document.querySelectorAll('.square');
    let func = gameController.playerMove
    sqaures.forEach((sqaure) => {
        sqaure.removeEventListener('click', func, false)
    })
}

// // Get the modal
// var modal = document.getElementById("myModal");

// // Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks on the button, open the modal
// btn.onclick = function() {
//   modal.style.display = "block";
// }

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// } 