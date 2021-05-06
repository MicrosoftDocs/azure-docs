---
title: include file
description: include file
services: digital-twins
ms.service: digital-twins
ms.topic: include
ms.date: 11/11/2020
author: deepakpalled
ms.author: dpalled
manager: diviso
ms.custom: include file
---

### Property limits

Azure Time Series Insights property limits have increased to 1,000 for warm storage and no property limit for cold storage. Supplied event properties have corresponding JSON, CSV, and chart columns that you can view within the [Azure Time Series Insights Gen2 Explorer](../articles/time-series-insights/quickstart-explore-tsi.md).

| SKU | Maximum properties |
| --- | --- |
| Gen2 (L1) | 1,000 properties (columns) for warm storage and unlimited for cold storage|
| Gen1 (S1) | 600 properties (columns) |
| Gen1 (S2) | 800 properties (columns) |

### Streaming Ingestion

* There is a maximum of two [event sources](../articles/time-series-insights/concepts-streaming-ingestion-event-sources.md) per environment.

* The best practices and general guidance for event sources can be found [here](../articles/time-series-insights/concepts-streaming-ingestion-event-sources.md#streaming-ingestion-best-practices)

* By default, Azure Time Series Insights Gen2 can ingest incoming data at a rate of **up to 1 megabyte per second (MBps) per Azure Time Series Insights Gen2 environment**. There are additional limitations [per hub partition](../articles/time-series-insights/concepts-streaming-ingress-throughput-limits.md#hub-partitions-and-per-partition-limits). Rates of up to 2 MBps can be provided by submitting a support ticket through the Azure portal. To learn more, read [Streaming Ingestion Throughput Limits](../articles/time-series-insights/concepts-streaming-ingress-throughput-limits.md).

### API limits

REST API limits for Azure Time Series Insights Gen2 are specified in the [REST API reference documentation](/rest/api/time-series-insights/preview#limits-1).