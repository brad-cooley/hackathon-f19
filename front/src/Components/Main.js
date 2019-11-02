import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, CircularProgress } from "@material-ui/core";
import CardGrid from "./CardGrid";
import { cardTestData } from "../Util/TestData";
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

export default function Main() {
  const classes = useStyles();
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    db.collection("venues")
      .get()
      .then(res => {
        let temp = [];
        res.forEach(r => {
          console.log(r.data());
          temp.push(r.data());
        });
        setData(temp);
        setIsLoading(false);
      });
  }, []);

  return !isLoading ? (
    <React.Fragment>
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
        data={data}
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
