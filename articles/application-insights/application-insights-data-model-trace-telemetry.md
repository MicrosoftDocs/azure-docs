---
title: Azure Application Insights Telemetry Data Model - Trace Telemetry | Microsoft Docs
description: Application Insights data model for trace telemetry
services: application-insights
documentationcenter: .net
author: SergeyKanzhelev
manager: azakonov-ms

ms.service: application-insights
ms.workload: TBD
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 04/17/2017
ms.author: sergkanz

---
# Trace telemetry: Application Insights data model

Trace telemetry represents the `printf` style trace statements that are text-searched. `Log4Net`, `NLog`, and other text-based log file entries are translated into instances of this type. The trace does not have measurements as an extensibility.

## Message

Trace message.

Max length: 32768 characters

## Severity level

Trace severity level. Value can be `Verbose`, `Information`, `Warning`, `Error`, `Critical`.

## Custom properties

[!INCLUDE [application-insights-data-model-properties](../../includes/application-insights-data-model-properties.md)]

## Next steps

- See [data model](/application-insights-data-model.md) for Application Insights types and data model.
- [Explore .NET trace logs in Application Insights](/app-insights-asp-net-trace-logs.md).
- [Explore Java trace logs in Application Insights](/app-insights-java-trace-logs.md).
- Check out [platforms](/app-insights-platforms.md) supported by Application Insights.
