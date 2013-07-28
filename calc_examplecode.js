var low_flow = 4;
var handGallons = 4; // OBSOLETE (now uses hand_low_flow)
var bathGallons = 36;
var sinkGallons = 4; // OBSOLETE (now uses sink_low_flow)
var people = 1;
var calcDebug = false;
var calcCategories = ['bath','toilet','sink','hand','dishwasher','laundry','lawn','outside'];
var divider = '\n-----------------------------------';
var calcData = new Object();

$(function(){
	//$('#results_wrapper').height($('#box_wrapper').outerHeight()+'px');
	
	// BROWSER INFO
	calcData.browser = new Object();
	calcData.browser.app_name = navigator.appName;
	calcData.browser.app_version = navigator.appVersion;
	calcData.browser.app_code_name = navigator.appCodeName;
	calcData.browser.user_agent = navigator.userAgent;
	calcData.browser.color_depth = window.screen.colorDepth;
	calcData.browser.colors = Math.pow(2, window.screen.colorDepth);
	calcData.browser.current_resolution = window.screen.width + ' x ' + window.screen.height;
	calcData.browser.max_resolution = window.screen.availWidth + ' x ' + window.screen.availHeight;
	if(navigator.appName.indexOf('Microsoft') != -1){
		calcData.browser.window_dimensions = document.body.offsetWidth + ' x ' + document.body.offsetHeight;
	}else{
		calcData.browser.window_dimensions = window.innerWidth + ' x ' + window.innerHeight;
	}
	calcData.browser.platform = navigator.platform;
	calcData.browser.referrer = document.referrer;
	
	// DEBUG
	if(document.location.href.toLowerCase().indexOf('http://localhost/') != -1
		|| document.location.href.toLowerCase().indexOf('http://www/') != -1){
		if(document.location.href.toLowerCase().indexOf('?debug') != -1
		   || document.location.href.toLowerCase().indexOf('&debug') != -1){
				calcDebug = true;
		}
	}
	
	$('.hidden').hide();
	$('.numeric').numeric();
	
	// PEOPLE
	$('#number_of_people').change(function(){
		people = $('#number_of_people').val();
		calculate('all');
	});
	
	// BATHROOM
	$('#showers').change(function(){
		if($('#showers').val() != 0){
			$('#showers_options').slideDown();
		}else{
			$('#showers_options').slideUp();
		}
		calculate('bath');
	});
	$('#baths').change(function(){ calculate('bath'); });
	$('#shower_low_flow').change(function(){ calculate('bath'); });
	$('#shower_minutes').keyup(function(){ calculate('bath'); });
	
	// TOILET
	$('#toilet_flushes').change(function(){
		if($('#toilet_flushes').val() != 0){
			$('#toilet_options').slideDown();
		}else{
			$('#toilet_options').slideUp();
		}
		calculate('toilet');
	});
	$('#toilet_low_flow').change(function(){ calculate('toilet'); });
	
	// SINKS
	$('#sink_minutes').keyup(function(){
		if($('#sink_minutes').val() != 0){
			$('#sink_options').slideDown();
		}else{
			$('#sink_options').slideUp();
		}
		calculate('sink');
	});
	$('#sink_low_flow').change(function(){ calculate('sink'); });
	
	// HAND DISH WASHING
	$('#hand_minutes').keyup(function(){
		if($('#hand_minutes').val() != 0){
			$('#hand_options').slideDown();
		}else{
			$('#hand_options').slideUp();
		}
		calculate('hand');
	});
	$('#hand_low_flow').change(function(){ calculate('hand'); });
	
	// DISHWASHER
	$('#dishwasher').change(function(){
		if($('#dishwasher').val() != 0){
			$('#dishwasher_options').slideDown();
		}else{
			$('#dishwasher_options').slideUp();
		}
		calculate('dishwasher');
	});
	$('#dishwasher_gallons').keyup(function(){ calculate('dishwasher'); });
	$('#dishwasher_energy_star').change(function(){
		if($('#dishwasher_energy_star').val() != 0){
			$('#dishwasher_gallons').val('4');
		}else{
			$('#dishwasher_gallons').val('12');
		}
		calculate('dishwasher');
	});
	
	// LAUNDRY
	$('#laundry').change(function(){
		if($('#laundry').val() != 0){
			$('#laundry_options').slideDown();
		}else{
			$('#laundry_options').slideUp();
		}
		calculate('laundry');
	});
	$('#laundry_gallons').keyup(function(){ calculate('laundry'); });
	$('#laundry_energy_star').change(function(){
		if($('#laundry_energy_star').val() != 0){
			$('#laundry_gallons').val('27');
		}else{
			$('#laundry_gallons').val('43');
		}
		calculate('laundry');
	});
	
	// LAWN
	$('#lawn').change(function(){
		if($('#lawn').val() != 0){
			$('#lawn_options').slideDown();
		}else{
			$('#lawn_options').slideUp();
		}
		calculate('lawn');
	});
	$('#lawn_sensors').change(function(){ calculate('lawn'); });
	$('#lawn_minutes').keyup(function(){ calculate('lawn'); });
	
	// OUTSIDE
	$('#outside_minutes').keyup(function(){ calculate('outside'); });
	
	// POOL
	$('#pool_minutes').keyup(function(){ calculate('outside'); });
	
	// BUTTONS & SUBMIT
	$('#calcSubmit').click(calcSubmit);

	$('#individual_button').click(function(){
			$('#household_button').attr('src', 'img/household2.png');
			$(this).attr('src', 'img/personal-off.png');
			$('#household_totals').hide();
			$('#individual_totals').show();
			
	});
	
	
	$('#household_button').click(function(){
		$('#individual_button').attr('src', 'img/personal.png');
		$(this).attr('src', 'img/household1.png');
		$('#household_totals').show();
		$('#individual_totals').hide();
	});
	
	
	// DEFAULTS (Resolves Back Button Issue)
	$('#number_of_people').trigger('change');
});

