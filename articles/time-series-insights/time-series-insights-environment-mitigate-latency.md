---
title: How to mitigate throttling and latency in Azure Time Series Insights | Microsoft Docs
description: This article describes how to mitigate latency and throttling in Azure Time Series Insights 
keywords: 
services: time-series-insights
documentationcenter: 
author: 
manager: jhubbard
editor: 

ms.assetid: 
ms.service: tsi
ms.devlang: 
ms.topic: how-to-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 11/06/2017
ms.author: 
---

# Mitigate latency and throttling

If the amount of incoming data exceeds your environment's configuration, you may experience latency or throttling in Azure Time Series Insights.

You can avoid latency and throttling by properly configuring your environment for the amount of data you want to analyze.

You are most likely to experience latency and throttling when you:

- Add an event source that contains old data that may exceed your allotted ingress rate (Time Series Insights will need to catch up).
- Add more event sources to an environment, resulting in a spike from additional events (which could exceed your environment’s capacity).
- Push large amounts of historical events to an event source, resulting in a lag (Time Series Insights will need to catch up).
- Join reference data with telemetry, resulting in larger event size.  From a throttling perspective, an ingressed data packet with a packet size of 32 KB is treated as 32 events, each sized 1 KB. The maximum allowed event size is 32 KB; data packets larger than 32 KB are truncated.


## Diagnose latency and throttling with alerts

Alerts can help you to help diagnose and mitigate latency issues caused by your environment. 

1. In the Azure portal, click **Metrics**. 

   ![Metrics](media/environment-mitigate-latency/add-metrics.png)

2. Click **Add metric alert**.  

    ![Add metric alert](media/environment-mitigate-latency/add-metric-alert.png)

From there, you can configure alerts using the following metrics:

|Metric  |Description  |
|---------|---------|
|**Ingress Received Bytes**     | Count of raw bytes read from event sources. Raw count usually includes the property name and value.  |  
|**Ingress Received Invalid Messages**     | Count of invalid messages read from all Azure Event Hubs or Azure IoT Hub event sources.      |
|**Ingress Received Messages**   | Count of messages read from all Event Hubs or IoT Hubs event sources.        |
|**Ingress Stored Bytes**     | Total size of events stored and available for query. Size is computed only on the property value.        |
|**Ingress Stored Events**     |   Count of flattened events stored and available for query.      |

![Latency](media/environment-mitigate-latency/latency.png)

One technique is to set an **Ingress Stored Events** alert >= a threshold slightly below your total environment capacity for a period of 2 hours.  This alert can help you understand if you are constantly at capacity, which indicates a high likelihood of latency.  

For example, if you have three S1 units provisioned (or 2100 events per minute ingress capacity), you can set an **Ingress Stored Events** alert for >= 1900 events for 2 hours. If you are constantly exceeding this threshold, and therefore, triggering your alert, you are likely under-provisioned.  

Also, if you suspect you are being throttled, you can compare your **Ingress Received Messages** with your event source’s egressed messages.  If ingress into your Event Hub is greater than your **Ingress Received Messages**, your Time Series Insights are likely being throttled.

## Mitigation 

To mitigate throttling or experiencing latency, the best way to correct it is to increase your environment's capacity. 

You can avoid latency and throttling by properly configuring your environment for the amount of data you want to analyze. For more information about how to add capacity to your environment, see [Scale your environment](time-series-insights-how-to-scale-your-environment.md).

## Next steps

[Diagnose and solve problems in your Time Series Insights environment](time-series-insights-diagnose-and-solve-problems.md)
