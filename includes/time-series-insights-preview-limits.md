---
title: include file
description: include file
services: digital-twins
ms.service: digital-twins
ms.topic: include
ms.date: 02/07/2020
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.custom: include file
---

### General availability and preview comparison

The following table summarizes several key differences between Azure Time Series Insights general availability (GA) and preview instances.

| | GA | Preview |
| --- | --- | ---|
| First-class citizen | Event-centric | Time-series-centric |
| Semantic reasoning | Low-level (reference data) | High-level (models) |
| Data contextualization | Non-device level | Device and non-device level |
| Compute logic storage | No | Stored in type variables part of model |
| Storage and access control | No | Enabled via model |
| Aggregations/Sampling | No | Event weighted and time weighted |
| Signal reconstruction | No | Interpolation |
| Production of derived time series | No | Yes, merges and joins |
| Language flexibility | Non-composable | Composable |
| Expression language | Predicate string | Time series expressions (predicate strings, values, expressions, and functions) |

### Property limits

Time Series Insights property limits have increased to 1,000 from a maximum cap of 800 in GA. Supplied event properties have corresponding JSON, CSV, and chart columns that you can view within the [Time Series Insights Preview explorer](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-update-quickstart).

| SKU | Maximum properties |
| --- | --- |
| Preview PAYG | 1,000 properties (columns) |
| GA S1 | 600 properties (columns) |
| GA S2 | 800 properties (columns) |

### Event sources

A maximum of two event sources per instance is supported. 

* Learn how to [Add an event hub source](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-how-to-add-an-event-source-eventhub).
* Configure [an IoT hub source](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-how-to-add-an-event-source-iothub).

By default, [Preview environments support ingress rates](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-update-storage-ingress#ingress-scale-and-preview-limitations) up to **1 megabyte per second (MB/s) per environment**. Customers may scale their Preview environments up to **16 MB/s** throughput if necessary. There is also a per-partition limit of **0.5 MB/s**. 

### API limits

REST API limits for Time Series Insights Preview are specified in the [REST API reference documentation](https://docs.microsoft.com/rest/api/time-series-insights/preview-query#limits).
