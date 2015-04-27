<properties 
 pageTitle="How to Build Complex Schedules and Advanced Recurrence with Azure Scheduler" 
 description="" 
 services="scheduler" 
 documentationCenter=".NET" 
 authors="krisragh" 
 manager="dwrede" 
 editor=""/>
<tags 
 ms.service="scheduler" 
 ms.workload="infrastructure-services" 
 ms.tgt_pltfrm="na" 
 ms.devlang="dotnet" 
 ms.topic="article" 
 ms.date="04/22/2015" 
 ms.author="krisragh"/>

# How to Build Complex Schedules and Advanced Recurrence with Azure Scheduler  

## Overview

At the heart of an Azure Scheduler job is the *schedule*. The schedule determines when and how the Scheduler executes the job.

Azure Scheduler allows you to specify different one-time and recurring schedules for a job. *One-time* schedules fire once at a specified time – effectively, they are *recurring* schedules that execute only once. Recurring schedules fire on a predetermined frequency.

With this flexibility, Azure Scheduler lets you support a wide variety of business scenarios:

-	Periodic data cleanup –  e.g., every day, delete all tweets older than 3 months
-	Archival – e.g., every month, push invoice history to backup service
-	Requests for external data – e.g., every 15 minutes, pull new ski weather report from NOAA
-	Image processing – e.g. every weekday, during off-peak hours, use cloud computing to compress images uploaded that day


