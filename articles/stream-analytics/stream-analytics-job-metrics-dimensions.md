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

A typical Azure Stream Analytics architecture is illustrated below:

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/01-stream-analytics-typical-architecture.png" alt-text="Diagram shows Azure Stream Analytics typic architecture":::

Stream analytics service is a distributed system, which means the job is running on many distributed computer nodes, which the platform automatically manages. The input data are partitioned and allocated to different stream nodes for processing. Metrics can be split by dimensions, like Partition ID or Node name that helps troubleshoot performance issues with your job.
  
Azure Stream Analytics provides three important dimensions: “Logic Name”, “Partition ID”, and “Node Name” for metrics splitting and filtering. 

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/02-metric-splitting-with-dimension.png" alt-text="Diagram that shows the metric splitting with dimension":::

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/03-metric-filtered-by-dimension.png" alt-text="Diagram that shows the metric filtered by dimension":::


## "Logic Name" dimension

The “Logic Name” is the input or output name for a given Azure Stream Analytics (ASA) job. For example: if an ASA job has four inputs and five outputs, you'll see the four individual logic inputs or five individual logical outputs when splitting input or output related metrics with this dimension. (for example, Input Events, Output Events, etc.) 

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/04-multiple-input-and-output-of-an-job.png" alt-text="Diagram that shows multiple input and output of an ASA job":::

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/05-input-events-splitting-by-logic-name.png" alt-text="Diagram that shows the Input events metric splitting by Logic Name":::

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/06-output-events-splitting-by-logic-name.png" alt-text="Diagram that shows the Output events metric splitting by Logic Name":::


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

A streaming node represents a set of compute resources that is used to process your input data. Every six Streaming Units (SUs) translates to one node, which the service automatically manages on your behalf. For more information for the relationship between streaming unit and streaming node, see [Stream Analytics streaming unit and streaming node](./stream-analytics-streaming-unit-streaming-node.md).

The “Node Name” is “Streaming Node” level dimension that could help you to drill down certain metrics to the specific Streaming Node level. For example, the CPU utilization metrics could be split into Streaming Node level to check the CPU utilization of an individual Streaming Node.

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/07-average-cpu-splitting-by-node-name.png" alt-text="Diagram that shows the average CPU utilization splitting by Node Name dimension":::

“Node Name” dimension is available   for the metrics below for filtering and splitting:
-	CPU % Utilization (Preview)
-	SU % Utilization
-	Input Events

## "Partition ID" dimension

When streaming data is ingested into Azure Stream Analytics service for processing, the input data is distributed to Streaming Nodes according to the partitions in input source. The “Partition ID” is the ID of the input data partition from input source, for example, if the input source is from event hub, the partition ID is the EH partition ID. The “Partition ID” is the same as it in the output as well.

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/08-watermark-delay-splitting-by-partition-id.png" alt-text="Diagram that shows the Watermark delay splitting by Partition ID dimension":::


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

* [Analyze job with metric dimensions](./stream-analytics-job-analysis-with-metric-dimensions.md)
* [Understand job monitoring in Azure Stream Analytics](./stream-analytics-monitoring.md)
* [Stream Analytics streaming unit and streaming node](./stream-analytics-streaming-unit-streaming-node.md)