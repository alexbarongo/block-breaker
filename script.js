const grid = document.querySelector('#grid')
const scoreDisplay = document.querySelector('#score')
const normalModeButton = document.querySelector('.easy')
const speedModeButton = document.querySelector('.normal')
const superModeButton = document.querySelector('.hard')
const restartButton = document.querySelector('.reset')
const blockWidth = 50
const blockHieght = 10
const boardWidth = 560
const boardHeight = 300
const ballDiameter = 10
let timerId
let xDirection = -2
let yDirection = 2
let score = 0


// position of the user's slide block
const userStart = [250, 10]
let currentPosition = userStart


//ball position
const ballStart = [270, 20]
let ballCurrentPostion = ballStart


//create a Block
class Block {
	constructor(xAxis, yAxis){
		this.bottomLeft = [xAxis, yAxis]
		this.bottomRight = [xAxis + blockWidth, yAxis]
		this.topLeft = [xAxis, yAxis + blockHieght]
		this.topRight = [xAxis + blockWidth, yAxis + blockHieght]
	}
}


//all the blocks
const blocks = [
	new Block(10, 260),
	new Block(70, 260),
	new Block(130, 260),
	new Block(190, 260),
	new Block(250, 260),
	new Block(310, 260),
	new Block(370, 260),
	new Block(430, 260),
	new Block(490, 260),
	new Block(10, 240),
	new Block(70, 240),
	new Block(130, 240),
	new Block(190, 240),
	new Block(250, 240),
	new Block(310, 240),
	new Block(370, 240),
	new Block(430, 240),
	new Block(490, 240),
	new Block(10, 220),
	new Block(70, 220),
	new Block(130, 220),
	new Block(190, 220),
	new Block(250, 220),
	new Block(310, 220),
	new Block(370, 220),
	new Block(430, 220),
	new Block(490, 220),
	new Block(10, 200),
	new Block(70, 200),
	new Block(130, 200),
	new Block(190, 200),
	new Block(250, 200),
	new Block(310, 200),
	new Block(370, 200),
	new Block(430, 200),
	new Block(490, 200),
	new Block(10, 180),
	new Block(70, 180),
	new Block(130, 180),
	new Block(190, 180),
	new Block(250, 180),
	new Block(310, 180),
	new Block(370, 180),
	new Block(430, 180),
	new Block(490, 180)
]


//draw all my blocks
function addBLocks(){
	for(let i = 0; i < blocks.length; i++){
		const block = document.createElement('div')
		block.classList.add('block')
		block.style.left = blocks[i].bottomLeft[0] + 'px'
		block.style.bottom = blocks[i].bottomLeft[1] + 'px'
		grid.appendChild(block)
	}
}

addBLocks()


//add user
const user = document.createElement('div')
user.classList.add('user')
drawUser()
grid.appendChild(user)


//draw user
function drawUser(){
	user.style.left = currentPosition[0] + 'px'
	user.style.bottom = currentPosition[1] + 'px'
}


//draw the ball
function drawBall(){
	ball.style.left = ballCurrentPostion[0] + 'px'
	ball.style.bottom = ballCurrentPostion[1] + 'px'
}


//move user
function moveUser(e) {
	switch(e.key){
		case 'ArrowLeft':
			if(currentPosition[0] > 0){
				currentPosition[0] -= 10
				drawUser()
			}
			break
		case 'ArrowRight':
			if(currentPosition[0] < (boardWidth - blockWidth) - 10){
				currentPosition[0] += 10
				drawUser()
			}
			break
	}
}

document.addEventListener('keydown', moveUser)


//create ball
const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)


//move the ball
function moveBall() {
	ballCurrentPostion[0] += xDirection
	ballCurrentPostion[1] += yDirection
	drawBall()
	checkForCollisions()
}


//setting the game mode
function normal() {
	timerId = setInterval(moveBall, 25)
}

function speed() {
	timerId = setInterval(moveBall, 12)
}

function superSpeed() {
	timerId = setInterval(moveBall, 8)
}


normalModeButton.addEventListener('click', normal)

speedModeButton.addEventListener('click', speed)

superModeButton.addEventListener('click', superSpeed)


//check for collisions
function checkForCollisions(){
	//check for block collisions
	for (let i = 0; i < blocks.length; i++) {
		if(
			(ballCurrentPostion[0] > blocks[i].bottomLeft[0] && ballCurrentPostion[0] < blocks[i].bottomRight[0]) &&
			((ballCurrentPostion[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPostion[1] < blocks[i].topLeft[1])
			){
			const allBLocks = Array.from(document.querySelectorAll('.block'))
			allBLocks[i].classList.remove('block')
			blocks.splice(i, 1)
			changeDirection()
			score++
			scoreDisplay.innerHTML = score * 10
		}
	}

	//check for wall collisions
	if(
		ballCurrentPostion[0] >= (boardWidth - ballDiameter) || 
		ballCurrentPostion[1] >= (boardHeight - ballDiameter) ||
		ballCurrentPostion[0] <= 0
		){
		changeDirection()
	}

	//check for user collision
	if(
		(ballCurrentPostion[0] > currentPosition[0] && ballCurrentPostion[0] < currentPosition[0] + blockWidth) &&
		(ballCurrentPostion[1] > currentPosition[1] && ballCurrentPostion[1] < currentPosition[1] + blockHieght)
		){
		changeDirection()
	}

	//check for game over
	if(ballCurrentPostion[1] <= 0){
		clearInterval(timerId)
		scoreDisplay.innerHTML = "YOU LOSE"
		document.removeEventListener('keydown', moveUser)
		normalModeButton.removeEventListener('click', normal)
		speedModeButton.removeEventListener('click', speed)
		superModeButton.removeEventListener('click', superSpeed)
		restartGame()
	}

	//check for win
	if(blocks.length === 0){
		scoreDisplay.innerHTML = 'YOU WIN'
		clearInterval(timerId)
		document.removeEventListener('keydown', moveUser)
		normalModeButton.removeEventListener('click', normal)
		speedModeButton.removeEventListener('click', speed)
		superModeButton.removeEventListener('click', superSpeed)
		restartGame()
	}

}


//changing direction of the ball
function changeDirection(){
	if(xDirection === 2 && yDirection === 2){
		yDirection = -2
		return
	}else if(xDirection === 2 && yDirection === -2){
		xDirection = -2
		return
	}else if(xDirection === -2 && yDirection === -2){
		yDirection = 2
		return
	}else if(xDirection == -2 && yDirection == 2){
		xDirection = 2
		return
	}
}


function restartGame(){
	restartButton.style.display = 'block'
}

restartButton.addEventListener('click', () => {
		window.location.reload()
		return false
	})