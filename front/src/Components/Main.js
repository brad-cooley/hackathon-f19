import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, CircularProgress } from "@material-ui/core";
import CardGrid from "./CardGrid";
import * as firebase from "firebase";

const useStyles = makeStyles(theme => ({
  heroContent: {
    padding: theme.spacing(1, 0, 2),
    maxWidth: "100%"
  },
  load: {
    align: "center",
    paddingTop: 5
  }
}));

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

var db = firebase.firestore();

function distance(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 0.99999969062;
    return dist;
  }
}

navigator.geolocation.getCurrentPosition(position => {
  startupQuery(position.coords.latitude, position.coords.longitude);
});

function startupQuery(lat = 0, lon = 0) {
  // eslint-disable-next-line no-undef
  var startTime = moment()
    .subtract(12, "hours")
    .toDate();

  console.log("Places with 15 miles of you");
  let data = [];

  db.collection("venues")
    .get()
    .then(venues => {
      venues.forEach(venue => {
        var ven_loc = venue.data().location;
        var miles = distance(ven_loc.latitude, ven_loc.longitude, lat, lon);

        if (miles < 15) {
          var newVenueObj = { venue: venue.data(), checkins: [] };
          newVenueObj.venue.id = venue.id;
          db.collection(`venues/${venue.id}/checkins`)
            .where("timestamp", ">", startTime)
            .get()
            .then(checkins => {
              checkins.forEach(checkin => {
                newVenueObj.checkins.push(checkin.data());
              });
            });
        }
        data.push(newVenueObj);

        console.log(newVenueObj);
      });
    });
}

export function sendCheckIn(venue_id) {
  db.collection("venues")
    .doc(venue_id)
    .collection("checkins")
    .add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      console.log("Check-in Successful!");
    });
}

export default function Main() {
  const classes = useStyles();
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let lat = 0,
      lon = 0;
    navigator.geolocation.getCurrentPosition(position => {
      lat = position.coords.latitude ? position.coords.latitude : 0;
      lon = position.coords.longitude ? position.coords.longitude : 0;
    });

    // eslint-disable-next-line no-undef
    var startTime = moment()
      .subtract(12, "hours")
      .toDate();
    db.collection("venues")
      .get()
      .then(venues => {
        let temp = [];
        venues.forEach(venue => {
          var ven_loc = venue.data().location;
          var miles = distance(ven_loc.latitude, ven_loc.longitude, lat, lon);

          if (miles < 15) {
            var newVenueObj = { venue: venue.data(), checkins: [] };
            newVenueObj.venue.id = venue.id;
            db.collection(`venues/${venue.id}/checkins`)
              .where("timestamp", ">", startTime)
              .get()
              .then(checkins => {
                checkins.forEach(checkin => {
                  newVenueObj.checkins.push(checkin.data());
                });
              });
            temp.push(newVenueObj);

            console.log(newVenueObj);
          }
        });
        setData(temp);
        setIsLoading(false);
      });
  }, []);

  return !isLoading ? (
    <React.Fragment>
      {console.log(data)}
      <div className={classes.heroContent}>
        <Container maxWidth="sm">
          <Typography
            component="h5"
            variant="h6"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Welcome to Hot List!
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="textSecondary"
            paragraph
          >
            This should be a blurb that says something like "Looking for
            something quiet or something loud? We've got it below. Don't forget
            to check in!" but sounds better.
          </Typography>
        </Container>
      </div>
      {console.log(data)}
      <CardGrid
        data={data
          .filter(value => Object.keys(value).length !== 0)
          .sort((a, b) => (a.checkins.length < b.checkins.length ? 1 : -1))}
        /*data.sort((a, b) =>
          a.checkInsToday < b.checkInsToday
            ? 1
            : a.checkInsToday === b.checkInsToday
            ? a.checkInsThisWeek < b.checkInsThisWeek
              ? 1
              : -1
            : -1
        )*/
      />
    </React.Fragment>
  ) : (
    <CircularProgress className={classes.load} />
  );
}
