   /* Magic Mirror
    * Module: MMM-Astrology
    *
    * By Cowboysdude //revision RDR
    * 
    */
const NodeHelper = require('node_helper');
const request = require('request');
const exec = require("child_process").exec; 
const wget = require('wget');


module.exports = NodeHelper.create({
	  
    start: function() {
    	console.log("Starting module: " + this.name);
        var config = null;
        
    },
    translation_text: "***",
    thehoroscope: "",
    getAstrology: function(url) {
        self = this;
        try{
            request({
                url: url,
                method: 'GET'
            }, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var result = JSON.parse(body);
                    
                    
                    
                    if (this.config.translation_languages[0] != "" && this.config.translation_languages[0] != null){
                        if(self.thehoroscope != result.horoscope){
                            self.thehoroscope = result.horoscope;
                                
                            var cmd = "trans "+'-b'+" "+":"+this.config.translation_languages[0]+' "'+result.horoscope+'"';
                            //thereturnvalue = self.execShellCommand(cmd);
                            
                            self.execShell(cmd,result,function(thereturnvalue,theresult){
                                //console.log(self.name+" inside thereturnvalue == "+thereturnvalue );
                                    theresult = result;
                                if(thereturnvalue==""){
                                    //means too many requests
                                }else{
                                    theresult.horoscope = thereturnvalue;    
                                }
                                self.sendSocketNotification('ASTRO_RESULTS', theresult);
                            });
                           
                            
                            
                        }
                    }else{
                        self.sendSocketNotification('ASTRO_RESULTS', result);
                    }
                }
            });
        } catch(error) {
          
        }
    },
    execShell: function(cmd,theresult,cb){
        
           exec(cmd, (error, stdout, stderr) => {
           
           if (error) {
            console.log(error);
           }
           thereturnvalue = stdout? stdout : stderr;
           if(typeof thereturnvalue != 'undefined'){
            
            cb(thereturnvalue,theresult); // If thereturnvalue is already define, I don't wait.
            } else {
                
                callback = cb;
            }
          });
        
        
    },

    execShellCommand: function(cmd) {

         return new Promise((resolve, reject) => {
          exec(cmd, (error, stdout, stderr) => {
           if (error) {
            console.log(error);
           }
           resolve(stdout? stdout : stderr);
          });
         });
    },
    
    
    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'START_ASTROLOGY') {
                this.config = payload;
                
                this.sendSocketNotification('ASTRO_STARTED');
                return
            }
         
        if (notification === 'GET_ASTROLOGY') {
                this.getAstrology(payload);
                return
            }
        if (notification === 'GET_ASTROLOGY_TRANSLATION') {
                //console.log(this.name+"  payload[0] "+payload[0]+":"+"  payload[1] "+ payload[1]);
                this.getTranslation(payload[0],payload[1]);
               
                console.log(this.name+" thetranslationIs "+payload[0]+":"+this.translation_text);
                if (this.translation_text==''){
                    this,translation_text = payload[1];
                }
                this.sendSocketNotification('ASTRO_RESULTS_TRANSLATION',this.translation_text);
                return
            }
     },  
    
    
   
                
            
       
    sleep: function(milliseconds) {
          const date = Date.now();
          let currentDate = null;
          do {
            currentDate = Date.now();
          } while (currentDate - date < milliseconds);
        }
    
});

    
    
