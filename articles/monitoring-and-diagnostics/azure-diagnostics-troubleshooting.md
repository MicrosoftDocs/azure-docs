---
title: Troubleshooting Azure Diagnostics | Microsoft Docs
description: Troubleshoot problems when using Azure diagnostics in Azure Virtual Machines, Service Fabric, or Cloud Services.
services: monitoring-and-diagnostics
documentationcenter: .net
author: rboucher
manager: carmonm
editor: ''

ms.assetid: 66469bce-d457-4d1e-b550-a08d2be4d28c
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 03/28/2017
ms.author: robb

---
# Azure Diagnostics Troubleshooting
Troubleshooting information relevant to using Azure Diagnostics. For more information on Azure diagnostics, see [Azure Diagnostics Overview](azure-diagnostics.md).

## Logical Components
**Diagnostics Plugin Launcher (DiagnosticsPluginLauncher.exe)**: Launches the Azure Diagnostics extension. Serves as the entry point process.

**Diagnostics Plugin (DiagnosticsPlugin.exe)**: Main process that is launched by the launcher above and configures the Monitoring Agent, launches it and manages its lifetime. 

**Monitoring Agent (MonAgent\*.exe processes)**: These processes do the bulk of the work; i.e., monitoring, collection and transfer of the diagnostics data.  

## Log/Artifact Paths
Here are the paths to some important logs and artifacts. We keep referring to these throughout the rest of the document:
### Cloud Services
| Artifact | Path |
| --- | --- |
| **Azure Diagnostics configuration file** | %SystemDrive%\Packages\Plugins\Microsoft.Azure.Diagnostics.PaaSDiagnostics\<version>\Config.txt |
| **Log files** | C:\Logs\Plugins\Microsoft.Azure.Diagnostics.PaaSDiagnostics\<version>\ |
| **Local store for diagnostics data** | C:\Resources\Directory\<CloudServiceDeploymentID>.\<RoleName>.DiagnosticStore\WAD0107\Tables |
| **Monitoring Agent configuration file** | C:\Resources\Directory\<CloudServiceDeploymentID>.\<RoleName>.DiagnosticStore\WAD0107\Configuration\MaConfig.xml |
| **Azure diagnostics extension package** | %SystemDrive%\Packages\Plugins\Microsoft.Azure.Diagnostics.PaaSDiagnostics\<version> |
| **Log collection utility path** | %SystemDrive%\Packages\GuestAgent\ |

### Virtual Machines
| Artifact | Path |
| --- | --- |
| **Azure Diagnostics configuration file** | C:\Packages\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\<version>\RuntimeSettings |
| **Log files** | C:\Packages\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\<version>\Logs\ |
| **Local store for diagnostics data** | C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\<DiagnosticsVersion>\WAD0107\Tables |
| **Monitoring Agent configuration file** | C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\<DiagnosticsVersion>\WAD0107\Configuration\MaConfig.xml |
| **Status file** | C:\Packages\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\<version>\Status |
| **Azure diagnostics extension package** | C:\Packages\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\<DiagnosticsVersion>|
| **Log collection utility path** | C:\WindowsAzure\Packages |

## Azure Diagnostics is not Starting
Look at **DiagnosticsPluginLauncher.log** and **DiagnosticsPlugin.log** files from the location of the log files provided above for information on why diagnostics failed to start.  

The last line of the log files contains the exit code.  

