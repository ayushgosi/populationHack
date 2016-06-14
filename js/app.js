//Modules
var populationHack = angular.module('populationHack', ['ngRoute', 'ngResource', 'highcharts-ng']);

//Routes
populationHack.config(function($routeProvider){

  $routeProvider
  .when('/', {
    templateUrl: 'pages/main.htm',
    controller: 'mainController',
    controllerAs: 'main'
  })
  .when('/percent', {
    templateUrl: 'pages/percentage.htm',
    controller: 'percentController',
    controllerAs: 'percent'
  })
  .when('/rawdata', {
    templateUrl: 'pages/rawdata.htm',
    controller: 'rawdataController',
    controllerAs: 'rawdata'
  })
});


//back to previous url module
populationHack.run(function($rootScope, $location) {

  var history = [];

  $rootScope.$on('$routeChangeSuccess', function() {
    history.push($location.$$path);
  });

  $rootScope.back = function () {
    var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
    $location.path(prevUrl);
  };

});
