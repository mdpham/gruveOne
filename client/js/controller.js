gruveone.controller("appController", ["$scope", "$meteor", "Entry",
	function($scope, $meteor, Entry){
		var scope = $scope;

		//Show entry modal to force loading
		var entry = new Entry;
		//Load playlists on "Enter" button click
		entry.button.on("click", function(){
			entry.enter()
				.then(function(p){
					scope.playlists = p;
					entry.hide();
					console.log("playlists:", scope.playlists);
				});
		});
		////

		scope.toggle = function(){
			$(".ui.sidebar").sidebar("toggle");
		};
	}
]);