StanRunner.Game = function() {
	this.playerMinAngle = -20;
	this.playerMaxAngle = 20;

	this.coinRate = 500; //generate a coin every 500ms
	this.coinTimer = 0;

	this.enemyRate = 1000;
	this.enemyTimer = 0;

	this.score = 0;
};

StanRunner.Game.prototype = {
	create: function(){
		this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background');
		this.background.autoScroll(-100,0); //x,y

		this.foreground = this.game.add.tileSprite(0,470,this.game.width,this.game.height-460-73,'foreground');
		this.foreground.autoScroll(-100,0);

		this.ground = this.game.add.tileSprite(0,this.game.height-73,this.game.width,73,'ground');
		this.ground.autoScroll(-400,0);

		this.player = this.add.sprite(200, this.game.height/2,'player');
		this.player.anchor.setTo(0.5);
		this.player.scale.setTo(0.3);

		this.player.animations.add('fly',[0,1,2,3,2,1]);
		this.player.animations.play('fly',8,true); //8fps

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 400; //set gravity in the horizontal direction to 400, higher= more gravity
		
		this.game.physics.arcade.enableBody(this.ground);	
		this.ground.body.allowGravity = false;
		this.ground.body.immovable = true;

		this.game.physics.arcade.enableBody(this.player);
		this.player.body.collideWorldBounds = true;
		this.player.body.bounce.set(0.30);

		this.coins = this.game.add.group();
		this.enemies = this.game.add.group();

		this.scoreText = this.game.add.bitmapText(10,10, 'minecraftia', 'Score: 0', 24);

	},

	update: function() {
		if(this.game.input.activePointer.isDown){
			this.player.body.velocity.y -= 25; //move player up on touch
		}

		if(this.player.body.velocity.y < 0 || this.game.input.activePointer.isDown){
			//if moving up
			if(this.player.angle > 0){
				this.player.angle = 0;
			}
			if(this.player.angle < this.playerMaxAngle){
				this.player.angle += 0.7;
			}
		}else if(this.player.body.velocity.y >= 0 && !this.game.input.activePointer.isDown){
			if(this.player.angle > this.playerMinAngle){
				this.player.angle -= 0.5;
			}
		}

		if(this.coinTimer < this.game.time.now){
			this.createCoin();
			this.coinTimer = this.game.time.now + this.coinRate;
		}

		if(this.enemyTimer < this.game.time.now){
			this.createEnemy();
			this.enemyTimer = this.game.time.now + this.enemyRate;
		}

		this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);

		this.game.physics.arcade.overlap(this.player, this.coins, this.coinHit, null, this);
		this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyHit, null, this);
	},

	shutdown: function(){
		//allows them to be garbage collected
		this.coins.destroy();
		this.enemies.destroy();

		this.score = 0;
		this.coinTimer = 0;
		this.enemyTimer = 0;
	},

	createCoin: function(){
		var x = this.game.width;
		var y = this.game.rnd.integerInRange(50,this.game.world.height - 192);

		var coin = this.coins.getFirstExists(false);
		if(!coin) {
			coin = new Coin(this.game, 0, 0);
			this.coins.add(coin);
		}

		coin.reset(x,y);
		coin.revive();
	}, 

	createEnemy: function(){
		var x = this.game.width;
		var y = this.game.rnd.integerInRange(50,this.game.world.height - 192);

		var enemy = this.enemies.getFirstExists(false);
		if(!enemy) {
			enemy = new Enemy(this.game, 0, 0);
			this.enemies.add(enemy);
		}

		enemy.reset(x,y);
		enemy.revive();
	},

	groundHit: function(player, ground){
		player.body.velocity.y = -200;
	},

	coinHit: function(player, coin){
		this.score++;
		coin.kill();
		this.scoreText.text = 'Score: ' + this.score;
	},

	enemyHit: function(player, enemy){
		player.kill();
		enemy.kill();

		this.ground.stopScroll();
		this.background.stopScroll();
		this.foreground.stopScroll();

		this.enemies.setAll('body.velocity.x', 0);
		this.coins.setAll('body.velocity.x', 0);

		this.enemyTimer = Number.MAX_VALUE;
		this.coinTimer = Number.MAX_VALUE;

		var scoreboard = new Scoreboard(this.game);
		scoreboard.show(this.score);
	}
}