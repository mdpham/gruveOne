gruveone.controller("appController", ["$scope", "$meteor", "Soundcloud", "Entry",
	function($scope, $meteor, Soundcloud, Entry){
		var scope = $scope;
		//Show entry modal to force loading
		var entry = new Entry;
		$(".entry.button").on("click", function(){
			entry.enter()
				.then(function(p){
					scope.playlists = p;
				})
				.then(function(){
					console.log(scope.playlists);
					entry.close();
				});
		})

	}
]);