---
title: Azure Application Insights Telemetry Data Model - Event Telemetry | Microsoft Docs
description: Application Insights data model for event telemetry
ms.topic: conceptual
ms.date: 04/25/2017

ms.reviewer: sergkanz
---

# Event telemetry: Application Insights data model

You can create event telemetry items (in [Application Insights](../../azure-monitor/app/app-insights-overview.md)) to represent an event that occurred in your application. Typically it is a user interaction such as button click or order checkout. It can also be an application life cycle event like initialization or configuration update. 

Semantically, events may or may not be correlated to requests. However, if used properly, event telemetry is more important than requests or traces. Events represent business telemetry and should be a subject to separate, less aggressive [sampling](../../azure-monitor/app/api-filtering-sampling.md).

## Name

Event name. To allow proper grouping and useful metrics, restrict your application so that it generates a small number of separate event names. For example, don't use a separate name for each generated instance of an event.

Max length: 512 characters

## Custom properties

[!INCLUDE [application-insights-data-model-properties](../../../includes/application-insights-data-model-properties.md)]

## Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../../../includes/application-insights-data-model-measurements.md)]

## Next steps

- See [data model](data-model.md) for Application Insights types and data model.
- [Write custom event telemetry](../../azure-monitor/app/api-custom-events-metrics.md#trackevent)
- Check out [platforms](../../azure-monitor/app/platforms.md) supported by Application Insights.
