---
title: Application Insights telemetry data model - Event telemetry | Microsoft Docs
description: Learn about the Application Insights data model for event telemetry.
ms.topic: conceptual
ms.date: 04/25/2017
ms.reviewer: mmcc
---

# Event telemetry: Application Insights data model

You can create event telemetry items (in [Application Insights](./app-insights-overview.md)) to represent an event that occurred in your application. Typically, it's a user interaction such as a button click or order checkout. It can also be an application lifecycle event like initialization or a configuration update.

Semantically, events may or may not be correlated to requests. However, if used properly, event telemetry is more important than requests or traces. Events represent business telemetry and should be subject to separate, less aggressive [sampling](./api-filtering-sampling.md).

## Name

Event name: To allow proper grouping and useful metrics, restrict your application so that it generates a few separate event names. For example, don't use a separate name for each generated instance of an event.

**Maximum length:** 512 characters

## Custom properties

[!INCLUDE [application-insights-data-model-properties](../../../includes/application-insights-data-model-properties.md)]

## Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../../../includes/application-insights-data-model-measurements.md)]

## Next steps

- See [Data model](data-model.md) for Application Insights types and data models.
- [Write custom event telemetry](./api-custom-events-metrics.md#trackevent).
- Check out [platforms](./app-insights-overview.md#supported-languages) supported by Application Insights.