var CELL_SIZE = 10, 
    CANVAS_WIDTH = document.getElementById('canvas').getAttribute('width'), 
    CANVAS_HEIGHT = document.getElementById('canvas').getAttribute('height');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var world = [], row;

initRandWorld();
// initWorldWithBlinker();

var timerID = setInterval(drawWorld, 100);

// Initializes a random world with ~half of the cells living
function initRandWorld() {
    ctx.fillStyle = "black";
    for(var x = 0; x < CANVAS_WIDTH; x+=CELL_SIZE) {
        row = [];
        for(var y = 0; y < CANVAS_HEIGHT; y+=CELL_SIZE) {
            var cellStatus = Math.floor(Math.random() * 2);
            if(cellStatus == 1) {
                // 50% chance of live cell
                ctx.fillStyle = "lightgreen";
                ctx.fillRect(x,y,CELL_SIZE,CELL_SIZE);
                ctx.fillStyle = "black";
            }
            else {
                // dead cell
                ctx.fillRect(x,y,CELL_SIZE,CELL_SIZE);
            }
            row.push(cellStatus);
        }
        world.push(row);
        // console.log(row.length);
    }
    // ctx.fillStyle = "blue";
    // ctx.fillRect(10,20,CELL_SIZE,CELL_SIZE);
    // console.log(world.length);
    drawGrid();
}

function initWorldWithBlinker() {
    for(var x = 0; x < CANVAS_WIDTH; x+=CELL_SIZE) {
        row = [];
        for(var y = 0; y < CANVAS_HEIGHT; y+=CELL_SIZE) {
            row.push(0);
        }
        world.push(row);
        // console.log(row.length);
    }
    world[1][1] = 1;
    world[1][2] = 1;
    world[1][3] = 1;
}

// Draws grid lines on the canvas
function drawGrid() {
    ctx.strokeStyle = "green";
    for(var x = 0; x < CANVAS_WIDTH; x+=CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x,CANVAS_HEIGHT);
        ctx.stroke();
    }
    for(var y = 0; y < CANVAS_HEIGHT; y+=CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0,y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
    }
}

// Performs Game Of Life logic to compute the next state of the world
function step() {
    var newWorld = [];
    for(var i = 0; i < world.length; i++)
        newWorld[i] = world[i].slice();
    for(var x = 0; x < world.length; x++) {
        for(var y = 0; y < world[x].length; y++) {
            var neighbors = numOfNeighbors(x,y);
            if(world[x][y] == 1) {
                // console.log('(' + x + ',' + y + ') has ' + neighbors + ' neighbors');
                if(neighbors < 2 || neighbors > 3) {
                    newWorld[x][y] = 0;
                }
                // else if exactly 2 or 3 neighbors, get to continue living
            }
            else {
                if(neighbors == 3) {
                    newWorld[x][y] = 1;
                }
            }
        }
    }
    world = newWorld;
}

// Returns the number of living neighbors of the cell at [x,y]
function numOfNeighbors(x,y) {
    var numOfNeighbors = 0;

    for(var i = x-1; i <= x+1; i++) {
        for(var j = y-1; j <= y+1; j++) {
            if(i >= 0 && j >= 0 && i < world.length && j < world[i].length) {
                if(world[i][j] == 1 && !(i == x && j == y)) {
                    // console.log(x + ',' + y + 'has neighbor (' + i + ',' + j + ')');
                    numOfNeighbors++;
                }

            }
        }
    }
    // console.log('end');
    return numOfNeighbors;
}

// Draws the world and computes the next step
function drawWorld() {
    for(var i = 0; i < world.length; i++) {
        for(var j = 0; j < world[i].length; j++) {
            if(world[i][j] == 1) {
                ctx.fillStyle = "lightgreen";
                ctx.fillRect(i*CELL_SIZE,j * CELL_SIZE,CELL_SIZE,CELL_SIZE);
            }
            else {
                ctx.fillStyle = "black";
                ctx.fillRect(i*CELL_SIZE,j * CELL_SIZE,CELL_SIZE,CELL_SIZE);
            }
        }
    }
    drawGrid();
    step();
}


$('#canvas').click(function() {
    // console.log('clicked: ' + timerID);
    // if(timerID > 0) {
    //     window.clearInterval(timerID);
    // }
    // else {
    //     timerID = window.setInterval(drawWorld, 500);
    // }
});

$('#cell-size-radio').click(function() {
    var selection = $('#cell-size-radio').serializeArray();
    if(selection != []) {
        console.log(selection);
        CELL_SIZE = Number(selection[0].value);
        world=[];
        initRandWorld();
        clearInterval(timerID);
        timerID = setInterval(drawWorld, 100);
    }
});