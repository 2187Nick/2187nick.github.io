document.addEventListener('DOMContentLoaded', () => {
    // Get canvas element and context
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Game settings
    const gridSize = 20;
    const tileCount = 20;
    canvas.width = tileCount * gridSize;
    canvas.height = tileCount * gridSize;
    
    // Game state variables
    let snake = [];
    let food = {};
    let dx = 0;
    let dy = 0;
    let nextDx = 0;
    let nextDy = 0;
    let speed = 7;
    let gameInterval;
    let gameRunning = false;
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    
    // DOM elements
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    const startBtn = document.getElementById('startBtn');
    
    // Mobile controls
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    
    // Initialize high score display
    highScoreElement.textContent = highScore;
    
    // Initialize game
    function initGame() {
        // Reset snake
        snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        
        // Reset direction
        dx = 1;
        dy = 0;
        nextDx = 1;
        nextDy = 0;
        
        // Reset score
        score = 0;
        scoreElement.textContent = score;
        
        // Generate food
        createFood();
        
        // Start game loop
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 1000 / speed);
        gameRunning = true;
        startBtn.textContent = "Restart Game";
    }
    
    // Game loop
    function gameLoop() {
        if (!gameRunning) return;
        
        // Update direction
        dx = nextDx;
        dy = nextDy;
        
        // Move snake (add new head)
        const head = {
            x: (snake[0].x + dx + tileCount) % tileCount,
            y: (snake[0].y + dy + tileCount) % tileCount
        };
        snake.unshift(head);
        
        // Check collisions
        if (checkCollision()) {
            gameOver();
            return;
        }
        
        // Check if snake eats food
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score += 10;
            scoreElement.textContent = score;
            
            // Update high score
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('snakeHighScore', highScore);
            }
            
            // Generate new food
            createFood();
            
            // Increase speed slightly every 50 points
            if (score % 50 === 0) {
                clearInterval(gameInterval);
                speed += 0.5;
                gameInterval = setInterval(gameLoop, 1000 / speed);
            }
        } else {
            // Remove tail if no food eaten
            snake.pop();
        }
        
        // Draw game
        draw();
    }
    
    // Draw game state
    function draw() {
        // Clear canvas
        ctx.fillStyle = "#f9f9f9";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid lines (optional)
        ctx.strokeStyle = "#eee";
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < tileCount; i++) {
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
            
            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }
        
        // Draw food
        ctx.fillStyle = "#e74c3c";
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize/2,
            food.y * gridSize + gridSize/2,
            gridSize/2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw snake
        snake.forEach((segment, index) => {
            // Use gradient color for snake
            if (index === 0) {
                // Head
                ctx.fillStyle = "#27ae60";
            } else {
                // Body with gradient
                const greenValue = Math.floor(160 - (index * 3));
                ctx.fillStyle = `rgb(39, ${Math.max(greenValue, 100)}, 96)`;
            }
            
            ctx.fillRect(
                segment.x * gridSize + 1,
                segment.y * gridSize + 1,
                gridSize - 2,
                gridSize - 2
            );
            
            // Draw eyes on head
            if (index === 0) {
                ctx.fillStyle = "white";
                
                // Determine eye positions based on direction
                let eyeX1, eyeY1, eyeX2, eyeY2;
                const eyeSize = gridSize / 5;
                const eyeOffset = gridSize / 3;
                
                if (dx === 1) { // Right
                    eyeX1 = eyeX2 = segment.x * gridSize + gridSize * 0.7;
                    eyeY1 = segment.y * gridSize + gridSize * 0.3;
                    eyeY2 = segment.y * gridSize + gridSize * 0.7;
                } else if (dx === -1) { // Left
                    eyeX1 = eyeX2 = segment.x * gridSize + gridSize * 0.3;
                    eyeY1 = segment.y * gridSize + gridSize * 0.3;
                    eyeY2 = segment.y * gridSize + gridSize * 0.7;
                } else if (dy === -1) { // Up
                    eyeY1 = eyeY2 = segment.y * gridSize + gridSize * 0.3;
                    eyeX1 = segment.x * gridSize + gridSize * 0.3;
                    eyeX2 = segment.x * gridSize + gridSize * 0.7;
                } else { // Down
                    eyeY1 = eyeY2 = segment.y * gridSize + gridSize * 0.7;
                    eyeX1 = segment.x * gridSize + gridSize * 0.3;
                    eyeX2 = segment.x * gridSize + gridSize * 0.7;
                }
                
                ctx.beginPath();
                ctx.arc(eyeX1, eyeY1, eyeSize, 0, Math.PI * 2);
                ctx.arc(eyeX2, eyeY2, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw pupils
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.arc(eyeX1, eyeY1, eyeSize/2, 0, Math.PI * 2);
                ctx.arc(eyeX2, eyeY2, eyeSize/2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
    
    // Generate food at random position (not on snake)
    function createFood() {
        let newFood;
        let onSnake = true;
        
        // Generate food position until it's not on the snake
        while (onSnake) {
            newFood = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
            
            onSnake = snake.some(segment => 
                segment.x === newFood.x && segment.y === newFood.y
            );
        }
        
        food = newFood;
    }
    
    // Check for collisions
    function checkCollision() {
        // Check if snake hits itself
        for (let i = 1; i < snake.length; i++) {
            if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    // Game over function
    function gameOver() {
        clearInterval(gameInterval);
        gameRunning = false;
        startBtn.textContent = "Start Game";
        
        // Show game over message
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.font = "20px Arial";
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
        
        if (score === highScore && score > 0) {
            ctx.fillStyle = "#f1c40f";
            ctx.fillText("New High Score!", canvas.width / 2, canvas.height / 2 + 40);
        }
    }
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        // Prevent default behavior for arrow keys (scroll)
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
        
        // Space to start/restart game
        if (e.key === ' ' && !gameRunning) {
            initGame();
            return;
        }
        
        // Prevent 180-degree turns
        switch (e.key) {
            case 'ArrowUp':
                if (dy !== 1) { // Not going down
                    nextDx = 0;
                    nextDy = -1;
                }
                break;
            case 'ArrowDown':
                if (dy !== -1) { // Not going up
                    nextDx = 0;
                    nextDy = 1;
                }
                break;
            case 'ArrowLeft':
                if (dx !== 1) { // Not going right
                    nextDx = -1;
                    nextDy = 0;
                }
                break;
            case 'ArrowRight':
                if (dx !== -1) { // Not going left
                    nextDx = 1;
                    nextDy = 0;
                }
                break;
        }
    });
    
    // Button controls
    startBtn.addEventListener('click', () => {
        if (!gameRunning) {
            initGame();
        } else {
            clearInterval(gameInterval);
            gameRunning = false;
            startBtn.textContent = "Start Game";
            draw();
        }
    });
    
    // Mobile button controls
    upBtn.addEventListener('click', () => {
        if (dy !== 1 && gameRunning) { // Not going down
            nextDx = 0;
            nextDy = -1;
        }
    });
    
    downBtn.addEventListener('click', () => {
        if (dy !== -1 && gameRunning) { // Not going up
            nextDx = 0;
            nextDy = 1;
        }
    });
    
    leftBtn.addEventListener('click', () => {
        if (dx !== 1 && gameRunning) { // Not going right
            nextDx = -1;
            nextDy = 0;
        }
    });
    
    rightBtn.addEventListener('click', () => {
        if (dx !== -1 && gameRunning) { // Not going left
            nextDx = 1;
            nextDy = 0;
        }
    });
    
    // Touch swipe controls
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        e.preventDefault();
    }, { passive: false });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    canvas.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        if (!gameRunning) {
            initGame();
            return;
        }
        
        // Determine swipe direction based on the greatest delta
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 50 && dx !== -1) {
                // Right swipe
                nextDx = 1;
                nextDy = 0;
            } else if (deltaX < -50 && dx !== 1) {
                // Left swipe
                nextDx = -1;
                nextDy = 0;
            }
        } else {
            // Vertical swipe
            if (deltaY > 50 && dy !== -1) {
                // Down swipe
                nextDx = 0;
                nextDy = 1;
            } else if (deltaY < -50 && dy !== 1) {
                // Up swipe
                nextDx = 0;
                nextDy = -1;
            }
        }
        
        e.preventDefault();
    }, { passive: false });
    
    // Initial draw
    draw();
});
