'use strict';

/**
 * @ngdoc function
 * @name webSummitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webSummitApp
 */
angular.module('webSummitApp')
  .controller('MainCtrl', ['$scope', 'mySocket', function ($scope, mySocket) {
    $scope.points_x = new Array(100);
    $scope.points_y = new Array(100);

    // fixed values of x, as in a live graph only the value of y will be enqueued
    for (var i=0; i<100; i++) {
      $scope.points_x[i] = i;
      $scope.points_y[i] = i + 1;
    }

    var trace1 = {
      x: $scope.points_x,
      y: $scope.points_y,
      name: 'heartrate',
      type: 'scatter'
    };

    var layout = {
      title:'You\'re good!'
    };

    var data = [trace1];
    Plotly.newPlot('plot', data, layout);

    for (var i=0; i<20; i++) {
      console.log($scope.points_x, $scope.points_y);
      $scope.points_y.shift();
      $scope.points_y.push(50);
      Plotly.newPlot('plot', data, layout);
    }
  }]);
