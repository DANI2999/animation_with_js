/**
 * main.js
 */
 var injector;
 (function () {
   "use strict";
 
   angular
     .module("floatingBubblesEx", ["ngAnimate", "ngRoute"])
     .config([
       "$routeProvider",
       "$compileProvider",
       function ($routeProvider, $compileProvider) {
         $routeProvider
           .when("/", {}) /* Default route redirect */
           .otherwise({
             redirectTo: "/"
           });
         $compileProvider.debugInfoEnabled(false); /* $compileProvider options */
       }
     ])
     /* The main controller to start up the load animation */
     .controller("mainCtrl", [
       "$scope",
       function ($scope) {
         var vm = this;
       }
     ])
     /* Just a utility function to shuffle arrays */
     .factory("shuffle", function () {
       return function (array) {
         return array
           .map(function (n) {
             return [Math.random(), n];
           })
           .sort()
           .map(function (n) {
             return n[1];
           });
       };
     })
     /* See https://greensock.com/forums/topic/10051-animations-pause-when-browser-tab-is-not-visible/ */
     .factory("hasFocus", function () {
       var stateKey,
         eventKey,
         keys = {
           hidden: "visibilitychange",
           webkitHidden: "webkitvisibilitychange",
           mozHidden: "mozvisibilitychange",
           msHidden: "msvisibilitychange"
         };
       for (stateKey in keys) {
         if (stateKey in document) {
           eventKey = keys[stateKey];
           break;
         }
       }
       return function (c) {
         if (c) document.addEventListener(eventKey, c);
         return !document[stateKey];
       };
     })
     /**
      * bubbles START
      */
     /* bubbles: The bubbles controller */
     .controller("bubblesCtrl", [
       "$element",
       "hasFocus",
       function ($el, hasFocus) {
         var me = this;
         me.paused = true;
         me.initBubble = function (bubbleConfig) {
           /* Initialize both the foreground and background bubbles size, speed, start time, and x position */
           if (!me.paused && !me.hightide && hasFocus()) {
             /* Float bubbles as long as it's not hightide, paused or in a different browser tab */
             var h = Math.floor(
                 Math.random() * bubbleConfig.backgroundBubbles.length
               ),
               i = Math.floor(Math.random() * bubbleConfig.bubbles.length),
               s = Math.floor(
                 Math.random() *
                   (bubbleConfig.bubbleSizeMax - bubbleConfig.bubbleSizeMin) +
                   bubbleConfig.bubbleSizeMin
               );
             if (!bubbleConfig.bubbles[i].float) {
               bubbleConfig.bubbles[
                 i
               ].float = true; /* This drives the ng-class, which, in turn, drives the animation */
               bubbleConfig.bubbles[i].floatTime = Math.floor(
                 Math.random() *
                   (bubbleConfig.floatTimeMax - bubbleConfig.floatTimeMin) +
                   bubbleConfig.floatTimeMin
               );
               bubbleConfig.bubbles[i].bubbleSize = s;
               bubbleConfig.bubbles[i].timeBetween =
                 Math.random() *
                   (bubbleConfig.timeBetweenMax - bubbleConfig.timeBetweenMin) +
                 bubbleConfig.timeBetweenMin;
               bubbleConfig.bubbles[i].x = Math.floor(
                 Math.random() * ($el.width() - s - s) + s
               );
             }
             if (!bubbleConfig.backgroundBubbles[h].float) {
               bubbleConfig.backgroundBubbles[
                 h
               ].float = true; /* This drives the ng-class, which, in turn, drives the animation */
               bubbleConfig.backgroundBubbles[h].floatTime = Math.floor(
                 Math.random() * (6 - 4) + 4
               );
               bubbleConfig.backgroundBubbles[h].bubbleSize = Math.floor(
                 Math.random() * (30 - 10) + 10
               );
               bubbleConfig.backgroundBubbles[h].timeBetween =
                 Math.random() *
                   (bubbleConfig.timeBetweenMax - bubbleConfig.timeBetweenMin) +
                 bubbleConfig.timeBetweenMin;
               bubbleConfig.backgroundBubbles[h].x = Math.floor(
                 Math.random() * $el.width()
               );
             }
           }
         };
         me.tide = function () {
           /* This drives the ng-class, which, in turn, drives the animation */
           me.hightide = !me.hightide;
         };
         me.pause = function (pause) {
           me.paused = pause;
         };
         me.togglePause = function () {
           me.pause(!me.paused);
         };
       }
     ])
     /* bubbles: The bubbles directive */
     .directive("bubbles", [
       "$interval",
       "$timeout",
       function ($interval, $timeout) {
         return {
           restrict: "E",
           scope: {
             bubblesConfigDefault: "=",
             vm: "="
           },
           controller: "bubblesCtrl",
           controllerAs: "bvm",
           template:
             "<div ng-repeat='bubble in bubblesConfig.bubbles' class='bubble' ng-model='bubble' ng-class='{ float: bubble.float }' style='height: {{ ::bubble.bubbleSize }}px; width: {{ ::bubble.bubbleSize }}px; background-image: url({{ ::bubble.logo }})'><div class='bubble-fill'></div></div><div ng-repeat='bubble in bubblesConfig.backgroundBubbles' ng-model='bubble' class='background-bubble' ng-class='{ float: bubble.float }' style='height: {{ ::bubble.bubbleSize }}px; width: {{ ::bubble.bubbleSize }}px;'></div><div class='btn btn-list' ng-click='bvm.tide()'><i class='fa fa-list-ul'></i></div><div class='waves' ng-class='{ hightide: bvm.hightide }'><div class='wave wave-one'></div><div class='wave wave-two'></div><div class='wave wave-three'></div><div class='water'><ul><li ng-repeat='bubble in bubblesConfig.bubbles' style='background-image: url({{ ::bubble.logo }});'>{{ ::bubble.title }}</li></ul></div>",
           link: function ($scope, $el, $attrs) {
             $scope.bubblesConfig = angular.extend(
               {},
               $scope.bubblesConfigDefault
             );
             $scope.bubblesConfig.backgroundBubbles = Object.keys(
               new Int8Array($scope.bubblesConfig.numBackgroundBubbles)
             ).map(function (o) {
               /* Create an array of background bubbles based on an integer value */ return {};
             });
             $interval(function () {
               /* Start the floating bubbles */ $scope.bvm.initBubble(
                 $scope.bubblesConfig
               );
             }, $scope.bubblesConfig.bubbleFrequency);
             $timeout(function () {
               $scope.vm.start = true;
             }, 1);
           }
         };
       }
     ])
     /* bubbles: Using the animation function to pause/unpause the animation based on the is-visible class being removed/added? */
     .animation(".bubbles", function () {
       return {
         addClass: function (element, className, done) {
           if (className === "start") {
             var bvm = element.data().$bubblesController;
             bvm.pause(false);
           }
         },
         removeClass: function (element, className, done) {
           if (className === "start") {
             var bvm = element.data().$bubblesController;
             bvm.pause(true);
           }
         }
       };
     })
     /* bubbles: Animation for an individual bubble being asked to float */
     .animation(".bubble", [
       "$timeout",
       function ($timeout) {
         return {
           addClass: function (element, className, done) {
             if (className === "float") {
               var model = element.data().$ngModelController.$modelValue;
               var bb = element.parent()[0].getBoundingClientRect();
               var path = [
                 {
                   x: model.x,
                   y:
                     Math.random() * (model.bubbleSize - model.bubbleSize) +
                     model.bubbleSize
                 }
               ];
               var tl = new TimelineMax({
                 delay: model.timeBetween
               });
               tl.clear()
                 .set(element, {
                   x: model.x,
                   y: bb.height,
                   xPercent: -50,
                   yPercent: -50
                 })
                 .fromTo(
                   element,
                   0.75,
                   {
                     scale: 0,
                     opacity: 0,
                     z: 0.1
                   },
                   {
                     scale: 1,
                     opacity: 1,
                     ease: Back.easeOut
                   }
                 )
                 .to(element, model.floatTime, {
                   bezier: path,
                   ease: Power2.easeInOut
                 })
                 .to(element, 0.1, {
                   scale: 2,
                   opacity: 0,
                   ease: Ease.EaseOut,
                   onComplete: function () {
                     $timeout(function () {
                       /* Yep, a hack */ model.float = false;
                       done();
                     }, 1);
                   }
                 });
             }
           }
         };
       }
     ])
     /* bubbles: Animation for a background bubble being asked to float */
     .animation(".background-bubble", [
       "$timeout",
       function ($timeout) {
         return {
           addClass: function (element, className, done) {
             if (className === "float") {
               var model = element.data().$ngModelController.$modelValue;
               var bb = element.parent()[0].getBoundingClientRect();
               var path = [
                 {
                   x: model.x,
                   y: model.bubbleSize * -1
                 }
               ];
               TweenLite.set(element, {
                 x: model.x,
                 y: bb.height,
                 xPercent: -50,
                 yPercent: -50
               });
               TweenMax.to(element, model.floatTime, {
                 delay: model.timeBetween,
                 bezier: path,
                 z: 0.1,
                 ease: Power3.easeIn,
                 onComplete: function () {
                   $timeout(function () {
                     /* Yep, a hack */ model.float = false;
                     done();
                   }, 1);
                 }
               });
             }
           }
         };
       }
     ])
     /* bubbles: Animation for the tide rising/falling */
     .animation(".waves", function () {
       var tl = new TimelineMax();
       return {
         addClass: function (element, className, done) {
           if (className === "hightide") {
             var bvm = element.parent().data().$bubblesController;
             bvm.pause(true);
             tl.clear()
               .staggerTo(
                 element.find(".wave"),
                 2,
                 {
                   bottom: element.parent().height() - element.height(),
                   z: 0.1,
                   ease: Ease.easeOut
                 },
                 0.04
               )
               .to(
                 element.find(".water"),
                 2,
                 {
                   height: element.parent().height() - element.height(),
                   ease: Ease.easeOut
                 },
                 0.04
               )
               .staggerFromTo(
                 element.find("li"),
                 0.5,
                 {
                   opacity: 0,
                   right: "+=20"
                 },
                 {
                   opacity: 1,
                   right: 10,
                   ease: Ease.easeOut,
                   onComplete: done
                 },
                 0.05
               );
           }
         },
         removeClass: function (element, className, done) {
           if (className === "hightide") {
             var bvm = element.parent().data().$bubblesController;
             bvm.pause(false);
             tl.clear()
               .to(
                 element.find("li"),
                 0.5,
                 {
                   opacity: 0,
                   ease: Ease.easeOut
                 },
                 0.05
               )
               .to(element.find(".water"), 2, {
                 height: 0,
                 ease: Ease.easeOut
               })
               .staggerTo(
                 element.find(".wave"),
                 2,
                 {
                   bottom: 0,
                   ease: Ease.easeOut,
                   onComplete: done
                 },
                 -0.04,
                 "-=2"
               );
           }
         }
       };
     });
   /**
    * bubbles END
    */
   injector = angular.bootstrap(document, [
     "floatingBubblesEx"
   ]); /* I do this out of habit in case I need it */
 })();
 