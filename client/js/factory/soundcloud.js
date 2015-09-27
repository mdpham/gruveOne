gruveone.factory("Soundcloud", ["$q", "$http", function($q, $http){
	var config = {
		// username: "phamartin",
		username:"pigeonsandplanes",
		soundcloudClientID: "22785cfd8862a0f03c3402a8a42316aa"
	};

	//Constructor
	function Soundcloud() {
		var sc = this;
		SC.initialize({
			//Need to figure this out
			client_id: config.soundcloudClientID,
			redirect_uri: ""
		});

		soundManager.setup({
			// Flash breaks position progress bar
			// preferFlash: true,
			// url: "/swf/",
			flashVersion: 9,
			ontimeout: function(){
				alert("soundManager2 just broke");
			},
			debugMode: false,
		});

		sc.playlists = null;
		//For scope and playing
		sc.current = {
			playlist: null,
			track: null,
			sound: null,
			volume: 52, //initial volume
			playing: false,
			playback: {
				index: null,
				type: "linear", //repeat or random
				history: [], //for random backwards playback
				randomIndex: null
			}
		}
	};

	//Instance Methods (access to 'this')
	Soundcloud.prototype = {
		getPlaylists: function(account){
			var sc = this;
			var deferred = $q.defer();
			//Resolve url with username
			SC.get("http://api.soundcloud.com/resolve.json?url=http://soundcloud.com/"+account+"&client_id="+config.soundcloudClientID,
			function(user){
				//Get user
				SC.get("http://api.soundcloud.com/users/"+user.id+"/playlists?client_id="+config.soundcloudClientID,
				function(data){
					// var processed = _.map(data, sc.processPlaylist);
					deferred.resolve(data);
					sc.playlists = data;
					// sc.playlists = processed;
					// deferred.resolve(processed);

				})
			});
			return deferred.promise;
		},
		processPlaylist: function(playlist){
			//Hi resolution artwork
			_.each(playlist.tracks, function(track){
				track.processed = {};
				track.processed.artwork_url = track.artwork_url ? track.artwork_url.replace("large", "t500x500") : (track.user.avatar_url ? track.user.avatar_url.replace("large", "t500x500") : "");
				track.processed.avatar_url = track.user.avatar_url.replace("large", "t500x500");
			});
			return playlist;
		},
		selectTrack: function(track, playlist){
			var sc = this;
			//Check if playing from new playlist
			if (!(sc.current.playlist == playlist)) {
				sc.current.playlist = sc.processPlaylist(playlist);
				//Reset random
				sc.current.playback.history = [track];
				sc.current.playback.randomIndex = 0;
			};
			//If random, add to history
			if (sc.current.playback.type == "random") {
				sc.current.playback.history.splice(sc.current.playback.randomIndex+1,0,track);
				sc.current.playback.randomIndex++;
			};
			sc.playTrack(track, playlist);
		},
		playTrack: function(track, playlist){
			var sc = this;
			var unmuteOnPlay = function(){if (sc.current.sound) {sc.current.sound.unmute()}};
			//Stop current sound and destroy
			if (sc.current.sound){sc.current.sound.destruct()};
			
			//Check if track is available to play, slows app
			$http.get(track.stream_url + "?client_id="+config.soundcloudClientID)
				.then(function(){
				//Success
					//Create and play sound
					sc.current.sound = soundManager.createSound({
						id: "current",
						url: track.stream_url + "?client_id="+config.soundcloudClientID,
						volume: sc.current.volume, //50
						whileloading: function(){
							//Loading progress bar attached to top of artwork
							$(".loading-progress").progress({
								autoSuccess: false,
								value: this.bytesLoaded / this.bytesTotal * 100
							});
						},
						onload: function(){
							//Update volume
							$(".volume-progress").progress({autoSuccess: false, value: sc.current.volume});
							//Playing progress bar attached to bottom of artwork
							$(".playing-progress").progress({autoSuccess: false});
							$(".playing-progress .bar").width(0);
							//Update artwork
							$(".artwork-image").fadeOut("fast", function(){
								// console.log("this", this);
								$(this).attr("src", track.processed.artwork_url);
								$(".artist-image").attr("src", track.processed.avatar_url);
								// console.log(track);
								$(this).fadeIn("fast");
							})
						},
						whileplaying: function(){
							//Update position progress bar (uses width to preserve .active effect on progress bar)
							$(".playing-progress .bar").width((10 + (90*this.position/this.duration))+"%");
						},
						onplay: function(){
							unmuteOnPlay();
							sc.current.sound.unmute();
							sc.current.playing = true;
						},
						onfinish: function(){
							$(".player-nextTrack").click();
						},
						ondataerror: function(){
							alert("There was an error getting the track data");
						}
					});
					//
					sc.current.track = track;
					sc.current.playback.index = _.indexOf(playlist.tracks, track);
					sc.current.sound.play();
				}, function(){
				//Failure
					alert("Failed to load track");
				})
		},
		//Playback (pause and play)
		pauseToggle: function(){
			this.current.sound.togglePause();
			if (this.current.sound.paused) {
				this.current.playing = false;
			} else {
				this.current.playing = true;
			};
			return this;
		},
		//Volume Control
		volumeDelta: function(delta){
			if (this.current.sound.muted) {this.volumeMute()};
			this.current.volume = (delta == "up") ? Math.min(100, this.current.volume+6) : Math.max(10, this.current.volume-6);
			this.current.sound.setVolume(this.current.volume);
			$(".volume-progress").progress({
				autoSuccess: false,
				value: this.current.volume
			});
		},
		volumeMute: function(){
			this.current.sound.toggleMute();
		},
		//Tracking Control
		positionDelta: function(delta){
			//10 second increments
			this.current.sound.setPosition((delta == "forward") ? 
				Math.min(this.current.sound.duration, this.current.sound.position+10000) : 
				Math.max(0, this.current.sound.position-10000)
			);
			$(".playing-progress .bar").width((10 + (90*this.position/this.duration))+"%");
			// $(".playing-progress .bar").width(Math.max(10, this.current.sound.position/this.current.sound.duration*100) + "%");
		},
		stopToggle: function(){
			this.current.sound.stop();
			this.current.playing = false;
		},
		//Playback
		trackDelta: function(delta){
			var sc = this, toPlay;
			switch (sc.current.playback.type) {
				case "repeat":
					sc.current.sound.stop().play();
					break;
				case "random":
					//Add history for backward shuffling
					if (delta == "backward") {
						console.log(sc.current.playback.randomIndex);
						sc.current.playback.randomIndex = Math.max(0, sc.current.playback.randomIndex-1);
						toPlay = sc.current.playback.history[sc.current.playback.randomIndex];
					} else {
						// sc.current.playback.randomIndex++;				
						if (sc.current.playback.randomIndex == sc.current.playback.history.length-1) {
							console.log("edge of history", sc.current.playback.randomIndex, sc.current.playback.history);
							toPlay = _.sample(sc.current.playlist.tracks);
							sc.current.playback.history.push(toPlay);
							sc.current.playback.randomIndex++;
						} else {
							sc.current.playback.randomIndex++;
							console.log("inner history", sc.current.playback.randomIndex, sc.current.playback.history);
							toPlay = sc.current.playback.history[sc.current.playback.randomIndex];
						};
						
					};
					console.log("HISTORY",sc.current.playback.randomIndex, sc.current.playback.history);
					//
					// toPlay = _.sample(sc.current.playlist.tracks);
					sc.playTrack(toPlay, sc.current.playlist);
					break;
				default:
					if (delta == "backward") {
						toPlay = sc.current.playlist.tracks[Math.max(0, sc.current.playback.index-1)];
					} else {
						//Repeat if at the end
						console.log("index", sc.current.playback.index, sc.current.playlist.tracks.length);
						toPlay = sc.current.playlist.tracks[sc.current.playback.index == sc.current.playlist.tracks.length-1 ? 0 : Math.min(sc.current.playlist.tracks.length-1, sc.current.playback.index+1)];
					};
					sc.playTrack(toPlay, sc.current.playlist);
			};
		},
		playbackTypeToggle: function(){
			this.current.playback.type = 
				(this.current.playback.type == "linear") ? "repeat" : ((this.current.playback.type == "repeat") ? "random" : "linear");
			//
			if (this.current.playback.type == "random") {
				this.current.playback.history = [this.current.track];
				this.current.playback.randomIndex = 0;
			};
		}
	};

	//Static Methods
	// Soundcloud.method = function(){};

	return Soundcloud;
}]);