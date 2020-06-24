---
title: 'Ingestion Overview - Azure Time Series Insights | Microsoft Docs'
description: Learn about data ingestion into Azure Time Series Insights.
author: lyrana
ms.author: lyhughes
manager: deepakpalled
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 06/03/2020
ms.custom: seodec18
---

# Azure Time Series Insights data ingestion overview

Your Azure Time Series Insights environment contains an *ingestion engine* to collect, process, and store streaming time series data. As data arrives into your event source(s), Azure Time Series Insights will consume and store your data in near real-time.

[![Ingestion overview](media/concepts-ingress-overview/tsi-ingress-overview.png)](media/concepts-ingress-overview/tsi-ingress-overview.png#lightbox)

## Ingestion topics

The following articles cover data processing in depth, including best practices to follow:

* Read about [event sources](concepts-streaming-ingestion-event-sources.md) and guidance on selecting an event source timestamp.

* Review the supported [data types](concepts-supported-data-types.md)

* Understand how the ingestion engine will apply a set of [rules](./concepts-JSON-flattening-and-escaping-rules.md) to your JSON payload to convert telemetry properties into your storage account columns.

* Review your environment [throughput limitations](concepts-streaming-throughput-limitations.md) to plan for your scale needs.

## Next steps

* Continue on to learn more about [event sources](concepts-streaming-ingestion-event-sources.md) for your Azure Time Series Insights environment. 
