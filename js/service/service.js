//Services
populationHack.service('countryCodeService', function($resource){
  return $resource('js/service/countryCodes.json');
});


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
