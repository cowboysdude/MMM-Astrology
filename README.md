# MMM-Astrology
Horoscopes for daily, weekly, monthly or yearly!  For the MagicMirror2

Instructions:

Terminal Window instructions:

Go to:
~MagicMirror/modules
git clone "https://github.com/cowboysdude/MMM-Astrology"

Go to:
~MagicMirror/modules/MMM-Astrolgy
Run:  npm install

## Configuration options

The following properties can be configured:

| Option | Description
| --- | ---
| `displayTitle` | Shows or hides the title.  <br><br> **Possible values:** `true` or `false` <br> **Default value:** `true`

Go to:
Config.js -- Example config...
    [MUST follow the instructions.  I have NO checks in there yet to convert text so it's up to you to enter it correctly!]
      Config options:
      StarSign: Must be entered like this:  Leo, Aries, Pisces, etc.. 
      hScope: daily, weekly, monthly or yearly {CAUTION:  Yearly horoscopes are VERY large in most cases will take up entire screen!}
      maxWidth:  default is 400px;  ->  In this config it is set to 350px. 
      
      See screen shots...     

         {
			module: 'MMM-Astrology',
			position: 'top_center',
			config: {
				starSign: "Pisces",
				hScope: "daily",
				maxWidth: "350px",
			}
		},

Start mirror...enjoy!

Remember colors can be changed in the custom.css file like this:

.MMM-Astrology .header {
	color: #fff;
	}
	
	
