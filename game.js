var game = {
	grid: [],
	animation_grid: [],
	animation_size: [],
	animation_size_vel: [],
	suggestionAlpha: 0,
	gridSize: 40,
	currentPlayer: 1,
	GAME_OVER: false,
	missed_turn: 0,
	back_to_menu:false
};

game.logGrid = function() {
	console.log(JSON.parse(JSON.stringify(grid)));
}

game.initGridForNewGame = function() {
	game.grid = [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 1, 2, 0, 0, 0],
		[0, 0, 0, 2, 1, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0]
	];
	game.animation_grid = JSON.parse(JSON.stringify(game.grid));
	var tmp_row = [];
	for(i = 0; i < 8; i++) {
		tmp_row[i] = 0;
	}
	for(i = 0; i < 8; i++) {
		game.animation_size[i] = JSON.parse(JSON.stringify(tmp_row));
		game.animation_size_vel[i] = JSON.parse(JSON.stringify(tmp_row));
	}
}

game.canPlacePiece = function(player, x, y, new_grid) {
	if(new_grid[y][x] !== 0) {
		return false;
	}
	function ray(x_change, y_change) {
		var tmp_x = x;
		var tmp_y = y;
		var move_count = 0;
		tmp_x += x_change;
		tmp_y += y_change;
		if(new_grid[y][x] !== 0) {
			return false;
		}
		while(tmp_x >= 0 && tmp_y >= 0 && tmp_x < 8 && tmp_y < 8) {
			if(new_grid[tmp_y][tmp_x] === player) {
				if(move_count > 0) {
					return true;
				} else {
					return false;
				}
			}
			if(new_grid[tmp_y][tmp_x] === 0) {
				return false;
			}
			tmp_x += x_change;
			tmp_y += y_change;
			move_count++;
		}
		return false;
	}

	return(ray(1, 0) ||
		   ray(1, 1) ||
		   ray(0, 1) ||
		   ray(-1, 1) ||
		   ray(-1, 0) ||
		   ray(-1, -1) ||
		   ray(0, -1) ||
		   ray(1, -1));
}

game.placePiece = function(player, x, y, new_grid) {
	var return_grid = JSON.parse(JSON.stringify(new_grid));

	if(!game.canPlacePiece(player, x, y, new_grid)) {
		return new_grid;
	}

	function checkRay(x_change, y_change) {
		var tmp_x = x;
		var tmp_y = y;
		var move_count = 0;
		tmp_x += x_change;
		tmp_y += y_change;
		while(tmp_x >= 0 && tmp_y >= 0 && tmp_x < 8 && tmp_y < 8) {
			if(new_grid[tmp_y][tmp_x] === player) {
				if(move_count > 0) {
					return true;
				} else {
					return false;
				}
			}
			if(new_grid[tmp_y][tmp_x] === 0) {
				return false;
			}
			tmp_x += x_change;
			tmp_y += y_change;
			move_count++;
		}
		return false;
	}

	function ray(x_change, y_change) {
		if(!checkRay(x_change, y_change)) {
			return;
		}
		var tmp_x = x;
		var tmp_y = y;
		var move_count = 0;
		return_grid[tmp_y][tmp_x] = player;
		tmp_x += x_change;
		tmp_y += y_change;

		while(tmp_x >= 0 && tmp_y >= 0 && tmp_x < 8 && tmp_y < 8) {
			if(new_grid[tmp_y][tmp_x] === 3 - player) {
				return_grid[tmp_y][tmp_x] = player;
			} else {
				return;
			}
			tmp_x += x_change;
			tmp_y += y_change;
			move_count++;
		}
	}

	ray(1, 0);
	ray(1, 1);
	ray(0, 1);
	ray(-1, 1);
	ray(-1, 0);
	ray(-1, -1);
	ray(0, -1);
	ray(1, -1);
	return return_grid;
}

