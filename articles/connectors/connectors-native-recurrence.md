---
title: Schedule tasks that run regularly - Azure Logic Apps | Microsoft Docs
description: Create and schedule tasks, actions, workflows, processes, and workloads that run regularly in logic apps
services: logic-apps
documentationcenter: ''
author: jeffhollan
manager: anneta
editor: ''
tags: connectors

ms.assetid: 51dd4f22-7dc5-41af-a0a9-e7148378cd50
ms.service: logic-apps
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/12/2017
ms.author: LADocs; jehollan
---

# Create and schedule regularly running tasks with logic apps

To schedule tasks, actions, workloads, or processes that run regularly, 
you can create a logic app workflow that starts with the 
**Schedule - Recurrence** [trigger](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts). 
Although some [connectors](../connectors/apis-list.md) 
provide recurrence triggers for specific events, other connectors don't. 
With this trigger, you can set a future date and time for when the trigger 
fires and the recurrence schedule for performing tasks, such as these 
examples and more:

* Get internal data: [Run a SQL stored procedure](../connectors/connectors-create-api-sqlazure.md) every day.
* Get external data: Pull weather reports from NOAA every 15 minutes.
* Report data: Email a summary for all orders greater than a specific amount in the past week.
* Process data: Compress today's uploaded images every weekday during off-peak hours.
* Clean up data: Delete all tweets older than three months.
* Archive data: Push invoices to a backup service every month.

This trigger supports many patterns, for example:

* Run immediately and repeat every *n* number of seconds, minutes, hours, days
weeks, or months.
* Start at a specific time, then run and repeat every *n* number of seconds, 
minutes, hours, days, weeks, or months.
* Run and repeat at one or more times each day, for example, at 8:00 AM and 5:00 PM.
* Run and repeat each week, but only for specific days, such as Saturday and Sunday.
* Run and repeat each week, but only for specific days and times, 
such as Monday through Friday at 8:00 AM and 5:00 PM.

## Prerequisites

