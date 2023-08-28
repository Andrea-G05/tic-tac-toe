function selectCell () {
	game.currentTurn.makeMove(this);
}

function player (name, sign) {
	function makeMove(cell) {
		if(!cell.hasChildNodes()) {
			let p = document.createElement("p");
			p.textContent = sign;
			cell.appendChild(p);

			gameboard.occupyCell(cell);
			game.checkIfWon(sign);
			
			game.changeTurn();
			return `${player} has made its move`
		}

		else {
			return "Can't make move";
		}
	}

	function win() {
		return `${name} won!`
	}

	return {name, sign, makeMove, win}
}

user = player("user", "X");

computer = function(pName, pSign) {

	let {name, sign, makeMove, win} = player(pName, pSign)
	function chooseMove() {
		chosenCell = Math.floor(Math.random()*gameboard.emptyCells.length)
		console.log(chosenCell + " chooseMove");
		makeMove(emptyCells[chosenCell]);
	}	

	return {name, sign, makeMove, win, chooseMove}
}("computer", "O");

let game = function () {
	let currentTurn = user;

	function changeTurn () {
		if (currentTurn === user){
			currentTurn = computer;
			computer.chooseMove();
		}
		else
			currentTurn = user;
	}

	function checkIfWon() {
		/* console.log("win WIP") */
	}

	return {currentTurn, changeTurn, checkIfWon}
}();

let gameboard = function() {
	allCells = document.querySelectorAll(".grid > div")
	emptyCells = [...allCells]

	let removedCells;

	function occupyCell(cellToRemove) {
		console.log(cellToRemove.dataset.xy + " removed");
		newEmptyCells = emptyCells.filter(cell => 
			cell.dataset.xy !== cellToRemove.dataset.xy);
		emptyCells = newEmptyCells;
	}

	resetEmpty = () => emptyCells = [...allCells];

	return {emptyCells, occupyCell, resetEmpty, removedCells};
}();

document.querySelectorAll(".grid > div").forEach(element => 
	element.addEventListener("click", selectCell));	