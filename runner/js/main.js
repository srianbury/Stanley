//creates an instance of the game
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '')

game.state.add('Boot', StanRunner.Boot);
game.state.add('Preloader', StanRunner.Preload);
game.state.add('MainMenu', StanRunner.MainMenu);

game.state.start('Boot');