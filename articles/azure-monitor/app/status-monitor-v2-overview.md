---
title: Azure Status Monitor v2 overview | Microsoft Docs
description: An overview of Status Monitor v2. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs or on Azure.
services: application-insights
documentationcenter: .net
author: MS-TimothyMothra
manager: alexklim
ms.assetid: 769a5ea4-a8c6-4c18-b46c-657e864e24de
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 04/23/2019
ms.author: tilee
---
# Status Monitor v2

Status Monitor v2 is a PowerShell Module published to the [PowerShellGallery](https://www.powershellgallery.com/packages/Az.ApplicationMonitor) 
and is the replacement for [Status Monitor](https://docs.microsoft.com/azure/azure-monitor/app/monitor-performance-live-website-now). 
This module provides code-less instrumentation of .NET web applications hosted with IIS.
Telemetry will be sent to the Azure portal where you can [monitor](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview) your application.

> [!IMPORTANT]
> Status Monitor v2 is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

## PowerShell Gallery

https://www.powershellgallery.com/packages/Az.ApplicationMonitor


## Instructions
- Review our [getting started instructions](status-monitor-v2-get-started.md) to get started now with concise code samples.
- Review our [detailed instructions](status-monitor-v2-detailed-instructions.md) for a deep dive on how to get started.

## PowerShell API reference
- [Disable-ApplicationInsightsMonitoring](status-monitor-v2-api-disable-monitoring.md)
- [Disable-InstrumentationEngine](status-monitor-v2-api-disable-instrumentation-engine.md)
- [Enable-ApplicationInsightsMonitoring](status-monitor-v2-api-enable-monitoring.md)
- [Enable-InstrumentationEngine](status-monitor-v2-api-enable-instrumentation-engine.md)
- [Get-ApplicationInsightsMonitoringConfig](status-monitor-v2-api-get-config.md)
- [Get-ApplicationInsightsMonitoringStatus](status-monitor-v2-api-get-status.md)
- [Set-ApplicationInsightsMonitoringConfig](status-monitor-v2-api-set-config.md)

## Troubleshooting
- [Troubleshooting](status-monitor-v2-troubleshoot.md)
- [Known Issues](status-monitor-v2-troubleshoot.md#known-issues)


## FAQ

- Does Status Monitor v2 support proxy installations?

  **Yes**. You have multiple options to download Status Monitor v2. 
If your computer has internet access, you can onboard to the PowerShell Gallery using `-Proxy` parameters. 
You can also manually download this module and either install it on your machine or use the module directly. 
Each of these options is described in our [Detailed Instructions](status-monitor-v2-detailed-instructions.md).
  
- How to verify the enablement was successful?

   We don't have a cmdlet to verify that enablement was successful. 
We recommend using [Live Metrics](https://docs.microsoft.com/azure/azure-monitor/app/live-stream) to quickly observe if your application is sending us telemetry.

   You can also use [Analytics](../log-query/get-started-portal.md) to list all the cloud roles currently sending telemetry.
   ```Kusto
   union * | summarize count() by cloud_RoleName, cloud_RoleInstance
   ```

## Next steps

View your telemetry:

* [Explore metrics](../../azure-monitor/app/metrics-explorer.md) to monitor performance and usage
* [Search events and logs](../../azure-monitor/app/diagnostic-search.md) to diagnose problems
* [Analytics](../../azure-monitor/app/analytics.md) for more advanced queries
* [Create dashboards](../../azure-monitor/app/overview-dashboard.md)

Add more telemetry:

* [Create web tests](monitor-web-app-availability.md) to make sure your site stays live.
* [Add web client telemetry](../../azure-monitor/app/javascript.md) to see exceptions from web page code and to let you insert trace calls.
* [Add Application Insights SDK to your code](../../azure-monitor/app/asp-net.md) so that you can insert trace and log calls

