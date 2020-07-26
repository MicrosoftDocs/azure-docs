---
title: include file
description: include file
services: digital-twins
ms.service: digital-twins
ms.topic: include
ms.date: 07/09/2020
author: deepakpalled
ms.author: dpalled
manager: diviso
ms.custom: include file
---

### Property limits

Azure Time Series Insights property limits have increased to 1,000 from a maximum cap of 800 in Gen1. Supplied event properties have corresponding JSON, CSV, and chart columns that you can view within the [Azure Time Series Insights Gen2 Explorer](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-update-quickstart).

| SKU | Maximum properties |
| --- | --- |
| Gen2 (L1) | 1,000 properties (columns) |
| Gen1 (S1) | 600 properties (columns) |
| Gen1 (S2) | 800 properties (columns) |

### Event sources

A maximum of two event sources per instance is supported.

* Learn how to [Add an event hub source](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-how-to-add-an-event-source-eventhub).
* Configure [an IoT hub source](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-how-to-add-an-event-source-iothub).

By default, [Gen2 environments support ingress rates](https://docs.microsoft.com/azure/time-series-insights/concepts-streaming-ingress-throughput-limits) up to **1 megabyte per second (MB/s) per environment**. Customers may scale their environments up to **16 MB/s** throughput if necessary. There is also a per-partition limit of **0.5 MB/s**.

### API limits

REST API limits for Azure Time Series Insights Gen2 are specified in the [REST API reference documentation](https://docs.microsoft.com/rest/api/time-series-insights/preview#limits-1).
