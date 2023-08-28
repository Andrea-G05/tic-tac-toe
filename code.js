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
		gameboard.resetBoard();
		game.logMessage(`${name} won!`)
	}

	return { name, sign, makeMove, win}
}

const user = player("user", "X");

const computer = function(pName, pSign) {

	const {name, sign, makeMove, win} = player(pName, pSign)

	const chooseMove = () => {
		let emptyCells = gameboard.returnCells("");

		let chosenCell = Math.floor(Math.random() * emptyCells.length)
		makeMove(emptyCells[chosenCell]);
	}	

	return { name, sign, makeMove, win, chooseMove}
}("computer", "O");

const game = function() {

	let currentTurn = user;
	let log = document.querySelector(".log");

	const changeTurn = () => {
		if (currentTurn === user){
			currentTurn = computer;
			computer.chooseMove();
		}
		else
			currentTurn = user;
	}

	const checkIfWon = (sign) => {
		const includesMany = (array, ...args) => {
			for (item of args)
				if(!array.includes(item))
					return false;
			return true;
		}
		
		if(gameboard.returnCellsCoordinates("") === [])
			draw();

		let signCells = gameboard.returnCellsCoordinates(sign);
		for (let i = 1; i <= 3; i++)
			for (let j = 1; j <= 3; j++)
				if (includesMany(signCells, `${i}-1`, `${i}-2`, `${i}-3`)
				|| includesMany(signCells, `1-${i}`, `2-${i}`, `3-${i}`)
				|| includesMany(signCells, "1-1", "2-2", "3-3")
				|| includesMany(signCells, "1-3", "2-2", "3-1"))
					currentTurn.win();
	}

	const draw = () =>{
		gameboard.resetBoard();
		game.logMessage("It's a tie!")
	}

	const logMessage = (message) => {
		let p = document.createElement("p");
		p.textContent = message;
		log.insertBefore(p, log.firstChild);
	}

	const resetLog = () => {
		while(game.log.hasChildNodes())
			game.log.removeChild(game.log.lastChild);
	}

	return { log, currentTurn, changeTurn, checkIfWon, draw, logMessage, resetLog}
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

		return [...allCells].filter(cell => 
			cellsCoordinatesArray.includes(cell.dataset.xy));

	}

	const resetBoard = () => {

		for(cell of Object.keys(cells))
			cells[cell] = "";

		allCells.forEach(cell => {
			while(cell.hasChildNodes())
				cell.removeChild(cell.lastChild)});

		game.resetLog();
	}

	return { cells, occupyCell, returnCellsCoordinates, returnCells, resetBoard};
}();

document.querySelectorAll(".grid > div").forEach(element => 
	element.addEventListener("click", event => 
		game.currentTurn.makeMove(event.target)));

document.querySelector("#reset-btn").addEventListener("click", gameboard.resetBoard);