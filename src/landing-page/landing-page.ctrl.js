(function () {
	angular.module('archer')
		.controller("LandingCtrl", landingCtrl);
	landingCtrl.$inject = ["$scope"];
    localStorage.setItem("wbLastPage", 0);

	function landingCtrl($scope) {
		$scope.url = "songs/Track_01.mp3";
		var audio = new Audio($scope.url);
		audio.play();
        audio.onended=function(){
            $scope.url = "songs/play.mp3";
            var audio2 = new Audio($scope.url);
            audio2.play();
            audio2.loop = true;

            $scope.$on("$destroy", function() {
                audio2.pause();
            });

        };

        $scope.$on("$destroy", function() {
            audio.pause();
        });

	}
})();