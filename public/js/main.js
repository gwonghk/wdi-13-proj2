//var config = require(".../config.json");
var GameBoard = function(){

	var podo_stepSize = localStorage.podo_stepSize || 50,
		podo_weight = localStorage.podo_weight || 70;
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

	if (window.DeviceOrientationEvent) {
		window.addEventListener("devicemotion", function( event ) {


			if (activatePodo){

				if( podo_step_old == 0 || podo_step != podo_step_old  ){

					// emit  event
					console.log('CLIENT: DevicemotionEvent - Podo_Step: ', podo_step);
					podo_step_old = podo_step;
					socket.emit('step', podo_step_old);
				}



				if ((podo.acc_norm.length < 2) || (podo.stepArr.length < 2))
				{
					//$("#gamma-angle").html(Math.round(2/(event.interval/1000)));
					podo.createTable(Math.round(2/(event.interval/1000)));
				} else {
					norm = podo.computeNorm(event.accelerationIncludingGravity.x, event.accelerationIncludingGravity.y, event.accelerationIncludingGravity.z);
					podo.acc_norm.push(norm);

					podo.update();

					podo.onStep(podo.acc_norm);
					podo.onSpeed();
					podo.onCalory();

					// dessin  = document.querySelector('#canvas');
					// context = dessin.getContext('2d');
					// *** podo.onDraw(context, widthCanvas, heightCanvas);
					$('#stepCounter').html(podo_step);

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

}

var socket = new io.connect("http://192.168.132.102:3000");
// var socket = new io.connect("http://"+ config.domain + ":3000");
// var socket = new io.connect('http://192.168.32.148:3000');
var gameBoard = new GameBoard();