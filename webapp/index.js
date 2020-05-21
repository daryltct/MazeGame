const { World, Engine, Runner, Render, Bodies, Body, Events } = Matter;

//********* MAZE DIMENSIONS *********
const width = window.innerWidth;
const height = window.innerHeight;
const border = 2;

const rows = 6;
const columns = 10;

const unitLength = width / columns;
const unitHeight = height / rows;

//********* MATTER.JS CONFIGURATIONS *********

//create an engine
const engine = Engine.create();
const { world } = engine; //a World object is created when an engine is created
engine.world.gravity.y = 0;

//create a renderer
const render = Render.create({
	element: document.body, //where to display inside of HTML document
	engine: engine, //specify engine to use
	options: {
		wireframes: false,
		width,
		height
	}
});

//run render and runner
Render.run(render);
Runner.run(Runner.create(), engine);

//********* CANVAS BORDERS *********
const borders = [
	Bodies.rectangle(width / 2, 0, width, border, { isStatic: true }), //top
	Bodies.rectangle(width / 2, height, width, border, { isStatic: true }), //bottom
	Bodies.rectangle(0, height / 2, border, height, { isStatic: true }), //left
	Bodies.rectangle(width, height / 2, border, height, { isStatic: true }) //right
];

World.add(world, borders);

//********* MAZE CONFIGURATION AlGORITHM *********
//Grid: 2D array representing the cells on the map
const grid = Array(rows)
	.fill(null) //create an array of size (rows), filled with null elements
	.map(() => {
		return Array(columns).fill(false); //.map iterates through each null element, replace with an array of size (columns) filled with 'false'
	});

//Verticals: 2D array representing vertical walls on the map
const verticals = Array(rows)
	.fill(null) //
	.map(() => {
		return Array(columns - 1).fill(false);
	});

//Horizontals: 2D array representing horizontal walls on the map
const horizontals = Array(rows - 1)
	.fill(null) //
	.map(() => {
		return Array(columns).fill(false);
	});

const randomize = (arr) => {
	let count = arr.length;
	while (count > 0) {
		const index = Math.floor(Math.random() * count);
		count--;

		const temp = arr[count];
		arr[count] = arr[index];
		arr[index] = temp;
	}
	return arr;
};

const enterCell = (row, column) => {
	//check if cell has been visited
	if (grid[row][column]) return;
	//mark cell as visited
	grid[row][column] = true;
	//generate randomly ordered list of neighbours
	const neighbours = randomize([
		[ row - 1, column, 'up' ], //above
		[ row + 1, column, 'down' ], //below
		[ row, column - 1, 'left' ], //left
		[ row, column + 1, 'right' ] //right
	]);

	//for each neighbour
	for (let neighbour of neighbours) {
		const [ nextRow, nextColumn, direction ] = neighbour;
		//check if cell is out of bounds
		if (nextRow < 0 || nextRow >= rows || nextColumn < 0 || nextColumn >= columns) {
			continue;
		}

		//check if cell is already visited
		if (grid[nextRow][nextColumn]) continue;

		//remove wall based on direction of neighbour
		if (direction === 'up') {
			horizontals[row - 1][column] = true;
		} else if (direction === 'down') {
			horizontals[row][column] = true;
		} else if (direction === 'left') {
			verticals[row][column - 1] = true;
		} else {
			verticals[row][column] = true;
		}

		//enter cell recursively
		enterCell(nextRow, nextColumn);
	}
};

//Generate random maze at random starting position
const startRow = Math.floor(Math.random() * rows);
const startColumn = Math.floor(Math.random() * columns);
enterCell(startRow, startColumn);

//********* RENDERING MAZE *********
horizontals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) return;

		const wall = Bodies.rectangle(
			columnIndex * unitLength + unitLength / 2, //x axis
			rowIndex * unitHeight + unitHeight, //y axis
			unitLength, //length of rectangle
			5, //height of rectangle
			{
				isStatic: true,
				label: 'wall'
			}
		);
		World.add(world, wall);
	});
});

verticals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) return;

		const wall = Bodies.rectangle(
			columnIndex * unitLength + unitLength,
			rowIndex * unitHeight + unitHeight / 2,
			5,
			unitHeight,
			{
				isStatic: true,
				label: 'wall'
			}
		);
		World.add(world, wall);
	});
});

//********* RENDERING BALL *********
const ballRadius = Math.min(unitLength, unitHeight) / 4;
const ball = Bodies.circle(unitLength / 2, unitHeight / 2, ballRadius, {
	label: 'ball',
	render: {
		fillStyle: 'rgb(222, 241, 50)'
	}
});
World.add(world, ball);

//********* RENDERING GOAL *********
const goal = Bodies.rectangle(width - unitLength / 2, height - unitHeight / 2, unitLength / 2, unitHeight / 2, {
	isStatic: true,
	label: 'goal',
	render: {
		fillStyle: 'rgb(25, 230, 25)'
	}
});
World.add(world, goal);

//********* KEYPRESS EVENT TO CONTROL BALL *********
document.addEventListener('keydown', (event) => {
	const { x, y } = ball.velocity; //current velocity of ball

	//key 'w' (move up)
	if (event.keyCode === 87) {
		Body.setVelocity(ball, { x, y: y - 5 });
	}
	//key 'd' (move right)
	if (event.keyCode === 68) {
		Body.setVelocity(ball, { x: x + 5, y });
	}
	//key 's' (move down)
	if (event.keyCode === 83) {
		Body.setVelocity(ball, { x, y: y + 5 });
	}
	//key 'a' (move left)
	if (event.keyCode === 65) {
		Body.setVelocity(ball, { x: x - 5, y });
	}
});

//********* WIN CONDITION *********
Events.on(engine, 'collisionStart', (event) => {
	event.pairs.forEach((collision) => {
		const labels = [ 'ball', 'goal' ];

		if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
			world.gravity.y = 1;
			world.bodies.forEach((body) => {
				if (body.label === 'wall' || body.label === 'goal') {
					Body.setStatic(body, false);
				}
			});
			document.querySelector('.winner').classList.remove('hidden');
		}
	});
});
