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

## Azure Diagnostics is not Starting
Diagnostics is composed of two components: A guest agent plugin and the monitoring agent. You can check the log files **DiagnosticsPluginLauncher.log** and **DiagnosticsPlugin.log** for information on why diagnostics fails to start.  

In a Cloud Service role, log files for the guest agent plugin are located in:

```
C:\Logs\Plugins\Microsoft.Azure.Diagnostics.PaaSDiagnostics\1.7.4.0\
```

In an Azure Virtual Machine, log files for the guest agent plugin are located in:

```
C:\Packages\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\1.7.4.0\Logs\
```

The last line of the log files contains the exit code.  

```
DiagnosticsPluginLauncher.exe Information: 0 : [4/16/2016 6:24:15 AM] DiagnosticPlugin exited with code 0
```

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
| -106 |Cannot read the Diagnostics configuration file.<p><p>Solution: Caused by a configuration file not passing schema validation. So the solution is to provide a configuration file that complies with the schema. For Azure Virtual Machine, you can find the configuration that is delivered to the Diagnostics extension in the folder *%SystemDrive%\WindowsAzure\Config* on the VM. Open the appropriate XML file and search for **Microsoft.Azure.Diagnostics**, then for the **xmlCfg** or **WadCfg** field. If the WadCfg field is present, it means the config is in JSON. If the xmlCfg field is present, it means the config is in XML and is base64 encoded. You need to decode it to see the XML that was loaded by Diagnostics. For Cloud Service role, you can find the configuration that is delivered to the Diagnostics extension at C:\Packages\Plugins\Microsoft.Azure.Diagnostics.PaaSDiagnostics\1.7.4.0\config.txt on the VM. The data is base64 encoded so you’ll need to [decode it](http://www.bing.com/search?q=base64+decoder) to see the XML that was loaded by Diagnostics.<p> |
| -107 |The resource directory pass to the monitoring agent is invalid.<p><p>This internal error should only happen if the monitoring agent is manually invoked, incorrectly, on the VM.</p> |
| -108 |Unable to convert the Diagnostics configuration file into the monitoring agent configuration file.<p><p>This internal error should only happen if the Diagnostics plugin is manually invoked with an invalid configuration file. |
| -110 |General Diagnostics configuration error.<p><p>This internal error should only happen if the Diagnostics plugin is manually invoked with an invalid configuration file. |
| -111 |Unable to start the monitoring agent.<p><p>Solution: Verify that sufficient system resources are available. |
| -112 |General error |

## Diagnostics Data is Not Logged to Azure Storage
Azure diagnostics stores all data in Azure Storage.

The most common cause of missing event data is incorrectly defined storage account information.

Solution: Correct your Diagnostics configuration file and reinstall Diagnostics.
If the issue persists after reinstalling the diagnostics extension, then you may have to debug further by looking through any monitoring agent errors. Before event data is uploaded to your storage account, it is stored in the LocalResourceDirectory.
This directory path varies.

For Cloud Service Roles:

    C:\Resources\Directory\<CloudServiceDeploymentID>.<RoleName>.DiagnosticStore\WAD<DiagnosticsMajorandMinorVersion>\Tables

For Virtual Machines:

    C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\<DiagnosticsVersion>\WAD<DiagnosticsMajorandMinorVersion>\Tables

If there are no files in the LocalResourceDirectory folder, the monitoring agent is unable to launch. This is typically caused by an invalid configuration file, an event that should be reported in the CommandExecution.log.

If the Monitoring Agent is successfully collecting event data you see .tsf files for each event defined in your configuration file. The Monitoring Agent logs its errors in the file MaEventTable.tsf. To inspect the contents of this file, you can use the tabel2csv application to convert the .tsf file to a comma-separated (.csv) values file:

On a Cloud Service Role:

    %SystemDrive%\Packages\Plugins\Microsoft.Azure.Diagnostics.PaaSDiagnostics\<DiagnosticsVersion>\Monitor\x64\table2csv maeventtable.tsf

*%SystemDrive%* on a Cloud Service Role is typically D:

On a Virtual Machine:

    C:\Packages\Plugins\Microsoft.Azure.Diagnostics.IaaSDiagnostics\<DiagnosticsVersion>\Monitor\x64\table2csv maeventtable.tsf

The previous commands generate the log file *maeventtable.csv*, which you can open and inspect for failure messages.    

## Diagnostics data Tables not found
The tables in Azure storage holding Azure diagnostics data are named using the following code:

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

That generates 4 tables:

| Event | Table Name |
| --- | --- |
| provider=”prov1” &lt;Event id=”1” /&gt; |WADEvent+MD5(“prov1”)+”1” |
| provider=”prov1” &lt;Event id=”2” eventDestination=”dest1” /&gt; |WADdest1 |
| provider=”prov1” &lt;DefaultEvents /&gt; |WADDefault+MD5(“prov1”) |
| provider=”prov2” &lt;DefaultEvents eventDestination=”dest2” /&gt; |WADdest2 |
