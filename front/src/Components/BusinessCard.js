import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { IconButton, Collapse, Popover, Grid } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import { sendCheckIn } from "./Main";

const useStyles = makeStyles(theme => ({
  card: {
    width: 345
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  cardContent: {
    paddingBottom: "0.1%"
  },
  popoverPadding: {
    padding: theme.spacing(2)
  }
}));

export default function BusinessCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [checkedIn, checkIn] = React.useState(false);
  const { data } = props;
  const { venue, checkins } = data;
  const openWith = ["Apple Maps", "Google Maps", "Uber", "Lyft", "Yelp"];

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handlePopoverClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handlePopoverClose2 = () => {
    setAnchorEl2(null);
  };

  const handleCheckIn = event => {
    if (!checkedIn) {
      checkIn(true);
      setAnchorEl2(event.currentTarget);
      sendCheckIn(venue.id);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? "simple-popover" : undefined;

  // eslint-disable-next-line no-undef
  var lastTwelve = moment()
    .subtract(12, "hours")
    .toDate();

  //eslint-disable-next-line no-undef
  var lastWeek = moment()
    .subtract(1, "week")
    .toDate();

  console.log(checkins);
  const checkInsThisWeek = checkins.filter(value => {
    return value.timestamp.toDate() > lastWeek.toDate();
  }).length;

  const checkInsToday = checkins.filter(
    value => value.timestamp.toDate() > lastTwelve.toDate()
  ).length;

  console.log(checkInsThisWeek);
  return (
    <Card className={classes.card}>
      <CardMedia
        component="img"
        alt={venue.name}
        height="140"
        image={venue.cover_photo}
        title={venue.name}
      />
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom variant="h5" component="h2">
          {venue.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {`Daily: ${checkedIn ? checkInsToday + 1 : checkInsToday}\tWeekly: ${
            checkedIn ? checkInsThisWeek + 1 : checkInsThisWeek
          }`}
        </Typography>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {venue.blurb}
          </Typography>
        </CardContent>
      </Collapse>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          color={checkedIn ? "default" : "primary"}
          onClick={handleCheckIn}
        >
          Check In
        </Button>
        <Popover
          id={id2}
          open={open2}
          anchorEl={anchorEl2}
          onClose={handlePopoverClose2}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          <Typography className={classes.popoverPadding}>
            Thanks for checking in!
          </Typography>
        </Popover>
        <Button
          size="small"
          variant="contained"
          color="primary"
          aria-describedby={id}
          onClick={handlePopoverClick}
        >
          Open With...
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
          >
            {openWith.map(str => (
              <Grid item key={str}>
                <Button color="primary" className={classes.popoverPadding}>
                  {str}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Popover>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
