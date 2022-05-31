
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




/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser - Pointer constructor.
*
* @class Phaser.Pointer
* @classdesc A Pointer object is used by the Mouse, Touch and MSPoint managers and represents a single finger on the touch screen.
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} id - The ID of the Pointer object within the game. Each game can have up to 10 active pointers.
*/
Phaser.Pointer = function (game, id) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {number} id - The ID of the Pointer object within the game. Each game can have up to 10 active pointers.
    */
    this.id = id;

    /**
    * @property {boolean} _holdSent - Local private variable to store the status of dispatching a hold event.
    * @private
    * @default
    */
    this._holdSent = false;

    /**
    * @property {array} _history - Local private variable storing the short-term history of pointer movements.
    * @private
    */
    this._history = [];

    /**
    * @property {number} _lastDrop - Local private variable storing the time at which the next history drop should occur.
    * @private
    * @default
    */
    this._nextDrop = 0;

    /**
    * @property {boolean} _stateReset - Monitor events outside of a state reset loop.
    * @private
    * @default
    */
    this._stateReset = false;

    /**
    * @property {boolean} withinGame - true if the Pointer is within the game area, otherwise false.
    */
    this.withinGame = false;

    /**
    * @property {number} clientX - The horizontal coordinate of point relative to the viewport in pixels, excluding any scroll offset.
    * @default
    */
    this.clientX = -1;

    /**
    * @property {number} clientY - The vertical coordinate of point relative to the viewport in pixels, excluding any scroll offset.
    * @default
    */
    this.clientY = -1;

    /**
    * @property {number} pageX - The horizontal coordinate of point relative to the viewport in pixels, including any scroll offset.
    * @default
    */
    this.pageX = -1;

    /**
    * @property {number} pageY - The vertical coordinate of point relative to the viewport in pixels, including any scroll offset.
    * @default
    */
    this.pageY = -1;

    /**
    * @property {number} screenX - The horizontal coordinate of point relative to the screen in pixels.
    * @default
    */
    this.screenX = -1;

    /**
    * @property {number} screenY - The vertical coordinate of point relative to the screen in pixels.
    * @default
    */
    this.screenY = -1;

    /**
    * @property {number} x - The horizontal coordinate of point relative to the game element. This value is automatically scaled based on game size.
    * @default
    */
    this.x = -1;

    /**
    * @property {number} y - The vertical coordinate of point relative to the game element. This value is automatically scaled based on game size.
    * @default
    */
    this.y = -1;

    /**
    * @property {boolean} isMouse - If the Pointer is a mouse this is true, otherwise false.
    * @default
    */
    this.isMouse = false;

    /**
    * @property {boolean} isDown - If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true.
    * @default
    */
    this.isDown = false;

    /**
    * @property {boolean} isUp - If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true.
    * @default
    */
    this.isUp = true;

    /**
    * @property {number} timeDown - A timestamp representing when the Pointer first touched the touchscreen.
    * @default
    */
    this.timeDown = 0;

    /**
    * @property {number} timeUp - A timestamp representing when the Pointer left the touchscreen.
    * @default
    */
    this.timeUp = 0;

    /**
    * @property {number} previousTapTime - A timestamp representing when the Pointer was last tapped or clicked.
    * @default
    */
    this.previousTapTime = 0;

    /**
    * @property {number} totalTouches - The total number of times this Pointer has been touched to the touchscreen.
    * @default
    */
    this.totalTouches = 0;

    /**
    * @property {number} msSinceLastClick - The number of miliseconds since the last click.
    * @default
    */
    this.msSinceLastClick = Number.MAX_VALUE;

    /**
    * @property {any} targetObject - The Game Object this Pointer is currently over / touching / dragging.
    * @default
    */
    this.targetObject = null;

    /**
    * @property {boolean} active - An active pointer is one that is currently pressed down on the display. A Mouse is always active.
    * @default
    */
    this.active = false;

    /**
    * @property {Phaser.Point} position - A Phaser.Point object containing the current x/y values of the pointer on the display.
    */
    this.position = new Phaser.Point();
    
    /**
    * @property {Phaser.Point} positionDown - A Phaser.Point object containing the x/y values of the pointer when it was last in a down state on the display.
    */
    this.positionDown = new Phaser.Point();

    /**
    * A Phaser.Circle that is centered on the x/y coordinates of this pointer, useful for hit detection.
    * The Circle size is 44px (Apples recommended "finger tip" size).
    * @property {Phaser.Circle} circle
    */
    this.circle = new Phaser.Circle(0, 0, 44);

    if (id === 0)
    {
        this.isMouse = true;
    }

};

