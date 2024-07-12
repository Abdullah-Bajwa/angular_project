(function () {
    angular.module('archer')
        .config
        (['$routeProvider',
            function config($routeProvider) {
                $routeProvider.when('/unit/:bookId/:unitId/:pageId?', {
                    template:
                    
                    /*'<div class="debug">' +
                    '<button ng-click="openDebug()">Debug</button>' +
                    'Select Page<select ng-model="debugPage">' +
                    '<option ng-repeat="x in [].constructor(currentBook.totalPages) track by $index;"' +
                    ' value="page-{{$index}}">{{$index+1}}</option>'+
                    '<option value="zoomBox">Zoom Box</option>'+
                    '</select>'+
                    '<button ng-click="removeRects()">Remove Rects</button>'+
                    '</div>' +*/
                        '<div class="flipbook-viewport">\n' +
                        '<div ng-if="currentBook.id ===8" class= "searchBar" style="padding:0;">'+
                        '<div class="topBar" style="z-index: +2" ng-if="currentBook.id ===8">'+
                        '<div angucomplete-alt class="autocomplete"'+
                        'placeholder="Search Words"'+
                        //'ng-model="mySearch"'+
                        'maxlength="50"'+
                        'pause="100"'+
                        'selected-object="selectedWord"'+
                        'local-data="dataList"'+
                        'search-fields="word"'+
                        'title-field="word"'+
                        'minlength="1"'+
                        'input-class="form-control"'+
                        'style="height: 10px; margin: auto; padding: auto;"'+
                        'match-class="highlight"></div>'+
                        '</div>'+
                        '</div>'+
                        
                        
                        '<div ng-if="currentBook.id ===8" class = "vocab">'+
                        '<div class = "sideBar">'+
                        '<div style="color:rgba(255,255,255,1); background-color: rgba(100,100,70,0.8); font-size: 24px;">'+
                        '<p style="position: sticky; top: 0; color:rgba(255,255,255,1); background-color: rgba(90,90,70,1); font-weight: bold;">Word List</p>'+
                        
                        '<div ng-repeat="(key,value) in vocabList"><a href="#!unit/7/1/{{key}}"style="color:#FFF;">{{value}}</a></div>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+


                        
                        
                        '<div ng-if="currentBook.id===6" class = "vidWindow">'+
                        '<video style="height: 100%;" controls preload ="metadata">'+
                        '<source src = "images/videos/{{currentBook.prefixImg + pageId}}.mp4" type = "video/mp4" />'+
                        '<track label="English" kind="subtitles" srclang="en" src="images/videos/captions/{{currentBook.prefixImg + convertIndexToPage($index+1)}}.vtt" default>'+
                        '</video>'+
                        
                        '</div>'+
                        

                        '<div ng-if="currentBook.id===8" class = "vocabWindow" style="pointer-events: none; z-index: 0;">'+
                        '<div class = "vocab-heading">'+
                        '<h1 style = "font-size: 36px;">{{filter_english()}} \xa0  </h1>'+
                        '<h1 style = "font-size: 72px; padding-top:10px;">{{filter_greek()}}</h1>'+
                                                
                        '</div>'+
                        '<div class="spacer">'+
                        '</div>'+
                        '</div>'+
                        
                        '\t<div class="containerFlip">\n' +

                        '\t\t<div ng-if="currentBook.id!=7 && currentBook.id!=6" class="flipbook">\n' +




                        //*******************important conditional for pageclass div*************************************
                        //ng-if="currentBook.id!=4 || pageId != 1" used when videos are included



                        //the following line hides the answer pages from coursebook if it is ever changed, the transcript IDs will have to adjusted to account for the extra pages
                        //'<div ng-if="currentBook.id!=4 && ($index>102 ||$index<95)" ng-repeat="x in [].constructor(currentBook.totalPages) track by $index;" id="page-{{$index}}"' +
                        '<div ng-repeat="x in [].constructor(currentBook.totalPages) track by $index;" id="page-{{$index}}"' +
                        ' class="pageClass">' +
                        //'<div class = test>'+
                        //'</div>'+
                        '<img src="images/books/img/{{currentBook.prefixImg + convertIndexToPage($index+1)}}.jpg" />' +
                        '<div ng-show="!debugMode" class="selectableArea {{path.type?path.type : \'\'}}" ng-click="openPath($parent.$index+1,' +
                        ' path)" ng-repeat="path in locatePagePaths($index+1)"' +
                        ' style="top:{{path.top}}px;left:{{path.left}}px;width:{{path.width}}px;height:{{path.height}}px">' +
                        '</div>' +
                        '</div>' +
                        '\t\t</div>\n' +
                        '\t</div>\n' +
                        '\t<div  class="flip-control">\n' +
                        '<button ng-if="!other.disabled && other.id!=4 && currentBook.id!=8" ng-repeat="other in otherBooks"' +
                        //'<button ng-if="other.id!=4 && currentBook.id!=4" ng-repeat="other in otherBooks"' +
                        ' ng-click="goToBook(other.id)"' +
                        ' class="toolbarButton"' +
                        ' style="margin-left:0">\n' +
                        '<img src="icon/{{other.title.toLowerCase()}}.png" />\n' +
                        
                        '\t\t\t<button ng-if="checkTranscript()"' + 
                        ' ng-click="loadSource()"' +
                        ' class="toolbarButton"' +
                        ' style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/transcript_icons.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button ng-if="checkVideoTranscript()"' + 
                        ' ng-click="loadSource()"' +
                        ' class="toolbarButton"' +
                        ' style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/video_transcripts.png" />\n' +
                        '\t\t\t</button>\n' +
                        
                        '\t\t\t</button>\n' +
                        '\t\t\t<button ng-click="goToPage(\'book\')" class="toolbarButton">\n' +
                        '\t\t\t\t<img  src="icon/home_icons.png" />\n' +
                        //'\t\t\t\t<img ng-if="currentBook.id==4" style="width:130px;"  src="icon/search_icons.png" />\n' +
                        '\t\t\t</button>\n' +
                        //'\t\t\t<button ng-if="currentBook.id==4" ng-click="goToPage(\'book\')" class="toolbarButton">\n' +
                        //'\t\t\t\t<img  src="icon/home_icons.png" />\n' +
                        //'\t\t\t\t<img src="icon/search_icons.png" />\n' +
                        //'\t\t\t</button>\n' +
                        '\t\t\t<button ng-if="currentBook.id!=8 && currentBook.id!=5 && currentBook.id!=6" class="toolbarButton" id="prev">\n' +
                        '\t\t\t\t<img src="icon/l_icons.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button ng-if= "currentBook.id==6"' +
                        ' ng-click="goToVideoTranscript()"' +
                        ' class="toolbarButton"' +
                        ' style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/video_transcripts.png" />\n' +
                        '\t\t\t</button>\n' +
                        
                        '\t\t\t<button ng-if="currentBook.id==6 && pageId%2 == 0" class="toolbarButton" ng-click="goToPage(\'prev\')">\n' +
                        '\t\t\t\t<img src="icon/l_icons.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button ng-if="currentBook.id!=8 && currentBook.id!=5 && currentBook.id!=6" class="toolbarButton" id="next" style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/r_icons.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button ng-if="currentBook.id==6 && pageId%2 != 0" class="toolbarButton" ng-click="goToPage(\'next\')" style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/r_icons.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t</div>\n' +
                        '</div>\n' +
                        '<div id="canvasContainer" style="position:absolute;overflow-y: auto;display: none;">' +
                        '<div id="curtineContainer" ng-show="zoomWindow.curtineMode"></div>' +
                        '<canvas id="canvasDrawer" ng-show="zoomWindow.drawingMode"></canvas>\n' +
                        '<canvas id="draftDrawer" ng-show="zoomWindow.drawingMode"></canvas>\n' +
                        '</div>' +
                        '<div class="zoomContainer" ng-if="zoomWindow.opened" style="background: white;">\n' +
                        '<div class="scrollElement" style="position: absolute;width: 100%;height:100%;top:0;left:0%;z-index:1"></div>'+
                        '<div class="zoomPersonal" ng-show="zoomWindow.personalQuestion"><div' +
                        ' class="zoomAnswer"><div class="closeButton" ng-click="closeAnswer()">X</div><span' +
                        ' ng-bind-html="zoomWindow.personalAnswer"></span>' +
                        '</div></div>' +
                        ' <div id="zoomBox" ng-show="!zoomWindow.personalQuestion" class="zoomBox dragscroll"' +
                        ' style="top:{{zoomWindow.containerTop}}px;width:{{zoomWindow.width}}px;height:' +
                        ' {{zoomWindow.height}}px;transform: scale({{zoomWindow.scale}});overflow-y: {{zoomWindow.overflowY}}">\n' +
                        '\t<div id="imgContainer" style="overflow:hidden;height: {{zoomWindow.imgDivHeight}}"><img src="{{zoomWindow.url}}"' +
                        ' style="width:461px;height:600px;position:' +
                        ' relative;left:' +
                        ' {{zoomWindow.left}}px;top:{{zoomWindow.top}}px"/></div>\n' +
                        '<img src="icon/{{icon.path}}"' +
                        ' style="top:{{icon.top}}px;left:{{icon.left}}px;width:{{icon.width}}px;height:{{icon.height}}px;position: absolute;"' +
                        ' ng-repeat="icon in currentPath.icons"/>' +
                        '<div ng-if="answer.area" class="answerArea" ng-click="answerAction(answer)"' +
                        ' style="top:{{(answer.draggable) ? answer.area.top-5 : answer.area.top}}px;left:{{answer.area.left}}px;width:' +
                        '{{answer.area.width}}px;height:{{answer.area.height}}px;" ng-repeat="answer in currentAnswers"	> ' +
                        '<div class="info" ng-if="answer.showed && (answer.underline||answer.hoverText)" ng-click="showUnderline(answer)">i</div>' +
                        '<div ng-if="answer.hoverText" ng-show="answer.hoverShow" class="hoverText"' +
                        ' style="top:{{answer.hoverPos.top}}px;width:{{answer.hoverPos.width}}px;left:{{answer.hoverPos.left}}px">{{answer.hoverText}}</div>' +
                        '</div>' +
                        '<div ng-if="answer.draggable" draggable-item draggable="false" class="answerArea notDraggable"' +
                        ' style="top:{{answer.draggable.top}}px;left:{{answer.draggable.left}}px;width:' +
                        '{{answer.draggable.width}}px;height:{{answer.draggable.height}}px;" ng-repeat="answer in currentAnswers"	>' +
                        '<span style="display:none;">{{answer.draggable.text}}</span>' +
                        '<div class="foundSolution" ng-show="answer.foundSolution"></div>' +
                        '</div>' +
                        
                        ///***************************Answer Area**************************************///
                        /*old code snippets below for reference when needed****************************///
                        //'style="top:{{answer.top}}px;left:{{answer.left}}px;width: {{answer.width}}px;height:{{answer.height? answer.height :12}}px; transform:rotate({{answer.rotate ? answer.rotate : 0}}deg);"' +
                        //hardcoded answer height
                        //'style="top:{{answer.top}}px;left:{{answer.left}}px;width: {{answer.width}}px;height: 15px; transform:rotate({{answer.rotate ? answer.rotate : 0}}deg);"' +
                        //'style="top:{{answer.top}}px;left:{{answer.left}}px;width: {{answer.width}}px;height: {{(answer.type==\'multiple\') ? 5px:(answer.height? answer.height:15px)}}; transform:rotate({{answer.rotate ? answer.rotate : 0}}deg);"' +
                        //'<span ng-if="answer.draggable" class="textAnswerHigh" ng-if="answer.text" style="line-height:15px;">{{answer.text}}</span>' +
                        //'<span ng-if="!answer.draggable" class="textAnswer" ng-if="answer.text" style="line-height:15px;">{{answer.text}}</span>' +
                        //'<span class="textAnswer" ng-if="answer.text" style="top:{{answer.multiline ? (-5):-3}}px; line-height:{{answer.height}}px;">{{answer.text}}</span>' +
                        //'style="top:{{answer.top}}px;left:{{answer.left}}px;width: {{answer.width}}px;height: {{(answer.multiline) ? 25:((answer.type == \'multiple\') ? 9:(answer.height? answer.height:15))}}px; transform:rotate({{answer.rotate ? answer.rotate : 0}}deg);"' +
                        //******************************************************************************//





                        '<div class="answerArea {{answer.type}}" ng-click="answerAction(answer)"' +
                        'ng-if="currentAnswers[$index].type !== \'audio\' && currentAnswers[$index].type !== \'personal\'"' +
                        ' ng-repeat="answer in currentAnswers"' +
                        //'style="top:{{((answer.type == \'multiple\') ? answer.top:answer.top-4)}}px;left:{{answer.left}}px;width: {{answer.width}}px;height: {{(answer.multiline) ? 25:((answer.type == \'multiple\') ? 9:12)}}px; transform:rotate({{answer.rotate ? answer.rotate : 0}}deg);"' +
                        'style="top:{{((answer.type == \'multiple\') ? answer.top:((answer.draggable) ? answer.top-10 : answer.top-4))}}px;left:{{answer.left}}px;width: {{answer.width}}px;height: {{(answer.multiline) ? 25:((answer.type == \'multiple\') ? (answer.height ? answer.height : 9):12)}}px; transform:rotate({{answer.rotate ? answer.rotate : 0}}deg);"' +
						' ng-class="{\'selected\': answer.showed, \'dragContainer\': answer.draggable}">' +
                        //'<span class="textAnswer" ng-if="answer.text" style="top: 2px; line-height:{{answer.height}}px;">{{answer.text}}</span>' +
                       '<span class="textAnswer" ng-if="answer.text && !answer.draggable" style="top: {{answer.textTopOverride ? answer.textTopOverride : 2}}px; left: {{answer.textLeftOverride ? answer.textLeftOverride : 0}}px;  line-height:{{answer.height}}px; direction: {{answer.textDirection ? answer.textDirection: ltr}}; unicode-bidi: bidi-override;">{{answer.text}} </span>' +
                       '<span class="textAnswer" ng-if="answer.text && answer.draggable" style="top: {{answer.textTopOverride ? answer.textTopOverride : 7}}px; line-height:{{answer.height}}px;">{{answer.text}}</span>' +
					   '<span ng-if="answer.type == \'personalButton\'">Answer</span>' +
                        '</div>' +
                        ' </div>\n' +
						
                        '<div ng-if="currentPath.zoom.answers[0].paths[0].type === \'audio\'" class="audioFile" aplayer' +
                        ' audobj="currentPath.zoom.answers[0].paths[0].url"></div>' +	
						
                        '<div ng-if="currentPath.zoom.answers[0].paths[0].type === \'audio2\'" class="audioFile" aplayer' +
                        ' audobj="currentPath.zoom.answers[0].paths[0].url"></div>' +		

                        ' <div class="flip-control">\n' +
                        '\t\t\t<button ng-if= "!other.disabled && other.id!=4 && currentBook.id!=8" ng-show="!zoomWindow.drawingMode && !zoomWindow.personalQuestion"  ng-repeat="other in otherBooks"' +
                        ' ng-click="goToBook(other.id)"' +
                        ' class="toolbarButton"' +
                        ' style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/{{other.title.toLowerCase()}}.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button ng-if= "currentPath.transcript"' +
                        ' ng-click="(currentBook.id == 1) ? goToTranscript(currentPath.transcriptID):goToTranscriptSource(currentPath)"' +
                        ' class="toolbarButton"' +
                        ' style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/transcript_icons.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button ng-show="!zoomWindow.personalQuestion" class="toolbarButton" id="paintTool" ng-click="startPainting()" style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/pen_icons.png" />\n' +
                        '\t\t\t<button ng-show="!zoomWindow.drawingMode" ng-click="goToPage(\'book\')" class="toolbarButton">\n' +
                        '\t\t\t\t<img src="icon/home_icons.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button ng-show="!zoomWindow.drawingMode" ng-click="closeZoom()" id="reload" class="toolbarButton">\n' +
                        '\t\t\t\t<img src="icon/reload_icons.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button ng-show="!zoomWindow.drawingMode && !zoomWindow.personalQuestion" class="toolbarButton" ng-click="nextPath(-1)" id="prevZoom">\n' +
                        '\t\t\t\t<img src="icon/l_icons.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button ng-show="!zoomWindow.drawingMode && !zoomWindow.personalQuestion" class="toolbarButton" ng-click="nextPath(1)" id="nextZoom"' +
                        ' style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/r_icons.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button ng-show="!zoomWindow.drawingMode && !zoomWindow.personalQuestion" class="toolbarButton" ng-click="showAll()" id="checkAnswers"' +
                        ' style="margin-left:100px;">\n' +
                        '\t\t\t\t<img src="icon/check_icons.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button ng-show="!zoomWindow.drawingMode && !zoomWindow.personalQuestion	" class="toolbarButton" ng-click="hideAll()" id="removeAnswers"' +
                        ' style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/power_icons.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\n' +
                        '<div class="paintContainer" ng-show="zoomWindow.drawingMode">' +
                        '<div ng-click="changeColor(color)" ng-repeat="color in colors" style="background: {{color}}" class="paintColors"></div>' +
                        '<span class="brushContainer">Brush Size: <select id="sizePaint"><option value="small">Small</option><option' +
                        ' value="normal">Normal</option><option' +
                        ' value="large">Large</option><option' +
                        ' value="huge">Huge</option></select></span>' +
                        '\t\t\t<button class="toolbarButton" ng-show="zoomWindow.drawingMode"  ng-click="changeTool(\'eraser\')" style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/eraser.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button class="toolbarButton" ng-show="zoomWindow.drawingMode"  ng-click="changeTool(\'pencil\')" style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/pencil.png" />\n' +
                        '\t\t\t<button class="toolbarButton" ng-show="zoomWindow.drawingMode"  ng-click="changeTool(\'marker\')"' +
                        ' style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/marker.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button class="toolbarButton" ng-show="zoomWindow.drawingMode"  ng-click="changeTool(\'rect\')"' +
                        ' style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/rect.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button class="toolbarButton" ng-show="zoomWindow.drawingMode"  ng-click="changeTool(\'rect\', true)"' +
                        ' style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/rect-border.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button class="toolbarButton" ng-show="zoomWindow.drawingMode"  ng-click="toggleCurtine()"' +
                        ' style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/curtine.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button class="toolbarButton" ng-show="zoomWindow.drawingMode"  ng-click="changeTool(\'text\')"' +
                        ' style="margin-left:0">\n' +
                        '\t\t\t\t<img src="icon/textarea.png" />\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button class="" ng-show="zoomWindow.drawingMode"  ng-click="clearAllDrawing()"' +
                        ' style="margin-left:0;top: -9px;\n' +
                        '    position: relative;">\n' +
                        '\t\t\t\tClear All\n' +
                        '\t\t\t</button>\n' +
                        '\t\t\t<button style="top: -9px;\n' +
                        '    position: relative;" ng-show="zoomWindow.drawingMode"  ng-click="undoPaint()"' +
                        ' style="margin-left:0">\n' +
                        '\t\t\t\tUndo\n' +
                        '\t\t\t</button>\n' +
                        '</div>' +
                        ' </div>\n' +
						'</div>',
                    controller: "UnitCtrl"
                })
            }
        ]);
})();
