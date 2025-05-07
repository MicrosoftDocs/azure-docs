---
title: Introduction to Azure Stream Analytics windowing functions
description: This article describes four windowing functions (tumbling, hopping, sliding, session) that are used in Azure Stream Analytics jobs.
ms.service: azure-stream-analytics
ms.topic: conceptual
ms.date: 12/17/2024
---
# Introduction to Stream Analytics windowing functions

In time-streaming scenarios, performing operations on the data contained in temporal windows is a common pattern. Stream Analytics has native support for windowing functions, enabling developers to author complex stream processing jobs with minimal effort.

There are five kinds of temporal windows to choose from: 

- [**Tumbling**](/stream-analytics-query/tumbling-window-azure-stream-analytics)
- [**Hopping**](/stream-analytics-query/hopping-window-azure-stream-analytics)
- [**Sliding**](/stream-analytics-query/sliding-window-azure-stream-analytics)
- [**Session**](/stream-analytics-query/session-window-azure-stream-analytics)
- [**Snapshot**](/stream-analytics-query/snapshot-window-azure-stream-analytics) windows. 

You use the window functions in the [**GROUP BY**](/stream-analytics-query/group-by-azure-stream-analytics) clause of the query syntax in your Stream Analytics jobs. You can also aggregate events over multiple windows using the [**Windows()** function](/stream-analytics-query/windows-azure-stream-analytics).

All the [windowing](/stream-analytics-query/windowing-azure-stream-analytics) operations output results at the **end** of the window. When you start a stream analytics job, you can specify the *Job output start time*, and the system automatically fetches previous events in the incoming streams to output the first window at the specified time; for example, when you start with the *Now* option, it starts to emit data immediately. The output of the window will be a single event based on the aggregate function used. The output event has the time stamp of the end of the window and all window functions are defined with a fixed length.

:::image type="content" source="media/stream-analytics-window-functions/stream-analytics-window-functions-conceptual.png" alt-text="Diagram that shows the concept of Stream Analytics window functions.":::

## Tumbling window

Use [**Tumbling**](/stream-analytics-query/tumbling-window-azure-stream-analytics) window functions to segment a data stream into distinct time segments, and perform a function against them.

The key differentiators of a tumbling window are:

- They don't repeat.
- They don't overlap.
- An event can't belong to more than one tumbling window.

:::image type="content" source="media/stream-analytics-window-functions/stream-analytics-window-functions-tumbling-intro.png" alt-text="Diagram that shows an example Stream Analytics tumbling window.":::

Here's the input data for the example: 

|Stamp|CreatedAt|TimeZone|
|-|-|-|
|1|2021-10-26T10:15:01|PST|
|5|2021-10-26T10:15:03|PST|
|4|2021-10-26T10:15:06|PST|
|...|...|...|

Here's the sample query:

```SQL
SELECT System.Timestamp() as WindowEndTime, TimeZone, COUNT(*) AS Count
FROM TwitterStream TIMESTAMP BY CreatedAt
GROUP BY TimeZone, TumblingWindow(second,10)
```

Here's the sample output: 

|WindowEndTime|TimeZone|Count|
|-|-|-|
|2021-10-26T10:15:10|PST|5|
|2021-10-26T10:15:20|PST|2|
|2021-10-26T10:15:30|PST|4|

## Hopping window

[**Hopping**](/stream-analytics-query/hopping-window-azure-stream-analytics) window functions hop forward in time by a fixed period. It might be easy to think of them as tumbling windows that can overlap and be emitted more often than the window size. Events can belong to more than one Hopping window result set. To make a Hopping window the same as a Tumbling window, specify the hop size to be the same as the window size.

:::image type="content" source="media/stream-analytics-window-functions/stream-analytics-window-functions-hopping-intro.png" alt-text="Diagram that shows an example of the hopping window.":::

Here's the sample data:

|Stamp|CreatedAt|Topic|
|-|-|-|
|1|2021-10-26T10:15:01|Streaming|
|5|2021-10-26T10:15:03|Streaming|
|4|2021-10-26T10:15:06|Streaming|
|...|...|...|

Here's the sample query:

```SQL
SELECT System.Timestamp() as WindowEndTime, Topic, COUNT(*) AS Count
FROM TwitterStream TIMESTAMP BY CreatedAt
GROUP BY Topic, HoppingWindow(second,10,5)
```

Here's the sample output:

|WindowEndTime|Topic|Count|
|-|-|-|
|2021-10-26T10:15:10|Streaming|5|
|2021-10-26T10:15:15|Streaming|3|
|2021-10-26T10:15:20|Streaming|2|
|2021-10-26T10:15:25|Streaming|4|
|2021-10-26T10:15:30|Streaming|4|

