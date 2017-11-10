---
title: Understand throttling in Azure Time Series Insights | Microsoft Docs
description: This article describes the throttling mechanism in Azure Time Series Insights. Throttling happens when you exceed your ingress capacity threshold. 
services: time-series-insights
ms.service: time-series-insights
author: MarkMcGeeAtAquent
ms.author: v-mamcge
manager: jhubbard
editor: MarkMcGeeAtAquent, jasonwhowell, kfile, MicrosoftDocs/tsidocs
ms.reviewer: v-mamcge, jasonh, kfile, anshan
ms.workload: big-data
ms.topic: article
ms.date: 11/15/2017
---

# Causes of throttling in Azure Time Series Insights
If the event sources for your Azure IoT Hub or Azure Event Hub push data beyond the enforced limits for your environment, your Azure Time Series Insights is throttled, and the incoming data will lag.

The throttling limit enforced by Azure Time Series Insights is based on your environment's SKU type and capacity. Your environment's capacity comprises all of your event sources. 

## How data is processed if you exceed capacity
When your data ingress exceeds your provisioned capacity, an overflow mechanism doubles ingress capacity per minute for up to one hour. This overflow mechanism is designed to help mitigate latency when you experience an unexpected spike in your data ingress. 

Any overflow capacity used to mitigate latency during a data ingress spike is counted against your overall capacity for pricing purposes. 

If you find that you use the overflow capacity for an hour per day or more, your environment is not correctly provisioned. In this case, you should increase the environment’s capacity to more closely match your data ingress.

## Next steps
For information about how to resolve data throttling, see [How to monitor performance, reduce throttling, and prevent latency in Azure Time Series Insights](./time-series-insights-environment-mitigate-latency.md)
