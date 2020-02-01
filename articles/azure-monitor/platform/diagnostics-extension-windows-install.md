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
Azure Diagnostics extension is an agent in Azure Monitor that collects monitoring data from the guest operating system and workloads of Azure virtual machines and other compute resources with a Windows guest operating system. This article provides details on installing and configuring the Windows diagnostics extension and a description of how the data is stored in and Azure Storage account.

The Diagnostic extension is implemented as a [virtual machine extension](/virtual-machines/extensions/overview) in Azure, so it supports the same installation options using Resource Manager templates, PowerShell, and CLI. See [Virtual machine extensions and features for Windows](/virtual-machines/extensions/features-windows) for details on installing and maintaining virtual machine extensions.

## Install with Azure portal
You can install and configure the diagnostics extension on an individual virtual machine in the Azure portal which provides you an interface as opposed to working directly with the configuration. When you enable the diagnostics extension, it will automatically use a default configuration ith the most common performance counters and events. You can modify this default configuration according to your specific requirements.

> [!NOTE]
> You cannot configure the diagnostics extension to send data to Azure Event Hubs using the Azure portal. To configure this, you must use one of the other configuration methods.

1. Open the menu for a virtual machine in the Azure portal.
2. Click on **Diagnostic settings** in the **Monitoring** section of the VM menu.
3. Click **Enable guest-level monitoring** if the diagnostics extension hasn't already been enabled.
4. A new Azure Storage account will be created for the VM with the name will be based on the name of the resource group for the VM. You can attach the VM to another storage account by selecting the **Agent** tab.

You can modify the default configuration once the diagnostics extension has been enabled. The following table describes the options you can modify in the different tabs. Some options have a **Custom** command which allows you to specify more detailed configuration; see [Windows diagnostics extension schema](diagnostics-extension-schema-windows.md) for details on different settings.

| Tab | Description |
|:---|:---|
| Overview | Displays the current configuration with links to the other tabs. |
| Performance counters | Select the performance counters to collect and the sample rate for each.  |
| Logs | Select the log data to collect. This includes Windows Event logs, IIS logs, .NET application logs and ETW events.  |
| Crash dumps | Enable crash dump for different processes. |
| Sinks | Enable data sinks to send data to destinations in addition to Azure Storage.<br>Azure Monitor - Sends performance data to Azure Monitor Metrics.<br>Application Insights - Send data to Application Insights application. |
| Agent | Modify the following configuration for the agent:<br>- Change the storage account.<br>- Specify the maximum local disk used for the agent.<br>- Configure logs for the health of the agent itself.|


## Resource Manager template
Azure VM extensions can be deployed with Azure Resource Manager templates. The JSON schema detailed in the previous section can be used in an Azure Resource Manager template to run the Azure Diagnostics extension during an Azure Resource Manager template deployment. See [Use monitoring and diagnostics with a Windows VM and Azure Resource Manager templates](../../virtual-machines/extensions/extensions-diagnostics-template.md).

## Azure CLI deployment
The Azure CLI can be used to deploy the Azure Diagnostics extension to an existing virtual machine using [az vm extension set](https://docs.microsoft.com/cli/azure/vm/extension?view=azure-cli-latest#az-vm-extension-set) as in the following example. The protected settings are defined in the [PrivateConfig element](diagnostics-extension-schema-windows.md#privateconfig-element) of the configuration schema, while the public settings are defined in the [Public element](diagnostics-extension-schema-windows.md#publicconfig-element). See [Example configuration](diagnostics-extension-schema-windows.md#example-configuration) for a complete example of the private and public settings.

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name IaaSDiagnostics \
  --publisher Microsoft.Azure.Diagnostics \
  --version 1.9.0.0 --protected-settings protected-settings.json \
  --settings public-settings.json 
```

## PowerShell deployment
PowerShell can be used to deploy the Azure Diagnostics extension to an existing virtual machine using [Set-AzVMDiagnosticsExtension](https://docs.microsoft.com/powershell/module/servicemanagement/azure/set-azurevmdiagnosticsextension). The public settings are defined in the [Public element](diagnostics-extension-schema-windows.md#publicconfig-element). See [Example configuration](diagnostics-extension-schema-windows.md#example-configuration) for a complete example of the public settings.


See also [Use PowerShell to enable Azure Diagnostics in a virtual machine running Windows](../../virtual-machines/extensions/diagnostics-windows.md).

```powershell
$vm_resourcegroup = "myvmresourcegroup"
$vm_name = "myvm"
$diagnosticsconfig_path = "DiagnosticsPubConfig.xml"

Set-AzVMDiagnosticsExtension -ResourceGroupName $vm_resourcegroup `
  -VMName $vm_name `
  -DiagnosticsConfigurationPath $diagnosticsconfig_path
```

> [!IMPORTANT]
> When you enable the diagnostics extension, you incur costs for the storage resources that your diagnostic data uses.
 

## Data storage
The following table lists the different types of data collected from the diagnostics extension and whether they're stored as a table or a blob. Some 


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
- See [Send data from Windows Azure diagnostics extension to Event Hubs](diagnostics-extension-stream-event-hubs.md) for details on forwarding monitoring data to Azure Event Hubs.
