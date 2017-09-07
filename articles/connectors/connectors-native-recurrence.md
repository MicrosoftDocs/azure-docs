---
title: Schedule tasks and workflows - Azure Logic Apps | Microsoft Docs
description: Schedule tasks, workflows, and workloads that run regularly by using the recurrence trigger in logic apps
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
ms.author: LADocs; jehollan; astay
---

# Create, schedule, and regularly run tasks in Azure Logic Apps

To schedule when to start and run workflows at regular intervals, 
create a logic app that starts with a **Schedule - Recurrence** [trigger](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts). 
Although some [connectors](../connectors/apis-list.md) provide recurrence triggers for specific tasks, 
other connectors don't. So for these connectors, you can still create, schedule, 
and set up recurring workflows for tasks like these examples and more:

* Get internal data: [Run a SQL stored procedure](../connectors/connectors-create-api-sqlazure.md) every day.
* Get external data: Pull weather reports from NOAA every 15 minutes.
* Report data: Email a summary for all orders greater than a specific amount in the past week.
* Process data: Compress today's uploaded images every weekday during off-peak hours.
* Clean up data: Delete all tweets older than 3 months.
* Archive data: Push invoices to a backup service every month.

This trigger supports many patterns, for example:

* Run immediately and repeat every *n* number of seconds, minutes, hours, days
weeks, or months.
* Start at a specific time, then run and repeat every *n* number of seconds, 
minutes, hours, days, weeks, or months.
* Run and repeat at one or more times each day, for example, at 8:00 AM and 5:00 PM.
* Run and repeat each week but only on specific days, for example, Saturday and Sunday.
* Run and repeat each week but only on specific days at specific times of day, 
for example, from Monday through Friday at 8:00 AM and 5:00 PM.

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

