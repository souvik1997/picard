from bottle import request, response, route, run, post, template
import os
import sqlite3
import json

prefix=os.environ['PICARD_PREFIX']

db = sqlite3.connect("test.db")
cur = db.cursor()
print(prefix)
@route(prefix+'get/<vin>/<timestamp>/<field>')
def get_data(vin,timestamp,field):
	return "["+json.dumps(cur.execute("SELECT "+field+" FROM "+vin+" WHERE timestamp = "+timestamp).fetchall()).replace("[","").replace("]","")+"]"

@route(prefix+'get/<vin>/<timestamp_begin>/<timestamp_end>/<field>')
def get_data(vin,timestamp_begin, timestamp_end, field):
	return "["+json.dumps(cur.execute("SELECT "+field+" FROM "+vin+" WHERE timestamp >= "+timestamp_begin+" AND timestamp < " +timestamp_end).fetchall()).replace("[","").replace("]","")+"]"

@post(prefix+'post')
def post_data():
	request.content_type = 'application/json'
	print(request.json)

run(host='localhost', port=8080, debug=True)
