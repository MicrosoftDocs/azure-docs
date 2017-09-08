---
title: Schedule tasks and workflows that run regularly - Azure Logic Apps | Microsoft Docs
description: Schedule tasks, workflows, processes, and workloads that run regularly with the recurrence trigger for logic apps
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
ms.date: 09/08/2017
ms.author: LADocs; jehollan
---

# Create, schedule, and regularly run tasks or processes in Azure Logic Apps

To specify when your logic app runs at regular intervals, 
build a logic app that starts with a **Schedule - Recurrence** [trigger](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts). 
Although some [connectors](../connectors/apis-list.md) 
provide recurrence triggers for specific tasks, 
other connectors don't. For these connectors, you can still create, 
schedule, and set up recurring workflows like these examples and more:

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

## Add a recurrence trigger for starting your logic app workflow

1. Sign in to the [Azure portal](https://portal.azure.com). 
Create a blank logic app. 

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


| Display name | Required | Property name | Type | Description | 
| ------------ | -------- | ------------- | ---- | ----------- | 
| **Frequency** | Yes | frequency | string | The unit of time for the recurrence: **Second**, **Minute**, **Hour**, **Day**, **Week**, or **Month** | 
| **Interval** | Yes | interval | integer | A positive whole number that describes how often the workflow runs based on the frequency. <p>The default interval is 1. Here are the minimum and maximum intervals: <p>- Monthly: 1-18 months </br>- Daily: 1-548 days </br>- Hourly: 1-1,000 hours </br>- Minutes: 1-1,000 minutes <p>For example, if the interval is 6, and the frequency is "Month", then the recurrence is every 6 months. | 
| **Time zone** | No | timeZone | string | Applies only when you specify a start time because this trigger doesn't accept [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). Select the time zone that you want to apply. | 
| **Start time** | No | startTime | string | Provide a start time in this format: <p>YYYY-MM-DDThh:mm:ss if you select a time zone <p>-or- <p>YYYY-MM-DDThh:mm:ssZ if you don't select a time zone <p>So for example, if you want September 18, 2017 at 2:00 PM, then specify "2017-09-18T14:00:00" and select a time zone such as Pacific Time. Or, specify "2017-09-18T14:00:00Z" without a time zone. <p>**Note:** This start time must follow the [ISO 8601 date time specification](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) in [UTC date time format](https://en.wikipedia.org/wiki/Coordinated_Universal_Time), but without a [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). If you don't select a time zone, you must add the letter "Z" at the end without any spaces. This "Z" refers to the equivalent [nautical time](https://en.wikipedia.org/wiki/Nautical_time). <p>For simple schedules, the start time is the first occurrence, while for complex schedules, the trigger doesn't fire any sooner than the start time. [*What are other ways to set the start date and time?*](#start-time) | 
| **On these days** | No | weekDays | string | If you select "Week", you can select one or more days when you want to run the workflow: **Monday**, **Tuesday**, **Wednesday**, **Thursday**, **Friday**, **Saturday**, and **Sunday** | 
| **At these hours** | No | hours | integer | If you select "Day" or "Week", you can select one or more integers, ranging from 0 to 23, as the hour marks for the times when you want to run the workflow. <p>For example, if you specify "10", "12" and "14", you get 10 AM, 12 PM, and 2 PM. | 
| **At these minutes** | No | minutes | integer | If you select "Day" or "Week", you can select one or more integers, ranging from 0 to 59, as the minute marks for the times when you want to run the workflow. <p>For example, "30" is the half-hour mark. With the previous example for hours, you get 10:30 AM, 12:30 PM, and 2:30 PM. | 
||||| 

## JSON example

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
| Run at 8 AM every day | 1 | Day | {none} | {unavailable} | 8 | {none} || 
| Run at 8:30 AM every day | 1 | Day | {none} | {unavailable} | 8 | 30 || 
| Run at 8:30 AM and 4:30 PM every day | 1 | Day | {none} | {unavailable} | 8, 16 | 30 || 
| Run at 8:30 AM and 4:45 every day | 1 | Day | {none} | {unavailable} | 8, 16 | 30, 45 || 
| Run every 15 minutes | 1 | Day | {none} | {unavailable} | {none} | 0, 15, 30, 45 || 
| Run every hour | 1 | Day | {none} | {unavailable} | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 | {see note} | To control the minute portion, you can use the minutes mark, a start time, or the creation time. <p>For example, if the start time or creation time is 8:25 AM, this schedule runs at 8:25 AM, 9:25 AM, 10:25 AM, and so on. <p>This schedule is equivalent to a frequency of "Hour", an interval of one, and no schedule. However, the difference is that you can use this schedule with a different frequency and interval. For example, if frequency is "Month", the schedule runs once per month, rather than every day. | 
| Run every hour, on the hour | 1 | Day | {none} | {unavailable} | {none} | 0 | For example, 12 AM, 1 AM, 2 AM, and so on. This schedule is equivalent to a frequency of "Hour" and a start time with zero minutes. If the frequency is "Week" or "Month," this schedule respectively runs only one day per week or one day per month. | 
| Run every 15 minutes past the hour, every hour | 1 | Day | {none} | {unavailable} | {none} | 15 | For example, this schedule runs at 00:15 AM, 1:15 AM, 2:15 AM, and so on. | 
| Run every Saturday at start time | 1 | Week | {your-start-time} | "Saturday" | {none} | {none} || 
| Run every week on Saturday at 5 PM | 1 | Week | {none} | "Saturday" | 17 | {none} || 
| Run every week on Tuesday, Thursday at 5 PM | 1 | Week | {none} | "Tuesday", "Thursday" | 17 | {none} || 
| Run every hour during working hours | 1 | Week | {none} | Select all days except Saturday and Sunday. | Select the hours for your specific working hours | {none} || 
| Run once every day on weekends | 1 | Week | {none} | "Saturday", "Sunday" | {none} | {none} || 
| Run every 15 minutes biweekly on Mondays only | 2 | Week | {none} | "Monday" | {none} | 0,15,30,45 || 
|||||

<a name="start-time"></a>

**Q:** What are other ways for setting the start date and time? </br>
**A:** Here's more information about how you can control the start time for this trigger.


| Start time | Recurrence, no schedule | Recurrence with schedule | 
| ---------- | ----------------------- | ------------------------ | 
| {none} | Run once immediately, then run future workloads based on calculations from the last run time. | Run once immediately, then run future workloads based on the specified recurrence schedule. | 
| Start time at present or in the future | Run once at the specified start time, then run future workloads based on calculations from the last run time. | Run once at the specified start time - no earlier. Run future workloads based on the specified recurrence schedule. | 
| Start time in the past {not permitted} | {unavailable} | {unavailable} | 
||||

## Next steps

[Connectors](../connectors/apis-list.md)