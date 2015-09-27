gruveone.controller("appController", ["$scope", "$meteor", "Entry", "Menu","Soundcloud",
	function($scope, $meteor, Entry, Menu, Soundcloud){
		var scope = $scope;
		//Soundcloud
		scope.soundcloud = new Soundcloud;
		var soundcloud = scope.soundcloud;

		//Show entry modal to force loading
		var entry = new Entry;
		
		//Event listeners to load playlist for selected user
		entry.buttons.on("click", function(e){
			console.log("event", e.target.dataset.user);
			entry.enter(e.target.dataset.user)
				.then(function(p){
					scope.playlists = {
						all: p,
						selected: null,
						select: function(index){
							this.selected = soundcloud.processPlaylist(this.all[index]);
						}
					};
					entry.hide();
					console.log("playlists:", scope.playlists);
					scope.entered = true;
				});
		});
		////

		//For opening sidebar, controlling actions
		scope.menu = new Menu;

		//Events
		scope.selectPlaylist = function(index){
			scope.playlists.select(index);
			// console.log(scope.playlists);
			scope.menu.playlistSidebar();
		};
		scope.selectTrack = function(index){
			//Get Track
			var track = scope.playlists.selected.tracks[index];
			// console.log(scope.track);
			//Create sound and play, manual selection
			soundcloud.selectTrack(track, scope.playlists.selected);
		};
		scope.changeVolume = function(delta){
			switch (delta) {
				case "mute":
					soundcloud.volumeMute();
					break;
				default:
					soundcloud.volumeDelta(delta);
			};
		};
		scope.changePosition = function(delta){
			soundcloud.positionDelta(delta);
		};
		//
		scope.togglePause = function(){
			soundcloud.pauseToggle();
		};
		scope.toggleStop = function(){
			soundcloud.stopToggle();
		};
		//
		scope.previousTrack = function(){
			soundcloud.trackDelta("backward");
		};
		scope.nextTrack = function(){
			soundcloud.trackDelta("forward");
		};
		//
		scope.togglePlayback = function(){
			soundcloud.playbackTypeToggle();
		};
	}
]);