var prefix="../api/"
Highcharts.setOptions({
	global : {
		useUTC : false
	}
});
chart = new Highcharts.Chart({
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
				text: 'Speed (kph)',
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
		   tooltip:{ valueSuffix:' kph'},
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
loadData = function(vin, begin_time, end_time){$.ajax({
	type:"GET",
	url: prefix+"get/"+vin+"/"+begin_time+"/"+end_time+"/rpm",
	success:function(msg){
		chart.series[0].setData(JSON.parse(msg),false);
		$.ajax({
			type:"GET",
			url: prefix+"get/"+vin+"/"+begin_time+"/"+end_time+"/speed",
			success:function(msg){
				chart.series[1].setData(JSON.parse(msg),false);
				$.ajax({
					type:"GET",
					url: prefix+"get/"+vin+"/"+begin_time+"/"+end_time+"/load",
					success:function(msg){
						chart.series[2].setData(JSON.parse(msg),false);
						$.ajax({
							type:"GET",
							url: prefix+"get/"+vin+"/"+begin_time+"/"+end_time+"/temp",
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