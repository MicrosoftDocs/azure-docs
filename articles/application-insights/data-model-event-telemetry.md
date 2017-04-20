---
title: Application Insights Telemetry Data Model - Event Telemetry | Microsoft Docs
description: Application Insights data model for event telemetry
services: application-insights
documentationcenter: .net
author: SergeyKanzhelev
manager: azakonov

ms.service: application-insights
ms.workload: TBD
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 04/17/2017
ms.author: sergkanz

---
# Event Telemetry

Events represent a point in time action happened in the application. Typically it is user interaction like button click or order checkout. It can also be an application life cycle event like initialization or configuration update. Event name expected to be a short low cardinality string. 

Semantically events may or may now be correlated to requests. However, if used properly, event telemetry is more important than requests or traces. Events represent business telemetry and should be a subject to separate, less aggressive sampling.

### Name

Event name. Keep it low cardinality to allow proper grouping and useful metrics.

Max length: 512 characters

## Extensibility

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../includes/application-insights-data-model-properties.md)]

### Custom measurements

[!INCLUDE [application-insights-data-model-measurements](../includes/application-insights-data-model-measurements.md)]

