'use strict';

/**
 * @ngdoc function
 * @name webSummitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webSummitApp
 */
angular.module('webSummitApp', ['chart.js'])
    .controller('MainCtrl', ['$scope', '$timeout', 'mySocket', function ($scope, $timeout, mySocket) {
      
      $scope.$on('chart-create', function (evt, chart) {
        console.log(chart);
      });

      $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
      $scope.series = ['Series A', 'Series B'];
      $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
      ];


      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };

      // Simulate async data update
      $timeout(function () {
        $scope.data = [
          [28, 48, 40, 19, 86, 27, 90],
          [65, 59, 80, 81, 56, 55, 40]
        ];
      }, 3000);

    }]);
