---
title: Azure Application Insights Telemetry Data Model - Trace Telemetry | Microsoft Docs
description: Application Insights data model for trace telemetry
services: application-insights
documentationcenter: .net
author: mrbullwinkle
manager: carmonm
ms.service: application-insights
ms.workload: TBD
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 04/25/2017
ms.reviewer: sergkanz
ms.author: mbullwin
---
# Trace telemetry: Application Insights data model

Trace telemetry (in [Application Insights](../../azure-monitor/app/app-insights-overview.md)) represents `printf` style trace statements that are text-searched. `Log4Net`, `NLog`, and other text-based log file entries are translated into instances of this type. The trace does not have measurements as an extensibility.

## Message

Trace message.

Max length: 32768 characters

## Severity level

Trace severity level. Value can be `Verbose`, `Information`, `Warning`, `Error`, `Critical`.

## Custom properties

[!INCLUDE [application-insights-data-model-properties](../../../includes/application-insights-data-model-properties.md)]

## Next steps

- [Explore .NET trace logs in Application Insights](../../azure-monitor/app/asp-net-trace-logs.md).
- [Explore Java trace logs in Application Insights](../../azure-monitor/app/java-trace-logs.md).
- See [data model](data-model.md) for Application Insights types and data model.
- [Write custom trace telemetry](../../azure-monitor/app/api-custom-events-metrics.md#tracktrace)
- Check out [platforms](../../azure-monitor/app/platforms.md) supported by Application Insights.
