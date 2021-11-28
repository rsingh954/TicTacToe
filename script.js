'use strict'


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
            alert('its a tie!')
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

function announceWinner(player, index){
    const board = document.querySelector('#board')
    for(let i = 0; i < 3; i++){
        board.children[index[i]].style.backgroundColor = player === 'CPU' ? 'red' :'green'
    }
    alert(player + ' wins!!!')
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

