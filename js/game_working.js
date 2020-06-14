// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/forestBackground.jpg";

// Puppy image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/puppySprite.png";  // new sprite image


// lots of variables to keep track of sprite geometry
//we are having 4 rows and 3 cols in the current sprite sheet
var rows = 9; 
var cols = 4; 


//second row for the right movement (counting the index from 0)
var trackRight = 1; 
//third row for the left movement (counting the index from 0)
var trackLeft = 3; 
var trackUp = 2;   // not using up and down in this version, see next version
var trackDown = 0; 

var spriteWidth = 333; // also  spriteWidth/cols; 
var spriteHeight = 750;  // also spriteHeight/rows; 
//To get the width of a single sprite we divided the width of sprite with the number of cols
//because all the sprites are of equal width and height 
var width = spriteWidth/cols; 
//Same for the height we divided the height with number of rows 
var height = spriteHeight/rows; 
var curXFrame = 0; // start on left side
var frameCount = 4;  // 4 frames per row
//x and y coordinates of the overall sprite image to get the single frame  we want
var srcX=0; 
var srcY=0;

//Assuming that at start the character will move right side 
var left = false;
var right = true;
var up = false;
var down = false;

// Cat image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/foodPusheen.png";

// ------- FOOD IMAGE DEFINITION --------

// food sprite variables
var foodReady = false;
var foodImage = new Image();

foodImage.onload = function () {
	foodReady = true;
};
foodImage.src = "images/foodsprite.png"

var foodSpriteRows = 10; 
var foodSpriteCols = 5; 

var foodSpriteSheetWidth = 437; 
var foodSpriteSheetHeight = 570; 

var foodWidth = foodSpriteSheetWidth/foodSpriteCols;
var foodHeight = foodSpriteSheetHeight/foodSpriteRows;

var foodSrcRow = Math.floor(Math.random()*10); // define row for food sprite from spritesheet
var foodSrcCol = Math.floor(Math.random()*5); // define column for food sprite from spritesheet
console.log(foodSrcRow + "test")

var foodSrcY = foodSrcRow * foodHeight;
var foodSrcX = foodSrcCol * foodWidth;

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var food = {};
var monster = {};
var foodEaten = 0;
var highscore = 0;
var x = canvas.width/2;
var y = canvas.height-30;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// initiate and reset game function
var initiateAndReset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
	
	// Set random food sprite from spritesheet
	//foodSrcRow = 4 //Math.random(10) 
	//foodSrcCol = 4 //Math.random(5) 

	// randomize row and column on spritesheet
	foodSrcRow = Math.floor(Math.random()*10); // define row for food sprite from spritesheet
	foodSrcCol = Math.floor(Math.random()*5); // define column for food sprite from spritesheet
	
	//set new x and y for food item
	foodSrcY = foodSrcRow * foodHeight;
	foodSrcX = foodSrcCol * foodWidth;
	
	console.log(foodSrcRow);
	console.log(foodSrcCol);
	// Throw the food somewhere on the screen randomly
	food.x = 32 + (Math.random() * (canvas.width - 64));
	food.y = 32 + (Math.random() * (canvas.height - 64));
	
	
	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

var counter = 0; // used to slow frame rate of animation
// Update game objects
var update = function (modifier) {
	ctx.clearRect(hero.x, hero.y,width,height); // clear last image posistion
	
	if (38 in keysDown && hero.y > 0) { // Player holding up
		left = false;   // for animation
		right = false; // for animation
		up = true; // for animation
		down = false; // for animation
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown && hero.y < 960-64) { // Player holding down
		left = false;   // for animation
		right = false; // for animation
		up = false; // for animation
		down = true; // for animation
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown && hero.x > 0) { // Player holding left
		left = true;   // for animation
		right = false; // for animation
		up = false; // for animation
		down = false; // for animation
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown && hero.x < 1024-64) { // Player holding right
		left = false;   // for animation
		right = true; // for animation
		up = false; // for animation
		down = false; // for animation
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		alert('GAME OVER!');
		initiateAndReset();
		foodEaten = 0;
	}

	if (
		hero.x <= (food.x + 32)
		&& food.x <= (hero.x + 32)
		&& hero.y <= (food.y + 32)
		&& food.y <= (hero.y + 32)
	) {
		++foodEaten;
		initiateAndReset();
		monsterReady = false;
		monsterImage = new Image();
		monsterImage.onload = function () {
		monsterReady = true;
		};
	monsterImage.src = "images/foodPusheen.png";
		if (monsterReady) {
			ctx.drawImage(monsterImage, monster.x, monster.y);
		}
	}

	if(counter == 5){  // adjust this to change "walking speed" of animation
		curXFrame = ++curXFrame % frameCount; 	//Updating the sprite frame index 
	// it will count 0,1,2,0,1,2,0, etc
		counter = 0;
	 } else {
		counter++;
	 }

	
	srcX = curXFrame * width;   	//Calculating the x coordinate for spritesheet 
	//if left is true,  pick Y dim of the correct row
	if(left){
		//calculate srcY 
		srcY = trackLeft * height; 
	}
	
	//if the right is true,   pick Y dim of the correct row
	if(right){
		//calculating y coordinate for spritesheet
		srcY = trackRight * height; 
	}

	if(up){
		//calculating y coordinate for spritesheet
		srcY = trackUp * height; 
	}
	if(down){
		//calculating y coordinate for spritesheet
		srcY = trackDown * height; 
	}

	// did puppy hit a border?
	if (
		hero.x <= 0

	) {
		hero.x = 0;
	}
	if (
		hero.x >= 440

	) {
		hero.x = 440;
	}
	if (
		hero.y <= 25
	
	) {
		hero.y = 25;
	}
	if (
		hero.y >= 400
	
	) {
		hero.y = 400;
	}

	// did cat hit border?
	if (
		monster.x <= 0

	) {
		monster.x = 0;
	}
	if (
		monster.x >= 440

	) {
		monster.x = 440;
	}
	if (
		monster.y <= 25
	
	) {
		monster.y = 25;
	}
	if (
		monster.y >= 400
	
	) {
		monster.y = 400;
	}

	// did food hit border?
	if (
		food.x <= 0

	) {
		food.x = 0;
	}
	if (
		food.x >= 440

	) {
		food.x = 440;
	}
	if (
		food.y <= 25
	
	) {
		food.y = 25;
	}
	if (
		food.y >= 400
	
	) {
		food.y = 400;
	}

};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		//ctx.drawImage(heroImage, hero.x, hero.y);
		ctx.drawImage(heroImage,srcX,srcY,width, height,hero.x,hero.y,width,height);
	}

	if (foodReady) {
		
		ctx.drawImage(foodImage, foodSrcX, foodSrcY, foodWidth, foodHeight, food.x, food.y, foodWidth, foodHeight);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Monaco";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Points: " + foodEaten, 32, 32);

	
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Monaco";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("High Score: " + highscore, 290, 32);

};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
	loopCount--;
	 
	// Request to do this again ASAP
	if (loopCount > 0) {
		requestAnimationFrame(main);
	}
	else 
	{
		alert('GAME OVER! PUPPY IS SATISFIED!');
		initiateAndReset();
		foodEaten = 0;
	}
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
var loopCount = 3000;
initiateAndReset();
main();
