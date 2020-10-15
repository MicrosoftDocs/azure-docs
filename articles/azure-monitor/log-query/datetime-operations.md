---
title: Working with date time values in Azure Monitor log queries| Microsoft Docs
description: Describes how to work with date and time data in Azure Monitor log queries.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 08/16/2018

---

# Working with date time values in Azure Monitor log queries

> [!NOTE]
> You should complete [Get started with the Analytics portal](get-started-portal.md) and [Getting started with queries](get-started-queries.md) before completing this lesson.

[!INCLUDE [log-analytics-demo-environment](../../../includes/log-analytics-demo-environment.md)]

This article describes how to work with date and time data in Azure Monitor log queries.


## Date time basics
The Kusto query language has two main data types associated with dates and times: datetime and timespan. All dates are expressed in UTC. While multiple datetime formats are supported, the ISO8601 format is preferred. 

Timespans are expressed as a decimal followed by a time unit:

|shorthand   | time unit    |
|:---|:---|
|d           | day          |
|h           | hour         |
|m           | minute       |
|s           | second       |
|ms          | millisecond  |
|microsecond | microsecond  |
|tick        | nanosecond   |

Datetimes can be created by casting a string using the `todatetime` operator. For example, to review the VM heartbeats sent in a specific timeframe, use the `between` operator to specify a time range.

```Kusto
Heartbeat
| where TimeGenerated between(datetime("2018-06-30 22:46:42") .. datetime("2018-07-01 00:57:27"))
```

Another common scenario is comparing a datetime to the present. For example, to see all heartbeats over the last two minutes, you can use the `now` operator together with a timespan that represents two minutes:

```Kusto
Heartbeat
| where TimeGenerated > now() - 2m
```

A shortcut is also available for this function:
```Kusto
Heartbeat
| where TimeGenerated > now(-2m)
```

The shortest and most readable method though is using the `ago` operator:
```Kusto
Heartbeat
| where TimeGenerated > ago(2m)
```

Suppose that instead of knowing the start and end time, you know the start time and the duration. You can rewrite the query as follows:

```Kusto
let startDatetime = todatetime("2018-06-30 20:12:42.9");
let duration = totimespan(25m);
Heartbeat
| where TimeGenerated between(startDatetime .. (startDatetime+duration) )
| extend timeFromStart = TimeGenerated - startDatetime
```

## Converting time units
You may want to express a datetime or timespan in a time unit other than the default. For example, if you're reviewing error events from the last 30 minutes and need a calculated column showing how long ago the event happened:

```Kusto
Event
| where TimeGenerated > ago(30m)
| where EventLevelName == "Error"
| extend timeAgo = now() - TimeGenerated 
```

The `timeAgo` column holds values such as: "00:09:31.5118992", meaning they're formatted as hh:mm:ss.fffffff. If you want to format these values to the `numver` of minutes since the start time, divide that value by "1 minute":

```Kusto
Event
| where TimeGenerated > ago(30m)
| where EventLevelName == "Error"
| extend timeAgo = now() - TimeGenerated
| extend timeAgoMinutes = timeAgo/1m 
```


## Aggregations and bucketing by time intervals
Another common scenario is the need to obtain statistics over a certain time period in a particular time grain. For this scenario, a `bin` operator can be used as part of a summarize clause.

Use the following query to get the number of events that occurred every 5 minutes during the last half hour:

```Kusto
Event
| where TimeGenerated > ago(30m)
| summarize events_count=count() by bin(TimeGenerated, 5m) 
```

This query produces the following table:  

|TimeGenerated(UTC)|events_count|
|--|--|
|2018-08-01T09:30:00.000|54|
|2018-08-01T09:35:00.000|41|
|2018-08-01T09:40:00.000|42|
|2018-08-01T09:45:00.000|41|
|2018-08-01T09:50:00.000|41|
|2018-08-01T09:55:00.000|16|

Another way to create buckets of results is to use functions, such as `startofday`:

```Kusto
Event
| where TimeGenerated > ago(4d)
| summarize events_count=count() by startofday(TimeGenerated) 
```

This query produces the following results:

|timestamp|count_|
|--|--|
|2018-07-28T00:00:00.000|7,136|
|2018-07-29T00:00:00.000|12,315|
|2018-07-30T00:00:00.000|16,847|
|2018-07-31T00:00:00.000|12,616|
|2018-08-01T00:00:00.000|5,416|


## Time zones
Since all datetime values are expressed in UTC, it's often useful to convert these values into the local timezone. For example, use this calculation to convert UTC to PST times:

```Kusto
Event
| extend localTimestamp = TimeGenerated - 8h
```

## Related functions

| Category | Function |
|:---|:---|
| Convert data types | [todatetime](/azure/kusto/query/todatetimefunction)  [totimespan](/azure/kusto/query/totimespanfunction)  |
| Round value to bin size | [bin](/azure/kusto/query/binfunction) |
| Get a specific date or time | [ago](/azure/kusto/query/agofunction) [now](/azure/kusto/query/nowfunction)   |
| Get part of value | [datetime_part](/azure/kusto/query/datetime-partfunction) [getmonth](/azure/kusto/query/getmonthfunction) [monthofyear](/azure/kusto/query/monthofyearfunction) [getyear](/azure/kusto/query/getyearfunction) [dayofmonth](/azure/kusto/query/dayofmonthfunction) [dayofweek](/azure/kusto/query/dayofweekfunction) [dayofyear](/azure/kusto/query/dayofyearfunction) [weekofyear](/azure/kusto/query/weekofyearfunction) |
| Get a relative date value  | [endofday](/azure/kusto/query/endofdayfunction) [endofweek](/azure/kusto/query/endofweekfunction) [endofmonth](/azure/kusto/query/endofmonthfunction) [endofyear](/azure/kusto/query/endofyearfunction) [startofday](/azure/kusto/query/startofdayfunction) [startofweek](/azure/kusto/query/startofweekfunction) [startofmonth](/azure/kusto/query/startofmonthfunction) [startofyear](/azure/kusto/query/startofyearfunction) |

## Next steps
See other lessons for using the [Kusto query language](/azure/kusto/query/) with Azure Monitor log data:

- [String operations](string-operations.md)
- [Aggregation functions](aggregations.md)
- [Advanced aggregations](advanced-aggregations.md)
- [JSON and data structures](json-data-structures.md)
- [Advanced query writing](advanced-query-writing.md)
- [Joins](joins.md)
- [Charts](charts.md)
