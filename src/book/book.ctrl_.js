(function () {
	angular.module('archer')
		.controller("BookCtrl", bookCtrl);
	bookCtrl.$inject = ["$scope", "$routeParams", "$timeout", '$window'];

	function bookCtrl($scope, $routeParams, $timeout, $window) {
		$scope.bookId = $routeParams.bookId;
		var local = {};

		function localFunctions() {
			local.locateBookAndUnits = function () {
				return _.find(books, {id: _.toNumber($scope.bookId)});
			};

			local.otherBooks = function () {
				return _.remove(_.cloneDeep(books), function (book) {
					return book.id !== _.toNumber($scope.bookId);
				});
			}
		}

		function scopeData() {
			$scope.currentBook = local.locateBookAndUnits();
			$scope.otherBooks = local.otherBooks();
		}

		function scopeFuntions() {
			$scope.showLesson = function (unit) {
				if (unit.lessons) {
					if (local.openUnit && local.openUnit.id !== unit.id) {
						local.openUnit.showLesson = false;
					}
					local.openUnit = unit;
					unit.showLesson = true;
				}else{
					$window.location.href = '#!unit/'+$scope.currentBook.id+'/'+unit.id+'/'+46;
				}
			}
		}

		function initCtrl() {
			localFunctions();
			scopeData();
			scopeFuntions();
			$(".mainContainer").click(function (e) {
				if (!$(e.target).hasClass("button") && !$(e.target).hasClass("lessonContainer")) {
					$timeout(function () {
						if (local.openUnit) {
							local.openUnit.showLesson = false;
						}
					})
				}
			})
		}

		initCtrl();
	} 
})();