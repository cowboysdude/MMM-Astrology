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

//urls: { url: "http://www.findyourfate.com/rss/dailyhoroscope-feed.php?sign=Leo&id=45"},


    start: function() {
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
            //console.log(temp);
        }

    },

    getAstrology: function(url) {
    	request({url: "http://www.findyourfate.com/rss/dailyhoroscope-feed.php?sign=Leo&id=45"}, (error, response, body) => {
            if (response.statusCode === 200) {
                parser(body, (err, result)=> {
                    if(err) {
                        console.log(err);
                    } else if(result.hasOwnProperty('rss')){
                        var result = parser(result.rss.channel);
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
                this.sendSocketNotification('ASTRO_RESULT', this.astro);
            } else {
                this.getAstrology(payload);
            }
        }
    }

});