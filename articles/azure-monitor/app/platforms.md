---
title: 'Application Insights: languages, platforms, and integrations | Microsoft Docs'
description: Languages, platforms, and integrations available for Application Insights
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm
ms.assetid: 974db106-54ff-4318-9f8b-f7b3a869e536
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 07/18/2019
ms.reviewer: olegan
ms.author: mbullwin
---

# Supported languages

* [C#|VB (.NET)](../../azure-monitor/app/asp-net.md)
* [Java](../../azure-monitor/app/java-get-started.md)
* [JavaScript](../../azure-monitor/app/javascript.md)
* [Node.JS](../../azure-monitor/app/nodejs.md)

## Supported platforms and frameworks

### Instrumentation for already-deployed applications (codeless, agent-based)
* [Azure VM and Azure virtual machine scale sets](../../azure-monitor/app/azure-vm-vmss-apps.md)
* [Azure App Service](../../azure-monitor/app/azure-web-apps.md)
* [ASP.NET - for apps that are already live](../../azure-monitor/app/monitor-performance-live-website-now.md)
* [Azure Cloud Services](../../azure-monitor/app/cloudservices.md), including both web and worker roles
* [Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-monitoring)
### Instrumentation through code (SDKs)
* [ASP.NET](../../azure-monitor/app/asp-net.md)
* [ASP.NET Core](../../azure-monitor/app/asp-net-core.md)
* [Android](../../azure-monitor/learn/mobile-center-quickstart.md) (App Center)
* [iOS](../../azure-monitor/learn/mobile-center-quickstart.md) (App Center)
* [Java EE](../../azure-monitor/app/java-get-started.md)
* [Node.JS](https://www.npmjs.com/package/applicationinsights)
* [Universal Windows app](../../azure-monitor/learn/mobile-center-quickstart.md) (App Center)
* [Windows desktop applications, services, and worker roles](../../azure-monitor/app/windows-desktop.md)

## Logging frameworks
* [ILogger](https://docs.microsoft.com/azure/azure-monitor/app/ilogger)
* [Log4Net, NLog, or System.Diagnostics.Trace](../../azure-monitor/app/asp-net-trace-logs.md)
* [Java, Log4J, or Logback](../../azure-monitor/app/java-trace-logs.md)
* [LogStash plugin](https://github.com/Azure/azure-diagnostics-tools/tree/master/Logstash/logstash-output-applicationinsights)
* [Azure Monitor](https://blogs.technet.microsoft.com/msoms/2016/09/26/application-insights-connector-in-oms/)

## Export and data analysis
* [Power BI](https://blogs.msdn.com/b/powerbi/archive/2015/11/04/explore-your-application-insights-data-with-power-bi.aspx)
* [Stream Analytics](../../azure-monitor/app/export-power-bi.md)

## Unsupported SDKs
We're aware that several other community-supported SDKs exist. However, Azure Monitor only provides support when using the supported SDKs listed on this page. We’re constantly assessing opportunities to expand our support for other languages, so follow our [GitHub Announcements](https://github.com/microsoft/ApplicationInsights-Announcements/issues) page to receive the latest SDK news. 
