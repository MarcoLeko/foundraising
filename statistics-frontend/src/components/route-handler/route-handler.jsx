import React, { lazy, Suspense, useCallback } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { responsiveFontSizes, ThemeProvider } from "@material-ui/core/styles";
import { useUiContext } from "../../hooks/use-ui-context";
import { Container, CssBaseline } from "@material-ui/core";
import { Header } from "../header/header";
import "../../styles.scss";
import { Footer } from "../footer/footer";
import { getMaterialUiTheme } from "../../material-ui-theme";
import { MobileNavigation } from "../mobile-navigation/mobile-navigation";
import AppNotifier from "../app-notifier/app-notifier";
import { RecentQueriesContainer } from "../recent-queries-container/recent-queries-container";
import { Loader } from "../loader/loader";
import clsx from "clsx";
import { setSidebarOpen } from "../../context/ui-actions";

/** Lazy load components which are assigned to a route in order to split the total bundle size.
 * In addition the app description modal can also be lazy loaded by react  **/
const Home = lazy(() => import("../home/home"));
const QueryBuilder = lazy(() => import("../query-builder/query-builder"));
const Legal = lazy(() => import("../legal/legal"));
const AppDescriptionModal = lazy(() =>
  import("../app-description-modal/app-description-modal")
);

function ContentShiftPanel({ isSidebarOpen, closeSidebar, children }) {
  return (
    <Container
      disableGutters
      onClick={closeSidebar}
      className={clsx("content-panel", isSidebarOpen && "content-shift-panel")}
    >
      {children}
    </Container>
  );
}

function RouteHandler() {
  const {
    theme,
    canShowRecentQueries,
    isSidebarOpen,
    dispatch,
  } = useUiContext();

  const dispatchSidebarState = useCallback(
    function (args) {
      dispatch(setSidebarOpen(args));
    },
    [dispatch]
  );

  function closeSidebar() {
    if (isSidebarOpen) {
      dispatchSidebarState(false);
    }
  }

  return (
    <ThemeProvider theme={responsiveFontSizes(getMaterialUiTheme(theme))}>
      <CssBaseline>
        <Router>
          <Suspense fallback={<Loader show />}>
            <AppNotifier />
            <Header />
            <ContentShiftPanel
              isSidebarOpen={isSidebarOpen}
              closeSidebar={closeSidebar}
            >
              <RecentQueriesContainer show={canShowRecentQueries} />
              <AppDescriptionModal />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/legal" component={Legal} />
                <Route path="/query-builder" component={QueryBuilder} />
                <Route component={Home} />
              </Switch>
              <Footer />
            </ContentShiftPanel>
            <MobileNavigation />
          </Suspense>
        </Router>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default RouteHandler;
