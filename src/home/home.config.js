(function () {
    angular.module('archer')
    .config
    (['$routeProvider',
        function config($routeProvider) {
            $routeProvider.when('/home', {
                template: '<div ng-if="!started" style="position: fixed;top:0;left:0">' +
                    '<img src="images/CTC_start.jpg" style="display:block; height: 100vh; width: 100vw; margin-left: auto; margin-right:auto;"> ' +
                    '<button ng-click="run()" style="position:absolute;top: 25vh;left: 90px;width: 180px; font-size: 36px; background-color: black; color: white; border: white;  ">RUN</button>' +
                    '<button ng-click="install()" style="position:absolute;top: 35vh; left: 90px;width: 180px; font-size: 36px; background-color: black; color: white; border: white;">INSTALL' +
                    '</button></div>' +
                    '<div id="background-wrap" >\n' +
					'</div>\n' +
					'\t<div class="logoContainer " ng-if="started">' +
                    '<a href="#!landingPage" class="slide-fwd-center" ><img style="margin-top:15px;" src="images/static/logoarcher1.png "></a>' +
                    '</div>',
                controller: "HomeCtrl"
            })

        }
    ]);
})();