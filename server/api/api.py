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
def get_data_timestamp(vin,timestamp,field):
	return json.dumps(cur.execute("SELECT timestamp,"+field+" FROM defaulttable WHERE vin = ? and timestamp = ? ", (vin, timestamp)).fetchall())

@route(prefix+'get/<vin>/<timestamp_from>/<timestamp_to>/<field>')
def get_data_timestamp_range(vin,timestamp_from, timestamp_to, field):
	return json.dumps(cur.execute("SELECT timestamp,"+field+" FROM defaulttable WHERE vin = ? and timestamp >= ? AND timestamp < ? ", (vin, timestamp_from, timestamp_to)).fetchall())

@route(prefix+'list/<field>')
def get_data(field):
	return "["+json.dumps(cur.execute("SELECT DISTINCT "+field+" FROM defaulttable ").fetchall()).replace("[","").replace("]","")+"]"

@post(prefix+'post')
def post_data():
	request.content_type = 'application/json'
	cur.execute("INSERT INTO defaulttable VALUES (?,?,?,?)", (request.json["timestamp"], request.json["vin"], request.json["speed"], request.json["rpm"]))
	db.commit()

run(host='localhost', port=8080, debug=True)
