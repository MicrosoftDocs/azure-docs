---
title: IIS Configurator | Microsoft Docs
description: Monitor a website's performance without re-deploying it. Works with ASP.NET web apps hosted on-premises, in VMs or on Azure.
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
This is a prototype application. 
We do not recommend using this on your production environments.

# Get-ApplicationInsightsMonitoringStatus (v0.2.0-alpha)

**IMPORTANT**: This cmdlet must be run in a PowerShell Session with Administrator permissions.

## Description

This cmdlet is provided for troubleshooting the PowerShell Module in use.
This will report version information and key files required for monitoring.
Additional parameters provide extra reports on the current status of monitoring.


## Examples


### Example: Basic information
```
PS C:\> Get-ApplicationInsightsMonitoringStatus


PowerShell Module version:
0.2.0-alpha

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

### Example: Runtime Status
```
PS C:\> Get-ApplicationInsightsMonitoringStatus -InspectProcess

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

## Parameters 

### (No Params)

By **default**, this cmdlet will report version numbers and paths of DLLs required for monitoring.

Use this if you need to identify the version of any DLL, including the Application Insights SDK.


### -InspectProcess

**Optional**. This cmdlet will download and use external exes to report if IIS is running and also if required DLLs have been loaded into the IIS runtime.


If this fails for any reason, you can run these commands manually:
- iisreset.exe /status
- [handle64.exe](https://docs.microsoft.com/sysinternals/downloads/handle) -p w3wp | findstr /I "InstrumentationEngine AI. ApplicationInsights"
- [listdlls64.exe](https://docs.microsoft.com/sysinternals/downloads/listdlls) w3wp | findstr /I "InstrumentationEngine AI ApplicationInsights"


### -Force

**Optional**. Used only with InspectProcess. This will skip the user prompt to download the additional tools.


