// declaring variables
var gameOver, restart,gameOverImg,restartImg;
var background1,backgroundImage;
var ground,groundImage;
var mario, mario_running,mario_collided;
var obstacles1, obstacles2,obstacles3,obstacles4,obstaclesImage1,obstaclesImage2,obstaclesImage3,obstaclesImage4,obstaclesGroup;
var brickImage,brickGroup;
var gameState="play";
var jumpSound,dieSound,checkPointSound;
var score=0;


function preload(){
  
  // Loading Images
 backgroundImage=loadImage("bg.png"); 
 groundImage = loadImage("ground2.png");
 mario_running =    loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  
  mario_collided=loadAnimation("collided.png");
  
  
  obstaclesImage1=loadImage("obstacle1.png");
  obstaclesImage2=loadImage("obstacle2.png");
  obstaclesImage3=loadImage("obstacle3.png");
  obstaclesImage4=loadImage("obstacle4.png");
  backgroundImage=loadImage("bg.png");
  brickImage=loadImage("brick.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  // Loading sound
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  
  // Initialising score
  score=0;
}



function setup(){
  
  //create canvas
  createCanvas (600,400);
  
  //create a background sprite
  background1=createSprite(300,190,600,400);
  background1.addImage(backgroundImage);
 
 
  //create a ground sprite
  ground=createSprite(600,360,400,50);
  ground.addImage(groundImage);
  //ground.visible=false;
  
  //create a mario sprite
  mario=createSprite(300,300,20,20);
  mario.addAnimation("running",mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale=1.4;
  mario.setCollider("rectangle",0,0,18,mario.height);
  //mario.debug=true;
  
  // create and scaling game over and restart sprite
  gameOver = createSprite(300,50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,100);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  // Making gameover and restart sprite invisible
  gameOver.visible = false;
  restart.visible = false;
  
  // Creating groups
  obstaclesGroup=new Group();
  brickGroup=new Group();
}

function draw(){
    //set background color
    background(0);

    
    if (gameState==="play"){
      
      //move the ground
      ground.velocityX=-8;
      
      //change the mario animation
      mario.changeAnimation("running", mario_running);

      // creating infinite Ground
      if (ground.x<0){
         ground.x=ground.width/2;
      }
      
    //jump  and play sound when the space key is pressed
      if (keyDown("space") && mario.y>120 ){
        mario.velocityY=-7;
        jumpSound.play();
      }

       //add gravity
      mario.velocityY= mario.velocityY + 0.4;

      if (brickGroup.isTouching(mario)){
        
        brickGroup[0].destroy();
         //scoring
        score=score +1;
      }
      // assign end state 
      if (obstaclesGroup.isTouching(mario)){
        gameState="end";
        dieSound.play();
      }

      // assigning sound at every 100 points
      if(score>0 && score%100 === 0){
         checkPointSound.play() 
      }
      
      //stop mario from falling down
      mario.collide(ground);
      
      //spawn the obstacle
      spawnObstacles();
      
      //spawn the bricks
      spawnBricks();
    }

    if (gameState==="end"){
      gameOver.visible = true;
      restart.visible = true;
      
      //set velocity of mario and ground to 0
      ground.velocityX=0;
      mario.velocityY=0;
      
      //change the mario animation
      mario.changeAnimation("collided", mario_collided);
      
      //set velocity of obstcales and bricks to 0
      obstaclesGroup.setVelocityXEach(0);
      brickGroup.setVelocityXEach(0);

      //set lifetime of the game objects so that they are      never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      brickGroup.setLifetimeEach(-1);

      if(mousePressedOver(restart)) {
        reset();
      }

    }

    drawSprites();
    //displaying score
    stroke("black");
    fill ("black");
    textSize(20);
    text("Score: "+ score, 450,30);
  }

function spawnObstacles(){
  //To spawn the obstacles
  if (frameCount % 200 ===0){
    var obstacles=createSprite(500,295,40,50);
   
    var rand =Math.round(random(1,4)); 
    
    //generate random obstacles
    switch (rand){
      case 1: obstacles.addImage(obstaclesImage1);
      break;
      case 2: obstacles.addImage(obstaclesImage2);
      break;
      case 3: obstacles.addImage(obstaclesImage3);
      break;
      case 4: obstacles.addImage(obstaclesImage4);
      break;
      default: break;
    }
    
    // Assigning velocity to obstacles
    obstacles.velocityX=-2;
    //assign lifetime to the obstacle
    obstacles.lifetime=400;
    //add each obstacle to the group
    obstaclesGroup.add(obstacles);
    
  }
}
  
function spawnBricks(){
  //To spawn the bricks
    if (frameCount % 90 ===0){
      var brick= createSprite(600,Math.round(random(140,200),40,20)); 
      brick.addImage(brickImage);
      
      // Assigning velocity to obstacles
      brick.velocityX=-2;
      
      //assign lifetime to the variable
      brick.lifetime=400;
      
      //adjust the depth
      brick.depth = mario.depth;
      mario.depth = mario.depth + 1;
      
      //add each brick to the group
      brickGroup.add(brick);
    }
  
  }
 function reset(){
  gameState = "play";
  gameOver.visible = false;
  restart.visible = false;
  mario.changeAnimation("running", mario_running);
  obstaclesGroup.destroyEach();
  brickGroup.destroyEach();
  score = 0;
 } 
  
  
