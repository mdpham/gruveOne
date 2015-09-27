//Declare angulare module and dependencies
gruveone = angular.module("gruveone", ["angular-meteor"]);
gruveone.config(	function($interpolateProvider){
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
	})

//Bootstrap angular
function onReady(){angular.bootstrap(document, ["gruveone"]);};
if (Meteor.isCordova) {
	angular.element(document.on("deviceready", onReady));
} else {
	angular.element(document).ready(onReady);
};

//Hover directive for changing background colour in tracks
gruveone.directive('ngHover', function() {
	return {
		link: function(scope, element) {
			element.bind("mouseenter", function(){
				element.css({
					"cursor": "pointer",
					"background-color": randomColor({luminosity:"light"})
				});
				console.log("element", $(element).children(".image"));
				$(element).children(".image").css("visibility", "hidden");
			})
			element.bind("mouseleave", function(){
				element.css({
					"cursor": "auto",
					"background-color": "white"
				});
				$(element).children(".image").css("visibility", "visible");
			})
	    }
	}
});

//Background image directive
gruveone.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover'
            });
        });
    };
});