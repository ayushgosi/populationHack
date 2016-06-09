//Modules
var populationHack = angular.module('populationHack', ['ngRoute', 'ngResource']);

//Routes
populationHack.config(function($routeProvider){

  $routeProvider
  .when('/', {
    templateUrl: 'pages/main.htm',
    controller: 'mainController',
    controllerAs: 'main'
  })
  .when('/second', {
    templateUrl: 'pages/percentage.htm',
    controller: 'percentController',
    controllerAs: 'percent'
  })
});

//Services
populationHack.service('populationService', function($resource, $q){
  var ps = this;

  //main
  ps.getMainData = function(country, year){
    var obj = $resource('http://api.census.gov/data/timeseries/idb/1year?get=AREA_KM2,NAME,AGE,POP&key=32af54f8e4ab4691f4f47722fce2a4a126a7f74b');
    return obj.query({FIPS:country, time:year, SEX:0});
  }

  //percent
  ps.getPercentData = function(country, year1, year2){
    var resObj1 = ps.getMainData(country, year1);
    var deferred = $q.defer();
    resObj1.$promise.then(function(result1){
      // Now we have result1
      var resObj2 = ps.getMainData(country, year2);
      resObj2.$promise.then(function(result2){
        console.log(result1);
        console.log(result2);

        ps.resultArr = [];
        for(var i=0; i<result1.length; i++)
        { var obj = {};
          obj.age = result1['2'];
          obj.pop1 = result1['3'];
          obj.pop2 = result2['3'];
          obj.diffPop = obj.pop2 - obj.pop1;
          obj.percentageDiff = (obj.diffPop/obj.pop1)*100;

          ps.resultArr.push(obj);
        }
        deferred.resolve(ps.resultArr);
      },function(err){
        console.log("Error");
      })
    },function(err){
      console.log("Error");
    });
    return deferred.promise;
  }


});

//Controllers
populationHack.controller('mainController', ['$scope', '$resource', 'populationService', function($scope, $resource, populationService){
  var main = this;

  main.countryCode = 'IN';
  main.year = '2010';

  main.getData = function(){
    main.data = populationService.getMainData(main.countryCode,main.year);
    console.log("Inside Getdata");
    console.log(main.data);
  };
  main.getData();

}]);

populationHack.controller('percentController', ['$scope', '$resource', 'populationService', function($scope, $resource, populationService){
  var percent = this;

  percent.countryCode = 'IN';
  percent.year1 = '2010';
  percent.year2 = '2014';

  percent.getData = function(){
    var response = populationService.getPercentData(percent.countryCode, percent.year1, percent.year2);
    response.then(function(data){
      percent.result = data;
      console.log(percent.result);
    }, function(err){
      console.log("Error");
    });
    console.log("Inside Getdata");
  }
  percent.getData();

}]);