game.getAiMove = function() {
	var potentialMoves = [];
	for(x = 0; x < 8; x++) {
		for(y = 0; y < 8; y++) {
			if(game.canPlacePiece(game.currentPlayer, x, y, game.grid)) {
				potentialMoves.push({
					x: x,
					y: y,
					score: 0
				});
			}
		}
	}
	// function for each factor (2.1) which, given a board, gives a numerical output
	function pieceDifference(new_grid) {
		var p1_count = 0;
		var p2_count = 0;
		for(x = 0; x < 8; x++) {
			for(y = 0; y < 8; y++) {
				if(new_grid[y][x] === 1) {
					p1_count++;
				}
				if(new_grid[y][x] === 2) {
					p2_count++;
				}
			}
		}

		if(p2_count > p1_count) {
			return 100 * p2_count / (p2_count + p1_count);
		}
		if(p1_count > p2_count) {
			return -100 * p1_count / (p1_count + p2_count);
		}
		return 0;
	}
	function cornerOccupancy(new_grid) {
		var p1_count = 0;
		var p2_count = 0;
		if(new_grid[0][0] === 1) {
			p1_count++;
		}
		if(new_grid[7][0] === 1) {
			p1_count++;
		}
		if(new_grid[0][7] === 1) {
			p1_count++;
		}
		if(new_grid[7][7] === 1) {
			p1_count++;
		}
		if(new_grid[0][0] === 2) {
			p2_count++;
		}
		if(new_grid[7][0] === 2) {
			p2_count++;
		}
		if(new_grid[0][7] === 2) {
			p2_count++;
		}
		if(new_grid[7][7] === 2) {
			p2_count++;
		}
		return 25 * p2_count - 25 * p1_count;
	}

	function cornerCloseness(new_grid) {
		var p1_count = 0;
		var p2_count = 0;
		for(x = 0; x < 8; x++) {
			for(y = 0; y < 8; y++) {
				if(
					(y === 0 && (x === 1 || x === 6)) ||
					(y === 1 && (x === 0 || x === 1 || x === 6 || x === 7)) ||
					(y === 6 && (x === 0 || x === 1 || x === 6 || x === 7)) ||
					(y === 7 && (x === 1 || x === 6))
				) {
					var corner_x;
					var corner_y;
					if(x < 4) {
						corner_x = 0;
					} else {
						corner_x = 7;
					}
					if(y < 4) {
						corner_y = 0;
					} else {
						corner_y = 7;
					}

					if(new_grid[corner_y][corner_x] === 0) {
					   	if(new_grid[y][x] === 1) {
							p1_count++;
						}
						if(new_grid[y][x] === 2) {
							p2_count++;
						}
					}
				}
			}
		}

		return -12.5 * p2_count + 12.5 * p1_count;
	}

	function mobility(new_grid) {
		var p1_count = 0;
		var p2_count = 0;
		for(x = 0; x < 8; x++) {
			for(y = 0; y < 8; y++) {
				if(game.canPlacePiece(1, x, y, new_grid)) {
					p1_count++;
				}
				if(game.canPlacePiece(2, x, y, new_grid)) {
					p2_count++;
				}
			}
		}

		if(p2_count > p1_count) {
			return 100 * p2_count / (p2_count + p1_count);
		}
		if(p1_count > p2_count) {
			return -100 * p1_count / (p2_count + p1_count);
		}
		return 0;
	}

	function fontierDiscs(new_grid) {
		function getPieceAt(x, y) {
			if(x < 0 || x > 7 || y < 0 || y > 7) {
				return null;
			}
			return new_grid[y][x];
		}

		var p1_count = 0;
		var p2_count = 0;
		for(x = 0; x < 8; x++) {
			for(y = 0; y < 8; y++) {
				if(getPieceAt(x - 1, y) === 0 || getPieceAt(x + 1, y) === 0 || getPieceAt(x, y - 1) === 0 || getPieceAt(x, y + 1) === 0) {
					if(new_grid[y][x] === 1) {
						p1_count++;
					} else if(new_grid[y][x] === 2) {
						p2_count++;
					}
				}
			}
		}

		if(p2_count > p1_count) {
			return -100 * p2_count / (p1_count + p2_count);
		}
		if(p1_count > p2_count) {
			return 100 * p1_count / (p1_count + p2_count);
		}
		return 0;
	}

	function discSquares(new_grid) {
		var p1_count = 0;
		var p2_count = 0;

		var valueArray = [
			[20, -3, 11,  8,  8, 11, -3, 20],
			[-3, -7, -4,  1,  1, -4, -7, -3],
			[11, -4,  2,  2,  2,  2, -4, 11],
			[8,   1,  2, -3, -3,  2,  1, 8],
			[8,   1,  2, -3, -3,  2,  1, 8],
			[11, -4,  2,  2,  2,  2, -4, 11],
			[-3, -7, -4,  1,  1, -4, -7, -3],
			[20, -3, 11,  8,  8, 11, -3, 20],
		];
		for(x = 0; x < 8; x++) {
			for(y = 0; y < 8; y++) {
				if(new_grid[y][x] === 1) {
					p1_count += valueArray[y][x];
				}
				if(new_grid[y][x] === 2) {
					p2_count += valueArray[y][x];
				}
			}
		}

		return p2_count - p1_count;
	}

	var bestMoves = [0];
	// multiply factors together to score each board. Pick best option, potentially w/ minimax
	for(i = 0; i < potentialMoves.length; i++) {
		var placedGrid = game.placePiece(game.currentPlayer, potentialMoves[i].x, potentialMoves[i].y, game.grid);
		//var placedGrid = grid;

		// Get all factor values
		var pD  = pieceDifference(placedGrid);
		var cO  = cornerOccupancy(placedGrid);
		var cC  = cornerCloseness(placedGrid);
		var mob = mobility(placedGrid);
		var fD  = fontierDiscs(placedGrid);
		var dS  = discSquares(placedGrid);

		potentialMoves[i].score = 10 * pD + 801.724 * cO + 382.026 * cC + 78.922 * mob + 74.396 * fD + 10 * dS;
		if(potentialMoves[i].score > potentialMoves[bestMoves[0]].score) {
			bestMoves = [i];
		}
		if(potentialMoves[i].score = potentialMoves[bestMoves[0]].score) {
			bestMoves.push(i);
		}
	}

	return potentialMoves[bestMoves[Math.floor(Math.random() * bestMoves.length)]];
}

