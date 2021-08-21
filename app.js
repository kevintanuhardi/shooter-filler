const grid = document.querySelector('.grid')
const resultDisplay = document.querySelector('.result')

let result = 0;
let runningColumnIntervalId
let currentShooterIndex = 202;
const gridWidth = 15;
const gridCount = 225;
let goingRight = true;
let currentInvaderIndex = 0;
let maxEmptyCol = 3;
let settedInvader = [];
let runningColumnIntervalInMs = 5000;

let runningColumnRowMap = [];

for (let i = 0; i < gridCount; i++) {
  const square = document.createElement('div')
  grid.appendChild(square)
}

const range = (min, max) => {
  const arr = Array(max - min + 1)
    .fill(0)
    .map((_, i) => i + min);
  return arr;
}

const squares = Array.from(document.querySelectorAll('.grid div'))

// function drawInvader() {
// 	for (let i = 0; i < invaderDimensions.height; i++) {
// 		for(let j = 0; j < invaderDimensions.width; j++) {
// 			// console.log('inv', invaderRemoved);
			
// 			invaderIndex.push(currentInvaderIndex + (i * gridWidth) + j )
// 		}
// 	}
// 	for(let i = 0; i < invaderIndex.length; i++) {
// 		if (invaderRemoved.indexOf(i) !== - 1) continue;
// 		squares[invaderIndex[i]].classList.add('invader')
// 	}
// }

function addRunningColumn () {
	const emptyGridCount = Math.ceil(Math.random() * maxEmptyCol);
	const currentLine = range(0, 14)

	for (let index = 0; index < emptyGridCount; index++) {
		let randNum
		do {
			randNum = Math.round(Math.random() * (gridWidth - 1));
		} while(currentLine.indexOf(randNum) === - 1)
		currentLine.splice(randNum, 1)
	}
	runningColumnRowMap.unshift(currentLine)
	drawRunningColumns()
	runningColumnIntervalInMs -= 10
}

addRunningColumn()

function removeColumns () {
	// runningColumnRowMap.forEach((row, rowIdx) => {
	// 	for(let i = 0; i < gridWidth; i++) {
	// 		const rowAdjustment = rowIdx * gridWidth
	// 		squares[rowAdjustment + 1].classList.remove('invader')
	// 	}
	// });
	settedInvader.forEach(index => squares[index].classList.remove('invader'))
}

function drawRunningColumns () {
	runningColumnRowMap.forEach((rowMap, rowIdx) => {
		const rowAdjustment = rowIdx * gridWidth
		for(let i = 0; i < gridWidth; i++) {
			if(squares[rowAdjustment+1] === undefined) continue
			if(rowMap.indexOf(i) !== -1) {
				squares[rowAdjustment + i].classList.add('invader')
				settedInvader.push(rowAdjustment + i)
			} else {
				squares[rowAdjustment + i].classList.remove('invader')
			}
		}
	});
	if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
		resultDisplay.innerHTML = 'GAME OVER'
		clearInterval(invadersIntervalId)
	}


	const rowLength = runningColumnRowMap.map(el => el.length)

	console.log(rowLength)
}

runningColumnIntervalId = setInterval(addRunningColumn, runningColumnIntervalInMs)

squares[currentShooterIndex].classList.add('shooter')

function moveShooter(e) {
	squares[currentShooterIndex].classList.remove('shooter')
	switch (e.code) {
		case "ArrowLeft":
			if (currentShooterIndex % gridWidth !== 0) currentShooterIndex -= 1
			break;
		case "ArrowRight":
			if (currentShooterIndex % gridWidth !== gridWidth -1) currentShooterIndex += 1
			break;
	
		default:
			break;
	}
	squares[currentShooterIndex].classList.add('shooter')
}

function shoot(e) {
	let laserId
	let currentLaserIndex = currentShooterIndex
	// console.log(currentLaserIndex, 'curlas')
	function moveLaser() {
		squares[currentLaserIndex].classList.remove('laser')
		currentLaserIndex -= gridWidth
		if (!squares[currentLaserIndex]) {
			clearInterval(laserId)
			return null
		}
		squares[currentLaserIndex].classList.add('laser')

		if(!squares[currentLaserIndex - gridWidth] || squares[currentLaserIndex - gridWidth].classList.contains('invader')) {
			clearInterval(laserId)
			squares[currentLaserIndex].classList.add('invader')
			settedInvader.push(currentLaserIndex)
			squares[currentLaserIndex].classList.remove('laser')
			squares[currentLaserIndex].classList.add('boom')
			setTimeout(() => {
				squares[currentLaserIndex].classList.remove('boom')	
			}, 300);

			const currentRow = Math.floor(currentLaserIndex / gridWidth)
			if(runningColumnRowMap[currentRow] === undefined) runningColumnRowMap[currentRow] = []
			runningColumnRowMap[currentRow].push(currentLaserIndex % gridWidth)
		}

		runningColumnRowMap.forEach((row, rowIdx) => {
			if (row.length === 15) {
				row.forEach(col => {
					squares[col].classList.add('boom')
					setTimeout(() => {
						squares[col].classList.remove('boom')
					}, 300);
				})
				removeColumns()
				runningColumnRowMap.splice(rowIdx, 1)
				drawRunningColumns()
				result += 100
				resultDisplay.innerHTML = result
			}
		})
	} 
	switch (e.code) {
		case 'Space':
			laserId = setInterval(moveLaser, 100)
			break;
	
		default:
			break;
	}
}

document.addEventListener('keydown', moveShooter)
document.addEventListener('keydown', shoot)
