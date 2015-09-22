gruveone.factory("Menu", [function(){
	function Menu() {

	};

	Menu.prototype = {
		playlistSidebar: function(){
			$(".playlist-sidebar").sidebar("toggle");
		},
		selectTrack: function(){
			console.log("asd");
		}
	};

	return Menu;
}]);