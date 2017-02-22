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
        
         //var header = document.createElement("header");
        // header.classList.add("xsmall", "dimmed", "header");
        // header.innerHTML = astro.title;
        // wrapper.appendChild(header);
		
         var top = document.createElement("div");
         top.classList.add("content");
         
         var title = document.createElement("span");
         title.classList.add("xsmall", "bright", "title");
         title.innerHTML = astro.title;
         top.appendChild(title);
         
         var spacer = document.createElement("p");
         spacer.innerHTML = '';
         top.appendChild(spacer);
         
         var horoLogo = document.createElement("span");
         var horoIcon = document.createElement("img");
         horoIcon.src = this.file("icons/" + starSign + ".png");
         horoIcon.classList.add("imgDesInv");
         horoLogo.appendChild(horoIcon);
         top.appendChild(horoLogo);

         var des = document.createElement("p");
         des.classList.add("small", "bright");
         des.innerHTML = astro.description;
         top.appendChild(des);

         wrapper.appendChild(top);
         return wrapper;

     },
     
     getUrl: function() {
       var url = null;
       var str = this.config.hScope;
       var hType = str.toLowerCase();
       var newSign = this.config.starSign;
        
      if (hType == "daily") {
	  url = "http://www.findyourfate.com/rss/dailyhoroscope-feed.php?sign="+ this.config.starSign +"&id=45";
	} else if (hType == "weekly") {
	  url = "http://www.findyourfate.com/rss/"+ hType +"-horoscope-feed.php?sign="+ this.config.starSign +"&id=45";
	} else if(hType == "monthly" || hType == "yearly") {
	  url = "http://www.findyourfate.com/rss/"+ hType +"-horoscope.asp?sign="+ this.config.starSign +"&id=45";
    }
       else {
       	console.log("Error can't get Horoscope url" + response.statusCode);
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
