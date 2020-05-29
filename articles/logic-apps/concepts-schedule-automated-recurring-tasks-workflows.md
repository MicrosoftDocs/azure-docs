---
title: Scheduling recurring tasks and workflows in Azure Logic Apps
description: An overview about scheduling recurring automated tasks, processes, and workflows with Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: deli, jonfan, logicappspm
ms.topic: conceptual
ms.date: 03/25/2020
---

# Schedule and run recurring automated tasks, processes, and workflows with Azure Logic Apps

Logic Apps helps you create and run automated recurring tasks and processes on a schedule. By creating a logic app workflow that starts with a built-in Recurrence trigger or Sliding Window trigger, which are Schedule-type triggers, you can run tasks immediately, at a later time, or on a recurring interval. You can call services inside and outside Azure, such as HTTP or HTTPS endpoints, post messages to Azure services such as Azure Storage and Azure Service Bus, or get files uploaded to a file share. With the Recurrence trigger, you can also set up complex schedules and advanced recurrences for running tasks. To learn more about the built-in Schedule triggers and actions, see [Schedule triggers](#schedule-triggers) and [Schedule actions](#schedule-actions). 

> [!TIP]
> You can schedule and run recurring workloads without creating a separate logic app for each scheduled job and running into the [limit on workflows per region and subscription](../logic-apps/logic-apps-limits-and-config.md#definition-limits). Instead, you can use the logic app pattern that's created by the [Azure QuickStart template: Logic Apps job scheduler](https://github.com/Azure/azure-quickstart-templates/tree/master/301-logicapps-jobscheduler/).
>
> The Logic Apps job scheduler template creates a CreateTimerJob logic app that calls a TimerJob logic app. You can then call the CreateTimerJob logic app as an API by making an HTTP request and passing a schedule as input for the request. Each call to the CreateTimerJob logic app also calls the TimerJob logic app, which creates a new TimerJob instance that continuously runs based on the specified schedule or until meeting a specified limit. That way, you can run as many TimerJob instances as you want without worrying about workflow limits because instances aren't individual logic app workflow definitions or resources.

This list shows some example tasks that you can run with the Schedule built-in triggers:

* Get internal data, such as run a SQL stored procedure every day.

* Get external data, such as pull weather reports from NOAA every 15 minutes.

* Send report data, such as email a summary for all orders greater than a specific amount in the past week.

* Process data, such as compress today's uploaded images every weekday during off-peak hours.

* Clean up data, such as delete all tweets older than three months.

* Archive data, such as push invoices to a backup service at 1:00 AM every day for the next nine months.

You can also use the Schedule built-in actions to pause your workflow before the next action runs, for example:

* Wait until a weekday to send a status update over email.

* Delay the workflow until an HTTP call has time to finish before resuming and retrieving the result.

This article describes the capabilities for the Schedule built-in triggers and actions.

<a name="schedule-triggers"></a>

## Schedule triggers

You can start your logic app workflow by using the Recurrence trigger or Sliding Window trigger, which isn't associated with any specific service or system. These triggers start and run your workflow based on your specified recurrence where you select the interval and frequency, such as the number of seconds, minutes, hours, days, weeks, or months. You can also set the start date and time as well as the time zone. Each time that a trigger fires, Logic Apps creates and runs a new workflow instance for your logic app.

Here are the differences between these triggers:

* **Recurrence**: Runs your workflow at regular time intervals based on your specified schedule. If recurrences are missed, the Recurrence trigger doesn't process the missed recurrences but restarts recurrences with the next scheduled interval. You can specify a start date and time as well as the time zone. If you select "Day", you can specify hours of the day and minutes of the hour, for example, every day at 2:30. If you select "Week", you can also select days of the week, such as Wednesday and Saturday. For more information, see [Create, schedule, and run recurring tasks and workflows with the Recurrence trigger](../connectors/connectors-native-recurrence.md).

* **Sliding Window**: Runs your workflow at regular time intervals that handle data in continuous chunks. If recurrences are missed, the Sliding Window trigger goes back and processes the missed recurrences. You can specify a start date and time, time zone, and a duration to delay each recurrence in your workflow. This trigger doesn't support advanced schedules, for example, specific hours of the day, minutes of the hour, and days of the week. For more information, see [Create, schedule, and run recurring tasks and workflows with the Sliding Window trigger](../connectors/connectors-native-sliding-window.md).

<a name="schedule-actions"></a>

## Schedule actions

After any action in your logic app workflow, you can use the Delay and Delay Until actions to make your workflow wait before the next action runs.

* **Delay**: Wait to run the next action for the specified number of time units, such as seconds, minutes, hours, days, weeks, or months. For more information, see [Delay the next action in workflows](../connectors/connectors-native-delay.md).

* **Delay until**: Wait to run the next action until the specified date and time. For more information, see [Delay the next action in workflows](../connectors/connectors-native-delay.md).

## Patterns for start date and time

<a name="start-time"></a>

Here are some patterns that show how you can control recurrence with the start date and time, and how the Logic Apps service runs these recurrences:

| Start time | Recurrence without schedule | Recurrence with schedule (Recurrence trigger only) |
|------------|-----------------------------|----------------------------------------------------|
| {none} | Runs the first workload instantly. <p>Runs future workloads based on the last run time. | Runs the first workload instantly. <p>Runs future workloads based on the specified schedule. |
| Start time in the past | **Recurrence** trigger: Calculates run times based on the specified start time and discards past run times. Runs the first workload at the next future run time. <p>Runs future workloads based on calculations from the last run time. <p><p>**Sliding Window** trigger: Calculates run times based on the specified start time and honors past run times. <p>Runs future workloads based on calculations from the specified start time. <p><p>For more explanation, see the example following this table. | Runs the first workload *no sooner* than the start time, based on the schedule calculated from the start time. <p>Runs future workloads based on the specified schedule. <p>**Note:** If you specify a recurrence with a schedule, but don't specify hours or minutes for the schedule, then future run times are calculated using the hours or minutes, respectively, from the first run time. |
| Start time at present or in the future | Runs the first workload at the specified start time. <p>Runs future workloads based on calculations from the last run time. | Runs the first workload *no sooner* than the start time, based on the schedule calculated from the start time. <p>Runs future workloads based on the specified schedule. <p>**Note:** If you specify a recurrence with a schedule, but don't specify hours or minutes for the schedule, then future run times are calculated using the hours or minutes, respectively, from the first run time. |
||||

> [!IMPORTANT]
> When recurrences don't specify advanced scheduling options, future recurrences are based on the last run time.
> The start times for these recurrences might drift due to factors such as latency during storage calls. 
> To make sure that your logic app doesn't miss a recurrence, especially when the frequency is in days or longer, 
> use one of these options:
> 
> * Provide a start time for the recurrence.
> 
> * Specify the hours and minutes for when to run the recurrence by using the 
> **At these hours** and **At these minutes** properties.
> 
> * Use the [Sliding Window trigger](../connectors/connectors-native-sliding-window.md), 
> rather than the Recurrence trigger.

*Example for past start time and recurrence but no schedule*

Suppose the current date and time is September 8, 2017 at 1:00 PM. You specify the start date and time as September 7, 2017 at 2:00 PM, which is in the past, and a recurrence that runs every two days.

| Start time | Current time | Recurrence | Schedule |
|------------|--------------|------------|----------|
| 2017-09-**07**T14:00:00Z <br>(2017-09-**07** at 2:00 PM) | 2017-09-**08**T13:00:00Z <br>(2017-09-**08** at 1:00 PM) | Every two days | {none} |
|||||

For the Recurrence trigger, the Logic Apps engine calculates run times based on the start time, discards past run times, uses the next future start time for the first run, and calculates future runs based on the last run time.

Here's how this recurrence looks:

| Start time | First run time | Future run times |
|------------|----------------|------------------|
| 2017-09-**07** at 2:00 PM | 2017-09-**09** at 2:00 PM | 2017-09-**11** at 2:00 PM </br>2017-09-**13** at 2:00 PM </br>2017-09-**15** at 2:00 PM </br>and so on... |
||||

So, no matter how far in the past you specify the start time, for example, 2017-09-**05** at 2:00 PM or 2017-09-**01** at 2:00 PM, your first run always uses the next future start time.

For the Sliding Window trigger, the Logic Apps engine calculates run times based on the start time, honors past run times, uses the start time for the first run, and calculates future runs based on the start time.

Here's how this recurrence looks:

| Start time | First run time | Future run times |
|------------|----------------|------------------|
| 2017-09-**07** at 2:00 PM | 2017-09-**07** at 2:00 PM | 2017-09-**09** at 2:00 PM </br>2017-09-**11** at 2:00 PM </br>2017-09-**13** at 2:00 PM </br>2017-09-**15** at 2:00 PM </br>and so on... |
||||

So, no matter how far in the past you specify the start time, for example, 2017-09-**05** at 2:00 PM or 2017-09-**01** at 2:00 PM, your first run always uses the specified start time.

<a name="example-recurrences"></a>

## Example recurrences

Here are various example recurrences that you can set up for the triggers that support the options:

| Trigger | Recurrence | Interval | Frequency | Start time | On these days | At these hours | At these minutes | Note |
|---------|------------|----------|-----------|------------|---------------|----------------|------------------|------|
| Recurrence, <br>Sliding Window | Run every 15 minutes (no start date and time) | 15 | Minute | {none} | {unavailable} | {none} | {none} | This schedule starts immediately, then calculates future recurrences based on the last run time. |
| Recurrence, <br>Sliding Window | Run every 15 minutes (with start date and time) | 15 | Minute | *startDate*T*startTime*Z | {unavailable} | {none} | {none} | This schedule doesn't start *any sooner* than the specified start date and time, then calculates future recurrences based on the last run time. |
| Recurrence, <br>Sliding Window | Run every hour, on the hour (with start date and time) | 1 | Hour | *startDate*Thh:00:00Z | {unavailable} | {none} | {none} | This schedule doesn't start *any sooner* than the specified start date and time. Future recurrences run every hour at the "00" minute mark, which is calculated from the start time. <p>If the frequency is "Week" or "Month", this schedule respectively runs only one day per week or one day per month. |
| Recurrence, <br>Sliding Window | Run every hour, every day (no start date and time) | 1 | Hour | {none} | {unavailable} | {none} | {none} | This schedule starts immediately and calculates future recurrences based on the last run time. <p>If the frequency is "Week" or "Month", this schedule respectively runs only one day per week or one day per month. |
| Recurrence, <br>Sliding Window | Run every hour, every day (with start date and time) | 1 | Hour | *startDate*T*startTime*Z | {unavailable} | {none} | {none} | This schedule doesn't start *any sooner* than the specified start date and time, then calculates future recurrences based on the last run time. <p>If the frequency is "Week" or "Month", this schedule respectively runs only one day per week or one day per month. |
| Recurrence, <br>Sliding Window | Run every 15 minutes past the hour, every hour (with start date and time) | 1 | Hour | *startDate*T00:15:00Z | {unavailable} | {none} | {none} | This schedule doesn't start *any sooner* than the specified start date and time. Future recurrences run at the "15" minute mark, which is calculated from the start time, so at 00:15 AM, 1:15 AM, 2:15 AM, and so on. |
| Recurrence | Run every 15 minutes past the hour, every hour (no start date and time) | 1 | Day | {none} | {unavailable} | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 | 15 | This schedule runs at 00:15 AM, 1:15 AM, 2:15 AM, and so on. Also, this schedule is equivalent to a frequency of "Hour" and a start time with "15" minutes. |
| Recurrence | Run every 15 minutes at the specified minute marks (no start date and time). | 1 | Day | {none} | {unavailable} | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 | 0, 15, 30, 45 | This schedule doesn't start until the next specified 15-minute mark. |
| Recurrence | Run daily at 8 AM *plus* the minute-mark from when you save your logic app | 1 | Day | {none} | {unavailable} | 8 | {none} | Without a start date and time, this schedule runs based on the time when you save the logic app (PUT operation). |
| Recurrence | Run daily at 8:00 AM (with start date and time) | 1 | Day | *startDate*T08:00:00Z | {unavailable} | {none} | {none} | This schedule doesn't start *any sooner* than the specified start date and time. Future occurrences run daily at 8:00 AM. | 
| Recurrence | Run daily at 8:00 AM (no start date and time) | 1 | Day | {none} | {unavailable} | 8 | 00 | This schedule runs at 8:00 AM every day. |
| Recurrence | Run daily at 8:00 AM and 4:00 PM | 1 | Day | {none} | {unavailable} | 8, 16 | 0 | |
| Recurrence | Run daily at 8:30 AM, 8:45 AM, 4:30 PM, and 4:45 PM | 1 | Day | {none} | {unavailable} | 8, 16 | 30, 45 | |
| Recurrence | Run every Saturday at 5:00 PM (no start date and time) | 1 | Week | {none} | "Saturday" | 17 | 0 | This schedule runs every Saturday at 5:00 PM. |
| Recurrence | Run every Saturday at 5:00 PM (with start date and time) | 1 | Week | *startDate*T17:00:00Z | "Saturday" | {none} | {none} | This schedule doesn't start *any sooner* than the specified start date and time, in this case, September 9, 2017 at 5:00 PM. Future recurrences run every Saturday at 5:00 PM. |
| Recurrence | Run every Tuesday, Thursday at 5 PM *plus* the minute-mark from when you save your logic app| 1 | Week | {none} | "Tuesday", "Thursday" | 17 | {none} | |
| Recurrence | Run every hour during working hours. | 1 | Week | {none} | Select all days except Saturday and Sunday. | Select the hours of the day that you want. | Select any minutes of the hour that you want. | For example, if your working hours are 8:00 AM to 5:00 PM, then select "8, 9, 10, 11, 12, 13, 14, 15, 16, 17" as the hours of the day *plus* "0" as the minutes of the hour. |
| Recurrence | Run once every day on weekends | 1 | Week | {none} | "Saturday", "Sunday" | Select the hours of the day that you want. | Select any minutes of the hour as appropriate. | This schedule runs every Saturday and Sunday at the specified schedule. |
| Recurrence | Run every 15 minutes biweekly on Mondays only | 2 | Week | {none} | "Monday" | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 | 0, 15, 30, 45 | This schedule runs every other Monday at every 15-minute mark. |
| Recurrence | Run every month | 1 | Month | *startDate*T*startTime*Z | {unavailable} | {unavailable} | {unavailable} | This schedule doesn't start *any sooner* than the specified start date and time and calculates future recurrences on the start date and time. If you don't specify a start date and time, this schedule uses the creation date and time. |
| Recurrence | Run every hour for one day per month | 1 | Month | {see note} | {unavailable} | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 | {see note} | If you don't specify a start date and time, this schedule uses the creation date and time. To control the minutes for the recurrence schedule, specify the minutes of the hour, a start time, or use the creation time. For example, if the start time or creation time is 8:25 AM, this schedule runs at 8:25 AM, 9:25 AM, 10:25 AM, and so on. |
|||||||||

<a name="run-once"></a>

## Run one time only

If you want to run your logic app only at one time in the future, you can use the **Scheduler: Run once jobs** template. After you create a new logic app but before opening the Logic Apps Designer, under the **Templates** section, from the **Category** list, select **Schedule**, and then select this template:

![Select "Scheduler: Run once jobs" template](./media/concepts-schedule-automated-recurring-tasks-workflows/choose-run-once-template.png)

Or, if you can start your logic app with the **When a HTTP request is received - Request** trigger, and pass the start time as a parameter for the trigger. For the first action, use the **Delay until - Schedule** action, and provide the time for when the next action starts running.

## Next steps

* [Create, schedule, and run recurring tasks and workflows with the Recurrence trigger](../connectors/connectors-native-recurrence.md)
* [Create, schedule, and run recurring tasks and workflows with the Sliding Window trigger](../connectors/connectors-native-sliding-window.md)
* [Pause workflows with delay actions](../connectors/connectors-native-delay.md)
