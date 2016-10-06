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
    $scope.points_y = new Array(100).fill(5);

    // fix values of x, as in a live graph only the value of y will be enqueued
    for (var i=0; i<100; i++) {
      $scope.points_x[i] = i;
    }

    var trace1 = {
      x: $scope.points_x,
      y: $scope.points_y,
      name: 'heartrate',
      type: 'scatter'
    };

    var data = [trace1];
    Plotly.newPlot('plot', data);

    mySocket.on('pointData', function(point) {
      $scope.$apply(function() {
        // $scope.points_x.shift();
        // $scope.points_x.push(point.value_x);
        $scope.points_y.shift();
        $scope.points_y.push(point.value_y);

        // Plotly.redraw('plot', data);
        // check if redraw re-renders everytime scope is modified
      });
    });
  }]);
