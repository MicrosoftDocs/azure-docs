---
title: "Azure Status Monitor v2 API Reference: Get config | Microsoft Docs"
description: Status Monitor v2 API Reference Get-ApplicationInsightsMonitoringConfig. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs or on Azure.
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
# Status Monitor v2 API: Get-ApplicationInsightsMonitoringConfig (v0.2.1-alpha)

This document describes a cmdlet that's shipped as a member of the [Az.ApplicationMonitor PowerShell module](https://www.powershellgallery.com/packages/Az.ApplicationMonitor/).

> [!IMPORTANT]
> Status Monitor v2 is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

## Description

Get the config file and print the values to the console.

> [!IMPORTANT] 
> This cmdlet requires a PowerShell Session with Administrator permissions.

## Examples

```powershell
PS C:\> Get-ApplicationInsightsMonitoringConfig
```

## Parameters 

(No Parameters Required)

## Output


#### Example output from reading the config file

```
RedfieldConfiguration:
Filters:
0)InstrumentationKey:  AppFilter: WebAppExclude MachineFilter: .*
1)InstrumentationKey: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2 AppFilter: WebAppTwo MachineFilter: .*
2)InstrumentationKey: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxdefault AppFilter: .* MachineFilter: .*
```

## Next steps

  View your telemetry:
 - [Explore metrics](../../azure-monitor/app/metrics-explorer.md) to monitor performance and usage
- [Search events and logs](../../azure-monitor/app/diagnostic-search.md) to diagnose problems
- [Analytics](../../azure-monitor/app/analytics.md) for more advanced queries
- [Create dashboards](../../azure-monitor/app/overview-dashboard.md)
 
 Add more telemetry:
 - [Create web tests](monitor-web-app-availability.md) to make sure your site stays live.
- [Add web client telemetry](../../azure-monitor/app/javascript.md) to see exceptions from web page code and to let you insert trace calls.
- [Add Application Insights SDK to your code](../../azure-monitor/app/asp-net.md) so that you can insert trace and log calls
 
 Do more with Status Monitor v2:
 - Use our guide to [Troubleshoot](status-monitor-v2-troubleshoot.md) Status Monitor v2.
 - Make changes to this config using the [Set config](status-monitor-v2-api-set-config.md) cmdlet.
