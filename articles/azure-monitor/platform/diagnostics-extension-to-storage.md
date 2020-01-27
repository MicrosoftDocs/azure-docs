---
title: Install and configure Windows Azure diagnostics extension (WAD)
description: Learn how to collect Azure diagnostics data in an Azure Storage account so you can view it with one of several available tools.
services: azure-monitor
author: bwren
ms.service: azure-monitor
ms.subservice: diagnostic-extension
ms.topic: conceptual
ms.date: 01/20/2020
ms.author: bwren
---
# Install and configure Windows Azure diagnostics extension (WAD)
Azure Diagnostics extension is an agent in Azure Monitor that collects monitoring data from the guest operating system and workloads of Azure compute resources. This article provides details on installing and configuring the Windows diagnostics extension and a description of how the data is stored in and Azure Storage account.

## Install 

The Diagnostic extension is implemented as a [virtual machine extension](/virtual-machines/extensions/overview) in Azure, so it supports the same installation options using Resource Manager templates, PowerShell, and CLI. 

See the following for details on installing and maintaining virtual machine extensions:

- [Virtual machine extensions and features for Windows](/virtual-machines/extensions/features-windows)
- [Windows Diagnostics extension schema](diagnostics-extension-schema-windows.md)

## Install with Azure portal
You can install the diagnostics extension on a VM in the Azure portal if it hasn't already been enabled. If it has been enabled, then you can use this same option to configure it.

> [!NOTE]
> You cannot configure the diagnostics extension to send data to Azure Event Hubs using the Azure portal. To configure this, you must use one of the other configuration methods.

1. Click on ****Diagnostic settings** in the **Monitoring** section of the VMs menu in the Azure portal.
2. Click **Enable guest-level monitoring**.
3. A new Azure Storage account will be created for the VM. You can attach the VM to another storage account by selecting the **Agent** tab.

### Overview 
Displays the current configuration with links to the other tabs.

### Performance counters
Select the performance counters to collect. 

#### Basic setting
Enable or disable all counters for standard performance objects. You can set a sample rate that will be applied to each of the counters for the object.

#### Custom setting



- Enables Name:Microsoft.Insights.VMDiagnosticsSettings extension 	
Type: Microsoft.Azure.Diagnostics.IaaSDiagnostics
- Creates a new storage account
- Enables most common performance counters
- Enables most common event logs


## Installing and configuring WAD with CLI
Assuming your protected settings are in the file PrivateConfig.json and your public configuration information is in PublicConfig.json, run the following command. 

```Azure CLI
az vm extension set *resource_group_name* *vm_name* LinuxDiagnostic Microsoft.Azure.Diagnostics '3.*' --private-config-path PrivateConfig.json --public-config-path PublicConfig.json
```

Microsoft.Insights.VMDiagnosticsSettings
Microsoft.Azure.Diagnostics.IaaSDiagnostics


## Specify a storage account
You specify the storage account that you want to use in the ServiceConfiguration.cscfg file. The account information is defined as a connection string in a configuration setting. The following example shows the default connection string created for a new Cloud Service project in  Visual Studio:

```
    <ConfigurationSettings>
       <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="UseDevelopmentStorage=true" />
    </ConfigurationSettings>
```

You can change this connection string to provide account information for an Azure storage account.


> [!IMPORTANT]
> When you transfer diagnostic data to an Azure storage account, you incur costs for the storage resources that your diagnostic data uses.
 

## Data storage
The following table lists the different types of data collected from the diagnostics extension and whether they're stored as a table or a blob.


| Data | Storage type | Description |
|:---|:---|:---|
| WADDiagnosticInfrastructureLogsTable | Table | Diagnostic monitor and configuration changes. |
| WADDirectoriesTable | Table | Directories that the diagnostic monitor is monitoring.  This includes IIS logs, IIS failed request logs, and custom directories.  The location of the blob log file is specified in the Container field and the name of the blob is in the RelativePath field.  The AbsolutePath field indicates the location and name of the file as it existed on the Azure virtual machine. |
| WadLogsTable | Table | Logs written in code using the trace listener. |
| WADPerformanceCountersTable | Table | Performance counters. |
| WADWindowsEventLogsTable | Table | Windows Event logs. |
| wad-control-container | Blob | (Only for SDK 2.4 and previous) Contains the XML configuration files that controls the Azure diagnostics . |
| wad-iis-failedreqlogfiles | Blob | Contains information from IIS Failed Request logs. |
| wad-iis-logfiles | Blob | Contains information about IIS logs. |
| "custom" | Blob | A custom container based on configuring directories that are monitored by the diagnostic monitor.  The name of this blob container will be specified in WADDirectoriesTable. |

## Tools to view diagnostic data
Several tools are available to view the data after it is transferred to storage. For example:

* Server Explorer in Visual Studio - If you have installed the Azure Tools for Microsoft Visual Studio, you can use the Azure Storage node in Server Explorer to view read-only blob and table data from your Azure storage accounts. You can display data from your local storage emulator account and also from storage accounts you have created for Azure. For more information, see [Browsing and Managing Storage Resources with Server Explorer](/visualstudio/azure/vs-azure-tools-storage-resources-server-explorer-browse-manage).
* [Microsoft Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md) is a standalone app that enables you to easily work with Azure Storage data on Windows, OSX, and Linux.
* [Azure Management Studio](https://www.cerebrata.com/products/azure-management-studio/introduction) includes Azure Diagnostics Manager which allows you to view, download and manage the diagnostics data collected by the applications running on Azure.

## Next Steps
[Trace the flow in a Cloud Services application with Azure Diagnostics](../../cloud-services/cloud-services-dotnet-diagnostics-trace-flow.md)


