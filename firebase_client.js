// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDkr4-pv5Hf84JmJiOaNl9T9vqDR-D6fNQ",
    authDomain: "devfest-24557.firebaseapp.com",
   /* databaseURL: "https://devfest-24557.firebaseio.com", */
    projectId: "devfest-24557",
    /*storageBucket: "devfest-24557.appspot.com",
    messagingSenderId: "205291993209",*/
    appId: "1:205291993209:web:00bcf099bae983c9953ca8",
    measurementId: "G-2V3TFV6VNX"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.firestore()

function distance(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 0.99999969062
		return dist;
	}
}

navigator.geolocation.getCurrentPosition((position) => {
    startupQuery(lat = position.coords.latitude, lon = position.coords.longitude)
})

function startupQuery(lat = 0, lon = 0) {
    var startTime = moment().subtract(12, 'hours').toDate()

    console.log("Places with 15 miles of you")
    data = []

    db.collection('venues').get().then((venues) => {
        venues.forEach((venue) => {
            var ven_loc = venue.data().location
            var miles = distance(ven_loc.latitude, ven_loc.longitude, lat, lon)

            if (miles < 15) {
                var newVenueObj = {venue: venue.data(), checkins: []}
                newVenueObj.venue.id = venue.id
                db.collection(`venues/${venue.id}/checkins`).where('timestamp', '>', startTime).get().then((checkins) => {
                    checkins.forEach((checkin) => {
                        newVenueObj.checkins.push(checkin.data())
                    })
                    data.push(newVenueObj)

                    console.log(newVenueObj)
                })
            }
        })
    })
}

function checkIn(venue_id) {
    db.collection('venues').doc(venue_id).collection('checkins').add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log("Check-in Successful!")
    })
}