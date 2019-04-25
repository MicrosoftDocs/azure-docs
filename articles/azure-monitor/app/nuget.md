---
title: Azure Application Insights - Dependency Auto-Collection | Microsoft Docs
description: Application Insights automatically collect and visualize dependencies
services: application-insights
author: mrbullwinkle
manager: carmonm
ms.service: application-insights
ms.workload: TBD
ms.tgt_pltfrm: ibiza
ms.topic: reference
ms.date: 10/16/2018
ms.author: mbullwin
---

# Application Insights NuGet packages

Below is the current list of stable release NuGet Packages for Application Insights.

## Common packages for ASP.NET

| Package Name | Stable Version | Description | Download |
|-------------------------------|-----------------------|------------|----|
| Microsoft.ApplicationInsights | 2.8.0 | Provides core functionality for transmission of all Application Insights Telemetry Types and is a dependent package for all other Application Insights packages | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights/) |
|Microsoft.ApplicationInsights.Agent.Intercept | 2.4.0 | Enables Interception of method calls | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Agent.Intercept/) |
| Microsoft.ApplicationInsights.DependencyCollector | 2.8.0 | Application Insights Dependency Collector for .NET applications. This is a dependent package for Application Insights platform-specific packages and provides automatic collection of dependency telemetry. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.DependencyCollector/) |
| Microsoft.ApplicationInsights.PerfCounterCollector | 2.8.0 | Application Insights Performance Counters Collector allows you to send data collected by Performance Counters to Application Insights. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.PerfCounterCollector/) |
| Microsoft.ApplicationInsights.Web | 2.8.0 | Application Insights for .NET web applications | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/) |
| Microsoft.ApplicationInsights.WindowsServer | 2.8.0 | Application Insights Windows Server NuGet package provides automatic collection of application insights telemetry for .NET applications. This package can be used as a dependent package for Application Insights platform-specific packages or as a standalone package for .NET applications that are not covered by platform-specific packages (like for .NET worker roles). | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WindowsServer/)  
| Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel | 2.8.0 | Provides a telemetry channel to Application Insights Windows Server SDK that will preserve telemetry in offline scenarios. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel/) |

## Common packages for ASP.NET Core

| Package Name | Stable Version | Description | Download |
|-------------------------------|-----------------------|------------|----|
| Microsoft.ApplicationInsights.AspNetCore | 2.5.0 | Application Insights for ASP.NET Core web applications. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore/) |
| Microsoft.ApplicationInsights | 2.8.0 | This package provides core functionality for transmission of all Application Insights Telemetry Types and is a dependent package for all other Application Insights packages | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights/) |
| Microsoft.ApplicationInsights.DependencyCollector | 2.8.0 | Application Insights Dependency Collector for .NET applications. This is a dependent package for Application Insights platform-specific packages and provides automatic collection of dependency telemetry. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.DependencyCollector/) |
| Microsoft.ApplicationInsights.PerfCounterCollector | 2.8.0 | Application Insights Performance Counters Collector allows you to send data collected by Performance Counters to Application Insights. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.PerfCounterCollector/) |
| Microsoft.ApplicationInsights.WindowsServer | 2.8.0 | Application Insights Windows Server NuGet package provides automatic collection of application insights telemetry for .NET applications. This package can be used as a dependent package for Application Insights platform-specific packages or as a standalone package for .NET applications that are not covered by platform-specific packages (like for .NET worker roles). | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WindowsServer/)  |
| Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel | 2.8.0 | Provides a telemetry channel to Application Insights Windows Server SDK that will preserve telemetry in offline scenarios. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel/) |

## Listeners/collectors/appenders

| Package Name | Stable Version | Description | Download |
|-------------------------------|-----------------------|------------|----|
| Microsoft.ApplicationInsights.DiagnosticSourceListener | 2.7.2 |  Allows forwarding events from DiagnosticSource to Application Insights. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.DiagnosticSourceListener/) |
| Microsoft.ApplicationInsights.EventSourceListener | 2.7.2 | Application Insights EventSourceListener allows sending data from EventSource events to Application Insights. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.EventSourceListener/) |
| Microsoft.ApplicationInsights.EtwCollector | 2.7.2 | Application Insights EtwCollector allows sending data from Event Tracing for Windows (ETW) to Application Insights. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.EtwCollector/) |
| Microsoft.ApplicationInsights.TraceListener | 2.7.2 | A custom TraceListener allowing you to send trace log messages to Application Insights. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.TraceListener/) |
| Microsoft.ApplicationInsights.Log4NetAppender | 2.7.2 | A custom appender allowing you to send Log4Net log messages to Application Insights. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Log4NetAppender/)
| Microsoft.ApplicationInsights.NLogTarget | 2.7.2 |  a custom target allowing you to send NLog log messages to Application Insights. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.NLogTarget/)
| Microsoft.ApplicationInsights.SnapshotCollector | 1.3.1 | Monitors exceptions in your application and automatically collects snapshots for offline analysis. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/)

## Service Fabric

| Package Name | Stable Version | Description | Download |
|-------------------------------|-----------------------|------------|----|
| Microsoft.ApplicationInsights.ServiceFabric | 2.2.0 | This package provides automatic decoration of telemetry with the service fabric context the application is running in. Do not use this NuGet for Native Service Fabric applications. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.ServiceFabric/) |
| Microsoft.ApplicationInsights.ServiceFabric.Native | 2.2.0 | Application Insights module for service fabric applications. Use this NuGet only for Native Service Fabric applications. For applications running in containers, use Microsoft.ApplicationInsights.ServiceFabric package. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.ServiceFabric.Native/) |  

## Status monitor

| Package Name | Stable Version | Description | Download |
|-------------------------------|-----------------------|------------|----|
| Microsoft.ApplicationInsights.Agent_x64 | 2.2.1 |  Enables runtime data collection for x64 applications | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Agent_x64/) |
| Microsoft.ApplicationInsights.Agent_x86 | 2.2.1 |  Enables runtime data collection for x86 applications. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Agent_x86/) |

These packages make up part of the core functionality of the runtime monitoring in [Status Monitor](../../azure-monitor/app/monitor-performance-live-website-now.md). You don't need to download these packages directly, just use the Status Monitor installer. If you want to understand more about how these packages work under the hood this [blog post](https://apmtips.com/blog/2016/11/18/how-application-insights-status-monitor-not-monitors-dependencies/) from one of our developers is a good start.

## Additional packages

| Package Name | Stable Version | Description | Download |
|-------------------------------|-----------------------|------------|----|
| Microsoft.ApplicationInsights.AzureWebSites | 2.6.5 | This extension enables the Application Insights monitoring on an Azure App Service. SDK version 2.6.1. Instructions: Add 'APPINSIGHTS_INSTRUMENTATIONKEY' application settings with your ikey and restart the webapp to take an effect.| [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AzureWebSites/) |
| Microsoft.ApplicationInsights.Injector | 2.6.7 | This package contains files required for codeless Application Insights injection | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Injector/) |

## Next steps

- Monitor [ASP.NET Core](../../azure-monitor/app/asp-net-core.md).
- Profile ASP.NET Core [Azure Linux web apps](../../azure-monitor/app/profiler-aspnetcore-linux.md).
- Debug ASP.NET [snapshots](../../azure-monitor/app/snapshot-debugger.md).