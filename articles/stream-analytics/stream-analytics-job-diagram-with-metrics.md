---
title:  Troubleshooting Azure Stream Analytics with Job Diagram metrics | Microsoft Docs
description: How to troubleshoot your Stream Analytics job by using the job diagram with metrics page
keywords: 
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

# Using the job diagram with metrics to troubleshoot jobs

Open the [job diagram with metrics page](https://portal.azure.com/?Microsoft_Azure_StreamAnalytics_metricsandpartitions=true).

Open the “Job diagram” link on the right:

![Job diagram with metrics location](./media/stream-analytics-job-diagram-with-metrics/stream-analytics-job-diagram-with-metrics-portal-1.png)

Clicking on each query step will show the corresponding section in a query editing pane as illustrated. A metrics chart for the step is also displayed in a lower pane.

![Job diagram with metrics basic job](./media/stream-analytics-job-diagram-with-metrics/stream-analytics-job-diagram-with-metrics-portal-2.png)

Clicking the … will pop up the context menu allowing the expansion of partitions showing the partitions of the Event Hub input in addition to the input merger.

![Job diagram with metrics expand partition](./media/stream-analytics-job-diagram-with-metrics/stream-analytics-job-diagram-with-metrics-portal-3.png)

Clicking a single partition node will show the metrics chart only for that partition on the bottom.

![Job diagram with metrics more metrics](./media/stream-analytics-job-diagram-with-metrics/stream-analytics-job-diagram-with-metrics-portal-4.png)

Selecting the merger node will show the metrics chart for the merger. The chart below shows that no events got dropped or adjusted.

![Job diagram with metrics grid](./media/stream-analytics-job-diagram-with-metrics/stream-analytics-job-diagram-with-metrics-portal-5.png)

Additionally, hovering on the chart will show details of the metric value and time

![Job diagram with metrics hover](./media/stream-analytics-job-diagram-with-metrics/stream-analytics-job-diagram-with-metrics-portal-6.png)

**QueryLastProcessedTime** This metric indicates when a particular step received data. Based on the topology, work backwards from the output processor to see which step is not receiving data. If a step is not getting data, go to the preceding step is a query step, check if it has a time window and if enough time has passed for it to output data (Note that time windows are snapped to the hour).
 
If the preceding step is an input processor, use the input metrics to help answer the following targeted questions about jobs getting data from its input sources. If the query is partitioned, examine each partition.
 
## How much data is being read?

**InputEventsSourcesTotal** metric provides the number of data units read, eg number of blobs.
**InputEventsTotal** provides the number of events read. This metric is available per partition.
**InputEventsInBytesTotal** provides the number of bytes read.
**InputEventsLastArrivalTime** is updated with every received event's enqueued time
 
## Is time moving forward? If actual events are read, punctuation might not be issued.

**InputEventsLastPunctuationTime** indicates when a punctuation was issued to keep time moving forward. Data flow can get blocked if punctuation is not issued.
 
## Are there any errors in the input?

**InputEventsEventDataNullTotal** holds a count of events with null data
**InputEventsSerializerErrorsTotal** holds a count of events that could not be deserialized correctly
**InputEventsDegradedTotal** holds a count of events that had an issue other than deserialization problems
 
## Are events getting dropped/adjusted?

**InputEventsEarlyTotal** provides the number of events with an application timestamp before the high watermark.
**InputEventsLateTotal** provides the number of events with an application timestamp after the high watermark.
**InputEventsDroppedBeforeApplicationStartTimeTotal** provides the number events dropped before the job start time
 
## Are we following behind in reading data?

**InputEventsSourcesBackloggedTotal** tells us how many more messages need to be read for EventHub and IoTHub inputs.


## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
