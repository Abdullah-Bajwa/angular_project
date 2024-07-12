(function () {
  angular.module("archer").config([
    "$routeProvider",
    function config($routeProvider) {
      $routeProvider.when(
        "/book/:bookId",

        {
          template:
            '<div ng-if = "currentBook.id===8" class= "searchBar">' +
            //'<form action="index.html#!/book/4" method="GET">'+
            "<div>" +
            '<img src="images/static/logoarcher1.png ">' +
            "</div>" +
            "<form>" +
            
            '<div style="display: inline-block;"><div angucomplete-alt class="autocomplete"' +
            'placeholder="Search Words"' +
            //'ng-model="mySearch"'+
            'maxlength="50"' +
            'pause="100"' +
            'selected-object="selectedWord"' +
            'local-data="dataList"' +
            'search-fields="word"' +
            'title-field="word"' +
            'minlength="1"' +
            'input-class="form-control form-control-small"' +
            'style="width: 40vw; margin: auto;"' +
            'match-class="highlight"></div></div>' +
            "<br>" +
            "</form>" +
            "</div>" +
            '<div  class="row center-div">\n' +
            //'\t\t<div ng-if="currentBook.id!=4" class="unitSection col-md-2" ng-repeat="unit in currentBook.unitMapping" ng-class="{`two-column`: unit.lessons.length > 8}">\n' +
            '\t\t<div class="unitSection col-md-2" ng-repeat="unit in currentBook.unitMapping" ng-class="{`two-column`: unit.lessons.length > 8}">\n' +
            '\t\t\t<div  ng-click="showLesson(unit)">\n' +
            //'<div ng-if = "currentBook.id!=4" ng-show="unit.showLesson" class="lessonContainer" style="background: {{unit.color}};">' +
            '<div ng-show="unit.showLesson" class="lessonContainer" style="background: {{unit.color}};">' +
            //'<div ng-show="unit.showLesson" class="lessonContainer" style="background: {{unit.color}};">'+
            '<div class="lessonSection button elipsis" ng-repeat="(lesson, page) in unit.lessons">' +
            '<a ng-if = "(currentBook.id!=1 || unit.id !=9) && (currentBook.id !=5)" href="#!unit/{{currentBook.id}}/{{unit.id}}/{{page}}">Lesson {{lesson}}</a>' +
            //'<a ng-if = "currentBook.id===2&&lesson==7" href="#!unit/{{currentBook.id}}/{{unit.id}}/{{page}}">Revision Exercises</a>'+
            '<a ng-if = "currentBook.id===1&&unit.id == 9" href="#!unit/{{currentBook.id}}/{{unit.id}}/{{page}}">Unit {{lesson}}</a>' +
            '<a ng-if = "currentBook.id===5 && lesson != 8" href="#!unit/{{currentBook.id}}/{{unit.id}}/{{page}}">Unit {{lesson}}</a>' +
            '<a ng-if = "currentBook.id===5 && lesson == 8" href="#!unit/{{currentBook.id}}/{{unit.id}}/{{page}}">Goodbye</a>' +
            "</div></div>" +
            //'<div ng-if = "currentBook.id===4" " class="videoContainer" style="background: {{unit.color}};">'+
            //'<div class="lessonSection button elipsis-wide" >' +
            //'<a href="#!unit/{{currentBook.id}}/{{unit.id}}/1"> Video </a>'+
            //'</div>'+
            //'<div class="lessonSection button elipsis-wide" >' +
            //'<a href="#!unit/{{currentBook.id}}/{{unit.id}}/2"> Worksheet </a>'+
            //'</div>'+
            //'</div>'+

            '\t\t\t\t<div ng-if = "currentBook.id!=8"class="button elipsis-narrow" style="background-color: {{unit.color}};">{{unit.unitName}}</div>\n' +
            "\t\t\t</div>\n" +
            '\t\t\t<div ng-if = "currentBook.id!=8">\n' +
            '\t\t\t\t<div class="button squared" ng-if="unit.revision">Revision</a></div>\n' +
            "\t\t\t</div>\n" +
            "\t\t</div>\n" +
            '\t<div class="toolbar">\n' +
            //'\t\t<a ng-if="book.id !=6 " ng-repeat="book in otherBooks" href="#!book/{{book.id}}" class="btn">{{book.title}}</a>\n' +
            '\t\t<a ng-repeat="book in otherBooks" href="#!book/{{book.id}}" class="btn">{{book.title}}</a>\n' +
            "\t</div>",

          controller: "BookCtrl",
        }
      );
    },
  ]);
})();
