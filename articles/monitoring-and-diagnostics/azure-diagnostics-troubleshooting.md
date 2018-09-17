---
title: Troubleshooting Azure Diagnostics extension
description: Troubleshoot problems when using Azure diagnostics in Azure Virtual Machines, Service Fabric, or Cloud Services.
services: azure-monitor
author: rboucher
ms.service: azure-monitor
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 07/12/2017
ms.author: robb
ms.component: diagnostic-extension
---
# Azure Diagnostics troubleshooting
This article describes troubleshooting information that's relevant to using Azure Diagnostics. For more information about Azure diagnostics, see [Azure Diagnostics overview](azure-diagnostics.md).

## Logical components
**Diagnostics Plugin Launcher (DiagnosticsPluginLauncher.exe)**: Launches the Azure Diagnostics extension. Serves as the entry point process.

**Diagnostics Plugin (DiagnosticsPlugin.exe)**: Configures, launches, and manages the lifetime of the monitoring agent. It is the main process that is launched by the launcher.

**Monitoring Agent (MonAgent\*.exe processes)**: Monitors, collects, and transfers the diagnostics data.  

## Log/artifact paths
Following are the paths to some important logs and artifacts. We refer to this information throughout the rest of the document.

### Azure Cloud Services
| Artifact | Path |
| --- | --- |
| **Azure Diagnostics configuration file** | %SystemDrive%\Packages\Plugins\Microsoft.Azure.Diagnostics.PaaSDiagnostics\<version>\Config.txt |
| **Log files** | C:\Logs\Plugins\Microsoft.Azure.Diagnostics.PaaSDiagnostics\<version>\ |
| **Local store for diagnostics data** | C:\Resources\Directory\<CloudServiceDeploymentID>.\<RoleName>.DiagnosticStore\WAD0107\Tables |
| **Monitoring agent configuration file** | C:\Resources\Directory\<CloudServiceDeploymentID>.\<RoleName>.DiagnosticStore\WAD0107\Configuration\MaConfig.xml |
| **Azure Diagnostics extension package** | %SystemDrive%\Packages\Plugins\Microsoft.Azure.Diagnostics.PaaSDiagnostics\<version> |
| **Log collection utility path** | %SystemDrive%\Packages\GuestAgent\ |
| **MonAgentHost log file** | C:\Resources\Directory\<CloudServiceDeploymentID>.\<RoleName>.DiagnosticStore\WAD0107\Configuration\MonAgentHost.<seq_num>.log |

### Virtual machines
| Artifact | Path |
| --- | --- |
| **Azure Diagnostics configuration file** | C:\Packages\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\<version>\RuntimeSettings |
| **Log files** | C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\<DiagnosticsVersion>\ |
| **Local store for diagnostics data** | C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\<DiagnosticsVersion>\WAD0107\Tables |
| **Monitoring agent configuration file** | C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\<DiagnosticsVersion>\WAD0107\Configuration\MaConfig.xml |
| **Status file** | C:\Packages\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\<version>\Status |
| **Azure Diagnostics extension package** | C:\Packages\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\<DiagnosticsVersion>|
| **Log collection utility path** | C:\WindowsAzure\Packages |
| **MonAgentHost log file** | C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\<DiagnosticsVersion>\WAD0107\Configuration\MonAgentHost.<seq_num>.log |

## Metric data doesn't appear in the Azure portal
Azure Diagnostics provides metric data that can be displayed in the Azure portal. If you have problems seeing the data in portal, check the WADMetrics\* table in the Azure Diagnostics storage account to see if the corresponding metric records are there.

Here, the **PartitionKey** of the table is the resource ID, virtual machine, or virtual machine scale set. **RowKey** is the metric name (also known as the performance counter name).

If the resource ID is incorrect, check **Diagnostics** **Configuration** > **Metrics** > **ResourceId** to see if the resource ID is set correctly.

If there's no data for the specific metric, check **Diagnostics Configuration** > **PerformanceCounter** to see if the metric (performance counter) is included. We enable the following counters by default:
- \Processor(_Total)\% Processor Time
- \Memory\Available Bytes
- \ASP.NET Applications(__Total__)\Requests/Sec
- \ASP.NET Applications(__Total__)\Errors Total/Sec
- \ASP.NET\Requests Queued
- \ASP.NET\Requests Rejected
- \Processor(w3wp)\% Processor Time
- \Process(w3wp)\Private Bytes
- \Process(WaIISHost)\% Processor Time
- \Process(WaIISHost)\Private Bytes
- \Process(WaWorkerHost)\% Processor Time
- \Process(WaWorkerHost)\Private Bytes
- \Memory\Page Faults/sec
- \.NET CLR Memory(_Global_)\% Time in GC
- \LogicalDisk(C:)\Disk Write Bytes/sec
- \LogicalDisk(C:)\Disk Read Bytes/sec
- \LogicalDisk(D:)\Disk Write Bytes/sec
- \LogicalDisk(D:)\Disk Read Bytes/sec

