---
title: Handling event order and lateness in Azure Stream Analytics
description: This article describes how Stream Analytics handles out-of-order or late events in data streams.
services: stream-analytics
author: jseb225
ms.author: jeanb
manager: kfile
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 04/20/2017
---
# Azure Stream Analytics event order considerations

## Arrival time and application time

In a temporal data stream of events, each event is assigned a time stamp. Azure Stream Analytics assigns a time stamp to each event by using either arrival time or application time. The **System.Timestamp** column has the time stamp assigned to the event. 

Arrival time is assigned at the input source when the event reaches the source. You can access arrival time by using the **EventEnqueuedUtcTime** property for Event Hubs inputs, **IoTHub.EnqueuedTime** property for IoT Hub, and using the [BlobProperties.LastModified](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.blobproperties.lastmodified?view=azurestorage-8.1.3) property for blob input. 

Application time is assigned when the event is generated and it is part of the payload. To process events by application time, use the **Timestamp by** clause in the select query. If the **Timestamp by** clause is absent, events are processed by arrival time. 

Azure Stream Analytics produces output in the time-stamp order and provides settings to deal with out-of-order data.


## Handling of multiple streams

An Azure Stream Analytics job combines events from multiple timelines in cases like the following:

* Producing output from multiple partitions. Queries that don't have an explicit **Partition by PartitionId** clause must combine events from all the partitions.
* Union of two or more different input sources.
* Joining input sources.

In scenarios where multiple timelines are combined, Azure Stream Analytics produces output for time stamp *t1* only after all the sources that are combined are at least at time *t1*. For example, assume that the query reads from an event hub partition that has two partitions. One of the partitions, *P1*, has events until time *t1*. The other partition, *P2*, has events until time *t1 + x*. Output is then produced until time *t1*. But if there's an explicit **Partition by PartitionId** clause, both the partitions progress independently.

The setting for late arrival tolerance is used to deal with the absence of data in some partitions.

## Configuring late arrival tolerance and out-of-order tolerance
Input streams that are not in order are either:
* Sorted (and therefore delayed)
* Adjusted by the system, according to the user-specified policy

Stream Analytics tolerates late and out-of-order events when you're processing by application time. The following settings are available in the **Event ordering** option in the Azure portal: 

![Stream Analytics event handling](media/stream-analytics-event-handling/stream-analytics-event-handling.png)

### Late arrival tolerance
Late arrival tolerance is applicable only when you're processing by application time. Otherwise, the setting is ignored.

Late arrival tolerance is the maximum difference between arrival time and application time. If an event arrives later than the late arrival tolerance (for example, application time *app_t* < arrival time *arr_t* - late arrival policy tolerance *late_t*), the event is adjusted to the maximum of the late arrival tolerance (*arr_t* - *late_t*). The late arrival window is the maximum delay between event generation and receipt of the event at the input source. 

When multiple partitions from the same input stream or multiple input streams are combined, late arrival tolerance is the maximum amount of time that every partition waits for new data. 

Adjustment based on late arrival tolerance happens first. Adjustment based on out-of-order tolerance happens next. The **System.Timestamp** column has the final time stamp assigned to the event.

### Out-of-order tolerance
Events that arrive out of order but within the set out-of-order tolerance window are reordered by time stamp. Events that arrive later than the tolerance window are either:
* **Adjusted**: Adjusted to appear to have arrived at the latest acceptable time. 
* **Dropped**: Discarded.

When Stream Analytics reorders events that are received within the out-of-order tolerance window, the output of the query is delayed by the out-of-order tolerance window.

### Early events
When processing by application time, events whose application time is more than 5 minutes ahead of their arrival time are either dropped or adjusted according to the configuration option selected.

### Example

