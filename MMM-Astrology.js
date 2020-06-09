/* Magic Mirror
* Module: MMM-Astrology
*
* By cowboysdude/ revisoned RDR
*
*/

Module.register("MMM-Astrology", {

	// Module config defaults.
	defaults: {
		updateInterval: 10*60*1000, // every 1 minutes
		animationSpeed: 10,
		initialLoadDelay: 875, // 0 seconds delay
		retryDelay: 1500,
		starSigns: ["scorpio","aquarius"],
        starSign: "",
		hScope: "",
		maxWidth: "400px",
		fadeSpeed: 7,
        tcolor: "white",
        fontSize: "14px",
        textalign: "left",
        titlemarginleft: "40",
        translation_languages: ["it"],
        

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
        this.sign_position = 0;
        this.config.starSign = this.config.starSigns[this.sign_position];
        this.show_signs = this.config.starSigns.map(function(v) {
          return v.toLowerCase();
        });
		this.url = this.getUrl();
		this.today = "";
        this.sendSocketNotification('START_ASTROLOGY', this.config);
        this.horoscope = "";
        this.astroHoroscope = "";
        
		
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

			var ssign=  document.createElement("div");
            ssign.className = "title_image";
			ssign.style.color = this.config.scolor;
			//ssign.setAttribute('style','margin-bottom: -50px');
			ssign.innerHTML = "<img src = modules/MMM-Astrology/icons/1/"+starSign+".svg width=10% height=10%> "+starSign; 

            ssign.style.textAlign = this.config.textalign;
            
            

			wrapper.appendChild(ssign);

			var tcolor = this.config.tcolor;

			var title = document.createElement("div");
			title.classList.add("xsmall", "bright", "title");
            
			title.style.color = tcolor;
			title.setAttribute('style','margin-top:0; padding-top:0; float: left');
            title.style.float = this.config.textalign;
			if (this.config.hScope == "daily"){
			title.innerHTML =   "<br>Horoscope "+ moment(astro.date).format("DD-MM-YYYY");;//+ moment(astro.date).format("DD-MM-YYYY");
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
		des.id = "desHoro";
        des.style.fontSize = this.config.fontSize;
        des.style.textalign= this.config.textalign;
		des.innerHTML = "<br>"+this.astroHoroscope;
		wrapper.appendChild(des);

		return wrapper;
	},

	getUrl: function() {
		var url = null;
		var str = this.config.hScope;
		var hType = str.toLowerCase();
		var newSign = this.config.starSign;

		if (hType == "daily") {
			url = "https://horoscope-api.herokuapp.com/horoscope/today/"+ this.config.starSign;
		} else if (hType == "week") {
			url = "https://horoscope-api.herokuapp.com/horoscope/week/"+ this.config.starSign;
		} else if(hType == "month" || hType == "yearly") {
			url = "https://horoscope-api.herokuapp.com/horoscope/month/"+ this.config.starSign;
		}  else if(hType == "year" || hType == "yearly") {
			url = "https://horoscope-api.herokuapp.com/horoscope/year/"+ this.config.starSign;
		}
		else {
			console.log("Error: Can't get horoscope URL" + response.statusCode);
		}
		return url;
	},

	processAstrology: function(data) {
        this.today = data.Today;
        this.astro = data;
        this.astroHoroscope = this.astro.horoscope;
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
        if (notification === "ASTRO_STARTED") {
            this.scheduleUpdate();
            this.updateDom(this.config.initialLoadDelay);
        }    
		if (notification === "ASTRO_RESULTS") {
			this.processAstrology(payload);
			this.updateDom(this.config.animationSpeed);
            
            return
            
		}
    },
    
    notificationReceived: function (noti, payload) {
        
        
        if (noti == "HOROSCOPE") {
          //this.sendNotification("SHOW_ALERT", {title: "Please wait", message: "HOROSCOPE"+payload, timer: 1000});
          if(payload.command=="next"){
            
            this.sign_position= this.sign_position+1
            if(this.sign_position >= this.show_signs.length) 
            {
                this.sign_position = 0;
            }
            //this.sendNotification("SHOW_ALERT", {title: "Please wait", message: "HOROSCOPE"+this.sign_position, timer: 1000});
            
            this.config.starSign = this.config.starSigns[this.sign_position];
            this.url = this.getUrl();
            this.getAstrology();
            
            return;
          }
          if(payload.command=="previous"){
            
            this.sign_position= this.sign_position-1
            
            if(this.sign_position <= 0) 
            {
                this.sign_position = this.show_signs.length-1;
            }
            //this.sendNotification("SHOW_ALERT", {title: "Please wait", message: "HOROSCOPE"+this.sign_position, timer: 1000});
            this.config.starSign = this.config.starSigns[this.sign_position];
            this.url = this.getUrl();
            this.getAstrology();
            
            return;
          }
        }
    },

});