* An Azure subscription. If you don't have a subscription, 
you can [start with a free Azure account](https://azure.microsoft.com/free/). 
Otherwise, you can [sign up for a Pay-As-You-Go subscription](https://azure.microsoft.com/pricing/purchase-options/).

* Basic knowledge about 
[how to create logic apps](../logic-apps/logic-apps-create-a-logic-app.md) 

## Add a recurrence trigger to your logic app

1. Sign in to the [Azure portal](https://portal.azure.com). 
Create a blank logic app, or learn [how to create a blank logic app](../logic-apps/logic-apps-create-a-logic-app.md).

2. After Logic Apps Designer appears, in the search box, 
enter "recurrence" as your filter. Select the **Schedule - Recurrence** trigger. 

   ![Schedule - Recurrence trigger](./media/connectors-native-recurrence/add-recurrence-trigger.png)

   This trigger is now the first step in your logic app.

3. Set the interval and frequency for the recurrence. 
In this example, set these properties to run your workflow every week. 

   ![Set interval and frequency](./media/connectors-native-recurrence/recurrence-trigger-details.png)

4. For more scheduling options, choose **Show advanced options**. 

   ![More options](./media/connectors-native-recurrence/recurrence-trigger-more-options.png)

5. Now you can set these options: 

   * Set a start date and time for firing the trigger. 
   If you specify a start date and time, you can also apply a time zone. 

   * If you select "Day" or "Week" for the frequency, 
   you can select specific times for the recurrence. 

   * If you select "Week", you can select specific days of the week too.
   
   ![Advanced scheduling options](./media/connectors-native-recurrence/recurrence-trigger-more-options-details.png)

   For example, suppose that today is September 4, 2017. 
   This trigger doesn't fire until two weeks from today 
   on September 18, 2017 at 8:00 AM PST. The workflow 
   repeats at 10:30 AM, 12:30 PM, and 2:30 PM, 
   and only on Mondays each week. 
   When you select "Day" or "Week", the trigger also 
   shows a preview for your specified recurrence. 
   [*What are some other example occurrences?*](#example-recurrences)
   
   ![Advanced scheduling example](./media/connectors-native-recurrence/recurrence-trigger-more-options-advanced-schedule.png)
 
6. Now build your remaining workflow with actions or flow control statements. 
For more actions that you can add, see [Connectors](../connectors/apis-list.md). 

   When the trigger fires each time, Logic Apps creates and 
   runs a new instance of your logic app workflow.

## Trigger details

You can configure these properties for the recurrence trigger.

| Name | Required | Property name | Type | Description | 
|----- | -------- | ------------- | ---- | ----------- | 
| **Frequency** | Yes | frequency | String | The unit of time for the recurrence: **Second**, **Minute**, **Hour**, **Day**, **Week**, or **Month** | 
| **Interval** | Yes | interval | Integer | A positive integer that describes how often the workflow runs based on the frequency. <p>The default interval is 1. Here are the minimum and maximum intervals: <p>- Month: 1-16 months </br>- Day: 1-500 days </br>- Hour: 1-12,000 hours </br>- Minute: 1-72,000 minutes </br>- Second: 1-9,999,999 seconds<p>For example, if the interval is 6, and the frequency is "Month", then the recurrence is every 6 months. | 
| **Time zone** | No | timeZone | String | Applies only when you specify a start time because this trigger doesn't accept [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). Select the time zone that you want to apply. | 
| **Start time** | No | startTime | String | Provide a start time in this format: <p>YYYY-MM-DDThh:mm:ss if you select a time zone <p>-or- <p>YYYY-MM-DDThh:mm:ssZ if you don't select a time zone <p>So for example, if you want September 18, 2017 at 2:00 PM, then specify "2017-09-18T14:00:00" and select a time zone such as Pacific Time. Or, specify "2017-09-18T14:00:00Z" without a time zone. <p>**Note:** This start time must follow the [ISO 8601 date time specification](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) in [UTC date time format](https://en.wikipedia.org/wiki/Coordinated_Universal_Time), but without a [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). If you don't select a time zone, you must add the letter "Z" at the end without any spaces. This "Z" refers to the equivalent [nautical time](https://en.wikipedia.org/wiki/Nautical_time). <p>For simple schedules, the start time is the first occurrence, while for complex schedules, the trigger doesn't fire any sooner than the start time. [*What are the ways that I can use the start date and time?*](#start-time) | 
| **On these days** | No | weekDays | String or string array | If you select "Week", you can select one or more days when you want to run the workflow: **Monday**, **Tuesday**, **Wednesday**, **Thursday**, **Friday**, **Saturday**, and **Sunday** | 
| **At these hours** | No | hours | Integer or integer array | If you select "Day" or "Week", you can select one or more integers from 0 to 23 as the hour marks for the times when you want to run the workflow. <p>For example, if you specify "10", "12" and "14", you get 10 AM, 12 PM, and 2 PM. | 
| **At these minutes** | No | minutes | Integer or integer array | If you select "Day" or "Week", you can select one or more integers from 0 to 59 as the minute marks for the times when you want to run the workflow. <p>For example, "30" is the half-hour mark. With the previous example for hours, you get 10:30 AM, 12:30 PM, and 2:30 PM. | 
||||| 

## JSON example

Here is an example recurrence trigger definition:

``` json
{
    "triggers": {
        "Recurrence": {
            "recurrence": {
                "frequency": "Week",
                "interval": 1,
                "schedule": {
                    "hours": [
                        10,
                        12,
                        14
                    ],
                    "minutes": [
                        30
                    ],
                    "weekDays": [
                        "Monday"
                    ]
                },
               "startTime": "2017-09-07T14:00:00",
               "timeZone": "Pacific Standard Time"
            },
            "type": "Recurrence"
        }
    }
}
```

## FAQ

<a name="example-recurrences"></a>

**Q:** What are other example recurrence schedules? </br>
**A:** Here are more examples:

| Recurrence | Interval | Frequency | Start time | On these days | At these hours | At these minutes | Note |
| ---------- | -------- | --------- | ---------- | ------------- | -------------- | ---------------- | ---- |
| Run at 8:00 AM every day | 1 | Day | {none} | {unavailable} | 8 | {none} || 
| Run at 8:30 AM every day | 1 | Day | {none} | {unavailable} | 8 | 30 || 
| Run at 8:30 AM and 4:30 PM every day | 1 | Day | {none} | {unavailable} | 8, 16 | 30 || 
| Run at 8:30 AM and 4:45 every day | 1 | Day | {none} | {unavailable} | 8, 16 | 30, 45 || 
| Run every 15 minutes | 1 | Day | {none} | {unavailable} | {none} | 0, 15, 30, 45 || 
| Run every hour | 1 | Day | {none} | {unavailable} | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 | {see note} | To control the minutes portion, you can specify minute marks or a start time, or you can use the creation time. For example, if the start time or creation time is 8:25 AM, this schedule runs at 8:25 AM, 9:25 AM, 10:25 AM, and so on. <p>This schedule is equivalent to a frequency of "Hour", an interval of one, and no schedule. However, the difference is that you can use this schedule with a different frequency and interval. For example, if frequency is "Month", the schedule runs once per month, rather than every day. | 
| Run every hour, on the hour | 1 | Day | {none} | {unavailable} | {none} | 0 | For example, 12:00 AM, 1:00 AM, 2:00 AM, and so on. This schedule is equivalent to a frequency of "Hour" and a start time with zero minutes. <p>If the frequency is "Week" or "Month," this schedule respectively runs only one day per week or one day per month. | 
| Run every 15 minutes past the hour, every hour | 1 | Day | {none} | {unavailable} | {none} | 15 | This schedule runs at 00:15 AM, 1:15 AM, 2:15 AM, and so on. | 
| Run every Saturday at start time | 1 | Week | {your-start-time} | "Saturday" | {none} | {none} | For example, if you specify a start time of "2017-09-09T14:00:00", this schedule doesn't start until September 9, 2017 at 2:00 PM, but then runs every Saturday at 2:00 PM. | 
| Run every week on Saturday at 5 PM | 1 | Week | {none} | "Saturday" | 17 | {none} | This schedule runs every Saturday at 5:00 PM. | 
| Run every week on Tuesday, Thursday at 5 PM | 1 | Week | {none} | "Tuesday", "Thursday" | 17 | {none} | This schedule runs every Tuesday and Thursday at 5:00 PM. | 
| Run every hour during working hours | 1 | Week | {none} | Select all days except Saturday and Sunday. | Select the hour marks for your specific working hours | Select any minute marks, as appropriate. | For example, if your working hours are 8:00 AM to 5:00 PM, then select "8, 9, 10, 11, 12, 13, 14, 15, 16, 17" as your hour marks. <p>If your working hours are 8:30 AM to 5:30 PM, select the previous hour marks plus the "30" minute mark. | 
| Run once every day on weekends | 1 | Week | {none} | "Saturday", "Sunday" | Select the hour mark that you want. | Select any minute mark as appropriate. | This schedule runs every Saturday and Sunday at your specified time. | 
| Run every 15 minutes biweekly on Mondays only | 2 | Week | {none} | "Monday" | {none} | 0, 15, 30, 45 | This schedule runs every other Monday at every 15-minute mark. | 
|||||

<a name="start-time"></a>

**Q:** What are the ways that I can use the start date and time? </br>
**A:** Here are some patterns that show how you can control recurrence 
with the start date and time:

| Start time | Recurrence without schedule | Recurrence with schedule | 
| ---------- | --------------------------- | ------------------------ | 
| {none} | Run once immediately, then run future workloads based on the last run time. | Run once immediately, then run future workloads based on your specified recurrence schedule. | 
| Start time at present or in the future | Run once at your specified start time, then run future workloads based on the last run time. | Run once, but no earlier than the specified start time. Run future workloads based on your specified recurrence schedule. | 
| Start time in the past | Calculate the first future run time based on the start time, then run at that time. Run future workloads based on calculations from the last run time. | Calculate the first future run time based on the start time, then run at that time. Run future workloads based on your specified recurrence schedule. | 
||||

## Next steps

* [Workflow actions and triggers](../logic-apps/logic-apps-workflow-actions-triggers.md#recurrence-trigger)
* [Connectors](../connectors/apis-list.md)
