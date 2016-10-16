'use strict';

/**
 * @ngdoc overview
 * @name webSummitApp
 * @description
 * # webSummitApp
 *
 * Main module of the application.
 */
angular
  .module('webSummitApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'btford.socket-io'
  ])
  .factory('mySocket', function(socketFactory) {
    var nodeConnection = io.connect('http://localhost:1234/');

    var nodeSocket = socketFactory({
      ioSocket: nodeConnection
    });

    return nodeSocket;
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
  