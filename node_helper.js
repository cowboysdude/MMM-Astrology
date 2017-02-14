/* Magic Mirror
    * Module: MMM-Astrology
    *
    * By Cowboysdude/ node_helper written by: strawberry 3.141
    * 
    */
const NodeHelper = require('node_helper');
const request = require('request');
const parser = require('xml2js').parseString;
const fs = require('fs');

module.exports = NodeHelper.create({
	  
    start: function() {
    	console.log("Starting module: " + this.name);
        this.astro = {
            timestamp: null,
            data: null
        };
        this.path = "modules/MMM-Astrology/Astro.json";
        if (fs.existsSync(this.path)) {
            var temp = JSON.parse(fs.readFileSync(this.path, 'utf8'));
            if (temp.timestamp === this.getDate()) {
                this.astro = temp;
            }
        }
    },
    //socketNotificationReceived: function(notification, payload) {
    //    if(notification === 'CONFIG'){
    //    	console.log("got config");
    //        this.config = payload;
    //        this.getAstrology();
    //    }
  //  },
    
    getUrl: function() {
       var hScope = this.config.hScope;
       var starSign = this.config.starSign;
      if (this.config.hScope === "daily") {
	  	url = "http://www.findyourfate.com/rss/dailyhoroscope-feed.php?sign="+ this.config.starSign +"&id=45";
	  	return;
	  } else if (this.config.hScope === "weekly" || this.config.hScope === "monthly") {
	 	url = "http://www.findyourfate.com/rss/"+ this.config.hScope +"-horoscope-feed.php?sign="+ this.config.starSign +"&id=45";
	 	return;
	  } else (this.config.hScope === "yearly") 
	  	url = "http://www.findyourfate.com/rss/"+ this.config.hScope +"-horoscope.asp?sign="+ this.config.starSign +"&id=45";
	  	return;
	  },
    
    getAstrology: function(url) {
    	console.log(url);
    	request({ 
    	          url: this.getUrl(), 
    	          method: 'GET' 
    	        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                parser(body, (err, result)=> {
                    if(result.hasOwnProperty('rss')){
                        var result = JSON.parse(JSON.stringify(result.rss.channel[0].item[0]));
                        this.sendSocketNotification("ASTRO_RESULT", {Astro: result});
                        this.astro.timestamp = this.getDate();
                        this.astro.data = result;
                        this.fileWrite();
                        return;
                    } else {
                        console.log("Error no data");
                    }
                });
            } else {
                console.log("Error getting Astro " + response.statusCode);
            }
        });
    },


    fileWrite: function() {
        fs.writeFile(this.path, JSON.stringify(this.astro), function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("The Horoscope file was saved!");
        });
    },

    getDate: function() {
        return (new Date()).toLocaleDateString();
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_ASTRO') {
            if (this.astro.timestamp === this.getDate() && this.astro !== null) {
                this.sendSocketNotification('ASTRO_RESULT', this.astro.data);
            } else {
                this.getAstrology(payload);
            }
        }
    }

});
