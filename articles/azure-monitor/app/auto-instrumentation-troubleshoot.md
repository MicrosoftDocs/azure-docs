---
title: Troubleshoot Azure Application Insights auto-instrumentation
description: Troubleshoot auto-instrumentation in Azure Application Insights
ms.topic: conceptual
ms.date: 02/28/2022
---

# Troubleshooting Azure Application Insights auto-instrumentation

This article will help you troubleshoot problems with auto-instrumentation in Azure Application Insights.

> [!NOTE]
>  Auto-instrumentation used to be known as "codeless attach" before October 2021.

## Telemetry data isn't reported after enabling auto-instrumentation

Review these common scenarios if you've enabled Azure Application Insights auto-instrumentation for your app service but don't see telemetry data reported.

### The Application Insights SDK was previously installed

Auto-instrumentation will fail when .NET and .NET Core apps were already instrumented with the SDK.

Remove the Application Insights SDK if you would like to auto-instrument your app.

### An app was published using an unsupported version of .NET or .NET Core

Verify a supported version of .NET or .NET Core was used to build and publish applications.

Refer to the .NET or .NET core documentation to determine if your version is supported.

 - [Application Monitoring for Azure App Service and ASP.NET](azure-web-apps-net.md#application-monitoring-for-azure-app-service-and-aspnet)
- [Application Monitoring for Azure App Service and ASP.NET Core](azure-web-apps-net-core.md#application-monitoring-for-azure-app-service-and-aspnet-core)

### A diagnostics library was detected

Auto-instrumentation will fail if it detects the following libraries.

- System.Diagnostics.DiagnosticSource
- Microsoft.AspNet.TelemetryCorrelation
- Microsoft.ApplicationInsights

These libraries will need to be removed for auto-instrumentation to succeed.

## More help

If you have questions about Azure Application Insights auto-instrumentation, you can post a question in our [Microsoft Q&A question page](/answers/topics/azure-monitor.html).