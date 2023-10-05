---
title: 'Ingestion overview - Azure Time Series Insights Gen2 | Microsoft Docs'
description: Learn about data ingestion into Azure Time Series Insights Gen2.
author: tedvilutis
ms.author: tvilutis
manager: cnovak
ms.reviewer: orspodek
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 12/02/2020
ms.custom: seodec18
---

# Azure Time Series Insights Gen2 data ingestion overview

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

Your Azure Time Series Insights Gen2 environment contains an *ingestion engine* to collect, process, and store streaming time series data. As data arrives into your event source(s), Azure Time Series Insights Gen2 will consume and store your data in near real time.

[![Ingestion overview](media/concepts-ingress-overview/ingress-overview.png)](media/concepts-ingress-overview/ingress-overview.png#lightbox)

## Ingestion topics

The following articles cover data processing in depth, including best practices to follow:

* Read about [event sources](./concepts-streaming-ingestion-event-sources.md) and guidance on selecting an event source timestamp.

* Review the supported [data types](./concepts-supported-data-types.md)

* Understand how the ingestion engine will apply a set of [rules](./concepts-json-flattening-escaping-rules.md) to your JSON properties to create your storage account columns.

* Review your environment [throughput limitations](./concepts-streaming-ingress-throughput-limits.md) to plan for your scale needs.

## Next steps

* Continue on to learn more about [event sources](./concepts-streaming-ingestion-event-sources.md) for your Azure Time Series Insights Gen2 environment.
