const Authenticaton = require ('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {

	app.get('/', requireAuth, function(req, res, next) {
		res.send({ hi : 'there'});
	});

	app.post('/signin', requireSignin, Authenticaton.signin)

	app.post('/signup', Authenticaton.signup);

	app.get('/dashboard', function(req, res) {
	  res.writeHead(200, {
	  	Connection: "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type,Accept',
	  })
	  countdown(res, 12)
	})

	function countdown(res, count) {

	  let id = Math.floor(Math.random() * Math.floor(count));
	  let randomStatusId = Math.floor(Math.random() * Math.floor(3));

	  let connections = ["not connected", "error", "connected"];
	  let activities = ["idle", "transmitting", "receiving"];

	  const obj = JSON.stringify({ circuit_id: id, action: "update_circuit_status", value: connections[randomStatusId] });
	  const obj2 = JSON.stringify({ circuit_id: id, action: "update_circuit_activity", value: activities[randomStatusId] });
	
	  res.write("data: "+obj+"\n\n");
	  res.write("data: "+obj2+"\n\n");
	  res.flush();
	  if (count > 1)
	    setTimeout(() => countdown(res, count-1), 1000)
	  else
	    res.end()
	}

}