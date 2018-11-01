---
title: Store and View Diagnostic Data in Azure Storage
description: Get Azure diagnostics data into Azure Storage and view it
services: azure-monitor
author: jpconnock
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 08/01/2016
ms.author: jeconnoc
ms.component: diagnostic-extension
---
# Store and view diagnostic data in Azure Storage
Diagnostic data is not permanently stored unless you transfer it to the Microsoft Azure storage emulator or to Azure storage. Once in storage, it can be viewed with one of several available tools.

## Specify a storage account
You specify the storage account that you want to use in the ServiceConfiguration.cscfg file. The account information is defined as a connection string in a configuration setting. The following example shows the default connection string created for a new Cloud Service project in  Visual Studio:

```
    <ConfigurationSettings>
       <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="UseDevelopmentStorage=true" />
    </ConfigurationSettings>
```

You can change this connection string to provide account information for an Azure storage account.

Depending on the type of diagnostic data that is being collected, Azure Diagnostics uses either the Blob service or the Table service. The following table shows the data sources that are persisted and their format.

| Data source | Storage format |
| --- | --- |
| Azure logs |Table |
| IIS 7.0 logs |Blob |
| Azure Diagnostics infrastructure logs |Table |
| Failed Request Trace logs |Blob |
| Windows Event logs |Table |
| Performance counters |Table |
| Crash dumps |Blob |
| Custom error logs |Blob |

## Transfer diagnostic data
For SDK 2.5 and later, the request to transfer diagnostic data can occur through the configuration file. You can transfer diagnostic data at scheduled intervals as specified in the configuration.

For SDK 2.4 and previous you can request to transfer the diagnostic data through the configuration file as well as programmatically. The programmatic approach also allows you to do on-demand transfers.

> [!IMPORTANT]
> When you transfer diagnostic data to an Azure storage account, you incur costs for the storage resources that your diagnostic data uses.
> 
> 

## Store diagnostic data
Log data is stored in either Blob or Table storage with the following names:

**Tables**

* **WadLogsTable** - Logs written in code using the trace listener.
* **WADDiagnosticInfrastructureLogsTable** - Diagnostic monitor and configuration changes.
* **WADDirectoriesTable** – Directories that the diagnostic monitor is monitoring.  This includes IIS logs, IIS failed request logs, and custom directories.  The location of the blob log file is specified in the Container field and the name of the blob is in the RelativePath field.  The AbsolutePath field indicates the location and name of the file as it existed on the Azure virtual machine.
* **WADPerformanceCountersTable** – Performance counters.
* **WADWindowsEventLogsTable** – Windows Event logs.

**Blobs**

* **wad-control-container** – (Only for SDK 2.4 and previous) Contains the XML configuration files that controls the Azure diagnostics .
* **wad-iis-failedreqlogfiles** – Contains information from IIS Failed Request logs.
* **wad-iis-logfiles** – Contains information about IIS logs.
* **"custom"** – A custom container based on configuring directories that are monitored by the diagnostic monitor.  The name of this blob container will be specified in WADDirectoriesTable.

## Tools to view diagnostic data
Several tools are available to view the data after it is transferred to storage. For example:

* Server Explorer in Visual Studio - If you have installed the Azure Tools for Microsoft Visual Studio, you can use the Azure Storage node in Server Explorer to view read-only blob and table data from your Azure storage accounts. You can display data from your local storage emulator account and also from storage accounts you have created for Azure. For more information, see [Browsing and Managing Storage Resources with Server Explorer](../vs-azure-tools-storage-resources-server-explorer-browse-manage.md).
* [Microsoft Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) is a standalone app that enables you to easily work with Azure Storage data on Windows, OSX, and Linux.
* [Azure Management Studio](http://www.cerebrata.com/products/azure-management-studio/introduction) includes Azure Diagnostics Manager which allows you to view, download and manage the diagnostics data collected by the applications running on Azure.

## Next Steps
[Trace the flow in a Cloud Services application with Azure Diagnostics](../cloud-services/cloud-services-dotnet-diagnostics-trace-flow.md)

