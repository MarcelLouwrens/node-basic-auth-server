const Authenticaton = require("./controllers/authentication");
const passportService = require("./services/passport");
const passport = require("passport");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

module.exports = function (app) {
	app.get("/", requireAuth, function (req, res, next) {
		res.send({ hi: "there" });
	});

	app.post("/signin", requireSignin, Authenticaton.signin);

	app.post("/signup", Authenticaton.signup);

	app.get("/dashboard", function (req, res) {
		res.writeHead(200, {
			Connection: "keep-alive",
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods":
				"GET, POST, OPTIONS, PUT, PATCH, DELETE",
			"Access-Control-Allow-Headers":
				"X-Requested-With,content-type,Accept",
		});
		countdown(res, 50);
	});

	function countdown(res, count) {
		let id = Math.floor(Math.random() * Math.floor(12));
		let randomStatusId = Math.floor(Math.random() * Math.floor(4));

		let connections = ["not connected", "error", "connected", "idle"];
		let activities = ["idle", "transmitting", "receiving", "error"];

		const obj = JSON.stringify({
			circuit_id: id,
			action: "update_circuit_status",
			value: connections[randomStatusId],
		});
		const obj2 = JSON.stringify({
			circuit_id: id,
			action: "update_circuit_activity",
			value: activities[randomStatusId],
		});

		res.write("data: " + obj + "\n\n");
		res.write("data: " + obj2 + "\n\n");
		res.flushHeaders();
		if (count > 1) setTimeout(() => countdown(res, count - 1), 500);
		else res.end();
	}

	app.get("/notifications", function (req, res) {
		res.writeHead(200, {
			Connection: "keep-alive",
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods":
				"GET, POST, OPTIONS, PUT, PATCH, DELETE",
			"Access-Control-Allow-Headers":
				"X-Requested-With,content-type,Accept",
		});
		notifications(res, 50);
	});

	function notifications(res, count) {
		let notificationId = Math.floor(Math.random() * Math.floor(1000));

		const obj = JSON.stringify({
			notification_id: notificationId,
			message: "A notification with random id: " + notificationId,
		});

		res.write("data: " + obj + "\n\n");
		res.flushHeaders();
		if (count > 1) setTimeout(() => notifications(res, count - 1), 20000);
		else res.end();
	}
};
