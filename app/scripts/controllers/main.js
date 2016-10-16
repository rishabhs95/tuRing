'use strict';

/**
 * @ngdoc function
 * @name webSummitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webSummitApp
 */
angular.module('webSummitApp')
  .controller('MainCtrl', ['$scope', '$timeout', 'mySocket', function ($scope, $timeout, mySocket) {
    $scope.points_x = new Array(10);
    $scope.points_y = new Array(100);
    for (var i=0; i<100; i++) {
      $scope.points_x[i] = i;
      $scope.points_y[i] = Math.random()*100;
    }

    $scope.labels = $scope.points_x;
    $scope.series = ['Heart Rate'];
    $scope.data = [$scope.points_y];

    mySocket.on('connect',function() {
      console.log('Client has connected to the server!');
    });

    mySocket.on('disconnect',function() {
      console.log('The client has disconnected!');
    });

    mySocket.on('pointData', function(point) {
      console.log('New Point pushed!');
      // TODO: Someday
      /*$timeout(function () {
          $scope.points_y.shift();
          $scope.points_y.push(point.value_y);
          $scope.data = [$scope.points_y];
      }, 2000);*/
      $scope.points_y.shift();
      $scope.points_y.push(point.value_y);
    });
}]);
