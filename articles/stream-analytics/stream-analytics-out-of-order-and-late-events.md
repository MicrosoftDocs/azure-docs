---
title: Handling event order and lateness with Azure Stream Analytics | Microsoft Docs
description: Learn about how Stream Analytics works with out-of-order or late events in data streams.
keywords: out of order, late, events
documentationcenter: ''
services: stream-analytics
author: jseb225
manager: jhubbard
editor: cgronlun

ms.assetid: 
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 04/20/2017
ms.author: jeanb

---
# Azure Stream Analytics event order considerations

## Arrival time and application time

In a temporal data stream of events, each event is assigned a time stamp. Azure Stream Analytics assigns a time stamp to each event by using either arrival time or application time. The **System.Timestamp** column has the time stamp assigned to the event. 

Arrival time is assigned at the input source when the event reaches the source. Arrival time is **EventEnqueuedTime** for event hub input and [BlobProperties.LastModified](https://docs.microsoft.com/en-us/dotnet/api/microsoft.windowsazure.storage.blob.blobproperties.lastmodified?view=azurestorage-8.1.3) for blob input. 

Application time is assigned when the event is generated and it is part of the payload. To process events by application time, use the **Timestamp by** clause in the select query. If the **Timestamp by** clause is absent, events are processed by arrival time. 

You can access arrival time by using the **EventEnqueuedTime** property for event hub input and using the **BlobProperties.LastModified** property for blob input. Azure Stream Analytics produces output in the time stamp order and provides settings to deal with out-of-order data.


## Handling of multiple streams

An Azure Stream Analytics job combines events from multiple timelines in cases like the following:

* Producing output from multiple partitions. Queries that don't have an explicit **Partition by PartitionId** would have to combine events from all the partitions.
* Union of two or more different input sources.
* Joining input sources.

In scenarios where multiple timelines are combined, Azure Stream Analytics will produce output for a time stamp *t1* only after all the sources that are combined are at least at time *t1*.
For example, if the query reads from an *Event Hub* partition that has two partitions and one of the partition *P1* has events until time *t1* and other partition *P2* has events until time *t1 + x*, output is produced until time *t1*.
But if there was an explicit **Partition by PartitionId** clause, both the partitions progress independently.

The setting for late arrival tolerance is used to deal with absence of data in some partitions.

## Configuring late arrival tolerance and out-of-order tolerance
Input streams that are not in order are either:
* Sorted (and therefore delayed).
* Adjusted by the system, according to the user-specified policy.

Stream Analytics tolerates late and out-of-order events when you're processing by application time. The following settings are available in the **Event ordering** option in the Azure portal: 

![Stream Analytics event handling](media/stream-analytics-event-handling/stream-analytics-event-handling.png)

### Late arrival tolerance
* This setting is applicable only when you're processing by application time. Otherwise, it is ignored.
* This is the maximum difference between arrival time and application time. If application time is before (**Arrival Time - Late Arrival Window**), it is set to (**Arrival Time - Late Arrival Window**).
* When multiple partitions from the same input stream or multiple input streams are combined, late arrival tolerance is the maximum amount of time that every partition waits for new data. 

The late arrival window is the maximum delay between event generation and receiving of the event at the input source. Adjustment based on late arrival tolerance is done first, and out-of-order tolerance is done next. The **System.Timestamp** column will have the final time stamp assigned to the event.

### Out-of-order tolerance
* Events that arrive out of order but within the set out-of-order tolerance window are reordered by time stamp. 
* Events that arrive later than tolerance are either adjusted or dropped:
    * **Adjusted**: Adjusted to appear to have arrived at the latest acceptable time. 
    * **Dropped**: Discarded.

To reorder events received within the out-of-order tolerance window, the output of the query is **delayed by out of order tolerance window**.

### Example

* Late Arrival tolerance = 10 minutes<br/>
* Out-of-order tolerance = 3 minutes<br/>
* Processing by application time<br/>
* Events:
   * Event 1 _Application Time_ = 00:00:00, _Arrival Time_ = 00:10:01, _System.Timestamp_ = 00:00:01, adjusted because (_Arrival Time_ - _Application Time_) is more than late arrival tolerance.
   * Event 2 _Application Time_ = 00:00:01, _Arrival Time_ = 00:10:01, _System.Timestamp_ = 00:00:01, not adjusted because application time is within the late arrival window.
   * Event 3 _Application Time_ = 00:10:00, _Arrival Time_ = 00:10:02, _System.Timestamp_ = 00:10:00, not adjusted because application time is within the late arrival window.
   * Event 4 _Application Time_ = 00:09:00, _Arrival Time_ = 00:10:03, _System.Timestamp_ = 00:09:00, accepted with original time stamp as application time is within the out-of-order tolerance.
   * Event 5 _Application Time_ = 00:06:00, _Arrival Time_ = 00:10:04, _System.Timestamp_ = 00:07:00, adjusted because application time is older than the out-of-order tolerance.

## Practical considerations
As mentioned earlier, late arrival tolerance is the maximum difference between application time and arrival time. When you're processing by application time, events that are later than the configured late arrival tolerance are adjusted before the out-of-order tolerance setting is applied. So, effective out of order is the minimum of late arrival tolerance and out-of-order tolerance.

Reasons for out-of-order events within a stream include:
* Clock skew among the senders.
* Variable latency between the sender and the input event source.

Reasons for late arrival include:
* Senders batching and sending the events for an interval later, after the interval.
* Latency between sending the event by sender and receiving the event at input source.

When you're configuring late arrival tolerance and out-of-order tolerance for a specific job, consider correctness, latency requirements, and the preceding factors.

Following are a few examples.

### Example 1 
The query has a **Partition by PartitionId** clause. Within a single partition, events are sent via synchronous send methods. Synchronous send methods block until the events are sent.

In this case, out of order is zero because events are sent in order with explicit confirmation before the next event is sent. Late arrival is the maximum delay between generating the event and sending the event, plus the maximum latency between the sender and the input source.

### Example 2
The query has a **Partition by PartitionId** clause. Within a single partition, events are sent via asynchronous send methods. Asynchronous send methods can initiate multiple sends at the same time, which can cause out-of-order events.

In this case, both out of order and late arrival are at least the maximum delay between generating the event and sending the event, plus the maximum latency between the sender and the input source.

### Example 3
The query does not have a **Partition by PartitionId**, and there are at least two partitions.

Configuration is the same as example 2. However, absence of data in one of the partitions can delay the output by an additional late arrival tolerance window.

## Summary
* Configure late arrival tolerance and the out-of-order window based on correctness and latency requirements. Also consider how the events are sent.
* We recommend that out-of-order tolerance is smaller than late arrival tolerance.
* When you're combining multiple timelines, lack of data in one of the sources or partitions can delay the output by an additional late arrival tolerance window.

## Get help
For additional assistance, try the [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics).

## Next steps
* [Introduction to Stream Analytics](stream-analytics-introduction.md)
* [Get started with Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Stream Analytics query language reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Stream Analytics management REST API reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
