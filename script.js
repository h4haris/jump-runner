
// Copyright 2011 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var HS = (function() {
 
	game = (function() {
				   
	var canvas,
		context,
		canvasWidth = 490,
		canvasHeight = 220,
		images = {},
		frameInterval,
		fps = 30,
		drawing = false,
		fpsInterval,
		numFramesDrawn = 0,
		curFPS = 0,
		level = 1,
		maxLevel = 10,
		speed = 20,
		curLoadResNum = 0,
		totalLoadResources = 10,
		displayList = [],
		ball,
		hero,
		background,
		isPlaying = false,
	
		Hero = function() {
			
			var x = 400,
				y = 0,	
				jumping = false,
				blinking = false,
				blinkUpdateTime = 100,
				// blinkTimer = setInterval(updateBlink, blinkUpdateTime),
				// breathTimer = setInterval(updateBreath, 1000/25),
				breathInc = 0.1,
				breathDir = 1,
				breathAmt = 0,
				breathMax = 2,
				blinkInterval,
				eyeOpenTime = 0,
				timeBtwBlinks = 4000,
				maxEyeHeight = 14,
				curEyeHeight = maxEyeHeight,
				runImage = 1,
				runMax = 9,
				runUpdateTime = 100,
				runInterval = setInterval(updateRun, runUpdateTime);
				
			function updateBreath()
			{ 
				// breath in
				if(breathDir == 1){
					breathAmt -= breathInc;
					if(breathAmt < -breathMax)
					{
						breathDir = -1;
					}
				}else{  // breath out
					breathAmt += breathInc;
					if(breathAmt > breathMax)
					{
						breathDir = 1;
					}
				}
			}
			function updateBlink()
			{ 
				eyeOpenTime += blinkUpdateTime;
				
				if(eyeOpenTime >= timeBtwBlinks){
					blink();
				}
			}
			function blink()
			{
				if(blinking == false)
				{
					blinking = true;
					blinkLoop();
				}
				
			}
			function blinkLoop()
			{
				--curEyeHeight;
				if(curEyeHeight <=0){
					curEyeHeight = maxEyeHeight;
					eyeOpenTime = 0;
					blinking = false;
				}else{
					setTimeout(blinkLoop, 10);
				}
			}
			function jump() {
				if(jumping === false) {
					jumping = true;
					y -= 130;
					setTimeout(land, 500);
				}
			}
			function land() {
				if(jumping === true) {
					y += 130;
					jumping = false;
				}
			}
			function updateRun() { 
				runImage += 1;
				if(runImage > runMax) {
				  runImage = 1;
				}
			}
			function stop() {
				isPlaying = false;
			}
			function draw(context) {
				
				drawShadow(x - 75, jumping ? y + 330 + 130 : y + 330);				
				
				if(isPlaying){
					if (jumping) {
						context.drawImage(images["run-3"], x - 180, y + 88, 250 , 350);
					} else {
						context.drawImage(images["run-"+runImage], x - 180, y + 88, 250 , 350);
					}
				}
				else {
					context.drawImage(images["run-7"], x - 180, y + 88, 250 , 350);
				}
  
				// if (jumping) {
					// context.drawImage(images["leftArm-jump"], x + 40, y - 42 - breathAmt);
					// context.drawImage(images["legs-jump"], x, y - 6);
				// } else {
					// context.drawImage(images["leftArm"], x + 40, y - 42 - breathAmt);
					// context.drawImage(images["legs"], x, y);
				// }
				// context.drawImage(images["torso"], x, y - 50);
				// context.drawImage(images["head"], x - 10, y - 125 - breathAmt);
				// context.drawImage(images["hair"], x - 37, y - 138 - breathAmt);
				// if(jumping){
					// context.drawImage(images["rightArm-jump"], x - 35, y - 42 - breathAmt);
				// }else{
					// context.drawImage(images["rightArm"], x - 15, y - 42 - breathAmt);
				// }
				
				// drawEye(x + 47, y - 68 - breathAmt);
				// drawEye(x + 58, y - 68 - breathAmt);
			}
			function drawEye(centerX, centerY)
			{ 
				var height = curEyeHeight,
					width = 8;
				
				context.beginPath();
				context.moveTo(centerX,centerY - height/2);
			
				context.bezierCurveTo(centerX-width/2,centerY-height/2,
									  centerX-width/2,centerY+height/2,
									  centerX,centerY+height/2);
			
				context.bezierCurveTo(centerX+width/2,centerY+height/2,
									  centerX+width/2,centerY-height/2,
									  centerX,centerY-height/2);
			 
				context.fillStyle = "#000000";
				context.fill();
				context.closePath();
			}
			function drawShadow(centerX, centerY)
			{
				// var height = jumping ? 4 : 6,
					// width = jumping ? 100 : 160 - breathAmt * 2;
				var height = jumping ? 4 : 6,
					width = jumping ? 100 : 160;
			
				context.beginPath();
				context.moveTo(centerX,centerY - height/2);
			
				context.bezierCurveTo(centerX-width/2,centerY-height/2,
									  centerX-width/2,centerY+height/2,
									  centerX,centerY+height/2);
			
				context.bezierCurveTo(centerX+width/2,centerY+height/2,
									  centerX+width/2,centerY-height/2,
									  centerX,centerY-height/2);
			 
				context.fillStyle = "#000000";
				context.fill();
				context.closePath();
			}
			function getX() {
				return x;	
			}
			function setX(pX) {
				x = pX;	
			}
			function getY() {
				return y;	
			}
			function setY(pY) {
				y = pY;	
			}
			function getJumping() {
				return jumping;
			}
			return {
				getX:getX,
				setX:setX,
				getY:getY,
				setY:setY,
				getJumping:getJumping,
				jump:jump,
				blink:blink,
				draw:draw,
				stop:stop
			}
		},
		Ball = function() {
			
			var x = 0,
				y = 0,
				speed = 0, 
				direction = 1, 
				rollTimer, 
				dirty = false, 
				diameter = 20, 
				color = "#DD3333",
				highlightColor = "#fa6565";
				
			rollTimer = setInterval(updateRoll, 1000/25);
				
			function roll(pSpeed, pDirection){
				speed = pSpeed;
				if(pDirection){
					direction = pDirection;
				}
				
			}
			function stop() {
				speed = 0;
			}
			function updateRoll() {
				x += direction * speed;
			}
			function draw(context) {
				
				var centerX = x,
					centerY = y + (diameter + 10)/2 - 2,
					width = (diameter + 30),
					height = 6;
					
				context.beginPath();
				context.moveTo(centerX, centerY);
				context.bezierCurveTo(centerX-width/2,centerY-height/2,
								  centerX-width/2,centerY+height/2,
								  centerX,centerY+height/2);
				context.bezierCurveTo(centerX+width/2,centerY+height/2,
								  centerX+width/2,centerY-height/2,
								  centerX,centerY-height/2);
				context.fillStyle = "#000000";
				context.fill();
				context.closePath();
			
				context.beginPath();
				context.moveTo(x, y - (diameter + 10)/2);
				context.arc(x,y,(diameter + 10)/2,0,2*Math.PI,false);
				context.fillStyle = "#000000";
				context.fill();
				context.closePath();
				
				context.beginPath();
				context.moveTo(x, y - diameter/2);
				context.arc(x,y,diameter/2,0,2*Math.PI,false);
				context.fillStyle = color;
				context.fill();
				context.closePath();
				
				centerX = x + 3;
				centerY = y - 3;
				context.beginPath();
				context.moveTo(centerX, centerY);
				context.arc(centerX,centerY,diameter/3/2,0,2*Math.PI,false);
				context.fillStyle = highlightColor;
				context.fill();
				context.closePath();
			}
			function getX(){
				return x;	
			}
			function setX(pX){
				x = pX;	
			}
			function getY(){
				return y;	
			}
			function setY(pY){
				y = pY;	
			}
			return {
				getX:getX,
				setX:setX,
				getY:getY,
				setY:setY,
				roll:roll,
				draw:draw,
				stop:stop
			};
		},
		Background = function() {
			
			var x = 400,
				y = 0,	
				bgImgWidth = 0,
				bgScrollSpeed = 10,
				isStopped = false;
				bgInterval = setInterval(updateBackground, 1000/fps);
				
			function stop() {
				isStopped = true
				bgImgWidth = 0
			}
			function draw(context) {
				//context.drawImage(images["background"], 0, 0);
				if(isPlaying){
					context.drawImage(images["spacebg"], bgImgWidth, 0, canvas.width,canvas.height);
					context.drawImage(images["spacebg"], bgImgWidth + canvas.width, 0, canvas.width,canvas.height );
				}
				else {
					context.drawImage(images["spacebg"], bgImgWidth, 0, canvas.width,canvas.height);
				}
			}
			function updateBackground() { 
						
				if(!isStopped){
					// update image width
					bgImgWidth -= bgScrollSpeed;

					// reseting the images when the first image entirely exits the screen
					if (bgImgWidth == canvas.width * -1)
						bgImgWidth = 0;
				}
			}
			return {
				stop:stop,
				draw:draw
			}
		}
	
	function throwBall() { 
		ball.roll(speed, -1);
	}
	function start() {
		isPlaying = true;
		frameInterval = setInterval(update, 1000/fps);
		fpsInterval = setInterval(updateFPS, 1000);
	}
	function resourceLoaded()
	{
		if(++curLoadResNum == totalLoadResources) {
			
			// start();
			readyToStart();
		}
	}

	function readyToStart() {			
		var rect = {
			x:canvas.width/3,
			y:canvas.height/3,
			width:200,
			height:100
		};
			
		redraw();
		
		drawPlaybutton(rect);
		
		//Binding the click event on the canvas
		canvas.addEventListener('click', function(evt) {
			evt.stopPropagation();
			if(isPlaying){
				jump();
			}
			else{
				var mousePos = getMousePos(canvas, evt);

				if (isInside(mousePos,rect)) {
					start();
				}  
			}
		}, false);
	}
	
	function getMousePos(canvas, event) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}
	//Function to check whether a point is inside a rectangle
	function isInside(pos, rect){
		return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
	}
	function drawPlaybutton(rect) {
		context.beginPath();
		context.rect(rect.x, rect.y, rect.width, rect.height); 
		context.fillStyle = 'rgba(225,225,225,0.5)';
		context.fill(); 
		context.lineWidth = 2;
		context.strokeStyle = '#000000'; 
		context.stroke();
		context.closePath();
		context.font = '40pt Kremlin Pro Web';
		context.fillStyle = '#000000';
		context.fillText('Start', rect.width + 45, rect.height + 170);
	}
	function loadImage(name) {
		
		images[name] = new Image();
		images[name].onload = function() { resourceLoaded(); }
		images[name].src = "images/" + name + ".png";
	}
	function prepareCanvas(gameDiv, pCanvasWidth, pCanvasHeight) {
		
		canvasWidth = pCanvasWidth;
		canvasHeight = pCanvasHeight;
		
		// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
		canvas = document.createElement('canvas');
		canvas.setAttribute('width', canvasWidth);
		canvas.setAttribute('height', canvasHeight);
		canvas.setAttribute('id', 'canvas');
		gameDiv.appendChild(canvas);
		
		if(typeof G_vmlCanvasManager != 'undefined') {
			canvas = G_vmlCanvasManager.initElement(canvas);
		}
		context = canvas.getContext("2d"); // Grab the 2d canvas context
		// Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
		//     context = document.getElementById('canvas').getContext("2d");
		
		context.font = 'bold 32px "Reenie Beanie"';
		try {
			context.fillText("loading...", 40, 140);
		} catch (ex) {
			
		}
		
		// Load images
		for(var i=1;i<10;i++)
			loadImage("run-"+i);

		loadImage("spacebg");
				
		background = new Background();
		displayList.push(background);

		hero = new Hero();
		hero.setX(245);
		hero.setY(185);
		displayList.push(hero);
		
		ball = new Ball();
		ball.setX(canvasWidth);
		ball.setY(500);
		ball.roll(speed, -1);
		displayList.push(ball);
	}
	function clearCanvas() {
		canvas.width = canvas.width; // clears the canvas 
	}
	function update() {
		
		++numFramesDrawn;
		
		if(level < maxLevel) {
	
			if(ball.getX() < 0) {
				
				speed += 10;
				level += 1;
				
				if (level > maxLevel) {
					ball.stop();
					ball.setX(2000);	
				} else {
					ball.stop();
					ball.setX(canvasWidth + 20);
					setTimeout(throwBall, Math.random() * 3000);
				}
			} else if (ball.getX() > canvasWidth + 30) {
				ball.roll(speed, -1);
			}else if (ball.getX() > hero.getX() && ball.getX() < hero.getX() + 50 && !hero.getJumping()) {
				ball.roll(speed * 2, 1);
			}
		} else {
			background.stop();
			hero.stop();
			ball.stop();
			ball.setX(2000);
		}
		
		redraw();		
	}
	function redraw() {
		
		var i;
		
		clearCanvas();
		
		for(i = 0; i < displayList.length; i++)
		{
			displayList[i].draw(context);	
		}
		
		context.fillStyle = "#000000";
		context.font = 'bold 32px "Reenie Beanie"';
		try {
			if(level < maxLevel){
				context.fillText("Level: " + level + " of " + maxLevel, 300, 40);
			}else{
				context.fillText("You Win!", 300, 100);
			}
		} catch (ex) {
			
		}
	}
	function updateFPS()
	{
		curFPS = numFramesDrawn;
		numFramesDrawn = 0;
	}
	function jump() {
		hero.jump();	
	}
	function blink() {
		hero.blink();	
	}
	return {
		prepareCanvas: prepareCanvas,
		jump:jump,
		blink:blink
	}
}());

    return {
		game:game
    }			   
}());

$(document).ready(function() {
	
	var canvasDiv = $('#canvasDiv');
	HS.game.prepareCanvas(canvasDiv[0], 600, 600);
	
	// $('#canvasDiv').mousedown(function(e)
	// {
		// HS.game.jump();
	// })
	
	$('.blinkButton').mousedown(function(e)
	{
		HS.game.blink();
	})
});

/**/