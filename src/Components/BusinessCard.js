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
  const { venue, checkins } = props;
  const openWith = ["Apple Maps", "Google Maps", "Uber", "Lyft", "Yelp"];

  // eslint-disable-next-line no-undef
  var lastTwelve = moment()
    .subtract(12, "hours")
    .toDate();

  //eslint-disable-next-line no-undef
  var lastWeek = moment()
    .subtract(1, "week")
    .toDate();

  let checkInsThisWeek = 0;

  let checkInsToday = 0;

  React.useEffect(() => {
    checkInsToday = checkins.filter(value => value.timestamp > lastTwelve)
      .length;
    checkInsThisWeek = checkins.filter(value => {
      return value.timestamp > lastWeek;
    }).length;
  }, [checkins, venue]);

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

  const handleExternal = event => {
    window.open(
      `https://lmgtfy.com/?q=${venue.friendly_addr.replace(" ", "_")}&s=g`
    );
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? "simple-popover" : undefined;

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
          {`Daily: ${
            checkedIn ? venue.checkins_day + 1 : venue.checkins_day
          }\tWeekly: ${
            checkedIn ? venue.checkins_week + 1 : venue.checkins_week
          }`}
        </Typography>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {venue.blurb}
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            {venue.friendly_addr}
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
                <Button
                  color="primary"
                  className={classes.popoverPadding}
                  onClick={handleExternal}
                >
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
