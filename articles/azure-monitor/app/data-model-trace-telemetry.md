---
title: 'Application Insights data model: Trace telemetry'
description: Application Insights data model for trace telemetry.
ms.topic: conceptual
ms.date: 04/25/2017
---

# Trace telemetry: Application Insights data model

Trace telemetry in [Application Insights](./app-insights-overview.md) represents `printf`-style trace statements that are text searched. `Log4Net`, `NLog`, and other text-based log file entries are translated into instances of this type. The trace doesn't have measurements as an extensibility.

## Message

Trace message.

**Maximum length**: 32,768 characters

## Severity level

Trace severity level.

**Values**: `Verbose`, `Information`, `Warning`, `Error`, and `Critical`

## Custom properties

[!INCLUDE [application-insights-data-model-properties](../../../includes/application-insights-data-model-properties.md)]

## Next steps

- Explore [.NET trace logs in Application Insights](./asp-net-trace-logs.md).
- Explore [Java trace logs in Application Insights](./opentelemetry-enable.md?tabs=java#logs).
- See [data model](data-model.md) for Application Insights types and data model.
- Write [custom trace telemetry](./api-custom-events-metrics.md#tracktrace).
- Check out [platforms](./app-insights-overview.md#supported-languages) supported by Application Insights.
