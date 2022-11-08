---
title: 'Application Insights: Languages, platforms, and integrations | Microsoft Docs'
description: Languages, platforms, and integrations that are available for Application Insights.
ms.topic: conceptual
ms.date: 10/24/2022
ms.reviewer: mmcc
---

# Supported languages

* [C#|VB (.NET)](./asp-net.md)
* [Java](./java-in-process-agent.md)
* [JavaScript](./javascript.md)
* [Node.js](./nodejs.md)
* [Python](./opencensus-python.md)

## Supported platforms and frameworks

Supported platforms and frameworks are listed here.

### Azure service integration (portal enablement, Azure Resource Manager deployments)
* [Azure Virtual Machines and Azure Virtual Machine Scale Sets](./azure-vm-vmss-apps.md)
* [Azure App Service](./azure-web-apps.md)
* [Azure Functions](../../azure-functions/functions-monitoring.md)
* [Azure Cloud Services](./azure-web-apps-net-core.md), including both web and worker roles

### Auto-instrumentation (enable without code changes)
* [ASP.NET - for web apps hosted with IIS](./status-monitor-v2-overview.md)
* [ASP.NET Core - for web apps hosted with IIS](./status-monitor-v2-overview.md)
* [Java](./java-in-process-agent.md)

### Manual instrumentation / SDK (some code changes required)
* [ASP.NET](./asp-net.md)
* [ASP.NET Core](./asp-net-core.md)
* [Node.js](./nodejs.md)
* [Python](./opencensus-python.md)
* [JavaScript - web](./javascript.md)
  * [React](./javascript-react-plugin.md)
  * [React Native](./javascript-react-native-plugin.md)
  * [Angular](./javascript-angular-plugin.md)
* [Windows desktop applications, services, and worker roles](./windows-desktop.md)
* [Universal Windows app](../app/mobile-center-quickstart.md) (App Center)
* [Android](../app/mobile-center-quickstart.md) (App Center)
* [iOS](../app/mobile-center-quickstart.md) (App Center)

> [!NOTE]
> OpenTelemetry-based instrumentation is available in preview for [C#, Node.js, and Python](opentelemetry-enable.md). Review the limitations noted at the beginning of each language's official documentation. If you require a full-feature experience, use the existing Application Insights SDKs.

## Logging frameworks
* [ILogger](./ilogger.md)
* [Log4Net, NLog, or System.Diagnostics.Trace](./asp-net-trace-logs.md)
* [Log4J, Logback, or java.util.logging](./java-in-process-agent.md#autocollected-logs)
* [LogStash plug-in](https://github.com/Azure/azure-diagnostics-tools/tree/master/Logstash/logstash-output-applicationinsights)
* [Azure Monitor](/archive/blogs/msoms/application-insights-connector-in-oms)

## Export and data analysis
* [Power BI](https://powerbi.microsoft.com/blog/explore-your-application-insights-data-with-power-bi/)
* [Power BI for workspace-based resources](../logs/log-powerbi.md)

## Unsupported SDKs
Several other community-supported Application Insights SDKs exist. However, Azure Monitor only provides support when you use the supported instrumentation options listed on this page. We're constantly assessing opportunities to expand our support for other languages. Follow [Azure Updates for Application Insights](https://azure.microsoft.com/updates/?query=application%20insights) for the latest SDK news.
