from obdython import Device, OBDPort, SENSORS
import time
import sys
import argparse
import csv
import signal
import sys

quit = False

def signal_term_handler(signal, frame):
	print("quitting...")
	global quit
	quit = True

signal.signal(signal.SIGTERM, signal_term_handler)

def main():
	def devtype(val):
		if val != "bluetooth" and val != "serial":
			raise argparse.ArgumentTypeError("must be either bluetooth or serial")
		return val

	parser = argparse.ArgumentParser(description='Record OBD-II data')
	parser.add_argument('-d','--devicetype', help='type of device (bluetooth or serial)',type=devtype, required=True)
	parser.add_argument('-m','--bluetoothmac', help='bluetooth MAC address')
	parser.add_argument('-c','--bluetoothchannel', help='bluetooth channel', default=1, type=int)
	parser.add_argument('-s','--serialdevice', help='serial device to use (like /dev/ttyS1)')
	parser.add_argument('-t','--timeout', help='device timeout', default=60, type=int)
	parser.add_argument('-r','--sensors', help='sensors to read: '+', '.join(list(SENSORS.keys())), nargs="+", required=True)
	parser.add_argument('-o','--output', help='output file', required=True)
	args = parser.parse_args()
	if args.devicetype == "bluetooth":
		device = Device(Device.types['bluetooth'],bluetooth_mac=args.bluetoothmac,bluetooth_channel=args.bluetoothchannel, timeout=args.timeout)
	else:
		device = Device(Device.types['serial'],serial_device=args.serialdevice,timeout=args.timeout)
	port = OBDPort(device)
	time.sleep(0.1)
	port.connect()
	time.sleep(0.1)
	port.ready()
	print("Version: "+port.get_elm_version())


	with open(args.output, 'w') as csvfile:
		header = list(args.sensors)
		header.insert(0,'time')
		writer = csv.DictWriter(csvfile, fieldnames=header)
		writer.writeheader()
		starttime = time.time()
		global quit
		while quit == False:
			begin = time.time()
			dict = {}
			for sensor in args.sensors:
				val = port.sensor(sensor)[1]
				print((sensor,val))
				dict[sensor] = val
			dict['time'] = time.time()-starttime
			writer.writerow(dict)
			length = 1.0 - (time.time() - begin)
			if length > 0:
				time.sleep(length)
	port.close()
	sys.exit(0)

if __name__ == "__main__":
	main()
