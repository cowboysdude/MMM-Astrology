# MMM-Astrology
Horoscopes for daily, weekly, monthly or yearly!  For the MagicMirror2

Instructions:

Terminal Window instructions:  

  Go to:  
        ~MagicMirror/modules  
         git clone "https://github.com/cowboysdude/MMM-Astrology"  

 
## Configuration options

The following properties can be configured:

| Option | Description
| --- | ---
| `starSign` | The star sign to display. Must be lower case. <br><br> **Example values:** `leo`, `aries`, `pisces`<br>**Default value:** none
| `hScope` | The type of horoscope to display. <br><br> **Possible values:** `daily`, `week`, `month`, `year`<br>**Default value:** none<br>CAUTION:  Yearly horoscopes are VERY large in most cases will take up entire screen! 
|`tcolor`| color of your horoscope

## Example configuration
[MUST follow the instructions.  I have NO checks in there yet to convert text so it's up to you to enter it correctly!]
```
{
	module: 'MMM-Astrology',
	position: 'top_center',
	config: {
		starSign: "pisces",
		hScope: "daily",
		tcolor: "white"
	}
},

Start mirror...enjoy! 
