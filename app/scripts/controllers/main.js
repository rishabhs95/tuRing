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
    $scope.points_x = [1, 2, 3, 4];
    $scope.points_y = [10, 15, 13, 17];

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
        $scope.points_x.shift();
        $scope.points_x.push(point.value_x);
        $scope.points_y.shift();
        $scope.points_y.push(point.value_y);
      });
    });
  }]);
