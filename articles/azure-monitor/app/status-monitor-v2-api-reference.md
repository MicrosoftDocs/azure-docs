---
title: Azure Application Insights .Net Agent API reference
description: Application Insights Agent API reference. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs, or on Azure.
ms.topic: conceptual
author: TimothyMothra
ms.author: tilee
ms.date: 04/23/2019

---

# Azure Monitor Application Insights Agent API Reference

This article describes a cmdlet that's a member of the [Az.ApplicationMonitor PowerShell module](https://www.powershellgallery.com/packages/Az.ApplicationMonitor/).

> [!NOTE] 
> - To get started, you need an instrumentation key. For more information, see [Create a resource](create-new-resource.md#copy-the-instrumentation-key).
> - This cmdlet requires that you review and accept our license and privacy statement.

> [!IMPORTANT] 
> This cmdlet requires a PowerShell session with Admin permissions and an elevated execution policy. For more information, see [Run PowerShell as administrator with an elevated execution policy](status-monitor-v2-detailed-instructions.md#run-powershell-as-admin-with-an-elevated-execution-policy).
> - This cmdlet requires that you review and accept our license and privacy statement.
> - The instrumentation engine adds additional overhead and is off by default.


## Enable-InstrumentationEngine

Enables the instrumentation engine by setting some registry keys.
Restart IIS for the changes to take effect.

The instrumentation engine can supplement data collected by the .NET SDKs.
It collects events and messages that describe the execution of a managed process. These events and messages include dependency result codes, HTTP verbs, and [SQL command text](asp-net-dependencies.md#advanced-sql-tracking-to-get-full-sql-query).

Enable the instrumentation engine if:
- You've already enabled monitoring with the Enable cmdlet but didn't enable the instrumentation engine.
- You've manually instrumented your app with the .NET SDKs and want to collect additional telemetry.

### Examples

```powershell
PS C:\> Enable-InstrumentationEngine
```

### Parameters

#### -AcceptLicense
**Optional.** Use this switch to accept the license and privacy statement in headless installations.

#### -Verbose
**Common parameter.** Use this switch to output detailed logs.

### Output


##### Example output from successfully enabling the instrumentation engine

```
Configuring IIS Environment for instrumentation engine...
Configuring registry for instrumentation engine...
```

## Enable-ApplicationInsightsMonitoring

Enables codeless attach monitoring of IIS apps on a target computer.

This cmdlet will modify the IIS applicationHost.config and set some registry keys.
It will also create an applicationinsights.ikey.config file, which defines the instrumentation key used by each app.
IIS will load the RedfieldModule on startup, which will inject the Application Insights SDK into applications as the applications start.
Restart IIS for your changes to take effect.

After you enable monitoring, we recommend that you use [Live Metrics](live-stream.md) to quickly check if your app is sending us telemetry.

### Examples

#### Example with a single instrumentation key
In this example, all apps on the current computer are assigned a single instrumentation key.

```powershell
PS C:\> Enable-ApplicationInsightsMonitoring -InstrumentationKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

#### Example with an instrumentation key map
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


### Parameters

#### -InstrumentationKey
**Required.** Use this parameter to supply a single instrumentation key for use by all apps on the target computer.

#### -InstrumentationKeyMap
**Required.** Use this parameter to supply multiple instrumentation keys and a mapping of the instrumentation keys used by each app.
You can create a single installation script for several computers by setting `MachineFilter`.

> [!IMPORTANT]
> Apps will match against rules in the order that the rules are provided. So you should specify the most specific rules first and the most generic rules last.

##### Schema
`@(@{MachineFilter='.*';AppFilter='.*';InstrumentationSettings=@{InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'}})`

- **MachineFilter** is a required C# regex of the computer or VM name.
    - '.*' will match all
    - 'ComputerName' will match only computers with the exact name specified.
- **AppFilter** is a required C# regex of the IIS Site Name. You can get a list of sites on your server by running the command [get-iissite](https://docs.microsoft.com/powershell/module/iisadministration/get-iissite).
    - '.*' will match all
    - 'SiteName' will match only the IIS Site with the exact name specified.
- **InstrumentationKey** is required to enable monitoring of apps that match the preceding two filters.
    - Leave this value null if you want to define rules to exclude monitoring.


#### -EnableInstrumentationEngine
**Optional.** Use this switch to enable the instrumentation engine to collect events and messages about what's happening during the execution of a managed process. These events and messages include dependency result codes, HTTP verbs, and SQL command text.

The instrumentation engine adds overhead and is off by default.

#### -AcceptLicense
**Optional.** Use this switch to accept the license and privacy statement in headless installations.

#### -IgnoreSharedConfig
When you have a cluster of web servers, you might be using a [shared configuration](https://docs.microsoft.com/iis/web-hosting/configuring-servers-in-the-windows-web-platform/shared-configuration_211).
The HttpModule can't be injected into this shared configuration.
This script will fail with the message that extra installation steps are required.
Use this switch to ignore this check and continue installing prerequisites. 
For more information, see [known conflict-with-iis-shared-configuration](status-monitor-v2-troubleshoot.md#conflict-with-iis-shared-configuration)

#### -Verbose
**Common parameter.** Use this switch to display detailed logs.

#### -WhatIf 
**Common parameter.** Use this switch to test and validate your input parameters without actually enabling monitoring.

### Output

#### Example output from a successful enablement

```powershell
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

## Disable-InstrumentationEngine

Disables the instrumentation engine by removing some registry keys.
Restart IIS for the changes to take effect.

### Examples

```powershell
PS C:\> Disable-InstrumentationEngine
```

### Parameters 

#### -Verbose
**Common parameter.** Use this switch to output detailed logs.

### Output


##### Example output from successfully disabling the instrumentation engine

```powershell
Configuring IIS Environment for instrumentation engine...
Registry: removing 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\IISADMIN[Environment]'
Registry: removing 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\W3SVC[Environment]'
Registry: removing 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WAS[Environment]'
Configuring registry for instrumentation engine...
```

## Disable-ApplicationInsightsMonitoring

Disables monitoring on the target computer.
This cmdlet will remove edits to the IIS applicationHost.config and remove registry keys.

### Examples

```powershell
PS C:\> Disable-ApplicationInsightsMonitoring
```

### Parameters 

#### -Verbose
**Common parameter.** Use this switch to display detailed logs.

### Output


##### Example output from successfully disabling monitoring

```powershell
Initiating Disable Process
Applying transformation to 'C:\Windows\System32\inetsrv\config\applicationHost.config'
'C:\Windows\System32\inetsrv\config\applicationHost.config' backed up to 'C:\Windows\System32\inetsrv\config\applicationHost.config.backup-2019-03-26_08-59-00z'
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
```


## Get-ApplicationInsightsMonitoringConfig

Gets the config file and prints the values to the console.

### Examples

```powershell
PS C:\> Get-ApplicationInsightsMonitoringConfig
```

### Parameters

No parameters required.

### Output


##### Example output from reading the config file

```
RedfieldConfiguration:
Filters:
0)InstrumentationKey:  AppFilter: WebAppExclude MachineFilter: .*
1)InstrumentationKey: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2 AppFilter: WebAppTwo MachineFilter: .*
2)InstrumentationKey: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxdefault AppFilter: .* MachineFilter: .*
```

## Get-ApplicationInsightsMonitoringStatus

This cmdlet provides troubleshooting information about Status Monitor.
Use this cmdlet to investigate the monitoring status, version of the PowerShell Module, and to inspect the running process.
This cmdlet will report version information and information about key files required for monitoring.

### Examples

#### Example: Application status

Run the command `Get-ApplicationInsightsMonitoringStatus` to display the monitoring status of web sites.

```powershell

PS C:\Windows\system32> Get-ApplicationInsightsMonitoringStatus

IIS Websites:

SiteName               : Default Web Site
ApplicationPoolName    : DefaultAppPool
SiteId                 : 1
SiteState              : Stopped

SiteName               : DemoWebApp111
ApplicationPoolName    : DemoWebApp111
SiteId                 : 2
SiteState              : Started
ProcessId              : not found

SiteName               : DemoWebApp222
ApplicationPoolName    : DemoWebApp222
SiteId                 : 3
SiteState              : Started
ProcessId              : 2024
Instrumented           : true
InstrumentationKey     : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx123

SiteName               : DemoWebApp333
ApplicationPoolName    : DemoWebApp333
SiteId                 : 4
SiteState              : Started
ProcessId              : 5184
AppAlreadyInstrumented : true
```

In this example;
- **Machine Identifier** is an anonymous ID used to uniquely identify your server. If you create a support request, we'll need this ID to find logs for your server.
- **Default Web Site** is Stopped in IIS
- **DemoWebApp111** has been started in IIS, but hasn't received any requests. This report shows that there's no running process (ProcessId: not found).
- **DemoWebApp222** is running and is being monitored (Instrumented: true). Based on the user configuration, Instrumentation Key xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx123 was matched for this site.
- **DemoWebApp333** has been manually instrumented using the Application Insights SDK. Status Monitor detected the SDK and won't monitor this site.


#### Example: PowerShell module information

Run the command `Get-ApplicationInsightsMonitoringStatus -PowerShellModule` to display information about the current module:

```powershell

PS C:\> Get-ApplicationInsightsMonitoringStatus -PowerShellModule

PowerShell Module version:
0.4.0-alpha

Application Insights SDK version:
2.9.0.3872

Executing PowerShell Module Assembly:
Microsoft.ApplicationInsights.Redfield.Configurator.PowerShell, Version=2.8.14.11432, Culture=neutral, PublicKeyToken=31bf3856ad364e35

PowerShell Module Directory:
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\0.2.2\content\PowerShell

Runtime Paths:
ParentDirectory (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content

ConfigurationPath (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\applicationInsights.ikey.config

ManagedHttpModuleHelperPath (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.AppInsights.IIS.ManagedHttpModuleHelper.dll

RedfieldIISModulePath (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.dll

InstrumentationEngine86Path (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation32\MicrosoftInstrumentationEngine_x86.dll

InstrumentationEngine64Path (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation64\MicrosoftInstrumentationEngine_x64.dll

InstrumentationEngineExtensionHost86Path (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation32\Microsoft.ApplicationInsights.ExtensionsHost_x86.dll

InstrumentationEngineExtensionHost64Path (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation64\Microsoft.ApplicationInsights.ExtensionsHost_x64.dll

InstrumentationEngineExtensionConfig86Path (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation32\Microsoft.InstrumentationEngine.Extensions.config

InstrumentationEngineExtensionConfig64Path (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation64\Microsoft.InstrumentationEngine.Extensions.config

ApplicationInsightsSdkPath (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.dll
```

#### Example: Runtime status

You can inspect the process on the instrumented computer to see if all DLLs are loaded. If monitoring is working, at least 12 DLLs should be loaded.

Run the command `Get-ApplicationInsightsMonitoringStatus -InspectProcess`:


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
BF0: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.AI.ServerTelemetryChannel.dll
C58: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.AI.AzureAppServices.dll
C68: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.AI.DependencyCollector.dll
C78: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.AI.WindowsServer.dll
C98: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.AI.Web.dll
CBC: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.AI.PerfCounterCollector.dll
DB0: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.AI.Agent.Intercept.dll
B98: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.dll
BB4: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.Contracts.dll
BCC: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.Redfield.Lightup.dll
BE0: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.dll

listdlls64.exe -accepteula w3wp
0x0000000019ac0000  0x127000  C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation64\MicrosoftInstrumentationEngine_x64.dll
0x00000000198b0000  0x4f000   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation64\Microsoft.ApplicationInsights.ExtensionsHost_x64.dll
0x000000000c460000  0xb2000   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation64\Microsoft.ApplicationInsights.Extensions.Base_x64.dll
0x000000000ad60000  0x108000  C:\Windows\TEMP\2.4.0.0.Microsoft.ApplicationInsights.Extensions.Intercept_x64.dll
```

### Parameters

#### (No parameters)

By default, this cmdlet will report the monitoring status of web applications.
Use this option to review if your application was successfully instrumented.
You can also review which Instrumentation Key was matched to your site.


#### -PowerShellModule
**Optional**. Use this switch to report the version numbers and paths of DLLs required for monitoring.
Use this option if you need to identify the version of any DLL, including the Application Insights SDK.

#### -InspectProcess

**Optional**. Use this switch to report whether IIS is running.
It will also download external tools to determine if the necessary DLLs are loaded into the IIS runtime.


If this process fails for any reason, you can run these commands manually:
- iisreset.exe /status
- [handle64.exe](https://docs.microsoft.com/sysinternals/downloads/handle) -p w3wp | findstr /I "InstrumentationEngine AI. ApplicationInsights"
- [listdlls64.exe](https://docs.microsoft.com/sysinternals/downloads/listdlls) w3wp | findstr /I "InstrumentationEngine AI ApplicationInsights"


#### -Force

**Optional**. Used only with InspectProcess. Use this switch to skip the user prompt that appears before additional tools are downloaded.


## Set-ApplicationInsightsMonitoringConfig

Sets the config file without doing a full reinstallation.
Restart IIS for your changes to take effect.

> [!IMPORTANT] 
> This cmdlet requires a PowerShell session with Admin permissions.


### Examples

#### Example with a single instrumentation key
In this example, all apps on the current computer will be assigned a single instrumentation key.

```powershell
PS C:\> Enable-ApplicationInsightsMonitoring -InstrumentationKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

#### Example with an instrumentation key map
In this example:
- `MachineFilter` matches the current computer by using the `'.*'` wildcard.
- `AppFilter='WebAppExclude'` provides a `null` instrumentation key. The specified app won't be instrumented.
- `AppFilter='WebAppOne'` assigns the specified app a unique instrumentation key.
- `AppFilter='WebAppTwo'` assigns the specified app a unique instrumentation key.
- Finally, `AppFilter` also uses the `'.*'` wildcard to match all web apps that aren't matched by the earlier rules and assign a default instrumentation key.
- Spaces are added for readability.

```powershell
Enable-ApplicationInsightsMonitoring -InstrumentationKeyMap `
       @(@{MachineFilter='.*';AppFilter='WebAppExclude'},
          @{MachineFilter='.*';AppFilter='WebAppOne';InstrumentationSettings=@{InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1'}},
          @{MachineFilter='.*';AppFilter='WebAppTwo';InstrumentationSettings=@{InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2'}},
          @{MachineFilter='.*';AppFilter='.*';InstrumentationSettings=@{InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxdefault'}})
```

### Parameters

#### -InstrumentationKey
**Required.** Use this parameter to supply a single instrumentation key for use by all apps on the target computer.

#### -InstrumentationKeyMap
**Required.** Use this parameter to supply multiple instrumentation keys and a mapping of the instrumentation keys used by each app.
You can create a single installation script for several computers by setting `MachineFilter`.

> [!IMPORTANT]
> Apps will match against rules in the order that the rules are provided. So you should specify the most specific rules first and the most generic rules last.

##### Schema
`@(@{MachineFilter='.*';AppFilter='.*';InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'})`

- **MachineFilter** is a required C# regex of the computer or VM name.
    - '.*' will match all
    - 'ComputerName' will match only computers with the specified name.
- **AppFilter** is a required C# regex of the computer or VM name.
    - '.*' will match all
    - 'ApplicationName' will match only IIS apps with the specified name.
- **InstrumentationKey** is required to enable monitoring of the apps that match the preceding two filters.
    - Leave this value null if you want to define rules to exclude monitoring.


#### -Verbose
**Common parameter.** Use this switch to display detailed logs.


### Output

By default, no output.

##### Example verbose output from setting the config file via -InstrumentationKey

```
VERBOSE: Operation: InstallWithIkey
VERBOSE: InstrumentationKeyMap parsed:
Filters:
0)InstrumentationKey: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx AppFilter: .* MachineFilter: .*
VERBOSE: set config file
VERBOSE: Config File Path:
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\applicationInsights.ikey.config
```

##### Example verbose output from setting the config file via -InstrumentationKeyMap

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

## Start-ApplicationInsightsMonitoringTrace

Collects [ETW Events](https://docs.microsoft.com/windows/desktop/etw/event-tracing-portal) from the codeless attach runtime. 
This cmdlet is an alternative to running [PerfView](https://github.com/microsoft/perfview).

Collected events will be printed to the console in real-time and saved to an ETL file. The output ETL file can be opened by [PerfView](https://github.com/microsoft/perfview) for further investigation.

This cmdlet will run until it reaches the timeout duration (default 5 minutes) or is stopped manually (`Ctrl + C`).

### Examples

#### How to collect events

Normally we would ask that you collect events to investigate why your application isn't being instrumented.

The codeless attach runtime will emit ETW events when IIS starts up and when your application starts up.

To collect these events:
1. In a cmd console with admin privileges, execute `iisreset /stop` To turn off IIS and all web apps.
2. Execute this cmdlet
3. In a cmd console with admin privileges, execute `iisreset /start` To start IIS.
4. Try to browse to your app.
5. After your app finishes loading, you can manually stop it (`Ctrl + C`) or wait for the timeout.

#### What events to collect

You have three options when collecting events:
1. Use the switch `-CollectSdkEvents` to collect events emitted from the Application Insights SDK.
2. Use the switch `-CollectRedfieldEvents` to collect events emitted by Status Monitor and the Redfield Runtime. These logs are helpful when diagnosing IIS and application startup.
3. Use both switches to collect both event types.
4. By default, if no switch is specified both event types will be collected.


### Parameters

#### -MaxDurationInMinutes
**Optional.** Use this parameter to set how long this script should collect events. Default is 5 minutes.

#### -LogDirectory
**Optional.** Use this switch to set the output directory of the ETL file. 
By default, this file will be created in the PowerShell Modules directory. 
The full path will be displayed during script execution.


#### -CollectSdkEvents
**Optional.** Use this switch to collect Application Insights SDK events.

#### -CollectRedfieldEvents
**Optional.** Use this switch to collect events from Status Monitor and the Redfield runtime.

#### -Verbose
**Common parameter.** Use this switch to output detailed logs.



### Output


#### Example of application startup logs
```powershell
PS C:\Windows\system32> Start-ApplicationInsightsMonitoringTrace -ColectRedfieldEvents
Starting...
Log File: C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\logs\20190627_144217_ApplicationInsights_ETW_Trace.etl
Tracing enabled, waiting for events.
Tracing will timeout in 5 minutes. Press CTRL+C to cancel.

2:42:31 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace Resolved variables to: MicrosoftAppInsights_ManagedHttpModulePath='C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.dll', MicrosoftAppInsights_ManagedHttpModuleType='Microsoft.ApplicationInsights.RedfieldIISModule.RedfieldIISModule'
2:42:31 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace Resolved variables to: MicrosoftDiagnosticServices_ManagedHttpModulePath2='', MicrosoftDiagnosticServices_ManagedHttpModuleType2=''
2:42:31 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace Environment variable 'MicrosoftDiagnosticServices_ManagedHttpModulePath2' or 'MicrosoftDiagnosticServices_ManagedHttpModuleType2' is null, skipping managed dll loading
2:42:31 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace MulticastHttpModule.constructor, success, 70 ms
2:42:31 PM EVENT: Microsoft-ApplicationInsights-RedfieldIISModule Trace Current assembly 'Microsoft.ApplicationInsights.RedfieldIISModule, Version=2.8.18.27202, Culture=neutral, PublicKeyToken=f23a46de0be5d6f3' location 'C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.dll'
2:42:31 PM EVENT: Microsoft-ApplicationInsights-RedfieldIISModule Trace Matched filter '.*'~'STATUSMONITORTE', '.*'~'DemoWithSql'
2:42:31 PM EVENT: Microsoft-ApplicationInsights-RedfieldIISModule Trace Lightup assembly calculated path: 'C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.Redfield.Lightup.dll'
2:42:31 PM EVENT: Microsoft-ApplicationInsights-FrameworkLightup Trace Loaded applicationInsights.config from assembly's resource Microsoft.ApplicationInsights.Redfield.Lightup, Version=2.8.18.27202, Culture=neutral, PublicKeyToken=f23a46de0be5d6f3/Microsoft.ApplicationInsights.Redfield.Lightup.ApplicationInsights-recommended.config
2:42:34 PM EVENT: Microsoft-ApplicationInsights-FrameworkLightup Trace Successfully attached ApplicationInsights SDK
2:42:34 PM EVENT: Microsoft-ApplicationInsights-RedfieldIISModule Trace RedfieldIISModule.LoadLightupAssemblyAndGetLightupHttpModuleClass, success, 2687 ms
2:42:34 PM EVENT: Microsoft-ApplicationInsights-RedfieldIISModule Trace RedfieldIISModule.CreateAndInitializeApplicationInsightsHttpModules(lightupHttpModuleClass), success
2:42:34 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace ManagedHttpModuleHelper, multicastHttpModule.Init() success, 3288 ms
2:42:35 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace Resolved variables to: MicrosoftAppInsights_ManagedHttpModulePath='C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.dll', MicrosoftAppInsights_ManagedHttpModuleType='Microsoft.ApplicationInsights.RedfieldIISModule.RedfieldIISModule'
2:42:35 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace Resolved variables to: MicrosoftDiagnosticServices_ManagedHttpModulePath2='', MicrosoftDiagnosticServices_ManagedHttpModuleType2=''
2:42:35 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace Environment variable 'MicrosoftDiagnosticServices_ManagedHttpModulePath2' or 'MicrosoftDiagnosticServices_ManagedHttpModuleType2' is null, skipping managed dll loading
2:42:35 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace MulticastHttpModule.constructor, success, 0 ms
2:42:35 PM EVENT: Microsoft-ApplicationInsights-RedfieldIISModule Trace RedfieldIISModule.CreateAndInitializeApplicationInsightsHttpModules(lightupHttpModuleClass), success
2:42:35 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace ManagedHttpModuleHelper, multicastHttpModule.Init() success, 0 ms
Timeout Reached. Stopping...
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






