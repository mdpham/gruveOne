gruveone.controller("appController", ["$scope", "$meteor", "Entry", "Menu",
	function($scope, $meteor, Entry, Menu){
		var scope = $scope;

		//Show entry modal to force loading
		var entry = new Entry;
		//Load playlists on "Enter" button click
		entry.button.on("click", function(){
			entry.enter()
				.then(function(p){
					scope.playlists = {
						all: p,
						selected: null,
						select: function(index){
							this.selected = this.all[index];
						}
					};
					entry.hide();
					console.log("playlists:", scope.playlists);
					scope.entered = true;
				});
		});
		entry.button.click();
		////

		//For opening sidebar, controlling actions
		scope.menu = new Menu;

		scope.selectPlaylist = function(index){
			scope.playlists.select(index);
			console.log(scope.playlists.selected);
			scope.menu.playlistSidebar();
		}
	}
]);