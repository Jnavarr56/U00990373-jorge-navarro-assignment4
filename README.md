### Deployed
https://objective-torvalds-b005a1.netlify.com/

### Details

This web app locates the nearest subway stop and gets the current departure
times and updates them every few seconds, showing countdowns and a walking
route to the station from the user's current location as well as a photo of 
the station.

This web app uses the HERE Rest API and the google maps API (enabled for Places, Directions, Maps, Geocoding). For the HERE Rest API no whitelisting is needed but you will either need to unrestrict
the google credentials or whitelist the client.

### To Run

1) Add a .env file file with the following:
```
REACT_APP_HERE_APP_ID=your_credentials
REACT_APP_HERE_APP_CODE-your_credentials
REACT_APP_GOOGLE_API_KEY=your_credentials
```

2)
```
npm install
npm run start
```

### Warning

THIS APPLICATION ONLY WORKS IF THE CLIENT IS IN NYC.






