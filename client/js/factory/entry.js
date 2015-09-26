gruveone.factory("Entry", ["$q", "Soundcloud", function($q, Soundcloud){
	function Entry(){
		//Open Entry modal
		$(".entry.ui.modal")
			.modal({
				closable: false
			})
			.modal("show");

		//Users to pull playlists from
		this.usernames = [
			"phamartin",
			"pigeonsandplanes",
			"i-d-online-1",
			"ayaeliza",
			"flashplayer1",
			"some-kind-of-music-blog", //Vancouver
			"indiemusicfilter", //Toronto
			"thewildhoneypie",
			"hypetrak-1"
		];

		this.buttons = $(".entry.entry-enter.button");
	};

	Entry.prototype = {
		init: function(){
			var entry = this;
			_.each(entry.usernames, function(u){
				entry.enter(u)
					.then(function(p){

					})
			});
		},
		enter: function(account){
			$(".entry.ui.button").addClass("disabled");
			$(".entry.ui.dimmer").dimmer("show");
			var sc = new Soundcloud;
			return sc.getPlaylists(account);
		},
		hide: function(){
			$(".entry.ui.modal").modal("hide");
		}
	}

	return Entry;
}]);