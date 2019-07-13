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
ms.date: 07/06/2019
ms.reviewer: olegan
ms.author: mbullwin
---

# Languages - Officially supported by Application Insights team

* [C#|VB (.NET)](../../azure-monitor/app/asp-net.md)
* [Java](../../azure-monitor/app/java-get-started.md)
* [JavaScript web pages](../../azure-monitor/app/javascript.md)
* [Node.JS](../../azure-monitor/app/nodejs.md)

## Languages - Community-supported

There are a number of community-supported Azure Application Insights SDKs, many of which were originally authored by Microsoft. Community-supported SDKs aren't officially maintained by Microsoft. We are unable to provide support for any SDK that isn't on the officially supported list. These SDKs are considered experimental and not recommended for production use.

## Platforms and frameworks
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
* [Android](https://github.com/Microsoft/ApplicationInsights-Android) (App Center)
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
