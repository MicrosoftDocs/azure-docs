---
title: "Azure Status Monitor v2 API Reference: Enable instrumentation engine | Microsoft Docs"
description: Status Monitor v2 API Reference Enable-InstrumentationEngine. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs or on Azure.
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
# Status Monitor v2 API: Enable-InstrumentationEngine (v0.2.1-alpha)

This document describes a cmdlet that's shipped as a member of the [Az.ApplicationMonitor PowerShell module](https://www.powershellgallery.com/packages/Az.ApplicationMonitor/).

> [!IMPORTANT]
> Status Monitor v2 is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

## Description

This cmdlet will enable the Instrumentation Engine by setting some registry keys.
Restart IIS for these changes to take effect.

The Instrumentation Engine can supplement data collected by the .NET SDKs.
Events and messages will be collected that describe the execution of a managed process. 
Including but not limited to Dependency Result Codes, HTTP Verbs, and SQL Command Text. 

Enable the Instrumentation Engine if:
- You've already enabled monitoring using Enable cmdlet but didn't enable the InstrumentationEngine.
- You've manually instrumented your application with the .NET SDKs and want to collect additional telemetry.

> [!IMPORTANT] 
> This cmdlet requires a PowerShell Session with Administrator permissions.

> [!NOTE] 
> This cmdlet will require you to review and accept our license and privacy statement.

> [!NOTE] 
> The Instrumentation Engine adds additional overhead and is off by default.

## Examples

```powershell
PS C:\> Enable-InstrumentationEngine
```

## Parameters 

### -AcceptLicense
**Optional.** Use this switch to accept the license and privacy statement in headless installations.

### -Verbose
**Common Parameter.** Use this switch to output detailed logs.

## Output


#### Example output from successfully enabling the instrumentation engine

```
Configuring IIS Environment for instrumentation engine...
Configuring registry for instrumentation engine...
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
 - [Get the config](status-monitor-v2-api-get-config.md) to confirm that your settings were recorded correctly.
 - [Get the status](status-monitor-v2-api-get-status.md) to inspect monitoring.