```
DiagnosticsPluginLauncher.exe Information: 0 : [4/16/2016 6:24:15 AM] DiagnosticPlugin exited with code 0
```
If you find a **negative** exit code, refer to the [exit code table](#azure-diagnostics-plugin-exit-codes) in the [References](#references).

## Diagnostics Data is Not Logged to Azure Storage
Determine if no data is showing up or only some of the data is not showing up.

### Diagnostics Infrastructure Logs
Diagnostics Infrastructure Logs is where azure diagnostics logs any errors that it runs into. Make sure you have enabled ([how to?](#how-to-check-diagnostics-extension-configuration)) capturing of Diagnsotics Infrastructure logs in your configuration and quickly look for any relevant errors that show up in the `DiagnosticInfrastructureLogsTable` table in your configured storage account.

### No data is showing up
The most common cause of event data entirely missing is incorrectly defined storage account information.

Solution: Correct your Diagnostics configuration and reinstall Diagnostics.

If the storage account is configured correctly, remote desktop into the machine and make sure DiagnosticsPlugin.exe and MonAgentCore.exe are running. If they are not running follow [Azure Diagnostics is not Starting](#azure-diagnostics-is-not-starting). If the processes are running, jump to [Is data getting captured locally](#is-data-getting-captured-locally) and follow this guide from there on.

### Part of the data is missing
If you are getting some data but not other. This means the data collection / transfer pipeline is set correctly. Follow the sub-sections here to narrow down what the issue is:
#### Is Collection Configured: 
Diagnostics Configuration contains the part that instructs for a particular type of data to be collected. [Review your configuration](#how-to-check-diagnostics-extension-configuration) to make sure you are not looking for data you have not configured for collection.
#### Is the host generating data:
- **Performance Counters**: open perfmon and check the counter.
- **Trace Logs**:  Remote desktop into the VM and add a TextWriterTraceListener to the app’s config file.  See http://msdn.microsoft.com/en-us/library/sk36c28t.aspx to setup the text listener.  Make sure the `<trace>` element has `<trace autoflush="true">`.<br />
If you don't see trace logs getting generated, follow [More About Trace Logs Missing](#more-about-trace-logs-missing).
 - **ETW traces**: Remote desktop into the VM and install PerfView.  In PerfView run File -> User Command -> Listen etwprovder1,etwprovider2,etc.  Note that the Listen command is case sensitive and there cannot be spaces between the comma separated list of ETW providers.  If the command fails to run you can click the 'Log' button in the bottom-right of the Perfview tool to see what was attempted to run and what the result was.  Assuming the input is correct then a new window will pop up and in a few seconds you will begin seeing ETW traces.
- **Event Logs**: Remote desktop into the VM. Open `Event Viewer` and ensure the events exist.
#### Is data getting captured locally:
Next make sure the data is getting captured locally.
The data is locally stored in `*.tsf` files in [the local store for diagnostics data](#log-artifacts-path). Different kinds of logs get collected in different `.tsf` files. The names are similar to the table names in azure storage. For example `Performance Counters` get collected in `PerformanceCountersTable.tsf`, Event Logs get collected in `WindowsEventLogsTable.tsf`. Use the instructions in [Local Log Extraction](#local-log-extraction) section to open the local collection files and make sure you see them getting collected on disk.

If you don't see logs getting collected locally and are have already verified that the host is generating data, you likely have a configuration issue. Review your configuration carefully for the appropriate section. Also review the configuration generated for MonitoringAgent [MaConfig.xml](#log-artifacts-path) and make sure there is some section describing the relevant log source and that it is not lost in translation between azure diagnostics configuration and monitoring agent configuration.
#### Is data getting transferred:
If you have verified the data is getting captured locally but you still don't see it in your storage account: 
- First and foremost, make sure that you have provided a correct storage account and that you have not rolled over keys etc.for the given storage account. For cloud services, sometimes we see that people don't update their `useDevelopmentStorage=true`.
- If provided storage account is correct. Make sure you do not have some network restrictions that do not allow the components to reach public storage endpoints. One way to do that is to remote desktop into the machine and try to write something to the same storage account yourself.
- Finally, you can try and see what failure are being reported by Monitoring Agent. Monitoring agent writes its logs in `maeventtable.tsf` located in [the local store for diagnostics data](#log-artifacts-path). Follow instructions in [Local Log Extraction](#local-log-extraction) section to open this file and try and figure out if there are `errors` indicating failures to read local files or write to storage.

### Capturing / Archiving logs
You went through the above steps but could not figure out what was wrong and are thinking about contacting support. The first thing they might ask you is to collect logs from you machine. You can save time by doing that yourself. Run the `CollectGuestLogs.exe` utility at  [Log Collection Utility path](#log-artifacts-path) and it will generate a zip file with all relevant azure logs in the same folder.

## Diagnostics data Tables not found
The tables in Azure storage holding ETW events are named using the following code:

```C#
        if (String.IsNullOrEmpty(eventDestination)) {
            if (e == "DefaultEvents")
                tableName = "WADDefault" + MD5(provider);
            else
                tableName = "WADEvent" + MD5(provider) + eventId;
        }
        else
            tableName = "WAD" + eventDestination;
```

Here is an example:

```XML
        <EtwEventSourceProviderConfiguration provider=”prov1”>
          <Event id=”1” />
          <Event id=”2” eventDestination=”dest1” />
          <DefaultEvents />
        </EtwEventSourceProviderConfiguration>
        <EtwEventSourceProviderConfiguration provider=”prov2”>
          <DefaultEvents eventDestination=”dest2” />
        </EtwEventSourceProviderConfiguration>
```
```JSON
"EtwEventSourceProviderConfiguration": [
    {
        "provider": "prov1",
        "Event": [
            {
                "id": 1
            },
            {
                "id": 2,
                "eventDestination": "dest1"
            }
        ],
        "DefaultEvents": {
            "eventDestination": "DefaultEventDestination",
            "sinks": ""
        }
    },
    {
        "provider": "prov2",
        "DefaultEvents": {
            "eventDestination": "dest2"
        }
    }
]
```
That generates 4 tables:

| Event | Table Name |
| --- | --- |
| provider=”prov1” &lt;Event id=”1” /&gt; |WADEvent+MD5(“prov1”)+”1” |
| provider=”prov1” &lt;Event id=”2” eventDestination=”dest1” /&gt; |WADdest1 |
| provider=”prov1” &lt;DefaultEvents /&gt; |WADDefault+MD5(“prov1”) |
| provider=”prov2” &lt;DefaultEvents eventDestination=”dest2” /&gt; |WADdest2 |

## References

### How to check Diagnostics Extension Configuration
The easiest way to check your extension configuration is to navigate to http://resources.azure.com, navigate to the virtual machine or cloud service on which the Azure Diagnostics extension (IaaSDiagnostics / PaaDiagnostics) is in question.

Alternatively, remote desktop into the machine and look at the Azure Diagnostics Configuration file described in the appropriate section [here](#log-artifacts-path).

In either case search for **Microsoft.Azure.Diagnostics** then for the **xmlCfg** or **WadCfg** field. 

In case of virtual machines, if the WadCfg field is present, it means the config is in JSON. If the xmlCfg field is present, it means the config is in XML and is base64 encoded. You need to [decode it](http://www.bing.com/search?q=base64+decoder) to see the XML that was loaded by Diagnostics.

For Cloud Service role, if you pick the configuration from disk, the data is base64 encoded so you’ll need to [decode it](http://www.bing.com/search?q=base64+decoder) to see the XML that was loaded by Diagnostics.

### Azure Diagnostics Plugin Exit Codes
The plugin returns the following exit codes:

| Exit Code | Description |
| --- | --- |
| 0 |Success. |
| -1 |Generic Error. |
| -2 |Unable to load the rcf file.<p>This internal error should only happen if the guest agent plugin launcher is manually invoked, incorrectly, on the VM. |
| -3 |Cannot load the Diagnostics configuration file.<p><p>Solution: Caused by a configuration file not passing schema validation. The solution is to provide a configuration file that complies with the schema. |
| -4 |Another instance of the monitoring agent Diagnostics is already using the local resource directory.<p><p>Solution: Specify a different value for **LocalResourceDirectory**. |
| -6 |The guest agent plugin launcher attempted to launch Diagnostics with an invalid command line.<p><p>This internal error should only happen if the guest agent plugin launcher is manually invoked, incorrectly, on the VM. |
| -10 |The Diagnostics plugin exited with an unhandled exception. |
| -11 |The guest agent was unable to create the process responsible for launching and monitoring the monitoring agent.<p><p>Solution: Verify that sufficient system resources are available to launch new processes.<p> |
| -101 |Invalid arguments when calling the Diagnostics plugin.<p><p>This internal error should only happen if the guest agent plugin launcher is manually invoked, incorrectly, on the VM. |
| -102 |The plugin process is unable to initialize itself.<p><p>Solution: Verify that sufficient system resources are available to launch new processes. |
| -103 |The plugin process is unable to initialize itself. Specifically it is unable to create the logger object.<p><p>Solution: Verify that sufficient system resources are available to launch new processes. |
| -104 |Unable to load the rcf file provided by the guest agent.<p><p>This internal error should only happen if the guest agent plugin launcher is manually invoked, incorrectly, on the VM. |
| -105 |The Diagnostics plugin cannot open the Diagnostics configuration file.<p><p>This internal error should only happen if the Diagnostics plugin is manually invoked, incorrectly, on the VM. |
| -106 |Cannot read the Diagnostics configuration file.<p><p>Solution: Caused by a configuration file not passing schema validation. So the solution is to provide a configuration file that complies with the schema. See [How to check Diagnostics Extension Configuration](#how-to-check-diagnostics-extension-configuration). |
| -107 |The resource directory pass to the monitoring agent is invalid.<p><p>This internal error should only happen if the monitoring agent is manually invoked, incorrectly, on the VM.</p> |
| -108 |Unable to convert the Diagnostics configuration file into the monitoring agent configuration file.<p><p>This internal error should only happen if the Diagnostics plugin is manually invoked with an invalid configuration file. |
| -110 |General Diagnostics configuration error.<p><p>This internal error should only happen if the Diagnostics plugin is manually invoked with an invalid configuration file. |
| -111 |Unable to start the monitoring agent.<p><p>Solution: Verify that sufficient system resources are available. |
| -112 |General error |

### Local Log Extraction
The mointoring agent collects logs and artifacts as `.tsf` files. `.tsf` file is not readable but you can convert it into a `.csv` as follows: 

```
<Azure diagnostics extension package>\Monitor\x64\table2csv.exe <relevantLogFile>.tsf
```
A new file called `<relevantLogFile>.csv` will be created in the same path as the corresponding `.tsf` file.

**NOTE**: You only need to run this utility against the main tsf file (e.g., PerformanceCountersTable.tsf). Tha accompanying files (e.g., PerformanceCountersTables_\*\*001.tsf, PerformanceCountersTables_\*\*002.tsf etc.) will automatically be processed.

### More About Trace Logs Missing

**Note:** This mostly applies to cloud services only unless you have configured the DiagnosticsMonitorTraceListener on an application running on your IaaS VM. 

- Make sure the DiagnosticMonitorTraceListener is configured in the web.config or app.config.  This is configured by default in cloud service projects, but some customers comment it out which will cause the trace statements to not be collected by diagnostics. 
- If logs are not getting written from the OnStart or Run method make sure the DiagnosticMonitorTraceListener is in the app.config.  By default it is in the web.config, but that only applies to code running within w3wp.exe; so you need it in app.config to capture traces running in WaIISHost.exe.
- Make sure you are using Diagnostics.Trace.TraceXXX instead of Diagnostics.Debug.WriteXXX.  The Debug statements will be removed from a Release build.
- Make sure the compiled code actually has the Diagnostics.Trace lines (use Reflector, ildasm or ILSpy to verify).  Diagnostics.Trace commands are removed from the compiled binary unless you use the TRACE conditional compilation symbol.  If using msbuild to build the project then this is a common problem to run into.

## Known Issues and Mitigations
Here is a list of known issues with known mitigations:

**1. .NET 4.5 dependency:**

WAD has a runtime dependency on .NET 4.5 framework or above. At the time of writing this, all machines provisioned for cloud services as well as all official azure Virtual Machine base images have .NET 4.5 or above installed. It is still however possible to land in a situation where you try to run WAD on a machine which does not have .NET 4.5 or above. This happens when you create your machine off of an old image or snapshot; or bring your own custom disk.

This generally manifests as an exit code **255** when running DiagnosticsPluginLauncher.exe. Failure happens due to the unhandled exception: 
```
System.IO.FileLoadException: Could not load file or assembly 'System.Threading.Tasks, Version=1.5.11.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a' or one of its dependencies
```

**Mitigation:** Install .NET 4.5 or higher on your machine.

**2. Performance Counters data available in storage but not showing in portal**

Virtual machines portal experience shows certain performance counters by default. If you don't see them and you know the data is getting generated because it is available in storage. Check:
- If the data in storage has english counter names. If the counter names are not in english, portal metric chart will not be able to recognize it.
- If you are using wild cards (\*) in your performance counter names, the portal will not be able to correlate the configured and collected counter.

**Mitigation**: Change the machine's language to english for system accounts. Control Panel -> Region -> Administrative -> Copy Settings -> uncheck "Welcome screen and system accounts" so that the custom language is not applied to system account. Also make sure you do not use wild cards if you want portal to be your primary consumption experience.
