---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: stream-analytics
ms.topic: include
ms.date: 07/10/2023
ms.author: spelluru
ms.custom: "include file"

---


A streaming node represents a set of compute resources that's used to process your input data. Every six streaming units (SUs) translate to one node, which the service automatically manages on your behalf. For more information about the relationship between streaming units and streaming nodes, see [Understand and adjust streaming units](../stream-analytics-streaming-unit-consumption.md).

**Node Name** is a dimension at the streaming node level. It can help you to drill down certain metrics to the specific streaming node level. For example, you can split the **CPU % Utilization** metric by streaming node level to check the CPU utilization of an individual streaming node.

:::image type="content" source="../media/stream-analytics-job-metrics-dimensions/07-average-cpu-splitting-by-node-name.png" alt-text="Screenshot of a chart that shows splitting average CPU utilization by the Node Name dimension." lightbox="../media/stream-analytics-job-metrics-dimensions/07-average-cpu-splitting-by-node-name.png":::

The **Node Name** dimension is available for filtering and splitting the following metrics:
-	**Backlogged Input Events**
-	**CPU % Utilization (preview)** 
-	**Input Events**
-	**Output Events**
-	**SU (Memory) % Utilization**
-	**Watermark Delay**

