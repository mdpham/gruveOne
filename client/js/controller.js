gruveone.controller("appController", ["$scope", "$meteor", "Entry", "Menu","Soundcloud",
	function($scope, $meteor, Entry, Menu, Soundcloud){
		var scope = $scope;
		var soundcloud = new Soundcloud;
		//Show entry modal to force loading
		var entry = new Entry;
		//Load playlists on "Enter" button click
		entry.phamartinButton.on("click", function(){
			entry.enter("phamartin")
				.then(function(p){
					scope.playlists = {
						all: p,
						selected: null,
						select: function(index){
							this.selected = this.all[index];
						},
						selectMessage: "Select a Playlist"
					};
					entry.hide();
					console.log("playlists:", scope.playlists);
					scope.entered = true;
				});
		});
		entry.pigeonsAndPlanesButton.on("click", function(){
			entry.enter("pigeonsandplanes")
			// entry.enter("flashplayer1")
				.then(function(p){
					scope.playlists = {
						all: p,
						selected: null,
						select: function(index){
							this.selected = soundcloud.processPlaylist(this.all[index]);
						},
						selectMessage: "Select a Playlist"
					};
					entry.hide();
					console.log("playlists:", scope.playlists);
					scope.entered = true;
				});
		});
		entry.pigeonsAndPlanesButton.click();
		////

		//For opening sidebar, controlling actions
		scope.menu = new Menu;

		scope.selectPlaylist = function(index){
			scope.playlists.select(index);
			console.log(scope.playlists.selected);
			scope.menu.playlistSidebar();
		};
		scope.selectTrack = function(index){
			//Get Track
			scope.track = scope.playlists.selected.tracks[index];
			console.log(scope.track);
			//Activate loader on artwork image
			scope.menu.artworkLoading(scope.track.id, "show");
			//Create sound and play
			soundcloud.playTrack(scope.track);
		};
	}
]);