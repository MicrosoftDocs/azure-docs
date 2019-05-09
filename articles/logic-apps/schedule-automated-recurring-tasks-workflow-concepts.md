---
title: Schedule automated tasks and workflows - Azure Logic Apps
description: Automate and schedule recurring tasks with Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: deli, klam, LADocs
ms.topic: article
ms.date: 05/09/2019
---

# Schedule and run automated tasks with Azure Logic Apps

Logic Apps helps you create and run automated recurring tasks on a schedule. 
By creating a logic app workflow that uses the Schedule connector, which provides 
[triggers](../logic-apps/logic-apps-overview.md#logic-app-concepts) for starting 
your workflow, you can run tasks immediately, at a later time, or on a recurring schedule. 
You can call services inside and outside Azure, such as HTTP or HTTPS endpoints or 
post messages to Azure services such as Azure Storage and Azure Service Bus. 
You can set up complex schedules and advanced recurrence for running tasks.

Here are some examples that show the kinds of tasks that you can run:

* Get internal data, such as [run a SQL stored procedure](../connectors/connectors-create-api-sqlazure.md) every day.

* Get external data, such as pull weather reports from NOAA every 15 minutes.

* Send report data, such as email a summary for all 
orders greater than a specific amount in the past week.

* Process data, such as compress today's uploaded images 
every weekday during off-peak hours.

* Clean up data, such as delete all tweets older than three months.

* Archive data, such as push invoices to a backup 
service at 1:00 AM every day for the next nine months.

This article describes the triggers and actions that the 
Schedule connector provides along with their capabilities.

## Schedule triggers

When you create a logic app workflow that uses the Schedule connector, 
you can start your workflow with the Recurrence trigger or Sliding Window 
trigger, which aren't associated with any specific service or system 
where you might otherwise need to create a connection.

These triggers can run actions based on a schedule where you specify 
the interval and frequency for the recurrence, for example, the number 
of seconds, minutes, hours, days, weeks, or months. You can also specify 
the start date and time as well as the time zone. 

Here are the differences between these triggers:

* **Recurrence**: If you select Day, you can specify hours and minutes 
of the day, for example, every day at 2:30. If you select Week, you can 
specify days of the week, such as Wednesday and Saturday, along with hours 
and minutes of the day. If any recurrences are missed, the Recurrence trigger 
doesn't go back in time to process those missed recurrences.

* **Sliding Window**: Makes sure that your logic app runs a specific number 
of times and processes any missed recurrences. You can specify a delay for 
any frequency you select. However, selecting Day doesn't provide options 
for specifying hours and minutes of the day. Selecting Week doesn't provide 
options for specifying days of the week. 

## Schedule actions

