---
title: Configuring event ordering policies for Azure Stream Analytics
description: This article describes how to go about configuring even ordering settings in Stream Analytics
services: stream-analytics
author: sidram
ms.author: sidram
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 03/12/2019
---
# Configuring event ordering policies for Azure Stream Analytics

This article describes how to setup and use late arrival and out-of-order event policies in Azure Stream Analytics. These policies are applied only when you use the [TIMESTAMP BY](https://docs.microsoft.com/stream-analytics-query/timestamp-by-azure-stream-analytics) clause in your query.

## Event time and Arrival Time

Your Stream Analytics job can process events based on either *event time* or *arrival time*. **Event/application time** is the timestamp present in event payload (when the event was generated). **Arrival time** is the timestamp when the event was received at the input source (Event Hubs/IoT Hub/Blob storage). 

By default, Stream Analytics processes events by *arrival time*, but you can choose to process events by *event time* by using [TIMESTAMP BY](https://docs.microsoft.com/stream-analytics-query/timestamp-by-azure-stream-analytics) clause in your query. Late arrival and out-of-order policies are applicable only if you process events by event time. Consider latency and correctness requirements for your scenario when configuring these settings. 

## What is late arrival policy?

Sometimes events arrive late because of various reasons. For example, an event that arrives 40 seconds late will have event time = 00:10:00 and arrival time = 00:10:40. If you set the late arrival policy to 15 seconds, any event that arrives later than 15 seconds will either be dropped (not processed by Stream Analytics) or have their event time adjusted. In the example above, as the event arrived 40 seconds late (more than policy set), its event time will be adjusted to the maximum of late arrival policy 00:10:25 (arrival time - late arrival policy value). Default late arrival policy is 5 seconds.

## What is out-of-order policy? 

Event may arrive out of order as well. After event time is adjusted based on late arrival policy, you can also choose to automatically drop or adjust events that are out-of-order. If you set this policy to 8 seconds, any events that arrive out of order but within the 8-second window are reordered by event time. Events that arrive later will be either dropped or adjusted to the maximum out-of-order policy value. Default out-of-order policy is 0 seconds. 

## Adjust or Drop events

If events arrive late or out-of-order based on the policies you have configured, you can either drop such events (not processed by Stream Analytics) or have their event time adjusted.

Let us see an example of these policies in action.
<br> **Late arrival policy:** 15 seconds
<br> **Out-of-order policy:** 8 seconds

| Event No. | Event Time | Arrival Time | System.Timestamp | Explanation |
| --- | --- | --- | --- | --- |
| **1** | 00:10:00  | 00:10:40  | 00:10:25  | Event arrived late and outside tolerance level. So event time gets adjusted to maximum late arrival tolerance.  |
| **2** | 00:10:30 | 00:10:41  | 00:10:30  | Event arrived late but within tolerance level. So event time does not get adjusted.  |
| **3** | 00:10:42 | 00:10:42 | 00:10:42 | Event arrived on time. No adjustment needed.  |
| **4** | 00:10:38  | 00:10:43  | 00:10:38 | Event arrived out-of-order but within the tolerance of 8 seconds. So, event time does not get adjusted. For analytics purposes, this event will be considered as preceding event number 4.  |
| **5** | 00:10:35 | 00:10:45  | 00:10:37 | Event arrived out-of-order and outside tolerance of 8 seconds. So, event time is adjusted to maximum of out-of-order tolerance. |

## Can these settings delay output of my job? 

Yes. By default, out-of-order policy is set to zero (00 minutes and 00 seconds). If you change the default, your job's first output is delayed by this value (or greater). 

If one of the partitions of your inputs doesn't receive events, you should expect your output to be delayed by the late arrival policy value. To learn why, read the InputPartition error section below. 

## I see LateInputEvents messages in my activity log

These messages are shown to inform you that events have arrived late and are either dropped or adjusted according to your configuration. You can ignore these messages if you have configured late arrival policy appropriately. 

Example of this message is: <br>
<code>
{"message Time":"2019-02-04 17:11:52Z","error":null,
"message":"First Occurred: 02/04/2019 17:11:48 | Resource Name: ASAjob | Message: Source 'ASAjob' had 24 data errors of kind 'LateInputEvent' between processing times '2019-02-04T17:10:49.7250696Z' and '2019-02-04T17:11:48.7563961Z'. Input event with application timestamp '2019-02-04T17:05:51.6050000' and arrival time '2019-02-04T17:10:44.3090000' was sent later than configured tolerance.","type":"DiagnosticMessage","correlation ID":"49efa148-4asd-4fe0-869d-a40ba4d7ef3b"} 
</code>

## I see InputPartitionNotProgressing in my activity log

Your input source (Event Hub/IoT Hub) likely has multiple partitions. Azure Stream Analytics produces output for time stamp t1 only after all the partitions that are combined are at least at time t1. For example, assume that the query reads from an event hub partition that has two partitions. One of the partitions, P1, has events until time t1. The other partition, P2, has events until time t1 + x. Output is then produced until time t1. But if there's an explicit Partition by PartitionId clause, both the partitions progress independently. 

When multiple partitions from the same input stream are combined, the late arrival tolerance is the maximum amount of time that every partition waits for new data. If there is one partition in your Event Hub, or if IoT Hub doesn’t receive inputs, the timeline for that partition doesn't progress until it reaches the late arrival tolerance threshold. This delays your output by the late arrival tolerance threshold. In such cases, you may see the following message: 
<br><code>
{"message Time":"2/3/2019 8:54:16 PM UTC","message":"Input Partition [2] does not have additional data for more than [5] minute(s). Partition will not progress until either events arrive or late arrival threshold is met.","type":"InputPartitionNotProgressing","correlation ID":"2328d411-52c7-4100-ba01-1e860c757fc2"} 
</code><br><br>
This message to inform you that at least one partition in your input is empty and will delay your output by the late arrival threshold. To overcome this, it is recommended you either:  
1. Ensure all partitions of your Event Hub/IoT Hub receive input. 
2. Use Partition by PartitionID clause in your query. 

## Next steps
* [Time handling considerations](stream-analytics-time-handling.md)
* [Metrics available in Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-monitoring#metrics-available-for-stream-analytics)
