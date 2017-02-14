/* Magic Mirror
    * Module: MMM-Astrology
    *
    * By Cowboysdude/ node_helper written by: strawberry 3.141
    * 
    */
const NodeHelper = require('node_helper');
const request = require('request');
const fs = require('fs');
const parser = require('xml2js').parseString;



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
    socketNotificationReceived: function(notification, payload) {
        if(notification === 'CONFIG'){
            this.config = payload;
            this.getAstrology();
        }
    },
    
      getUrl: function() {
     	var hScope = this.config.hScope;
        var starSign = this.config.starSign;
      if (hScope === "daily") {
	  	url: "http://www.findyourfate.com/rss/dailyhoroscope-feed.php?sign="+ starSign +"&id=45";
	  } else if (hScope === "weekly" || hscope === "monthly") {
	 	url: "http://www.findyourfate.com/rss/"+ hscope +"-horoscope-feed.php?sign="+ starSign +"&id=45";
	  } else (hScope === "yearly") 
	  	url: "http://www.findyourfate.com/rss/"+ hscope +"-horoscope.asp?sign="+ starSign +"&id=45";
	  },
    
    getAstrology: function(url) {
    	request({ 
    	          url: getUrl(), 
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
