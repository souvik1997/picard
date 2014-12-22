from bottle import request, response, route, run, post, template
import os
import sqlite3
import csv
import json
import codecs

prefix=os.environ['PICARD_PREFIX']

db = sqlite3.connect("test.db")
cur = db.cursor()
cur.execute("CREATE TABLE IF NOT EXISTS defaulttable (timestamp timestamp, vin varchar(17), rpm decimal, speed decimal, temp integer, load decimal)")
cur.execute("CREATE UNIQUE INDEX IF NOT EXISTS time_index ON defaulttable(timestamp)")

# SELECT CAST(avg(timestamp) as integer), avg(speed) from defaulttable group by strftime('%M',datetime(timestamp, 'unixepoch')) order by timestamp;
# SELECT strftime('%s',(strftime('%Y-%m-%d %H:%M',datetime(timestamp, 'unixepoch')))) as 'Timestamp', avg(speed) from defaulttable group by 1;

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

@route(prefix+'oper/<vin>/<timestamp_from>/<timestamp_to>/<field>/<job>/<interval>')
def exec_operation(vin, timestamp_from, timestamp_to, field, job, interval):
	intervals = {'minute': '%Y-%m-%d %H:%M', 'hour':'%Y-%m-%d %H', 'day':'%Y-%m-%d', 'month':'%Y-%m', 'year': '%Y'}
	print("SELECT strftime('%s',(strftime("+intervals[interval]+",datetime(timestamp, 'unixepoch')))) as 'Timestamp', "+job+"("+field+") from defaulttable WHERE vin = ? and timestamp >= ? AND timestamp < ? )")
	return json.dumps(cur.execute("SELECT strftime('%s',(strftime('"+intervals[interval]+"',datetime(timestamp, 'unixepoch')))) as 'Timestamp', "+job+"("+field+") from defaulttable WHERE vin = ? and timestamp >= ? AND timestamp < ? GROUP BY 1", (vin, timestamp_from, timestamp_to)).fetchall()).replace('"','')

@post(prefix+'post')
def post_data():
	request.content_type = 'application/json'
	cur.execute("INSERT INTO defaulttable VALUES (?,?,?,?)", (request.json["timestamp"], request.json["vin"], request.json["speed"], request.json["rpm"]))
	db.commit()
	
@post(prefix+'upload')
def upload_data():
	initial_time   = request.forms.get('initial_time')
	vin   = request.forms.get('vin')
	upload     = request.files.get('upload')
	name, ext = os.path.splitext(upload.filename)
	if ext not in ('.csv'):
		return 'File extension not allowed.'
	upload.save("/tmp/temp.csv", overwrite=True)
	with open("/tmp/temp.csv","r") as csvfile:
		dr = csv.DictReader(csvfile)
		to_db = [(int(1000*((float(i['time'])+float(initial_time)))), vin, float(i['rpm']), float(i['speed']), int(i['temp']), float(i['load'])) for i in dr]
		cur.executemany("INSERT INTO defaulttable (timestamp, vin, rpm, speed, temp, load) VALUES (?, ?, ?, ?, ?, ?);", to_db)
	db.commit()
	return 'OK'

run(host='localhost', port=8080, debug=True)
