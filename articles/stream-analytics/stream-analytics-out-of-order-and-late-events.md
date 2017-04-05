---
title:  Remediating Azure Stream Analytics issues with event lateness and ordering | Microsoft Docs
description: How Stream Analytics works with out of order or late events in data streams.
keywords: out of order, late, events
documentationcenter: ''
services: stream-analytics
author: jeffstokes72
manager: jhubbard
editor: cgronlun

ms.assetid: 
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 04/03/2017
ms.author: jeffstok

---
# Azure Stream Analytics event disorder handling

Given a temporal data stream of events, each individual event is recorded by time received. Some conditions can cause event streams to be occasionally receive individual events out of the order sent. A simple TCP retransmit or even clock-skew between sending device and the receiving Event Hub can cause this to occur. Additionally, “punctuation” events are added to received event streams to advance the time in the absence of event arrivals. These are needed for actualizing scenarios such as “Notify me when no logins occur for 3 minutes."

Input streams that are not in-order are either:
* Sorted (and therefore **delayed**)
* Adjusted by the system, as per a user-specified policy


## Tolerance for lateness
Stream Analytics tolerates these scenarios and has handling for "out of order events" and "late events."

* Events arrive out of order but within the tolerance: **Re-ordered by timestamp**
* Events arrive later than tolerance: **Dropped or Adjusted**
    * **Adjust** - Adjusted to appear to have arrived at the latest still acceptable time
    * **Drop** - Discarded

![Stream Analytics event handling](media/stream-analytics-event-handling/stream-analytics-event-handling.png)

## Reducing the number of out of order events

Since Stream Analytics applies a temporal transformation when processing the incoming events (e.g. windowed aggregates, and temporal joins) it sorts the incoming events by timestamp order.

When the “timestamp by” keyword is **not** used, Event Hub’s event enqueue time is used by default. Event Hub guarantees for monotonicity of the timestamp on each partition of the Event Hub, and merging of events from all partitions by timestamp order ensures that there are no out of order events.

When it’s important for you to use sender’s timestamp, so a timestamp from the event payload is chosen using “timestamp by,” there can be one or more sources of disorder introduced:

* Producers of the events have clock skews. This is common when producers are from different machines, so they have different clocks.
* Network delay from the source of the events to the destination Event Hub.
* Clock skews between Event Hub partitions. This is also a factor because Stream Analytics first sort events from all Event Hub partitions by event enqueue time, and then examine the data stream for disordered events.

On the configuration tab, you will find the following defaults.

![Stream Analytics out of order handling](media/stream-analytics-event-handling/stream-analytics-out-of-order-handling.png)

Using 0 seconds as the out of order tolerance window means you assert all events are in order all the time. Given the 3 sources of disorder, it’s unlikely true. To allow ASA to correct the event disorder, you can specify a non-zero out of order tolerance window size. Stream Analytics will then buffer events up to that window and reorder them using the user-chosen timestamp before applying the temporal transformation. You can start with a 3 second window first, and tune the value to reduce the number of events get time adjusted. Because of the buffering, the side effect is the output is **delayed by the same amount of time**. As a result, you will need to tune the value to reduce the number of out of order events and keep the job latency low.

## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)