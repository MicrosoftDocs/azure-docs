---
title: Diagnose Stream Analytics Job Performance
description: Learn how to use Azure Stream Analytics metrics and dimensions to troubleshoot watermark delay, backlogged events, and other job performance problems.
author: spelluru
ms.author: spelluru
ms.service: azure-stream-analytics
ms.topic: troubleshooting-general
ms.date: 08/26/2026
ms.custom: sfi-image-nochange
ai-usage: ai-assisted
#customer intent: As a Stream Analytics developer, I want to use job metrics and dimensions so that I can troubleshoot and resolve my job's performance problems.
---
# Troubleshoot Stream Analytics job performance by using metrics and dimensions

To understand the health of an Azure Stream Analytics job, you need to know how to use the job's metrics and dimensions. You can get the metrics and dimensions that you're interested in from the Azure portal, the Visual Studio Code Stream Analytics extension, or an SDK.

Watermark delay and backlogged input events are the main metrics that determine the performance of a Stream Analytics job. If your job's watermark delay increases continuously and input events are backlogged, the job can't keep up with the rate of input events and can't produce outputs on time.

This article shows you how to use Stream Analytics job metrics and dimensions in the Azure portal to troubleshoot a job's performance. The following sections walk through several examples that start from the **Watermark Delay** metric to diagnose common performance problems.

## No input for a certain partition increases job watermark delay

If the watermark delay of your embarrassingly parallel job steadily increases, open **Metrics** in the Azure portal. Then use these steps to find out whether the root cause is a lack of data in some partitions of your input source:

1. Check which partition has the increasing watermark delay. Select the **Watermark Delay** metric and split it by the **Partition ID** dimension. In the following example, partition 465 has a high watermark delay.

   :::image type="content" source="./media/stream-analytics-job-analysis-with-metric-dimensions/01-watermark-delay-splitting-with-partition-id.png" alt-text="Screenshot of a chart that shows watermark delay splitting by Partition ID for the case of no input in a partition." lightbox="./media/stream-analytics-job-analysis-with-metric-dimensions/01-watermark-delay-splitting-with-partition-id.png":::

1. Check whether any input data is missing for this partition. Select the **Input Events** metric and filter it to this specific partition ID.

   :::image type="content" source="./media/stream-analytics-job-analysis-with-metric-dimensions/02-input-events-splitting-with-partition-id.png" alt-text="Screenshot of a chart that shows Input Events splitting by Partition ID for the case of no input in a partition." lightbox="./media/stream-analytics-job-analysis-with-metric-dimensions/02-input-events-splitting-with-partition-id.png":::

### Recommended action

The watermark delay for this partition is increasing because no input events are flowing into this partition. If your job's tolerance window for late arrivals is several hours and no input data is flowing into a partition, it's expected that the watermark delay for that partition will continue to increase until it reaches the late arrival window.

For example, if your late arrival window is six hours and input data isn't flowing into input partition 1, the watermark delay for output partition 1 will increase until it reaches six hours. Check whether your input source is producing data as expected.

## Input data skew causes a high watermark delay

When your embarrassingly parallel job has a high watermark delay, first split the **Watermark Delay** metric by the **Partition ID** dimension. Then identify whether all the partitions have a high watermark delay, or just a few of them.

In the following example, partitions 0 and 1 have higher watermark delay (about 20 to 30 seconds) than the other eight partitions. The other partitions' watermark delays are always steady at about 8 to 10 seconds.

:::image type="content" source="./media/stream-analytics-job-analysis-with-metric-dimensions/03-watermark-delay-splitting-with-partition-id.png" alt-text="Screenshot of a chart that shows Watermark Delay split by Partition ID for the case of data skew." lightbox="./media/stream-analytics-job-analysis-with-metric-dimensions/03-watermark-delay-splitting-with-partition-id.png":::

Check what the input data looks like across these partitions by splitting the **Input Events** metric by **Partition ID**:

:::image type="content" source="./media/stream-analytics-job-analysis-with-metric-dimensions/04-input-events-splitting-with-partition-id.png" alt-text="Screenshot of a chart that shows Input Events split by Partition ID for the case of data skew." lightbox="./media/stream-analytics-job-analysis-with-metric-dimensions/04-input-events-splitting-with-partition-id.png":::

### Recommended action

In the preceding example, the partitions (0 and 1) that have a high watermark delay receive significantly more input data than the other partitions. This condition is called *data skew*. The streaming nodes that process the partitions with data skew consume more CPU and memory resources than the others, as the following screenshot shows.

