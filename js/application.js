$(function() {
	
	// example data, do not use on live site
	var yourConsumption = [[1167692400000,61.05], [1167778800000,58.32], [1167865200000,57.35], [1167951600000,56.31]];
	var averageRates = [[1167606000000,0.7580], [1167692400000,0.7580], [1167778800000,0.75470], [1167865200000,0.75490]];
	
	var data = [
		{ data: yourConsumption, label: "Your consumption" },
		{ data: averageRates, label: "Average rates", yaxis: 2 }
	];

	var options = {
		canvas: true,
		xaxes: [ { mode: "time" } ],
		yaxes: [ { min: 0 }, {
			position: "right",
			alignTicksWithAxis: 1,
			tickFormatter: function(value, axis) {
				return value.toFixed(axis.tickDecimals) + "gals";
			}
		} ],
		legend: { position: "sw" }
	}

	$.plot("#placeholder", data, options);

});