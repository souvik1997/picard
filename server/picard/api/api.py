from bottle import request, response, route, run, post, template
import os
import pymysql
import csv
import json
import codecs

prefix=os.environ['PICARD_PREFIX']
port=os.environ['PICARD_PORT']
username = os.environ['PICARD_DB_USERNAME']
password = os.environ['PICARD_DB_PASSWORD']
host = os.environ['PICARD_DB_HOST']
database = os.environ['PICARD_DB']

db = pymysql.connect(host=host, user=username, password=password, db=database)
cur = db.cursor()
cur.execute("CREATE TABLE IF NOT EXISTS picardtable (timestamp timestamp, vehicle_id varchar(50), rpm decimal, speed decimal, temp integer, engine_load decimal)")

# SELECT CAST(avg(timestamp) as integer), avg(speed) from picardtable group by strftime('%M',datetime(timestamp, 'unixepoch')) order by timestamp;
# SELECT strftime('%s',(strftime('%Y-%m-%d %H:%M',datetime(timestamp, 'unixepoch')))) as 'Timestamp', avg(speed) from picardtable group by 1;

print(prefix)

def validate(field):
	if field not in ['vehicle_id','timestamp','rpm','speed','temp','engine_load']:
		return False
	else:
		return True

@route(prefix+'get/<vehicle_id>/<timestamp>/<field>')
def get_data_timestamp(vin,timestamp,field):
	if validate(field):
		try:
			json.dumps(cur.execute("SELECT timestamp,"+field+" FROM picardtable WHERE vehicle_id = ? and timestamp = ? ", (vin, timestamp)).fetchall())
		except:
			return 'error'
	else:
		return 'error'

@route(prefix+'get/<vehicle_id>/<timestamp_from>/<timestamp_to>/<field>')
def get_data_timestamp_range(vin,timestamp_from, timestamp_to, field):
	if validate(field):
		try:
			return json.dumps(cur.execute("SELECT timestamp,"+field+" FROM picardtable WHERE vehicle_id = ? and timestamp >= ? AND timestamp < ? ", (vin, timestamp_from, timestamp_to)).fetchall())
		except:
			return 'error'
	else:
		return 'error'


@route(prefix+'list/<field>')
def get_data(field):
	if validate(field):
		try:
			return "["+json.dumps(cur.execute("SELECT DISTINCT "+field+" FROM picardtable ").fetchall()).replace("[","").replace("]","")+"]"
		except:
			return 'error'
	else:
		return 'error'

@post(prefix+'upload')
def upload_data():
	initial_time   = request.forms.get('initial_time')
	vehicle_id   = request.forms.get('vehicle_id')
	upload     = request.files.get('upload')
	name, ext = os.path.splitext(upload.filename)
	if ext not in ('.csv'):
		return 'File extension not allowed.'
	upload.save("/tmp/temp.csv", overwrite=True)
	with open("/tmp/temp.csv","r") as csvfile:
		dr = csv.DictReader(csvfile)
		to_db = [(int(1000*((float(i['time'])+float(initial_time)))), vehicle_id, float(i['rpm']), float(i['speed']), int(i['temp']), float(i['load'])) for i in dr]
		cur.executemany("INSERT INTO picardtable (timestamp, vin, rpm, speed, temp, engine_load) VALUES (?, ?, ?, ?, ?, ?);", to_db)
	db.commit()
	return 'OK'

run(host='localhost', port=port, debug=True)