In this article, we walk through example jobs that you can create with Azure Scheduler. We provide the JSON data that describes each schedule. If you use the [Scheduler REST API](https://msdn.microsoft.com/library/azure/dn528946.aspx), you can use this same JSON for [creating an Azure Scheduler job](https://msdn.microsoft.com/library/azure/dn528937.aspx).

## Supported Scenarios

The many examples in this topic illustrate the breadth of scenarios that Azure Scheduler supports. Broadly, these examples illustrate how to create schedules for many behavior patterns, including the ones below:

-	Run once at a particular date and time
-	Run and recur a number of explicit times
-	Run immediately and recur 
-	Run and recur every *n* minutes, hours, days, weeks, or months, starting at a particular time
-	Run and recur at weekly or monthly frequency but only on specific days, specific days of week, or  specific days of month
-	Run and recur at multiple times in a period – e.g., last Friday and Monday of every month, or at 5:15am and 5:15pm every day

## Dates and DateTimes

Dates in Azure Scheduler jobs follow the [ISO-8601 specification](http://en.wikipedia.org/wiki/ISO_8601) and include only the date.

Date-Time references in Azure Scheduler jobs follow the [ISO-8601 specification](http://en.wikipedia.org/wiki/ISO_8601) and include both date and time parts. A Date-Time that does not specify a UTC offset is assumed to be UTC.  

## How To: Use JSON and REST API for Creating Schedules

To create a simple schedule using the JSON examples in this article and the Azure Scheduler REST API, [first create a cloud service](https://msdn.microsoft.com/library/azure/dn528943.aspx), [then create a job collection](https://msdn.microsoft.com/library/azure/dn528940.aspx), and [finally create a job](https://msdn.microsoft.com/library/azure/dn528937.aspx). When you create a job, you can specify scheduling and recurrence using JSON like the one excerpted below:

	{
	    "startTime": "2012-08-04T00:00Z", // optional
	     …
	    "recurrence":                     // optional
	    {
	        "frequency": "week",     // can be "year" "month" "day" "week" "hour" "minute"
	        "interval": 1,                // optional, how often to fire (default to 1)
	        "schedule":                   // optional (advanced scheduling specifics)
	        {
	            "weekDays": ["monday", "wednesday", "friday"],
	            "hours": [10, 22]                      
	        },
	        "count": 10,                  // optional (default to recur infinitely)
	        "endTime": "2012-11-04",      // optional (default to recur infinitely)
	    },
	    …
	}
	
## Overview: Job Schema Basics

The following table provides a high-level overview of the major elements related to recurrence and scheduling in a job: 

|**JSON name**|**Description**|
|:--|:--|
|**_startTime_**|_startTime_ is a Date-Time. For simple schedules, _startTime_ is the first occurrence and for complex schedules, the job will start no sooner than _startTime_.|
|**_recurrence_**|The _recurrence_ object specifies recurrence rules for the job and the recurrence the job will execute with. The recurrence object supports the elements _frequency, interval, endTime, count,_ and _schedule_. If _recurrence_ is defined, _frequency_ is required; the other elements of _recurrence_ are optional.|
|**_frequency_**|The _frequency_ string representing the frequency unit at which the job recurs. Supported values are _"minute", "hour", "day", "week",_ or _"month."_|
|**_interval_**|The _interval_ is a positive integer and denotes the interval for the _frequency_ that determines how often the job will run. For example, if _interval_ is 3 and _frequency_ is "week", the job recurs every 3 weeks. Azure Scheduler supports a maximum _interval_ of 18 months for monthly frequency, 78 weeks for weekly frequency, or 548 days for daily frequency. For hour and minute frequency, the supported range is 1 <= _interval_ <= 1000.|
|**_endTime_**|The _endTime_ string specifies the date-time past which the job should not execute.It is not valid to have an _endTime_ in the past. If no _endTime_ or count is specified, the job runs infinitely.Both _endTime_ and _count_ cannot be included for the same job.|
|**_count_**|<p>The _count_ is a positive integer (greater than zero) that specifies the number of times this job should run before completing.</p><p>The _count_ represents the number of times the job runs before being determined as completed. For example, for a job that is executed daily with _count_ 5 and start date of Monday, the job completes after execution on Friday.If the start date is in the past, the first execution is calculated from the creation time.</p><p>If no _endTime_ or _count_ is specified, the job runs infinitely.Both _endTime_ and _count_ cannot be included for the same job.</p>|
|**_schedule_**|A job with a specified frequency alters its recurrence based on a recurrence schedule. A _schedule_ contains modifications based on minutes, hours, week days, month days, and week number.|

## Overview: Job Schema Defaults, Limits, and Examples

After this overview, let’s discuss each of these elements in detail.

|**JSON name**|**Value type**|**Required?**|**Default value**|**Valid values**|**Example**|
|:---|:---|:---|:---|:---|:---|
|**_startTime_**|String|No|None|ISO-8601 Date-Times|<code>"startTime" : "2013-01-09T09:30:00-08:00"</code>|
|**_recurrence_**|Object|No|None|Recurrence object|<code>"recurrence" : { "frequency" : "monthly", "interval" : 1 }</code>|
|**_frequency_**|String|Yes|None|"minute", "hour", "day", "week", "month"|<code>"frequency" : "hour"</code> |
|**_interval_**|Number|No|1|1 to 1000.|<code>"interval":10</code>|
|**_endTime_**|String|No|None|Date-Time value representing a time in the future|<code>"endTime" : "2013-02-09T09:30:00-08:00"</code> |
|**_count_**|Number|No|None|>= 1|<code>"count": 5</code>|
|**_schedule_**|Object|No|None|Schedule object|<code>"schedule" : { "minute" : [30], "hour" : [8,17] }</code>|

## Deep Dive: _startTime_

The following table captures how _startTime_ controls how a job is run.

|**startTime value**|**No recurrence**|**Recurrence. No schedule**|**Recurrence with schedule**|
|:--|:--|:--|:--|
|**No start time**|Run once immediately|Run once immediatelyRun subsequent executions based oncalculating from last execution time|<p>Run once immediately</p><p>Run subsequent executions based on recurrence schedule</p>|
|**Start time in past**|Run once immediately|<p>Calculate first future execution time after start time, and run at that time</p><p>Run subsequent executions based oncalculating from last execution time</p><p>See example after this table for a further explanation</p>|<p>Job starts _no sooner than_ the specified start time. The first occurrence is based on the schedule calculated from the start time</p><p>Run subsequent executions based on recurrence schedule</p>|
|**Start time in future or at present**|Run once at specified start time|<p>Run once at specified start time</p><p>Run subsequent executions based oncalculating from last execution time</p>|<p>Job starts _no sooner than_ the specified start time. The first occurrence is based on the schedule calculated from the start time</p><p>Run subsequent executions based on recurrence schedule</p>|

Let's see an example of what happens where _startTime_ is in the past, with _recurrence_ but no _schedule_.  Assume that the current time is 2015-04-08 13:00, _startTime_ is 2015-04-07 14:00, and _recurrence_ is every 2 days (defined with _frequency_: day and _interval_: 2.) Note that the _startTime_ is in the past, and occurs before the current time

Under these conditions, the _first execution_ will be 2015-04-09 at 14:00\. The Scheduler engine calculates execution occurrences from the start time.  Any instances in the past are discarded. The engine uses the next instance that occurs in the future.  So in this case, _startTime_ is 2015-04-07 at 2:00pm, so the next instance is 2 days from that time, which is 2015-04-09 at 2:00pm. 

Note that the first execution would be the same even if the startTime 2015-04-05 14:00 or 2015-04-01 14:00\. After the first execution, subsequent executions are calculated using the scheduled – so they'd be at 2015-04-11 at 2:00pm, then 2015-04-13 at 2:00pm, then 2015-04-15 at 2:00pm, etc.

Finally, when a job has a schedule, if hours and/or minutes aren’t set in the schedule, they default to the hours and/or minutes of the first execution, respectively.

## Deep Dive: _schedule_

On one hand, a _schedule_ can _limit_ the number of job executions.  For example, if a job with a "month" frequency has a _schedule_ that runs on only day 31, the job runs in only those months that have a 31<sup>st</sup> day.

On the other hand, a _schedule_ can also _expand_ the number of job executions. For example, if a job with a "month" frequency has a _schedule_ that runs on month days 1 and 2, the job runs on the 1<sup>st</sup> and 2<sup>nd</sup> days of the month instead of just once a month.

If multiple schedule elements are specified, the order of evaluation is from the largest to smallest – week number, month day, week day, hour, and minute.

The following table describes _schedule_ elements in detail.

|**JSON name**|**Description**|**Valid Values**|
|:---|:---|:---|
|**minutes**|Minutes of the hour at which the job will run|<ul><li>Integer, or</li><li>Array of integers</li></ul>|
|**hours**|Hours of the day at which the job will run|<ul><li>Integer, or</li><li>Array of integers</li></ul>|
|**weekDays**|Days of the week the job will run.Can only be specified with a weekly frequency.|<ul><li>"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", or "Sunday"</li><li>Array of any of the above values (max array size 7)</li></ul>_Not_ case-sensitive|
|**monthlyOccurrences**|Determines which days of the month the job will run.Can only be specified with a monthly frequency.|<ul><li>Array of monthlyOccurence objects:</li></ul> <pre>{ "day": _day_,<br />  "occurrence": _occurence_<br />}</pre><p> _day_ is the day of the week the job will run, e.g. {Sunday} is every Sunday of the month. Required.</p><p>Occurrence is _occurrence_ of the day during the month, e.g. {Sunday, -1} is the last Sunday of the month. Optional.</p>|
|**monthDays**|Day of the month the job will run.Can only be specified with a monthly frequency.|<ul><li>Any value <= -1 and >= -31\. -</li><li>Any value >= 1 and <= 31.</li><li>An array of above values</li></ul>|

## Examples: Recurrence Schedules

The following are various examples of recurrence schedules – focusing on the schedule object and its sub-elements.

The schedules below all assume that the _interval_ is set to 1\. Also, one must assume the right frequency in accordance to what is in the _schedule_ – e.g., one can't use frequency "day" and have a "monthDays" modification in the schedule. Such restrictions are described above.

|**Example**|**Description**|
|:---|:---|
|<code>{"hours":[5]}</code>|Run at 5AM Every DayAzure Scheduler matches up each value in "hours" with each value in "minutes", one by one, to create a list of all the times at which the job is to be run.|
|<code>{"minutes":[15],"hours":[5]}</code>|Run at 5:15AM Every Day|
|<code>{"minutes":[15],"hours":[5,17]}</code>|Run at 5:15 AM and 5:15 PM Every Day|
|<code>{"minutes":[15,45],"hours":[5,17]}</code>|Run at 5:15AM, 5:45AM, 5:15PM, and 5:45PM Every Day|
|<code>{"minutes":[0,15,30,45]}</code>|Run Every 15 Minutes|
|<code>{hours":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]}</code>|Run Every HourThis job runs every hour. The minute is controlled by the _startTime_, if one is specified, or if none is specified, by the creation time. For example, if the start time or creation time (whichever applies) is 12:25 PM, the job will be run at 00:25, 01:25, 02:25, …, 23:25.The schedule is equivalent to having a job with _frequency_ of "hour", an _interval_ of 1, and no _schedule_.The difference is that this schedule could be used with different _frequency_ and _interval_ to create other jobs too. For example, if the _frequency_ were "month", the schedule would run only once a month instead of every day if _frequency_ were "day"|
|<code>{minutes:[0]}</code>|Run Every Hour on the HourThis job also runs every hour, but on the hour (e.g. 12AM, 1AM, 2AM, etc.) This is equivalent to a job with frequency of "hour", a startTime with zero minutes, and no schedule if the frequency were "day", but if the frequency were "week" or "month," the schedule would execute only one day a week or one day a month, respectively.|
|<code>{"minutes":[15]}</code>|Run at 15 Minutes Past Hour Every HourThe following job runs every hour, starting at 00:15AM, 1:15AM, 2:15AM, etc. and ending at 10:15PM and 11:15PM.|
|<code>{"hours":[17],"weekDays":["saturday"]}</code>|Run at 5PM on Saturdays Every Week|
|<code>{hours":[17],"weekDays":["monday","wednesday","friday"]}</code>|Run at 5PM on Monday, Wednesday, and Friday Every Week|
|<code>{"minutes":[15,45],"hours":[17],"weekDays":["monday","wednesday","friday"]}</code>|Run at 5:15PM and 5:45PM on Monday, Wednesday, and Friday Every Week|
|<code>{"hours":[5,17],"weekDays":["monday","wednesday","friday"]}</code>|Run at 5AM and 5PM on Monday, Wednesday, and Friday Every Week|
|<code>{"minutes":[15,45],"hours":[5,17],"weekDays":["monday","wednesday","friday"]}</code>|Run at 5:15AM, 5:45AM, 5:15PM, and 5:45PM on Monday, Wednesday, and Friday Every Week|
|<code>{"minutes":[0,15,30,45], "weekDays":["monday","tuesday","wednesday","thursday","friday"]}</code>|Run Every 15 Minutes on Weekdays|
|<code>{"minutes":[0,15,30,45], "hours": [9, 10, 11, 12, 13, 14, 15, 16] "weekDays":["monday","tuesday","wednesday","thursday","friday"]}</code>|Run Every 15 Minutes on Weekdays between 9AM and 4:45PM|
|<code>{"weekDays":["sunday"]}</code>|Run on Sundays at Start Time|
|<code>{"weekDays":["tuesday", "thursday"]}</code>|Run on Tuesdays and Thursdays at Start Time|
|<code>{"minutes":[0],"hours":[6],"monthDays":[28]}</code>|Run at 6AM on the 28th Day of Every Month (assuming frequency of month)|
|<code>{"minutes":[0],"hours":[6],"monthDays":[-1]}</code>|Run at 6AM on the Last Day of the MonthIf you'd like to run a job on the last day of a month, use -1 instead of day 28, 29, 30, or 31.|
|<code>{"minutes":[0],"hours":[6],"monthDays":[1,-1]}</code>|Run at 6AM on the First and Last Day of Every Month|
|<code>{monthDays":[1,-1]}</code>|Run on the First and Last Day of Every Month at Start Time|
|<code>{monthDays":[1,14]}</code>|Run on the First and Fourteenth Day of Every Month at Start Time|
|<code>{monthDays":[2]}</code>|Run on the Second Day of the Month at Start Time|
|<code>{"minutes":[0], "hours":[5], "monthlyOccurrences":[{"day":"friday","occurrence":1}]}</code>|Run on First Friday of Every Month at 5AM|
|<code>{"monthlyOccurrences":[{"day":"friday","occurrence":1}]}</code>|: Run on First Friday of Every Month at Start Time|
|<code>{"monthlyOccurrences":[{"day":"friday","occurrence":-3}]}</code>|Run on Third Friday from End of Month, Every Month, at Start Time|
|<code>{"minutes":[15],"hours":[5],"monthlyOccurrences":[{"day":"friday","occurrence":1},{"day":"friday","occurrence":-1}]}</code>|Run on First and Last Friday of Every Month at 5:15AM|
|<code>{"monthlyOccurrences":[{"day":"friday","occurrence":1},{"day":"friday","occurrence":-1}]}</code>|Run on First and Last Friday of Every Month at Start Time|
|<code>{"monthlyOccurrences":[{"day":"friday","occurrence":5}]}</code>|Run on Fifth Friday of Every Month at Start TimeIf there is no fifth Friday in a month, this does not run, since it's scheduled to run on only fifth Fridays. You may consider using -1 instead of 5 for the occurrence if you want to run the job on the last occurring Friday of the month.|
|<code>{"minutes":[0,15,30,45],"monthlyOccurrences":[{"day":"friday","occurrence":-1}]}</code>|Run Every 15 Minutes on Last Friday of the Month|
|<code>{"minutes":[15,45],"hours":[5,17],"monthlyOccurrences":[{"day":"wednesday","occurrence":3}]}</code>|Run at 5:15AM, 5:45AM, 5:15PM, and 5:45PM on the 3rd Wednesday of Every Month|

## See Also

 [Scheduler Concepts, Terminology, and Entity Hierarchy](scheduler-concepts-terms.md)
 
 [Get Started Using Scheduler in the Management Portal](scheduler-get-started-portal.md)
 
 [Plans and Billing in Azure Scheduler](scheduler-plans-billing.md)
 
 [Scheduler REST API Reference](https://msdn.microsoft.com/library/dn528946)   
 
 [Scheduler High-Availability and Reliability](scheduler-high-availability-reliability.md)
 
 [Scheduler Limits, Defaults, and Error Codes](scheduler-limits-defaults-errors.md)
 
 [Scheduler Outbound Authentication](scheduler-outbound-authentication.md)
 
 