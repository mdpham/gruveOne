gruveone.factory("Menu", [function(){
	function Menu() {

	};

	Menu.prototype = {
		playlistSidebar: function(){
			$(".playlist-sidebar").sidebar("toggle");
		},
		// artworkLoading: function(id, toggle){
		// 	//Reset any other artwork loading
		// 	$(".image").dimmer("hide");
		// 	//Toggle: "show" || "hide"
		// 	$("#"+id+" .image").dimmer(toggle);
		// },
		playerOptions: function(){
			$(".player-options").transition("scale");
		}
	};

	return Menu;
}]);