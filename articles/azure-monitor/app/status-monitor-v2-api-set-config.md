---
title: "Azure Status Monitor v2 API reference: Set config | Microsoft Docs"
description: Status Monitor v2 API reference. Set-ApplicationInsightsMonitoringConfig. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs, or on Azure.
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
# Status Monitor v2 API: Set-ApplicationInsightsMonitoringConfig (v0.4.0-alpha)

This document describes a cmdlet that's a member of the [Az.ApplicationMonitor PowerShell module](https://www.powershellgallery.com/packages/Az.ApplicationMonitor/).

> [!IMPORTANT]
> Status Monitor v2 is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Some features might not be supported, and some might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Description

Sets the config file without doing a full reinstallation.
Restart IIS for your changes to take effect.

> [!IMPORTANT] 
> This cmdlet requires a PowerShell session with Admin permissions.


## Examples

### Example with a single instrumentation key
In this example, all apps on the current computer will be assigned a single instrumentation key.

```powershell
PS C:\> Enable-ApplicationInsightsMonitoring -InstrumentationKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Example with an instrumentation key map
In this example:
- `MachineFilter` matches the current computer by using the `'.*'` wildcard.
- `AppFilter='WebAppExclude'` provides a `null` instrumentation key. The specified app won't be instrumented.
- `AppFilter='WebAppOne'` assigns the specified app a unique instrumentation key.
- `AppFilter='WebAppTwo'` assigns the specified app a unique instrumentation key.
- Finally, `AppFilter` also uses the `'.*'` wildcard to match all web apps that aren't matched by the earlier rules and assign a default instrumentation key.
- Spaces are added for readability.

```powershell
PS C:\> Enable-ApplicationInsightsMonitoring -InstrumentationKeyMap 
	@(@{MachineFilter='.*';AppFilter='WebAppExclude'},
	  @{MachineFilter='.*';AppFilter='WebAppOne';InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1'},
	  @{MachineFilter='.*';AppFilter='WebAppTwo';InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2'},
	  @{MachineFilter='.*';AppFilter='.*';InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxdefault'})

```


## Parameters

### -InstrumentationKey
**Required.** Use this parameter to supply a single instrumentation key for use by all apps on the target computer.

### -InstrumentationKeyMap
**Required.** Use this parameter to supply multiple instrumentation keys and a mapping of the instrumentation keys used by each app.
You can create a single installation script for several computers by setting `MachineFilter`.

> [!IMPORTANT]
> Apps will match against rules in the order that the rules are provided. So you should specify the most specific rules first and the most generic rules last.

#### Schema
`@(@{MachineFilter='.*';AppFilter='.*';InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'})`

- **MachineFilter** is a required C# regex of the computer or VM name.
	- '.*' will match all
	- 'ComputerName' will match only computers with the specified name.
- **AppFilter** is a required C# regex of the computer or VM name.
	- '.*' will match all
	- 'ApplicationName' will match only IIS apps with the specified name.
- **InstrumentationKey** is required to enable monitoring of the apps that match the preceding two filters.
	- Leave this value null if you want to define rules to exclude monitoring.


### -Verbose
**Common parameter.** Use this switch to display detailed logs.


## Output

By default, no output.

#### Example verbose output from setting the config file via -InstrumentationKey

```
VERBOSE: Operation: InstallWithIkey
VERBOSE: InstrumentationKeyMap parsed:
Filters:
0)InstrumentationKey: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx AppFilter: .* MachineFilter: .*
VERBOSE: set config file
VERBOSE: Config File Path:
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\applicationInsights.ikey.config
```

#### Example verbose output from setting the config file via -InstrumentationKeyMap

```
VERBOSE: Operation: InstallWithIkeyMap
VERBOSE: InstrumentationKeyMap parsed:
Filters:
0)InstrumentationKey:  AppFilter: WebAppExclude MachineFilter: .*
1)InstrumentationKey: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2 AppFilter: WebAppTwo MachineFilter: .*
2)InstrumentationKey: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxdefault AppFilter: .* MachineFilter: .*
VERBOSE: set config file
VERBOSE: Config File Path:
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\applicationInsights.ikey.config
```

## Next steps

  View your telemetry:
 - [Explore metrics](../../azure-monitor/app/metrics-explorer.md) to monitor performance and usage.
- [Search events and logs](../../azure-monitor/app/diagnostic-search.md) to diagnose problems.
- [Use Analytics](../../azure-monitor/app/analytics.md) for more advanced queries.
- [Create dashboards](../../azure-monitor/app/overview-dashboard.md).
 
 Add more telemetry:
 - [Create web tests](monitor-web-app-availability.md) to make sure your site stays live.
- [Add web client telemetry](../../azure-monitor/app/javascript.md) to see exceptions from web page code and to enable trace calls.
- [Add the Application Insights SDK to your code](../../azure-monitor/app/asp-net.md) so you can insert trace and log calls
 
 Do more with Status Monitor v2:
 - Use our guide to [troubleshoot](status-monitor-v2-troubleshoot.md) Status Monitor v2.
 - [Get the config](status-monitor-v2-api-get-config.md) to confirm that your settings were recorded correctly.
 - [Get the status](status-monitor-v2-api-get-status.md) to inspect monitoring.
