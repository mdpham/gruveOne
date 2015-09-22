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
		}
	};

	//Static Methods
	// Soundcloud.method = function(){};

	return Soundcloud;
}]);