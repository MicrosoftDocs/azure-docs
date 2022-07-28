---
title: Analyze Azure Stream Analytics job performance by using metric dimensions
description: This article describes how to analyze stream analytics job with metric dimension.
author: xujiang1
ms.author: xujiang1
ms.service: stream-analytics
ms.topic: troubleshooting
ms.custom: 
ms.date: 07/07/2022
---
# Analyze Stream Analytics job performance with metrics dimensions

To understand the Stream Analytics job’s health, it's important to know how to utilize the job’s metrics and dimensions. You can use Azure portal or VS code ASA extension or SDK to get and view the metrics and dimensions, which you're interested in. 

This article demonstrates how to use Stream Analytics job metrics and dimensions to analyze the job’s performance through the Azure portal.

Watermark delay and backlogged input events are the main metrics to determine performance of your Streaming analytics job. If your job’s watermark delay is continuously increasing and inputs events are backlogged, it implies that your job is unable to keep up with the rate of input events and produce outputs in a timely manner. Let’s look at several examples to analyze the job’s performance through the watermark delay metric data as a starting point.

## No input for certain partition causes job watermark delay increasing

If your embarrassingly parallel job’s watermark delay is steadily increased, you can go to **Metrics** and follow these steps to find out if the root cause is due to no data in some partitions of your input source.
1. First, you can check which partition has the watermark delay increasing by selecting watermark delay metric and splitting it by “Partition ID” dimension. For example, you identify that the partition#465 has high watermark delay. 

   :::image type="content" source="./media/stream-analytics-job-analysis-with-metric-dimensions/01-watermark-delay-splitting-with-partition-id.png" alt-text="Diagram that show the watermark delay splitting with Partition ID for the case of no input in certain partition." lightbox="./media/stream-analytics-job-analysis-with-metric-dimensions/01-watermark-delay-splitting-with-partition-id.png":::

2. You can then check if there's any input data missing for this partition. To do this, you can select Input Events metric and filter it to this specific partition ID. 

   :::image type="content" source="./media/stream-analytics-job-analysis-with-metric-dimensions/02-input-events-splitting-with-partition-id.png" alt-text="Diagram that shows the Input Events splitting with Partition ID for the case of no input in certain partition." lightbox="./media/stream-analytics-job-analysis-with-metric-dimensions/02-input-events-splitting-with-partition-id.png":::


What action could you take further?

-	As you can see, the watermark delay for this partition is increasing as there's no input events flowing into this partition. If your job's late arrival tolerance window is several hours and no input data is flowing into a partition, it's expected that the watermark delay for that partition continues to increase until the late arrival window is reached. For example, if your late arrival tolerance is 6 hours and input data isn't flowing into input partition 1, watermark delay for output partition 1 will increase until it reaches 6 hours. You can check if your input source is producing data as expected.


## Input data-skew causes high watermark delay

As mentioned in the above case, when you see your embarrassingly parallel job having high watermark delay, the first thing to do is to check the watermark delay splitting by “Partition ID” dimension to identify if all the partitions have high watermark delay or just a few of them. 

For this example, you can start by splitting the watermark delay metric by **Partition ID** dimension.

:::image type="content" source="./media/stream-analytics-job-analysis-with-metric-dimensions/03-watermark-delay-splitting-with-partition-id.png" alt-text="Diagram that show the watermark delay splitting with Partition ID for the case of data-skew." lightbox="./media/stream-analytics-job-analysis-with-metric-dimensions/03-watermark-delay-splitting-with-partition-id.png":::

As you can see, partition#0 and partition#1 have higher watermark delay (20 ~ 30s) than other eight partitions. The other partitions’ watermark delays are always steady at 8s~10 s. Then, let’s check what the input data looks like for all these partitions with the metric “Input Events” splitting by “Partition ID”:

:::image type="content" source="./media/stream-analytics-job-analysis-with-metric-dimensions/04-input-events-splitting-with-partition-id.png" alt-text="Diagram that shows the Input Events splitting by Partition ID for the case of data-skew." lightbox="./media/stream-analytics-job-analysis-with-metric-dimensions/04-input-events-splitting-with-partition-id.png":::


