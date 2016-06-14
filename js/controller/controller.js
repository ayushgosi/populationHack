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