* Late Arrival tolerance = 10 minutes<br/>
* Out-of-order tolerance = 3 minutes<br/>
* Processing by application time<br/>
* Events:
   1. **Application Time** = 00:00:00, **Arrival Time** = 00:10:01, **System.Timestamp** = 00:00:01, adjusted because (**Arrival Time - Application Time**) is more than the late arrival tolerance.
   2. **Application Time** = 00:00:01, **Arrival Time** = 00:10:01, **System.Timestamp** = 00:00:01, not adjusted because application time is within the late arrival window.
   3. **Application Time** = 00:10:00, **Arrival Time** = 00:10:02, **System.Timestamp** = 00:10:00, not adjusted because application time is within the late arrival window.
   4. **Application Time** = 00:09:00, **Arrival Time** = 00:10:03, **System.Timestamp** = 00:09:00, accepted with the original time stamp because application time is within the out-of-order tolerance.
   5. **Application Time** = 00:06:00, **Arrival Time** = 00:10:04, **System.Timestamp** = 00:07:00, adjusted because application time is older than the out-of-order tolerance.

### Practical considerations
As mentioned earlier, late arrival tolerance is the maximum difference between application time and arrival time. When you're processing by application time, events that are later than the configured late arrival tolerance are adjusted before the out-of-order tolerance setting is applied. So, effective out of order is the minimum of late arrival tolerance and out-of-order tolerance.

Reasons for out-of-order events within a stream include:
* Clock skew among the senders.
* Variable latency between the sender and the input event source.

Reasons for late arrival include:
* Senders batching and sending the events for an interval later, after the interval.
* Latency between sending the event by sender and receiving the event at the input source.

When you're configuring late arrival tolerance and out-of-order tolerance for a specific job, consider correctness, latency requirements, and the preceding factors.

Following are a few examples.

#### Example 1 
The query has a **Partition by PartitionId** clause. Within a single partition, events are sent via synchronous send methods. Synchronous send methods block until the events are sent.

In this case, out of order is zero because events are sent in order with explicit confirmation before the next event is sent. Late arrival is the maximum delay between generating the event and sending the event, plus the maximum latency between the sender and the input source.

#### Example 2
The query has a **Partition by PartitionId** clause. Within a single partition, events are sent via asynchronous send methods. Asynchronous send methods can initiate multiple sends at the same time, which can cause out-of-order events.

In this case, both out of order and late arrival are at least the maximum delay between generating the event and sending the event, plus the maximum latency between the sender and the input source.

#### Example 3
The query does not have a **Partition by PartitionId** clause, and there are at least two partitions.

Configuration is the same as example 2. However, absence of data in one of the partitions can delay the output by an additional late arrival tolerance window.

## Handling event producers with differing timelines with "substreams"
A single input event stream often contains events that originate from multiple event producers, such as individual devices. These events might arrive out of order due to the reasons discussed earlier. In these scenarios, although the disorder across event producers might be large, the disorder within the events from a single producer is small (or even nonexistent).

Azure Stream Analytics provides general mechanisms for dealing with out-of-order events. Such mechanisms result in processing delays (while waiting for the straggling events to reach the system), dropped or adjusted events, or both.

Yet in many scenarios, the desired query is processing events from different event producers independently. For instance, it might be aggregating events per window, per device. In these cases, there's no need to delay the output that corresponds to one event producer while waiting for the other event producers to catch up. In other words, there's no need to deal with the time skew between producers. You can ignore it.

Of course, this means that the output events themselves are out of order with respect to their timestamps. The downstream consumer must be able to deal with such behavior. But every event in the output is correct.

Azure Stream Analytics implements this functionality by using the [TIMESTAMP BY OVER](https://msdn.microsoft.com/library/azure/mt573293.aspx) clause.

## Summary
* Configure late arrival tolerance and the out-of-order window based on correctness and latency requirements. Also consider how the events are sent.
* We recommend that out-of-order tolerance is smaller than late arrival tolerance.
* When you're combining multiple timelines, lack of data in one of the sources or partitions can delay the output by an additional late arrival tolerance window.

## Get help
For additional assistance, try the [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=AzureStreamAnalytics).

## Next steps
* [Introduction to Stream Analytics](stream-analytics-introduction.md)
* [Get started with Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Stream Analytics query language reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Stream Analytics management REST API reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
