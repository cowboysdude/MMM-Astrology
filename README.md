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
| `starSign` | The star sign to display. Must be capitalized. <br><br> **Example values:** `Leo`, `Aries`, `Pisces`<br>**Default value:** none
| `hScope` | The type of horoscope to display. <br><br> **Possible values:** `daily`, `weekly`, `monthly`, `yearly`<br>**Default value:** none<br>CAUTION:  Yearly horoscopes are VERY large in most cases will take up entire screen!
| `maxWidth` | The maximum display width of the module in pixels.<br><br> **Default value:** `400px`
| `displayTitle` | Shows or hides the title.  <br><br> **Possible values:** `true` or `false` <br> **Default value:** `true`

## Example configuration
[MUST follow the instructions.  I have NO checks in there yet to convert text so it's up to you to enter it correctly!]
```
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
	
	