game.checkForAnyMoves = function() {
	function doCheck(playerToCheck) {
		for(x = 0; x < 8; x++) {
			for(y = 0; y < 8; y++) {
				if(game.canPlacePiece(playerToCheck, x, y, game.grid)) {
					return true;
				}
			}
		}
		return false;
	}
	if(!doCheck(game.currentPlayer)) {
		if(doCheck(3 - game.currentPlayer)) {
			console.log("player " + game.currentPlayer + " missed a turn");
			game.missed_turn = game.currentPlayer;
			game.playerTimer = 100;
			game.currentPlayer = 3 - game.currentPlayer;
		} else {
			console.log("game over");
			game.GAME_OVER = true;
		}
	}
}

game.calcWinner = function() {
	var p1_count = 0;
	var p2_count = 0;
	for(x = 0; x < 8; x++) {
		for(y = 0; y < 8; y++) {
			if(game.grid[y][x] === 1) {
				p1_count++;
			}
			if(game.grid[y][x] === 2) {
				p2_count++;
			}
		}
	}
	if(p1_count > p2_count) {
		return 1;
	}
	if(p2_count > p1_count) {
		return 2;
	}
	return 0;
}

game.renderGame = function() {
	canvas.width = 640;
	canvas.height = 480;
	canvas.style.cursor = "default";
	ctx.fillStyle = "#ddd";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	var clouds = new Image;
	clouds.src = "img/Background.png";
	ctx.drawImage(clouds, 0, 0, canvas.width, canvas.height);

	var renderGrid = (function() {
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = "#fff";
		ctx.fillRect(canvas.width / 2 - 4 * game.gridSize, canvas.height / 2 - 4 * game.gridSize, 8 * game.gridSize, 8 * game.gridSize);
		ctx.globalAlpha = 1;
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 1;
		for(x = -4; x <= 4; x++) {
			ctx.beginPath();
			ctx.moveTo(canvas.width / 2 + x * game.gridSize, canvas.height / 2 + 4 * game.gridSize);
			ctx.lineTo(canvas.width / 2 + x * game.gridSize, canvas.height / 2 + -4 * game.gridSize);
			ctx.stroke();
		}
		for(y = -4; y <= 4; y++) {
			ctx.beginPath();
			ctx.moveTo(canvas.width / 2 + 4 * game.gridSize, canvas.height / 2 + y * game.gridSize);
			ctx.lineTo(canvas.width / 2 + -4 * game.gridSize, canvas.height / 2 + y * game.gridSize);
			ctx.stroke();
		}
	})();

	var renderTiles = (function() {

		function renderTile(type, x, y, r, goo) {
			ctx.fillStyle = "#000";
			if(type === 1) {
				ctx.fillStyle = "#CC5B22";
			}
			if(type === 2) {
				ctx.fillStyle = "#5CB712";
			}
			ctx.beginPath();
			ctx.arc(canvas.width / 2 + (x - 3.5) * game.gridSize, canvas.height / 2 + (y - 3.5) * game.gridSize, game.gridSize * 0.4 * Math.max(r, 0),0,2*Math.PI);
			if(goo !== false) {
				function calcRadius(i, x, y) {
					return Math.round(Math.max((game.gridSize * 0.4 - Math.pow(i, 0.9) * 1.8) * game.animation_size[y][x], 0));
				}
				if(x > 0 && game.animation_grid[y][x-1] === type) {
					for(i = 1; i < 10; i++) {
						ctx.arc(canvas.width / 2 + (x - 3.5 - i / 20 * Math.pow(Math.min(game.animation_size[y][x], game.animation_size[y][x-1]), 2)) * game.gridSize, canvas.height / 2 + (y - 3.5) * game.gridSize, calcRadius(i, x, y),0,2*Math.PI);
					}
				}
				if(x < 7 && game.animation_grid[y][x+1] === type) {
					for(i = 1; i < 10; i++) {
						ctx.arc(canvas.width / 2 + (x - 3.5 + i / 20 * Math.pow(Math.min(game.animation_size[y][x], game.animation_size[y][x+1]), 2)) * game.gridSize, canvas.height / 2 + (y - 3.5) * game.gridSize, calcRadius(i, x, y),0,2*Math.PI);
					}
				}
				if(y > 0 && game.animation_grid[y-1][x] === type) {
					for(i = 1; i < 10; i++) {
						ctx.arc(canvas.width / 2 + (x - 3.5) * game.gridSize, canvas.height / 2 + (y - 3.5 - i / 20 * Math.pow(Math.min(game.animation_size[y][x], game.animation_size[y-1][x]), 2)) * game.gridSize, calcRadius(i, x, y),0,2*Math.PI);
					}
				}
				if(y < 7 && game.animation_grid[y+1][x] === type) {
					for(i = 1; i < 10; i++) {
						ctx.arc(canvas.width / 2 + (x - 3.5) * game.gridSize, canvas.height / 2 + (y - 3.5 + i / 20 * Math.pow(Math.min(game.animation_size[y][x], game.animation_size[y+1][x]), 2)) * game.gridSize, calcRadius(i, x, y),0,2*Math.PI);
					}
				}
			}
			ctx.fill();

			function drawEllipse(cx, cy, width, height, type) {
				function notCentered(x, y, w, h) {
					var kappa = .5522848,
						ox = (w / 2) * kappa, // control point offset horizontal
						oy = (h / 2) * kappa, // control point offset vertical
						xe = x + w,           // x-end
						ye = y + h,           // y-end
						xm = x + w / 2,       // x-middle
						ym = y + h / 2;       // y-middle

					ctx.beginPath();
					if(type === 1) {
						ctx.fillStyle = "#fff";
						ctx.strokeStyle ="#000";
						ctx.lineWidth = w / 5;
					} else {
						ctx.fillStyle = "#000";
						ctx.strokeStyle ="#000";
						ctx.lineWidth = 0;
					}
					ctx.moveTo(x, ym);
					ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
					ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
					ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
					ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
					ctx.fill();
					ctx.stroke();
				}
				notCentered(cx - width/2.0, cy - height/2.0, width, height);
			}

			/*if(animation_size[y][x] > 0.1) {
				drawEllipse(canvas.width / 2 + (x - 3.5) * game.gridSize - 4 * game.animation_size[y][x], canvas.height / 2 + (y - 3.5) * game.gridSize - 3, 8 * game.animation_size[y][x], 12 * game.animation_size[y][x], 1);
				drawEllipse(canvas.width / 2 + (x - 3.5) * game.gridSize + 4 * game.animation_size[y][x], canvas.height / 2 + (y - 3.5) * game.gridSize - 3, 7 * game.animation_size[y][x], 10 * game.animation_size[y][x], 1);
				
				var pupilX = canvas.width / 2 + (x - 3.5) * game.gridSize - 4 * game.animation_size[y][x];
				var pupilY = canvas.height / 2 + (y - 3.5) * game.gridSize - 3 * game.animation_size[y][x];
				drawEllipse(pupilX + (mx - pupilX) / 200, pupilY + (my - pupilY) / 150, 2 * game.animation_size[y][x], 4 * game.animation_size[y][x], 2);
				
				var pupilX = canvas.width / 2 + (x - 3.5) * game.gridSize + 4 * game.animation_size[y][x];
				var pupilY = canvas.height / 2 + (y - 3.5) * game.gridSize - 3 * game.animation_size[y][x];
				drawEllipse(pupilX + (mx - pupilX) / 200, pupilY + (my - pupilY) / 150, 2 * game.animation_size[y][x], 3 * game.animation_size[y][x], 2);
			}*/
		}

		for(x = 0; x < game.grid[0].length; x++) {
			for(y = 0; y < game.grid.length; y++) {
				if(game.animation_grid[y][x] === 0) {
					if(game.currentPlayer === 1) {
						if(game.suggestionAlpha > 0.1 && game.canPlacePiece(game.currentPlayer, x, y, game.grid)) {
							ctx.globalAlpha = game.suggestionAlpha;
							ctx.fillStyle = "#fff";
							ctx.fillRect(canvas.width / 2 + (x - 4) * game.gridSize + 1, canvas.height / 2 + (y - 4) * game.gridSize + 1, game.gridSize - 2, game.gridSize - 2);
							ctx.globalAlpha = 1;
						}
						if(mx_g === x && my_g === y && game.canPlacePiece(game.currentPlayer, x, y, game.grid)) {
							renderTile(game.currentPlayer, x, y, 1, false);
							canvas.style.cursor = "pointer";
							if(clicked) {
								game.grid = game.placePiece(game.currentPlayer, x, y, game.grid);
								game.animation_size[y][x] = 0;
								game.currentPlayer = 3 - game.currentPlayer;
								game.missed_turn = 0;
							}
						}
						game.suggestionAlpha += (0.8 - game.suggestionAlpha) / 500;
					} else {
						game.suggestionAlpha = 0.1;
					}
				} else {
					renderTile(game.animation_grid[y][x], x, y, game.animation_size[y][x]);
				}
			}
		}

		if(game.currentPlayer === 2) {
			if(game.playerTimer < 0) {
				if(!game.GAME_OVER) {
					var chosenMove = game.getAiMove();
					game.grid = game.placePiece(game.currentPlayer, chosenMove.x, chosenMove.y, game.grid);
					game.animation_size[chosenMove.y][chosenMove.x] = 0;
					game.currentPlayer = 1;
					game.missed_turn = 0;
				}
			} else {
				game.playerTimer--;
			}
		} else {
			game.playerTimer = 150;
		}

	})();

	ctx.fillStyle = "#fff";
	ctx.textAlign="center";
	ctx.textBaseline = "middle";
	if(game.GAME_OVER) {
		ctx.font = "42px Arial";
		ctx.fillText("Game Over", canvas.width / 2, 30);
		ctx.font = "24px Arial";
		var winner = game.calcWinner();
		if(winner === 1) {
			ctx.fillText("Red Wins", canvas.width / 2, 60);
		}
		if(winner === 2) {
			ctx.fillText("Green Wins", canvas.width / 2, 60);
		}
		if(winner === 0) {
			ctx.fillText("Tie Game", canvas.width / 2, 60);
		}
	}
	if(game.missed_turn === 2) {
		ctx.font = "20px Arial";
		ctx.fillText("Green missed", 80, 150);
		ctx.fillText("a turn", 80, 174);
	}
	if(game.missed_turn === 1) {
		ctx.font = "20px Arial";
		ctx.fillText("Red missed", canvas.width - 80, 150);
		ctx.fillText("a turn", canvas.width - 80, 174);
	}

	if(menu.renderButton(80, canvas.height - 28, 100, 30, "Back")) {
		canvas.style.cursor = "pointer";
		if(clicked) {
			game.back_to_menu = true;
		}
	}
}

