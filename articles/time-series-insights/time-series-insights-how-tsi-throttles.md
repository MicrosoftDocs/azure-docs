---
title: How Azure Time Series Insights throttles data | Microsoft Docs
description: This article describes how Azure Time Series Insights throttles data if you exceed your ingress capacity threshold
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

# Causes of throttling

If the event sources for your Azure IoT Hub or Azure Event Hub push data beyond the enforced limits for your environment, your Azure Time Series Insights is throttled, and your data will lag.

The throttling limit enforced by Azure Time Series Insights is based on your environment's SKU type and capacity. Your environment's capacity comprises all of your event sources. 

## How data is processed if you exceed capacity

When your data ingress exceeds your provisioned capacity, an overflow mechanism doubles ingress capacity per minute for up to one hour. This overflow mechanism is designed to help mitigate latency when you experience an unexpected spike in your data ingress. 

Any overflow capacity used to mitigate latency during a data ingress spike is counted against your overall capacity for pricing purposes. 

If you find that you use the overflow capacity for an hour per day or more, your environment is not correctly provisioned. In this case, you should increase your environment’s capacity to more closely match your data ingress.

## Next steps

For information about how to resolve data throttling, see [Diagnose and solve problems in your Time Series Insights environment](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-diagnose-and-solve-problems#your-environment-is-getting-throttled)
