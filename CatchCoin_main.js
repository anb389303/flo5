
      /******************************************************************************
      * definition
      ******************************************************************************/

      // set screensize static
      const WIDTH = 1000;
      const HEIGHT = 750;
      const GAME_TIME = 60;

      // define Keyboard
      var keys;
      // define characters and objects
      var knight;
      var crates;
      var background;
      var coinTimer; // timer for falling Bitcoins
      var coins; // falling Bitcoins

      // scores and Timer
      var score = 0;
      var scoreText;

      var secondsLeft = GAME_TIME;
      var timeLeftText;
      var timeLeftTimer;

      var gameOver = false;
      var coinsSent = false;

       // configure the game
       // --> heigth, with, render-type, game loop function
      var config = {
        //reslolution
        width: WIDTH,
        height: HEIGHT,
        // rendering type
        type: Phaser.AUTO, //let choose Phaser the best way to render
        // scene definition -> Game loop
        scene:{ //define different functions for the scene
          preload: gamePreload,  // fetch all data from hd to memory
          create: gameCreate,   // crate game from memory data
          update: gameUpdate    // update the data from Game
        },
        //physics object - use simple physics arcade
        physics:{
          default: "arcade",
          arcade:{
            gravity:{y:3000}, // x or y axis, speed (+,- possible)
            debug:false
          }
        }

      }


