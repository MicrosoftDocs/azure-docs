---
title: Quickstart - Exporting SDK telemetry data to Application Insights
titleSuffix: An Azure Communication Services quickstart
description: Learn how to export Azure Communication Services SDK Telemetry Data to Application Insights.
author: peiliu
manager: vravikumar
services: azure-communication-services
ms.author: peiliu
ms.date: 06/30/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: data
zone_pivot_groups: acs-js-csharp-java-python
ms.custom: mode-api, devx-track-extended-java, devx-track-js, devx-track-python
---

# Quickstart: Using Azure OpenTelemetry Exporter to export SDK telemetry data to Application Insights

The Azure OpenTelemetry Exporter is an SDK within [Azure Monitor](../../azure-monitor/index.yml). It allows you to export tracing data using OpenTelemetry and send the data to [Application Insights](../../azure-monitor/app/app-insights-overview.md). OpenTelemetry provides a standardized way for applications and frameworks to collect telemetry information.

Azure Application Insights is a feature of Azure Monitor which is used to monitor live applications. It displays telemetry data about your application in a Microsoft Azure resource. The telemetry model is standardized so that it is possible to create platform and language-independent monitoring.

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
In order to analyze the telemetry data from the SDK, go to the `Performance` tab and then go to `Dependencies`. You will be able to see the `Create User Activity` and `Get Token Activity` that we’ve tracked.

:::image type="content" source="media/application-insights-dependencies.png" alt-text="Screenshot showing telemetry data entries in Application Insights.":::

To view more detail, you can drill into the samples:

:::image type="content" source="media/application-insights-samples-drill-down.png" alt-text="Screenshot showing the drill down view of the samples":::

In the drill-down view, there is more information about the Activity such as where it was called from, its timestamp, name, performance, type, etc. You can also see the Cloud role name and instance id that we defined in the sample code snippet above. Notice that the custom properties that were tracked also show up here:

:::image type="content" source="media/application-insights-e2e-details.png" alt-text="End to end view of the transaction details":::

## Next Steps

In this quickstart, you learned how to:

> [!div class="checklist"]
> * Set up Telemetry Exporter
> * Funnel Telemetry data to Application Insights
> * View exported data in Application Insights

You may also want to:

- [Learn more about Analyzing Data in Application Insights](/powerapps/maker/canvas-apps/application-insights)
