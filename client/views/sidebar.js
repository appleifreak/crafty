var _ = require("underscore");

var sidebar =
module.exports = new Ractive({
	el: "#sidebar",
	data: {
		server: $craft.props.get("server"),
		state: $craft.state,
		humanState: {
			stopped: "Offline",
			starting: "Offline",
			running: "Online",
			stopping: "Offline"
		}
	},
	template: require("../templates/info"),
	adapt: [ 'Backbone' ]
});

$craft.props.on("add", function(prop) {
	if (prop.id === "server") sidebar.set("server", prop);
});

$craft.on("state", function(state) {
	sidebar.set("state", state);
});

sidebar.on("start", function(e) {
	e.original.preventDefault();
	if (e.node.classList.contains("disabled")) return;
	e.node.classList.add("disabled");
	e.node.innerText = "Setting up...";
	$craft.start();
});

sidebar.on("stop", function(e) {
	e.original.preventDefault();

	if (this.counting) return;
	this.counting = true;

	var cnt = 3, i;
	$craft.stop(cnt);
	e.node.classList.add("disabled");
	e.node.innerText = "in " + cnt + "...";

	i = setInterval(_.bind(function() {
		cnt--;
		if (cnt > 0) e.node.innerText = "in " + cnt + "...";
		else {
			clearInterval(i);
			this.counting = false;
		}
	}, this), 1000);
});