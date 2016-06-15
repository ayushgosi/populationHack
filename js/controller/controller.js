//Controllers
populationHack.controller('mainController', ['$scope', '$resource', 'countryCodeService', 'populationService', function($scope, $resource, countryCodeService, populationService){
  var main = this;

  main.year = '2016';
  main.sex = '0';

  //headers
  main.gender = 'Men';
  main.myVar = false;

  //country list
  main.countryList = countryCodeService.query(function(data){
    console.log(main.countryList);
  });
  main.countryData = {
    Code: 'IN',
    Name: 'India'
  };

  //year list
  main.years = [2010, 2011, 2012, 2013, 2014, 2015, 2016];

  //function
  main.getData = function(){
    console.log("Inside Getdata");

    var response = populationService.getMainData(main.countryData.Code, main.year, main.sex);
    response.then(function(data){
      var resultData = data;

      main.data = resultData[0];
      console.log(main.data);
      main.chartArr = resultData[1];
      console.log(main.chartArr);

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
    })();

    //...
    //...
    //to get rawdata table
    populationService.rawData = main.data;
    populationService.flag = true;
  };
  main.getData();

}]);

populationHack.controller('percentController', ['$scope', '$resource', 'countryCodeService', 'populationService', function($scope, $resource, countryCodeService, populationService){
  var percent = this;

  percent.year1 = '2015';
  percent.year2 = '2016';

  //country list
  percent.countryList = countryCodeService.query(function(data){
    console.log(percent.countryList);
  });
  percent.countryData = {
    Code: 'IN',
    Name: 'India'
  };

  //year list
  percent.years = [2010, 2011, 2012, 2013, 2014, 2015, 2016];

  //function
  percent.getData = function(){
    console.log("Inside Getdata");
    var response = populationService.getPercentData(percent.countryData.Code, percent.year1, percent.year2);
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
