
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    const $sprite = document.querySelector('#sprite');
    const $bricks = document.querySelector('#bricks');

    canvas.width = 448;
    canvas.height = 400;

    //Variables del juego //

    //VARIABLES DE LA PELOTA
    const ballRadius = 3;

    //POSICION DE LA PELOTA
    let x = canvas.width / 2;
    let y = canvas.height - 30;

    //Velocidad de la pelota
    let dx = 2;
    let dy = -2;

    //VARIABLES DE LA PALETA
    const paddleHeight = 10;
    const paddleWidth = 50;

    let paddleX = (canvas.width - paddleWidth) / 2;
    let paddleY = canvas.height - paddleHeight - 10;

    let rightPressed = false;
    let leftPressed = false;

    //VARIABLES DE LOS LADRILLOS//
    const bricksRowCount = 6;
    const bricksColumnCount = 13;
    const bricksWidth = 32;
    const bricksHeight = 16;
    const brickPadding = 0;
    const brickOffsetTop = 80;
    const brickOffsetLeft = 16;
    const bricks = [];

    const BRICK_STATUS = {
        ACTIVE: 1,
        DESTROYED: 0
    }

    for (let c = 0; c < bricksColumnCount; c++) {
        bricks[c] = [] //Inicializa con un array vacio
        for (let r = 0; r < bricksRowCount; r++) {
            //calculamos la posicion del ladrillo en la pantalla
            const brickX = c * (bricksWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (bricksHeight + brickPadding) + brickOffsetTop;
            //Asignar un color aleatorio a cada ladrillo
            const random = Math.floor(Math.random() * 8)
            //Guardamos la info de cada ladrillo
            bricks[c][r] = {
                x: brickX,
                y: brickY,
                status: BRICK_STATUS.ACTIVE,
                color: random
            }
        }
    }



    PADDLE_SENSITIVITY = 4;


    const drawBall = () => {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
        ctx.fillStyle = '#eee'
        ctx.fill()
        ctx.closePath()

    };

    const drawPaddle = () => {
        ctx.drawImage(
            $sprite,// Imagen general
            29, //clipX : coordenadas de recorte
            174, //ClipY: coordenadas de recorte 
            paddleWidth, // Tamaño del recorte
            paddleHeight, // Tamaño del recorte
            paddleX, // Posicion X del dibujo
            paddleY, // Posicion Y del dibujo
            paddleWidth, // ancho del dibujo
            paddleHeight, // alto del dibujo 


        )
    };

    const drawBricks = () => {
        for (let c = 0; c < bricksColumnCount; c++) {
            for (let r = 0; r < bricksRowCount; r++) {
                const currentBrick = bricks[c][r]
                if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

                // ctx.fillStyle = 'yellow'
                // ctx.rect(
                //     currentBrick.x,
                //     currentBrick.y,
                //     bricksWidth,
                //     bricksHeight,    
                // )
                // ctx.strokeStyle = '#000';
                // ctx.stroke();
                // ctx.fill();

                const clipX = currentBrick.color * 32;
                ctx.drawImage(
                    $bricks,
                    clipX,
                    0,
                    bricksWidth,
                    bricksHeight,
                    currentBrick.x,
                    currentBrick.y,
                    bricksWidth,
                    bricksHeight
                )
            };
        };
    };

    const collisionDetection = () => {
        for (let c = 0; c < bricksColumnCount; c++) {
            for (let r = 0; r < bricksRowCount; r++) {
                const currentBrick = bricks[c][r]
                if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

                const isBallSameXAsBrick =
                    x > currentBrick.x &&
                    x < currentBrick.x + bricksWidth;

                const isBallSameYAsBrick =
                    y > currentBrick.y &&
                    y < currentBrick.y + bricksWidth;
                if (
               isBallSameXAsBrick && isBallSameYAsBrick
                ){
                    dy = -dy;
                    currentBrick.status = BRICK_STATUS.DESTROYED
                }
            };
        }
    }
    const ballMovement = () => {
        //rebotar las pelotas en los laterales
        if (x + dx > canvas.width - ballRadius /* pared derecha*/ || x + dx < ballRadius  /*pared izquierda*/) {
            dx = -dx;
        }

        //rebotar en la parte de arriba
        if (y + dy < ballRadius) {
            dy = -dy
        }

        //la pelota toca la pala
        const isBallSameXAsPaddle =
            x > paddleX &&
            x < paddleX + paddleWidth

        const isBallTouchingPaddle =
            y + dy > paddleY
        if (
            isBallSameXAsPaddle && isBallTouchingPaddle
        ) {
            dy = -dy;
        } else if ( //la pelota toca el suelo
            y + dy > canvas.height - ballRadius
        ) {
            console.log('Game Over');
            document.location.reload()
        }

        x += dx;
        y += dy;
    };


    const paddleMovement = () => {
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += PADDLE_SENSITIVITY;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= PADDLE_SENSITIVITY;
        }
    };

    const cleanCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function initEvents() {
        document.addEventListener('keydown', keyDownHandler)
        document.addEventListener('keyup', keyUpHandler)

        function keyDownHandler(event) {
            const { key } = event;
            if (key === 'Right' || key === 'ArrowRight') {
                rightPressed = true;
            } else if (key === 'Left' || key === 'ArrowLeft') {
                leftPressed = true;
            }
        }
        function keyUpHandler(event) {
            const { key } = event;
            if (key === 'Right' || key === 'ArrowRight') {
                console.log(event.key);
                rightPressed = false;
            } else if (key === 'Left' || key === 'ArrowLeft') {
                leftPressed = false;
            }
        }
    };

    const draw = () => {
        console.log({ rightPressed, leftPressed });
        cleanCanvas()
        //Dibujar los elementos
        drawBall();
        drawPaddle();
        drawBricks();
        //drawScore();

        //colisiones y movimientos
        collisionDetection();
        ballMovement();
        paddleMovement();
        window.requestAnimationFrame(draw);
    }
    initEvents();
    canvas.focus();
    draw();

