from bottle import request, response, route, run, post, template
import os
import sqlite3
import csv
import json
import codecs

prefix=os.environ['PICARD_PREFIX']
port=os.environ['PICARD_PORT']

db = sqlite3.connect("test.db")
cur = db.cursor()
cur.execute("CREATE TABLE IF NOT EXISTS defaulttable (timestamp timestamp, vin varchar(17), rpm decimal, speed decimal, temp integer, load decimal)")
cur.execute("CREATE UNIQUE INDEX IF NOT EXISTS time_index ON defaulttable(timestamp)")

# SELECT CAST(avg(timestamp) as integer), avg(speed) from defaulttable group by strftime('%M',datetime(timestamp, 'unixepoch')) order by timestamp;
# SELECT strftime('%s',(strftime('%Y-%m-%d %H:%M',datetime(timestamp, 'unixepoch')))) as 'Timestamp', avg(speed) from defaulttable group by 1;

print(prefix)

def validate(field):
	if field not in ['vin','timestamp','rpm','speed','temp','load']:
		return False
	else:
		return True

@route(prefix+'get/<vin>/<timestamp>/<field>')
def get_data_timestamp(vin,timestamp,field):
	if validate(field):
		try:
			json.dumps(cur.execute("SELECT timestamp,"+field+" FROM defaulttable WHERE vin = ? and timestamp = ? ", (vin, timestamp)).fetchall())
		except sqlite3.Warning:
			return 'error'
	else:
		return 'error'

@route(prefix+'get/<vin>/<timestamp_from>/<timestamp_to>/<field>')
def get_data_timestamp_range(vin,timestamp_from, timestamp_to, field):
	if validate(field):
		try:
			return json.dumps(cur.execute("SELECT timestamp,"+field+" FROM defaulttable WHERE vin = ? and timestamp >= ? AND timestamp < ? ", (vin, timestamp_from, timestamp_to)).fetchall())
		except sqlite3.Warning:
			return 'error'
	else:
		return 'error'


@route(prefix+'list/<field>')
def get_data(field):
	if validate(field):
		try:
			return "["+json.dumps(cur.execute("SELECT DISTINCT "+field+" FROM defaulttable ").fetchall()).replace("[","").replace("]","")+"]"
		except sqlite3.Warning:
			return 'error'
	else:
		return 'error'

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

run(host='localhost', port=port, debug=True)
