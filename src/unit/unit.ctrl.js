(function () {
    angular.module('archer')
        .controller("UnitCtrl", unitCtrl);
    unitCtrl.$inject = ["$scope", "$routeParams", "$timeout", "$location"];

    function unitCtrl($scope, $routeParams, $timeout, $location) {
        
        $scope.bookId = $routeParams.bookId;
        $scope.unitId = $routeParams.unitId ? $routeParams.unitId : 1;
        $scope.pageId = $routeParams.pageId ? $routeParams.pageId : undefined;
        
        
        //$scope.english = "none";
        //$scope.greek = "none";
        $scope.zoomWindow = {
            width: 600,
            height: 600,
            containerTop: 170,
            top: 0,
            left: -1+0,
            url: "",
            opened: false,
            zoomTop: -100,
            scale: 2.1,
            personalQuestion: false,
            imgDivHeight: "initial",
            curtineMode: false
        };
        var local = {};

        function localData() {
            local.mouse = {
                x: 0,
                y: 0,
                startX: 0,
                startY: 0
            };

            local.undoHistory = [];
            local.undoIndexPath = 0;
            local.undoRectPath = 0;
			
            local.currentWidth = ($(window).height() - $(".flip-control").height()) * 922 / 600;
			var difWidth = $(window).width() - local.currentWidth;
			if(difWidth < 0){
				local.currentWidth = $(window).width() - 10;
			}
            local.currentHeight = local.currentWidth * 600 / 922;
            local.borderOnly = false;
            /*local.currentWidth = 922;
            local.currentHeight = 600;*/
        }

        function scopeData() {
            $scope.currentBook = local.locateBookAndUnits();
            $scope.currentUnit = local.currentUnit = local.locateUnit($scope.unitId);
            $scope.otherBooks = local.otherBooks();
            $scope.vocabList = wordListEnglish
            $scope.dataList = dataListSource
            $scope.currentPath = undefined;
            $scope.currentPage = undefined;
            $scope.debugPage = 0;
            $scope.debugMode = false;
            $scope.colors = [
                '#ff0000',
                '#0000ff',
                '#008000',
                '#ffff00',
                '#000000',
                '#ffa500',
                '#ffc0cb',
                '#800080'
            ];
            
        }

        

        function localFunctions() {
            local.locateBookAndUnits = function () {
                return _.find(books, {id: _.toNumber($scope.bookId)});
            };

            local.locateUnit = function (unit) {
                return _.find($scope.currentBook.unitMapping, {id: _.toNumber(unit)})
            };

            local.otherBooks = function () {
                return _.remove(_.cloneDeep(books), function (book) {
                    if (local.currentUnit.relevantBooks) {
                        return book.id !== _.toNumber($routeParams.bookId) && _.includes(local.currentUnit.relevantBooks, book.id);
                    } else {
                        return book.id !== _.toNumber($routeParams.bookId);
                    }
                });
            };
            

            local.setMousePosition = function (e, page) {
                var ev = e || window.event; //Moz || IE
                if (ev.pageX) { //Moz
                    var offsetX = (page === 'zoomBox') ? ev.offsetX - 35 : ev.offsetX;
                    var offsetY = (page === 'zoomBox') ? ev.offsetY - 53 : ev.offsetY;
                    local.mouse.x = offsetX + window.pageXOffset;
                    local.mouse.y = offsetY + window.pageYOffset;
                } else if (ev.clientX) { //IE
                    local.mouse.x = ev.clientX + document.body.scrollLeft;
                    local.mouse.y = ev.clientY + document.body.scrollTop;
                }
            };

            local.determineBookVisibility = function () {
                local.currentUnit = {};
                local.currentLesson = 0;
                _.each($scope.currentBook.unitMapping, function (unit) {
                    if (_.toNumber(unit.pageStart) <= $scope.currentPage && _.toNumber(unit.pageEnd) >= $scope.currentPage) {
                        local.currentUnit = unit;
                        _.each(local.currentUnit.lessons, function (page, lesson) {
                            let nextLessonPage = local.currentUnit.lessons[_.toNumber(lesson) + 1] ? local.currentUnit.lessons[_.toNumber(lesson) + 1] : unit.pageEnd;
                            if (_.toNumber(page) <= _.toNumber($scope.currentPage) && _.toNumber($scope.currentPage) <= _.toNumber(nextLessonPage)) {
                                local.currentLesson = lesson;
                            }
                        })
                    }
                });
                var unitId = local.currentUnit.id;
                $scope.otherBooks = local.otherBooks();
                _.each($scope.otherBooks, function (book) {
                    if ($scope.currentBook.id === 2 && book.id === 3) {
                        unitId += 8;
                    } else if ($scope.currentBook.id === 3 && book.id === 2) {
                        unitId -= 8;
                    }
                    let currentOtherUnit = _.find(book.unitMapping, {id: unitId});
                    if (currentOtherUnit) {
                        if ((!currentOtherUnit.lessons[_.toNumber(local.currentLesson)])&&(!($scope.currentBook.id === 2 && book.id === 3))) {
                            book.disabled = true;
                        } else {
                            book.disabled = false;
                        }
                    }
                    else {
                        book.disabled = true;
                    }
                })

            }
        }

        function scopeFunction() {
            $scope.selectedWord = function (selected){
                selected.title = selected.title.replace(/\//g, '-');
                $location.path('/unit/4/1/' + selected.title);
            }
            $scope.convertIndexToPage = function (i) {
                //console.log("index="+i);
                return i < 10 ? '0' + i : i < 100 ? '' + i : i;
            };
            $scope.filter_english = function() {
           
            let english = $scope.pageId;
            

            
            if ( wordListEnglish[english]){
                english = wordListEnglish[english];
                
                 
            }
            return english;

            };
            $scope.filter_greek = function() {
                //phrase not found = Η φράση δεν βρέθηκε
                
                let greek = "Η φράση δεν βρέθηκε";
                let english = $scope.pageId;
                
                if (wordListGreek[english]){
                    greek = wordListGreek[english];
                    }
                    return  greek;

            };
            

            $scope.goToPage = function (to) {
                if (to === 'book') {
                    $location.path('/' + to + '/' + $scope.bookId);
                }
                //The following logic will break if a unit is missing a video or if the videos per unit change from 2 to sth else it also assumes that all videos correspond to lesson 4
                else if(to === 'next'){
                    //console.log($scope.pageId);
                    let nextPage = (Number($scope.pageId) < $scope.currentBook.totalPages) ? Number($scope.pageId)+1: Number($scope.pageId);
                    if(nextPage%2 ==0){
                        $location.path('/unit/' + $scope.bookId + '/' + $scope.unitId + '/' + nextPage);  
                    }

                    

                }else if(to === 'prev'){
                    let prevPage = (Number($scope.pageId) > 1) ? Number($scope.pageId)-1 : Number($scope.pageId);
                    if(prevPage%2!=0){
                        $location.path('/unit/' + $scope.bookId + '/' + $scope.unitId + '/' + prevPage);
                    }
                    
                }
                
            };

            $scope.checkTranscript = function () {
                let currentPage = $scope.currentPage
                isTranscript = false
                _.each($scope.currentBook.unitMapping, function (unit) {
                    _.each(unit.pageMapping, function (page) {
                        if (page.id === currentPage) {
                            //console.log(currentPage)
                            //console.log(currentPage)
                            isTranscript = page.transcript
                        }
                    }
                    )
                }
                );
                
                
                //console.log(isTranscript);
                return isTranscript;
                
            };

            $scope.checkVideoTranscript = function () {
                let currentPage = $scope.currentPage
                isVideoTranscript = false
                _.each($scope.currentBook.unitMapping, function (unit) {
                    _.each(unit.pageMapping, function (page) {
                        if (page.id === currentPage) {
                            //console.log(currentPage)
                            //console.log(currentPage)
                            isVideoTranscript = page.video_transcript
                        }
                    }
                    )
                }
                );
                
                
                //console.log(isTranscript);
                return isVideoTranscript;
                
            };






            $scope.loadSource = function () {
               //console.log($scope.currentPage);
                let currentPage = $scope.currentPage;
                _.each($scope.currentBook.unitMapping, function (unit) {
                    _.each(unit.pageMapping, function (page) {
                        if (page.id === _.toNumber(currentPage))
                        {
                            if(page.videoId){
                                $location.path('/unit/6/'+Math.ceil(page.videoId/2)
                                        +'/'+ page.videoId);
                            }else{
                                
                                    Transcript = page.transcriptID;
                                    unitID = unit.id;
                                    localStorage.setItem("cbLastPage",0);
                        
                                    $location.path('/unit/1/'+unitID
                                        +'/'+ Transcript);
                            }
                        }
                    }
                    )
                }
                );
                
                
                //console.log(Transcript);
                //return Transcript;
                
            };

            $scope.goToBook = function (bookId) {
                local.determineBookVisibility();
                localStorage.setItem("wbLastPage", 0); 
                localStorage.setItem("cbLastPage", 0);
                let otherBook = _.find($scope.otherBooks, {id: bookId});
                var unitId = local.currentUnit.id ? local.currentUnit.id : Number($scope.unitId); 
                if ($scope.currentBook.id === 2 && otherBook.id === 3) {
                    unitId += 8;
                } else if ($scope.currentBook.id === 3 && otherBook.id === 2) {
                    unitId -= 8;

                }
                
                let otherUnit = _.find(otherBook.unitMapping, {id: unitId});
                if ($scope.currentBook.id === 2 && otherBook.id === 3) {
                    console.log('working2');
                    localStorage.setItem("wbLastPage", $scope.currentPage);
                    console.log(localStorage.getItem("wbLastPage"));
                    $location.path('/unit/' + bookId + '/' + otherUnit.id + '/' + [_.toNumber(Object.values(otherUnit.lessons)[0])]);
                }
                else if (($scope.currentBook.id === 3 && otherBook.id === 2) && localStorage.getItem("wbLastPage")!=0) {
                  console.log('working');
                  console.log(localStorage.getItem("wbLastPage"));
                  $location.path('/unit/' + bookId + '/' + otherUnit.id + '/' + localStorage.getItem("wbLastPage"));
                  localStorage.setItem("wbLastPage", 0); 
                }
                else if (($scope.currentBook.id === 3 && otherBook.id === 2) && localStorage.getItem("wbLastPage")==0) {
                  console.log('working');
                  console.log(localStorage.getItem("wbLastPage"));
                  $location.path('/unit/' + bookId + '/' + otherUnit.id + '/' );
                  localStorage.setItem("wbLastPage", 0); 
                }
                else{
                //localStorage.setItem("wbLastPage", $scope.pageId);
                console.log('not working');
                console.log("otherbook:"+bookId);
                let lessonNumber = local.currentLesson;
                if($scope.currentBook.id == 6){
                    lessonNumber = 4;
                }
                
                console.log("lesson: "+lessonNumber);
                //console.log('/unit/' + bookId + '/' + otherUnit.id + '/' + otherUnit.lessons[_.toNumber(local.currentLesson)]);
                $location.path('/unit/' + bookId + '/' + otherUnit.id + '/' + otherUnit.lessons[_.toNumber(lessonNumber)]);
                }
            };

            $scope.goToTranscript = function (transcriptId) {
                localStorage.setItem("cbLastPage", $scope.currentPage);
                    
                $location.path('/unit/5/1/'+ (transcriptId-95));

                
            };
            $scope.goToVideoTranscript = function () {
                //console.log(transcriptId);
                //console.log($scope.currentUnit);
                let offset = 0;
                _.each(books, function (book){
                    if(book.id == 5){
                        console.log(offset);
                        _.each(book.unitMapping, function (unit){
                            //console.log
                            if(unit.id == 1){
                                offset = Number(unit.pageEnd);
                                //console.log(offset);
                            }
                        });
                    }
                });
                offset += Number($scope.pageId);
                $location.path('/unit/5/2/'+ (offset));

                
            };
            $scope.goToTranscriptSource = function (transcript) {
                console.log(transcript);
                
                transcriptId = transcript.transcriptID;
                if(!transcript.isVideo){
                    localStorage.setItem("cbLastPage", $scope.currentPage);
                    
                    //console.log("ID: "+transcriptId);
                    $location.path('/unit/1/1/'+ (transcriptId));
                }else{
                    $scope.loadSource();
                }
                

                
            };
            $scope.findVocab = function () {
                $location.path('/unit/4/1/' + this.mySearch);
            }


            $scope.openPath = function (page, path) {
                /*if (path.type === 'personal') {
                    $scope.personalAction(path.zoom.answers[0].paths[0]);
                    return false;
                }*/

                //console.log(path)
                if(path.zoomOverride){
                    $scope.zoomWindow.url = 'images/books/img/' + $scope.currentBook.prefixImg + $scope.convertIndexToPage(page) + 'OverRide.jpg';
                    
                }else{
                    $scope.zoomWindow.url = 'images/books/img/' + $scope.currentBook.prefixImg + $scope.convertIndexToPage(page) + '.jpg';
                    }
                $scope.zoomWindow.opened = true;
                $scope.zoomWindow.height = (path.zoomOverride ? path.zoomOverride.height : path.height) * 600 / local.currentHeight;
                $scope.zoomWindow.left = -(path.zoomOverride ? path.zoomOverride.left : path.left) * 461 / (local.currentWidth / 2);
                $scope.zoomWindow.width = (path.zoomOverride ? path.zoomOverride.width : path.width) * 461 / (local.currentWidth / 2);
                //$scope.zoomWindow.height = path.height * 600 / local.currentHeight;
                //$scope.zoomWindow.left = -path.left * 461 / (local.currentWidth / 2);
                //$scope.zoomWindow.width = path.width * 461 / (local.currentWidth / 2);
                $scope.zoomWindow.top = -path.top * 600 / local.currentHeight;
                //console.log(path)
                $scope.zoomWindow.scale = 2.1;
                $scope.zoomWindow.containerTop = ($(window).height()*2.1/10)+10;
                $scope.zoomWindow.overflowY = 'none';
                $scope.currentPath = path;
                $scope.currentPage = page;
                $scope.currentAnswers = path.zoom ? _(path.zoom.answers).map().flatMap(function (o) {
                    return o.paths;
                }).value() : [];
                $timeout(function () {
                    if ($("#zoomBox")[0].getBoundingClientRect().height > (local.currentHeight - $(".flip-control").height())) {
                        $scope.zoomWindow.imgDivHeight = $scope.zoomWindow.height + 'px';
                        $scope.zoomWindow.height = (local.currentHeight / 2.1) - $(".flip-control").height();
                        $scope.zoomWindow.overflowY = 'scroll';
                    } else {
                        $scope.zoomWindow.imgDivHeight = 'inherit';
                    }

                    _.each($scope.currentAnswers, function (answer) {
                        if (answer.type === 'multiple') {
                            answer.width = 9;
                           // answer.left = answer.left- 1;
                        }
                    });

                    var clicked = false, clickY;
                    $(".scrollElement").mousemove(function (e) {
                        clicked && updateScrollPos(e);
                    });

                    $(".scrollElement").mousedown(function (e) {
                        clicked = true;
                        clickY = e.pageY;
                    });

                    $(".scrollElement").mouseup(function (e) {
                        clicked = false;
                        $('html').css('cursor', 'auto');
                    });

                    var updateScrollPos = function (e) {
                        $('html').css('cursor', 'row-resize');
                        $("#zoomBox").scrollTop($("#zoomBox").scrollTop() + (clickY - e.pageY));
                    }

                    dragscroll.reset();

                }, 50);

                local.determineBookVisibility();
            };

            $scope.locatePagePaths = function (currentPage) {
                let pagePaths = [];
                //console.log(currentPage)
                            
                _.each($scope.currentBook.unitMapping, function (unit) {
                    _.each(unit.pageMapping, function (page) {
                        if (page.id === _.toNumber(currentPage)) {
                            //console.log(currentPage)
                            pagePaths = page.paths;
                        }
                    })
                });
                _.each(pagePaths, function (object) {
                    if (!object.widthDif) {
                        object.width = ((object.width * (local.currentWidth) / 2) / (922 / 2));
                    if (object.zoomOverride){
                        object.zoomOverride.width = ((object.zoomOverride.width * (local.currentWidth) / 2) / (922 / 2));
                    }
                        object.widthDif = true;
                    }
                    if (!object.topDif) {
                        object.top = ((object.top * local.currentHeight) / 600);
                        object.topDif = true;
                    }

                    if (!object.leftDif) {
                        object.left = (object.left * (local.currentWidth / 2)) / (922 / 2);
                        if (object.zoomOverride){
                            object.zoomOverride.left = (object.zoomOverride.left * (local.currentWidth / 2)) / (922 / 2);
                        }
                        object.leftDif = true;
                    }

                    if (!object.heightDif) {
                        object.height = ((object.height * local.currentHeight) / 600);
                        if (object.zoomOverride){
                            object.zoomOverride.height = ((object.zoomOverride.height * local.currentHeight) / 600);
                        }
                        object.heightDif = true;
                    }
                });
                return pagePaths;
            };




          $scope.nextPath = function (direction) {
               
                let paths = $scope.locatePagePaths($scope.currentPage);
                let indexOfPath = _.indexOf(paths, $scope.currentPath);
                let nextIndex = indexOfPath + direction;

				 $scope.hideAll();
				
		  if (nextIndex === paths.length && ($scope.currentBook.id === 1 ||($scope.currentBook.id === 3 && $scope.currentPage!==12)) && (($scope.currentPage%2)===0 || ($scope.currentBook.id === 3  && ($scope.currentPage===11 ||($scope.currentPage===13) )  )  ) ) 
				{
					//nextIndex = indexOfPath - direction;               
					$scope.currentPage += 1;
                    paths = $scope.locatePagePaths($scope.currentPage);
                    $scope.currentPath = paths[0];
					

                }
				else if (nextIndex === paths.length && ($scope.currentBook.id === 1 ||$scope.currentBook.id === 3) && ($scope.currentPage%2)===1  ) 
				{
					//nextIndex = indexOfPath - direction;
					$scope.currentPath = paths[nextIndex-1];		
                }
				//else if (nextIndex === paths.length ) {
                  //  $scope.currentPage += 1;
                  //  paths = $scope.locatePagePaths($scope.currentPage);
                //    $scope.currentPath = paths[0];
               // } 
				else if (nextIndex < 0  && ($scope.currentBook.id === 1 ||($scope.currentBook.id === 3  && $scope.currentPage!==13)) && (($scope.currentPage%2)===1 || ($scope.currentBook.id === 3  && ($scope.currentPage===12||$scope.currentPage===14)) )  ) 
				{
                    $scope.currentPage -= 1;
                    paths = $scope.locatePagePaths($scope.currentPage);
                    $scope.currentPath = paths[paths.length - 1];
                } 
				
				else if (nextIndex < 0  && ($scope.currentBook.id === 1 ||$scope.currentBook.id === 3) && ($scope.currentPage%2)===0 ) 
				{
						$scope.currentPath = paths[nextIndex+1];	
                }
                else if (nextIndex === paths.length) 
				{
                   ;// $scope.currentPath = paths[0];
                } 
				else if (nextIndex < 0) 
				{
                    ;//$scope.currentPath = paths[paths.length - 1];
                }				
				else 
				{
                    $scope.currentPath = paths[nextIndex];
                }
                $scope.openPath($scope.currentPage, $scope.currentPath);
            };

/*
           $scope.nextPath = function (direction) {
                $scope.hideAll();
                let paths = $scope.locatePagePaths($scope.currentPage);
                let indexOfPath = _.indexOf(paths, $scope.currentPath);
                let nextIndex = indexOfPath + direction;
                if (nextIndex === paths.length) {
                    $scope.currentPath = paths[0];
                } else if (nextIndex < 0) {
                    $scope.currentPath = paths[paths.length - 1];
                } else {
                    $scope.currentPath = paths[nextIndex];
                }
                $scope.openPath($scope.currentPage, $scope.currentPath);
            };
			
			
		*/	
			
            $scope.showUnderline = function (answer) {
                if (answer.underline) {
                    let underlineId = answer.underline;
                    let underlinePaths = _($scope.currentAnswers).filter({id: underlineId, type: 'underline'}).value();
                    _.each(underlinePaths, function (path) {
                        path.showed = true;
                    })
                } else if (answer.hoverText) {
                    answer.hoverShow = true;
                }

            };

            $scope.closeZoom = function () {
                $scope.zoomWindow.personalQuestion = false;
                $scope.zoomWindow.opened = false;
                $scope.zoomWindow.curtineMode = false;
                $scope.hideAll();
            };

            $scope.answerAction = function (answer) {

                if (answer.type === 'personalButton') {
                    $scope.personalAction($scope.currentAnswers);
                    return;
                }

                if (answer.type === 'underline' || answer.draggable) {
                    return;
                }
                if (answer.valid) {
                    answer.showed = true;
                    var audio = new Audio('songs/effect/yes-sound.mp3');
                    audio.play();
                } else {
                    var audio = new Audio('songs/effect/no-sound.mp3');
                    audio.play();
                }
            };

            $scope.closeAnswer = function () {
                $scope.zoomWindow.personalQuestion = false;
            };

            $scope.personalAction = function (answers) {
                $scope.zoomWindow.personalQuestion = true;
                $scope.zoomWindow.opened = true;
                $scope.zoomWindow.personalAnswer = answers[1].text;
            };

            $scope.showAll = function () {
                _.each($scope.currentAnswers, function (answer) {
                    if (answer.valid) {
                        answer.foundSolution = true;
                        answer.showed = true;
                        if (answer.hoverText) {
                            answer.hoverShow = true;
                        }
                    }
                });
            };

            $scope.hideAll = function () {
                _.each($scope.currentAnswers, function (answer) {
                    answer.foundSolution = false;
                    answer.showed = false;
                    if (answer.hoverText) {
                        answer.hoverShow = false;
                    }
                });
            };

            $scope.openDebug = function () {
                let canvas = document.getElementById($scope.debugPage);

                var element = null;
                canvas.onmousemove = function (e) {
                    local.setMousePosition(e, $scope.debugPage);
                    if (element !== null) {
                        element.style.width = Math.abs(local.mouse.x - local.mouse.startX) + 'px';
                        element.style.height = Math.abs(local.mouse.y - local.mouse.startY) + 'px';
                        element.style.left = (local.mouse.x - local.mouse.startX < 0) ? local.mouse.x + 'px' : local.mouse.startX + 'px';
                        element.style.top = (local.mouse.y - local.mouse.startY < 0) ? local.mouse.y + 'px' : local.mouse.startY + 'px';
                    }
                };

                canvas.onclick = function (e) {
                    if (element !== null) {
                        var p = document.createElement('p');
                        p.className = "debugInfo";
                        p.innerHTML = "top:" + _.replace(element.style.top, "px", '') + ",<br/>left:" + _.replace(element.style.left, "px", '') + ",<br/>width:" + _.replace(element.style.width, "px", '') + ",<br>height:" + _.replace(element.style.height, "px", '');
                        element.appendChild(p);
                        element = null;
                        canvas.style.cursor = "default";
                        console.log("finsihed.");
                    } else {
                        console.log("begun.");
                        local.mouse.startX = local.mouse.x;
                        local.mouse.startY = local.mouse.y;
                        element = document.createElement('div');
                        element.className = 'rectangle';
                        element.style.left = local.mouse.x + 'px';
                        element.style.top = local.mouse.y + 'px';
                        canvas.appendChild(element);
                        canvas.style.cursor = "crosshair";
                    }
                };
                $scope.debugMode = true;
            };

            $scope.removeRects = function () {
                $(".rectangle").remove();
            };

            $scope.changeColor = function (color) {
                local.curColor = color;
            };

            $scope.changeTool = function (tool, borderOnly) {
                local.borderOnly = borderOnly;
                local.curTool = tool;
            };

            $scope.startPainting = function () {
                $scope.zoomWindow.drawingMode = !$scope.zoomWindow.drawingMode;
                if ($scope.zoomWindow.drawingMode) {
                    $('#canvasContainer').show();
                    var context = document.getElementById('canvasDrawer').getContext("2d");
                    var draft = document.getElementById('draftDrawer').getContext("2d");
                    document.getElementById('draftDrawer').style.opacity = 0.4;
                    local.curTool = "pencil";
                    var paint = false;
                    local.clickX = new Array();
                    local.clickY = new Array();
                    local.clickDrag = new Array();
                    local.clickColor = new Array();
                    local.clickSize = new Array();
                    local.clickRect = new Array();
                    local.undoHistory = new Array();
                    local.globalCompositeOperation = new Array();
                    local.globalAlpha = new Array();
                    local.curToolArray = new Array();
                    local.curColor = $scope.colors[0];
                    local.rectIndex = new Array();
                    local.sizes = {
                        small: 1,
                        normal: 4,
                        large: 8,
                        huge: 12
                    };

                    $('#canvasDrawer').attr("width", $("#zoomBox").width() * $scope.zoomWindow.scale);
                    $('#draftDrawer').attr("width", $("#zoomBox").width() * $scope.zoomWindow.scale);
                    $("#canvasContainer").width($("#zoomBox").width() * $scope.zoomWindow.scale);
                    $("#canvasContainer").height($("#zoomBox")[0].getBoundingClientRect().height + 20);
                    if ($scope.zoomWindow.overflowY == 'scroll') {
                        $('#canvasDrawer').attr("height", _.toNumber(_.replace($scope.zoomWindow.imgDivHeight, 'px', '')) * $scope.zoomWindow.scale);
                        $('#draftDrawer').attr("height", _.toNumber(_.replace($scope.zoomWindow.imgDivHeight, 'px', '')) * $scope.zoomWindow.scale);
                    } else {
                        $('#canvasDrawer').attr("height", $("#zoomBox")[0].getBoundingClientRect().height);
                        $('#draftDrawer').attr("height", $("#zoomBox")[0].getBoundingClientRect().height);
                    }

                    $("#curtineContainer").height($('#canvasDrawer').attr("height"));

                    $("#canvasContainer").css("top", $("#zoomBox").offset().top);
                    $("#canvasContainer").css("left", $("#zoomBox").offset().left);

                    $('#canvasDrawer').mousedown(function (e) {
                        var mouseX = e.pageX - $("#canvasContainer").offset().left;
                        var mouseY = e.pageY - $("#canvasContainer").offset().top + $('#canvasContainer').scrollTop();
                        paint = true;
                        addClick(mouseX, mouseY);
                        local.redraw();
                        if (local.curTool !== 'rect' && local.curTool !== 'text')
                            local.undoHistory.push({type: 'path', obj: local.undoIndexPath++})
                    });
                    $('#canvasDrawer').mousemove(function (e) {
                        if (paint) {
                            $("textarea").css("z-index", -1);
                            var mouseX = e.pageX - $("#canvasContainer").offset().left;
                            var mouseY = e.pageY - $("#canvasContainer").offset().top + $('#canvasContainer').scrollTop();
                            addClick(mouseX, mouseY, true);
                            local.redraw();
                        }
                    });

                    $('#canvasDrawer').mouseup(function (e) {
                        paint = false;
                        $timeout(function () {
                            $("textarea").show();
                        })
                    });

                    $('#canvasDrawer').mouseleave(function (e) {
                        paint = false;
                    });

                    $('#canvasContainer').on('scroll', function () {
                        $('#zoomBox').scrollTop($(this).scrollTop() * $scope.zoomWindow.scale);
                    });

                    local.redraw = function () {
                        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
                        draft.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the draft

                        function drawRect(currentRect, index) {
                            draft.beginPath();
                            var width = currentRect.x[currentRect.x.length - 1] - currentRect.x[0];
                            var height = currentRect.y[currentRect.y.length - 1] - currentRect.y[0];
                            draft.globalCompositeOperation = "source-over";
                            draft.lineWidth = 1;
                            if (currentRect.borderOnly) {
                                draft.strokeStyle = currentRect.color;
                                draft.strokeRect(currentRect.x[0], currentRect.y[0], width, height);
                            } else {
                                draft.fillStyle = currentRect.color;
                                draft.fillRect(currentRect.x[0], currentRect.y[0], width, height);
                            }
                            draft.rect(currentRect.x[0], currentRect.y[0], width, height);

                            if (currentRect.textArea) {

                                if ($("#textarea-" + index).length === 1) {
                                    $("#textarea-" + index).css("top", currentRect.y[0]);
                                    $("#textarea-" + index).css("left", currentRect.x[0]);
                                    $("#textarea-" + index).css("width", width);
                                    $("#textarea-" + index).css("height", height);
                                    $("#textarea-" + index).css("z-index", 214);
                                    $("#textarea-" + index).hide();
                                } else {
                                    var textArea = $('<textarea id="textarea-' + index + '" style="position:absolute;top:' + currentRect.y[0] + 'px;left:' + currentRect.x[0] + 'px;width:' + width + 'px;height:' + height + 'px;"/>');
                                    $("#canvasContainer").append(textArea);
                                }

                            }

                            draft.closePath();
                        }

                        context.lineJoin = "round";
                        for (var i = 0; i < local.clickX.length; i++) {
                            var isMarker = local.curToolArray[i] === "marker";
                            var isEraser = local.curToolArray[i] === "eraser";
                            var obj = {};
                            if (local.clickDrag[i] && i) {
                                obj.moveX = local.clickX[i - 1];
                                obj.moveY = local.clickY[i - 1];
                            } else {
                                obj.moveX = local.clickX[i] - 1;
                                obj.moveY = local.clickY[i];
                            }
                            obj.x = local.clickX[i];
                            obj.y = local.clickY[i];
                            obj.lineWidth = local.clickSize[i];
                            obj.strokeStyle = local.clickColor[i];
                            if (isMarker || isEraser) {
                                draft.beginPath();
                                draft.moveTo(obj.moveX, obj.moveY);
                                draft.globalCompositeOperation = local.globalCompositeOperation[i];
                                draft.globalAlpha = 1;
                                draft.lineTo(local.clickX[i], local.clickY[i]);
                                draft.lineWidth = local.clickSize[i];
                                draft.strokeStyle = local.clickColor[i];
                                draft.closePath();
                                draft.stroke();
                            }
                        }
                        context.globalAlpha = 0.4;
                        context.drawImage(document.getElementById('draftDrawer'), 0, 0);
                        draft.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the draft
                        for (var i = 0; i < local.clickX.length; i++) {
                            var isMarker = local.curToolArray[i] === "marker";
                            var isRect = local.curToolArray[i] === "rect" || local.curToolArray[i] === 'text';
                            var obj = {};
                            if (local.clickDrag[i] && i) {
                                obj.moveX = local.clickX[i - 1];
                                obj.moveY = local.clickY[i - 1];
                            } else {
                                obj.moveX = local.clickX[i] - 1;
                                obj.moveY = local.clickY[i];
                            }
                            obj.x = local.clickX[i];
                            obj.y = local.clickY[i];
                            obj.lineWidth = local.clickSize[i];
                            obj.strokeStyle = local.clickColor[i];
                            if (!isMarker) {
                                if (isRect) {
                                    var rectIndex = local.rectIndex[i];
                                    if (rectIndex > -1) {
                                        drawRect(local.clickRect[rectIndex], rectIndex);
                                    }
                                } else {
                                    draft.beginPath();
                                    draft.moveTo(obj.moveX, obj.moveY);
                                    draft.globalCompositeOperation = local.globalCompositeOperation[i];
                                    draft.globalAlpha = 1;
                                    draft.lineTo(local.clickX[i], local.clickY[i]);
                                    draft.lineWidth = local.clickSize[i];
                                    draft.strokeStyle = local.clickColor[i];
                                    draft.closePath();
                                    draft.stroke();
                                }
                            }
                        }
                        context.globalAlpha = 1;
                        context.drawImage(document.getElementById('draftDrawer'), 0, 0);
                        draft.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the draft

                    }
                }
                else {
                    $('#canvasContainer').hide();
                    $scope.zoomWindow.curtineMode = false;
                    $("textarea").remove();
                }

                function addClick(x, y, dragging) {
                    local.clickX.push(x);
                    local.clickY.push(y);
                    local.clickDrag.push(dragging);
                    local.curToolArray.push(local.curTool);
                    local.globalAlpha.push(1);
                    var rectIndex = -1;
                    var globalComposite = "source-over";
                    var size = local.sizes[$("#sizePaint").val()];
                    if (local.curTool === 'rect' || local.curTool === 'text') {
                        if (!dragging) {
                            let obj = {
                                x: [x],
                                y: [y],
                                color: (local.curTool === 'text') ? '#fff' : local.curColor,
                                borderOnly: local.borderOnly,
                                textArea: (local.curTool === 'text')
                            };
                            local.clickRect.push(obj);
                            rectIndex = local.clickRect.length - 1;
                            local.undoHistory.push({type: 'rect', obj: local.undoRectPath});
                            local.undoRectPath++;
                        } else {
                            let currentRect = local.clickRect[local.clickRect.length - 1];
                            currentRect.x.push(x);
                            currentRect.y.push(y);
                        }
                    } else {
                        if (local.curTool === "eraser") {
                            globalComposite = "destination-out";
                        } else {
                            if (local.curTool === "marker") {
                                size = 15;
                            }
                        }

                    }
                    local.rectIndex.push(rectIndex);
                    local.clickColor.push(local.curColor);
                    local.clickSize.push(size);
                    local.globalCompositeOperation.push(globalComposite);

                }
            };
            $scope.clearAllDrawing = function () {
                var context = document.getElementById('canvasDrawer').getContext("2d");
                var draft = document.getElementById('draftDrawer').getContext("2d");
                context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
                draft.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
                local.clickX = new Array();
                local.clickY = new Array();
                local.clickDrag = new Array();
                local.clickColor = new Array();
                local.clickSize = new Array();
                local.clickRect = new Array();
                local.undoHistory = new Array();
                local.curToolArray = new Array();
                local.globalCompositeOperation = new Array();
                local.rectIndex = new Array();
                local.undoRectPath = 0;
                $("textarea").remove();
            };
            $scope.undoPaint = function () {
                let lastMovement = local.undoHistory[local.undoHistory.length - 1];
                if (lastMovement) {
                    if (lastMovement.type === 'rect') {
                        local.clickRect.splice(lastMovement.obj, 1);
                        $("#textarea-" + (lastMovement.obj)).remove();
                        local.undoRectPath--;
                    }
                    var currentStopDragging = 0;
                    _.each(local.clickDrag, function (drag, index) {
                        if (!drag) {
                            currentStopDragging = index;
                        }
                    });
                    var startIndex = currentStopDragging;
                    var countItems = local.clickDrag.length - startIndex;
                    local.clickX.splice(startIndex, countItems);
                    local.clickY.splice(startIndex, countItems);
                    local.clickDrag.splice(startIndex, countItems);
                    local.clickColor.splice(startIndex, countItems);
                    local.clickSize.splice(startIndex, countItems);
                    local.curToolArray.splice(startIndex, countItems);
                    local.globalCompositeOperation.splice(startIndex, countItems);
                    local.rectIndex.splice(startIndex, countItems);

                    local.undoHistory.splice(local.undoHistory.length - 1, 1);
                    local.redraw();
                }
            }
            $scope.toggleCurtine = function () {
                $scope.zoomWindow.curtineMode = !$scope.zoomWindow.curtineMode;
            }
        }

        function initCtrl() {
            localFunctions();
            scopeFunction();
            localData();
            scopeData();
            initOutsideAngular();
        }

        function initOutsideAngular() {
            $timeout(function () {
                local.oTurn = $('.flipbook').turn({
                    // Width
                    width: local.currentWidth,
                    // Height
                    height: local.currentHeight,
                    // Elevation
                    elevation: 50,
                    // Enable gradients
                    gradients: true,
                    // Auto center this flipbook
                    autoCenter: false
                });
                $('.containerFlip').css('left', $(window).width() / 2 - (local.currentWidth / 2) - (local.currentHeight / 2));
				$('.containerFlip').css('top', ($(window).height() - local.currentHeight - $('.flip-control').height())/2);
                local.oTurn.bind("turning", function (event, page, view) {

                    if (page === 1 /*|| page === $scope.currentBook.totalPages*/) {
                        $('.containerFlip').css('left', $(window).width() / 2 - (local.currentWidth / 2) - (local.currentHeight / 2));
                    } else {
                        $('.containerFlip').css('left', $(window).width() / 2 - (local.currentWidth / 2));
                    }
                });

                $("#prev").click(function (e) {
                    e.preventDefault();
                    $timeout(function () {
                        local.determineBookVisibility();
                    });
                    local.oTurn.turn("previous");
                    localStorage.setItem("wbLastPage", 0); 
                    localStorage.setItem("cbLastPage", 0);
                });

                $("#next").click(function (e) {
                    e.preventDefault();
                    $timeout(function () {
                        local.determineBookVisibility(); 
                    });
                    local.oTurn.turn("next");
                    localStorage.setItem("wbLastPage", 0); 
                    localStorage.setItem("cbLastPage", 0); 
                });

                ///decide if we will navigate to specific unit
                if ($scope.currentUnit) {
                    $scope.currentPage = _.toNumber($scope.pageId);
                    if ($scope.pageId) {
                        local.oTurn.turn("page", Number($scope.pageId));
                    } else {
                        local.oTurn.turn("page", Number($scope.currentUnit.pageStart));
                    }
					local.determineBookVisibility();
                }

                local.oTurn.bind("turning", function (event, page, view) {
                    let firstPage = $scope.currentBook.unitMapping[0].pageStart;
                    let endPage = $scope.currentBook.unitMapping[$scope.currentBook.unitMapping.length - 1].pageEnd;
                    if (page < firstPage || page > endPage) {
                        event.preventDefault();
                    } else {
                        $scope.currentPage = _.toNumber(page);
                    }
                });


            }, 50);
        }
        

        initCtrl();


    }
})();

 
