angular.module('archer').directive("draggableItem", function ($timeout) {
	return {
		link: function (scope, elem, attr) {
			var dragItem = elem[0];
			var container = document.querySelector("#zoomBox");

			var active = false;
			var currentX;
			var currentY;
			var initialX;
			var initialY;
			var xOffset = 0;
			var yOffset = 0;
			var clondedElement = null;
			container.addEventListener("touchstart", dragStart, false);
			container.addEventListener("touchend", dragEnd, false);
			container.addEventListener("touchmove", drag, false);

			container.addEventListener("click", dragStart, false);

			container.addEventListener("mousemove", drag, false);

			function dragStart(e) {

				if (e.type === "touchstart") {
					initialX = e.touches[0].clientX - xOffset;
					initialY = e.touches[0].clientY - yOffset;
				} else {
					initialX = e.clientX - elem[0].getBoundingClientRect().left;
					initialY = e.clientY - elem[0].getBoundingClientRect().top;
				}

				if (e.target === dragItem) {
					active = true;
					clondedElement = $(elem).clone();
					$(".zoomContainer").append(clondedElement);
					clondedElement.css("top", elem[0].getBoundingClientRect().top);
					clondedElement.css("left", elem[0].getBoundingClientRect().left);
					clondedElement.height(elem[0].getBoundingClientRect().height);
					clondedElement.width(elem[0].getBoundingClientRect().width);
					clondedElement.addClass("draggable");
					clondedElement[0].addEventListener("click", dragEnd, false);
				}
			}

			function dragEnd(e) {
				initialX = currentX;
				initialY = currentY;
				active = false;
				clondedElement[0].removeEventListener("mouseup", dragEnd, false);
				let currentAnswers = angular.element(clondedElement[0]).scope().$parent.currentAnswers;
				let dragContainers = $("#zoomBox").find(".dragContainer");
				let solved = false;
				_.each(dragContainers, function (container) {
					let topContainer = container.getBoundingClientRect().top;
					let leftContainer = container.getBoundingClientRect().left;
					let heightContainer = container.getBoundingClientRect().height;
					let widthContainer = container.getBoundingClientRect().width;
					if (clondedElement.offset().top >= (topContainer-10) && clondedElement.offset().top <= (topContainer + heightContainer+10)) {
						if (clondedElement.offset().left >= (leftContainer-4) && clondedElement.offset().left <= (leftContainer + widthContainer+10)) {
							var answer = angular.element(container).scope().$parent.answer;
							if (answer.draggable.left === parseInt($(elem).css("left")) && answer.draggable.top === parseInt($(elem).css("top"))) {
								$timeout(function () {
									answer.showed = true;
									solved = true;
									answer.foundSolution = true;
									//$(dragItem).find(".foundSolution").show();
								});
							}
						}
					}
				});
				$timeout(function () {
					if (solved) {
						var audio = new Audio('songs/effect/yes-sound.mp3');
						audio.play();
					} else {
						var audio = new Audio('songs/effect/no-sound.mp3');
						audio.play();
					}
				},10);
				clondedElement.remove();
			}

			function drag(e) {
				if (active) {

					e.preventDefault();

					if (e.type === "touchmove") {
						currentX = e.touches[0].clientX - initialX;
						currentY = e.touches[0].clientY - initialY;
					} else {
						currentX = e.clientX - initialX;
						currentY = e.clientY - initialY;
					}

					xOffset = currentX;
					yOffset = currentY;

					setTranslate(currentX, currentY, clondedElement);
				}
			}

			function setTranslate(xPos, yPos, el) {
				$(el).css("top", yPos);
				$(el).css("left", xPos);
			}
		}
	};
});