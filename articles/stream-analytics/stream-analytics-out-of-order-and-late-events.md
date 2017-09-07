---
title: Handling event order and lateness with Azure Stream Analytics | Microsoft Docs
description: Learn about how Stream Analytics works with out-of-order or late events in data streams.
keywords: out of order, late, events
documentationcenter: ''
services: stream-analytics
author: samacha
manager: jhubbard
editor: cgronlun

ms.assetid: 
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 04/20/2017
ms.author: samacha

---
# Azure Stream Analytics event order handling

In a temporal data stream of events, each event is assigned a timestamp. Azure Stream Analytics assigns timestamp to each event using either Arrival time or Application Time. The "System.Timestamp" column has the timestamp assigned to the event. Arrival time is assigned at the input source when the event reaches the source. Arrival time is EventEnqueuedTime for Event Hub input and [blob last modified time](https://docs.microsoft.com/en-us/dotnet/api/microsoft.windowsazure.storage.blob.blobproperties.lastmodified?view=azurestorage-8.1.3) for blob input. Application Time is assigned when the event is generated and it is part of the payload. To process events by application time, use the "Timestamp by" clause in the select query. If the "Timestamp by" clause is absent, events are processed by Arrival time. Arrival time can be accessed using EventEnqueuedTime property for event hub and using BlobLastModified property for blob input. Azure Stream Analytics produces output in the timestamp order and provides few settings to deal with out of order data.

![Stream Analytics event handling](media/stream-analytics-event-handling/stream-analytics-event-handling.png)

Input streams that are not in order are either:
* Sorted (and therefore **delayed**).
* Adjusted by the system, according to the user-specified policy.

Stream Analytics tolerates late and out of order events when processing by application time.

**Late Arrival tolerance**

* This setting is applicable only when processing by Application time, otherwise it is ignored.
* This is the maximum difference between Arrival time and Application time. If Application time is before (Arrival Time - Late Arrival Window), it is set to (Arrival Time - Late Arrival Window)
* When multiple partitions from the same input stream or multiple input streams are combined together, late arrival tolerance is the maximum amount of time every partition waits for new data. 

Briefly, late arrival window is the maximum delay between event generation and receiving of the event at input source.
Adjustment based on Late arrival tolerance is done first and out of order is done next. The **System.Timestamp** column will have the final timestamp assigned to the event.

**Out of order tolerance**

* Events that arrive out of order but within the set "out of order tolerance window" are **reordered by timestamp**. 
* Events that arrive later than tolerance are **either dropped or adjusted**.
    * **Adjusted**: Adjusted to appear to have arrived at the latest acceptable time. 
    * **Dropped**: Discarded.

To reorder events received within "out of order tolerance window", output of the query is **delayed by out of order tolerance window**.

**Example**

Late Arrival tolerance = 10 minutes<br/>
Out of order tolerance = 3 minutes<br/>
Processing by application time<br/>

Events:

Event 1 _Application Time_ = 00:00:00, _Arrival Time_ = 00:10:01, _System.Timestamp_ = 00:00:01, adjusted because (_Arrival Time_ - _Application Time_) is more than late arrival tolerance.

Event 2 _Application Time_ = 00:00:01, _Arrival Time_ = 00:10:01, _System.Timestamp_ = 00:00:01, not adjusted because application time is within the late arrival window.

Event 3 _Application Time_ = 00:10:00, _Arrival Time_ = 00:10:02, _System.Timestamp_ = 00:10:00, not adjusted because appliation time is within the late arrival window.

Event 4 _Application Time_ = 00:09:00, _Arrival Time_ = 00:10:03, _System.Timestamp_ = 00:09:00, accepted with original timestamp as application time is within the out of order tolerance.

Event 5 _Application Time_ = 00:06:00, _Arrival Time_ = 00:10:04, _System.Timestamp_ = 00:07:00, adjusted because application time is older than the out of order tolerance.



## Get help
For additional assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics).

## Next steps
* [Introduction to Stream Analytics](stream-analytics-introduction.md)
* [Get started with Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Stream Analytics query language reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Stream Analytics management REST API reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
