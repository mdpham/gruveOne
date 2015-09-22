gruveone.factory("Menu", [function(){
	function Menu() {

	};

	Menu.prototype = {
		playlistSidebar: function(){
			$(".playlist-sidebar").sidebar("toggle");
		}
	};

	return Menu;
}]);