game.updateAnimationGrids = function() {
	for(x = 0; x < 8; x++) {
		for(y = 0; y < 8; y++) {
			game.animation_size[y][x] += game.animation_size_vel[y][x];

			if(game.animation_grid[y][x] === game.grid[y][x]) {
				if(game.animation_size[y][x] < 1) {
					game.animation_size_vel[y][x] += 0.01;
				} else {
					game.animation_size_vel[y][x] -= 0.009;
				}
			} else {
				if(game.animation_size[y][x] > 0) {
					game.animation_size_vel[y][x] -= 0.01;
				} else {
					game.animation_size[y][x] = 0;
					game.animation_grid[y][x] = game.grid[y][x];
				}
			}

			game.animation_size_vel[y][x] *= 0.9;
			if(Math.abs(game.animation_size_vel[y][x]) < 0.03) {
				game.animation_size_vel[y][x] *= 0.9;
			}
		}
	}
}

game.initGame = function() {
	clicked = false;
	game.initGridForNewGame();

	game.suggestionAlpha = 0;
	game.gridSize = 40;
	game.currentPlayer = 1;
	game.GAME_OVER = false;
	game.missed_turn = 0;

	game.gameTick();
}
game.gameTick = function() {
	game.back_to_menu = false;
	game.checkForAnyMoves();
	game.updateAnimationGrids();
	game.renderGame();
	clicked = false;

	if(game.back_to_menu) {
		for(i = 0; i < menu.buttons.length; i++) {
			menu.buttons[i].actualWidth = menu.buttons[i].smallWidth;
		}
		window.requestAnimationFrame(menu.tick);
	} else {
		window.requestAnimationFrame(game.gameTick);
	}
}