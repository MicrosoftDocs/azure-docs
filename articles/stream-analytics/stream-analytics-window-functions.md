---
title: Introduction to Azure Stream Analytics windowing functions
description: This article describes the three windowing functions (tumbling, hopping, sliding, session) that are used in Azure Stream Analytics jobs.
services: stream-analytics
author: jseb225
ms.author: jeanb
manager: kfile
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 04/30/2018
---
# Introduction to Stream Analytics Window functions
In many real time streaming scenarios, it is necessary to perform operations only on the data contained in temporal windows. Native support for windowing functions is a key feature of Azure Stream Analytics that moves the needle on developer productivity in authoring complex stream processing jobs. 

Stream Analytics enables developers to use [**Tumbling**](https://msdn.microsoft.com/library/dn835055.aspx), [**Hopping**](https://msdn.microsoft.com/library/dn835041.aspx), [**Sliding**](https://msdn.microsoft.com/library/dn835051.aspx), and [**Session**] windows to perform temporal operations on streaming data. It is worth noting that all [Window](https://msdn.microsoft.com/library/dn835019.aspx) operations output results at the **end** of the window. The output of the window will be single event based on the aggregate function used. The event will have the time stamp of the end of the window and all Window functions are defined with a fixed length. Lastly it is important to note that all Window functions should be used in a [**GROUP BY**](https://msdn.microsoft.com/library/dn835023.aspx) clause.

![Stream Analytics Window functions concepts](media/stream-analytics-window-functions/stream-analytics-window-functions-conceptual.png)

## Tumbling window
Tumbling window functions are used to segment a data stream into distinct time segments and perform a function against them, such as the example below. The key differentiators of a Tumbling window are that they repeat, do not overlap and an event cannot belong to more than one tumbling window.

![Stream Analytics tumbling window](media/stream-analytics-window-functions/stream-analytics-window-functions-tumbling-intro.png)

## Hopping window
Hopping window functions hop forward in time by a fixed period. It may be easy to think of them as Tumbling windows that can overlap, so events can belong to more than one Hopping window result set. To make a Hopping window the same as a Tumbling window one would simply specify the hop size to be the same as the window size. 

![Stream Analytics hopping window](media/stream-analytics-window-functions/stream-analytics-window-functions-hopping-intro.png)

## Sliding window
Sliding window functions, unlike Tumbling or Hopping windows, produce an output **only**  when an event occurs. Every window will have at least one event and the window continuously moves forward by an € (epsilon). Like Hopping Windows, events can belong to more than one Sliding Window.

![Stream Analytics sliding window](media/stream-analytics-window-functions/stream-analytics-window-functions-sliding-intro.png)

## Session window (Preview)
Session window functions group events that arrive at similar times, filtering out periods of time where there is no data. It has three main parameters: timeout, maximum duration, and partitioning key (optional).

![Stream Analytics session window](media/stream-analytics-window-functions/stream-analytics-window-functions-session-intro.png)

A session window begins when the first event occurs. If another event occurs within the specified timeout from the last ingested event, then the window extends to include the new event. Otherwise if no events occur within the timeout, then the window is closed at the timeout.

If events keep occurring within the specified timeout, the session window will keep extending until maximum duration is reached. Please note that the maximum duration checking intervals are set to be the same size as the specified max duration. For example, if the max duration is 10, then the checks on if the window exceed maximum duration will happen at t = 0, 10, 20, 30, […].

When a partition key is provided, the events are grouped together by the key and session window is applied to each group independently. This is useful for cases where you need different session windows for different users or devices.


## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

