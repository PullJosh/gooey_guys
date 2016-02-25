var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

var mx = -1, my = -1, mx_g = -1, my_g = -1, clicked = false;

canvas.onmousemove = function(e) {
	if(e.offsetX) {
        mx = e.offsetX;
        my = e.offsetY;
    } else if(e.layerX) {
        mx = e.layerX;
        my = e.layerY;
    }

    if(Math.abs(mx - canvas.width / 2) < game.gridSize * 4) {
    	mx_g = Math.round((mx - canvas.width / 2) / game.gridSize + 3.5);
    } else {
    	mx_g = -1;
    }
    if(Math.abs(my - canvas.height / 2) < game.gridSize * 4) {
    	my_g = Math.round((my - canvas.height / 2) / game.gridSize + 3.5);
    } else {
    	my_g = -1;
    }
};

canvas.onmousedown = function() {
	clicked = true;
};