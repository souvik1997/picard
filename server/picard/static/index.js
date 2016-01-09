var prefix="../api/";
var end = moment(1419629174000);
var start = moment(1419628815000);
Highcharts.setOptions({
	global : {
		useUTC : false
	}
});
var generateDropdownElement = function(obj) {
	return '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" onclick=\'selectCar("'+obj+'")\'>'+obj+'</a></li>'
}
var selected_car = "";
var selectCar = function(obj) {
	$("#dropdownMenu1").html(obj+' <span class="caret"></span>');
	chart.setTitle({text:'On Board Diagnostic Data'},{text:'Data collected from a '+obj}, false);
	selected_car = obj;
	loadData(obj,start.valueOf(),end.valueOf());
}
var chart = new Highcharts.Chart({
	chart: {
		type: 'spline',
		renderTo: 'chart-container',
		zoomType: 'x'
	},
	title: {
		text: 'On Board Diagnostic Data'
	},
	xAxis: {
		type: 'datetime',
		title: {
			text: 'Date'
		}
	},
	yAxis: [
		{
			title: {
				text: 'RPM',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
			min: 0
		},
		{
			title: {
				text: 'Load (%)',
				style: {
					color: Highcharts.getOptions().colors[2]
				}
			},
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[2]
				}
			},
			min: 0,
			opposite: true
		},
		{
			title: {
				text: 'Speed (km/h)',
				style: {
					color: Highcharts.getOptions().colors[1]
				}
			},
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[1]
				}
			},
			min: 0
		},
		{
			title: {
				text: 'Temperature (°C)',
				style: {
					color: Highcharts.getOptions().colors[3]
				}
			},
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[3]
				}
			},
			min: 0
		}
	],
	tooltip: {
		shared:true
	},
	series: [
		{
			name: 'RPM',
			yAxis: 0,
			tooltip:{ valueSuffix:' RPM'},
			data: [],
			style: {
					color: Highcharts.getOptions().colors[0]
				}
		},
		{
			name:'Speed',
			yAxis:2,
			tooltip:{ valueSuffix:' km/h'},
			data:[],
			style: {
					color: Highcharts.getOptions().colors[1]
				}
		},
		{
			name: 'Load',
			yAxis: 1,
			tooltip:{ valueSuffix:'%'},
			data: [],
			style: {
					color: Highcharts.getOptions().colors[2]
				}
		},
		{
			name: 'Temperature',
			yAxis:3,
			tooltip:{ valueSuffix:'°C'},
			data:[],
			style: {
					color: Highcharts.getOptions().colors[3]
				}
		}
	]
});

var vel_accel_chart = new Highcharts.Chart({
	chart: {
		type: 'spline',
		renderTo: 'vel-accel-chart-container',
		zoomType: 'x'
	},
	title: {
		text: 'Speed and Acceleration'
	},
	xAxis: {
		type: 'datetime',
		title: {
			text: 'Date'
		}
	},
	yAxis: [
		{
			title: {
				text: 'Speed (km/h)',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
		},
		{
			title: {
				text: 'Acceleration (km/h/s)',
				style: {
					color: Highcharts.getOptions().colors[1]
				}
			},
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[1]
				}
			},
		}
	],
	tooltip: {
		shared:true
	},
	series: [
		{
			name:'Speed',
			yAxis:0,
			tooltip:{ valueSuffix:' km/h'},
			data:[],
			style: {
					color: Highcharts.getOptions().colors[0]
				}
		},
		{
			name:'Acceleration',
			yAxis:0,
			tooltip:{ valueSuffix:' km/h/s'},
			data:[],
			style: {
					color: Highcharts.getOptions().colors[1]
				}
		},
	]
});

var distance_chart = new Highcharts.Chart({
	chart: {
		type: 'spline',
		renderTo: 'distance-chart-container',
		zoomType: 'x'
	},
	title: {
		text: 'Distance'
	},
	xAxis: {
		type: 'datetime',
		title: {
			text: 'Date'
		}
	},
	yAxis: [
		{
			title: {
				text: 'Distance (km)',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
			min: 0
		}
	],
	tooltip: {
		shared:true
	},

	series: [
		{
			name:'Distance',
			yAxis:0,
			tooltip:{ valueSuffix:' km'},
			data:[],
			style: {
					color: Highcharts.getOptions().colors[0]
				}
		}
	]
});

var vel_rpm_chart = new Highcharts.Chart({
	chart: {
		type: 'scatter',
		renderTo: 'vel-rpm-chart-container',
		zoomType: 'xy'
	},
	title: {
		text: 'RPM vs. Speed'
	},
	xAxis: {
		title: {
			enabled: true,
			text: 'Speed (km/h)'
		}
	},
	yAxis: [
		{
			title: {
				text: 'RPM',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
		},
	],
	tooltip: {
		shared:true,
		pointFormat: '{point.x} km/h, {point.y} RPM'
	},
	series: [
		{
			name:'RPM vs. Speed',
			data:[],
			style: {
					color: Highcharts.getOptions().colors[0]
				}
		}
	]
});
var accel_drpm_chart = new Highcharts.Chart({
	chart: {
		type: 'scatter',
		renderTo: 'accel-drpm-chart-container',
		zoomType: 'xy'
	},
	title: {
		text: 'RPM/s vs. Acceleration'
	},
	xAxis: {
		title: {
			enabled: true,
			text: 'Acceleration (km/h/s)'
		}
	},
	yAxis: [
		{
			title: {
				text: 'RPM/s',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
		}
	],
	tooltip: {
		shared:true,
		pointFormat: '{point.x} km/h/s, {point.y} RPM/s'
	},
	series: [
		{
			name:'RPM/s vs. Acceleration',
			data:[],
			style: {
					color: Highcharts.getOptions().colors[0]
				}
		}
	]
});
var rpm_pie_chart = new Highcharts.Chart({
	chart: {
		type: 'scatter',
		renderTo: 'rpm-pie-chart-container',
		plotBackgroundColor: null,
		plotBorderWidth: null,
		plotShadow: false

	},
	title: {
		text: 'Percentage of time spent in each RPM range'
	},
	plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: false
					},
					showInLegend: true
				}
			},
	tooltip: {
		pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	},
	series: [
		{
			name:'RPMs',
			type: 'pie',
			data:[],
			style: {
					color: Highcharts.getOptions().colors[0]
				}
		}
	]
});
differentiate = function(values, k){
	// Needs at least 3 points
	if (values.length < 3)
		return null;
	res = [];
	for(var x = 1; x < values.length-1; x++)
	{
		slope = (values[x+1][1]-values[x-1][1])/(values[x+1][0]-values[x-1][0]) * k;
		res.push([values[x][0],slope]);
	}
	return res;
}

