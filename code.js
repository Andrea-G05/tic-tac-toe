const player = (name, sign) => {
	const  makeMove = (cell) => {
		if(!cell.hasChildNodes()) {
			let p = document.createElement("p");
			p.textContent = sign;
			cell.appendChild(p);

			gameboard.occupyCell(cell, sign);
			game.checkIfWon(sign);
			
			game.changeTurn();
			return `${player} has made its move`
		}

		else {
			return "Can't make move";
		}
	}

	const win = () => {
		return `${name} won!`
	}

	return {name, sign, makeMove, win}
}

const user = player("user", "X");

const computer = function(pName, pSign) {

	const {name, sign, makeMove, win} = player(pName, pSign)

	const chooseMove = () => {
		let emptyCells = gameboard.returnCells("");

		chosenCell = Math.floor(Math.random() * emptyCells.length)
		makeMove(emptyCells[chosenCell]);
	}	

	return {name, sign, makeMove, win, chooseMove}
}("computer", "O");

const game = function() {
	let currentTurn = user;

	const changeTurn = () => {
		if (currentTurn === user){
			currentTurn = computer;
			computer.chooseMove();
		}
		else
			currentTurn = user;
	}

	const checkIfWon = () => {
		/* console.log("win WIP") */
	}

	return {currentTurn, changeTurn, checkIfWon}
}();

const gameboard = function() {
	const allCells = document.querySelectorAll(".grid > div");
	let cells = {};
	allCells.forEach(cell => cells[cell.dataset.xy] = "");

	const occupyCell = (cell, sign) => {
		cells[cell.dataset.xy] = sign;
	}

	const returnCellsCoordinates = sign => {
		let cellsCoordinatesArray = [];

		for(cell of Object.keys(cells)) {
			if(cells[cell] === sign)
				cellsCoordinatesArray.push(cell);
		}
		return cellsCoordinatesArray;
	}

	const returnCells = (sign) => {
		let cellsCoordinatesArray = returnCellsCoordinates(sign);

		console.log(cellsCoordinatesArray);

		return [...allCells].filter(cell => 
			cellsCoordinatesArray.includes(cell.dataset.xy));

	}

	const resetEmpty = () => {
		let cells = {};
		allCells.forEach(cell => cells[cell.dataset.xy] = "");
	}

	return {cells, occupyCell, returnCellsCoordinates, returnCells, resetEmpty};
}();

document.querySelectorAll(".grid > div").forEach(element => 
	element.addEventListener("click", event => 
		game.currentTurn.makeMove(event.target)));	