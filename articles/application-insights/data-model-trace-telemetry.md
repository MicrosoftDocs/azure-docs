---
title: Application Insights Telemetry Data Model - Trace Telemetry | Microsoft Docs
description: Application Insights data model for trace telemetry
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
# Trace Telemetry

Instances of Message represent printf-like trace statements that are text-searched. Log4Net, NLog and other text-based log file entries are translated into intances of this type. The message does not have measurements.

### Message

Trace message.

Max length: 32768 characters

### Severity level

Trace severity level. Value can be `Verbose`, `Information`, `Warning`, `Error`, `Critical`.

## Extensibility

### Custom properties

[!INCLUDE [application-insights-data-model-properties](../includes/application-insights-data-model-properties.md)]

