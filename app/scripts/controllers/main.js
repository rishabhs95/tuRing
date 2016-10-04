'use strict';

/**
 * @ngdoc function
 * @name webSummitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webSummitApp
 */
angular.module('webSummitApp')
  .controller('MainCtrl', function () {
	// Plot.ly

	var trace1 = {
	  x: [1, 2, 3, 4], 
	  y: [10, 15, 13, 17],
	  name: 'heartrate',
	  type: 'scatter'
	};
	var trace2 = {
	  x: [1, 2, 3, 4], 
	  y: [16, 5, 11, 9],
	  name: 'oxy-something', 
	  type: 'scatter'
	};
	var data = [trace1, trace2];
	Plotly.newPlot('plot', data);
  });
