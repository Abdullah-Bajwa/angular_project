(function () {
	angular.module('archer')
		.controller("BookCtrl", bookCtrl);
	bookCtrl.$inject = ["$scope", "$routeParams", "$timeout", '$window'];
	localStorage.setItem("wbLastPage", 0);

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
			$scope.mySearch = '';
			$scope.dataList = dataListSource
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
					$window.location.href = '#!unit/'+$scope.currentBook.id+'/'+unit.id+'/'+92;
				}
			}
		}

		$scope.selectedWord = function (selected){
			selected.title = selected.title.replace(/\//g, '-');
			//console.log(selected.title)
			$window.location.href='#!unit/4/1/'+ selected.title;
		}
		$scope.findVocab = function () {
                //$window.location.href='#!unit/4/1/'+ $scope.searchStr;
				console.log($scope.str)
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