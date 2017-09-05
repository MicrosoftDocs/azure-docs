---
title: Create recurring scheduled tasks - Azure Logic Apps | Microsoft Docs
description: Create workflows that run repeat scheduled tasks with the recurrence trigger in logic apps
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

# Create and run recurring scheduled tasks with logic apps

To repeat tasks based on an interval, or event schedule these tasks in advance, 
create a logic app workflow that starts with the **Schedule - Recurrence** trigger. 
That way, your logic app runs and repeats after each specified time interval. 

For example, you can create logic apps that 
schedule and run workflows for these tasks:

* Email a summary of all tweets with a specific hashtag within the past week.
* Schedule a workflow that runs a SQL stored procedure every day.

## Prerequisites

* An Azure subscription. If you don't have a subscription, 
you can [start with a free Azure account](https://azure.microsoft.com/free/). 
Otherwise, you can [sign up for a Pay-As-You-Go subscription](https://azure.microsoft.com/pricing/purchase-options/).

* Basic knowledge about creating logic apps. 
Learn [how to create your first logic app](../logic-apps/logic-apps-create-a-logic-app.md). 

## Add a recurrence trigger that starts your logic app workflow

A [*trigger*](../connectors/connectors-overview.md) is an 
event that you use to start a logic app workflow.

1. Sign in to the [Azure portal](https://portal.azure.com). 
Create a blank logic app. 

2. After Logic Apps Designer appears, in the search box, 
enter "recurrence" as your filter. From the results, 
select the **Schedule - Recurrence** trigger. 

   ![Schedule - Recurrence trigger](./media/connectors-native-recurrence/add-recurrence-trigger.png)

   Now this trigger is the first step in your logic app.

3. Set the interval and frequency for the recurrence. 
In this example, set these properties to run the workflow every week. 

   ![Set interval and frequency](./media/connectors-native-recurrence/recurrence-trigger-details.png)

4. For more options, choose **Show advanced options**. 

   ![More options](./media/connectors-native-recurrence/recurrence-trigger-more-options.png)

   Here, you can set up a date and time in advance for starting your workflow. 
   You can also specify the days of the week and the times for when to run your workflow. 
   
   ![Advanced scheduling options](./media/connectors-native-recurrence/recurrence-trigger-more-options-details.png)

   For example, you could specify that your logic app 
   doesn't start running until two weeks from today, 
   supposing that today is September 4, 2017. 
   If you select options for days or times, 
   the trigger shows you a preview for your specified recurrence. 
   For example, this trigger runs weekly, on each Monday, 
   at 10:30 AM, 12:30 PM, and 2:30 PM.

   ![Advanced scheduling example](./media/connectors-native-recurrence/recurrence-trigger-more-options-advanced-schedule.png)

## Trigger details

You can configure these properties for the recurrence trigger.

| Display name | Property name | Required | Description | 
| ------------ | ------------- | -------- | ----------- | 
| **Frequency** | frequency | Yes | The unit of time: `Second`, `Minute`, `Hour`, `Day`, `Week`, or `Month` | 
| **Interval** | interval | Yes | The frequency interval for the recurrence | 
| **Time zone** | timeZone | No | If you provide a start time without a UTC offset, this time zone is used. | 
| **Start time** | startTime | No | The start time in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) | 
| **On these days** | weekDays | No | Select one or more days of the week when you want to run the workflow: `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday` | 
| **At these hours** | hours | No | Select one or more hours for the times of day when you want to run the workflow. For example, "10", "12" and "14" are 10 AM, 12 PM, and 2 PM. | 
| **At these minutes** | minutes | No | Select one or more minutes for the times of day when you want to run the workflow. For example, "30" is the half-hour mark. | 
||||| 

## Next steps

[Connectors](../connectors/apis-list.md)