const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

function hreinsaBorð() {
	let rowCount = 1;
	outer: for (let y = borðið.length - 1; y > 0; --y) {
		for (let x = 0; x < borðið[y].length; ++x) {
			if (borðið[y][x] === 0) {
				continue outer;
			}
		}

		const row = borðið.splice(y, 1)[0].fill(0);
		borðið.unshift(row);
		++y;

		spilari.score += rowCount * 10;
		rowCount *= 2;
	}
}

function árekstur(borðið, spilari) {
	const [m, o] = [spilari.form, spilari.pos];
	for (let y = 0; y < m.length; ++y) {
		for (let x = 0; x < m[y].length; ++x) {
			if (m[y][x] !== 0 && 
				(borðið[y + o.y] &&
				borðið[y + o.y][x + o.x]) !== 0) {
				return true;
			}
		}
	}
	return false;
}

function geraForm(w, h) {
	const form = [];
	while (h--) {
		form.push(new Array(w).fill(0));
	}
	return form;
}

function geraKubb(type) {
	if (type === 'T') {
		return [
			[0, 0, 0],
			[1, 1, 1],
			[0, 1, 0],
		];
	} else if (type === 'O') {
		return [
			[2, 2],
			[2, 2],	
		];
	} else if (type === 'L') {
		return [
			[0, 3, 0],
			[0, 3, 0],
			[0, 3, 3],
		];
	} else if (type === 'J') {
		return [
			[0, 4, 0],
			[0, 4, 0],
			[4, 4, 0],
		];
	} else if (type === 'I') {
		return [
			[0, 5, 0, 0],
			[0, 5, 0, 0],
			[0, 5, 0, 0],
			[0, 5, 0, 0],
		];
	} else if (type === 'S') {
		return [
			[0, 6, 6],
			[6, 6, 0],
			[0, 0, 0],
		];
	} else if (type === 'Z') {
		return [
			[7, 7, 0],
			[0, 7, 7],
			[0, 0, 0],
		];
	}
}

function draw() {
	context.fillStyle = '#000';
	context.fillRect(0, 0, canvas.width, canvas.height);

	teiknaForm(borðið, {x: 0, y: 0});
	teiknaForm(spilari.form, spilari.pos);
}

function teiknaForm(form, offset) {
	form.forEach((row, y) => {
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

function sameina(borðið, spilari) {
	spilari.form.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				borðið[y + spilari.pos.y][x + spilari.pos.x] = value;
			}
		});
	});
}

function spilariDrop() {
	spilari.pos.y++;
	if (árekstur(borðið, spilari)) {
		spilari.pos.y--;
		sameina(borðið, spilari);
		spilariReset();
		hreinsaBorð();
		updateScore();
	}
	dropCounter = 0;
}

function spilariMove(dir) {
	spilari.pos.x += dir;
	if (árekstur(borðið, spilari)) {
		spilari.pos.x -= dir;
	}
}

function spilariReset() {
	const kubbar = 'ILJOTSZ';
	spilari.form = geraKubb(kubbar[kubbar.length * Math.random() | 0]);
	spilari.pos.y = 0;
	spilari.pos.x = (borðið[0].length / 2 | 0) -
					(spilari.form[0].length / 2 | 0);
	if (árekstur(borðið, spilari)) {
		borðið.forEach(row => row.fill(0));
		spilari.score = 0;
		updateScore();
	}
}

function spilariSnúa(dir) {
	const pos = spilari.pos.x;
	let offset = 1;
	snúa(spilari.form, dir);
	while(árekstur(borðið, spilari)) {
		spilari.pos.x += offset;
		offset = -(offset + (offset > 0 ? 1 : - 1));
		if (offset > spilari.form[0].length) {
			snúa(spilari.form, - dir);
			spilari.pos.x = pos;
			return;
		}
	}
}

function snúa(form, dir) {
	for (let y = 0; y < form.length; ++y) {
		for (let x = 0; x < y; ++x) {
			[
				form[x][y],
				form[y][x],
			] = [
				form[y][x],
				form[x][y],
			];
		}
	}

	if (dir > 0) {
		form.forEach(row => row.reverse());
	} else {
		form.reverse();
	}
}

let dropCounter = 0;
let dropInterval = 1000;

let síðastiTími = 0;
function update(tími = 0) {
	const deltaTími = tími - síðastiTími;
	síðastiTími = tími;
	
	dropCounter += deltaTími;
	if (dropCounter > dropInterval) {
		spilariDrop();
	}

	draw();
	requestAnimationFrame(update);
}

function updateScore() {
	document.getElementById('score').innerText = spilari.score;
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

const borðið = geraForm(15, 20);

const spilari = {
	pos: {x: 0, y: 0},
	form: null,
	score: 0,
}

document.addEventListener('keydown', hreyfing);

function hreyfing(event) {
	if (event.keyCode === 37) {
		spilariMove(-1);
	} else if (event.keyCode === 39) {
		spilariMove(1);
	} else if (event.keyCode === 40) {
		spilariDrop();
	} else if (event.keyCode === 81) {
		spilariSnúa(-1);
	} else if (event.keyCode === 87) {
		spilariSnúa(1);
	}
}

spilariReset();
updateScore();
update();