If the configuration is set correctly but you still can't see the metric data, use the following guidelines to help you troubleshoot.


## Azure Diagnostics isn't starting
For information about why Azure Diagnostics failed to start, see the **DiagnosticsPluginLauncher.log** and **DiagnosticsPlugin.log** files in the log files location that was provided earlier.

If these logs indicate `Monitoring Agent not reporting success after launch`, it means there was a failure launching MonAgentHost.exe. Look at the logs in the location that's indicated for `MonAgentHost log file` in the previous section.

The last line of the log files contains the exit code.  

```
DiagnosticsPluginLauncher.exe Information: 0 : [4/16/2016 6:24:15 AM] DiagnosticPlugin exited with code 0
```
If you find a **negative** exit code, refer to the [exit code table](#azure-diagnostics-plugin-exit-codes) in the [References section](#references).

## Diagnostics data is not logged to Azure Storage
Determine if none of the data is appearing or some of the data is appearing.

### Diagnostics infrastructure logs
Diagnostics logs all errors in the Diagnostics infrastructure logs. Make sure you have enabled the [capture of Diagnostics infrastructure logs in your configuration](#how-to-check-diagnostics-extension-configuration). Then you can quickly look for any relevant errors that appear in the `DiagnosticInfrastructureLogsTable` table in your configured storage account.

### No data is appearing
The most common reason that event data doesn't appear at all is that the storage account information is defined incorrectly.

Solution: Correct your Diagnostics configuration and reinstall Diagnostics.

If the storage account is configured correctly, remote access into the machine and verify that DiagnosticsPlugin.exe and MonAgentCore.exe are running. If they aren't running, follow the steps in [Azure Diagnostics is not starting](#azure-diagnostics-is-not-starting).

If the processes are running, go to [Is data getting captured locally?](#is-data-getting-captured-locally) and follow the instructions there.

### Part of the data is missing
If you are getting some data but not all, it means that the data collection/transfer pipeline is set correctly. Follow the subsections here to narrow down the issue.

#### Is the collection configured?
The Diagnostics configuration contains instructions for a particular type of data to be collected. [Review your configuration](#how-to-check-diagnostics-extension-configuration) to verify that you are only looking for data that you've configured for the collection.

#### Is the host generating data?
- **Performance counters**: Open perfmon and check the counter.

- **Trace logs**:  Remote access into the VM and add a TextWriterTraceListener to the app’s config file.  See http://msdn.microsoft.com/library/sk36c28t.aspx to set up the text listener.  Make sure the `<trace>` element has `<trace autoflush="true">`.<br />
If you don't see trace logs being generated, see [More about trace logs missing](#more-about-trace-logs-missing).

- **ETW traces**: Remote access into the VM and install PerfView.  In PerfView, run **File** > **User Command** > **Listen etwprovder1** > **etwprovider2**, and so on. The **Listen** command is case-sensitive, and there cannot be spaces between the comma-separated list of ETW providers. If the command fails to run, you can select the **Log** button in the bottom right of the Perfview tool to see what  attempted to run and what the result was.  Assuming the input is correct, a new window pops up. In a few seconds, you begin seeing ETW traces.

- **Event logs**: Remote access into the VM. Open `Event Viewer`, and then ensure that the events exist.

#### Is data getting captured locally?
Next, make sure the data is getting captured locally.
The data is locally stored in `*.tsf` files in [the local store for diagnostics data](#log-artifacts-path). Different kinds of logs get collected in different `.tsf` files. The names are similar to the table names in Azure Storage.

For example, `Performance Counters` get collected in `PerformanceCountersTable.tsf`. Event logs get collected in `WindowsEventLogsTable.tsf`. Use the instructions in the [Local log extraction](#local-log-extraction) section to open the local collection files and verify that you see them getting collected on disk.

If you don't see logs getting collected locally, and have already verified that the host is generating data, you likely have a configuration issue. Review your configuration carefully.

Also review the configuration that was generated for MonitoringAgent [MaConfig.xml](#log-artifacts-path). Verify that there is a section that describes the relevant log source. Then verify that it is not lost in translation between the Diagnostics configuration and the monitoring agent configuration.

#### Is data getting transferred?
If you have verified that the data is getting captured locally but you still don't see it in your storage account, take the following steps:

- Verify that you have provided a correct storage account, and that you haven't rolled over keys for the given storage account. For Azure Cloud Services, sometimes we see that people don't update `useDevelopmentStorage=true`.

- Verify that the provided storage account is correct. Make sure you don't have network restrictions that  prevent the components from reaching public storage endpoints. One way to do that is to remote access into the machine, and then try to write something to the same storage account yourself.

- Finally, you can look at what failures are being reported by the monitoring Agent. The monitoring agent writes its logs in `maeventtable.tsf`, which is located in [the local store for diagnostics data](#log-artifacts-path). Follow the instructions in the [Local log extraction](#local-log-extraction) section for opening this file. Then try to determine if there are `errors` that indicate failures reading to local files writing to storage.

### Capturing and archiving logs
If you are thinking about contacting support, the first thing they might ask you is to collect logs from your machine. You can save time by doing that yourself. Run the `CollectGuestLogs.exe` utility at [Log collection utility path](#log-artifacts-path). It generates a .zip file with all relevant Azure logs in the same folder.

## Diagnostics data tables not found
The tables in Azure storage that hold ETW events are named by using the following code:

```csharp
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
        <EtwEventSourceProviderConfiguration provider="prov1">
          <Event id="1" />
          <Event id="2" eventDestination="dest1" />
          <DefaultEvents />
        </EtwEventSourceProviderConfiguration>
        <EtwEventSourceProviderConfiguration provider="prov2">
          <DefaultEvents eventDestination="dest2" />
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
This code generates four tables:

| Event | Table name |
| --- | --- |
| provider=”prov1” &lt;Event id=”1” /&gt; |WADEvent+MD5(“prov1”)+”1” |
| provider=”prov1” &lt;Event id=”2” eventDestination=”dest1” /&gt; |WADdest1 |
| provider=”prov1” &lt;DefaultEvents /&gt; |WADDefault+MD5(“prov1”) |
| provider=”prov2” &lt;DefaultEvents eventDestination=”dest2” /&gt; |WADdest2 |

## References

### How to check Diagnostics extension configuration
The easiest way to check your extension configuration is to go to [Azure Resource Explorer](http://resources.azure.com), and then go to the virtual machine or cloud service where the Azure Diagnostics extension (IaaSDiagnostics / PaaDiagnostics) is.

Alternatively, remote desktop into the machine and look at the Azure Diagnostics Configuration file that's described in the [Log artifacts path section](#log-artifacts-path).

In either case, search for **Microsoft.Azure.Diagnostics**, and then for the **xmlCfg** or **WadCfg** field.

If you're searching on a virtual machine and the **WadCfg** field is present, it means the config is in JSON format. If the **xmlCfg** field is present, it means the config is in XML and is base64-encoded. You need to [decode it](http://www.bing.com/search?q=base64+decoder) to see the XML that was loaded by Diagnostics.

For the cloud service role, if you pick the configuration from disk, the data is base64-encoded, so you need to [decode it](http://www.bing.com/search?q=base64+decoder) to see the XML that was loaded by Diagnostics.

### Azure Diagnostics plugin exit codes
The plugin returns the following exit codes:

| Exit code | Description |
| --- | --- |
| 0 |Success. |
| -1 |Generic error. |
| -2 |Unable to load the rcf file.<p>This internal error should only happen if the guest agent plugin launcher is manually invoked incorrectly on the VM. |
| -3 |Cannot load the Diagnostics configuration file.<p><p>Solution: Caused by a configuration file not passing schema validation. The solution is to provide a configuration file that complies with the schema. |
| -4 |Another instance of the monitoring agent Diagnostics is already using the local resource directory.<p><p>Solution: Specify a different value for **LocalResourceDirectory**. |
| -6 |The guest agent plugin launcher attempted to launch Diagnostics with an invalid command line.<p><p>This internal error should only happen if the guest agent plugin launcher is manually invoked incorrectly on the VM. |
| -10 |The Diagnostics plugin exited with an unhandled exception. |
| -11 |The guest agent was unable to create the process responsible for launching and monitoring the monitoring agent.<p><p>Solution: Verify that sufficient system resources are available to launch new processes.<p> |
| -101 |Invalid arguments when calling the Diagnostics plugin.<p><p>This internal error should only happen if the guest agent plugin launcher is manually invoked incorrectly on the VM. |
| -102 |The plugin process is unable to initialize itself.<p><p>Solution: Verify that sufficient system resources are available to launch new processes. |
| -103 |The plugin process is unable to initialize itself. Specifically, it is unable to create the logger object.<p><p>Solution: Verify that sufficient system resources are available to launch new processes. |
| -104 |Unable to load the rcf file provided by the guest agent.<p><p>This internal error should only happen if the guest agent plugin launcher is manually invoked incorrectly on the VM. |
| -105 |The Diagnostics plugin cannot open the Diagnostics configuration file.<p><p>This internal error should only happen if the Diagnostics plugin is manually invoked incorrectly on the VM. |
| -106 |Cannot read the Diagnostics configuration file.<p><p>Caused by a configuration file not passing schema validation. <br><br>Solution: Provide a configuration file that complies with the schema. For more information, see [How to check Diagnostics Extension Configuration](#how-to-check-diagnostics-extension-configuration). |
| -107 |The resource directory pass to the monitoring agent is invalid.<p><p>This internal error should only happen if the monitoring agent is manually invoked incorrectly on the VM.</p> |
| -108 |Unable to convert the Diagnostics configuration file into the monitoring agent configuration file.<p><p>This internal error should only happen if the Diagnostics plugin is manually invoked with an invalid configuration file. |
| -110 |General Diagnostics configuration error.<p><p>This internal error should only happen if the Diagnostics plugin is manually invoked with an invalid configuration file. |
| -111 |Unable to start the monitoring agent.<p><p>Solution: Verify that sufficient system resources are available. |
| -112 |General error |

### Local log extraction
The monitoring agent collects logs and artifacts as `.tsf` files. The `.tsf` file is not readable but you can convert it into a `.csv` as follows:

```
<Azure diagnostics extension package>\Monitor\x64\table2csv.exe <relevantLogFile>.tsf
```
A new file called `<relevantLogFile>.csv` is created in the same path as the corresponding `.tsf` file.

>[!NOTE]
> You only need to run this utility against the main .tsf file (for example, PerformanceCountersTable.tsf). The accompanying files (for example, PerformanceCountersTables_\*\*001.tsf, PerformanceCountersTables_\*\*002.tsf, and so on) are automatically processed.

### More about missing trace logs

>[!NOTE]
> The following information applies mostly to Azure Cloud Services unless you have configured the DiagnosticsMonitorTraceListener on an application that's running on your IaaS VM.

- Make sure the **DiagnosticMonitorTraceListener** is configured in the web.config or app.config.  This is configured by default in cloud service projects. However, some customers comment it out, which causes the trace statements to not be collected by diagnostics.

- If logs are not getting written from the **OnStart** or **Run** method, make sure the **DiagnosticMonitorTraceListener** is in the app.config.  By default it is in the web.config, but that only applies to code running within w3wp.exe. So you need it in app.config to capture traces that are running in WaIISHost.exe.

- Make sure you are using **Diagnostics.Trace.TraceXXX** instead of **Diagnostics.Debug.WriteXXX.** The Debug statements are removed from a release build.

- Make sure the compiled code actually has the **Diagnostics.Trace lines** (use Reflector, ildasm, or ILSpy to verify). **Diagnostics.Trace** commands are removed from the compiled binary unless you use the TRACE conditional compilation symbol. This is a common problem that occurs when you're using msbuild to build a project.   

## Known issues and mitigations
Here is a list of known issues with known mitigations:

**1. .NET 4.5 dependency**

Windows Azure Diagnostics Extension has a runtime dependency on .NET 4.5 framework or later. At the time of writing, all machines that are provisioned for Azure Cloud Services, as well as all official images that are based on Azure virtual machines, have .NET 4.5 or later installed.

It is still possible encounter a situation where you try to run Windows Azure Diagnostics Extension on a machine that doesn't have .NET 4.5 or later. This happens when you create your machine from an old image or snapshot, or when you bring your own custom disk.

This generally manifests as an exit code **255** when running **DiagnosticsPluginLauncher.exe.** Failure happens due to the following unhandled exception:
```
System.IO.FileLoadException: Could not load file or assembly 'System.Threading.Tasks, Version=1.5.11.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a' or one of its dependencies
```

**Mitigation:** Install .NET 4.5 or later on your machine.

**2. Performance counters data is available in storage but not showing in the portal**

The portal experience in the virtual machines shows certain performance counters by default. If you don't see the performance counters, and you know that the data is getting generated because it is available in storage, check the following:

- Whether the data in storage has counter names in English. If the counter names are not in English, the portal metric chart won't able to recognize it. **Mitigation**: Change the machine's language to English for system accounts. To do this, select **Control Panel** > **Region** > **Administrative** > **Copy Settings**. Next, deselect **Welcome screen and system accounts** so that the custom language is not applied to the system account.

- If you are using wildcards (\*) in your performance counter names, the portal won't able to correlate the configured and collected counter when the performance counters are sent to the Azure Storage sink. **Mitigation**: To make sure you can use wildcards and have the portal expand the (\*), route your performance counters to the ["Azure Monitor" sink](azure-diagnostics-schema.md#diagnostics-extension-111).
