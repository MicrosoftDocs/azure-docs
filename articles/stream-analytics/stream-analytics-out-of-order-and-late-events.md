
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
# Azure Stream Analytics event order consideration

## Understand arrival time and application time.

In a temporal data stream of events, each event is assigned a timestamp. Azure Stream Analytics assigns timestamp to each event using either Arrival time or Application Time. The "System.Timestamp" column has the timestamp assigned to the event. Arrival time is assigned at the input source when the event reaches the source. Arrival time is EventEnqueuedTime for Event Hub input and [blob last modified time](https://docs.microsoft.com/en-us/dotnet/api/microsoft.windowsazure.storage.blob.blobproperties.lastmodified?view=azurestorage-8.1.3) for blob input. Application Time is assigned when the event is generated and it is part of the payload. To process events by application time, use the "Timestamp by" clause in the select query. If the "Timestamp by" clause is absent, events are processed by Arrival time. Arrival time can be accessed using EventEnqueuedTime property for event hub and using BlobLastModified property for blob input. Azure Stream Analytics produces output in the timestamp order and provides few settings to deal with out of order data.


## Azure Stream Analytics handling of multiple streams

Azure Stream Analytics job combines events from multiple timelines in few cases including,

1. Producing output from multiple partitions. Queries that don't have an explicit "Partition by PartitionId" would have to combine events from all the partitions.
2. Union of two or more different input sources.
3. Joining input sources.

In scenarios where multiple timelines are combined, Azure Stream Analytics will produce output for a timestamp *t1* only after all the sources that are combined are at least at time *t1*.
For example, if the query reads from an *Event Hub* partition that has two partitions and one of the partition *P1* has events until time *t1* and other partition *P2* has events until time *t1 + x*, output is produced until time *t1*.
However if there was an explicit *"Partition by PartitionId"* clause, both the partitions progresses independently.
Late Arrival Tolerance setting is used to deal with absence of data in some partitions.

## Configuring Late arrival tolerance and out of order tolerance
Input streams that are not in order are either:
* Sorted (and therefore **delayed**).
* Adjusted by the system, according to the user-specified policy.

Stream Analytics tolerates late and out of order events when processing by **application time**. The following settings are available in the **Event ordering** option in Azure portal: 

![Stream Analytics event handling](media/stream-analytics-event-handling/stream-analytics-event-handling.png)

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

* Late Arrival tolerance = 10 minutes<br/>
* Out of order tolerance = 3 minutes<br/>
* Processing by application time<br/>
* Events:
   * Event 1 _Application Time_ = 00:00:00, _Arrival Time_ = 00:10:01, _System.Timestamp_ = 00:00:01, adjusted because (_Arrival Time_ - _Application Time_) is more than late arrival tolerance.
   * Event 2 _Application Time_ = 00:00:01, _Arrival Time_ = 00:10:01, _System.Timestamp_ = 00:00:01, not adjusted because application time is within the late arrival window.
   * Event 3 _Application Time_ = 00:10:00, _Arrival Time_ = 00:10:02, _System.Timestamp_ = 00:10:00, not adjusted because appliation time is within the late arrival window.
   * Event 4 _Application Time_ = 00:09:00, _Arrival Time_ = 00:10:03, _System.Timestamp_ = 00:09:00, accepted with original timestamp as application time is within the out of order tolerance.
   * Event 5 _Application Time_ = 00:06:00, _Arrival Time_ = 00:10:04, _System.Timestamp_ = 00:07:00, adjusted because application time is older than the out of order tolerance.

## Practical considerations
As mentioned above, *late arrival tolerance* is the maximum difference between application time and arrival time.
Also when processing by application time, events that are later than the configured *late arrival tolerance* are adjusted before the *out of order tolerance* setting is applied. So, effective out of order is the minimum of late arrival tolerance and out of order tolerance.

Out of order events within a stream happen due to reasons including,
1. Clock-skew among the senders.
2. Variable Latency between sender and input event source.

Late arrival happens due to reasons including,
1. Senders batch and send the events for an interval later, after the interval.
2. Latency between sending the event by sender and receiving the event at input source.

While configuring *late arrival tolerance* and *out of order tolerance* for a specific job, correctness, latency requirements, and above factors should be considered.

Following are few examples

### Example 1: 
Query has "Partition by PartitionId" clause and within a single partition, events are sent using synchronous send methods. Synchronous send methods block until the events are sent.
In this case, out of order is zero because events are sent in order with explicit confirmation before sending next event. Late arrival is maximum delay between generating the event and sending the event + maximum latency between sender and input source

### Example 2:
Query has "Partition by PartitionId" clause and within a single partition, events are sent using asynchronous send method. Asynchronous send methods can initiate multiple sends at the same time, which can cause out of order events.
In this case, both out of order and late arrival are at least maximum delay between generating the event and sending the event + maximum latency between sender and input source.

### Example 3:
Query does not have "Partition by PartitionId" and there are at least two partitions.
Configuration is same as example 2. However, absence of data in one of the partitions can delay the output by an additional *late arrival tolerance" window.

## To summarize
1. Late arrival tolerance and out of order window should be configured based on correctness, latency requirements and should also consider how the events are sent.
2. It is recommended that out of order tolerance is smaller than late arrival tolerance.
3. When combining multiple timelines, lack of data in one of the sources or partitions can delay the output by an additional late arrival tolerance window.

## Get help
For additional assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics).

## Next steps
* [Introduction to Stream Analytics](stream-analytics-introduction.md)
* [Get started with Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Stream Analytics query language reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Stream Analytics management REST API reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
