---
title: An overview of pre and post events (preview) in your Azure Update Manager
description: This article provides an overview on pre and post events and its requirements.
ms.service: azure-update-manager
ms.date: 07/24/2024
ms.topic: conceptual
author: SnehaSudhir 
ms.author: sudhirsneha
---

# About pre and post events (preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

The pre and post events in Azure Update Manager allow you to perform certain tasks automatically before and after a scheduled maintenance configuration. For more information on how to create schedule maintenance configurations, see [Schedule recurring updates for machines by using the Azure portal and Azure Policy](scheduled-patching.md). For example, using pre and post events, you can execute the following tasks on machines that are part of a schedule. The following list isn't exhaustive, and you can create pre and post events as per your need.

 
## Sample tasks

The following are the scenarios where you can define pre and post events:

#### [Pre-events](#tab/preevent)

| **Scenario**| **Description**|
|----------|-------------|
|Turn on machines | Turn on the machine to apply updates.|
|Create snapshot | Disk snaps used to recover data.| 
|Notification email | Send a notification alert before triggering a patch. |
|Stop services | Stop services like Gateway services, NPExServices, SQL services etc.| 

#### [Post-events](#tab/postevent)

| **Scenario**| **Description**|
|----------|-------------|
|Turn off | Turn off the machines after applying updates. | 
|Notifications | Send patch summary or an alert that patching is complete.|
|Start services | Start services like SQL, health services etc. |
|Reports| Post patching report.|
|Tag change | Change tags and occasionally, turns off with tag change.|

---

## Schedule execution order with pre and post events

For a given schedule, you can include a pre-event, post-event, or both. Additionally, you can have multiple pre and/or post-events. The sequence of execution for a schedule with pre and post events is as follows: 

1. **Pre-event** - Tasks that run before the schedule maintenance window begins. For example - Turn on the machines before patching.
1. **Cancellation** - In this step, you can initiate the cancellation of the schedule run. Some scenarios where you might choose to cancel a schedule run include pre-event failures or pre-event didn't complete execution.

   > [!NOTE]
   > You must initiate cancellation as part of the pre-event; Azure Update Manager or maintenance configuration will not automatically cancel the schedule. If you fail to cancel, the schedule run will proceed with installing updates during the user-defined maintenance window.

1. **Updates installation** - Updates are installed as part of the user-defined schedule maintenance window.
1. **Post-event** - The post-event runs immediately after updates are installed. It occurs either within the maintenance window if update installation is complete and there's window left or outside the window if the maintenance window has ended. For example: Turn off the VMs post completion of the patching.

   > [!NOTE]
   > In Azure Update Manager, the pre-events run outside of the maintenance window and post events may run outside of the maintenance window. You must plan for this additional time required to complete the schedule execution on your machines. 

1. **Schedule status** - The success or failure status of a schedule run refers only to the update installation on the machines that are part of the schedule. The schedule run status doesn't include the pre and post event status. If pre-event has failed and you called the cancellation API, the schedule run status is displayed as **canceled**.  

   
   Azure Update Manager uses [Event Grid](../event-grid/overview.md) to create and manage pre and post events on scheduled maintenance configurations. In Event Grid, you can choose from event handlers such as Azure Webhooks, Azure Functions etc., to trigger your pre and post activity.

   :::image type="content" source="./media/pre-post-scripts-overview/overview.png" alt-text="Screenshot that shows the sequence of execution for a schedule with pre and post." lightbox="./media/pre-post-scripts-overview/overview.png":::

   > [!NOTE]
   > If you're using Runbooks in pre and post events in Azure Automation Update management and plan to reuse them in Azure Update Manager, we recommend that you use Azure Webhooks linked to Automation Runbooks. [Learn more](tutorial-webhooks-using-runbooks.md).

## Timeline of schedules for pre and post events


:::image type="content" source="./media/pre-post-scripts-overview/pre-post-schedule-timeline.png" alt-text="Screenshot that shows the timeline of schedules with pre and post." lightbox="./media/pre-post-scripts-overview/pre-post-schedule-timeline.png":::


We recommend you go through the following table to understand the timeline of the schedule for pre and post events.

For example, if a maintenance schedule is set to start at **3:00 PM**, with the maintenance window of 3 hours and 55 minutes for **Guest** maintenance scope. The schedule has one pre-event and one post-event and following are the details: 


| **Time**| **Details** |
|----------|-------------|
| 2:19 PM     | Since the schedule run starts at 3:00 PM, you can modify the machines or scopes 40 mins before the start time (i.e) at 2:19 PM. </br> **Note** This applies if you're creating a new schedule or editing an existing schedule with a pre-event.
| 2:20 PM - 2:30 PM     | Since the pre-event gets triggered at least 30 mins prior, it can get triggered anytime between 2:20 PM to 2:30 PM. |
| 2:30 PM - 2:50 PM    | The pre-event runs from 2:30 PM to 2:50 PM. The pre-event must complete the tasks by 2:50 PM. </br> **Note** If you have more than one pre-event configured, all the events must run within 20 minutes. In case of multiple pre-events, all of them will execute independently of each other. You can customize as per your needs by defining the logic in the pre-events. For example, if you want two pre-events to run sequentially, you can include a delayed start time in your second pre-event’s logic. </br> If the pre-event continues to run beyond 20 mins or fails, you can choose to cancel the schedule run otherwise the patch installation proceeds irrespective of the pre-event run status.|
| 2:50 PM   | The latest time that can invoke the cancellation API is 2:50 PM. </br> **Note** If cancellation API fails to get invoked or hasn't been set up, the patch installation proceeds to run.|
| 3:00 PM   | The schedule run is triggered at 3:00 PM. |
| 6:55 PM   | At 6:55 PM, the schedule completes installing the updates during the 3 hours 55-mins maintenance window. </br> The post event triggers at 6:55 PM once the updates are installed. </br> **Note** If you have defined a shorter maintenance window of 2 hours, the post maintenance event will trigger after 2 hours and if the update installation is completed before the stipulated time of 2 hours (i.e) 1 hours 50 mins, the post event will start immediately.

We recommend that you're watchful of the following:
- If you're creating a new schedule or editing an existing schedule with a pre-event, you need at least 40 minutes prior to the start of maintenance window (3:00 PM in the above example) for the pre-event to run otherwise it leads to auto-cancellation of the current scheduled run.
- Invoking a cancellation API from your script or code cancels the schedule run and not the entire schedule.
- The status of the pre and post event run can be checked in the event handler you chose.

## Next steps
- To learn on how to create pre and post events, see [pre and post maintenance configuration events](pre-post-events-schedule-maintenance-configuration.md).
- To learn on how to configure pre and post events or to cancel a schedule run, see [pre and post maintenance configuration events](manage-pre-post-events.md).
- To learn how to use pre and post events to turn on and off your VMs using Webhooks, refer [here](tutorial-webhooks-using-runbooks.md).
- To learn how to use pre and post events to turn on and off your VMs using Azure Functions, refer [here](tutorial-using-functions.md).
 