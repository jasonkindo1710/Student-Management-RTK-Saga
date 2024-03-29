import { makeStyles, Box, Paper, Typography } from "@material-ui/core";
import * as React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexFLow: "row nowrap",
    justifyContent: "space-between",
    alignItems: "center",

    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`
  },
}));

export interface StatisticItemProps {
  icon: React.ReactElement;
  label: string;
  value: string | number;
}

export default function StatisticItem({ icon, value, label }: StatisticItemProps) {
  const classes = useStyles();
  return (
    <div>
      <Paper className={classes.root}>
        <Box>{icon}</Box>
        <Box>
          <Typography variant="h5" align="right">{value}</Typography>
          <Typography variant="caption">{label}</Typography>
        </Box>
      </Paper>
    </div>
  );
}
