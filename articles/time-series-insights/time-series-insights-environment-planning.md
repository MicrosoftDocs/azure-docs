---
title: Plan your Time Series Insights environment | Microsoft Docs
description: This article describes best practices for planning a Time Series Insights environment
keywords: 
services: time-series-insights
documentationcenter: 
author: 
manager: jhubbard
editor: 

ms.assetid: 
ms.service: tsi
ms.devlang: 
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-data
ms.date: 11/06/2017
ms.author: 
---

# Plan your Time Series Insights environment

When planning your Azure Time Series Insights environment, there are two areas of focus: data retention and data ingress.

## Data retention
By default, Time Series Insights retains data based on the amount of storage you provision (Units x Storage Per Unit) and data ingress. 

For example, if you provision an S1 environment with one unit that ingresses 120 MB/day and you do not configure the retention value, your data is automatically retained for 250 days.

You can configure a maximum of 400 days of data retention in your Time Series Insights environment.

To configure data retention:

* In your Azure portal, click **Configure**, then enter a value (in days) from from 1 to 31. 

   ![Configure retention](media/environment-mitigate-latency/configure-retention.png)

## Ingress capacity

The other area to focus on for planning is ingress capacity, which is a derivative of the per-minute allocation. 

From a throttling perspective, an ingressed data packet with a packet size of 32 KB is treated as 32 events, each sized 1 KB. The maximum allowed event size is 32 KB; data packets larger than 32 KB are truncated.

The following table summarizes the ingress capacity for each SKU:

|SKU  |Events Count Per Month, Per Unit  |Events size Per Month, Per Unit  |Events Count Per Minute, Per Unit  | Size Per Minute, Per Unit   |
|---------|---------|---------|---------|---------|
|S1     |   30 million     |  30 GB     |  700    |  700 KB   |
|S2     |   300 million    |   300 GB   | 7,000   | 7,000 KB  |

You can increase the capacity of an S1 or S2 SKU to 10 units in a single environment. You cannot migrate from an S1 environment to an S2, or from an S2 environment to an S1. 

For ingress capacity, you should first determine the total ingress you require on a per-month basis. Next, determine what your per-minute needs are, as this is where throttling and latency play a role. For more information, see [When Time Series Insights throttles data](time-series-insights-how-tsi-throttles.md).

If you have a spike in your data ingress lasting less than 24 hours, Time Series Insights can "catch-up" at an ingress rate of 2x the listed rates above. 

For example, if you have a single S1 SKU and ingress data at a rate of 700 events per minute, and spike for less than 1 hour at a rate of 1400 events or less, there would be no noticeable latency to your environment. However, if you exceed 1400 events per minute for more than one hour, you would likely experience latency to data that is visualized and available for query in your environment. 

You can find data telemetry for [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub/iot-hub-metrics) and [Azure Event Hubs](https://blogs.msdn.microsoft.com/cloud_solution_architect/2016/05/25/using-the-azure-rest-apis-to-retrieve-event-hub-metrics/) in your Azure portal. This telemetry can help you determine how much with which to provision your environment. Use the **Metrics** blade in the Azure portal for the respective event source to view its telemetry. If you understand your event source metrics, you can more effectively plan and provision your Time Series Insights environment.

## Know your requirements

To provision your Time Series Insights environment, identify the SKU(s) that will deliver enough retention and ingress to meet your requirements.

- Confirm your ingress capacity is above your average per-minute rate and that your environment is large enough to handle your anticpated ingress equivalent to 2x your capacity for less than 1 hour.

- If ingress spikes occur that last for longer than 1 hour, use the spike rate as your average, and provision an environment with the capacity to handle the spike rate.

## Next steps


