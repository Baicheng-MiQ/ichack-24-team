Currently uses the Terra API to obtain a JSON of data from a wearable device and parse the heart rate data

Doesn't work with a live wearable at the moment, but you can use the Terra API dashboard to send mock data to the web app:
* Install ngrok
* Run the web app locally with `flask --app get_heart_rate_data run`
* Run `ngrok http <PORT>` where PORT is the port the app is running on. Copy the link returned by ngrok.
* On the Terra API dashboard go to connections and add a new webhook destination. The host should be your pasted link followed by `/heartrate`
* Click apply then go to "Generate" tab in "Tools". Select "Apple Health2 as the data source, Select "Daily" and click generate test data. Click "Send data to Destination". The app running locally should recieve and parse the data. 

Firstly, this is not a stream of data, just a single JSON containing heart rate recordings from various time stamps. To get this to work with live data, the API authentication and user authentication will need to be implemented, but worst case we can just run it with the test data.

Also see example_heart_rate_data.json for an example of the expected return format.