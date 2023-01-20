/*
    MMM-NOAAAlerts Module
        A Magic Mirror module to display current local weather warning and alerts.
        Data is sourced from a NOAA CAP alerts served via the NOAA API  
            https://www.weather.gov/documentation/services-web-api 
 */
    const NOAA_ALERTS_FETCH_MESSAGE = "FETCH_NOAA_ALERTS";

    Module.register("MMM-NOAAAlerts", {
        config:null,
        APIData:{},
        rotateTimer: null,
        activeItem: 0,
    
        // anything here in defaults will be added to the config data
        // and replaced if the same thing is provided in config
        defaults: {
            debug: false,
            APIURL: "https://api.weather.gov/alerts/active?point=47.593,-122.333",
            updateInterval: 30 * 60 * 1000, 
            rotateInterval: 15 * 1000, 
            userAgent: "MagicMirrorMMTSWENG", 
            showDescription: true,
            showInstruction: false,
            showNoAlertText: false,
            noAlertText: 'There are no active weather alerts in this area',
            removeGap: true,
            showAsMarquee: false
        },

        getTemplate: function() {
            return "MMM-NOAAAlerts.njk";
        },

        getTemplateData: function () {
            return {config: this.config,
                APIData: this.APIData};
        },
    
        // return list of stylesheet files to use if any
        getStyles: function() {
            return 	[
                "MMM-NOAAAlerts.css"
            ]
        },      
    
        // only called if the module header was configured in module config in config.js
        getHeader: function() {
            return this.data.header;
        },

        // rotate through list of events
	    scheduleRotateInterval: function () {
            //Clear timer if it already exists
            if (this.rotateTimer) {
                clearInterval(this.rotateTimer);
            }

            this.rotateTimer = setInterval(() => {
                this.activeItem++;
                if (this.activeItem > this.APIData.alerts.length-1)
                {
                    this.activeItem = 0;
                }
                var myID = this.activeItem;

                document.querySelectorAll('#NOAA_Alert .alert').forEach(function (al, idx, arr) {
                    if (idx == myID) {
                        al.classList.add('active');
                        al.classList.remove('inactive');
                    } else {
                        al.classList.add('inactive');
                        al.classList.remove('active');
                    }
                });

                //this.updateDom(100);
            }, this.config.rotateInterval);
	    },
    
        // messages received from other modules and the system (NOT from your node helper)
        notificationReceived: function(notification, payload, sender) {
            // once everybody is loaded up
            if(notification==="ALL_MODULES_STARTED"){
                this.sendSocketNotification("CONFIG",this.config)
            }
        },
    
        // messages received from from your node helper (NOT other modules or the system)
        socketNotificationReceived: function(notification, payload) {
            if(notification === NOAA_ALERTS_FETCH_MESSAGE){
                if (this.config.debug){Log.log(this.name + " received a Fetch Message: " + payload);}
                this.APIData = payload;
                this.scheduleRotateInterval();
                this.updateDom(100);
            }
        },
    })