 /* Magic Mirror
    * Module: MMM-Astrology
    *
    * By cowboysdude
    * 
    */
   
Module.register("MMM-Astrology", {

       // Module config defaults.
       defaults: {
           updateInterval: 120000, // every 10 minutes
           animationSpeed: 1000,
           initialLoadDelay: 1130, // 0 seconds delay
           retryDelay: 2500,
           starSing: "Leo",
	   typeScope: "",
           header: "",
           maxWidth: "400px",
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
           moment.locale(config.language);

           this.today = "";
           this.astro = {};
           this.url = "http://www.findyourfate.com/rss/dailyhoroscope-feed.php?sign=Leo&id=45";        
           this.scheduleUpdate();
       },

      getDom: function() {

         var astro = this.astro;

         var wrapper = document.createElement("div");
         wrapper.className = "wrapper";
         wrapper.style.maxWidth = this.config.maxWidth;
         

         if (!this.loaded) {
             wrapper.innerHTML = "Mixing ingrediants...";
             wrapper.className = "bright light small";
             return wrapper;
         }
         if (this.config.header != "" ){
         var header = document.createElement("header");
         header.className = "header";
         header.innerHTML = astro.title;
         wrapper.appendChild(header);
		 }
		 
         var top = document.createElement("div");
         top.classList.add("content");

       

         var title = document.createElement("h3");
         title.classList.add("small");
         //title.className = "medium bright";
         title.innerHTML = astro.title;
         top.appendChild(title);


         var des = document.createElement("p");
         des.classList.add("xsmall", "bright");
         des.innerHTML = "details";
         top.appendChild(des);

         wrapper.appendChild(top);
         return wrapper;

     },

     processAstrology: function(data) {
         //	console.log(data);
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
         this.sendSocketNotification('GET_ASTRO');
     },

     socketNotificationReceived: function(notification, payload) {
         if (notification === "ASTRO_RESULT") {
             this.processAstrology(payload);
             this.updateDom(this.config.fadeSpeed);
         }
         this.updateDom(this.config.initialLoadDelay);
     },

 });
