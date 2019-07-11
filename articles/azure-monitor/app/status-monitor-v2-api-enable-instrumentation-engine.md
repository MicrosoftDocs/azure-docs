---
title: "Azure Status Monitor v2 API reference: Enable instrumentation engine | Microsoft Docs"
description: Status Monitor v2 API reference. Enable-InstrumentationEngine. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs, or on Azure.
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
# Status Monitor v2 API: Enable-InstrumentationEngine (v0.4.0-alpha)

This article describes a cmdlet that's a member of the [Az.ApplicationMonitor PowerShell module](https://www.powershellgallery.com/packages/Az.ApplicationMonitor/).

> [!IMPORTANT]
> Status Monitor v2 is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Some features might not be supported, and some might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Description

Enables the instrumentation engine by setting some registry keys.
Restart IIS for the changes to take effect.

The instrumentation engine can supplement data collected by the .NET SDKs.
It collects events and messages that describe the execution of a managed process. These events and messages include dependency result codes, HTTP verbs, and SQL command text.

Enable the instrumentation engine if:
- You've already enabled monitoring with the Enable cmdlet but didn't enable the instrumentation engine.
- You've manually instrumented your app with the .NET SDKs and want to collect additional telemetry.

> [!IMPORTANT] 
> This cmdlet requires a PowerShell session with Admin permissions.

> [!NOTE] 
> - This cmdlet requires that you review and accept our license and privacy statement.
> - The instrumentation engine adds additional overhead and is off by default.

## Examples

```powershell
PS C:\> Enable-InstrumentationEngine
```

## Parameters

### -AcceptLicense
**Optional.** Use this switch to accept the license and privacy statement in headless installations.

### -Verbose
**Common parameter.** Use this switch to output detailed logs.

## Output


#### Example output from successfully enabling the instrumentation engine

```
Configuring IIS Environment for instrumentation engine...
Configuring registry for instrumentation engine...
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
 
 Do more with Status Monitor v2:
 - Use our guide to [troubleshoot](status-monitor-v2-troubleshoot.md) Status Monitor v2.
 - [Get the config](status-monitor-v2-api-get-config.md) to confirm that your settings were recorded correctly.
 - [Get the status](status-monitor-v2-api-get-status.md) to inspect monitoring.
