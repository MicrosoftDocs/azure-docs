---
title: Schedule and run automated tasks and workflows with Azure Logic Apps
description: Automate scheduled and recurring tasks with the Recurrence connector in Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
tags: connectors
ms.topic: article
ms.date: 01/08/2019
---

# Create and run recurring tasks and workflows with Azure Logic Apps

To schedule actions, workloads, or processes that run regularly, 
create a logic app workflow that starts with the 
**Recurrence - Schedule** [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts). 
You can set a date and time for starting the workflow 
and a recurrence schedule for performing tasks, 
such as these examples and more:

This trigger supports many patterns, for example:

* Run immediately and repeat every *n* number of seconds, minutes, hours, days
weeks, or months.
* Start at a specific time, then run and repeat every *n* number of seconds, 
minutes, hours, days, weeks, or months.
* Run and repeat at one or more times each day, for example, at 8:00 AM and 5:00 PM.
* Run and repeat each week, but only for specific days, such as Saturday and Sunday.
* Run and repeat each week, but only for specific days and times, 
such as Monday through Friday at 8:00 AM and 5:00 PM.

To trigger your logic app and run only one time in the future, 
see [Run jobs one time only](#run-once) later in this topic.

## Prerequisites

* An Azure subscription. If you don't have a subscription, 
you can [start with a free Azure account](https://azure.microsoft.com/free/). 
Otherwise, you can [sign up for a Pay-As-You-Go subscription](https://azure.microsoft.com/pricing/purchase-options/).

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md) 

## Add Recurrence trigger

1. Sign in to the [Azure portal](https://portal.azure.com). 
Create a blank logic app, or learn [how to create a blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

2. After Logic Apps Designer appears, under the search box, 
choose **All**. In the search box, enter "recurrence" as your filter. 
From the triggers list, select this trigger: 
**Recurrence - Schedule** 

   ![Select "Recurrence - Schedule" trigger](./media/connectors-native-recurrence/add-recurrence-trigger.png)

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

   For example, suppose that today is Monday, September 4, 2017. 
   The following recurrence trigger doesn't fire *any sooner* than the 
   start date and time, which is Monday, September 18, 2017 at 8:00 AM PST. 
   However, the recurrence schedule is set for 10:30 AM, 12:30 PM, 
   and 2:30 PM on Mondays only. So the first time that the trigger fires 
   and creates a logic app workflow instance is at 10:30 AM. 
   To learn more about how start times work, 
   see these [start time examples](#start-time).
   Future runs happen at 12:30 PM and 2:30 PM on the same day. 
   Each recurrence creates their own workflow instance. After that, 
   the entire schedule repeats all over again next Monday. 
   [*What are some other example occurrences?*](#example-recurrences)

   ![Advanced scheduling example](./media/connectors-native-recurrence/recurrence-trigger-more-options-advanced-schedule.png)

   > [!NOTE]
   > The trigger shows a preview for your specified recurrence 
   > only when you select "Day" or "Week" as the frequency.
   
6. Now build your remaining workflow with actions or flow control statements. 
For more actions that you can add, see [Connectors](../connectors/apis-list.md). 

## Trigger details

You can configure these properties for the recurrence trigger.

| Name | Required | Property name | Type | Description | 
|----- | -------- | ------------- | ---- | ----------- | 
| **Frequency** | Yes | frequency | String | The unit of time for the recurrence: **Second**, **Minute**, **Hour**, **Day**, **Week**, or **Month** | 
| **Interval** | Yes | interval | Integer | A positive integer that describes how often the workflow runs based on the frequency. <p>The default interval is 1. Here are the minimum and maximum intervals: <p>- Month: 1-16 months </br>- Day: 1-500 days </br>- Hour: 1-12,000 hours </br>- Minute: 1-72,000 minutes </br>- Second: 1-9,999,999 seconds<p>For example, if the interval is 6, and the frequency is "Month", then the recurrence is every 6 months. | 
| **Time zone** | No | timeZone | String | Applies only when you specify a start time because this trigger doesn't accept [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). Select the time zone that you want to apply. | 
| **Start time** | No | startTime | String | Provide a start time in this format: <p>YYYY-MM-DDThh:mm:ss if you select a time zone <p>-or- <p>YYYY-MM-DDThh:mm:ssZ if you don't select a time zone <p>So for example, if you want September 18, 2017 at 2:00 PM, then specify "2017-09-18T14:00:00" and select a time zone such as Pacific Time. Or, specify "2017-09-18T14:00:00Z" without a time zone. <p>**Note:** This start time must follow the [ISO 8601 date time specification](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) in [UTC date time format](https://en.wikipedia.org/wiki/Coordinated_Universal_Time), but without a [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). If you don't select a time zone, you must add the letter "Z" at the end without any spaces. This "Z" refers to the equivalent [nautical time](https://en.wikipedia.org/wiki/Nautical_time). <p>For simple schedules, the start time is the first occurrence, while for complex schedules, the trigger doesn't fire any sooner than the start time. [*What are the ways that I can use the start date and time?*](#start-time) | 
| **On these days** | No | weekDays | String or string array | If you select "Week", you can select one or more days when you want to run the workflow: **Monday**, **Tuesday**, **Wednesday**, **Thursday**, **Friday**, **Saturday**, and **Sunday** | 
| **At these hours** | No | hours | Integer or integer array | If you select "Day" or "Week", you can select one or more integers from 0 to 23 as the hours of the day when you want to run the workflow. <p>For example, if you specify "10", "12" and "14", you get 10 AM, 12 PM, and 2 PM as the hour marks. | 
| **At these minutes** | No | minutes | Integer or integer array | If you select "Day" or "Week", you can select one or more integers from 0 to 59 as the minutes of the hour when you want to run the workflow. <p>For example, you can specify "30" as the minute mark and using the previous example for hours of the day, you get 10:30 AM, 12:30 PM, and 2:30 PM. | 
||||| 

## JSON example

Here is an example [recurrence trigger definition](../logic-apps/logic-apps-workflow-actions-triggers.md#recurrence-trigger):

``` json
"triggers": {
   "Recurrence": {
      "type": "Recurrence",
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
      }
   }
}
```

## Next steps

* [Workflow actions and triggers](../logic-apps/logic-apps-workflow-actions-triggers.md#recurrence-trigger)
* [Connectors](../connectors/apis-list.md)
