//Declare angulare module and dependencies
gruveone = angular.module("gruveone", ["angular-meteor"]);

//Bootstrap angular
function onReady(){
	angular.bootstrap(document, ["gruveone"]);
};

//Platform
if (Meteor.isCordova) {
	angular.element(document.on("deviceready", onReady));
} else {
	angular.element(document).ready(onReady);
};

Meteor.startup(function(){

});