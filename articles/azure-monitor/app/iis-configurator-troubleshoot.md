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
# IISConfigurator Troubleshooting

## Disclaimer
This module is a prototype application, and isn't recommended for your production environments.

## Known Issues

### Conflicting DLLs in an application's bin directory

If any of these dlls are present in the bin directory, attach may fail.

- Microsoft.ApplicationInsights.dll
- Microsoft.AspNet.TelemetryCorrelation.dll
- System.Diagnostics.DiagnosticSource.dll

Some of these DLLs are included in Visual Studio's default application templates, even if your application doesn't use them.
Symptomatic behavior can be seen using troubleshooting tools:

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

- iisreset + app load (NO TELEMETRY). Investigate with Sysinternals (Handle.exe and ListDLLs.exe)
	```
	.\handle64.exe -p w3wp | findstr /I "InstrumentationEngine AI. ApplicationInsights"
	E54: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.dll

	.\Listdlls64.exe w3wp | findstr /I "InstrumentationEngine AI ApplicationInsights"
	0x0000000009be0000  0x127000  C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\content\Instrumentation64\MicrosoftInstrumentationEngine_x64.dll
	0x0000000009b90000  0x4f000   C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\content\Instrumentation64\Microsoft.ApplicationInsights.ExtensionsHost_x64.dll
	0x0000000004d20000  0xb2000   C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\content\Instrumentation64\Microsoft.ApplicationInsights.Extensions.Base_x64.dll
	```

### Conflict with IIS Shared Configuration