Phaser.Pointer.prototype = {

    /**
    * Called when the Pointer is pressed onto the touchscreen.
    * @method Phaser.Pointer#start
    * @param {Any} event
    */
    start: function (event) {

        this.identifier = event.identifier;
        this.target = event.target;

        if (typeof event.button !== 'undefined')
        {
            this.button = event.button;
        }

        //  Fix to stop rogue browser plugins from blocking the visibility state event
        if (this.game.stage.disableVisibilityChange === false && this.game.paused && this.game.stage.scale.incorrectOrientation === false)
        {
            this.game.paused = false;
            return this;
        }

        this._history.length = 0;
        this.active = true;
        this.withinGame = true;
        this.isDown = true;
        this.isUp = false;

        //  Work out how long it has been since the last click
        this.msSinceLastClick = this.game.time.now - this.timeDown;
        this.timeDown = this.game.time.now;
        this._holdSent = false;

        //  This sets the x/y and other local values
        this.move(event);

        // x and y are the old values here?
        this.positionDown.setTo(this.x, this.y);

        if (this.game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers === 0))
        {
            this.game.input.x = this.x;
            this.game.input.y = this.y;
            this.game.input.position.setTo(this.x, this.y);
            this.game.input.onDown.dispatch(this, event);
            this.game.input.resetSpeed(this.x, this.y);
        }

        this._stateReset = false;
        this.totalTouches++;

        if (this.isMouse === false)
        {
            this.game.input.currentPointers++;
        }

        if (this.targetObject !== null)
        {
            this.targetObject._touchedHandler(this);
        }

        return this;

    },

    /**
    * Called by the Input Manager.
    * @method Phaser.Pointer#update
    */
    update: function () {

        if (this.active)
        {
            if (this._holdSent === false && this.duration >= this.game.input.holdRate)
            {
                if (this.game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers === 0))
                {
                    this.game.input.onHold.dispatch(this);
                }

                this._holdSent = true;
            }

            //  Update the droppings history
            if (this.game.input.recordPointerHistory && this.game.time.now >= this._nextDrop)
            {
                this._nextDrop = this.game.time.now + this.game.input.recordRate;

                this._history.push({
                    x: this.position.x,
                    y: this.position.y
                });
            
                if (this._history.length > this.game.input.recordLimit)
                {
                    this._history.shift();
                }
            }
        }

    },

    /**
    * Called when the Pointer is moved.
    * @method Phaser.Pointer#move
    * @param {MouseEvent|PointerEvent|TouchEvent} event - The event passed up from the input handler.
    */
    move: function (event) {

        if (this.game.input.pollLocked)
        {
            return;
        }

        if (typeof event.button !== 'undefined')
        {
            this.button = event.button;
        }

        this.clientX = event.clientX;
        this.clientY = event.clientY;

        this.pageX = event.pageX;
        this.pageY = event.pageY;

        this.screenX = event.screenX;
        this.screenY = event.screenY;

        this.x = (this.pageX - this.game.stage.offset.x) * this.game.input.scale.x;
        this.y = (this.pageY - this.game.stage.offset.y) * this.game.input.scale.y;

        this.position.setTo(this.x, this.y);
        this.circle.x = this.x;
        this.circle.y = this.y;

        if (this.game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers === 0))
        {
            this.game.input.activePointer = this;
            this.game.input.x = this.x;
            this.game.input.y = this.y;
            this.game.input.position.setTo(this.game.input.x, this.game.input.y);
            this.game.input.circle.x = this.game.input.x;
            this.game.input.circle.y = this.game.input.y;
        }

        //  If the game is paused we don't process any target objects or callbacks
        if (this.game.paused)
        {
            return this;
        }

        if (this.game.input.moveCallback)
        {
            this.game.input.moveCallback.call(this.game.input.moveCallbackContext, this, this.x, this.y);
        }

        //  Easy out if we're dragging something and it still exists
        if (this.targetObject !== null && this.targetObject.isDragged === true)
        {
            if (this.targetObject.update(this) === false)
            {
                this.targetObject = null;
            }

            return this;
        }

        //  Work out which object is on the top
        this._highestRenderOrderID = -1;
        this._highestRenderObject = null;
        this._highestInputPriorityID = -1;

        //  Just run through the linked list
        if (this.game.input.interactiveItems.total > 0)
        {
            var currentNode = this.game.input.interactiveItems.next;

            do
            {
                //  If the object is using pixelPerfect checks, or has a higher InputManager.PriorityID OR if the priority ID is the same as the current highest AND it has a higher renderOrderID, then set it to the top
                if (currentNode.pixelPerfect || currentNode.priorityID > this._highestInputPriorityID || (currentNode.priorityID == this._highestInputPriorityID && currentNode.sprite.renderOrderID > this._highestRenderOrderID))
                {
                    if (currentNode.checkPointerOver(this))
                    {
                        // console.log('HRO set', currentNode.sprite.name);
                        this._highestRenderOrderID = currentNode.sprite.renderOrderID;
                        this._highestInputPriorityID = currentNode.priorityID;
                        this._highestRenderObject = currentNode;
                    }
                }
                currentNode = currentNode.next;
            }
            while (currentNode != null)
        }

        if (this._highestRenderObject == null)
        {
            //  The pointer isn't currently over anything, check if we've got a lingering previous target
            if (this.targetObject)
            {
                // console.log("The pointer isn't currently over anything, check if we've got a lingering previous target");
                this.targetObject._pointerOutHandler(this);
                this.targetObject = null;
            }
        }
        else
        {
            if (this.targetObject == null)
            {
                //  And now set the new one
                // console.log('And now set the new one');
                this.targetObject = this._highestRenderObject;
                this._highestRenderObject._pointerOverHandler(this);
            }
            else
            {
                //  We've got a target from the last update
                // console.log("We've got a target from the last update");
                if (this.targetObject == this._highestRenderObject)
                {
                    //  Same target as before, so update it
                    // console.log("Same target as before, so update it");
                    if (this._highestRenderObject.update(this) === false)
                    {
                        this.targetObject = null;
                    }
                }
                else
                {
                    //  The target has changed, so tell the old one we've left it
                    // console.log("The target has changed, so tell the old one we've left it");
                    this.targetObject._pointerOutHandler(this);

                    //  And now set the new one
                    this.targetObject = this._highestRenderObject;
                    this.targetObject._pointerOverHandler(this);
                }
            }
        }

        return this;

    },

    /**
    * Called when the Pointer leaves the target area.
    * @method Phaser.Pointer#leave
    * @param {MouseEvent|PointerEvent|TouchEvent} event - The event passed up from the input handler.
    */
    leave: function (event) {

        this.withinGame = false;
        this.move(event);

    },

    /**
    * Called when the Pointer leaves the touchscreen.
    * @method Phaser.Pointer#stop
    * @param {MouseEvent|PointerEvent|TouchEvent} event - The event passed up from the input handler.
    */
    stop: function (event) {

        if (this._stateReset)
        {
            event.preventDefault();
            return;
        }

        this.timeUp = this.game.time.now;

        if (this.game.input.multiInputOverride == Phaser.Input.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.Input.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.Input.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers === 0))
        {
            this.game.input.onUp.dispatch(this, event);

            //  Was it a tap?
            if (this.duration >= 0 && this.duration <= this.game.input.tapRate)
            {
                //  Was it a double-tap?
                if (this.timeUp - this.previousTapTime < this.game.input.doubleTapRate)
                {
                    //  Yes, let's dispatch the signal then with the 2nd parameter set to true
                    this.game.input.onTap.dispatch(this, true);
                }
                else
                {
                    //  Wasn't a double-tap, so dispatch a single tap signal
                    this.game.input.onTap.dispatch(this, false);
                }

                this.previousTapTime = this.timeUp;
            }
        }

        //  Mouse is always active
        if (this.id > 0)
        {
            this.active = false;
        }

        this.withinGame = false;
        this.isDown = false;
        this.isUp = true;

        if (this.isMouse === false)
        {
            this.game.input.currentPointers--;
        }

        if (this.game.input.interactiveItems.total > 0)
        {
            var currentNode = this.game.input.interactiveItems.next;
            
            do
            {
                if (currentNode)
                {
                    currentNode._releasedHandler(this);
                }
                
                currentNode = currentNode.next;
            }
            while (currentNode != null)
        }

        if (this.targetObject)
        {
            this.targetObject._releasedHandler(this);
        }

        this.targetObject = null;
        return this;

    },

    /**
    * The Pointer is considered justPressed if the time it was pressed onto the touchscreen or clicked is less than justPressedRate.
    * Note that calling justPressed doesn't reset the pressed status of the Pointer, it will return `true` for as long as the duration is valid.
    * If you wish to check if the Pointer was pressed down just once then see the Sprite.events.onInputDown event.
    * @method Phaser.Pointer#justPressed
    * @param {number} [duration] - The time to check against. If none given it will use InputManager.justPressedRate.
    * @return {boolean} true if the Pointer was pressed down within the duration given.
    */
    justPressed: function (duration) {

        duration = duration || this.game.input.justPressedRate;

        return (this.isDown === true && (this.timeDown + duration) > this.game.time.now);

    },

    /**
    * The Pointer is considered justReleased if the time it left the touchscreen is less than justReleasedRate.
    * Note that calling justReleased doesn't reset the pressed status of the Pointer, it will return `true` for as long as the duration is valid.
    * If you wish to check if the Pointer was released just once then see the Sprite.events.onInputUp event.
    * @method Phaser.Pointer#justReleased
    * @param {number} [duration] - The time to check against. If none given it will use InputManager.justReleasedRate.
    * @return {boolean} true if the Pointer was released within the duration given.
    */
    justReleased: function (duration) {

        duration = duration || this.game.input.justReleasedRate;

        return (this.isUp === true && (this.timeUp + duration) > this.game.time.now);

    },

    /**
    * Resets the Pointer properties. Called by InputManager.reset when you perform a State change.
    * @method Phaser.Pointer#reset
    */
    reset: function () {

        if (this.isMouse === false)
        {
            this.active = false;
        }

        this.identifier = null;
        this.isDown = false;
        this.isUp = true;
        this.totalTouches = 0;
        this._holdSent = false;
        this._history.length = 0;
        this._stateReset = true;

        if (this.targetObject)
        {
            this.targetObject._releasedHandler(this);
        }

        this.targetObject = null;

    }

};

