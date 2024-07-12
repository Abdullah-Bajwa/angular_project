angular.module('archer').directive('aplayer', function ($interval, $timeout) {
	return {
		restrict: 'A',
		scope: {
			audobj: '='
		},
		template: '<div class="audiowrap">\n'+
			'  <button class="btn btn-xs btn-default" ng-click="play()">\n' +
			'    <span class="glyphicon glyphicon-play"></span>\n' +
			'  </button>\n' +
			'  <button class="btn btn-xs btn-default" ng-click="pause()">\n' +
			'    <span class="glyphicon glyphicon-pause"></span>\n' +
			'  </button>\n' +
			//'  <div class="time">{{ ctime }} / {{ duration }}</div>\n' +
			'  <div class="volwrap">\n' +
			'    <img src="icon/vol/0.png" ng-if="vol == 0.0">\n' +
			'    <img src="icon/vol/33.png" ng-if="vol > 0.0 && vol <= 0.33">\n' +
			'    <img src="icon/vol/66.png" ng-if="vol > 0.33 && vol <= 0.66">\n' +
			'    <img src="icon/vol/100.png" ng-if="vol > 0.66">\n' +
			'    <div class="wrap2">\n' +
			'      <input type="range" min="0.0" max="1.0" step="0.05" ng-model="vol" ng-change="changevol()">\n' +
			'    </div>\n' +
			'  </div>\n' +
			'  <div class="rangewrap">\n' +
			'    <input id="rangeSlide" type="range" min="0.0" max="{{ duration }}" step="0.5" ng-value="ctime" >\n' +
			'  </div>\n' +
			'</div>',
		link: function ($scope, element, attrs) {
		},
		controller: function ($scope) {
			var local = {};
			if (typeof $scope.audobj == "string") {	
				$scope.audio = new Audio();
				$scope.audio.src = $scope.audobj;
				
				$scope.vol = 0.6;
				$scope.audio.volume = 0.6;
				$scope.ctime = 0;
			}
			$scope.play = function () {
				$scope.audio.play();
			};
			$scope.pause = function () {
				$scope.audio.pause();
			};

			$scope.$watch('audio.duration', function (newval) {
				$scope.duration = $scope.audio.duration.toFixed(1);
			});
			$scope.changetime = function (val) {
				$scope.audio.currentTime = val;
			};
			$scope.changevol = function (t) {
				$scope.audio.volume = $scope.vol;
			};
			$scope.ntot = function (secs) {
				var hr = Math.floor(secs / 3600);
				var min = Math.floor((secs - (hr * 3600)) / 60);
				var sec = Math.floor(secs - (hr * 3600) - (min * 60));
				if (min < 10) {
					min = "0" + min;
				}
				if (sec < 10) {
					sec = "0" + sec;
				}
				return min + ':' + sec;
			};
			$scope.$on('$destroy', function () {
				$scope.audio.pause();
			});

			// mouse down to check for previous value
			$('#rangeSlide').on('mousedown', function (e) {
				local.prevValue = $(this).val();
				$interval.cancel(local.interval);
			});
			// mouse up when the mouse up from the slider with end value
			$('#rangeSlide').on('mouseup', function () {
				var ThisValue = $(this).val();
				if (ThisValue !== local.prevValue) {  // check new value with previous value
					$timeout(function () {
						$scope.changetime(ThisValue);
						local.interval = startInterval();
					});
				}
			});

			local.interval = startInterval();

			 function startInterval() {
				return $interval(function () {
					$scope.ctime = _.toNumber($scope.audio.currentTime.toFixed(1));
				}, 100, false);
			}
		}
	};
});