---
title: Dimensions for Azure Stream Analytics metrics
description: This article describes dimensions for Azure Stream Analytics metrics.
author: xujxu
ms.author: xujiang1
ms.service: stream-analytics
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 10/12/2022
---
# Dimensions for Azure Stream Analytics metrics

Azure Stream Analytics provides a serverless, distributed streaming processing service. Jobs can run on one or more distributed streaming nodes, which the service automatically manages. The input data is partitioned and allocated to different streaming nodes for processing. 

Stream Analytics has [many metrics](./stream-analytics-job-metrics.md) available to monitor a job's health. To troubleshoot performance problems with your job, you can split and filter metrics by using the following dimensions. 

| Dimension                 | Definition                               | 
| ---------------------- | ---------------------------------------- | 
| **Logical Name**       | The input or output name for a Stream Analytics job. |
| **Partition ID**     | The ID of the input data partition from an input source. For example, if the input source is an event hub, the partition ID is the event hub's partition ID. For embarrassingly parallel jobs, **Partition ID** in the output is the same as it is in the input. |
| **Node Name**        | The identifier of a streaming node that's provisioned when your job runs. A streaming node represents the amount of compute and memory resources allocated to your job. |

:::image type="content" source="./media/stream-analytics-monitoring/05-stream-analytics-monitoring-dimension.png" alt-text="Screenshot of a chart that shows the area for selecting a dimension for Stream Analytics job metrics." lightbox="./media/stream-analytics-monitoring/05-stream-analytics-monitoring-dimension.png":::

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/02-metric-splitting-with-dimension.png" alt-text="Screenshot that shows splitting a metric by dimension.":::

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/03-metric-filtered-by-dimension.png" alt-text="Screenshot that shows filtering a metric by dimension.":::

## Logical Name dimension

**Logical Name** is the input or output name for a Stream Analytics job. For example, assume that a Stream Analytics job has four inputs and five outputs. You'll see the four individual logical inputs and five individual logical outputs when you split input-related and output-related metrics by this dimension.

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/04-multiple-input-and-output-of-an-job.png" alt-text="Screenshot that shows multiple inputs and outputs in a Stream Analytics job." lightbox="./media/stream-analytics-job-metrics-dimensions/04-multiple-input-and-output-of-an-job.png":::

<!--:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/05-input-events-splitting-by-logic-name.png" alt-text="Screenshot that shows splitting the Input Events metric by Logical Name."::: -->

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/06-output-events-splitting-by-logic-name.png" alt-text="Screenshot of a chart that shows splitting the Output Events metric by Logical Name." lightbox="./media/stream-analytics-job-metrics-dimensions/06-output-events-splitting-by-logic-name.png":::

The **Logical Name** dimension is available for filtering and splitting the following metrics:
-	**Backlogged Input Events** 
-	**Data Conversion Errors**
-	**Early Input Events**
-	**Input Deserialization Errors**
-	**Input Event Bytes**
-	**Input Events**
-	**Input Source Received**
-	**Late Input Events**
-	**Out-of-Order Events**
-	**Output Events**
-	**Watermark Delay**

## Node Name dimension

A streaming node represents a set of compute resources that's used to process your input data. Every six streaming units (SUs) translate to one node, which the service automatically manages on your behalf. For more information about the relationship between streaming units and streaming nodes, see [Understand and adjust streaming units](./stream-analytics-streaming-unit-consumption.md).

**Node Name** is a dimension at the streaming node level. It can help you to drill down certain metrics to the specific streaming node level. For example, you can split the **CPU % Utilization** metric by streaming node level to check the CPU utilization of an individual streaming node.

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/07-average-cpu-splitting-by-node-name.png" alt-text="Screenshot of a chart that shows splitting average CPU utilization by the Node Name dimension." lightbox="./media/stream-analytics-job-metrics-dimensions/07-average-cpu-splitting-by-node-name.png":::

The **Node Name** dimension is available for filtering and splitting the following metrics:
-	**Backlogged Input Events**
-	**CPU % Utilization (preview)** 
-	**Input Events**
-	**Output Events**
-	**SU (Memory) % Utilization**
-	**Watermark Delay**


## Partition ID dimension

When streaming data is ingested into the Azure Stream Analytics service for processing, the input data is distributed to streaming nodes according to the partitions in the input source. The **Partition ID** dimension is the ID of the input data partition from the input source. 

For example, if the input source is an event hub, the partition ID is the event hub's partition ID. **Partition ID** in the input is the same as it is in the output.

:::image type="content" source="./media/stream-analytics-job-metrics-dimensions/08-watermark-delay-splitting-by-partition-id.png" alt-text="Diagram that shows splitting a watermark delay by the Partition ID dimension." lightbox="./media/stream-analytics-job-metrics-dimensions/08-watermark-delay-splitting-by-partition-id.png":::

The **Partition ID** dimension is available for filtering and splitting the following metrics:
-	**Backlogged Input Events**
-	**Data Conversion Errors**
-	**Early Input Events**
-	**Input Deserialization Errors**
-	**Input Event Bytes**
-	**Input Events**
-	**Input Source Received**
-	**Late Input Events**
-	**Output Events**
-	**Watermark Delay**

## Next steps

* [Azure Stream Analytics job metrics](./stream-analytics-job-metrics.md)
* [Analyze Stream Analytics job performance by using metrics and dimensions](./stream-analytics-job-analysis-with-metric-dimensions.md)
* [Debugging with the physical job diagram (preview) in Azure portal](./stream-analytics-job-physical-diagram-with-metrics.md)
* [Debugging with the logical job diagram (preview) in Azure portal](./stream-analytics-job-logical-diagram-with-metrics.md)
* [Monitor a Stream Analytics job with the Azure portal](./stream-analytics-monitoring.md)
* [Understand and adjust streaming units](./stream-analytics-streaming-unit-consumption.md)
