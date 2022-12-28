var NodeHelper = require("node_helper");
const https = require("https");
const {url} = require("url");
const util = require('util');
const Log = require ("logger");
const NOAA_ALERTS_FETCH_MESSAGE = "FETCH_NOAA_ALERTS";

module.exports = NodeHelper.create({
    config: {},
	updateTimer: null,
	jsonBlob: null,

	// handle messages from our module// each notification indicates a different messages
	// payload is a data structure that is different per message.. up to you to design this
	socketNotificationReceived: function(notification, payload) {
		if (this.config.debug) {Log.log(this.name + " node_helper Received a socket notification: " + notification + " - Payload: " + payload);}
		// if config message from module
		if (notification === "CONFIG") {
			// save payload config info
			this.config=payload;
			this.performFetch();
		} else if (notification === NOAA_ALERTS_FETCH_MESSAGE){			
			this.performFetch();
		}
	},

    // Method to make a request to the NOAA API 
	getData: function() {
		try {
			var url = new URL(this.config.APIURL);
			if (this.config.debug) {Log.log(this.name + " performing  fetch request to " + url);}
			
			var options = {
				headers: {
                    'User-Agent': this.config.userAgent,
				}, 
				method: 'GET',
				hostname: url.hostname,
				path: url.pathname + url.search,
				protocol: url.protocol,
			};

			var request = https.get(options, (response) => {
				let data = '';
				response.on('data', (chunk) => {
					data = data + chunk.toString();
				});

				response.on('end', () => {
					this.processJSON(JSON.parse(data)); 
					this.sendSocketNotification(NOAA_ALERTS_FETCH_MESSAGE, this.jsonBlob);
				})
			});

			request.on('error', (error) => {
				Log.log (this.name + " ERROR: " + error);
			})

		} catch (error) {
			Log.log ("*ERROR* : " + this.name + " retrieving data: " + error);
		}		
	},


	//Method to convert NOAA's API response schema to something easier to render
	// -- updates this.jsonBLob 
	processJSON: function(json){
		this.jsonBlob = JSON.parse('{"alerts": []}');
		var jsonAlerts = this.jsonBlob.alerts;
		var alCount = 0;
		json.features.forEach(feature => {
            var prop = feature.properties;
            if (prop.status === "Actual")
            {
                var alert = {
                    headline: prop.headline,
                    event: prop.event,
                    description: prop.description,
                    instruction: prop.instructions,
                    certainty: prop.certainty,
                    severity: prop.severity,
                    status: prop.status
                };
                
				alCount++;
			    jsonAlerts.push(alert);
            }
		});
		this.jsonBlob.alertCount = alCount;

		if (this.config.debug) {Log.log(this.name + " JSON transformation: " + util.inspect(this.jsonBlob, {depth: null}));}

	},


	//Method to retrieve tweets
	performFetch: function(){ 
		this.getData();
		this.scheduleNextFetch();
	},

	//Method to set the timer for the next data refresh
	scheduleNextFetch: function() { 
		clearTimeout(this.updateTimer);
		this.updateTimer = setTimeout(() => {
			this.performFetch();
		}, this.config.updateInterval);
	}
});