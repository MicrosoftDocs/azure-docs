---
title: 'Application Insights: languages, platforms, and integrations | Microsoft Docs'
description: Languages, platforms, and integrations available for Application Insights
ms.topic: conceptual
ms.date: 07/18/2019

ms.reviewer: olegan
---

# Supported languages

* [C#|VB (.NET)](./asp-net.md)
* [Java](./java-get-started.md)
* [JavaScript](./javascript.md)
* [Node.JS](./nodejs.md)
* [Python](./opencensus-python.md)

## Supported platforms and frameworks

### Instrumentation for already-deployed applications (codeless, agent-based)
* [Azure VM and Azure virtual machine scale sets](./azure-vm-vmss-apps.md)
* [Azure App Service](./azure-web-apps.md)
* [ASP.NET - for apps that are already live](./monitor-performance-live-website-now.md)
* [Azure Cloud Services](./cloudservices.md), including both web and worker roles
* [Azure Functions](../../azure-functions/functions-monitoring.md)
### Instrumentation through code (SDKs)
* [ASP.NET](./asp-net.md)
* [ASP.NET Core](./asp-net-core.md)
* [Android](../app/mobile-center-quickstart.md) (App Center)
* [iOS](../app/mobile-center-quickstart.md) (App Center)
* [Java EE](./java-get-started.md)
* [Node.JS](https://www.npmjs.com/package/applicationinsights)
* [Python](./opencensus-python.md)
* [Universal Windows app](../app/mobile-center-quickstart.md) (App Center)
* [Windows desktop applications, services, and worker roles](./windows-desktop.md)
* [React](./javascript-react-plugin.md)
* [React Native](./javascript-react-native-plugin.md)

## Logging frameworks
* [ILogger](./ilogger.md)
* [Log4Net, NLog, or System.Diagnostics.Trace](./asp-net-trace-logs.md)
* [Java, Log4J, or Logback](./java-trace-logs.md)
* [LogStash plugin](https://github.com/Azure/azure-diagnostics-tools/tree/master/Logstash/logstash-output-applicationinsights)
* [Azure Monitor](/archive/blogs/msoms/application-insights-connector-in-oms)

## Export and data analysis
* [Power BI](https://powerbi.microsoft.com/blog/explore-your-application-insights-data-with-power-bi/)
* [Stream Analytics](./export-power-bi.md)

## Unsupported SDKs
We're aware that several other community-supported SDKs exist. However, Azure Monitor only provides support when using the supported SDKs listed on this page. We're constantly assessing opportunities to expand our support for other languages, so follow our [GitHub Announcements](https://github.com/microsoft/ApplicationInsights-Announcements/issues) page to receive the latest SDK news. 

