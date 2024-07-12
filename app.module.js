(function () {
    var archer=angular.module("archer",["ngRoute", "ngSanitize", "angucomplete-alt"]);
    archer.config
    (['$routeProvider',
        function config($routeProvider) {
            $routeProvider.
            otherwise('/home');
        }
    ]);
	archer.config( [
    '$compileProvider',
		function( $compileProvider )
		{   
			$compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|chrome-extension):|data:image\/)/);
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|chrome-extension):/);
		}
	]);
	
	archer.config(function($sceDelegateProvider) {
		 $sceDelegateProvider.resourceUrlWhitelist(['**']);
	})
})();