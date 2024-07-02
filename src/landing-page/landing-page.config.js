(function () {
  angular.module("archer").config([
    "$routeProvider",
    function config($routeProvider) {
      $routeProvider.when("/landingPage", {
        template:
          '<div class="container-fluid">' +
          '<div class ="col">' +
          '<div class="col-md-1 no-float">' +
          '<div class="gallery-top">\n' +
          "\t</div>\n" +
          "\t</div>\n" +
          '<div class ="col">' +
          '<div class="col-md-12 no-float">' +
          '<div class="gallery-top">\n' +
          "\t</div>\n" +
          "\t</div>\n" +
          '<div class="col-md-3 no-float">' +
          '<div class="gallery-top">\n' +
          '<a href="#!book/1"><img src="images/books/img/covers/alphabet_cover.jpg" ></a>\n' +
          "\t</div>\n" +
          "\t</div>\n" +
          '<div class="col-md-3 no-float">' +
          '<div class="gallery-top">\n' +
          '<a href="#!book/2"><img src="images/books/img/covers/coursebook_cover.jpg"></a>\n' +
          "\t</div>\n" +
          "\t</div>\n" +
          '<div class="col-md-3 no-float">' +
          '<div class="gallery-top">\n' +
          '<a href="#!book/3"><img src="images/books/img/covers/workbook_cover.jpg" ></a>\n' +
          "\t</div>\n" +
          "\t</div>\n" +
          '<div class="col-md-3 no-float">' +
          '<div class="gallery-top">\n' +
          '<a href="#!book/4"><img src="images/books/img/covers/companion_cover.jpg" ></a>\n' +
          "\t</div>\n" +
          "\t</div>\n" +
          "\t</div>\n" +
          "</div>",
        controller: "LandingCtrl",
      });
    },
  ]);
})();
