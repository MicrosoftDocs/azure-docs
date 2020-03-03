---
title: Azure Application Insights Agent API reference
description: Application Insights Agent API reference. Get-ApplicationInsightsMonitoringConfig. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs, or on Azure.
ms.topic: conceptual
author: TimothyMothra
ms.author: tilee
ms.date: 04/23/2019

---

# Application Insights Agent API: Get-ApplicationInsightsMonitoringConfig

This article describes a cmdlet that's a member of the [Az.ApplicationMonitor PowerShell module](https://www.powershellgallery.com/packages/Az.ApplicationMonitor/).

## Description

Gets the config file and prints the values to the console.

> [!IMPORTANT] 
> This cmdlet requires a PowerShell session with Admin permissions.

## Examples

```powershell
PS C:\> Get-ApplicationInsightsMonitoringConfig
```

## Parameters

No parameters required.

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
 - [Explore metrics](../../azure-monitor/app/metrics-explorer.md) to monitor performance and usage.
- [Search events and logs](../../azure-monitor/app/diagnostic-search.md) to diagnose problems.
- Use [analytics](../../azure-monitor/app/analytics.md) for more advanced queries.
- [Create dashboards](../../azure-monitor/app/overview-dashboard.md).
 
 Add more telemetry:
 - [Create web tests](monitor-web-app-availability.md) to make sure your site stays live.
- [Add web client telemetry](../../azure-monitor/app/javascript.md) to see exceptions from web page code and to enable trace calls.
- [Add the Application Insights SDK to your code](../../azure-monitor/app/asp-net.md) so you can insert trace and log calls.
 
 Do more with Application Insights Agent:
 - Use our guide to [troubleshoot](status-monitor-v2-troubleshoot.md) Application Insights Agent.
 - Make changes to the config by using the [Set config](status-monitor-v2-api-set-config.md) cmdlet.
