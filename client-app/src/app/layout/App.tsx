import React, { Fragment, useState, useEffect, SyntheticEvent } from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "./../models/activity";
import { NavBar } from "../../features/nav/NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import { LoadingComponent } from "./LoadingComponent";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = async (activity: IActivity) => {
    setSubmitting(true);
    await agent.Activities.create(activity);
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setEditMode(false);
    setSubmitting(false);
  };

  const handleEditActivity = async (activity: IActivity) => {
    setSubmitting(true);
    await agent.Activities.update(activity);
    setActivities([...activities.filter(a => a.id !== activity.id), activity]);
    setSelectedActivity(activity);
    setEditMode(false);
    setSubmitting(false);
  };

  const handleDeleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    await agent.Activities.delete(id);
    setActivities([...activities.filter(a => a.id !== id)]);
    setSubmitting(false);
  };

  useEffect(() => {
    // Create an scoped async function in the hook
    async function loadActivities() {
      let activities: IActivity[] = [];
      const response = await agent.Activities.list();
      response.forEach(activity => {
        activity.date = activity.date.split(".")[0];
        activities.push(activity);
      });
      // const activities = response.data;
      setActivities(activities);
      setLoading(false);
    }
    loadActivities();
  }, []);

  if (loading) return <LoadingComponent content="Loading activities..." />;

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          target={target}
          submitting={submitting}
        />
      </Container>
    </Fragment>
  );
};

export default App;
