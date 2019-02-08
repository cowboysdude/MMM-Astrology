/* Magic Mirror
* Module: MMM-Astrology
*
* By cowboysdude
*
*/

Module.register("MMM-Astrology", {

	// Module config defaults.
	defaults: {
		updateInterval: 60*1000, // every 10 minutes
		animationSpeed: 10,
		initialLoadDelay: 875, // 0 seconds delay
		retryDelay: 1500,
		starSign: "",
		hScope: "",
		maxWidth: "400px",
		fadeSpeed: 7,
        tcolor: "white",

        sign : {
		"leo":"Leo",
		"capricorn":"Capricorn",
		"aquarius":"Aquarius",
		"pisces":"Pisces",
		"aries":"Aries",
		"taurus":"Taurus",
		"gemini":"Gemini",
		"cancer":"Cancer",
		"virgo":"Virgo",
		"libra":"Libra",
		"scorpio":"Scorpio",
		"sagittarius":"Sagittarius",
		"ophiuchus":"Ophiuchus",
 		}
	  },

	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	getStyles: function() {
		return ["MMM-Astrology.css"];
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		// Set locale.
		this.url = this.getUrl();
		this.today = "";
		this.scheduleUpdate();
	},

	getDom: function() {

		var astro = this.astro;

		var starSign = this.config.starSign;



		var displayTitle = this.config.displayTitle;
		var displayIcon = this.config.displayIcon;
		var wrapper = document.createElement("div");
		wrapper.className = "wrapper";
		wrapper.style.maxWidth = this.config.maxWidth;

		if (!this.loaded) {
			wrapper.classList.add("wrapper");
			wrapper.innerHTML = "Forecasting ...";
			wrapper.className = "bright light small";
			return wrapper;
		}
            var starSign = this.config.sign[astro.sunsign];

			var ssign =  document.createElement("div");
			ssign.style.color = this.config.scolor;
			//ssign.setAttribute('style','margin-bottom: -50px');
			ssign.innerHTML = "<img src = modules/MMM-Astrology/icons/1/"+starSign+".svg width=10% height=10%> " + starSign;
			wrapper.appendChild(ssign);

			var tcolor = this.config.tcolor;

			var title = document.createElement("div");
			title.classList.add("xsmall", "bright", "title");
			title.style.color = tcolor;
			title.setAttribute('style','margin-top:0; padding-top:0; float: left');
			if (this.config.hScope == "daily"){
			title.innerHTML =   "<br>Daily Horoscope for Today";//+ moment(astro.date).format("MM-DD-YYYY");
			} else if (this.config.hScope == "week"){
			title.innerHTML =   "<br>Horoscope for "+astro.week;
			} else if (this.config.hScope == "month") {
			title.innerHTML =   "<br>Horoscope for "+ moment(astro.month).format('MMMM YYYY');	
			} else {
			title.innerHTML =   "<br>Horoscope for "+astro.year;
			}
			wrapper.appendChild(title);

		var des = document.createElement("p");
		des.classList.add("small", "bright","desc");
		des.innerHTML = "<br>"+astro.horoscope;
		wrapper.appendChild(des);

		return wrapper;
	},

	getUrl: function() {
		var url = null;
		var str = this.config.hScope;
		var hType = str.toLowerCase();
		var newSign = this.config.starSign;

		if (hType == "daily") {
			url = "http://horoscope-api.herokuapp.com/horoscope/today/"+ this.config.starSign;
		} else if (hType == "week") {
			url = "http://horoscope-api.herokuapp.com/horoscope/week/"+ this.config.starSign;
		} else if(hType == "month" || hType == "yearly") {
			url = "http://horoscope-api.herokuapp.com/horoscope/month/"+ this.config.starSign;
		}  else if(hType == "year" || hType == "yearly") {
			url = "http://horoscope-api.herokuapp.com/horoscope/year/"+ this.config.starSign;
		}
		else {
			console.log("Error: Can't get horoscope URL" + response.statusCode);
		}
		return url;
	},

	processAstrology: function(data) {
		this.today = data.Today;
		this.astro = data;
		console.log(this.astro);
		this.loaded = true;
	},

	scheduleUpdate: function() {
		setInterval(() => {
			this.getAstrology();
		}, this.config.updateInterval);
		this.getAstrology(this.config.initialLoadDelay);
	},

	getAstrology: function() {
		this.sendSocketNotification('GET_ASTROLOGY', this.url);
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "ASTRO_RESULTS") {
			this.processAstrology(payload);
			this.updateDom(this.config.animationSpeed);
		}
		this.updateDom(this.config.initialLoadDelay);
	},

});
