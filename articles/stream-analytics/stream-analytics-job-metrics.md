---
title: Azure Stream Analytics job metrics
description: This article describes Azure Stream Analytics job metrics.
author: sidramadoss
ms.author: sidram
ms.service: stream-analytics
ms.topic: how-to
ms.date: 07/07/2022
ms.custom: seodec18
---

# Azure Stream Analytics job metrics

Azure Stream Analytics provides plenty of metrics that can be used to monitor and troubleshoot your query and job performance. These metrics data can be viewed through Azure portal in the **Monitoring** section on the **Overview** page.  

:::image type="content" source="./media/stream-analytics-job-metrics/02-stream-analytics-job-metrics-monitoring-block.png" alt-text="Diagram that shows the Stream Analytics job monitoring section." lightbox="./media/stream-analytics-job-metrics/02-stream-analytics-job-metrics-monitoring-block.png":::

You can also navigate to the **Monitoring** section and click **Metrics**. The metric page will be shown for adding the specific metric you'd like to check.

:::image type="content" source="./media/stream-analytics-job-metrics/01-stream-analytics-job-metrics-monitoring.png" alt-text="Diagram that shows Stream Analytics job monitoring dashboard." lightbox="./media/stream-analytics-job-metrics/01-stream-analytics-job-metrics-monitoring.png":::

## Metrics available for Stream Analytics

Azure Stream Analytics provides the following metrics for you to monitor your job's health.

| Metric                 | Definition                               |
| ---------------------- | ---------------------------------------- |
| Backlogged Input Events       | Number of input events that are backlogged. A non-zero value for this metric implies that your job isn't able to keep up with the number of incoming events. If this value is slowly increasing or consistently non-zero, you should scale out your job. You can learn more by visiting [Understand and adjust Streaming Units](stream-analytics-streaming-unit-consumption.md). |
| Data Conversion Errors | Number of output events that couldn't be converted to the expected output schema. Error policy can be changed to 'Drop' to drop events that encounter this scenario. |
| CPU % Utilization (preview)       | The percentage of CPU utilized by your job. Even if this value is very high (90% or above), you shouldn't increase number of SUs based on this metric alone. If number of backlogged input events or watermark delay increases, you can then use this CPU% utilization metric to determine if CPU is the bottleneck. It's possible that this metric has spikes intermittently. It's recommended to do scale tests to determine upper bound of your job after which inputs get backlogged or watermark delay increases due to CPU bottleneck. |
| Early Input Events       | Events whose application timestamp is earlier than their arrival time by more than 5 minutes. |
| Failed Function Requests | Number of failed Azure Machine Learning function calls (if present). |
| Function Events        | Number of events sent to the Azure Machine Learning function (if present). |
| Function Requests      | Number of calls to the Azure Machine Learning function (if present). |
| Input Deserialization Errors       | Number of input events that couldn't be deserialized.  |
| Input Event Bytes      | Amount of data received by the Stream Analytics job, in bytes. This can be used to validate that events are being sent to the input source. |
| Input Events           | Number of records deserialized from the input events. This count doesn't include incoming events that result in deserialization errors. The same events can be ingested by Stream Analytics multiple times in scenarios such as internal recoveries and self joins. Therefore it is recommended not to expect Input Events and Output Events metrics to match if your job has a simple 'pass through' query. |
| Input Sources Received       | Number of messages received by the job. For Event Hub, a message is a single EventData. For Blob, a message is a single blob. Please note that Input Sources are counted before deserialization. If there are deserialization errors, input sources can be greater than input events. Otherwise, it can be less than or equal to input events since each message can contain multiple events. |
| Late Input Events      | Events that arrived later than the configured late arrival tolerance window. Learn more about [Azure Stream Analytics event order considerations](./stream-analytics-time-handling.md) . |
| Out-of-Order Events    | Number of events received out of order that were either dropped or given an adjusted timestamp, based on the Event Ordering Policy. This can be impacted by the configuration of the Out of Order Tolerance Window setting. |
| Output Events          | Amount of data sent by the Stream Analytics job to the output target, in number of events. |
| Runtime Errors         | Total number of errors related to query processing (excluding errors found while ingesting events or outputting results) |
| SU (Memory) % Utilization       | The percentage of memory utilized by your job. If SU % utilization is consistently over 80%, the watermark delay is rising, and the number of backlogged events is rising, consider increasing streaming units. High utilization indicates that the job is using close to the maximum allocated resources. |
| Watermark Delay       | The maximum watermark delay across all partitions of all outputs in the job. |

## Scenarios to monitor

|Metric|Condition|Time Aggregation|Threshold|Corrective Actions|
|-|-|-|-|-|
|SU% Utilization|Greater than|Average|80|There are multiple factors that increase SU% Utilization. You can scale with query parallelization or increase the number of streaming units. For more information, see [Leverage query parallelization in Azure Stream Analytics](stream-analytics-parallelization.md).|
|CPU % Utilization|Greater than|Average|90|This likely means that there are some operations such as UDFs, UDAs or complex input deserialization which is requiring a lot of CPU cycles. This is usually overcome by increasing number of Streaming Units of the job.|
|Runtime errors|Greater than|Total|0|Examine the activity or resource logs and make appropriate changes to the inputs, query, or outputs.|
|Watermark delay|Greater than|Average|When average value of this metric over the last 15 minutes is greater than late arrival tolerance (in seconds). If you have not modified the late arrival tolerance, the default is set to 5 seconds.|Try increasing the number of SUs or parallelizing your query. For more information on SUs, see [Understand and adjust Streaming Units](stream-analytics-streaming-unit-consumption.md#how-many-sus-are-required-for-a-job). For more information on parallelizing your query, see [Leverage query parallelization in Azure Stream Analytics](stream-analytics-parallelization.md).|
|Input deserialization errors|Greater than|Total|0|Examine the activity or resource logs and make appropriate changes to the input. For more information on resource logs, see [Troubleshoot Azure Stream Analytics using resource logs](stream-analytics-job-diagnostic-logs.md)|

## Get help
For further assistance, try our [Microsoft Q&A question page for Azure Stream Analytics](/answers/topics/azure-stream-analytics.html)

## Next steps
* [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
* [Azure Stream Analytics job metrics dimensions](./stream-analytics-job-metrics-dimensions.md)
* [Understand and adjust Streaming Units](./stream-analytics-streaming-unit-consumption.md)
* [Analyze Stream Analytics job performance with metrics dimensions](./stream-analytics-job-analysis-with-metric-dimensions.md)
* [Monitor Stream Analytics job with Azure portal](./stream-analytics-monitoring.md)
* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)

