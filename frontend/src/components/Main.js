import React from "react";
import axios from "axios";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import TimelineIcon from "@material-ui/icons/Timeline";
import { withStyles } from "@material-ui/styles";
import { Box, Button, Card, CardContent, CssBaseline } from "@material-ui/core";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";

import ControlPanel from "./ControlPanel";
import { getData, updateDataName } from "../actions";
import Snackbar from "@material-ui/core/Snackbar";
import Detail from "./Detail";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {},
  menuButton: {
    marginRight: theme.spacing(2)
  },
  content: {
    width: "100%",
    flexGrow: 1,
    marginTop: theme.spacing(7),
    backgroundColor: "#EDF0F2"
  },
  tabBar: {
    backgroundColor: "#D2DBE0"
  },
  tab: {
    maxWidth: 170
  },
  rootGrid: {
    padding: 0
  },
  controlPanel: {
    margin: theme.spacing(1)
  },
  detail: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
});

class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.getData();
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar variant="dense">
            <IconButton
              color="inherit"
              aria-label="just a logo"
              className={classes.menuButton}
              edge="start"
              onClick={() => {}}
            >
              <TimelineIcon />
            </IconButton>
            <Typography variant="h5" noWrap>
              Graph-based Ranking Vulnerability Analysis
            </Typography>
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <Grid container>
            <Grid item xs={4}>
              <Box className={classes.controlPanel}>
                <ControlPanel />
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Box className={classes.detail}>
                <Detail />
              </Box>
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default connect(null, { getData })(withStyles(styles)(Main));