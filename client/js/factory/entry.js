gruveone.factory("Entry", ["$q", "Soundcloud", function($q, Soundcloud){
	function Entry(){
		//Open Entry modal
		$(".entry.ui.modal")
			.modal({
				closable: false
			})
			.modal("show");
	};

	Entry.prototype = {
		enter: function(){
			$(".entry.ui.dimmer").dimmer("show");
			var sc = new Soundcloud;
			return sc.getPlaylists();
		},
		close: function(){
			$(".entry.ui.modal").modal("hide");
		}
	}

	return Entry;
}]);