/******************************************************************************
* Function implementation
******************************************************************************/

      /***************************************************************
      * preload
      ****************************************************************/
      // funcitons run only once
      function gamePreload() {
        //Loading assets
        this.load.image("knight", "assets/knight.png");
        this.load.image("crate", "assets/crate.png");
        this.load.image("background","assets/background.png");
        this.load.image("bitcoin","assets/bitcoin.png");

        // load run animation frame
        this.load.image("run_frame_1","assets/knight/run/Run (1).png");
        this.load.image("run_frame_2","assets/knight/run/Run (2).png");
        this.load.image("run_frame_3","assets/knight/run/Run (3).png");
        this.load.image("run_frame_4","assets/knight/run/Run (4).png");
        this.load.image("run_frame_5","assets/knight/run/Run (5).png");
        this.load.image("run_frame_6","assets/knight/run/Run (6).png");
        this.load.image("run_frame_7","assets/knight/run/Run (7).png");
        this.load.image("run_frame_8","assets/knight/run/Run (8).png");
        this.load.image("run_frame_9","assets/knight/run/Run (9).png");
        this.load.image("run_frame_10","assets/knight/run/Run (10).png");

        // load run animation frame
        this.load.image("idle_frame_1","assets/knight/idle/Idle (1).png");
        this.load.image("idle_frame_2","assets/knight/idle/Idle (2).png");
        this.load.image("idle_frame_3","assets/knight/idle/Idle (3).png");
        this.load.image("idle_frame_4","assets/knight/idle/Idle (4).png");
        this.load.image("idle_frame_5","assets/knight/idle/Idle (5).png");
        this.load.image("idle_frame_6","assets/knight/idle/Idle (6).png");
        this.load.image("idle_frame_7","assets/knight/idle/Idle (7).png");
        this.load.image("idle_frame_8","assets/knight/idle/Idle (8).png");
        this.load.image("idle_frame_9","assets/knight/idle/Idle (9).png");
        this.load.image("idle_frame_10","assets/knight/idle/Idle (10).png");


      }

      /***************************************************************
      * create
      ****************************************************************/
      function gameCreate() {
        //inital setup logic on the asset and other setup
        //this.add.image(540, 250, "knight");

        //set background - set before all other items so it is in background
        this.add.image(WIDTH/2, HEIGHT/2,"background")

        // load knight with sprite mehtod using physics
        knight = this.physics.add.sprite(50,100,"knight");
        //set bounding box
        knight.body.setSize(400,600,10,0);
        // scale Image
        knight.scaleX = 0.15;
        knight.scaleY = knight.scaleX;

        // create animation frames
        this.anims.create({
          key: "knight_run",
          frames:[
            {key: "run_frame_1"},
            {key: "run_frame_2"},
            {key: "run_frame_3"},
            {key: "run_frame_4"},
            {key: "run_frame_5"},
            {key: "run_frame_6"},
            {key: "run_frame_7"},
            {key: "run_frame_8"},
            {key: "run_frame_9"},
            {key: "run_frame_10"}
          ],
          frameRate: 10,
          repeat: 1
        });

        this.anims.create({
          key: "knight_idle",
          frames:[
            {key: "idle_frame_1"},
            {key: "idle_frame_2"},
            {key: "idle_frame_3"},
            {key: "idle_frame_4"},
            {key: "idle_frame_5"},
            {key: "idle_frame_6"},
            {key: "idle_frame_7"},
            {key: "idle_frame_8"},
            {key: "idle_frame_9"},
            {key: "idle_frame_10"}
          ],
          frameRate: 10,
          repeat: 1
        });

        // build a floor with crates with the static physics Group
        //static Group
        crates = this.physics.add.staticGroup()
        // create floor with crates
        var x = -160;
        while (x <= WIDTH + 160) {
          crates.create(x,710,"crate");
          x += 80;
        }

        // add some crates
        crates.create(140,560,"crate");
        crates.create(130,170,"crate");
        crates.create(300,450,"crate");
        crates.create(300,200,"crate");
        crates.create(500,250,"crate");
        crates.create(600,400,"crate");
        crates.create(600,100,"crate");
        crates.create(750,250,"crate");
        crates.create(900,170,"crate");
        crates.create(700,540,"crate");

        // add collide detector
        this.physics.add.collider(crates, knight);

        // initialize Keyboard
        keys = this.input.keyboard.createCursorKeys();

        //define coin timer for dropping coins from sky
        coinTimer = this.time.addEvent({
          //delay: 3000, // timer repeats all 3 sec.
          delay: Phaser.Math.Between(400,3000), // funciton repeats between given ms
          callback: generateCoins,  // function called to execute all 3 sec. (delay)
          callbackScope: this, // scope where to look for callback function -> it is in "this" object
          repeat: -1 // repeat infinitly
        });

        //define timeLeftTimer - each second secondsLeft should decrease by 1
        timeLeftTimer = this.time.addEvent({
          delay: 1000,
          callback: updateTimeLeft,
          callbackScope: this,
          repeat: -1
        });


        // add scoreText and timeLeftText to screen
        scoreText = this.add.text(16, 16,  // position
                                  "Bitcoin Bag = 0", // text
                                  {
                                    fontSize: "32px",
                                    fill: "#000" //black -> google "hex color picker"
                                  }
        );
        timeLeftText = this.add.text(16, 56,  // position
                                  secondsLeft + " seconds left", // text
                                  {
                                    fontSize: "32px",
                                    fill: "#f00" //red
                                  }
        );
      }

      /***************************************************************
      * Update
      ****************************************************************/
      // gameUpdate run multible times
      function gameUpdate() {
        //monitoring inputs and telling game how to update

        // execute only if !gameOver
        if (gameOver) return;

        //add move keypad funcitionality
        if(keys.left.isDown){
          if(keys.shift.isDown){
            knight.setVelocityX(-600);
          } else {
            knight.setVelocityX(-300);
          }
          knight.play("knight_run", true);
          knight.flipX = true;

        }else if (keys.right.isDown){
          if(keys.shift.isDown){
            knight.setVelocityX(600);
          } else {
            knight.setVelocityX(300);
          }
          knight.play("knight_run", true);
          knight.flipX = false;

        }else {
          knight.setVelocityX(0);
          knight.play("knight_idle", true);

        }

        // add Jump keypad funcitionality when hitting arrow up and knight is on the floor
        if((keys.up.isDown
          || keys.space.isDown)
            && knight.body.touching.down){
          knight.setVelocityY(-1200);
        }

      }

      /***************************************************************
      * generateCoins
      ****************************************************************/
      function generateCoins() {
        //console.log("generateCoins");

        coins = this.physics.add.group({
          key: "bitcoin", // key of the physics Group
          repeat: 1, //how often repeat each executed time -> this is twice since computers count from 0
          setXY:{ //from where in X and Y should Bitcoins dop
              x: Phaser.Math.Between(0, WIDTH),
              y: -100, // alwas drop from over the sky
              stepX: Phaser.Math.Between(30,WIDTH/3) // interval to be dropped
          }
        });

        // access each genereted coin through iteration over childs
        coins.children.iterate(function(child) {
          // code to execute on each child - iterate gives us the child back
          child.setBounceY(
            Phaser.Math.FloatBetween(0.3, 1.2)
          );
        });

        // add collider to falling coins
        this.physics.add.collider(coins, crates);
        // define what to do wehen crate overlaps coins -> catch up Coins
        this.physics.add.overlap(knight,coins, collectCoin, null, this);

      }

      /***************************************************************
      * collectCoin
      ****************************************************************/
      function collectCoin(knight, coins) {
        console.log("collectCoin");
        coins.disableBody(true, true); // disable coins -> no events where thrown when overlapping
        score ++;
        scoreText.setText("Bitcoin Bag = " + score);
      }

      /***************************************************************
      * updateTimeLeft
      ****************************************************************/
      function updateTimeLeft() {

        if(gameOver){
          if(!coinsSent){
/*
            // get address from User Input
            var address = prompt("Please enter your ETH address", "");
            if(address == null || address == ""){
              alert("User cancelled the prompt");
            }
            else{
              mintAfterGame(address, score);
            }
*/
            //get address from Metamask
            mintAfterGame(score);

            coinsSent = true;
          }
          return;
        };

        secondsLeft --;
        timeLeftText.setText(secondsLeft + " seconds left");

        if (secondsLeft <=0) {
          this.physics.pause(); //stopps all physics in the game
          gameOver = true;
        }
      }


/******************************************************************************
* start Game
******************************************************************************/
      // definiton of Game with whole config
      var game = new Phaser.Game(config);













































































// overscoll
