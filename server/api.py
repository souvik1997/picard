from bottle import request, response, route, run, post, template
import os
import sqlite3
import json

prefix=os.environ['PICARD_PREFIX']

db = sqlite3.connect("test.db")
cur = db.cursor()
cur.execute("CREATE TABLE IF NOT EXISTS defaulttable (timestamp timestamp, vin varchar(17), speed decimal, rpm decimal)")
cur.execute("CREATE UNIQUE INDEX IF NOT EXISTS time_index ON defaulttable(timestamp)")
print(prefix)
@route(prefix+'get/<vin>/<timestamp>/<field>')
def get_data(vin,timestamp,field):
	return "["+json.dumps(cur.execute("SELECT "+field+" FROM defaulttable WHERE vin = ? and timestamp = ? ", (vin, timestamp)).fetchall()).replace("[","").replace("]","")+"]"

@route(prefix+'get/<vin>/<timestamp_begin>/<timestamp_end>/<field>')
def get_data(vin,timestamp_begin, timestamp_end, field):
	return "["+json.dumps(cur.execute("SELECT "+field+" FROM defaulttable WHERE vin = ? and timestamp >= ? AND timestamp < ? ", (vin, timestamp_begin, timestamp_end)).fetchall()).replace("[","").replace("]","")+"]"

@post(prefix+'post')
def post_data():
	request.content_type = 'application/json'
	cur.execute("INSERT INTO defaulttable VALUES (?,?,?,?)", (request.json["timestamp"], request.json["vin"], request.json["speed"], request.json["rpm"]))
	db.commit()

run(host='localhost', port=8080, debug=True)
