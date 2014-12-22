var prefix="../api/"
var end = moment()
var start = moment().subtract(1, 'month')
Highcharts.setOptions({
	global : {
		useUTC : false
	}
});
var generateDropdownElement = function(obj) {
	return '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" onclick=selectCar('+obj+')>'+obj+'</a></li>'
}
var selectCar = function(obj) {
	$("#dropdownMenu1").text(obj+'<span class="caret"></span>')
	loadData(obj,start.valueOf(),end.valueOf())
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
	subtitle: {
		text: 'Data collected from a 1999 Honda Accord'
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
				text: 'Acceleration (km/h/h)',
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
			tooltip:{ valueSuffix:' km/h/h'},
			data:[],
			style: {
					color: Highcharts.getOptions().colors[1]
				}
		},
	]
});

var position_chart = new Highcharts.Chart({
	chart: {
		type: 'spline',
		renderTo: 'position-chart-container',
		zoomType: 'x'
	},
	title: {
		text: 'Position'
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
				text: 'Position (km)',
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
			name:'Position',
			yAxis:0,
			tooltip:{ valueSuffix:' km'},
			data:[],
			style: {
					color: Highcharts.getOptions().colors[0]
				}
		}
	]
});

differentiate = function(values){
	// Needs at least 3 points
	if (values.length < 3)
		return null
	res = []
	for(var x = 1; x < values.length-1; x++)
	{
		slope = (values[x+1][1]-values[x-1][1])/(values[x+1][0]-values[x-1][0])*3600
		res.push([values[x][0],slope])
	}
	return res
}

integrate = function(values){
	//Needs at least 2 points
	if (values.length < 2)
		return null
	sum = 0
	res = []
	res.push([values[0][0],sum]) //initial position at 0
	for(var x = 1; x < values.length; x++)
	{
		sum += (values[x][1]+values[x-1][1])/2 * (values[x][0]-values[x-1][0])/3600000
		res.push([values[x][0],sum])
	}
	return res
}
loadData = function(vehicle_id, begin_time, end_time){$.ajax({
	type:"GET",
	url: prefix+"get/"+vehicle_id+"/"+begin_time+"/"+end_time+"/rpm",
	success:function(msg){
		chart.series[0].setData(JSON.parse(msg),false);
		$.ajax({
			type:"GET",
			url: prefix+"get/"+vehicle_id+"/"+begin_time+"/"+end_time+"/speed",
			success:function(msg){
				vel = JSON.parse(msg);
				chart.series[1].setData(vel,false);
				vel_accel_chart.series[0].setData(vel,false);
				vel_accel_chart.series[1].setData(differentiate(vel),true);
				position_chart.series[0].setData(integrate(vel),true);
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
		loadData(1,start.valueOf(),end.valueOf())
	});
	$('#daterange').val(start.format("MM/DD/YYYY") + " - " +end.format("MM/DD/YYYY"))
	$.ajax({
		type:"GET",
		url: prefix+"list/vehicle_id",
		success: function(data) {
			var index, len;
			for (index = 0, len = data.length; index < len; ++index) {
				$(".dropdown-menu").append(generateDropdownElement(data[index]));
			}
		}
	});
});