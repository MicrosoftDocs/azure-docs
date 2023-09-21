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

When streaming data is ingested into the Azure Stream Analytics service for processing, the input data is distributed to streaming nodes according to the partitions in the input source. The **Partition ID** dimension is the ID of the input data partition from the input source. 

For example, if the input source is an event hub, the partition ID is the event hub's partition ID. **Partition ID** in the input is the same as it is in the output.

:::image type="content" source="../media/stream-analytics-job-metrics-dimensions/08-watermark-delay-splitting-by-partition-id.png" alt-text="Diagram that shows splitting a watermark delay by the Partition ID dimension." lightbox="../media/stream-analytics-job-metrics-dimensions/08-watermark-delay-splitting-by-partition-id.png":::

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

