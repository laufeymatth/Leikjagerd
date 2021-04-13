const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

var score = 0;
var línur = 0;

context.scale(20, 20);
//þetta lætur leikinn ekki loadast inn nema maður ýti á takkann
/*window.onload=function(){
	document.getElementById('button').addEventListener('click', function(){
		update();
	});
}*/

//hljóð
var turn = new Audio();
var röð = new Audio();
var lose = new Audio();
var nýr = new Audio();
turn.src = 'audio/snúa.wav';
röð.src = 'audio/röð.wav';
lose.src = 'audio/tapa.wav';
nýr.src = 'audio/nýr_kubbur.wav';

function arenaSweep() {
	var lína = 0;
	outer: for (let y = arena.length - 1; y > 0; --y) {
		for (let x = 0; x < arena[y].length; ++x) {
			if (arena[y][x] === 0) {
				continue outer;
			}
		}
		röð.play();
		lína++;
		const row = arena.splice(y, 1)[0].fill(0);
		arena.unshift(row);
		++y;
	}
	if (lína > 0){
		línur = línur + lína;
		if (lína === 1){
			score = score + 40;
		}
		else if (lína === 2){
			score = score + 100;
		}
		else if (lína === 3){
			score = score + 300;
		}
		else if (lína >= 4){
			score = score + 1200;
		}
	}
}

function draw_score (){
	document.getElementById("score").innerHTML = score;
	document.getElementById("lines").innerHTML = línur;	
}



function collide(arena, player) {
	const [m, o] = [player.matrix, player.pos];
	for (let y = 0; y < m.length; ++y) {
		for (let x = 0; x < m[y].length; ++x) {
			if (m[y][x] !== 0 &&
				(arena[y + o.y] &&
				arena[y + o.y][x + o.x]) !== 0){
				return true;
			}
		}
	}
	return false;
}

function createMatrix(w, h) {
	const matrix = [];
	while (h--) {
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}

function createPiece(type) {
	if (type === 'T'){
        return[
	[0, 0, 0],
	[1, 1, 1],
	[0, 1, 0],
];
	} else if (type === 'O'){
        return[
	[2, 2],
	[2, 2],
];
} else if (type === 'L'){
        return[
	[0, 3, 0],
	[0, 3, 0],
	[0, 3, 3],
];
} else if (type === 'J'){
        return[
	[0, 4, 0],
	[0, 4, 0],
	[4, 4, 0],
];
} else if (type === 'I'){
        return[
	[0, 5, 0, 0],
	[0, 5, 0, 0],
	[0, 5, 0, 0],
	[0, 5, 0, 0],
];
} else if (type === 'S'){
        return[
	[0, 6, 6],
	[6, 6, 0],
	[0, 0, 0],
	
];
} else if (type === 'Z'){
        return[
	[7, 7, 0],
	[0, 7, 7],
	[0, 0, 0],
	
];
}
 }
function draw() {

context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);
	
	drawMatrix(arena, {x: 0, y: 0});
	drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
matrix.forEach((row, y) => {
	row.forEach((value, x) => {
			if (value !== 0) {
				context.fillStyle = colors[value];
				context.fillRect(x + offset.x,
								 y + offset.y,
				 				 1, 1);


			}

	});

});

 }

 function merge(arena, player) {
 	player.matrix.forEach((row, y) => {
 		row.forEach((value, x) => {
 			if (value !== 0) {
 				arena[y + player.pos.y][x + player.pos.x] = value;
 			}
 		});
 	});
 }

function playerDrop() {
	player.pos.y++;
	if (collide(arena, player)) {
		player.pos.y--;
		merge(arena, player);
		playerReset();
		arenaSweep();
		
	}
	dropCounter = 0;
}

	function playerMove(dir) {
		player.pos.x += dir;
		if (collide(arena, player)) {
			player.pos.x -= dir;
		}
	}

	function playerReset() {
		const pieces = 'ILJOTSZ';
		nýr.play();
		player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
		player.pos.y = 0;
		player.pos.x = (arena[0].length / 2 | 0) -
					   (player.matrix[0].length / 2 | 0);
		if (collide(arena, player)) {
			arena.forEach(row => row.fill(0));
			lose.play();
			score = 0;
			línur = 0;
		}
	}

	function playerRotate(dir) {
		const pos = player.pos.x;
		let offset = 1;
		rotate(player.matrix, dir);
		while (collide(arena, player)) {
			player.pos.x += offset;
			offset = -(offset + (offset > 0 ? 1 : -1));
			if (offset > player.matrix[0].length) {
				rotate(player.matrix, -dir);
				player.pos.x = pos;
				return;
			}

		}
	}

	function rotate(matrix, dir) {
		for (let y = 0; y < matrix.length; ++y) {
			for (let x = 0; x < y; ++x) {
				[
				 	matrix[x][y],
				 	matrix[y][x],
		 		] = [
				 	matrix[y][x],
				 	matrix[x][y],
				];
			}
		}

		if (dir > 0) {
			matrix.forEach(row => row.reverse());
		} else{
			matrix.reverse();
		}

	}

	time = { start: 0, liðinn: 0}
	function update(now = 0) {
		time.liðinn = now - time.start;
		if (time.liðinn > 1000){
			time.start = now;
			playerDrop();

		}

	 	draw();
	 	requestAnimationFrame(update);
	 	draw_score();
	 } 

	 const colors = [
	 	null,
	 	'red',
	 	'blue',
	 	'violet',
	 	'green',
	 	'purple',
	 	'orange',
	 	'pink',

	 ];

	 const arena = createMatrix(12, 20);


 const player = {
 	pos: {x: 5, y: 5},
 	matrix: createPiece('T'),


 }

 document.addEventListener('keydown', event => {
 	if (event.keyCode === 37) {
 		playerMove(-1);
 		turn.play();
 	}
 	else if (event.keyCode === 39) {
 		playerMove(1);
 		 turn.play();
 		 }
 		 else if (event.keyCode === 40) {
 			playerDrop();
 		 	turn.play();
 		 } else if (event.keyCode === 32) {
 		 	playerRotate(-1);
 		 	turn.play();
 		 }
 });

update();