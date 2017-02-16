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
           initialLoadDelay: 6950, // 0 seconds delay
           retryDelay: 1500,
           starSign: "Pisces",
	       hScope: "daily",
           maxWidth: "400px",
           fadeSpeed: 11,
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
         
         var wrapper = document.createElement("div");
         wrapper.className = "wrapper";
         wrapper.style.maxWidth = this.config.maxWidth;

         if (!this.loaded) {
         	 wrapper.classList.add("wrapper");        	 
             wrapper.innerHTML = "Forecasting ...";
             wrapper.className = "bright light small";
             return wrapper;
         }
        
         var header = document.createElement("header");
         header.className = "header";
         header.innerHTML = astro.title;
         wrapper.appendChild(header);
		
        var top = document.createElement("div");
         top.classList.add("content");
         
         var horoLogo = document.createElement("div");
         var horoIcon = document.createElement("img");
         horoIcon.src = this.file("icons/1/" + starSign + ".png");
         horoIcon.classList.add("imgDesInv");
         horoLogo.appendChild(horoIcon);
         top.appendChild(horoLogo);

         var des = document.createElement("p");
         des.classList.add("xsmall", "bright");
         des.innerHTML = astro.description;
         top.appendChild(des);

         wrapper.appendChild(top);
         return wrapper;

     },
     
     getUrl: function() {
       var url = null;
      if (this.config.hScope == "daily") {
	  url = "http://www.findyourfate.com/rss/dailyhoroscope-feed.php?sign="+ this.config.starSign +"&id=45";
	} else if (this.config.hScope == "weekly") {
	  url = "http://www.findyourfate.com/rss/"+ this.config.hScope +"-horoscope-feed.php?sign="+ this.config.starSign +"&id=45";
	} else if(this.config.hScope == "monthly" || this.config.hScope == "yearly") {
	  url = "http://www.findyourfate.com/rss/"+ this.config.hScope +"-horoscope.asp?sign="+ this.config.starSign +"&id=45";
    }
       else {
       	console.log("Error can't get url" + response.statusCode);
    }
  return url;
  },
     
     processAstrology: function(data) {
         this.today = data.Today;
         this.astro = data;
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
         if (notification === "HOROSCOPE_RESULT") {
             this.processAstrology(payload);
             this.updateDom(this.config.animationSpeed);
         }
         this.updateDom(this.config.initialLoadDelay);
     },

 });
