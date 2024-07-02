(function () {
    angular.module('archer')
        .controller("HomeCtrl",homeCtrl);
    homeCtrl.$inject=["$scope", "$timeout"];

    function homeCtrl($scope, $timeout){

        $scope.started = false;
        $scope.run = function () {
		//	$(".exitButton").show();
            $scope.started = true;
			win.setMaximumSize(10000, 10000);
			win.setMinimumSize(0, 0);
			win.maximize();
			win.on('maximize', function() {
				//win.setMaximumSize(win.width, win.height);
				//win.setMinimumSize(win.width, win.height);
				win.enterKioskMode();
			});
			
        };
        //$scope.run();

        $scope.install = function () {
			//var path = require('path'); 
			//var pathString = path.dirname(process.execPath);
			//var newPath = "..\\..\\ArcherCrackTheCodeInstallation.exe";
			//pathString.replace(/\\/g, "\\\\");
            //var exec = require('child_process').execFile;
			//exec("..\\..\\ArcherCrackTheCodeInstallation.exe", function(err, data) {  
			//		console.log(err)
			//		console.log(data.toString());                       
			//});
			window.open("New_Adventures_with_English_Setup_4.0.0.exe");
        }
    }

})();