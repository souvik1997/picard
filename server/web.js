var express = require('express'); 
var fs = require('fs');
var jade = require('jade');
var app = express();
var moment = require('moment');
var prefix="/picard/";
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
var port = process.env.PORT || 8991;
app.use(express.bodyParser());
app.use(express.cookieParser())
var MongoClient = require('mongodb').MongoClient;
app.locals.pretty = true;

app.use(prefix+"static",express.static(__dirname+"/static"));

app.listen(port, function() {                           
  console.log("Listening on " + port);
});
app.get(prefix+"/*",function(request,response) //Fallback if the database is down or if a connection has not been established
{
	response.send("Cannot connect to database. Please try again later.");
});
MongoClient.connect('mongodb://'+process.env.MONGOURL, 
	function(err, db) {
		if(err) throw err;

		app.routes.get = []; //Clear routes
		app.get(prefix+"data/:date_identifier",function(request,response)	{
			db.collection('data',function(err,collection){
				collection.find({date:date_identifier}).toArray(
				function(err,items)
				{
					if (items != null)
						response.send(JSON.stringify(items));
				});
			});
		});
		app.post(prefix+"/post/",function(request,response){
			var str = request.body.data;
		    var date_identifier = moment(Date.now()).format('YYYY-MM-DD')
			var data = JSON.parse(str).data;
			data.date = date_identifier;
			db.collection('data',function(err,collection){
				collection.remove({date:date_identifier},function(err,reply){
					collection.insert(data,function(err,reply){
						response.send("done");
						console.log("Updated database");
					});
					
				});
			});
		});
		app.get(prefix,function(request,response) {
			db.collection('data',function(err,collection){
				collection.distinct("date",
					function(err,items)
					{
						if (items != null)
							response.render("index",{dates:items,uriprefix:"data"});
					});
			});
		});
		
	});
