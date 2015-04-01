angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaFile, $http, $ionicModal) {
  $scope.data = {};
  $scope.data.ping_time = 2000;
  $scope.editText = "Edit";
  $scope.isEdit = false;
  $scope.sites = [
    {
      'index': 0,
      'name': 'Google',
      'url': 'http://www.google.com',
      'status': false,
      'image': 'img/yellow_stoplight.png'
    }
  ];

  function check_and_post_status(site){
    $http({method: 'GET', url: site.url, timeout: $scope.data.ping_time})
      .success(function(data, status){
        site.status = true;
        site.image = 'img/green_stoplight.png';
      })
      .error(function(data, status){
        site.status = false;
        site.image = 'img/red_stoplight.png';
      });
  }

  $scope.doRefresh = function(){
    for (var i = 0; i < $scope.sites.length; i++){
      check_and_post_status($scope.sites[i]);
    }
    // Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  };

  $ionicModal.fromTemplateUrl('templates/add.html', function(modal){
    $scope.addModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  var add_to_persistence = function (data, file_name){
    $cordovaFile.writeFile(cordova.file.dataDirectory, file_name, JSON.stringify(data), true)
      .then(function (success) {
        console.log("Data written to " + file_name);
      }, function (error) {
        console.log("Failed to write " + file_name + " with error " + JSON.stringify(error));
      }); 
  };

  $scope.addSite = function(my_form){
    var finalURL = "http://" + my_form.url;
    $scope.sites.push({
     'index': $scope.sites.length,
     'name': my_form.name,
     'url': finalURL,
     'status': false,
     'image': "img/yellow_stoplight.png"
    });
    add_to_persistence($scope.sites, "sites_persist.json");
    my_form.name = '';
    my_form.url = '';
    $scope.closeAddSite();
  };

  $scope.removeSite = function(index){
    $scope.sites.splice(index, 1);
    add_to_persistence($scope.sites, "sites_persist.json");
    /*$scope.isEdit = false;
    $scope.editText = "Edit";*/
  };

  $scope.showAddSite = function() {
    $scope.addModal.show();
  };

  $scope.closeAddSite = function() {
    $scope.isEdit = false;
    $scope.editText = "Edit";
    $scope.addModal.hide();
  };

  $scope.toggleEdit = function() {
    $scope.isEdit = !$scope.isEdit;
    if ($scope.isEdit){
      $scope.editText = "Done";
    } else {
      $scope.editText = "Edit";
    } 
  };

  ionic.Platform.ready(function () {
    $cordovaFile.createFile(cordova.file.dataDirectory, "sites_persist.json", false)
      .then(function (success) {
        //succeeded in creating file!
      }, function (error) {
        $cordovaFile.readAsText(cordova.file.dataDirectory, "sites_persist.json")
          .then(function (success) {
            $scope.sites = JSON.parse(success);
            for (var i = 0; i < $scope.sites.length; i++){
              $scope.sites[i].image = "img/yellow_stoplight.png";
            }
          }, function (error) {
            // error
          });
      });
  });
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
