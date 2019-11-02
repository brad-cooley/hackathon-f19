import React from "react";
import { Grid } from "@material-ui/core";
import BusinessCard from "./BusinessCard";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  hideOverflow: {
    margin: 0,
    width: "100%"
  }
}));

export default function CardGrid(props) {
  const classes = useStyles();

  console.log(props.data);

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
      spacing={4}
      className={classes.hideOverflow}
    >
      {props.data.map(card => (
        <Grid item key={card.id} xs={12} sm={6} md={4}>
          <BusinessCard data={card} />
        </Grid>
      ))}
    </Grid>
  );
}
