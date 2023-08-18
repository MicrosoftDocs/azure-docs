---
title: About schedules for recurring triggers in workflows
description: An overview about schedules for recurring workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 10/26/2022
---

# Schedules for recurring triggers in Azure Logic Apps workflows

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

Azure Logic Apps helps you create and run automated recurring workflows on a schedule. By creating a logic app workflow that starts with a built-in Recurrence trigger or Sliding Window trigger, which are Schedule-type triggers, you can run tasks immediately, at a later time, or on a recurring interval. You can call services inside and outside Azure, such as HTTP or HTTPS endpoints, post messages to Azure services such as Azure Storage and Azure Service Bus, or get files uploaded to a file share. With the Recurrence trigger, you can also set up complex schedules and advanced recurrences for running tasks. To learn more about the built-in Schedule triggers and actions, see [Schedule triggers](#schedule-triggers) and [Schedule actions](#schedule-actions). 

> [!NOTE]
> You can schedule and run recurring workloads without creating a separate logic app for each scheduled job and running into the [limit on workflows per region and subscription](../logic-apps/logic-apps-limits-and-config.md#definition-limits). Instead, you can use the logic app pattern that's created by the [Azure QuickStart template: Logic Apps job scheduler](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.logic/logicapps-jobscheduler/).
>
> The Azure Logic Apps job scheduler template creates a CreateTimerJob logic app that calls a TimerJob logic app. You can then call the CreateTimerJob logic app as an API by making an HTTP request and passing a schedule as input for the request. Each call to the CreateTimerJob logic app also calls the TimerJob logic app, which creates a new TimerJob instance that continuously runs based on the specified schedule or until meeting a specified limit. That way, you can run as many TimerJob instances as you want without worrying about workflow limits because instances aren't individual logic app workflow definitions or resources.

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

You can start your logic app workflow by using the [Recurrence trigger](../connectors/connectors-native-recurrence.md) or [Sliding Window trigger](../connectors/connectors-native-sliding-window.md), which isn't associated with any specific service or system. These triggers start and run your workflow based on your specified recurrence where you select the interval and frequency, such as the number of seconds, minutes, hours, days, weeks, or months. You can also set the start date and time along with the time zone. Each time that a trigger fires, Azure Logic Apps creates and runs a new workflow instance for your logic app.

Here are the differences between these triggers:

* **Recurrence**: Runs your workflow at regular time intervals based on your specified schedule. If the trigger misses recurrences, for example, due to disruptions or disabled workflows, the Recurrence trigger doesn't process the missed recurrences but restarts recurrences with the next scheduled interval.

  If you select **Day** as the frequency, you can specify the hours of the day and minutes of the hour, for example, every day at 2:30. If you select **Week** as the frequency, you can also select days of the week, such as Wednesday and Saturday. You can also specify a start date and time along with a time zone for your recurrence schedule. For more information about time zone formatting, see [Add a Recurrence trigger](../connectors/connectors-native-recurrence.md#add-the-recurrence-trigger).

  > [!IMPORTANT]
  > If you use the **Day**, **Week**, or **Month** frequency, and you specify a future date and time, make sure that you set up the recurrence in advance:
  >
  > * **Day**: Set up the daily recurrence at least 24 hours in advance.
  >
  > * **Week**: Set up the weekly recurrence at least 7 days in advance.
  > 
  > * **Month**: Set up the monthly recurrence at least one month in advance.
  > 
  > Otherwise, the workflow might skip the first recurrence.
  >
  > If a recurrence doesn't specify a specific [start date and time](#start-time), the first recurrence runs immediately 
  > when you save or deploy the logic app, despite your trigger's recurrence setup. To avoid this behavior, provide a start 
  > date and time for when you want the first recurrence to run.
  >
  > If a recurrence doesn't specify any other advanced scheduling options such as specific times to run future recurrences, 
  > those recurrences are based on the last run time. As a result, the start times for those recurrences might drift due to 
  > factors such as latency during storage calls. To make sure that your workflow doesn't miss a recurrence, especially when 
  > the frequency is in days or longer, try these options:
  >
  > * Provide a start date and time for the recurrence plus the specific times when to run subsequent recurrences by using the properties 
  > named **At these hours** and **At these minutes**, which are available only for the **Day** and **Week** frequencies.
  >
  > * Use the [Sliding Window trigger](../connectors/connectors-native-sliding-window.md), rather than the Recurrence trigger.

  For more information, see [Create, schedule, and run recurring tasks and workflows with the Recurrence trigger](../connectors/connectors-native-recurrence.md).

* **Sliding Window**: Runs your workflow at regular time intervals that handle data in continuous chunks. If the trigger misses recurrences, for example, due to disruptions or disabled workflows, the Sliding Window trigger goes back and processes the missed recurrences.

  You can specify a start date and time, time zone, and a duration to delay each recurrence in your workflow. This trigger doesn't support advanced schedules, for example, specific hours of the day, minutes of the hour, and days of the week. For more information, see [Create, schedule, and run recurring tasks and workflows with the Sliding Window trigger](../connectors/connectors-native-sliding-window.md).

<a name="schedule-actions"></a>

## Schedule actions

After any action in your logic app workflow, you can use the Delay and Delay Until actions to make your workflow wait before the next action runs.

* **Delay**: Wait to run the next action for the specified number of time units, such as seconds, minutes, hours, days, weeks, or months. For more information, see [Delay the next action in workflows](../connectors/connectors-native-delay.md).

* **Delay until**: Wait to run the next action until the specified date and time. For more information, see [Delay the next action in workflows](../connectors/connectors-native-delay.md).

<a name="start-time"></a>

## Patterns for start date and time

Here are some patterns that show how you can control recurrence with the start date and time, and how Azure Logic Apps runs these recurrences:

| Start time | Recurrence without schedule | Recurrence with schedule (Recurrence trigger only) |
|------------|-----------------------------|----------------------------------------------------|
| {none} | Runs the first workload instantly. <p>Runs future workloads based on the last run time. | Runs the first workload instantly. <p>Runs future workloads based on the specified schedule. |
| Start time in the past | **Recurrence** trigger: Calculates run times based on the specified start time and discards past run times. <p><p>Runs the first workload at the next future run time. <p><p>Runs future workloads based on the last run time. <p><p>**Sliding Window** trigger: Calculates run times based on the specified start time and honors past run times. <p><p>Runs future workloads based on the specified start time. <p><p>For more explanation, see the example following this table. | Runs the first workload *no sooner* than the start time, based on the schedule calculated from the start time. <p><p>Runs future workloads based on the specified schedule. <p><p>**Note:** If you specify a recurrence with a schedule, but don't specify hours or minutes for the schedule, Azure Logic Apps calculates future run times by using the hours or minutes, respectively, from the first run time. |
| Start time now or in the future | Runs the first workload at the specified start time. <p><p>**Recurrence** trigger: Runs future workloads based on the last run time. <p><p>**Sliding Window** trigger: Runs future workloads based on the specified start time. | Runs the first workload *no sooner* than the start time, based on the schedule calculated from the start time. <p><p>Runs future workloads based on the specified schedule. If you use the **Day**, **Week**, or **Month** frequency, and you specify a future date and time, make sure that you set up the recurrence in advance: <p>- **Day**: Set up the daily recurrence at least 24 hours in advance. <p>- **Week**: Set up the weekly recurrence at least 7 days in advance. <p>- **Month**: Set up the monthly recurrence at least one month in advance. <p>Otherwise, the workflow might skip the first recurrence. <p>**Note:** If you specify a recurrence with a schedule, but don't specify hours or minutes for the schedule, Azure Logic Apps calculates future run times by using the hours or minutes, respectively, from the first run time. |

*Example for past start time and recurrence but no schedule*

Suppose the current date and time is September 8, 2017 at 1:00 PM. You specify the start date and time as September 7, 2017 at 2:00 PM, which is in the past, and a recurrence that runs every two days.

| Start time | Current time | Recurrence | Schedule |
|------------|--------------|------------|----------|
| 2017-09-**07**T14:00:00Z <br>(2017-09-**07** at 2:00 PM) | 2017-09-**08**T13:00:00Z <br>(2017-09-**08** at 1:00 PM) | Every two days | {none} |

For the Recurrence trigger, the Azure Logic Apps engine calculates run times based on the start time, discards past run times, uses the next future start time for the first run, and calculates future runs based on the last run time.

Here's how this recurrence looks:

| Start time | First run time | Future run times |
|------------|----------------|------------------|
| 2017-09-**07** at 2:00 PM | 2017-09-**09** at 2:00 PM | 2017-09-**11** at 2:00 PM </br>2017-09-**13** at 2:00 PM </br>2017-09-**15** at 2:00 PM </br>and so on... |

So, no matter how far in the past you specify the start time, for example, 2017-09-**05** at 2:00 PM or 2017-09-**01** at 2:00 PM, your first run always uses the next future start time.

For the Sliding Window trigger, the Logic Apps engine calculates run times based on the start time, honors past run times, uses the start time for the first run, and calculates future runs based on the start time.

Here's how this recurrence looks:

| Start time | First run time | Future run times |
|------------|----------------|------------------|
| 2017-09-**07** at 2:00 PM | 2017-09-**08** at 1:00 PM (Current time) | 2017-09-**09** at 2:00 PM </br>2017-09-**11** at 2:00 PM </br>2017-09-**13** at 2:00 PM </br>2017-09-**15** at 2:00 PM </br>and so on... |

So, no matter how far in the past you specify the start time, for example, 2017-09-**05** at 2:00 PM or 2017-09-**01** at 2:00 PM, your first run always uses the specified start time.

## Recurrence behavior

Recurring built-in triggers, such as the [Recurrence trigger](../connectors/connectors-native-recurrence.md), run natively on the Azure Logic Apps runtime. These triggers differ from recurring connection-based managed connector triggers where you need to create a connection first, such as the Office 365 Outlook managed connector trigger.

For both kinds of triggers, if a recurrence doesn't specify a specific start date and time, the first recurrence runs immediately when you save or deploy the logic app resource, despite your trigger's recurrence setup. To avoid this behavior, provide a start date and time for when you want the first recurrence to run.

### Recurrence for built-in triggers

Recurring built-in triggers follow the schedule that you set, including any specified time zone. However, if a recurrence doesn't specify other advanced scheduling options, such as specific times to run future recurrences, those recurrences are based on the last trigger execution. As a result, the start times for those recurrences might drift due to factors such as latency during storage calls.

For more information, review the following documentation:

* [Trigger recurrence for daylight saving time and standard time](#daylight-saving-standard-time)
* [Troubleshoot recurrence issues](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md#recurrence-issues)

### Recurrence for connection-based triggers

For recurring connection-based triggers, such as Office 365 Outlook, the schedule isn't the only driver that controls execution. The time zone only determines the initial start time. Subsequent runs depend on the recurrence schedule, the last trigger execution, and other factors that might cause run times to drift or produce unexpected behavior, for example:

* Whether the trigger accesses a server that has more data, which the trigger immediately tries to fetch.
* Any failures or retries that the trigger incurs.
* Latency during storage calls.
* Not maintaining the specified schedule when daylight saving time (DST) starts and ends.
* Other factors that can affect when the next run time happens.

For more information, review the following documentation:

* [Trigger recurrence for daylight saving time and standard time](#daylight-saving-standard-time)
* [Trigger recurrence shift and drift during daylight saving time and standard time](#recurrence-shift-drift)
* [Troubleshoot recurrence issues](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md#recurrence-issues)

<a name="daylight-saving-standard-time"></a>

### Trigger recurrence for daylight saving time and standard time

To schedule jobs, Azure Logic Apps puts the message for processing into the queue and specifies when that message becomes available, based on the UTC time when the last job ran and the UTC time when the next job is scheduled to run. If you specify a start time with your recurrence, *make sure that you select a time zone* so that your logic app workflow runs at the specified start time. That way, the UTC time for your logic app also shifts to counter the seasonal time change. Recurring triggers honor the schedule that you set, including any time zone that you specify.

If you don't select a time zone, daylight saving time (DST) events might affect when triggers run. For example, the start time shifts one hour forward when DST starts and one hour backward when DST ends.

<a name="recurrence-shift-drift"></a>

### Trigger recurrence shift and drift during daylight saving time and standard time

For recurring connection-based triggers, the recurrence schedule isn't the only driver that controls execution. The time zone only determines the initial start time. Subsequent runs depend on the recurrence schedule, the last trigger execution, and other factors that might cause run times to drift or produce unexpected behavior, for example:

* Failure to maintain the specified schedule when daylight saving time (DST) starts and ends.
* Other factors that can affect when the next run time happens.
* Latency during storage calls.
* Whether the trigger accesses a server that has more data, which the trigger immediately tries to fetch.
* Any failures or retries that the trigger incurs.

To make sure that the recurrence time doesn't shift when DST takes effect, manually adjust the recurrence. That way, your workflow continues to run at the expected or specified start time. Otherwise, the start time shifts one hour forward when DST starts and one hour backward when DST ends.

<a name="dst-window"></a>

> [!NOTE]
> Triggers that start between 2:00 AM - 3:00 AM might have problems because DST changes happen at 2:00 AM, which might 
> cause the start time to become invalid or ambiguous. If you have multiple logic apps within the same ambiguous interval, 
> they might overlap. For this reason, you might want to avoid start times between 2:00 AM - 3:00 AM.

For example, suppose that you have two logic apps that run daily. One logic app runs at 1:30 AM local time, while the other runs an hour later at 2:30 AM local time. What happens to the starting times for these apps when DST starts and ends?

* Do the triggers run at all when the time shifts one hour forward?

* Do the triggers run twice when the time shifts one hour backward?

If these logic apps use the UTC-6:00 Central Time (US & Canada) zone, this simulation shows how the UTC times shifted in 2019 to counter the DST changes, moving one hour backward or forward as necessary so that the apps continued running at the expected local times without skipped or duplicate runs.

* **03/10/2019: DST starts at 2:00 AM, shifting time one hour forward**

  To compensate after DST starts, UTC time shifts one hour backward so that your logic app continues running at the same local time:

  * Logic app #1

    | Date | Time (local) | Time (UTC) | Notes |
    |------|--------------|------------|-------|
    | 03/09/2019 | 1:30:00 AM | 7:30:00 AM | UTC before the day that DST takes effect. |
    | 03/10/2019 | 1:30:00 AM | 7:30:00 AM | UTC is the same because DST hasn't taken effect. |
    | 03/11/2019 | 1:30:00 AM | 6:30:00 AM | UTC shifted one hour backward after DST took effect. |

  * Logic app #2

    | Date | Time (local) | Time (UTC) | Notes |
    |------|--------------|------------|-------|
    | 03/09/2019 | 2:30:00 AM | 8:30:00 AM | UTC before the day that DST takes effect. |
    | 03/10/2019 | 3:30:00 AM* | 8:30:00 AM | DST is already in effect, so local time has moved one hour forward because the UTC-6:00 time zone changes to UTC-5:00. For more information, see [Triggers that start between 2:00 AM - 3:00 AM](#dst-window). |
    | 03/11/2019 | 2:30:00 AM | 7:30:00 AM | UTC shifted one hour backward after DST took effect. |

* **11/03/2019: DST ends at 2:00 AM and shifts time one hour backward**

  To compensate, UTC time shifts one hour forward so that your logic app continues running at the same local time:

  * Logic app #1

    | Date | Time (local) | Time (UTC) | Notes |
    |------|--------------|------------|-------|
    | 11/02/2019 | 1:30:00 AM | 6:30:00 AM ||
    | 11/03/2019 | 1:30:00 AM | 6:30:00 AM ||
    | 11/04/2019 | 1:30:00 AM | 7:30:00 AM ||

  * Logic app #2

    | Date | Time (local) | Time (UTC) | Notes |
    |------|--------------|------------|-------|
    | 11/02/2019 | 2:30:00 AM | 7:30:00 AM ||
    | 11/03/2019 | 2:30:00 AM | 8:30:00 AM ||
    | 11/04/2019 | 2:30:00 AM | 8:30:00 AM ||

<a name="recurrence-issues"></a>

### Troubleshoot recurrence issues

To make sure that your workflow runs at your specified start time and doesn't miss a recurrence, especially when the frequency is in days or longer, try the following solutions:

* When DST takes effect, manually adjust the recurrence so that your workflow continues to run at the expected time. Otherwise, the start time shifts one hour forward when DST starts and one hour backward when DST ends. For more information and examples, review [Recurrence for daylight saving time and standard time](#daylight-saving-standard-time).

* If you're using a **Recurrence** trigger, specify a time zone, a start date, and start time. In addition, configure specific times to run subsequent recurrences in the properties **At these hours** and **At these minutes**, which are available only for the **Day** and **Week** frequencies. However, some time windows might still cause problems when the time shifts.

* Consider using a [**Sliding Window** trigger](../connectors/connectors-native-sliding-window.md) instead of a **Recurrence** trigger to avoid missed recurrences.

<a name="run-once"></a>

## Run one time only

If you want to run your logic app only at one time in the future, you can use the **Scheduler: Run once jobs** template. After you create a new logic app but before opening the workflow designer, under the **Templates** section, from the **Category** list, select **Schedule**, and then select this template:

![Select "Scheduler: Run once jobs" template](./media/concepts-schedule-automated-recurring-tasks-workflows/choose-run-once-template.png)

Or, if you can start your logic app with the **When a HTTP request is received - Request** trigger, and pass the start time as a parameter for the trigger. For the first action, use the **Delay until - Schedule** action, and provide the time for when the next action starts running.

<a name="run-once-last-day-of-the-month"></a>

## Run once at last day of the month

To run the Recurrence trigger only once on the last day of the month, you have to edit the trigger in the workflow's underlying JSON definition using code view, not the designer. However, you can use the following example:

```json
"triggers": {
    "Recurrence": {
        "recurrence": {
            "frequency": "Month",
            "interval": 1,
            "schedule": {
                "monthDays": [-1]
            }
        },
        "type": "Recurrence"
    }
}
```

<a name="example-recurrences"></a>

## Example recurrences

Here are various example recurrences that you can set up for the triggers that support the options:

| Trigger | Recurrence | Interval | Frequency | Start time | On these days | At these hours | At these minutes | Note |
|---------|------------|----------|-----------|------------|---------------|----------------|------------------|------|
| Recurrence, <br>Sliding Window | Run every 15 minutes (no start date and time) | 15 | Minute | {none} | {unavailable} | {none} | {none} | This schedule starts immediately, then calculates future recurrences based on the last run time. |
| Recurrence, <br>Sliding Window | Run every 15 minutes (with start date and time) | 15 | Minute | *startDate*T*startTime*Z | {unavailable} | {none} | {none} | This schedule doesn't start *any sooner* than the specified start date and time, then calculates future recurrences based on the last run time. |
| Recurrence, <br>Sliding Window | Run every hour, on the hour (with start date and time) | 1 | Hour | *startDate*Thh:00:00Z | {unavailable} | {none} | {none} | This schedule doesn't start *any sooner* than the specified start date and time. Future recurrences run every hour at the "00" minute mark, which Azure Logic Apps calculates from the start time. <p>If the frequency is "Week" or "Month", this schedule respectively runs only one day per week or one day per month. |
| Recurrence, <br>Sliding Window | Run every hour, every day (no start date and time) | 1 | Hour | {none} | {unavailable} | {none} | {none} | This schedule starts immediately and calculates future recurrences based on the last run time. <p>If the frequency is "Week" or "Month", this schedule respectively runs only one day per week or one day per month. |
| Recurrence, <br>Sliding Window | Run every hour, every day (with start date and time) | 1 | Hour | *startDate*T*startTime*Z | {unavailable} | {none} | {none} | This schedule doesn't start *any sooner* than the specified start date and time, then calculates future recurrences based on the last run time. <p>If the frequency is "Week" or "Month", this schedule respectively runs only one day per week or one day per month. |
| Recurrence, <br>Sliding Window | Run every 15 minutes past the hour, every hour (with start date and time) | 1 | Hour | *startDate*T00:15:00Z | {unavailable} | {none} | {none} | This schedule doesn't start *any sooner* than the specified start date and time. Future recurrences run at the "15" minute mark, which Logic Apps calculates from the start time, so at 00:15 AM, 1:15 AM, 2:15 AM, and so on. |
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

## Next steps

* [Create, schedule, and run recurring tasks and workflows with the Recurrence trigger](../connectors/connectors-native-recurrence.md)
* [Create, schedule, and run recurring tasks and workflows with the Sliding Window trigger](../connectors/connectors-native-sliding-window.md)
* [Pause workflows with delay actions](../connectors/connectors-native-delay.md)
