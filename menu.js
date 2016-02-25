var menu = {
	MODE: "menu",
	buttons: [],
	hoverTransport: null, // Where to go if the mouse is clicked
	renderButton: function(x, y, width, height, text) {
		var hover = (Math.abs(mx - x) < width / 2 && Math.abs(my - y) < height / 2) ||
					  (Math.pow(mx - (x - width / 2), 2) + Math.pow(my - y, 2) < Math.pow(height / 2, 2) + 3) ||
					  (Math.pow(mx - (x + width / 2), 2) + Math.pow(my - y, 2) < Math.pow(height / 2, 2) + 3);

		ctx.fillStyle = "#fff";
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 2;
		ctx.textAlign="center";
		ctx.textBaseline = "middle";
		ctx.font = "18px Arial";
		ctx.beginPath();
		ctx.arc(x - width / 2, y, height / 2, 0.5 * Math.PI, 1.5 * Math.PI);
		ctx.arc(x + width / 2, y, height / 2, 1.5 * Math.PI, 0.5 * Math.PI);
		ctx.lineTo(x - width / 2, y + height / 2);
		ctx.closePath();
		ctx.globalAlpha = 0.5;
		ctx.fill();
		ctx.globalAlpha = 1;
		ctx.stroke();
		ctx.fillStyle = "#000";
		ctx.fillText(text,x,y);

		return hover;
	},
	render: function() {
		canvas.width = 640;
		canvas.height = 480;
		canvas.style.cursor = "default";
		ctx.fillStyle = "#ddd";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		var clouds = new Image;
		clouds.src = "img/Background.png";
		ctx.drawImage(clouds, 0, 0, canvas.width, canvas.height);

		switch(menu.MODE) {
			case "menu":
				// Render buttons
				for(i = 0; i < menu.buttons.length; i++) {
					if(menu.renderButton(menu.buttons[i].x, menu.buttons[i].y, menu.buttons[i].actualWidth, menu.buttons[i].height, menu.buttons[i].text)) {
						menu.buttons[i].actualWidth += (menu.buttons[i].bigWidth - menu.buttons[i].actualWidth) / 5;
						menu.hoverTransport = menu.buttons[i].text;
						canvas.style.cursor = "pointer";
					} else {
						menu.buttons[i].actualWidth += (menu.buttons[i].smallWidth - menu.buttons[i].actualWidth) / 5;
					}
				}

				// Game Title
				ctx.textAlign="center";
				ctx.textBaseline = "middle";
				ctx.font = "64px Arial";
				ctx.fillText("G    ey Guys", canvas.width / 2, 80);

				ctx.beginPath();
				ctx.fillStyle = "#CC5B22";
				ctx.arc(208, 84, 16, 0, Math.PI * 2);
				ctx.fill();
				ctx.closePath();

				ctx.beginPath();
				ctx.fillStyle = "#5CB712";
				ctx.arc(244, 84, 16, 0, Math.PI * 2);
				ctx.fill();
				ctx.closePath();
				break;

			case "instructions":
				for(i = 0; i < menu.buttons.length; i++) {
					menu.buttons[i].actualWidth = menu.buttons[i].smallWidth;
				}
				ctx.font = "20px Arial";
				ctx.fillStyle = "#fff";
				ctx.textAlign = "left";
				ctx.textBaseline = "alphabetic";
				ctx.fillText("Each team of gooey guys is attempting to cover more of the", 60, 60);
				ctx.fillText("board. At the end of the game, whichever team posses", 60, 85);
				ctx.fillText("more squares is the winner.", 60, 110);
				ctx.fillText("A guy may only be placed in a position that \"outflanks\" the", 60, 170);
				ctx.fillText("opponent's guys. Outflanking is when a line", 120, 195);
				ctx.fillText("of guys from the same team are surrounded", 120, 220);
				ctx.fillText("on either end by a guy of the opposing team.", 120, 245);
				ctx.fillText("When a guy is placed, all of the pieces he is outflanking will", 60, 310);
				ctx.fillText("switch to become a part of his team.", 60, 335);
				ctx.fillText("If a player has no moves available, they lose a turn.", 60, 385);
				ctx.fillText("The game is over when neither player has a possible move.", 60, 410);

				if(menu.renderButton(80, canvas.height - 28, 100, 30, "Back")) {
					canvas.style.cursor = "pointer";
					menu.hoverTransport = "Menu";
				} else {
					canvas.style.cursor = "default";
				}
				break;
			case "story":
				for(i = 0; i < menu.buttons.length; i++) {
					menu.buttons[i].actualWidth = menu.buttons[i].smallWidth;
				}
				ctx.font = "20px Arial";
				ctx.fillStyle = "#fff";
				ctx.textAlign = "left";
				ctx.textBaseline = "alphabetic";
				ctx.fillText("The gooey guys are a species which evolved from the", 60, 60);
				ctx.fillText("blobfish. They have evolved to be bouncier, happier,", 60, 85);
				ctx.fillText("and far less likely to survive. Why less likely to live?", 60, 110);
				ctx.fillText("Because all they ever do is play games.", 135, 170);
				ctx.fillText("Never once have they searched for food", 135, 195);
				ctx.fillText("or fended off other animals. All they do is", 135, 220);
				ctx.fillText("sit around and play games.", 130, 245);
				ctx.fillText("The gooey guys have designed a new game. This time", 60, 310);
				ctx.fillText("it's up to you, the player, to help the green team take", 60, 335);
				ctx.fillText("the victory.", 60, 360);
				ctx.fillText("But in all seriousness... How are these guys even alive?", 60, 410);

				if(menu.renderButton(80, canvas.height - 28, 100, 30, "Back")) {
					canvas.style.cursor = "pointer";
					menu.hoverTransport = "Menu";
				} else {
					canvas.style.cursor = "default";
				}
				break;
		}
	},
	tick: function() {
		menu.hoverTransport = null;
		menu.render();
		if(menu.hoverTransport === null || !clicked) {
			window.requestAnimationFrame(menu.tick);
		} else {
			switch(menu.hoverTransport.toLowerCase()) {
				case "menu":
					menu.MODE = "menu";
					window.requestAnimationFrame(menu.tick);
					break;
				case "play":
					game.initGame();
					break;
				case "instructions":
					menu.MODE = "instructions";
					window.requestAnimationFrame(menu.tick);
					break;
				case "story":
					menu.MODE = "story";
					window.requestAnimationFrame(menu.tick);
					break;
				default:
					window.requestAnimationFrame(menu.tick);
					break;
			}
		}
		clicked = false;
	},
	init: function() {
		canvas.width = 640;
		canvas.height = 480;
		menu.buttons = [
			{
				x: canvas.width / 2,
				y: canvas.height / 2 - 40,
				smallWidth: 150,
				bigWidth: 180,
				actualWidth: 150,
				height: 60,
				text: "Play"
			},
			{
				x: canvas.width / 2,
				y: canvas.height / 2 + 40,
				smallWidth: 150,
				bigWidth: 180,
				actualWidth: 150,
				height: 60,
				text: "Instructions"
			},
			{
				x: canvas.width / 2,
				y: canvas.height / 2 + 120,
				smallWidth: 150,
				bigWidth: 180,
				actualWidth: 150,
				height: 60,
				text: "Story"
			}
		];
		menu.tick();
	}
};