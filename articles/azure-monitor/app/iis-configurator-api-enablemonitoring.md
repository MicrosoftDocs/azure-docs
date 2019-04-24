---
title: IIS Configurator | Microsoft Docs
description: Monitor a website's performance without redeploying it. Works with ASP.NET web apps hosted on-premises, in VMs or on Azure.
services: application-insights
documentationcenter: .net
author: tilee
manager: alexklim
ms.assetid: 769a5ea4-a8c6-4c18-b46c-657e864e24de
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 04/23/2019
ms.author: tilee
---
# IISConfigurator API Reference

## Disclaimer
This module is a prototype application, and is not recommended for your production environments.

# Enable-ApplicationInsightsMonitoring (v0.2.0-alpha)

**IMPORTANT**: This cmdlet must be run in a PowerShell Session with Administrator permissions and with Elevated Execution Policies. Read [here](iis-configurator-detailed-instructions.md#run-powershell-as-administrator-with-elevated-execution-policies) for more information.

**NOTE**: This cmdlet will require you to review and accept our license and privacy statement.

## Description

Enable code-less attach monitoring of IIS applications on a target machine.
This will modify the IIS applicationHost.config and set some registry keys.
This will also create an applicationinsights.ikey.config which defines which instrumentation key is used by which application.
IIS will load the RedfieldModule at startup which will inject the Application Insights SDK into applications as those applications start up.
You will need to restart IIS for your changes to take effect.

As of v0.2.0-alpha, we don't have a setting to verify that enablement was successful. 
We recommend using [Live Metrics](live-stream.md) to quickly observe if your application is sending us telemetry.


**NOTE**: To get started you must have an instrumentation key. Read [here](create-new-resource.md#copy-the-instrumentation-key) for more information.


## Examples

### Example with single instrumentation key
In this example, all applications on the current machine will be assigned a single instrumentation key.

```powershell
PS C:\> Enable-ApplicationInsightsMonitoring -InstrumentationKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Example with instrumentation key map
In this example, 
- `MachineFilter` will match the current machine using the `'.*'` wildcard.
- `AppFilter='WebAppExclude'` provides a `null` InstrumentationKey. This app will not be instrumented.
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
**Required.** Use this parameter to supply multiple ikeys and a mapping of which apps to use which ikey. Using this, you can create a single installation script for several machines by setting the MachineFilter. 

**IMPORTANT:** Applications will match aganist rules in the order that they are provided. As such you should specify the most specific rules first and the most generic rules last.

#### Schema
`@(@{MachineFilter='.*';AppFilter='.*';InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'})`

**Required**:
- MachineFilter is a required c# regex of the computer or vm name.
	- '.*' will match all
	- 'ComputerName' will match only computers with that exact name.
- AppFilter is a required c# regex of the computer or vm name.
	- '.*' will match all
	- 'ApplicationName' will match only IIS applications with that exact name.

**Optional**: 
- InstrumentationKey
	- InstrumentationKey is required to enable monitoring of the applications that match the above two filters.
	- Leave this null if you wish to define rules to exclude monitoring


### -EnableInstrumentationEngine
**Optional.** Use this switch to enable the Instrumentation Engine to collect events and messages of what is happening to during the execution of a managed process. Including but not limited to Dependency Result Codes, HTTP Verbs, and SQL Command Text. This adds additional overhead and is therefore off by default.

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
Installing GAC module 'C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\0.2.0\content\Runtime\Microsoft.AppInsights.IIS.ManagedHttpModuleHelper.dll'
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

