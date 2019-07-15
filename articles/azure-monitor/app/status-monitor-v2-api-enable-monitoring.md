---
title: "Azure Status Monitor v2 API reference: Enable monitoring | Microsoft Docs"
description: Status Monitor v2 API reference. Enable-ApplicationInsightsMonitoring. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs, or on Azure.
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
# Status Monitor v2 API: Enable-ApplicationInsightsMonitoring (v0.4.0-alpha)

This article describes a cmdlet that's a member of the [Az.ApplicationMonitor PowerShell module](https://www.powershellgallery.com/packages/Az.ApplicationMonitor/).

> [!IMPORTANT]
> Status Monitor v2 is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Some features might not be supported, and some might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Description

Enables codeless attach monitoring of IIS apps on a target computer.

This cmdlet will modify the IIS applicationHost.config and set some registry keys.
It will also create an applicationinsights.ikey.config file, which defines the instrumentation key used by each app.
IIS will load the RedfieldModule on startup, which will inject the Application Insights SDK into applications as the applications start.
Restart IIS for your changes to take effect.

After you enable monitoring, we recommend that you use [Live Metrics](live-stream.md) to quickly check if your app is sending us telemetry.


> [!NOTE] 
> - To get started, you need an instrumentation key. For more information, see [Create a resource](create-new-resource.md#copy-the-instrumentation-key).
> - This cmdlet requires that you review and accept our license and privacy statement.

> [!IMPORTANT] 
> This cmdlet requires a PowerShell session with Admin permissions and an elevated execution policy. For more information, see [Run PowerShell as administrator with an elevated execution policy](status-monitor-v2-detailed-instructions.md#run-powershell-as-admin-with-an-elevated-execution-policy).

## Examples

### Example with a single instrumentation key
In this example, all apps on the current computer are assigned a single instrumentation key.

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
	  @{MachineFilter='.*';AppFilter='WebAppOne';InstrumentationSettings=@{InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1'}},
	  @{MachineFilter='.*';AppFilter='WebAppTwo';InstrumentationSettings=@{InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2'}},
	  @{MachineFilter='.*';AppFilter='.*';InstrumentationSettings=@{InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxdefault'}})

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
`@(@{MachineFilter='.*';AppFilter='.*';InstrumentationSettings=@{InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'}})`

- **MachineFilter** is a required C# regex of the computer or VM name.
	- '.*' will match all
	- 'ComputerName' will match only computers with the exact name specified.
- **AppFilter** is a required C# regex of the IIS Site Name. You can get a list of sites on your server by running the command [get-iissite](https://docs.microsoft.com/powershell/module/iisadministration/get-iissite).
	- '.*' will match all
	- 'SiteName' will match only the IIS Site with the exact name specified.
- **InstrumentationKey** is required to enable monitoring of apps that match the preceding two filters.
	- Leave this value null if you want to define rules to exclude monitoring.


### -EnableInstrumentationEngine
**Optional.** Use this switch to enable the instrumentation engine to collect events and messages about what's happening during the execution of a managed process. These events and messages include dependency result codes, HTTP verbs, and SQL command text.

The instrumentation engine adds overhead and is off by default.

### -AcceptLicense
**Optional.** Use this switch to accept the license and privacy statement in headless installations.

### -IgnoreSharedConfig
When you have a cluster of web servers, you might be using a [shared configuration](https://docs.microsoft.com/iis/web-hosting/configuring-servers-in-the-windows-web-platform/shared-configuration_211).
The HttpModule can't be injected into this shared configuration.
This script will fail with the message that extra installation steps are required.
Use this switch to ignore this check and continue installing prerequisites. 
For more information, see [known conflict-with-iis-shared-configuration](status-monitor-v2-troubleshoot.md#conflict-with-iis-shared-configuration)

### -Verbose
**Common parameter.** Use this switch to display detailed logs.

### -WhatIf 
**Common parameter.** Use this switch to test and validate your input parameters without actually enabling monitoring.

## Output


#### Example output from a successful enablement

```
Initiating Disable Process
Applying transformation to 'C:\Windows\System32\inetsrv\config\applicationHost.config'
'C:\Windows\System32\inetsrv\config\applicationHost.config' backed up to 'C:\Windows\System32\inetsrv\config\applicationHost.config.backup-2019-03-26_08-59-52z'
in :1,237
No element in the source document matches '/configuration/location[@path='']/system.webServer/modules/add[@name='ManagedHttpModuleHelper']'
Not executing RemoveAll (transform line 1, 546)
Transformation to 'C:\Windows\System32\inetsrv\config\applicationHost.config' was successfully applied. Operation: 'disable'
GAC Module will not be removed, since this operation might cause IIS instabilities
Configuring IIS Environment for codeless attach...
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\IISADMIN[Environment]
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\W3SVC[Environment]
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WAS[Environment]
Configuring IIS Environment for instrumentation engine...
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\IISADMIN[Environment]
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\W3SVC[Environment]
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WAS[Environment]
Configuring registry for instrumentation engine...
Successfully disabled Application Insights Status Monitor
Installing GAC module 'C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\0.2.0\content\Runtime\Microsoft.AppInsights.IIS.ManagedHttpModuleHelper.dll'
Applying transformation to 'C:\Windows\System32\inetsrv\config\applicationHost.config'
Found GAC module Microsoft.AppInsights.IIS.ManagedHttpModuleHelper.ManagedHttpModuleHelper, Microsoft.AppInsights.IIS.ManagedHttpModuleHelper, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35
'C:\Windows\System32\inetsrv\config\applicationHost.config' backed up to 'C:\Windows\System32\inetsrv\config\applicationHost.config.backup-2019-03-26_08-59-52z_1'
Transformation to 'C:\Windows\System32\inetsrv\config\applicationHost.config' was successfully applied. Operation: 'enable'
Configuring IIS Environment for codeless attach...
Configuring IIS Environment for instrumentation engine...
Configuring registry for instrumentation engine...
Updating app pool permissions...
Successfully enabled Application Insights Status Monitor
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
- [Add the Application Insights SDK to your code](../../azure-monitor/app/asp-net.md) so you can insert trace and log calls.
 
 Do more with Status Monitor v2:
 - Use our guide to [troubleshoot](status-monitor-v2-troubleshoot.md) Status Monitor v2.
 - [Get the config](status-monitor-v2-api-get-config.md) to confirm that your settings were recorded correctly.
 - [Get the status](status-monitor-v2-api-get-status.md) to inspect monitoring.
