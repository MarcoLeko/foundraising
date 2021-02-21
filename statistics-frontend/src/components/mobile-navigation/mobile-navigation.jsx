import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Hidden,
} from "@material-ui/core";
import { navItems } from "../shared/navItems";
import { useUiContext } from "../../hooks/use-ui-context";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import "./mobile-navgation.scss";
import { grey } from "@material-ui/core/colors";

const useStyles = (theming) =>
  makeStyles(() => ({
    root: {
      backgroundColor: theming === "dark" ? grey[900] : grey[100],
    },
    selectedLabel: {
      fontSize: "0.75rem !important",
    },
  }));

export function MobileNavigation() {
  const { theme } = useUiContext();
  const history = useHistory();
  const classes = useStyles(theme)();

  const { activeTab, sidebarOpen } = useUiContext();

  function navigate(val) {
    history.push(navItems[val].link);
  }

  return (
    <Hidden smUp>
      <BottomNavigation
        className={clsx(
          "bottom-nav",
          classes.root,
          sidebarOpen ? "navigation-shift" : "navigation"
        )}
        value={activeTab}
        onChange={(e, val) => navigate(val)}
        showLabels
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.name}
            label={item.name}
            className="bottom-nav-item"
            icon={item.icon}
            classes={{ selected: classes.selectedLabel }}
          />
        ))}
      </BottomNavigation>
    </Hidden>
  );
}