:::image type="content" source="./media/stream-analytics-job-analysis-with-metric-dimensions/05-resource-utilization-of-the-partitions-with-data-skew.png" alt-text="Screenshot of a chart that shows the resource utilization of partitions with data skew." lightbox="./media/stream-analytics-job-analysis-with-metric-dimensions/05-resource-utilization-of-the-partitions-with-data-skew.png":::

Streaming nodes that process partitions with higher data skew show higher **CPU % Utilization** and **SU (Memory) % Utilization**. This resource pressure affects the job's performance and increases watermark delay. To mitigate it, repartition your input data more evenly.

You can also debug this issue by using the physical job diagram. For more information, see [Physical job diagram: Identify the uneven distributed input events (data-skew)](./stream-analytics-job-physical-diagram-with-metrics.md#identify-the-uneven-distributed-input-events-data-skew).

## Overloaded CPU or memory increases watermark delay

When an embarrassingly parallel job has an increasing watermark delay, the delay might affect all partitions, not just one or several. To confirm that your job is in this situation, use these steps:

1. Split the **Watermark Delay** metric by **Partition ID**. For example:

   :::image type="content" source="./media/stream-analytics-job-analysis-with-metric-dimensions/06-watermark-delay-splitting-with-partition-id-all-increasing.png" alt-text="Screenshot of a chart that shows Watermark Delay split by Partition ID for the case of overloaded CPU and memory." lightbox="./media/stream-analytics-job-analysis-with-metric-dimensions/06-watermark-delay-splitting-with-partition-id-all-increasing.png":::

1. Split the **Input Events** metric by **Partition ID** to confirm whether there's data skew in the input data for each partition.
1. Check the **CPU % Utilization** and **SU (Memory) % Utilization** metrics to see whether utilization is too high in all streaming nodes.

   :::image type="content" source="./media/stream-analytics-job-analysis-with-metric-dimensions/07-cpu-and-memory-utilization-splitting-with-node-name.png" alt-text="Screenshot of a chart that shows CPU and memory utilization split by node name for the case of overloaded CPU and memory." lightbox="./media/stream-analytics-job-analysis-with-metric-dimensions/07-cpu-and-memory-utilization-splitting-with-node-name.png":::

1. If both metrics are high (more than 80 percent) in all streaming nodes, you can conclude that each streaming node is processing a large amount of data.

   Check how many partitions are allocated to one streaming node by using the **Input Events** metric. Filter by streaming node ID with the **Node Name** dimension, and split by **Partition ID**.

   :::image type="content" source="./media/stream-analytics-job-analysis-with-metric-dimensions/08-partition-count-on-one-streaming-node.png" alt-text="Screenshot of a chart that shows the partition count on one streaming node for the case of overloaded CPU and memory." lightbox="./media/stream-analytics-job-analysis-with-metric-dimensions/08-partition-count-on-one-streaming-node.png":::

1. The preceding screenshot shows that four partitions are allocated to one streaming node that occupies about 90 to 100 percent of the streaming node resource. Use a similar approach to check the rest of the streaming nodes and confirm that they're also processing data from four partitions.

### Recommended action

Reduce the number of partitions that each streaming node handles to lower the input data per node. To do so, double the SUs so that each streaming node handles data from two partitions, or quadruple the SUs so that each streaming node handles data from one partition. For information about the relationship between SU assignment and streaming node count, see [Understand and adjust streaming units](./stream-analytics-streaming-unit-consumption.md).

What should you do if the watermark delay is still increasing when one streaming node is handling data from one partition? Repartition your input with more partitions to reduce the amount of data in each partition. For details, see [Use repartitioning to optimize Azure Stream Analytics jobs](./repartition.md).

You can also debug this issue with the physical job diagram. For more information, see [Physical job diagram: Identify the cause of overloaded CPU or memory](./stream-analytics-job-physical-diagram-with-metrics.md#identify-the-cause-of-overloaded-cpu-or-memory).

## Related content

* [Monitor a Stream Analytics job with the Azure portal](./stream-analytics-monitoring.md)
* [Azure Stream Analytics job metrics](monitor-azure-stream-analytics-reference.md#metrics)
* [Dimensions for Azure Stream Analytics metrics](monitor-azure-stream-analytics-reference.md#metric-dimensions)
* [Understand and adjust streaming units](./stream-analytics-streaming-unit-consumption.md)
