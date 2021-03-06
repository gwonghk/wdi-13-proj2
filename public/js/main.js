//var config = require(".../config.json");
var serverIP = "http://192.168.132.103:3000";
var socket = io.connect(serverIP);

var GameBoard = function(){
	var self = this;
	var room = 'roomFido'
	var roomPlayerList = ['tom', 'joelle'];

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

	//______________________
	//  Multiplayer Rooms 	\________________


	// on Connect, join a room
	socket.on('connect', function() {
		socket.emit('joinGlobalRoom', room);
	});

	// Update LeaderBoard
	socket.on('updateActiveUsers', function(activeUsersArray){
		updateLeaderBoard(activeUsersArray);
	});

	// on Step from other players via Server
	socket.on('step', function(stepDistance){
		socket.emit('step', stepDistance);
	})

	function showRoomAttendees() {
		$('#roomAttendance').html(roomPlayerList);
	}

	function updateLeaderBoard(activeUsersArray) {
		var template = $('#rowTemplate').html();
		$('#leaderBoardBody').empty();
		activeUsersArray.forEach(e => {


			var tableRowHTML = template;
			tableRowHTML = tableRowHTML.replace("{{rank}}", 1);
			tableRowHTML = tableRowHTML.replace("{{name}}", e.userName);
			tableRowHTML = tableRowHTML.replace("{{pet}}", ".icon.mini-"+e.petType);
			tableRowHTML = tableRowHTML.replace("{{stepCount}}", e.mvTotalStep);
			$('#leaderBoardBody').append(tableRowHTML);
		})
	};
			// var player = {
			// 	userName: e.firstname,
			// 	petName: petName,
			// 	petType: petType,
			// 	petAge: petAge,
			// 	mvTotalStep: movementTotalSteps,
			// 	mvTreasure: movementTreasureSteps
			// 	//treasureCount = bag.treasureCount;
			// }

			// td.lboardRank {{rank}}
			// td.lboardName {{name}}
			// td.lboardPet{{petType}}
			// td.lboardScore.myTotalStepCount {{stepCount}}

			/*tbody#leaderBoardBody
				tr
					td.lboardRank 1
					//- (scope='row') #{index + 1}
					td.lboardName adsf
					td.lboardPet
					td.lboardScore.myTotalStepCount*/

	function updateStepCount() {
			/* emit event to
				> update movementSchema.totalSteps
				> get movementSchema.totalSteps and send back to us
				>
			*/
			socket.on('fromController-updatedStepCount', function(totalSteps, treasureSessionSteps, user){
				// update UI with number from database
				$('#petname').html(user.firstname+"'s Poring");
				$('.myTotalStepCount').html(totalSteps);

				var gameIsActive = $('#initTreasureHuntStartButton').data('treasureHuntIsActive');

				if (gameIsActive){
					var winCheck = $('#stepsTillTreasure').html();
					if ( winCheck != 0) {
						socket.emit('treasureGame-step', podo_stepDistance);
						// Treasure chest UI
						var barMax = $('#stepsTillTreasureBar').attr('aria-valuemax');
						var barProgress = barMax - treasureSessionSteps;
						var barProgressPercent = (barProgress / barMax) * 100;

						$('#stepsTillTreasureBar').attr('aria-valuenow', barProgress);
						$('#stepsTillTreasureBar').css('width', barProgressPercent+'%');
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
						socket.emit('step-action', podo_stepDistance);
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
	// move this back into Init after debug;