## Sliding window

[**Sliding**](/stream-analytics-query/sliding-window-azure-stream-analytics) windows, unlike tumbling or hopping windows, output events only for points in time when the content of the window actually changes. In other words, when an event enters or exits the window. So, every window has at least one event. Similar to hopping windows, events can belong to more than one sliding window.

:::image type="content" source="media/stream-analytics-window-functions/stream-analytics-window-functions-sliding-intro.png" alt-text="Diagram that shows an example of a sliding window.":::

Here's the sample input data:

|Stamp|CreatedAt|Topic|
|-|-|-|
|1|2021-10-26T10:15:10|Streaming|
|5|2021-10-26T10:15:12|Streaming|
|9|2021-10-26T10:15:15|Streaming|
|7|2021-10-26T10:15:15|Streaming|
|8|2021-10-26T10:15:27|Streaming|

Here's the sample query:

```SQL
SELECT System.Timestamp() as WindowEndTime, Topic, COUNT(*) AS Count
FROM TwitterStream TIMESTAMP BY CreatedAt
GROUP BY Topic, SlidingWindow(second,10)
HAVING COUNT(*) >=3
```

Output:

|WindowEndTime|Topic|Count|
|-|-|-|
|2021-10-26T10:15:15|Streaming|4|
|2021-10-26T10:15:20|Streaming|3|

## Session window

[**Session**](/stream-analytics-query/session-window-azure-stream-analytics) window functions group events that arrive at similar times, filtering out periods of time where there's no data. It has three main parameters: 

- Timeout
- Maximum duration
- Partitioning key (optional).

:::image type="content" source="media/stream-analytics-window-functions/stream-analytics-window-functions-session-intro.png" alt-text="Diagram that shows a sample Stream Analytics session window.":::

A session window begins when the first event occurs. If another event occurs within the specified timeout from the last ingested event, then the window extends to include the new event. Otherwise if no events occur within the timeout, then the window is closed at the timeout.

If events keep occurring within the specified timeout, the session window keeps extending until maximum duration is reached. The maximum duration checking intervals are set to be the same size as the specified max duration. For example, if the max duration is 10, then the checks on if the window exceeds maximum duration happen at t = 0, 10, 20, 30, etc.

When a partition key is provided, the events are grouped together by the key and session window is applied to each group independently. This partitioning is useful for cases where you need different session windows for different users or devices.

Here's the sample input data:

|Stamp|CreatedAt|Topic|
|-|-|-|
|1|2021-10-26T10:15:01|Streaming|
|2|2021-10-26T10:15:04|Streaming|
|3|2021-10-26T10:15:13|Streaming|
|...|...|...|

Here's the sample query:

```SQL
SELECT System.Timestamp() as WindowEndTime, Topic, COUNT(*) AS Count
FROM TwitterStream TIMESTAMP BY CreatedAt
GROUP BY Topic, SessionWindow(second,5,10)
```

Output:

|WindowEndTime|Topic|Count|
|-|-|-|
|2021-10-26T10:15:09|Streaming|2|
|2021-10-26T10:15:24|Streaming|4|
|2021-10-26T10:15:31|Streaming|2|
|2021-10-26T10:15:39|Streaming|1|

## Snapshot window

[**Snapshot**](/stream-analytics-query/snapshot-window-azure-stream-analytics) windows group events that have the same timestamp. Unlike other windowing types, which require a specific window function (such as [SessionWindow()](/stream-analytics-query/session-window-azure-stream-analytics)), you can apply a snapshot window by adding System.Timestamp() to the GROUP BY clause.

:::image type="content" source="media/stream-analytics-window-functions/stream-analytics-window-functions-snapshot-intro.png" alt-text="Diagram that shows a sample Steam Analytics snapshot window.":::

Here's the sample input data:

|Stamp|CreatedAt|Topic|
|-|-|-|
|1|2021-10-26T10:15:04|Streaming|
|2|2021-10-26T10:15:04|Streaming|
|3|2021-10-26T10:15:04|Streaming|
|...|...|...|

Here's the sample query:

```SQL
SELECT System.Timestamp() as WindowEndTime, Topic, COUNT(*) AS Count
FROM TwitterStream TIMESTAMP BY CreatedAt
GROUP BY Topic, System.Timestamp()
```

Here's the sample output:

|WindowEndTime|Topic|Count|
|-|-|-|
|2021-10-26T10:15:04|Streaming|4|
|2021-10-26T10:15:10|Streaming|2|
|2021-10-26T10:15:13|Streaming|1|
|2021-10-26T10:15:22|Streaming|2|

## Next steps

See the following articles:

* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics Management REST API Reference](/rest/api/streamanalytics/)
