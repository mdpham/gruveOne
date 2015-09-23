gruveone.factory("Soundcloud", ["$q", function($q){
	var config = {
		// username: "phamartin",
		username:"pigeonsandplanes",
		soundcloudClientID: "22785cfd8862a0f03c3402a8a42316aa"
	};

	//Constructor
	function Soundcloud() {
		SC.initialize({
			//Need to figure this out
			client_id: config.soundcloudClientID,
			redirect_uri: ""
		});

		soundManager.setup({
			url: "",
			flashVersion: 9
		});

		//Current sound
		this.current = {
			sound: null,
			volume: 10,
		}
	};

	//Instance Methods (access to 'this')
	Soundcloud.prototype = {
		getPlaylists: function(account){
			var deferred = $q.defer();
			//Resolve url with username
			SC.get("http://api.soundcloud.com/resolve.json?url=http://soundcloud.com/"+account+"&client_id="+config.soundcloudClientID,
			function(user){
				//Get user
				SC.get("http://api.soundcloud.com/users/"+user.id+"/playlists?client_id="+config.soundcloudClientID,
				function(data){
					deferred.resolve(data);
				})
			});
			return deferred.promise;
		},
		processPlaylist: function(playlist){
			//Hi resolution artwork
			_.each(playlist.tracks, function(track){
				track.processed = {};
				track.processed.artwork_url = track.artwork_url ? track.artwork_url.replace("large", "t500x500") : (track.user.avatar_url ? track.user.avatar_url.replace("large", "t500x500") : "");
			});
			return playlist;
		},
		playTrack: function(track){
			//Create new current sound
			console.log("play track", soundManager.canPlayURL(track.uri), track.stream_url);
			// if (soundManager.canPlayURL(track.stream_url)) {
				//Stop current sound and destroy
				if (soundManager.getSoundById("current")) {
					soundManager.stopAll();
					soundManager.destroySound("current");
				};
				//Create and play
				console.log("can play");
				this.current.sound = soundManager.createSound({
					id: "current",
					url: track.stream_url + "?client_id="+config.soundcloudClientID,
					autoPlay: true,
					volume: this.current.volume, //50
					whileloading: function(){
						//Loading progress bar attached to top of artwork
						$(".loading-progress").progress({
							autoSuccess: false,
							value: this.bytesLoaded / this.bytesTotal * 100
						});
					},
					onload: function(){
						//Playing progress bar attached to bottom of artwork
						$(".playing-progress").progress({
							autoSuccess: false
						});
						$(".playing-progress .bar").width(0);
					},
					whileplaying: function(){
						//Update progress bar (uses width to preserve .active effect on progress bar)
						$(".playing-progress .bar").width(this.position/this.duration*100 + "%");
					}
				});
			// }
		}
	};

	//Static Methods
	// Soundcloud.method = function(){};

	return Soundcloud;
}]);