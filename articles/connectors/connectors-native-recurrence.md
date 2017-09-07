---
title: Run recurring scheduled tasks - Azure Logic Apps | Microsoft Docs
description: Create workflows that run scheduled workloads at regular intervals with the recurrence trigger in logic apps
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
ms.date: 09/05/2017
ms.author: LADocs; jehollan; astay
---

# Create, schedule, and run recurring tasks with logic apps

To schedule and run workflows at regular intervals, 
create a logic app that starts with the **Schedule - Recurrence** trigger. 
A [*trigger*](../connectors/connectors-overview.md) is an event that 
you use to start a logic app workflow. For example, 
you can schedule and run recurring workloads for these tasks:

* Email a summary of all tweets with a specific hashtag within the past week.
* Schedule a workflow that runs a SQL stored procedure every day.

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

   * Specify a start date and time for firing the recurrence trigger. 
   When you specify a start date and time, you can apply a time zone too.

   * Select specific times or days for running your workflow 
   when you select the frequency "Day" or "Week".

   ![More options](./media/connectors-native-recurrence/recurrence-trigger-more-options.png)

   If you previously selected "Day" or "Week", you can specify 
   times for running your workflow. If you selected "Week", 
   you can also select days of the week for running your workflow.
   
   ![Advanced scheduling options](./media/connectors-native-recurrence/recurrence-trigger-more-options-details.png)

   For example, you could specify that your logic app doesn't 
   start running until two weeks from today, 
   supposing that today is September 4, 2017. 
   And because this example selected "Week", 
   you can also select specific days or times. 
   The trigger shows you a preview for your specified recurrence. 
   For example, this trigger runs weekly, on each Monday, 
   at 10:30 AM, 12:30 PM, and 2:30 PM.

   ![Advanced scheduling example](./media/connectors-native-recurrence/recurrence-trigger-more-options-advanced-schedule.png)

   Here are more example recurrences:

   | Recurrence | Interval | Frequency | On these days | At these hours | At these minutes | 
   | ---------- | -------- | --------- | ------------- | -------------- | ---------------- |
   | Every hour during working hours | 1 | Week | Select all days except Saturday and Sunday. Available only after you select "Week" as the frequency. | Select the hours for your specific working hours | {not necessary} | 
   | Once each day on weekends | 1 | Week | Select only Saturday and Sunday. Available only after you select "Week" as the frequency. | {not necessary} | {not necessary} | 
   | Every 15 minutes on Monday every other week | 2 | Week | Select only Monday | {not necessary} | 15 | 
   ||||

5. Now build your remaining workflow with actions or workflow control statements. 
For more actions that you can add, see [Connectors](../connectors/apis-list.md).

## Trigger details

You can configure these properties for the recurrence trigger.

| Display name | Property name | Required | Description | 
| ------------ | ------------- | -------- | ----------- | 
| **Frequency** | frequency | Yes | The unit of time for the recurrence: `Second`, `Minute`, `Hour`, `Day`, `Week`, or `Month` | 
| **Interval** | interval | Yes | The frequency of the interval for the recurrence | 
| **Time zone** | timeZone | No | Applies only when you specify a **start time** and is used for start times without time zone offsets. Select the time zone that you want to apply. | 
| **Start time** | startTime | No | Provide the start time in these formats: <p>- [UTC date time format](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) without a time zone offset <p>- [ISO 8601 date time format](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) without a time zone offset. But you can include the letter "Z", which refers to the equivalent [nautical time](https://en.wikipedia.org/wiki/Nautical_time) and is necessary if you don't specify a time zone. | 
| **On these days** | weekDays | No | When you select `Week`, you can select one or more days of the week when you want to run the workflow: `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday` | 
| **At these hours** | hours | No | When you select `Day` or `Week`, you can select one or more hours for the times of day when you want to run the workflow. For example, "10", "12" and "14" are 10 AM, 12 PM, and 2 PM. | 
| **At these minutes** | minutes | No | When you select `Day` or `Week`, you can select one or more minutes for the times of day when you want to run the workflow. For example, "30" is the half-hour mark. | 
||||| 

## Next steps

[Connectors](../connectors/apis-list.md)