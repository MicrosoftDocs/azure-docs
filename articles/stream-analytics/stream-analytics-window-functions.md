---
title: Introduction to Azure Stream Analytics windowing functions
description: This article describes four windowing functions (tumbling, hopping, sliding, session) that are used in Azure Stream Analytics jobs.
services: stream-analytics
author: jseb225
ms.author: jeanb
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 06/11/2019
---
# Introduction to Stream Analytics windowing functions

In time-streaming scenarios, performing operations on the data contained in temporal windows is a common pattern. Stream Analytics has native support for windowing functions, enabling developers to author complex stream processing jobs with minimal effort.

There are four kinds of temporal windows to choose from: [**Tumbling**](https://docs.microsoft.com/stream-analytics-query/tumbling-window-azure-stream-analytics), [**Hopping**](https://docs.microsoft.com/stream-analytics-query/hopping-window-azure-stream-analytics), [**Sliding**](https://docs.microsoft.com/stream-analytics-query/sliding-window-azure-stream-analytics), and [**Session**](https://docs.microsoft.com/stream-analytics-query/session-window-azure-stream-analytics) windows.  You use the window functions in the [**GROUP BY**](https://docs.microsoft.com/stream-analytics-query/group-by-azure-stream-analytics) clause of the query syntax in your Stream Analytics jobs. You can also aggregate events over multiple windows using the [**Windows()** function](https://docs.microsoft.com/stream-analytics-query/windows-azure-stream-analytics).

All the [windowing](https://docs.microsoft.com/stream-analytics-query/windowing-azure-stream-analytics) operations output results at the **end** of the window. The output of the window will be single event based on the aggregate function used. The output event will have the time stamp of the end of the window and all window functions are defined with a fixed length. 

![Stream Analytics window functions concepts](media/stream-analytics-window-functions/stream-analytics-window-functions-conceptual.png)

## Tumbling window
Tumbling window functions are used to segment a data stream into distinct time segments and perform a function against them, such as the example below. The key differentiators of a Tumbling window are that they repeat, do not overlap, and an event cannot belong to more than one tumbling window.

![Stream Analytics tumbling window](media/stream-analytics-window-functions/stream-analytics-window-functions-tumbling-intro.png)

## Hopping window
Hopping window functions hop forward in time by a fixed period. It may be easy to think of them as Tumbling windows that can overlap, so events can belong to more than one Hopping window result set. To make a Hopping window the same as a Tumbling window, specify the hop size to be the same as the window size. 

![Stream Analytics hopping window](media/stream-analytics-window-functions/stream-analytics-window-functions-hopping-intro.png)

## Sliding window
Sliding window functions, unlike Tumbling or Hopping windows, produce an output **only**  when an event occurs. Every window will have at least one event and the window continuously moves forward by an € (epsilon). Like hopping windows, events can belong to more than one sliding window.

![Stream Analytics sliding window](media/stream-analytics-window-functions/stream-analytics-window-functions-sliding-intro.png)

## Session window
Session window functions group events that arrive at similar times, filtering out periods of time where there is no data. It has three main parameters: timeout, maximum duration, and partitioning key (optional).

![Stream Analytics session window](media/stream-analytics-window-functions/stream-analytics-window-functions-session-intro.png)

A session window begins when the first event occurs. If another event occurs within the specified timeout from the last ingested event, then the window extends to include the new event. Otherwise if no events occur within the timeout, then the window is closed at the timeout.

If events keep occurring within the specified timeout, the session window will keep extending until maximum duration is reached. The maximum duration checking intervals are set to be the same size as the specified max duration. For example, if the max duration is 10, then the checks on if the window exceed maximum duration will happen at t = 0, 10, 20, 30, etc.

When a partition key is provided, the events are grouped together by the key and session window is applied to each group independently. This partitioning is useful for cases where you need different session windows for different users or devices.


## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

