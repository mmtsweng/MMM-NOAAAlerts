# MMM-NOAAAlerts
Magic Mirror module to display current local weather warning and alerts

I built this module more by need than anything else -- the Seattle area where I live had been hit by some relatively severe weather, that have caused real problems for the area. While I wasn't caught off-guard this by this storm, I realized that the MM weather modules I had didn't emphasize local warnings, alerts, and weather watches. So I built a module expressly for solving that problem.

**MMM-NOAAAlerts**
Special Weather Statement:
![Warning.png](https://lh3.googleusercontent.com/u/0/drive-viewer/AFDK6gPV45GV5zEDzP-HqwTzxDEk1-8k-Vj8dd2CE12qRxLcTvVG5HtqRVNoLyz2mkDnEcXmk95XCcFHICqwG191LyxBP4rlUg=w1870-h993) 

Flood Warning:
![Flood.png](https://lh3.googleusercontent.com/u/0/drive-viewer/AFDK6gOgA5fX27DFSv1HLobd4aHPUc4YAK-8yXMxVHTAfFOfzyZRS7tUl754fUtIRXVixUCAL4JQ1s8tg2ri0bLPb60em8Y1Xw=w1870-h993) 

### USING THE MODULE
*Standard installation:*
````
git clone https://github.com/mmtsweng/MMM-NOAAAlerts
cd MMM-NOAAAlerts
npm install 
````

*Basic configuration:*
````
{
  module: "MMM-NOAAAlerts",
  position: "top_bar",
  config: {
      userAgent: "Magic Mirror (xxxxxxxxxxxx@gmail.com)" //Custom contact information
      APIURL: "https://api.weather.gov/alerts/active?point=47.593,-122.333", //See below for other options
      debug: false, // [Optional] Print extended debugging logs to the console
      rotateInterval: 20*1000, 
      updateInterval: 30*60*1000, // [Optional] How often to ping the API for more data
      }
},
````

NOAA provides [a free API](https://www.weather.gov/documentation/services-web-api) to retrieve weather alerts, which this API uses. There is no registration required. 
There are multiple ways to set the forecast area, and NOAA provides through [documentation](https://www.weather.gov/media/documentation/docs/NWS_Geolocation.pdf) if you need extensive help. But the basics are:


| **Option** | **URL** |
| --- | --- |
| By State | `https://api.weather.gov/alerts/active?area={state}` |
| By [Zone](https://alerts.weather.gov/cap/wa.php?x=2) | `https://api.weather.gov/alerts/active?zone={zone}` |
| By Lat/Long | `https://api.weather.gov/points/{latitude},{longitude}` |
| By Grid | `https://api.weather.gov/gridpoints/{office}/{grid X},{grid Y}/forecast` |


NOAA requires that a User-Agent header be provided. Please set your own custom agent in the config with unique contact information (the suggested header is: `User-Agent: (myweatherapp.com, contact@myweatherapp.com) `, so following that format makes sense.

## Configuration Options
| **Option** | **Default** | **Description** |
| --- | --- | --- |
| updateInterval | 30 minutes | [Optional] How often to request data from the API|
| rotateInterval | 15 seconds | [Optional] How often to rotate to the next alarm/statement |
| APIURL | `https://api.weather.gov/alerts/active?point=47.593,-122.333` | NOAA API call |
| userAgent | MagicMirrorMMTSWENG | API requires a User-Agent Header. This configuration allows for unique identification of the use |
| rotateInterval | 15 seconds | [Optional] How often to switch to the next alert/alarm |
| `debug` | `false` | [Optional] Render extensive debug information to the console to validate functionality |
