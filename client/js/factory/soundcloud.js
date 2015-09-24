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
			muted: false,
			playing: false
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
			//Stop current sound and destroy
			if (soundManager.getSoundById("current")) {
				soundManager.stopAll();
				soundManager.destroySound("current");
			};
			//Create and play sound
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
					$(".volume-progress").progress({
						autoSuccess: false
					})
				},
				whileplaying: function(){
					//Update progress bar (uses width to preserve .active effect on progress bar)
					$(".playing-progress .bar").width(this.position/this.duration*100 + "%");
				}
			});
			this.current.playing = true;
		},
		//Playback (pause and play)
		pauseToggle: function(){
			this.current.sound.togglePause();
			if (this.current.sound.paused) {
				this.current.playing = false;
			} else {
				this.current.playing = true;
			};
		},
		//Volume Control
		volumeDelta: function(delta){
			if (this.current.muted) {this.volumeMute()};
			this.current.volume = (delta == "up") ? Math.min(100, this.current.volume+6) : Math.max(10, this.current.volume-6);
			this.current.sound.setVolume(this.current.volume);
			$(".volume-progress").progress({
				autoSuccess: false,
				value: this.current.volume
			});
		},
		volumeMute: function(){
			this.current.muted = !this.current.muted;
			this.current.sound.toggleMute();
		},
		//Tracking Control
		positionDelta: function(delta){
			//10 second increments
			this.current.sound.setPosition((delta == "forward") ? 
				Math.min(this.current.sound.duration, this.current.sound.position+10000) : 
				Math.max(0, this.current.sound.position-10000)
			);
		}
	};

	//Static Methods
	// Soundcloud.method = function(){};

	return Soundcloud;
}]);