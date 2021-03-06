
if( document.readyState !== 'loading' ) {
    console.log( 'document is', document.readyState);
    gameStart();

} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log( 'document is', document.readyState);
        
        gameStart();
    });
}


function gameStart() {
    //MainGrid    
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const ScoreDisplay = document.querySelector('#score')    
    const StartBtn = document.querySelector('#start-button')
    let score = 0
    const width = 10
    let timerId

    //miniGrid
    const miniGrid = Array.from(document.querySelectorAll('.mini-grid div'))
    const miniWidth = 4
    const miniIndex = 0

    document.addEventListener('keyup', control)


        //The Main Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
        ]

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
        ]

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
        ]

    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
        ]

    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
        ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    //the miniTetrominos
    const miniTetrominoes = [
        [1, miniWidth+1, miniWidth*2+1, 2], //lTetromino
        [0, miniWidth, miniWidth+1, miniWidth*2+1], //zTetromino
        [1, miniWidth, miniWidth+1, miniWidth+2], //tTetromino
        [0, 1, miniWidth, miniWidth+1], //oTetromino
        [1, miniWidth+1, miniWidth*2+1, miniWidth*3+1] //iTetromino
    ]
  
  // set position and rotation for drawing tetrominoes
    let currentPosition = 4
    let currentRotation = 0


    function getTetromino() {   
        // randomly select an index for the tetromino
        let pos = Math.floor(Math.random()*theTetrominoes.length)
    
        // assign current tetromino
        let current = theTetrominoes[pos][currentRotation]
        current.shape = pos
        currentPosition = 4
        currentRotation = 0

        return current
    }

    let current = getTetromino()
    let nextTet = getTetromino()

    function draw() {
      current.forEach(index => {
          squares[currentPosition + index].classList.add('tetromino')
      })
    }

    function undraw() {
      current.forEach(index => {
          squares[currentPosition + index].classList.remove('tetromino')
      })
    }


    // move tetromino
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
        displayNext()
    }

    function control(event) {
        switch(event.keyCode) {
            case 37:
                moveLeft()
                break;
            case 38:
                rotate()
                break;
            case 39:
                moveRight()
                break;
            case 40:
                moveDown()
                break;
            default:
                break;
        }

    }

    //freeze tetrominoes
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // get new teromino
            current = nextTet
            nextTet = getTetromino()
            draw()
            addScore()
            gameOver()

        }

    }
    

    //moving the tetromino L/R
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge) {currentPosition -= 1}

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if(!isAtRightEdge) {currentPosition += 1}

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }

        //rotate tetromino
    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) {
            currentRotation = 0
        }
        let shape = current.shape
        current = theTetrominoes[shape][currentRotation]
        current.shape = shape
        draw()
    }

    //display next Tetromino
    function displayNext() {
        miniGrid.forEach(square => {
            square.classList.remove('tetromino')
        })
        miniTetrominoes[nextTet.shape].forEach(index => {
            // console.log(miniGrid[miniIndex + index])
            miniGrid[miniIndex + index].classList.add('tetromino')

        })
    }

    StartBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 600)
        }

    })

    function addScore() {
        for (let i = 0; i < 199; i+=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9 ]
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                ScoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))

            }
        }
    }

    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            ScoreDisplay.innerHTML = "Game Over!"
            clearInterval(timerId)
        }
    }

}
