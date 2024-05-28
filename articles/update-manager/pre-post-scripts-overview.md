---
title: An overview of pre and post events (preview) in your Azure Update Manager
description: This article provides an overview on pre and post events (preview) and its requirements.
ms.service: azure-update-manager
ms.date: 05/28/2024
ms.topic: conceptual
author: SnehaSudhir 
ms.author: sudhirsneha
---

# About pre and post events

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

The pre and post events in Azure Update Manager allow you to perform certain tasks automatically before and after a scheduled maintenance configuration. For example, using pre-and-post events, you can execute the following tasks on machines that are part of a schedule. The following list isn't exhaustive, and you can create pre and post events as pre your need.

 
## Sample tasks

The following are the scenarios where you can define pre and post events:

#### [Pre Events](#tab/preevent)

| **Scenario**| **Description**|
|----------|-------------|
|Turn on machines | Turn on the machine to apply updates.|
|Create snapshot | Disk snaps used to recover data.| 
|Notification email | Send a notification alert before patching is triggered. |
|Stop services | To stop services like Gateway services, NPExServices, SQL services etc.| 

#### [Post Event user scenarios](#tab/postevent)

| **Scenario**| **Description**|
|----------|-------------|
|Turn off | Turn off the machines after applying updates. | 
|Notifications | Send patch summary or an alert that patching is complete.|
|Start services | Start services like SQL, health services etc. |
|Reports| Post patching report.|
|Tag change | Change tags and occasionally, turns off with tag change.|

---

## Schedule execution order with pre and post events

For a given schedule, you have the option to include a pre-event, post-event, or both. Additionally, you can have multiple pre and/or post-events. The sequence of execution for a schedule with pre and post events is as follows: 

1. **Pre-event** - Tasks that run before the schedule maintenance window begins. For example - Turn on the machines prior to patching.
1. **Cancellation** - In this step, you can initiate the cancellation of the schedule run. Some scenarios where you might choose to cancel a schedule run include pre-event failures or pre-event did not complete execution.
1. **Schedule status** - The schedule run status does not include the pre and post event status. The success or failure status of a schedule run refers only to the update installation on the machines that are part of the schedule. If pre-event has failed and you called the cancellation API, the schedule run status is displayed as **cancelled**.

> [!NOTE]
> In Azure Update Manager, the pre-events run outside of the maintenance window and post events may run outside of the maintenance window. You must plan for this additional time required to complete the schedule execution on your machines. For more information, see [understand and create scheduled maintenance configurations in Azure Update Manager](scheduled-patching.md)

Update Manager uses Event Grid to create and manage pre and post events on scheduled maintenance configurations. In Event Grid, you can choose from event handlers such as Azure Webhooks, Azure Functions etc. to trigger your pre and post activity.

> [!NOTE]
> If you are using pre and  post events in Azure Automation Update Management and plan to move to Azure Update, we recommend that you use Azure Webhooks to Automation Runbooks. For more information, see [Tutorial: Create pre and post events using a webhook with Automation](tutorial-webhooks-using-runbooks.md)


## Timeline of schedules for pre and post events

**We recommend you to go through the following table to understand the timeline of the schedule for pre and post events.**

For example, if a maintenance schedule is set to start at **3:00 PM**, with the maintenance window of 3 hours and 55 minutes for **Guest** maintenance scope, The schedule has one pre-event and one post-event following are the details: 

| **Time**| **Details** |
|----------|-------------|
| 2:19 PM | Since the schedule run starts at 3:00 PM, you can modify the machines or scopes 40 mins before the start time (i.e) at 2:19 PM. </br> **Note** This applies if you are creating a new schedule or editing an existing schedule with a pre-event.
| 2:20 PM - 2:30 PM | Since the pre-event gets triggered at least 30mins prior, it can get triggered anytime between 2:20 PM to 2:30 PM. |
| 2:30 PM - 2:50 PM | The pre-event runs from 2:30 PM to 2:50 PM. The pre-event must complete the tasks by 2:50 PM. </br> **Note** If you have more than one pre-event configured, all the events must run within 20 minutes. If the pre-event continues to run beyond 20 mins or fails, you can choose to cancel the schedule run otherwise the patch installation proceeds irrespective of the pre-event run status.|
| 2:50 PM | The latest time that can invoke the cancellation API is 2:50 PM. **Note** If cancellation API fails to get invoked or hasn't been set up, the patch installation proceeds to run.|
| 3:00 PM | The schedule run is triggered at 3:00 PM |
| 6:55 PM | - At 6:55 PM, the schedule completes installing the updates during the 3 hours 55 mins maintenance window. </br> The post event will trigger at 6:55 PM once the updates are installed. </br> **Note** If you have defined a shorter maintenance window of 2 hours, the post maintenance event will trigger after 2 hours and if the update installation is completed before the stipulated time of 2 hours (i.e) 1 hours 50 mins, the post event will start immediately.

We recommend that you are watchful of the following:
+ If you're creating a new schedule or editing an existing schedule with a pre event, you need at least 40 minutes prior to the start of maintenance window (3PM in the above example) for the pre event to run otherwise it will lead to auto-cancellation of the current scheduled run.
+ Invoking a cancellation API from your script or code will cancel the schedule run and not the entire schedule.
+ The status of the pre and post event run can be checked in the event handler you chose.

## Next steps

- To learn on how to configure pre and post events or to cancel a schedule run, see [pre and post maintenance configuration events](manage-pre-post-events.md)
 