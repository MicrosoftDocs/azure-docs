---
title: Azure Stream Analytics metrics dimensions
description: This article describes the Azure Stream Analytics metric dimensions.
author: xujiang1
ms.author: xujiang1
ms.service: stream-analytics
ms.topic: conceptual
ms.custom: 
ms.date: 06/30/2022
---
# Azure Stream Analytics metrics dimensions

Stream Analytics provides a serverless, distributed streaming processing service. Jobs can run on one or more distributed streaming nodes, which the service automatically manages. The input data are partitioned and allocated to different streaming nodes for processing. Azure Stream Analytics has many metrics available to monitor job's health. Metrics can be split by dimensions, like Partition ID or Node name that helps troubleshoot performance issues with your job. To get the  metrics full list, see [Azure Stream Analytics job metrics](./stream-analytics-job-metrics.md). 

## Stream Analytics metrics dimensions

Azure Stream Analytics provides three important dimensions: “Logic Name”, “Partition ID”, and “Node Name” for metrics splitting and filtering.

| Dimension                 | Definition                               | 
| ---------------------- | ---------------------------------------- | 
| Logic Name       | The input or output name for a given Azure Stream Analytics (ASA) job. |
| Partition ID     | The ID of the input data partition from input source, for example, if the input source is from event hub, the partition ID is the EH partition ID. For embarrassingly parallel job, the “Partition ID” in output is the same as the input partition ID. |
| Node Name        | Identifier of a streaming node that is provisioned when your job runs. A streaming node represents amount of compute and memory resources allocated to your job. |

:::image type="content" source="./media/stream-analytics-monitoring/05-stream-analytics-monitoring-dimension.png" alt-text="Diagram that shows Stream Analytics job metrics dimension." lightbox="./media/stream-analytics-monitoring/05-stream-analytics-monitoring-dimension.png":::

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/02-metric-splitting-with-dimension.png" alt-text="Diagram that shows the metric splitting with dimension.":::

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/03-metric-filtered-by-dimension.png" alt-text="Diagram that shows the metric filtered by dimension.":::

## "Logic Name" dimension

The “Logic Name” is the input or output name for a given Azure Stream Analytics (ASA) job. For example: if an ASA job has four inputs and five outputs, you'll see the four individual logic inputs and five individual logical outputs when splitting input and output related metrics with this dimension. (for example, Input Events, Output Events, etc.) 

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/04-multiple-input-and-output-of-an-job.png" alt-text="Diagram that shows multiple input and output of an ASA job." lightbox="./media/stream-analytics-job-metrics-dimensions/04-multiple-input-and-output-of-an-job.png":::

<!--:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/05-input-events-splitting-by-logic-name.png" alt-text="Diagram that shows the Input events metric splitting by Logic Name."::: -->

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/06-output-events-splitting-by-logic-name.png" alt-text="Diagram that shows the Output events metric splitting by Logic Name." lightbox="./media/stream-analytics-job-metrics-dimensions/06-output-events-splitting-by-logic-name.png":::


“Logic Name” dimension is available for the metrics below for filtering and splitting:
-	Backlogged Input Events 
-	Data Conversion Errors
-	Early Input Events
-	Input Deserialization Errors
-	Input Event Bytes
-	Input Events
-	Input Source Received
-	Late Input Events
-	Out of order Events
-	Output Events
-	Watermark delay

## "Node Name" dimension

A streaming node represents a set of compute resources that is used to process your input data. Every six Streaming Units (SUs) translates to one node, which the service automatically manages on your behalf. For more information for the relationship between streaming unit and streaming node, see [Understand and adjust Streaming Units](./stream-analytics-streaming-unit-consumption.md).

The “Node Name” is “Streaming Node” level dimension that could help you to drill down certain metrics to the specific streaming node level. For example, the CPU utilization metrics could be split into streaming node level to check the CPU utilization of an individual streaming node.

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/07-average-cpu-splitting-by-node-name.png" alt-text="Diagram that shows the average CPU utilization splitting by Node Name dimension." lightbox="./media/stream-analytics-job-metrics-dimensions/07-average-cpu-splitting-by-node-name.png":::

“Node Name” dimension is available for the metrics below for filtering and splitting:
-	CPU % Utilization (Preview)
-	SU % Utilization
-	Input Events

## "Partition ID" dimension

When streaming data is ingested into Azure Stream Analytics service for processing, the input data is distributed to streaming nodes according to the partitions in input source. The “Partition ID” is the ID of the input data partition from input source, for example, if the input source is from event hub, the partition ID is the EH partition ID. The “Partition ID” is the same as it in the output as well.

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/08-watermark-delay-splitting-by-partition-id.png" alt-text="Diagram that shows the Watermark delay splitting by Partition ID dimension." lightbox="./media/stream-analytics-job-metrics-dimensions/08-watermark-delay-splitting-by-partition-id.png":::


“Partition ID” dimension is available for the metrics below for filtering and splitting:
-	Backlogged Input Events
-	Data Conversion Errors
-	Early Input Events
-	Input Deserialization Errors
-	Input Event Bytes
-	Input Events
-	Input Source Received
-	Late Input Events
-	Output Events
-	Watermark delay


## Next steps

* [Azure Stream Analytics job metrics](./stream-analytics-job-metrics.md)
* [Analyze Stream Analytics job performance with metrics dimensions](./stream-analytics-job-analysis-with-metric-dimensions.md)
* [Monitor Stream Analytics job with Azure portal](./stream-analytics-monitoring.md)
* [Understand and adjust Streaming Units](./stream-analytics-streaming-unit-consumption.md)