Phaser.Pointer.prototype.constructor = Phaser.Pointer;

/**
* How long the Pointer has been depressed on the touchscreen. If not currently down it returns -1.
* @name Phaser.Pointer#duration
* @property {number} duration - How long the Pointer has been depressed on the touchscreen. If not currently down it returns -1.
* @readonly
*/
Object.defineProperty(Phaser.Pointer.prototype, "duration", {

    get: function () {

        if (this.isUp)
        {
            return -1;
        }

        return this.game.time.now - this.timeDown;

    }

});

/**
* Gets the X value of this Pointer in world coordinates based on the world camera.
* @name Phaser.Pointer#worldX
* @property {number} duration - The X value of this Pointer in world coordinates based on the world camera.
* @readonly
*/
Object.defineProperty(Phaser.Pointer.prototype, "worldX", {

    get: function () {

        return this.game.world.camera.x + this.x;

    }

});

/**
* Gets the Y value of this Pointer in world coordinates based on the world camera.
* @name Phaser.Pointer#worldY
* @property {number} duration - The Y value of this Pointer in world coordinates based on the world camera.
* @readonly
*/
Object.defineProperty(Phaser.Pointer.prototype, "worldY", {

    get: function () {

        return this.game.world.camera.y + this.y;

    }

});






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