function calcSubmit(){
	if(calcData.total_household_day){
		parseParams($('#calcForm').formSerialize());
		for(var i=0; i<paramKeys.length; i++){
			var key = paramKeys[i];
			var value = paramValues[i];
			calcData[key] = value;
		}
		var jsonData = $.toJSON(calcData);
		$('#calcData').val(jsonData);
		$('#calcDataForm').submit();
	}else{
		alert('Please complete the calculator to submit a pledge.');
	}
	return(false);
}

function calcReset(form) {
	document.location.href = document.location.href;
}

function calcUsage(type, total){
	calcData[type] = total;	
	$('#'+type).html(total+' gallons');
	var jugs = '';
	for(var i=0; i<total; i++){
		jugs += '<img src="jug.png" />';
	}
	$('#'+type+'_jugs').html(jugs);
	calcTotals();
}

function calcTotals(){
	// HOUSEHOLD
	calcData.total_household_day = 0;
	jQuery.each(calcCategories, function(){
		total = this+'_household_total';
		if(calcData[total]){
			calcData.total_household_day += Number(calcData[total]);
			if(calcDebug) console.log(total+': '+calcData[total]);
		}
	});
	calcData.total_household_week = (calcData.total_household_day * 7);
	calcData.total_household_month = (calcData.total_household_week * 4);
	calcData.total_household_year = (calcData.total_household_week * 52);

	//$('#total_household_percent').html(addCommas(Math.round(calcData.total_household_day * .10))+' gallons');
	$('.total_household_day').html(addCommas(calcData.total_household_day)+' gallons');
	$('.total_household_week').html(addCommas(calcData.total_household_week)+' gallons');
	$('.total_household_month').html(addCommas(calcData.total_household_month)+' gallons');
	$('.total_household_year').html(addCommas(calcData.total_household_year)+' gallons');
	
	// INDIVIDUAL
	calcData.total_individual_day = 0;
	jQuery.each(calcCategories, function(){
		total = this+'_individual_total';
		if(calcData[total]){
			calcData.total_individual_day += Number(calcData[total]);
			if(calcDebug) console.log(total+': '+calcData[total]);
		}
	});
	calcData.total_individual_week = (calcData.total_individual_day * 7);
	calcData.total_individual_month = (calcData.total_individual_week * 4);
	calcData.total_individual_year = (calcData.total_individual_week * 52);
	calcData.total_individual_percent = Math.round(calcData.total_individual_day * .10);
	
	$('.total_individual_percent').html(addCommas(calcData.total_individual_percent)+' gallons');
	$('.total_individual_day').html(addCommas(calcData.total_individual_day)+' gallons');
	$('.total_individual_week').html(addCommas(calcData.total_individual_week)+' gallons');
	$('.total_individual_month').html(addCommas(calcData.total_individual_month)+' gallons');
	$('.total_individual_year').html(addCommas(calcData.total_individual_year)+' gallons');
}

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function calculate(type){
	var output = '';
	// ALL
	if(type=='all'){
		jQuery.each(calcCategories, function(){
			calculate(this);
		});
	}
	// BATHROOM
	else if(type=='bath'){
		// SETUP
		var showers = Number($('#showers').val());
		var shower_minutes = Number($('#shower_minutes').val());
		var shower_low_flow = low_flow;
		if($('#shower_low_flow').val() != 0){
			shower_low_flow = 2;
		}
		calcData.shower_low_flow = shower_low_flow;
		var baths = Number($('#baths').val());
		
		// TOTALS
		var bath_household_total = Math.round(((showers * shower_minutes * shower_low_flow) + (baths / 7 * bathGallons)));
		var bath_individual_total = Math.round(((showers * shower_minutes * shower_low_flow) + (baths / 7 * bathGallons)) / people);
		calcUsage('bath_household_total',bath_household_total);
		calcUsage('bath_individual_total',bath_individual_total);
		
		// DEBUG
		output += '[Bathroom]';
		output += '\n- Showers per Day: '+showers;
		output += '\n- Shower Minutes: '+shower_minutes;
		output += '\n- Shower Flow Rate: '+shower_low_flow;
		output += '\n- Baths per Week: '+baths;
		output += '\n- Bath Gallons: '+bathGallons;
		output += '\n- People: '+people;
		output += divider;
		output += '\nHousehold Total: (('+showers+' x '+shower_minutes+' x '+shower_low_flow+') + ('+baths+' / 7 x '+bathGallons+')) = '+bath_household_total;
		output += '\nIndividual Total: (('+showers+' x '+shower_minutes+' x '+shower_low_flow+') + ('+baths+' / 7 x '+bathGallons+')) / '+people+' = '+bath_individual_total;
	}
	// TOILET
	else if(type == 'toilet'){
		// SETUP
		var toilet_flushes = Number($('#toilet_flushes').val());
		var toilet_low_flow = 4;
		if($('#toilet_low_flow').val() != 0){
			toilet_low_flow = 1.6;
		}
		calcData.toilet_low_flow = toilet_low_flow;
		
		// TOTALS
		var toilet_household_total = Math.round(toilet_low_flow * toilet_flushes);
		var toilet_individual_total = Math.round((toilet_low_flow * toilet_flushes) / people);
		calcUsage('toilet_household_total',toilet_household_total);
		calcUsage('toilet_individual_total',toilet_individual_total);
		
		// DEBUG
		output += '[Toilet]';
		output += '\n- Flushes per Day: '+toilet_flushes;
		output += '\n- Flow Rate: '+toilet_low_flow;
		output += '\n- People: '+people;
		output += divider;
		output += '\nHousehold Total: ('+toilet_flushes+' x '+toilet_low_flow+') = '+toilet_household_total;
		output += '\nIndividual Total: ('+toilet_flushes+' x '+toilet_low_flow+') / '+people+'  = '+toilet_individual_total;
	}
	// SINKS
	else if(type == 'sink'){
		// SETUP
		var sink = 1;
		var sink_minutes = Number($('#sink_minutes').val());
		var sink_low_flow = low_flow;
		if($('#sink_low_flow').val() != 0){
			sink_low_flow = 1.5;
		}
		calcData.sink_low_flow = sink_low_flow;
		
		// TOTALS
		var sink_household_total = Math.round(((sink * sink_minutes) * sink_low_flow));
		var sink_individual_total = Math.round(((sink * sink_minutes) * sink_low_flow) / people);
		calcUsage('sink_household_total',sink_household_total);
		calcUsage('sink_individual_total',sink_individual_total);
		
		// DEBUG
		output += '[Sinks]';
		output += '\n- Sink Use per Day: '+sink;
		output += '\n- Minutes: '+sink_minutes;
		output += '\n- Flow Rate: '+sink_low_flow;
		output += '\n- People: '+people;
		output += divider;
		output += '\nHousehold Total: (('+sink+' x '+sink_minutes+') x '+sink_low_flow+') = '+sink_household_total;
		output += '\nIndividual Total: (('+sink+' x '+sink_minutes+') x '+sink_low_flow+') / '+people+' = '+sink_individual_total;
	}
	// HAND
	else if(type == 'hand'){
		// SETUP
		var hand = 1;
		var hand_minutes = Number($('#hand_minutes').val());
		var hand_low_flow = low_flow;
		if($('#hand_low_flow').val() != 0){
			hand_low_flow = 1.5;
		}
		calcData.hand_low_flow = hand_low_flow;
		
		// TOTALS
		var hand_household_total = Math.round((hand * hand_minutes * hand_low_flow));
		var hand_individual_total = Math.round((hand * hand_minutes * hand_low_flow) / people);
		calcUsage('hand_household_total',hand_household_total);
		calcUsage('hand_individual_total',hand_individual_total);
		
		// DEBUG
		output += '[Hand Washing Dishes]';
		output += '\n- Washes per Day: '+hand;
		output += '\n- Minutes: '+hand_minutes;
		output += '\n- Flow Rate: '+hand_low_flow;
		output += '\n- People: '+people;
		output += divider;
		output += '\nHousehold Total: (('+hand+' x '+hand_minutes+') x '+hand_low_flow+') = '+hand_household_total;
		output += '\nIndividual Total: (('+hand+' x '+hand_minutes+') x '+hand_low_flow+') / '+people+' = '+hand_individual_total;
	}
	// DISHWASHER
	else if(type == 'dishwasher'){
		// SETUP
		var dishwasher = Number($('#dishwasher').val());
		var dishwasher_gallons = Number($('#dishwasher_gallons').val());
		
		// TOTALS
		var dishwasher_household_total = Math.round((dishwasher * dishwasher_gallons) / 7);
		var dishwasher_individual_total = Math.round(((dishwasher * dishwasher_gallons) / 7) / people);
		calcUsage('dishwasher_household_total',dishwasher_household_total);
		calcUsage('dishwasher_individual_total',dishwasher_individual_total);
		
		// DEBUG
		output += '[Dishwasher]';
		output += '\n- Loads per Week: '+dishwasher;
		output += '\n- Gallons per Load: '+dishwasher_gallons;
		output += '\n- People: '+people;
		output += divider;
		output += '\nHousehold Total: (('+dishwasher+' x '+dishwasher_gallons+') / 7) = '+dishwasher_household_total;
		output += '\nIndividual Total: ((('+dishwasher+' x '+dishwasher_gallons+') / 7) / '+people+' = '+dishwasher_individual_total;
	}
	// LAUNDRY
	else if(type == 'laundry'){
		// SETUP
		var laundry = Number($('#laundry').val());
		var laundry_gallons = Number($('#laundry_gallons').val());
		
		// TOTALS
		var laundry_household_total = Math.round((laundry * laundry_gallons) / 7);
		var laundry_individual_total = Math.round(((laundry * laundry_gallons) / 7) / people);
		calcUsage('laundry_household_total',laundry_household_total);
		calcUsage('laundry_individual_total',laundry_individual_total);
		
		output += '[Laundry]';
		output += '\n- Loads per Week: '+laundry;
		output += '\n- Gallons per Load: '+laundry_gallons;
		output += '\n- People: '+people;
		output += divider;
		output += '\nHousehold Total: (('+laundry+' x '+laundry_gallons+') / 7) = '+laundry_household_total;
		output += '\nIndividual Total: ((('+laundry+' x '+laundry_gallons+') / 7) / '+people+') = '+laundry_individual_total;
	}
	// LAWN
	// need to kill lawn_sensors if lawn == 0
	else if(type == 'lawn'){
		// SETUP
		var lawn = Number($('#lawn').val());
		var lawn_minutes = Number($('#lawn_minutes').val());
		var lawn_sensors = (Number($('#lawn_sensors').val()) == 0 && lawn_minutes > 0 && lawn > 0) ? .76 : 1;
		var lawn_gallons = 11.67;
		calcData.lawn_gallons = lawn_gallons;
		
		// TOTALS
		var lawn_household_total = Math.round(((lawn * lawn_minutes * lawn_gallons)  / lawn_sensors) / 7);
		var lawn_individual_total = Math.round((((lawn * lawn_minutes * lawn_gallons)  / people) / lawn_sensors) / 7);
		calcUsage('lawn_household_total',lawn_household_total);
		calcUsage('lawn_individual_total',lawn_individual_total);
		
		// DEBUG
		output += '[Lawn]';
		output += '\n- Lawn per Week: '+lawn;
		output += '\n- Minutes: '+lawn_minutes;
		output += '\n- Gallons per Minute: '+lawn_gallons;
		output += '\n- People: '+people;
		if(lawn_sensors == '100'){
			output += '\n- Sensors: NO (+100 gpd)';
		}else{
			output += '\n- Sensors: YES';
		}
		output += divider;
		output += '\nHousehold Total: (('+lawn+' x '+lawn_minutes+' x '+lawn_gallons+' ) / '+lawn_sensors+') / 7 = '+lawn_household_total;
		output += '\nIndividual Total: ((('+lawn+' x '+lawn_minutes+' x '+lawn_gallons+' ) / '+people+') / '+lawn_sensors+') / 7 = '+lawn_individual_total;
	}
	// OUTSIDE
	else if(type == 'outside'){
		// SETUP
		var outside_minutes = Number($('#outside_minutes').val());
		var pool_minutes = Number($('#pool_minutes').val());
		var outside_gallons = 9;
		calcData.outside_gallons = outside_gallons;
		calcData.outside_minutes = outside_minutes;
		calcData.pool_minutes = pool_minutes;
		
		// TOTALS
		var outside_household_total = Math.round(((outside_minutes * outside_gallons) + (pool_minutes * outside_gallons)) / 7);
		var outside_individual_total = Math.round((((outside_minutes * outside_gallons) + (pool_minutes * outside_gallons)) / 7) / people);
		calcUsage('outside_household_total',outside_household_total);
		calcUsage('outside_individual_total',outside_individual_total);
		
		// DEBUG
		output += '[Outside]';
		output += '\n- Outside Minutes: '+outside_minutes;
		output += '\n- Gallons per Minute: '+outside_gallons;
		output += '\n- People: '+people;
		output += divider;
		output += '\nHousehold Total: (((('+outside_minutes+' x '+outside_gallons+') + ('+pool_minutes+' x '+outside_gallons+')) / 7) = '+outside_household_total;
		output += '\nIndividual Total: ((((('+outside_minutes+' x '+outside_gallons+') + ('+pool_minutes+' x '+outside_gallons+')) / 7) / '+people+') = '+outside_individual_total;
	}
	
	$('#testing').text(output);

	if(calcDebug) console.clear();
	if(calcDebug) console.log(output+'\n\n');
}

