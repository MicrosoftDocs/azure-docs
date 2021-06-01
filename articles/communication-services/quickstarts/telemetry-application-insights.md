---
title: Quickstart - Exporting SDK Telemetry Data to Application Insights
titleSuffix: An Azure Communication Services quickstart
description: Learn how to export Azure Communication Services SDK Telemetry Data to Application Insights.
author: peiliu
manager: vravikumar
services: azure-communication-services
ms.author: peiliu
ms.date: 06/01/2021
ms.topic: quickstart
ms.service: azure-communication-services
zone_pivot_groups: acs-js-csharp-java-python
---

# Quickstart: Using Azure OpenTelemetry Exporter to Export SDK Telemetry Data to Application Insights

The Azure OpenTelemetry Exporter is an SDK within [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/). It allows you to export tracing data using OpenTelemetry and send the data to [Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview). OpenTelemetry provides a standardized way for applications and frameworks to collect telemetry information.

Azure Application Insights is a feature of Azure Monitor which is used to monitor live applications. It displays telemetry data about your application in a Microsoft Azure resource. The telemetry model is standardized so that it is possible to create platform and language-independent monitoring.

::: zone pivot="programming-language-csharp"
[!INCLUDE [.NET](./includes/telemetry-app-insights-net.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [JavaScript](./telemetry-app-insights-js.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Python](./telemetry-app-insights-python.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Java](./telemetry-app-insights-java.md)]
::: zone-end

The output of the app describes each action that is completed:
<!---cSpell:disable --->
```console
// TODO: Fill out the console values.
```
<!---cSpell:enable --->

## Next Steps

In this quickstart, you learned how to:

> [!div class="checklist"]
> * Set up Telemetry Exporter
> * Funnel Telemetry data to Application Insights
> * View exported data in Application Insights

You may also want to:

// TODO: Add more resources and Telemetry and Application Insights for further learning
