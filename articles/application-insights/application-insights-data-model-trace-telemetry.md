---
title: Azure Application Insights Telemetry Data Model - Trace Telemetry | Microsoft Docs
description: Application Insights data model for trace telemetry
services: application-insights
documentationcenter: .net
author: SergeyKanzhelev
manager: carmonm

ms.service: application-insights
ms.workload: TBD
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 04/25/2017
ms.author: cfreeman

---
# Trace telemetry: Application Insights data model

Trace telemetry (in [Application Insights](app-insights-overview.md)) represents `printf` style trace statements that are text-searched. `Log4Net`, `NLog`, and other text-based log file entries are translated into instances of this type. The trace does not have measurements as an extensibility.

## Message

Trace message.

Max length: 32768 characters

## Severity level

Trace severity level. Value can be `Verbose`, `Information`, `Warning`, `Error`, `Critical`.

## Custom properties

[!INCLUDE [application-insights-data-model-properties](../../includes/application-insights-data-model-properties.md)]

## Next steps

- [Explore .NET trace logs in Application Insights](app-insights-asp-net-trace-logs.md).
- [Explore Java trace logs in Application Insights](app-insights-java-trace-logs.md).
- See [data model](application-insights-data-model.md) for Application Insights types and data model.
- [Write custom trace telemetry](app-insights-api-custom-events-metrics.md#tracktrace)
- Check out [platforms](app-insights-platforms.md) supported by Application Insights.