4. For more scheduling options, 
choose **Show advanced options** so that you can: 

   * Schedule a start date and time for firing the recurrence trigger. 
   When you set the start date and time, you can apply a time zone too.

   * Select specific times or days for the recurrence 
   when you select "Day" or "Week" for the frequency.

   ![More options](./media/connectors-native-recurrence/recurrence-trigger-more-options.png)

   If you selected "Day" or "Week", you can specify times for the recurrence. 
   If you selected "Week", you can also select days of the week.
   
   ![Advanced scheduling options](./media/connectors-native-recurrence/recurrence-trigger-more-options-details.png)

   For example, suppose that today is September 4, 2017. 
   This trigger doesn't fire until two weeks from today 
   on September 18, 2017 at 8:00 AM PST. The workflow then runs 
   at 10:30 AM, 12:30 PM, and 2:30 PM on Mondays only each week. 
   When you select "Day" or "Week", 
   the trigger also shows a preview for your specified recurrence. 
   [*What are some other example occurrences?*](#example-recurrences)
   
   ![Advanced scheduling example](./media/connectors-native-recurrence/recurrence-trigger-more-options-advanced-schedule.png)
 
5. Now build your remaining workflow with actions or workflow control statements. 
For more actions that you can add, see [Connectors](../connectors/apis-list.md).

## Trigger details

You can configure these properties for the recurrence trigger.

| Display name | Property name | Required | Description | 
| ------------ | ------------- | -------- | ----------- | 
| **Frequency** | frequency | Yes | The unit of time for the recurrence: **Second**, **Minute**, **Hour**, **Day**, **Week**, or **Month** | 
| **Interval** | interval | Yes | A positive integer that describes how often the workflow runs. For example, if the interval is 6, and the frequency is "Month", then the recurrence is every 6 months. <p>Here are the supported maximum intervals: </br>- Monthly: 18 months </br>- Daily: 548 days </br>- Hourly: 1 to 1,000 hours </br>- Minutes: 1 to 1,000 minutes | 
| **Time zone** | timeZone | No | Applies only when you specify a start time because this trigger doesn't accept [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). Select the time zone that you want to apply. | 
| **Start time** | startTime | No | Provide a start time in this format: <p>YYYY-MM-DDThh:mm:ss, when you select a time zone <p>-or- <p>YYYY-MM-DDThh:mm:ssZ, when you don't select a time zone <p>So for example, if you want September 18, 2017 at 2:00 PM, then specify either "2017-09-18T14:00:00" and select a time zone such as Pacific Time, or specify "2017-09-18T14:00:00Z" without a time zone. <p>**Note:** This start time must follow the [ISO 8601 date time specification](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) in [UTC date time format](https://en.wikipedia.org/wiki/Coordinated_Universal_Time), but without a [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). If you don't select a time zone, you must add the letter "Z" at the end without any spaces. This "Z" refers to the equivalent [nautical time](https://en.wikipedia.org/wiki/Nautical_time). <p>For simple schedules, the start time is the first occurrence, while for complex schedules, the trigger doesn't fire any sooner than the start time. [*What are other ways to set the start date and time?*](#start-time) | 
| **On these days** | weekDays | No | When you select "Week", you can select one or more days of the week when you want to run the workflow: **Monday**, **Tuesday**, **Wednesday**, **Thursday**, **Friday**, **Saturday**, and **Sunday** | 
| **At these hours** | hours | No | When you select "Day" or "Week", you can select one or more hours for the times of day when you want to run the workflow. For example, "10", "12" and "14" are 10 AM, 12 PM, and 2 PM. | 
| **At these minutes** | minutes | No | When you select "Day" or "Week", you can select one or more minutes for the times of day when you want to run the workflow. For example, "30" is the half-hour mark. | 
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
| Run at 8 AM every day | 1 | Day | {none} | {not applicable} | 8 | {not necessary} || 
| Run at 8:30 AM every day | 1 | Day | {none} | {not applicable} | 8 | 30 || 
| Run at 8:30 AM and 4:30 PM every day | 1 | Day | {none} | {not applicable} | 8, 16 | 30 || 
| Run at 8:30 AM and 4:45 every day | 1 | Day | {none} | 8, 16 | 30, 45 || 
| Run every 15 minutes | 1 | Day | {none} | {not applicable} | {not necessary} | 0, 15, 30, 45 || 
| Run every hour | 1 | Day | {none} | {not applicable} | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 | {see note} | To control the minute portion, you can use the minutes mark, a start time, or the creation time. <p>For example, if the start time or creation time was 8:25 AM, this schedule runs at 8:25 AM, 9:25 AM, 10:25 AM, and so on. <p>This schedule is equivalent to a frequency of "Hour", an interval of one, and no schedule. However, the difference is that you can use this schedule with a different frequency and interval. For example, if frequency was "Month", the schedule runs once per month, rather than every day. | 
| Run every hour, on the hour | 1 | Day | {none} | {not applicable} | {not necessary} | 0 | For example, 12 AM, 1 AM, 2 AM, and so on. This schedule is equivalent to a frequency of "Hour" and a start time with zero minutes. If the frequency was "Week" or "Month," this schedule respectively executes only one day per week or one day per month. | 
| Run every 15 minutes past the hour, every hour | 1 | Day | {none} | {not applicable} | {not necessary} | 15 | For example, this schedule runs at 00:15 AM, 1:15 AM, 2:15 AM, and so on. | 
| Run every Saturday at start time | 1 | Week | {your-start-time} | "Saturday" |  | {not necessary} || 
| Run every week on Saturday at 5 PM | 1 | Week | "Saturday" | 17 | {not necessary} || 
| Run every week on Tuesday, Thursday at 5 PM | 1 | Week | "Tuesday", "Thursday" | 17 | {not necessary} || 
| Run every hour during working hours | 1 | Week | Select all days except Saturday and Sunday. Available only after you select "Week" as the frequency. | Select the hours for your specific working hours | {not necessary} || 
| Run once every day on weekends | 1 | Week | Select only Saturday and Sunday. Available only after you select "Week" as the frequency. | {not necessary} | {not necessary} || 
| Run every 15 minutes biweekly on Mondays only | 2 | Week | Select only Monday | {not necessary} | 0,15,30,45 || 
|||||

<a name="start-time"></a>

**Q:** What are other ways for setting the start date and time? </br>
**A:** Here's more information about how you can control the start time for this trigger:

| Start time | No recurrence | Recurrence, no schedule | Recurrence with schedule |


## Next steps

[Connectors](../connectors/apis-list.md)