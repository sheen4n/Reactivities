import React, { Fragment, useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Container } from "semantic-ui-react";

import { NavBar } from "../../features/nav/NavBar";

import { LoadingComponent } from "./LoadingComponent";
import ActivityStore from "../stores/activityStore";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading activities..." />;

  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
};

export default observer(App);
