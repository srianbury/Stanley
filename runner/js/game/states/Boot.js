//need to create a global class to create our game
// and the boot state
var StanRunner = function() {

};

StanRunner.Boot = function() {

};

StanRunner.Boot.prototype = {
	preload: function() {
		this.load.image('logo', 'assets/images/stan-logo.png');
		this.load.image('preloadBar', 'assets/images/preloader-bar.png');
	},
	create: function(){
		this.game.state.backgroundColor = '#fff'; //white
		this.input.maxpointers = 1; //setup input for the game, if you know youre not going to use multi touch, which we aren't, you should set it to one

		if(this.game.device.desktop){
			//desktop specific settings can go here
			this.scale.pageAlignHorizontally = true; //display the game in the center
		}else{
			//mobile
			//scale the game no lower tahn 480x260 and no higher than
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //scale the game so everything is on the screen
			this.scale.minWidth = 568;
			this.scale.minHeight = 600;
			this.scale.maxWidth = 2048;
			this.scale.maxHeight = 1536;
			this.scale.forceLandscape = true;
			this.scale.pageAlignHorizontally = true;
			this.scale.setScreenSize(true);
		}

		//by this point the preloader assets have loaded to the cache, we've set the game settings
		//So now lets start the real preloader
		this.state.start('Preloader');
	}
};