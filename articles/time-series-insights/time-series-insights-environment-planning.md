---
title: Plan your Azure Time Series Insights environment | Microsoft Docs
description: This article describes best practices for planning an Azure Time Series Insights environment
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
ms.date: 11/07/2017
ms.author: 
---

# Plan your Time Series Insights environment

This topic describes how to plan your Time Series Insights environment based on your expected ingress rate and your data retention requirements.

## Best practices

To get started, it’s best if you know how much data you expect to push by the minute as well as how long you need to store your data in Time Series Insights.  

For more information about capacity and retention for both Time Series Insights SKUs, see [Time Series Insights pricing](https://azure.microsoft.com/pricing/details/time-series-insights/).

## Overall storage capacity

By default, Time Series Insights retains data based on the amount of storage you have provisioned (units times amount of storage per unit) and ingress.  

## Data retention

You can configure your Time Series Insights environment’s retention, enabling up to 400 days of retention.  Time Series Insights has two modes, one that optimizes for ensuring your environment has the most up-to-date data (on by default), and another that optimizes for ensuring retention limits are met, where ingress is paused if the overall storage capacity of the environment is hit.  You can adjust retention and toggle between the two modes in the environment’s configuration page in the Azure portal.

It’s important to configure this setting based on your needs.  For more information, see [Configure data retention in Time Series Insights](time-series-insights-configure-retention.md).  

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

You may not know in advance how much data you expect to push. In this case, you can find data telemetry for [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub/iot-hub-metrics) and [Azure Event Hubs](https://blogs.msdn.microsoft.com/cloud_solution_architect/2016/05/25/using-the-azure-rest-apis-to-retrieve-event-hub-metrics/) in your Azure portal. This telemetry can help you determine how to provision your environment. Use the **Metrics** blade in the Azure portal for the respective event source to view its telemetry. If you understand your event source metrics, you can more effectively plan and provision your Time Series Insights environment.

## Know your requirements

To provision your Time Series Insights environment, identify the SKU(s) that will deliver enough retention and ingress to meet your requirements.

- Confirm your ingress capacity is above your average per-minute rate and that your environment is large enough to handle your anticpated ingress equivalent to 2x your capacity for less than 1 hour.

- If ingress spikes occur that last for longer than 1 hour, use the spike rate as your average, and provision an environment with the capacity to handle the spike rate.
 
## Mitigate throttling and latency

For information about how to prevent throttling and latency, see [When Time Series Insights throttles data](time-series-insights-how-tsi-throttles.md) and [Mitigate latency and throttling](time-series-insights-environment-mitigate-latency.md). 

## Next steps

[How to add an Event Hub event source](time-series-insights-how-to-add-an-event-source-eventhub.md)
[How to add an IoT Hub event source](time-series-insights-how-to-add-an-event-source-iothub.md)

