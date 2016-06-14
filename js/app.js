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

//Services
populationHack.service('populationService', function($resource, $q){
  var ps = this;

  //for rawdata
  ps.rawData = null;
  ps.flag = true;


  ps.getData = function(country, year, sex){
    if(sex == undefined){
      sex = '0';
    }
    var obj = $resource('http://api.census.gov/data/timeseries/idb/1year?get=AREA_KM2,NAME,AGE,POP&key=32af54f8e4ab4691f4f47722fce2a4a126a7f74b');
    return obj.query({FIPS:country, time:year, SEX:sex});
  }

  //main
  ps.getMainData = function(country, year, sex){
    var resObj = ps.getData(country, year, sex);
    var deferred = $q.defer();
    resObj.$promise.then(function(result){
      var resultArr = [];
      result.splice(0,1);
      console.log(result);

      var chartArr = [];
      for(i=0; i<result.length; i++){
        chartArr.push(parseInt(result[i][3]));
      }
      console.log(chartArr);

      resultArr.push(result);
      resultArr.push(chartArr);
      console.log(resultArr);

      deferred.resolve(resultArr);
    }, function(err){
      console.log('Error');
    });
    return deferred.promise;
  };

  //percent
  ps.getPercentData = function(country, year1, year2){
    var resObj1 = ps.getData(country, year1);
    var deferred = $q.defer();
    resObj1.$promise.then(function(result1){
      // Now we have result1
      var resObj2 = ps.getData(country, year2);
      resObj2.$promise.then(function(result2){
        console.log(result1);
        console.log(result2);

        var resultArr = [];
        var resultArr1 = [];
        var resultArr2 = [];

        for(var i=1; i<result1.length; i++){
          var obj = {};
          obj.age = result1[i]['2'];
          // console.log(obj.age);
          obj.pop1 = result1[i]['3'];
          obj.pop2 = result2[i]['3'];
          obj.diffPop = obj.pop2 - obj.pop1;
          obj.percentageDiff = (obj.diffPop/obj.pop1)*100;

          resultArr1.push(obj);
          resultArr2.push(obj.percentageDiff);
        }
        resultArr.push(resultArr1);
        resultArr.push(resultArr2);

        deferred.resolve(resultArr);
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
  main.sex = '0';

  //headers
  main.country = 'India';
  main.gender = 'Men';
  main.myVar = false;

  //function
  main.getData = function(){
    var response = populationService.getMainData(main.countryCode, main.year, main.sex);
    response.then(function(data){
      var resultData = data;

      main.data = resultData[0];
      console.log(main.data);
      main.chartArr = resultData[1];
      console.log(main.chartArr);

      //to get rawdata table
      populationService.rawData = main.data;
      populationService.flag = true;

      //Charts
      main.chartConfig = {
        options: {
          chart: {
            type: 'column'
          },
          tooltip: {
            style: {
              padding: 10,
              fontWeight: 'bold'
            }
          }
        },
        //Series object (optional) - a list of series using normal Highcharts series options.
        series: [{
          name: 'Show',
          data: main.chartArr
        }],
        title: {
          text: 'Population Graph'
        },
        loading: false,
        yAxis: {
          title: {text: 'Population'}
        },
        xAxis: {
          title: {text: 'Age'}
        }
      };

    }, function(err){
      console.log('Error');
    });
    console.log("Inside Getdata");

    //for headers
    (function(countryCode, sex){
      if(main.sex == 1){
        main.gender = 'Men';
        main.myVar = true;
      }
      else if(main.sex == 2){
        main.gender = 'Women';
        main.myVar = true;
      }
      else{
        main.myVar = false;
      }

      if(main.countryCode == 'IN'){
        main.country = 'India';
      }
      else if(main.countryCode == 'UK'){
        main.country = 'United Kingdom';
      }
      else if(main.countryCode == 'US'){
        main.country = 'United States';
      }
      else if(main.countryCode == 'CA'){
        main.country = 'Canada';
      }
    })();

  };
  main.getData();

}]);

populationHack.controller('percentController', ['$scope', '$resource', 'populationService', function($scope, $resource, populationService){
  var percent = this;

  percent.countryCode = 'IN';
  percent.year1 = '2010';
  percent.year2 = '2014';

  percent.getData = function(){
    console.log("Inside Getdata");
    var response = populationService.getPercentData(percent.countryCode, percent.year1, percent.year2);
    response.then(function(data){
      var resultData = data;

      percent.data = resultData[0];
      console.log(percent.data);
      percent.chartArr = resultData[1];
      console.log(percent.chartArr);

      //to get rawdata table
      populationService.rawData = percent.data;
      populationService.flag = false;

      //Charts
      percent.chartConfig = {
        options: {
          chart: {
            type: 'column'
          },
          tooltip: {
            style: {
              padding: 10,
              fontWeight: 'bold'
            }
          }
        },
        //Series object (optional) - a list of series using normal Highcharts series options.
        series: [{
          name: 'Show',
          data: percent.chartArr
        }],
        title: {
          text: '% Inc/Dec'
        },
        loading: false,
        yAxis: {
          title: {text: 'Population'}
        },
        xAxis: {
          title: {text: 'Age'}
        }
      };

    }, function(err){
      console.log("Error");
    });

    //headers
    (function(countryCode){
      if(percent.countryCode == 'IN'){
        percent.country = 'India';
      }
      else if(percent.countryCode == 'UK'){
        percent.country = 'United Kingdom';
      }
      else if(percent.countryCode == 'US'){
        percent.country = 'United States';
      }
      else if(percent.countryCode == 'CA'){
        percent.country = 'Canada';
      }
    })();

  };
  percent.getData();

}]);

populationHack.controller('rawdataController', ['$scope', '$resource', 'populationService', function($scope, $resource, populationService){
  var rawdata = this;

  rawdata.flag = populationService.flag;
  console.log(rawdata.flag);

  rawdata.data = populationService.rawData;
  console.log(rawdata.data);

}]);

//back to previous url module
populationHack.run(function ($rootScope, $location) {

    var history = [];

    $rootScope.$on('$routeChangeSuccess', function() {
        history.push($location.$$path);
    });

    $rootScope.back = function () {
        var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
        $location.path(prevUrl);
    };

});
