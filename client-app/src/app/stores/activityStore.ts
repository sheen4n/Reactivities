import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from './../models/activity';
import agent from '../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as { [key: string]: IActivity[] }));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const response = await agent.Activities.list();
            runInAction('loading acitivies', () => {
                response.forEach(activity => {
                    activity.date = activity.date.split(".")[0];
                    this.activityRegistry.set(activity.id, activity);
                });
            })

        } catch (error) {

        } finally {
            runInAction('loading activities - finally', () => {
                this.loadingInitial = false;
            });
        }

    };

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) { this.activity = activity; }
        else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction("Get Actiivty", () => {
                    this.activity = activity;
                });
            } catch (error) {
                console.log(error);
            } finally {
                runInAction("Get Actiivty - Finally", () => {
                    this.loadingInitial = false;
                });
            }
        }


    };

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    @action selectActivity = (id: string) => {
        this.activity = this.activityRegistry.get(id);
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('create activity', () => {
                this.activityRegistry.set(activity.id, activity);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction('create activity - finally', () => {
                this.submitting = false;
            });
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction('editing activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
            });

        } catch (error) {
            console.log(error);
        } finally {
            runInAction('editing activity - finally block', () => {
                this.submitting = false;
            });
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>,
        id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction('delete activity', () => {
                this.activityRegistry.delete(id);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction('delete activity - finally', () => {
                this.submitting = false;
                this.target = '';
            });
        }
    }




    @action clearActivity = () => {
        this.activity = null;
    }

}

export default createContext(new ActivityStore());