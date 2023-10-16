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


**Logical Name** is the input or output name for a Stream Analytics job. For example, assume that a Stream Analytics job has four inputs and five outputs. You'll see the four individual logical inputs and five individual logical outputs when you split input-related and output-related metrics by this dimension.

:::image type="content" source="../media/stream-analytics-job-metrics-dimensions/04-multiple-input-and-output-of-an-job.png" alt-text="Screenshot that shows multiple inputs and outputs in a Stream Analytics job." lightbox="../media/stream-analytics-job-metrics-dimensions/04-multiple-input-and-output-of-an-job.png":::

:::image type="content" source="../media/stream-analytics-job-metrics-dimensions/06-output-events-splitting-by-logic-name.png" alt-text="Screenshot of a chart that shows splitting the Output Events metric by Logical Name." lightbox="../media/stream-analytics-job-metrics-dimensions/06-output-events-splitting-by-logic-name.png":::

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
