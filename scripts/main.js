const app = new Vue({
    el: '#game-board',

    data: {
        virtualGameBoard: []
    },

    methods: {
        start: function() {
            const gameBoard = document.querySelector('#game-board');
            const size = window.getComputedStyle(gameBoard).gridTemplateColumns.split(' ').length;

            this.virtualGameBoard = [];
            for (let i = 0; i < size; i++) {
                this.virtualGameBoard.push([]);

                for (let j = 0; j < size; j++) {
                    this.virtualGameBoard[i].push(null);
                }
            }

            const x1 = Math.floor(Math.random()*size);
            const y1 = Math.floor(Math.random()*size);
            const tile1 = document.createElement('div');
            tile1.classList.add('tile');
            tile1.innerText = 2;
            tile1.style.setProperty('--x', x1);
            tile1.style.setProperty('--y', y1);
            this.virtualGameBoard[y1][x1] = tile1;
            gameBoard.appendChild(tile1);

            const x2 = x1 < size-1 ? x1+1 : x1-1; // To ensure that the tiles are not placed in the same location
            const y2 = Math.floor(Math.random()*size);
            const tile2 = document.createElement('div');
            tile2.classList.add('tile');
            tile2.innerText = 2;
            tile2.style.setProperty('--x', x2);
            tile2.style.setProperty('--y', y2);
            this.virtualGameBoard[y2][x2] = tile2;
            gameBoard.appendChild(tile2);
        },
        placeNewTile: function() {
            const positionChoices = [];
            for (let i = 0; i < this.virtualGameBoard.length; i++) {
                for (let j = 0; j < this.virtualGameBoard.length; j++) {
                    if (this.virtualGameBoard[i][j] === null) {
                        const pos = {};
                        pos[i] = j;
                        positionChoices.push(pos);
                    }
                }
            }

            if (positionChoices.length > 0) {
                const choice = Math.floor(Math.random() * positionChoices.length);
                pos = positionChoices[choice];
                const y = Object.keys(pos)[0];
                const x = pos[y];
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.innerText = 2;
                tile.style.setProperty('--x', x);
                tile.style.setProperty('--y', y);
                this.virtualGameBoard[y][x] = tile;
                document.querySelector('#game-board').appendChild(tile);
            }
        },
        merge: function(tile1, tile2) {
            const gameBoard = document.querySelector('#game-board');

            x1 = window.getComputedStyle(tile1).getPropertyValue('--x');
            y1 = window.getComputedStyle(tile1).getPropertyValue('--y');
            x2 = window.getComputedStyle(tile2).getPropertyValue('--x');
            y2 = window.getComputedStyle(tile2).getPropertyValue('--y');

            gameBoard.removeChild(tile1);
            gameBoard.removeChild(tile2);

            this.virtualGameBoard[y1][x1] = null;
            this.virtualGameBoard[y2][x2] = null;

            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.innerText = parseInt(tile1.innerText) + parseInt(tile2.innerText);
            tile.style.setProperty('--x', x1);
            tile.style.setProperty('--y', y1);
            this.virtualGameBoard[y1][x1] = tile;
            gameBoard.appendChild(tile);
        },
        getNearestBelow: function(y, x) {
            for (let i = y; i < this.virtualGameBoard.length; i++) {
                if (this.virtualGameBoard[i][x] !== null) return i;
            }
            return this.virtualGameBoard.length;
        },
        shiftColUp: function(x) {
            for (let i = 0; i < this.virtualGameBoard.length; i++) {
                const nearestPosY = this.getNearestBelow(i, x);
                if (nearestPosY === this.virtualGameBoard.length) return;
                const nearestEle = this.virtualGameBoard[nearestPosY][x];
                this.virtualGameBoard[nearestPosY][x] = null;
                this.virtualGameBoard[i][x] = nearestEle;
                nearestEle.style.setProperty('--x', x);
                nearestEle.style.setProperty('--y', i);
            }
        },
        shiftUp: function() {
            const gameBoard = document.querySelector('#game-board');

                for (let i = 0; i < this.virtualGameBoard.length; i++) {
                    this.shiftColUp(i);
               
                    for (let j = 0; j < this.virtualGameBoard.length-1; j++) {
                        const tile1 = this.virtualGameBoard[j][i];
                        const tile2 = this.virtualGameBoard[j+1][i];
                        if (tile1 !== null && tile2 != null && tile1.innerText === tile2.innerText) this.merge(tile1, tile2);
                    }

                    this.shiftColUp(i);
                }

            this.placeNewTile();
        },
        getNearestAbove: function(y, x) {
            for (let i = y; i >= 0; i--) {
                if (this.virtualGameBoard[i][x] !== null) return i;
            }

            return -1;
        },
        shiftColDown: function(x) {
            for (let i = this.virtualGameBoard.length-1; i >= 0; i--) {
                const nearestPosY = this.getNearestAbove(i, x);
                if (nearestPosY === -1) return;
                const nearestEle = this.virtualGameBoard[nearestPosY][x];
                this.virtualGameBoard[nearestPosY][x] = null;
                this.virtualGameBoard[i][x] = nearestEle; 
                nearestEle.style.setProperty('--x', x);
                nearestEle.style.setProperty('--y', i);
            }
        },
        shiftDown: function() {
             const gameBoard = document.querySelector('#game-board');

            for (let i = 0; i < this.virtualGameBoard.length; i++) {
                this.shiftColDown(i);

                for (let j = this.virtualGameBoard.length-1; j > 0; j--) {
                    const tile1 = this.virtualGameBoard[j][i];
                    const tile2 = this.virtualGameBoard[j-1][i];
                    if (tile1 !== null && tile2 != null && tile1.innerText === tile2.innerText) this.merge(tile1, tile2);
                }

                this.shiftColDown(i);
            }

            this.placeNewTile();
        },
        shiftLeft: function() {
            alert(3)
        },
        shiftRight: function() {
            alert(4);
        }
    }
});

app.start();

document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case "ArrowUp":
            app.shiftUp();
            break;
        case "ArrowDown":
            app.shiftDown();
            break;
         case "ArrowLeft":
            app.shiftLeft();
            break;
        case "ArrowRight":
            app.shiftRight();
            break;
    }
});