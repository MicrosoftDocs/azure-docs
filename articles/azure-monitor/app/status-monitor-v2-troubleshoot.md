---
title: Azure Status Monitor v2 troubleshooting and known issues | Microsoft Docs
description: The known issues of Status Monitor v2 and troubleshooting examples. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs, or on Azure.
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
# Troubleshooting Status Monitor v2

When you enable monitoring, you might experience issues that prevent data collection.
This article lists all known issues and provides troubleshooting examples.
If you come across an issue not listed here, you can contact us [on GitHub](https://github.com/Microsoft/ApplicationInsights-Home/issues).


> [!IMPORTANT]
> Status Monitor v2 is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Some features might not be supported, and some might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Known issues

### Conflicting DLLs in an app's bin directory

If any of these DLLs are present in the bin directory, monitoring might fail:

- Microsoft.ApplicationInsights.dll
- Microsoft.AspNet.TelemetryCorrelation.dll
- System.Diagnostics.DiagnosticSource.dll

Some of these DLLs are included in the Visual Studio default app templates, even if your app doesn't use them.
You can use troubleshooting tools to see symptomatic behavior:

- PerfView:
	```
	ThreadID="7,500" 
	ProcessorNumber="0" 
	msg="Found 'System.Diagnostics.DiagnosticSource, Version=4.0.2.1, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51' assembly, skipping attaching redfield binaries" 
	ExtVer="2.8.13.5972" 
	SubscriptionId="" 
	AppName="" 
	FormattedMessage="Found 'System.Diagnostics.DiagnosticSource, Version=4.0.2.1, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51' assembly, skipping attaching redfield binaries" 
	```

- IISReset + app load (NO TELEMETRY). Investigate with Sysinternals (Handle.exe and ListDLLs.exe)
	```
	.\handle64.exe -p w3wp | findstr /I "InstrumentationEngine AI. ApplicationInsights"
	E54: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.dll

	.\Listdlls64.exe w3wp | findstr /I "InstrumentationEngine AI ApplicationInsights"
	0x0000000009be0000  0x127000  C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation64\MicrosoftInstrumentationEngine_x64.dll
	0x0000000009b90000  0x4f000   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation64\Microsoft.ApplicationInsights.ExtensionsHost_x64.dll
	0x0000000004d20000  0xb2000   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation64\Microsoft.ApplicationInsights.Extensions.Base_x64.dll
	```

### Conflict with IIS shared configuration

If you have a cluster of web servers, you might be using a [Shared Configuration](https://docs.microsoft.com/iis/web-hosting/configuring-servers-in-the-windows-web-platform/shared-configuration_211). 
We can't automatically inject our HttpModule into this shared config.
Each web server must first run the Enable command to install our DLL into its GAC.

After you run the Enable command, 
1. browse to your Shared Configuration directory and find your `applicationHost.config` file.
2. Add this line to your configuration in the modules section:
	```
	<modules>
	    <!-- Registered global managed http module handler. The 'Microsoft.AppInsights.IIS.ManagedHttpModuleHelper.dll' must be installed in the GAC before this config is applied. -->
	    <add name="ManagedHttpModuleHelper" type="Microsoft.AppInsights.IIS.ManagedHttpModuleHelper.ManagedHttpModuleHelper, Microsoft.AppInsights.IIS.ManagedHttpModuleHelper, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" preCondition="managedHandler,runtimeVersionv4.0" />
	</modules>
	```
	


## Troubleshooting
	
### Troubleshooting PowerShell

#### How to inspect what modules are available?
You can audit installed Modules using the command: `Get-Module -ListAvailable`

#### How to import a module into the current session?
If the Module hasn't been loaded into a PowerShell session, can manually load using the command: `Import-Module <path to psd1>`


### Troubleshooting the Status Monitor v2 module

#### How to review what commands are available in the Status Monitor v2 module?
- Run the command: `Get-Command -Module Az.ApplicationMonitor` to get the available commands:

	```
	CommandType     Name                                               Version    Source
	-----------     ----                                               -------    ------
	Cmdlet          Disable-ApplicationInsightsMonitoring              0.2.1      Az.ApplicationMonitor
	Cmdlet          Disable-InstrumentationEngine                      0.2.1      Az.ApplicationMonitor
	Cmdlet          Enable-ApplicationInsightsMonitoring               0.2.1      Az.ApplicationMonitor
	Cmdlet          Enable-InstrumentationEngine                       0.2.1      Az.ApplicationMonitor
	Cmdlet          Get-ApplicationInsightsMonitoringConfig            0.2.1      Az.ApplicationMonitor
	Cmdlet          Get-ApplicationInsightsMonitoringStatus            0.2.1      Az.ApplicationMonitor
	Cmdlet          Set-ApplicationInsightsMonitoringConfig            0.2.1      Az.ApplicationMonitor
	```

#### What is the current version of the Status Monitor v2 module?
- Run the command: `Get-ApplicationInsightsMonitoringStatus` to get an output of information about this module:
    - PowerShell module version
    - Application Insights SDK version
    - File paths of PowerShell module
    
Review our [API Reference](status-monitor-v2-api-get-status.md) for a detailed description of how to use this cmdlet.



### Troubleshooting running processes

You can inspect the process on the instrumented machine to see if all DLLs are loaded.
If monitoring is working, at least 12 DLLS should be loaded.

- Cmd: `Get-ApplicationInsightsMonitoringStatus -InspectProcess`

Review our [API Reference](status-monitor-v2-api-get-status.md) for a detailed description of how to use this cmdlet.


### Collect ETW logs with PerfView

#### Setup

1. Download PerfView.exe and PerfView64.exe from https://github.com/Microsoft/perfview/releases
2. Launch PerfView64.exe
3. Expand "Advanced Options"
4. Uncheck:
	- Zip
	- Merge
	- .NET Symbol Collection
5. Set Additional Providers: `61f6ca3b-4b5f-5602-fa60-759a2a2d1fbd,323adc25-e39b-5c87-8658-2c1af1a92dc5,925fa42b-9ef6-5fa7-10b8-56449d7a2040,f7d60e07-e910-5aca-bdd2-9de45b46c560,7c739bb9-7861-412e-ba50-bf30d95eae36,61f6ca3b-4b5f-5602-fa60-759a2a2d1fbd,323adc25-e39b-5c87-8658-2c1af1a92dc5,252e28f4-43f9-5771-197a-e8c7e750a984`


#### Collecting logs

1. In a cmd console with admin privileges, execute `iisreset /stop` To turn off IIS and all web apps.
2. In PerfView, click "Start Collection"
3. In a cmd console with admin privileges, execute `iisreset /start` To start IIS.
4. Try to browse to your app.
5. After your app finishes loading, return to PerfView and click "Stop Collection"



## Next steps

- Review our [API Reference](status-monitor-v2-overview.md#powershell-api-reference) to find a parameter you might have missed.
- If you come across an issue not listed here, you may contact us [here](https://github.com/Microsoft/ApplicationInsights-Home/issues).
