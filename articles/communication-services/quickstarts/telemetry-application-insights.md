---
title: Export SDK telemetry to Application Insights
titleSuffix: An Azure Communication Services article
description: This article describes how to export Azure Communication Services SDK Telemetry Data to Application Insights.
author: peiliu
manager: vravikumar
services: azure-communication-services
ms.author: peiliu
ms.date: 08/19/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: data
zone_pivot_groups: acs-js-csharp-java-python
ms.custom: mode-api, devx-track-extended-java, devx-track-js, devx-track-python
---

# Export SDK telemetry to Application Insights

> [!IMPORTANT]
> For the most up-to-date information on this topic, please visit: 
> [Add and modify OpenTelemetry in Azure Monitor](/azure/azure-monitor/app/opentelemetry-add-modify?tabs=aspnetcore)


The Azure OpenTelemetry Exporter is an SDK within [Azure Monitor](/azure/azure-monitor/). It enables you to export tracing data using OpenTelemetry and send the data to [Application Insights](/azure/azure-monitor/app/app-insights-overview). OpenTelemetry provides a standard way for applications and frameworks to collect telemetry information.

Azure Application Insights is a feature of Azure Monitor which monitors live applications. It displays telemetry data about your application in a Microsoft Azure resource. The telemetry model is standardized to support platform and language-independent monitoring.

::: zone pivot="programming-language-csharp"
[!INCLUDE [.NET](./includes/telemetry-app-insights-net.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [JavaScript](./includes/telemetry-app-insights-js.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Java](./includes/telemetry-app-insights-java.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Python](./includes/telemetry-app-insights-python.md)]
::: zone-end

The output of the app describes each action that is completed:
<!---cSpell:disable --->
```console
Created an identity with ID: <identity-id>
Issued an access token with 'chat' scope that expires at <expiry-data>
```
<!---cSpell:enable --->

## View the telemetry data in Application Insights

To analyze the telemetry data from the SDK, go to the `Performance` tab and then go to `Dependencies`. You can see the `Create User Activity` and `Get Token Activity` that we track.

:::image type="content" source="media/application-insights-dependencies.png" alt-text="Screenshot showing telemetry data entries in Application Insights.":::

To view more detail, you can drill into the samples:

:::image type="content" source="media/application-insights-samples-drill-down.png" alt-text="Screenshot showing the drill down view of the samples":::

In the drill-down view, there's more information about the Activity such as where it was called from, its timestamp, name, performance, type, and so on. You can also see the Cloud role name and instance ID that we defined in the preceding sample code snippet. Notice that the custom properties also show up here:

:::image type="content" source="media/application-insights-e2e-details.png" alt-text="End to end view of the transaction details":::

## Next steps

This article described how to:

> [!div class="checklist"]
> * Set up Telemetry Exporter
> * Funnel Telemetry data to Application Insights
> * View exported data in Application Insights

## Related articles

- [Learn more about Analyzing Data in Application Insights](/powerapps/maker/canvas-apps/application-insights)
