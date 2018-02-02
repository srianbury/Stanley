StanRunner.Game = function() {
	this.playerMinAngle = -20;
	this.playerMaxAngle = 20;
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
				this.player.angle += 0.5;
			}
		}else if(this.player.body.velocity.y >= 0 && !this.game.input.activePointer.isDown){
			if(this.player.angle > this.playerMinAngle){
				this.player.angle -= 0.5;
			}
		}

		this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);
	},

	shutdown: function(){

	},

	groundHit: function(player, ground){
		player.body.velocity.y = -200;
	}
}