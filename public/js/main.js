//var config = require(".../config.json");
var serverIP = "http://192.168.132.103:3000";

var GameBoard = function(){
	var socket = io.connect(serverIP);

	var podo_stepSize = localStorage.podo_stepSize || 50,
		podo_weight = localStorage.podo_weight || 70,
		podo_step = localStorage.podo_step || 0,
		podo_step_old = 0,
		podo_speed = localStorage.podo_speed || 0,
		podo_calory = localStorage.podo_calory || 0,
		isGPSEnabled = localStorage.isGPSEnabled || false;

	var podo = new Pedometer();

	//init pedometer
	podo.setCountStep(Math.round(podo_step));
	podo.setWeight(Math.round(podo_weight));
	podo.setStepSize(Math.round(podo_stepSize));
	podo.setMeanSpeed(Math.round(podo_speed*1000.)/1000.);
	podo.setCalory(Math.round(podo_calory*1000.)/1000.);
	podo.setIsGPSEnabled(Boolean(isGPSEnabled));

	var activatePodo = 1;
	var norm = 0;

	var podo_stepDistance = 1;

	function updateStepCount() {
			/* emit event to
				> update movementSchema.totalSteps
				> get movementSchema.totalSteps and send back to us
				>
			*/
			socket.on('updated-stepCount', function(totalSteps, treasureSessionSteps, user){
				// update UI with number from database
				$('#petname').html(user.firstname+"'s Poring");
				$('#totalStepCount').html(totalSteps);

				var gameIsActive = $('#initTreasureHuntStartButton').data('treasureHuntIsActive');

				if (gameIsActive){
					var winCheck = $('#stepsTillTreasure').html();
					if ( winCheck != 0) {
						socket.emit('treasureGame-step', podo_stepDistance);
						$('#stepsTillTreasure').html(treasureSessionSteps);
					} else if (winCheck == 0) {
						treasureGame.winGame();
						$('#stepsTillTreasure').html('Waiting for Next Game');
						treasureGame.disableTreasureHunt();
					}
				}
			});
			podo_step_old = podo_step;
	}
	//______________________
	//  Setup Pedometer 	\________________
	updateStepCount();

	if (window.DeviceOrientationEvent) {
		window.addEventListener("devicemotion", function( event ) {

			if (activatePodo){

				if ((podo.acc_norm.length < 2) || (podo.stepArr.length < 2))
				{
					//$("#gamma-angle").html(Math.round(2/(event.interval/1000)));
					try{
					podo.createTable(Math.round(2/(event.interval/1000)));
					} catch (e) {
						console.log(e);
					}
				} else {
					norm = podo.computeNorm(event.accelerationIncludingGravity.x, event.accelerationIncludingGravity.y, event.accelerationIncludingGravity.z);
					podo.acc_norm.push(norm);

					podo.update();

					podo.onStep(podo.acc_norm);
					podo.onSpeed();
					podo.onCalory();
				//________________________________
				//  On pedometer detect of motion \________
					if( podo_step_old == 0 || podo_step != podo_step_old ){
						socket.emit('step', podo_stepDistance);
						updateStepCount();
					};

					if ((localStorage.podo_step !== 0) && (isNaN(podo.countStep) == 0))
					{
						podo_step = localStorage.podo_step = podo.countStep;
					};
					if ((localStorage.podo_speed !== 0) && (isNaN(podo.meanSpeed) == 0))
					{
						podo_speed = localStorage.podo_speed = podo.meanSpeed;
					};
					if ((localStorage.podo_calory !== 0) && (isNaN(podo.calory) == 0))
					{
						podo_calory = localStorage.podo_calory = podo.calory;
					};

					if (isNaN(podo.distance) == 0){
						$("#distance-number").html(Math.round(podo.distance/100)/1000);
					} else {
						$("#distance-number").html(0);
					};
					if (isNaN(podo.meanSpeed) == 0){
						$("#speed-number").html(Math.round(podo.meanSpeed/1000*3600)); //km/h
					} else {
						$("#speed-number").html(0);
					};
					if (isNaN(podo.calory) == 0){
						$("#calory-number").html(Math.round(podo.calory)); //km/h
					} else {
						$("#calory-number").html(0);
					};
				};
			};
		}, false);
	};

	var treasureGame = new TreasureGame();

	//______________________
	//  Event Listeners 	\________________

	// Start the Treasure Game
	$('#startTreasureHunt').on('click', function(e) {
		var gameIsActive = $('#initTreasureHuntStartButton').data('treasureHuntIsActive');
		if (!gameIsActive) {
			var treasureStepCountInput = $('#treasureStepCountInput').val();
			if( treasureStepCountInput == '' || treasureStepCountInput == '0' ){
				$('#errormessagetxt').text('Set treasure distance!');
			} else {
				treasureGame.initTreasureHunt();
				socket.emit('treasureGame-start', treasureStepCountInput);
			}
		}
	});


	// End the Treasure Game
	$('#initTreasureHuntStartButton').on('click', function(e) {
		var gameIsActive = $('#initTreasureHuntStartButton').data('treasureHuntIsActive');

		if (gameIsActive) {
			bootbox.confirm("Stop treasure hunting?", function(result){
				if (result){
					treasureGame.disableTreasureHunt();
				}
			});
		}
	});


}
//___________________
//  Init   			 \_______________________
$(function (){

	var gameBoard = new GameBoard();

});
