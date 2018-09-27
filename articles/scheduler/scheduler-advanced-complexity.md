---
title: Build advanced job schedules and recurrences - Azure Scheduler
description: Learn how to create advanced schedules and recurrences for jobs in Azure Scheduler
services: scheduler
ms.service: scheduler
author: derek1ee
ms.author: deli
ms.reviewer: klam
ms.suite: infrastructure-services
ms.assetid: 5c124986-9f29-4cbc-ad5a-c667b37fbe5a
ms.topic: article
ms.date: 08/18/2016
---

# Build advanced schedules and recurrences for jobs in Azure Scheduler

> [!IMPORTANT]
> [Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
> is replacing Azure Scheduler, which is being retired. 
> To schedule jobs, [try Azure Logic Apps instead](../scheduler/migrate-from-scheduler-to-logic-apps.md). 

Within an [Azure Scheduler](../scheduler/scheduler-intro.md) job, 
the schedule is the core that determines when and how the Scheduler 
service runs the job. You can set up multiple one-time and recurring 
schedules for a job with Scheduler. One-time schedules run only once 
at a specified time and are basically recurring schedules that run only once. 
Recurring schedules run on a specified frequency. With this flexibility, 
you can use Scheduler for various business scenarios, for example:

* **Clean up data regularly**: Create a daily job 
that deletes all tweets older than three months.

* **Archive data**: Create a monthly job that pushes 
invoice history to a backup service.

* **Request external data**: Create a job that runs 
every 15 minutes and pulls a new weather report from NOAA.

* **Process images**: Create a weekday job that runs 
during off-peak hours and uses cloud computing for 
compressing images uploaded during the day.

This article describes example jobs you can create by using Scheduler and 
and the [Azure Scheduler REST API](https://docs.microsoft.com/rest/api/schedule), 
and includes the JavaScript Object Notation (JSON) definition for each schedule. 

## Supported scenarios

These examples show the range of scenarios that Azure Scheduler supports 
and how to create schedules for various behavior patterns, for example:

* Run once at a specific date and time.
* Run and recur a specific number of times.
* Run immediately and recur.
* Run and recur every *n* minutes, hours, days, 
weeks, or months, starting at a specific time.
* Run and recur weekly or monthly, but only on 
specific days of the week or on specific days of the month.
* Run and recur multiple times for a specific period. 
For example, every month on the last Friday and Monday, 
or daily at 5:15 AM and at 5:15 PM.

This article later describes these scenarios in more detail.

<a name="create-scedule"></a>

## Create schedule with REST API

To create a basic schedule with the 
[Azure Scheduler REST API](https://docs.microsoft.com/rest/api/schedule), 
follow these steps:

1. Register your Azure subscription with a resource provider 
by using the [Register operation - Resource Manager REST API](https://docs.microsoft.com/rest/api/resources/providers#Providers_Register). 
The provider name for the Azure Scheduler service is **Microsoft.Scheduler**. 

1. Create a job collection by using the 
[Create or Update operation for job collections](https://docs.microsoft.com/rest/api/scheduler/jobcollections#JobCollections_CreateOrUpdate) 
in the Scheduler REST API. 

1. Create a job by using the 
[Create or Update operation for jobs](https://docs.microsoft.com/rest/api/scheduler/jobs/createorupdate). 

## Job schema elements

This table provides a high-level overview for the major JSON elements 
you can use when setting up recurrences and schedules for jobs. 

| Element | Required | Description | 
|---------|----------|-------------|
| **startTime** | No | A DateTime string value in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601) that specifies when the job first starts in a basic schedule. <p>For complex schedules, the job starts no sooner than **startTime**. | 
| **recurrence** | No | The recurrence rules for when the job runs. The **recurrence** object supports these elements: **frequency**, **interval**, **schedule**, **count**, and **endTime**. <p>If you use the **recurrence** element, you must also use the **frequency** element, while other **recurrence** elements are optional. |
| **frequency** | Yes, when you use **recurrence** | The time unit between occurrences and supports these values: "Minute", "Hour", "Day", "Week", "Month", and "Year" | 
| **interval** | No | A positive integer that determines the number of time units between occurrences based on **frequency**. <p>For example, if **interval** is 10 and **frequency** is "Week", the job recurs every 10 weeks. <p>Here are the maximum number of intervals for each frequency: <p>- 18 months <br>- 78 weeks <br>- 548 days <br>- For hours and minutes, the range is 1 <= <*interval*> <= 1000. | 
| **schedule** | No | Defines changes to the recurrence based on the specified minute-marks, hour-marks, days of the week, and days of the month | 
| **count** | No | A positive integer that specifies the number of times that the job runs before finishing. <p>For example, when a daily job has **count** set to 7, and the start date is Monday, the job finishes running on Sunday. If the start date has already passed, the first run is calculated from the creation time. <p>Without **endTime** or **count**, the job runs infinitely. You can't use both **count** and **endTime** in the same job, but the rule that finishes first is honored. | 
| **endTime** | No | A Date or DateTime string value in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601) that specifies when the job stops running. You can set a value for **endTime** that's in the past. <p>Without **endTime** or **count**, the job runs infinitely. You can't use both **count** and **endTime** in the same job, but the rule that finishes first is honored. |
|||| 

For example, this JSON schema describes a basic schedule and recurrence for a job: 

```json
"properties": {
   "startTime": "2012-08-04T00:00Z", 
   "recurrence": {
      "frequency": "Week",
      "interval": 1,
      "schedule": {
         "weekDays": ["Monday", "Wednesday", "Friday"],
         "hours": [10, 22]                      
      },
      "count": 10,       
      "endTime": "2012-11-04"
   },
},
``` 

*Dates and DateTime values*

* Dates in Scheduler jobs include only the date and follow the 
[ISO 8601 specification](http://en.wikipedia.org/wiki/ISO_8601).

* Date-times in Scheduler jobs include both date and time, 
follow the [ISO 8601 specification](http://en.wikipedia.org/wiki/ISO_8601), 
and is assumed to be UTC when no UTC offset is specified. 

For more information, see [Concepts, terminology, and entities](../scheduler/scheduler-concepts-terms.md).

<a name="start-time"></a>

## Details: startTime

This table describes how **startTime** controls the way a job runs:

| startTime | No recurrence | Recurrence, no schedule | Recurrence with schedule |
|-----------|---------------|-------------------------|--------------------------|
| **No start time** | Run once immediately. | Run once immediately. Run subsequent executions calculated from the last execution time. | Run once immediately. Run subsequent executions based on a recurrence schedule. | 
| **Start time in the past** | Run once immediately. | Calculate the first future run time after start time, and run at that time. <p>Run subsequent executions calculated from the last execution time. <p>See the example after this table. | Start job *no sooner than* the specified start time. The first occurrence is based on the schedule calculated from the start time. <p>Run subsequent executions based on a recurrence schedule. | 
| **Start time in the future or the current time** | Run once at the specified start time. | Run once at the specified start time. <p>Run subsequent executions calculated from the last execution time. | Start job *no sooner than* the specified start time. The first occurrence is based on the schedule, calculated from the start time. <p>Run subsequent executions based on a recurrence schedule. |
||||| 

Suppose you this example with these conditions: 
a start time in the past with a recurrence, 
but no schedule.

```json
"properties": {
   "startTime": "2015-04-07T14:00Z", 
   "recurrence": {
      "frequency": "Day",
      "interval": 2
   }
}
```

* The current date and time is "2015-04-08 13:00".

* The start date and time is "2015-04-07 14:00", 
which is before the current date and time.

* The recurrence is every two days.

1. Under these conditions, the first execution is on 2015-04-09 at 14:00. 

   Scheduler calculates the execution occurrences based on the start time, 
   discards any instances in the past, and uses the next instance in the future. 
   In this case, **startTime** is on 2015-04-07 at 2:00 PM, so the next instance 
   is two days from that time, which is 2015-04-09 at 2:00 PM.

   The first execution is the same whether **startTime** 
   is 2015-04-05 14:00 or 2015-04-01 14:00. After the 
   first execution, subsequent executions are calculated 
   based on the schedule. 
   
1. The executions then follow in this order: 
   
   1. 2015-04-11 at 2:00 PM
   1. 2015-04-13 at 2:00 PM 
   1. 2015-04-15 at 2:00 PM
   1. And so on...

1. Finally, when a job has a schedule but no specified hours and minutes, 
these values default to the hours and minutes in the first execution, respectively.

<a name="schedule"></a>

## Details: schedule

You can use **schedule** to *limit* the number of job executions. 
For example, if a job with a **frequency** of "month" has a schedule that runs only on day 31, the job runs only in months that have a thirty-first day.

You can also use **schedule** to *expand* the number of job executions. For example, if a job with a **frequency** of "month" has a schedule that runs on month days 1 and 2, the job runs on the first and second days of the month instead of only once a month.

If you specify multiple schedule elements, the order of evaluation is from the largest to smallest: 
week number, month day, weekday, hour, and minute.

The following table describes schedule elements in detail:

| JSON name | Description | Valid values |
|:--- |:--- |:--- |
| **minutes** |Minutes of the hour at which the job runs. |An array of integers. |
| **hours** |Hours of the day at which the job runs. |An array of integers. |
| **weekDays** |Days of the week the job runs. Can be specified only with a weekly frequency. |An array of any of the following values (maximum array size is 7):<br />- "Monday"<br />- "Tuesday"<br />- "Wednesday"<br />- "Thursday"<br />- "Friday"<br />- "Saturday"<br />- "Sunday"<br /><br />Not case-sensitive. |
| **monthlyOccurrences** |Determines which days of the month the job runs. Can be specified only with a monthly frequency. |An array of **monthlyOccurrences** objects:<br /> `{ "day": day, "occurrence": occurrence}`<br /><br /> **day** is the day of the week the job runs. For example, *{Sunday}* is every Sunday of the month. Required.<br /><br />**occurrence** is  the occurrence of the day during the month. For example,  *{Sunday, -1}* is the last Sunday of the month. Optional. |
| **monthDays** |Day of the month the job runs. Can be specified only with a monthly frequency. |An array of the following values:<br />- Any value <= -1 and >= -31<br />- Any value >= 1 and <= 31|

## Examples: Recurrence schedules

The following examples show various recurrence schedules. The examples focus on the schedule object and its subelements.

These schedules assume that **interval** is set to 1\. The examples also assume the correct **frequency** values for the values in **schedule**. For example, you can't use a **frequency** of "day" and have a **monthDays** modification in **schedule**. We describe these restrictions earlier in the article.

| Example | Description |
|:--- |:--- |
| `{"hours":[5]}` |Run at 5 AM every day.<br /><br />Scheduler matches up each value in "hours" with each value in "minutes", one by one, to create a list of all the times at which the job runs. |
| `{"minutes":[15], "hours":[5]}` |Run at 5:15 AM every day. |
| `{"minutes":[15], "hours":[5,17]}` |Run at 5:15 AM and 5:15 PM every day. |
| `{"minutes":[15,45], "hours":[5,17]}` |Run at 5:15 AM, 5:45 AM, 5:15 PM, and 5:45 PM every day. |
| `{"minutes":[0,15,30,45]}` |Run every 15 minutes. |
| `{hours":[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]}` |Run every hour.<br /><br />This job runs every hour. The minute is controlled by the value for **startTime**, if it is specified. If no **startTime** value is specified, the minute is controlled by the creation time. For example, if the start time or creation time (whichever applies) is 12:25 PM, the job runs at 00:25, 01:25, 02:25, …, 23:25.<br /><br />The schedule is equivalent to a job with a **frequency** of "hour", an **interval** of 1, and no **schedule** value. The difference is that you can use this schedule with different **frequency** and **interval** values to create other jobs. For example, if **frequency** is "month", the schedule runs only once a month instead of every day (if **frequency** is "day"). |
| `{minutes:[0]}` |Run every hour on the hour.<br /><br />This job also runs every hour, but on the hour (12 AM, 1 AM, 2 AM, and so on). This is equivalent to a job with a **frequency** of "hour", a **startTime** value of zero minutes, and no **schedule**, if the frequency is "day". However, if the **frequency** is "week" or "month", the schedule executes only one day a week or one day a month, respectively. |
| `{"minutes":[15]}` |Run at 15 minutes past the hour every hour.<br /><br />Runs every hour, starting at 00:15 AM, 1:15 AM, 2:15 AM, and so on. It ends at 11:15 PM. |
| `{"hours":[17], "weekDays":["saturday"]}` |Run at 5 PM on Saturday every week. |
| `{hours":[17], "weekDays":["monday", "wednesday", "friday"]}` |Run at 5 PM on Monday, Wednesday, and Friday every week. |
| `{"minutes":[15,45], "hours":[17], "weekDays":["monday", "wednesday", "friday"]}` |Run at 5:15 PM and 5:45 PM on Monday, Wednesday, and Friday every week. |
| `{"hours":[5,17], "weekDays":["monday", "wednesday", "friday"]}` |Run at 5 AM and 5 PM on Monday, Wednesday, and Friday every week. |
| `{"minutes":[15,45], "hours":[5,17], "weekDays":["monday", "wednesday", "friday"]}` |Run at 5:15 AM, 5:45 AM, 5:15 PM, and 5:45 PM on Monday, Wednesday, and Friday every week. |
| `{"minutes":[0,15,30,45], "weekDays":["monday", "tuesday", "wednesday", "thursday", "friday"]}` |Run every 15 minutes on weekdays. |
| `{"minutes":[0,15,30,45], "hours": [9, 10, 11, 12, 13, 14, 15, 16] "weekDays":["monday", "tuesday", "wednesday", "thursday", "friday"]}` |Run every 15 minutes on weekdays, between 9 AM and 4:45 PM. |
| `{"weekDays":["sunday"]}` |Run on Sundays at start time. |
| `{"weekDays":["tuesday", "thursday"]}` |Run on Tuesdays and Thursdays at start time. |
| `{"minutes":[0], "hours":[6], "monthDays":[28]}` |Run at 6 AM on the twenty-eighth day of every month (assuming a **frequency** of "month"). |
| `{"minutes":[0], "hours":[6], "monthDays":[-1]}` |Run at 6 AM on the last day of the month.<br /><br />If you want to run a job on the last day of a month, use -1 instead of day 28, 29, 30, or 31. |
| `{"minutes":[0], "hours":[6], "monthDays":[1,-1]}` |Run at 6 AM on the first and last day of every month. |
| `{monthDays":[1,-1]}` |Run on the first and last day of every month at start time. |
| `{monthDays":[1,14]}` |Run on the first and fourteenth day of every month at start time. |
| `{monthDays":[2]}` |Run on the second day of the month at start time. |
| `{"minutes":[0], "hours":[5], "monthlyOccurrences":[{"day":"friday", "occurrence":1}]}` |Run on the first Friday of every month at 5 AM. |
| `{"monthlyOccurrences":[{"day":"friday", "occurrence":1}]}` |Run on the first Friday of every month at start time. |
| `{"monthlyOccurrences":[{"day":"friday", "occurrence":-3}]}` |Run on the third Friday from the end of the month, every month, at start time. |
| `{"minutes":[15], "hours":[5], "monthlyOccurrences":[{"day":"friday", "occurrence":1},{"day":"friday", "occurrence":-1}]}` |Run on the first and last Friday of every month at 5:15 AM. |
| `{"monthlyOccurrences":[{"day":"friday", "occurrence":1},{"day":"friday", "occurrence":-1}]}` |Run on the first and last Friday of every month at start time. |
| `{"monthlyOccurrences":[{"day":"friday", "occurrence":5}]}` |Run on the fifth Friday of every month at start time.<br /><br />If there is no fifth Friday in a month, the job doesn't run. You might consider using -1 instead of 5 for the occurrence if you want to run the job on the last occurring Friday of the month. |
| `{"minutes":[0,15,30,45], "monthlyOccurrences":[{"day":"friday", "occurrence":-1}]}` |Run every 15 minutes on the last Friday of the month. |
| `{"minutes":[15,45], "hours":[5,17], "monthlyOccurrences":[{"day":"wednesday", "occurrence":3}]}` |Run at 5:15 AM, 5:45 AM, 5:15 PM, and 5:45 PM on the third Wednesday of every month. |

## See also

* [What is Azure Scheduler?](scheduler-intro.md)
* [Azure Scheduler concepts, terminology, and entity hierarchy](scheduler-concepts-terms.md)
* [Azure Scheduler limits, defaults, and error codes](scheduler-limits-defaults-errors.md)