If you have a cluster of web servers, you might be using a [Shared Configuration](https://docs.microsoft.com/en-us/iis/web-hosting/configuring-servers-in-the-windows-web-platform/shared-configuration_211). 
We can't automatically inject our HttpModule into this shared config.
Each web server must first run the Enable command to install our DLL into its GAC.

After you run the Enable command, 
- browse to your Shared Configuration directory and find your `applicationHost.config` file.
- Add this line to your configuration:
	```
	<modules>
	    ...
	    <!-- Registered global managed http module handler. The 'Microsoft.AppInsights.IIS.ManagedHttpModuleHelper.dll' must be installed in the GAC before this config is applied. -->
	    <add name="ManagedHttpModuleHelper" type="Microsoft.AppInsights.IIS.ManagedHttpModuleHelper.ManagedHttpModuleHelper, Microsoft.AppInsights.IIS.ManagedHttpModuleHelper, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" preCondition="managedHandler,runtimeVersionv4.0" />
	</modules>
	```
	


## Troubleshooting
	
### Troubleshooting PowerShell

Can audit installed Modules using cmd: `Get-Module -ListAvailable`


### Troubleshooting PowerShell Module


- If the Module hasn't been loaded into a PowerShell session, can manually load using the command `Import-Module <path to psd1>`


- Run the cmd: `Get-Command -Module microsoft.applicationinsights.iisconfigurator` to get the available commands

	```
	CommandType     Name                                               Version    Source
	-----------     ----                                               -------    ------
	Cmdlet          Disable-ApplicationInsightsMonitoring              0.1.0      Microsoft.ApplicationInsights.IISConfigurator
	Cmdlet          Enable-ApplicationInsightsMonitoring               0.1.0      Microsoft.ApplicationInsights.IISConfigurator
	Cmdlet          Get-ApplicationInsightsMonitoringStatus            0.1.0      Microsoft.ApplicationInsights.IISConfigurator
	```


- Run the cmd: `Get-ApplicationInsightsMonitoringStatus` to get an output of information about this module.

	```
	PowerShell Module version:
	0.1.0-alpha

	Application Insights SDK version:
	2.9.0.0

	Executing PowerShell Module Assembly:
	Microsoft.ApplicationInsights.Redfield.Configurator.PowerShell, Version=2.8.13.5662, Culture=neutral, PublicKeyToken=31bf3856ad364e35

	PowerShell Module Directory:
	C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\content\PowerShell

	Runtime Paths:
	ParentDirectory: C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\content Exists: True
	ConfigurationPath: C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\content\applicationInsights.ikey.config Exists: False
	ManagedHttpModuleHelperPath: C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\content\Runtime\Microsoft.AppInsights.IIS.ManagedHttpModuleHelper.dll Exists: True
	RedfieldIISModulePath: C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.dll Exists: True
	InstrumentationEngine86Path: C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\content\Instrumentation32\MicrosoftInstrumentationEngine_x86.dll Exists: True
	InstrumentationEngine64Path: C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\content\Instrumentation64\MicrosoftInstrumentationEngine_x64.dll Exists: True
	InstrumentationEngineExtensionHost86Path: C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\content\Instrumentation32\Microsoft.ApplicationInsights.ExtensionsHost_x86.dll Exists: True
	InstrumentationEngineExtensionHost64Path: C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\content\Instrumentation64\Microsoft.ApplicationInsights.ExtensionsHost_x64.dll Exists: True
	InstrumentationEngineExtensionConfig86Path: C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\content\Instrumentation32\Microsoft.InstrumentationEngine.Extensions.config Exists: True
	InstrumentationEngineExtensionConfig64Path: C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\content\Instrumentation64\Microsoft.InstrumentationEngine.Extensions.config Exists: True
	ApplicationInsightsSdkPath: C:\Program Files\WindowsPowerShell\Modules\Microsoft.ApplicationInsights.IISConfigurator\content\Runtime\Microsoft.ApplicationInsights.dll Exists: True
	```




### Troubleshooting Running Processes

Can inspect the process on the instrumented machine to see if all DLLs are loaded.
If attach is working, 17 DLLS should be loaded.

- Cmd: `Get-ApplicationInsightsMonitoringStatus -InspectProcess`

	```
	iisreset.exe /status
	Status for IIS Admin Service ( IISADMIN ) : Running
	Status for Windows Process Activation Service ( WAS ) : Running
	Status for Net.Msmq Listener Adapter ( NetMsmqActivator ) : Running
	Status for Net.Pipe Listener Adapter ( NetPipeActivator ) : Running
	Status for Net.Tcp Listener Adapter ( NetTcpActivator ) : Running
	Status for World Wide Web Publishing Service ( W3SVC ) : Running

	handle64.exe -accepteula -p w3wp
	  BF0: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\microsoft.applicationinsights.iisconfigurator\content\Runtime\Microsoft.AI.ServerTelemetryChannel.dll
	  C58: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\microsoft.applicationinsights.iisconfigurator\content\Runtime\Microsoft.AI.AzureAppServices.dll
	  C68: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\microsoft.applicationinsights.iisconfigurator\content\Runtime\Microsoft.AI.DependencyCollector.dll
	  C78: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\microsoft.applicationinsights.iisconfigurator\content\Runtime\Microsoft.AI.WindowsServer.dll
	  C98: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\microsoft.applicationinsights.iisconfigurator\content\Runtime\Microsoft.AI.Web.dll
	  CBC: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\microsoft.applicationinsights.iisconfigurator\content\Runtime\Microsoft.AI.PerfCounterCollector.dll
	  DB0: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\microsoft.applicationinsights.iisconfigurator\content\Runtime\Microsoft.AI.Agent.Intercept.dll
	  B98: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\microsoft.applicationinsights.iisconfigurator\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.dll
	  BB4: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\microsoft.applicationinsights.iisconfigurator\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.Contracts.dll
	  BCC: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\microsoft.applicationinsights.iisconfigurator\content\Runtime\Microsoft.ApplicationInsights.Redfield.Lightup.dll
	  BE0: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\microsoft.applicationinsights.iisconfigurator\content\Runtime\Microsoft.ApplicationInsights.dll

	listdlls64.exe -accepteula w3wp
	0x0000000019ac0000  0x127000  C:\Program Files\WindowsPowerShell\Modules\microsoft.applicationinsights.iisconfigurator\content\Instrumentation64\MicrosoftInstrumentationEngine_x64.dll
	0x00000000198b0000  0x4f000   C:\Program Files\WindowsPowerShell\Modules\microsoft.applicationinsights.iisconfigurator\content\Instrumentation64\Microsoft.ApplicationInsights.ExtensionsHost_x64.dll
	0x000000000c460000  0xb2000   C:\Program Files\WindowsPowerShell\Modules\microsoft.applicationinsights.iisconfigurator\content\Instrumentation64\Microsoft.ApplicationInsights.Extensions.Base_x64.dll
	0x000000000ad60000  0x108000  C:\Windows\TEMP\2.4.0.0.Microsoft.ApplicationInsights.Extensions.Intercept_x64.dll
	```

### Collect ETW Logs with PerfView

#### Setup

- Download PerfView.exe and PerfView64.exe from https://github.com/Microsoft/perfview/releases
- Launch PerfView64.exe
- Expand "Advanced Options"
- Uncheck:
	- Zip
	- Merge
	- .NET Symbol Collection
- Set Additional Providers: 61f6ca3b-4b5f-5602-fa60-759a2a2d1fbd,323adc25-e39b-5c87-8658-2c1af1a92dc5,925fa42b-9ef6-5fa7-10b8-56449d7a2040,f7d60e07-e910-5aca-bdd2-9de45b46c560,7c739bb9-7861-412e-ba50-bf30d95eae36,61f6ca3b-4b5f-5602-fa60-759a2a2d1fbd,323adc25-e39b-5c87-8658-2c1af1a92dc5,252e28f4-43f9-5771-197a-e8c7e750a984


#### Collecting Logs

- in a cmd window with admin privileges, execute `iisreset /stop` To turn off IIS and all web apps.
- In PerfView, click "Start Collection"
- in a cmd window with admin privileges, execute `iisreset /start` To start IIS.
- try to browse to your app.
- after your app is loaded, In PerfView, click "Stop Collection"

