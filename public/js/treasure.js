//// Treasure Page /////////
var TreasureGame = function(){
	var self = this;
	var gameIsActive = false;
	var treasureGameStepCounter_old = 0;
	var treasureGameStepCounter = 0;

	self.initTreasureHunt = function() {
		var treasureStepCountInput = $('#treasureStepCountInput').val();
		gameIsActive = true;
		$('#stepsTillTreasure').text(treasureStepCountInput);

		$('#stepsTillTreasureBar').attr('aria-valuemax', ''+treasureStepCountInput);


		$('#initTreasureHunt').modal('hide');
		$('#errormessagetxt').text('');
		$('#treasureStepCountInput').val('');
		$('#initTreasureHuntStartButton').text('Stop');
		$('#initTreasureHuntStartButton').removeAttr('data-toggle');
		$('#initTreasureHuntStartButton').data('treasureHuntIsActive', true);
		socket.on('update-stepCount', function(podo_step){
			console.log('initTreasureHunt Podo_Step received:', podo_step);
		});
	}

	self.disableTreasureHunt = function() {
		gameIsActive = false;
		$('#initTreasureHuntStartButton').text('Start!');
		$('#initTreasureHuntStartButton').attr('data-toggle', 'modal');
		$('#stepsTillTreasureBar').attr('aria-valuenow', 0);
		$('#stepsTillTreasureBar').css('width', 0+'%');
		$('#initTreasureHuntStartButton').data('treasureHuntIsActive', false);
		socket.removeAllListeners('update-stepCount');
	}

	self.winGame = function(){
		console.log('win game!');
		bootbox.alert({
			size: "large",
			title: "You Found Treasure!",
			message: '<div id="chestget"> </div>'
			// message: '<div src="../img/icontreasure.png"  style="width:304px;height:228px;">'
			// callback: function(){ /* your callback code */ }
		})
	}


}

