//gerum teiknicontextið
var cvs = document.getElementById('tetris');
var ctx = cvs.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

// Calculate size of canvas from constants.
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

//byr til tómann kassa
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);


// Scale blocks
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);


const matrix = [
	[0,0,0],
	[1,1,1],
	[0,1,0],
]


function draw_shape(matrix, hreyfing){
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				ctx.fillStyle = 'red';
				ctx.fillRect(x + hreyfing.x, y + hreyfing.y, 1, 1);
			}
		});
	});
}



const placement = {
	staðsetning: {x:5, y:0},
	matrix:matrix,
}


function draw (){
	//tæmir kassan, tekur út gömlu staðsetninguna
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	//færir formið einum neðar
	placement.staðsetning.y += 1;
	//teiknar formið á nýja staðnum
	draw_shape(placement.matrix, placement.staðsetning)
}

document.addEventListener('keydown', færa_kubb);

function færa_kubb(e){
	if (event.key === "ArrowLeft"){
		placement.staðsetning.x -= 1;
	}else if (event.key === "ArrowRight"){
		placement.staðsetning.x += 1;
	}else if (event.key === "ArrowDown"){
		placement.staðsetning.y += 1;
	}
}




function createMatrix(width, height){
	const matrix = [];
	var i = 0;
	while (i < height){
		matrix.push(new Array(width).fill(0));
		i++;
	}
	return matrix;
}

const arena = createMatrix(10,20);
console.log(arena); console.table(arena);

var game = setInterval(draw, 500);