integrate = function(values, k){
	//Needs at least 2 points
	if (values.length < 2)
		return null;
	sum = 0;
	res = [];
	res.push([values[0][0],sum]); //initial distance at 0
	for(var x = 1; x < values.length; x++)
	{
		sum += (values[x][1]+values[x-1][1])/2 * (values[x][0]-values[x-1][0])/k;
		res.push([values[x][0],sum]);
	}
	return res;
}
loadData = function(vehicle_id, begin_time, end_time){$.ajax({
	type:"GET",
	url: prefix+"get/"+vehicle_id+"/"+begin_time+"/"+end_time+"/rpm",
	success:function(msg){
		var rpm = JSON.parse(msg);
		var ranges = [['0-1000',0],['1000-2000',0],['2000-3000',0],['3000-4000',0],['4000-5000',0],['5000-6000',0],['6000-7000',0],['7000-8000',0],['8000-9000',0],['9000+',0]];
		for(var i = 0; i < rpm.length; i++)
		{
			var cur = rpm[i][1]
			if (cur <= 1000)
				ranges[0][1]++;
			else if (cur <= 2000)
				ranges[1][1]++;
			else if (cur <= 3000)
				ranges[2][1]++;
			else if (cur <= 4000)
				ranges[3][1]++;
			else if (cur <= 5000)
				ranges[4][1]++;
			else if (cur <= 6000)
				ranges[5][1]++;
			else if (cur <= 7000)
				ranges[6][1]++;
			else if (cur <= 8000)
				ranges[7][1]++;
			else if (cur <= 9000)
				ranges[8][1]++;
			else
				ranges[9][1]++;
		}
		for (var i = 0; i < ranges.length; i++)
		{
			ranges[i][1] = ranges[i][1]/rpm.length;
		}
		chart.series[0].setData(rpm,false);
		rpm_pie_chart.series[0].setData(ranges);
		$.ajax({
			type:"GET",
			url: prefix+"get/"+vehicle_id+"/"+begin_time+"/"+end_time+"/speed",
			success:function(msg){
				vel = JSON.parse(msg);
				chart.series[1].setData(vel,false);
				vel_accel_chart.series[0].setData(vel,false);
				var acc = differentiate(vel,1000)
				vel_accel_chart.series[1].setData(acc,true);
				var dist = integrate(vel,3600000);
				distance_chart.series[0].setData(dist,true);
				var velrpm = [];
				for(var i = 0; i < vel.length; i++)
				{
					velrpm.push([vel[i][1],rpm[i][1]]);
				}
				vel_rpm_chart.series[0].setData(velrpm,true);
				var drpm = differentiate(rpm,1);
				var acceldrpm = [];
				for (var i = 0; i < acc.length; i++)
				{
					acceldrpm.push([acc[i][1],drpm[i][1]]);
				}
				accel_drpm_chart.series[0].setData(acceldrpm,true);
				$.ajax({
					type:"GET",
					url: prefix+"get/"+vehicle_id+"/"+begin_time+"/"+end_time+"/load",
					success:function(msg){
						chart.series[2].setData(JSON.parse(msg),false);
						$.ajax({
							type:"GET",
							url: prefix+"get/"+vehicle_id+"/"+begin_time+"/"+end_time+"/temp",
							success:function(msg){
								chart.series[3].setData(JSON.parse(msg),true);
							}
						})
					}
				})
			}
		})
	}
})}
$(document).ready(function() {
	$('#daterange').daterangepicker(
		{
			endDate:end.toDate(), 
			startDate:start.toDate(),
			timePicker:true,
			timePickerSeconds:true
		}, function(start, end, label) {
		loadData(selected_car,start.valueOf(),end.valueOf())
	});
	$('#daterange').val(start.format("MM/DD/YYYY") + " - " +end.format("MM/DD/YYYY"));
	$.ajax({
		type:"GET",
		url: prefix+"list/vehicle_id",
		success: function(data) {
			var index, len;
			arr = JSON.parse(data);
			initial_car = arr[0];
			for (index = 0, len = arr.length; index < len; ++index) {
				$("#dropdownul").append(generateDropdownElement(arr[index]));
			}
			selectCar(initial_car);
		}
	});
});
