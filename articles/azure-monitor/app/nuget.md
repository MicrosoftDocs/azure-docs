---
title: Azure Monitor Application Insights NuGet packages
description: Azure Monitor Application Insights NuGet packages lists for ASP.NET, ASP.NET Core, Python
ms.topic: reference
ms.date: 10/16/2018

---

# Application Insights NuGet packages

Below is the current list of stable release NuGet Packages for Application Insights.

## Common packages for ASP.NET

| Package Name | Stable Version | Description | Download |
|-------------------------------|-----------------------|------------|----|
| Microsoft.ApplicationInsights | 2.12.0 | Provides core functionality for transmission of all Application Insights Telemetry Types and is a dependent package for all other Application Insights packages | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights/) |
|Microsoft.ApplicationInsights.Agent.Intercept | 2.4.0 | Enables Interception of method calls | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Agent.Intercept/) |
| Microsoft.ApplicationInsights.DependencyCollector | 2.12.0 | Application Insights Dependency Collector for .NET applications. This is a dependent package for Application Insights platform-specific packages and provides automatic collection of dependency telemetry. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.DependencyCollector/) |
| Microsoft.ApplicationInsights.PerfCounterCollector | 2.12.0 | Application Insights Performance Counters Collector allows you to send data collected by Performance Counters to Application Insights. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.PerfCounterCollector/) |
| Microsoft.ApplicationInsights.Web | 2.12.0 | Application Insights for .NET web applications | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/) |
| Microsoft.ApplicationInsights.WindowsServer | 2.12.0 | Application Insights Windows Server NuGet package provides automatic collection of application insights telemetry for .NET applications. This package can be used as a dependent package for Application Insights platform-specific packages or as a standalone package for .NET applications that are not covered by platform-specific packages (like for .NET worker roles). | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WindowsServer/)  
| Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel | 2.12.0 | Provides a telemetry channel to Application Insights Windows Server SDK that will preserve telemetry in offline scenarios. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel/) |

## Common packages for ASP.NET Core

| Package Name | Stable Version | Description | Download |
|-------------------------------|-----------------------|------------|----|
| Microsoft.ApplicationInsights.AspNetCore | 2.5.0 | Application Insights for ASP.NET Core web applications. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore/) |
| Microsoft.ApplicationInsights | 2.12.0 | This package provides core functionality for transmission of all Application Insights Telemetry Types and is a dependent package for all other Application Insights packages | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights/) |
| Microsoft.ApplicationInsights.DependencyCollector | 2.12.0 | Application Insights Dependency Collector for .NET applications. This is a dependent package for Application Insights platform-specific packages and provides automatic collection of dependency telemetry. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.DependencyCollector/) |
| Microsoft.ApplicationInsights.PerfCounterCollector | 2.12.0 | Application Insights Performance Counters Collector allows you to send data collected by Performance Counters to Application Insights. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.PerfCounterCollector/) |
| Microsoft.ApplicationInsights.WindowsServer | 2.12.0 | Application Insights Windows Server NuGet package provides automatic collection of application insights telemetry for .NET applications. This package can be used as a dependent package for Application Insights platform-specific packages or as a standalone package for .NET applications that are not covered by platform-specific packages (like for .NET worker roles). | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WindowsServer/)  |
| Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel | 2.12.0 | Provides a telemetry channel to Application Insights Windows Server SDK that will preserve telemetry in offline scenarios. | [Download Package](https://www.nuget.org/packages/Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel/) |

## Common packages for Python using OpenCensus
| Package Name | Stable Version | Description | Download |
|-------------------------------|-----------------------|------------|----|
| opencensus-ext-azure | 1.0.0 | Application Insights for Python applications under Azure Monitor via OpenCensus. | [Download Package](https://pypi.org/project/opencensus-ext-azure/) |
| opencensus-ext-django | 0.7.2 | This package provides integration with the Python [django](https://pypi.org/project/django/) library. | [Download Package](https://pypi.org/project/opencensus-ext-django/) |
| opencensus-ext-flask | 0.7.3 | This package provides integration with the Python [flask](https://pypi.org/project/flask/) library. | [Download Package](https://pypi.org/project/opencensus-ext-flask/) |
| opencensus-ext-httplib | 0.7.2 | This package provides integration with the Python [http.client](https://docs.python.org/3/library/http.client.html) library for Python3 and [httplib](https://docs.python.org/2/library/httplib.html) for Python2. | [Download Package](https://pypi.org/project/opencensus-ext-httplib/) |
| opencensus-ext-logging | 0.1.0 | This package enriches log records with trace data. | [Download Package](https://pypi.org/project/opencensus-ext-logging/) |
| opencensus-ext-mysql | 0.1.2 | This package provides integration with the Python [mysql-connector](https://pypi.org/project/mysql-connector/) library. | [Download Package](https://pypi.org/project/opencensus-ext-mysql/) |
| opencensus-ext-postgresql | 0.1.2 | This package provides integration with the Python [psycopg2](https://pypi.org/project/psycopg2/) library. | [Download Package](https://pypi.org/project/opencensus-ext-postgresql/) |
| opencensus-ext-pymongo | 0.7.1 | This package provides integration with the Python [pymongo](https://pypi.org/project/pymongo/) library. | [Download Package](https://pypi.org/project/opencensus-ext-pymongo/) |
| opencensus-ext-pymysql | 0.1.2 | This package provides integration with the Python [PyMySQL](https://pypi.org/project/PyMySQL/) library. | [Download Package](https://pypi.org/project/opencensus-ext-pymysql/) |
| opencensus-ext-pyramid | 0.7.1 | This package provides integration with the Python [pyramid](https://pypi.org/project/pyramid/) library. | [Download Package](https://pypi.org/project/opencensus-ext-pyramid/) |
| opencensus-ext-requests | 0.7.2 | This package provides integration with the Python [requests](https://pypi.org/project/requests/) library. | [Download Package](https://pypi.org/project/opencensus-ext-requests/) |
| opencensus-ext-sqlalchemy | 0.1.2 | This package provides integration with the Python [SQLAlchemy](https://pypi.org/project/SQLAlchemy/) library. | [Download Package](https://pypi.org/project/opencensus-ext-sqlalchemy/) |

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
