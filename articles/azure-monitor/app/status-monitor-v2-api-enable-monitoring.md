---
title: "Azure Status Monitor v2 API Reference: Enable monitoring | Microsoft Docs"
description: Status Monitor v2 API Reference Enable-ApplicationInsightsMonitoring. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs or on Azure.
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
# Status Monitor v2 API: Enable-ApplicationInsightsMonitoring (v0.2.1-alpha)

This document describes a cmdlet that's shipped as a member of the [Az.ApplicationMonitor PowerShell module](https://www.powershellgallery.com/packages/Az.ApplicationMonitor/).

> [!IMPORTANT]
> Status Monitor v2 is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

## Description

Enable code-less attach monitoring of IIS applications on a target machine.
This cmdlet will modify the IIS applicationHost.config and set some registry keys.
This cmdlet will also create an applicationinsights.ikey.config, which defines which instrumentation key is used by which application.
IIS will load the RedfieldModule at startup, which will inject the Application Insights SDK into applications as those applications start up.
Restart IIS for your changes to take effect.

After enabling monitoring, we recommend using [Live Metrics](live-stream.md) to quickly observe if your application is sending us telemetry.


> [!NOTE] 
> To get started, you must have an instrumentation key. For more information, read [create new resource](create-new-resource.md#copy-the-instrumentation-key).


> [!IMPORTANT] 
> This cmdlet requires a PowerShell Session with Administrator permissions and with an elevated execution policy. Read [here](status-monitor-v2-detailed-instructions.md#run-powershell-as-administrator-with-an-elevated-execution-policy) for more information.

> [!NOTE] 
> This cmdlet will require you to review and accept our license and privacy statement.


## Examples

### Example with single instrumentation key
In this example, all applications on the current machine will be assigned a single instrumentation key.

```powershell
PS C:\> Enable-ApplicationInsightsMonitoring -InstrumentationKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Example with instrumentation key map
In this example, 
- `MachineFilter` will match the current machine using the `'.*'` wildcard.
- `AppFilter='WebAppExclude'` provides a `null` InstrumentationKey. This app won't be instrumented.
- `AppFilter='WebAppOne'` will assign this specific app a unique instrumentation key.
- `AppFilter='WebAppTwo'` will also assign this specific app a unique instrumentation key.
- Lastly, `AppFilter` also uses the `'.*'` wildcard to match all other web apps not matched by the earlier rules and assigns a default instrumentation key.
- Spaces added for readability only.

```powershell
PS C:\> Enable-ApplicationInsightsMonitoring -InstrumentationKeyMap 
	@(@{MachineFilter='.*';AppFilter='WebAppExclude'},
	  @{MachineFilter='.*';AppFilter='WebAppOne';InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1'},
	  @{MachineFilter='.*';AppFilter='WebAppTwo';InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2'},
	  @{MachineFilter='.*';AppFilter='.*';InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxdefault'})

```


## Parameters 

### -InstrumentationKey
**Required.** Use this parameter to supply a single iKey for use by all applications on the target machine.

### -InstrumentationKeyMap
**Required.** Use this parameter to supply multiple ikeys and a mapping of which apps to use which ikey. 
You can create a single installation script for several machines by setting the MachineFilter. 

> [!IMPORTANT] 
> Applications will match against rules in the order that they're provided. As such you should specify the most specific rules first and the most generic rules last.

#### Schema
`@(@{MachineFilter='.*';AppFilter='.*';InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'})`

- **MachineFilter** is a required c# regex of the computer or vm name.
	- '.*' will match all
	- 'ComputerName' will match only computers with that exact name.
- **AppFilter** is a required c# regex of the computer or vm name.
	- '.*' will match all
	- 'ApplicationName' will match only IIS applications with that exact name.
- **InstrumentationKey** is required to enable monitoring of the applications that match the above two filters.
	- Leave this value null if you wish to define rules to exclude monitoring


### -EnableInstrumentationEngine
**Optional.** Use this switch to enable the Instrumentation Engine to collect events and messages of what is happening to during the execution of a managed process. 
Including but not limited to Dependency Result Codes, HTTP Verbs, and SQL Command Text. 
The Instrumentation Engine will add additional overhead and is off by default.

### -AcceptLicense
**Optional.** Use this switch to accept the license and privacy statement in headless installations.

### -Verbose
**Common Parameter.** Use this switch to output detailed logs.

### -WhatIf 
**Common Parameter.** Use this switch to test and validate your input parameters without actually enabling monitoring.

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