What action could you take further?

As shown in screenshot above, partition#0 and partition#1 that have high watermark delay, are receiving significantly more input data than other partitions. We call this “data-skew”. This means that the streaming nodes processing the partitions with data-skew need to consume more resources (CPU and memory) than others as shown below. 

:::image type="content" source="./media/stream-analytics-job-analysis-with-metric-dimensions/05-resource-utilization-of-the-partitions-with-data-skew.png" alt-text="Diagram that show the resource utilization of the partitions with data skew." lightbox="./media/stream-analytics-job-analysis-with-metric-dimensions/05-resource-utilization-of-the-partitions-with-data-skew.png":::


Streaming nodes that process partitions with higher data skew will exhibit higher CPU and/or SU (memory) utilization that will affect job's performance and result in increasing watermark delay. To mitigate this, you'll need to repartition your input data more evenly.

## Overloaded CPU/memory causes watermark delay increasing

When an embarrassingly parallel job has watermark delay increasing, it may not just happen on one or several partitions, but all of the partitions. How to confirm my job is falling into this case? 
1. First, split the watermark delay with “Partition ID” dimension, same as the case above. For example, the below job:

   :::image type="content" source="./media/stream-analytics-job-analysis-with-metric-dimensions/06-watermark-delay-splitting-with-partition-id-all-increasing.png" alt-text="Diagram that shows the watermark delay splitting with Partition ID for the case of overloaded cpu and memory." lightbox="./media/stream-analytics-job-analysis-with-metric-dimensions/06-watermark-delay-splitting-with-partition-id-all-increasing.png":::


2. Split the “Input Events” metric with “Partition IDs” to confirm if there's data-skew in input data per partitions.
3. Then, check the CPU and SU utilization to see if the utilization in all streaming nodes is too high.

   :::image type="content" source="./media/stream-analytics-job-analysis-with-metric-dimensions/07-cpu-and-memory-utilization-splitting-with-node-name.png" alt-text="Diagram that show the CPU and memory utilization splitting by Node name for the case of overloaded cpu and memory." lightbox="./media/stream-analytics-job-analysis-with-metric-dimensions/07-cpu-and-memory-utilization-splitting-with-node-name.png":::


4. If the utilization of CPU and SU is very high (>80%) in all streaming nodes, it can conclude that this job has a large amount of data being processed within each streaming node. You further check how many partitions are allocated to one streaming node by checking the “Input Events” metrics with filter by a streaming node ID with "Node Name" dimension and splitting by "Partition ID”. See the screenshot below:

   :::image type="content" source="./media/stream-analytics-job-analysis-with-metric-dimensions/08-partition-count-on-one-streaming-node.png" alt-text="Diagram that shows the partition count on one streaming node for the case of overloaded cpu and memory." lightbox="./media/stream-analytics-job-analysis-with-metric-dimensions/08-partition-count-on-one-streaming-node.png":::

5. From the above screenshot, you can see there are four partitions allocated to one streaming node that occupied nearly 90% ~ 100% of the streaming node resource. You can use the similar approach to check the rest streaming nodes to confirm if they're also processing four partitions data.

What action could you take further?

1. Naturally, you’d think to reduce the partition count for each streaming node to reduce the input data for each streaming node. To achieve this, you can double the SUs to have each streaming node to handle two partitions data, or four times the SUs to have each streaming node to handle one partition data. Refer to [Understand and adjust Streaming Units](./stream-analytics-streaming-unit-consumption.md) for the relationship between SUs assignment and streaming node count.
2. What should I do if the watermark delay is still increasing when one streaming node is handling one partition data? Repartition your input with more partitions to reduce the amount of data in each partition. Refer to this document for details: [Use repartitioning to optimize Azure Stream Analytics jobs](./repartition.md)



## Next steps

* [Monitor Stream Analytics job with Azure portal](./stream-analytics-monitoring.md)
* [Azure Stream Analytics job metrics](./stream-analytics-job-metrics.md)
* [Azure Stream Analytics job metrics dimensions](./stream-analytics-job-metrics-dimensions.md)
* [Understand and adjust Streaming Units](./stream-analytics-streaming-unit-consumption.md)