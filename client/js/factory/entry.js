gruveone.factory("Entry", ["$q", "Soundcloud", function($q, Soundcloud){
	function Entry(){
		//Open Entry modal
		$(".entry.ui.modal")
			.modal({
				closable: false
			})
			.modal("show");

		this.buttons = $(".entry.button");
		this.phamartinButton = $(".phamartin.entry.button");
		this.pigeonsAndPlanesButton = $(".pigeonsandplanes.entry.button");
	};

	Entry.prototype = {
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