---
title: Install the Azure Monitor agent
description: Options for installing the Azure Monitor Agent (AMA) on Azure virtual machines and Azure Arc enabled servers.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/19/2021
ms.custom: devx-track-azurepowershell, devx-track-azurecli

---

# Install the Azure Monitor agent
This article provides the different options currently available to install the [Azure Monitor agent](azure-monitor-agent-overview.md) on both Azure virtual machines and Azure Arc enabled servers and also the options to create [associations with data collection rules](data-collection-rule-azure-monitor-agent.md) that define which data the agent should collect.

## Prerequisites
The following prerequisites are required prior to installing the Azure Monitor agent.

- [Managed system identity](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md) must be enabled on Azure virtual machines. This is not required for Azure Arc enabled servers. The system identity will be enabled automatically if the agent is installed as part of the process for [creating and assigning a data collection rule using the Azure portal](#install-with-azure-portal).
- The [AzureResourceManager service tag](../../virtual-network/service-tags-overview.md) must be enabled on the virtual network for the virtual machine.
- The virtual machine must have access to the following HTTPS endpoints:
  - *.ods.opinsights.azure.com
  - *.ingest.monitor.azure.com
  - *.control.monitor.azure.com

> [!IMPORTANT]
> The Azure Monitor agent does not currently support network proxies or private links.

## Virtual machine extension details
The Azure Monitor Agent is implemented as an [Azure VM extension](../../virtual-machines/extensions/overview.md) with the details in the following table. It can be installed using any of the methods to install virtual machine extensions including those described in this article.

| Property | Windows | Linux |
|:---|:---|:---|
| Publisher | Microsoft.Azure.Monitor  | Microsoft.Azure.Monitor |
| Type      | AzureMonitorWindowsAgent | AzureMonitorLinuxAgent  |
| TypeHandlerVersion  | 1.0 | 1.5 |


## Install with Azure portal
To install the Azure Monitor agent using the Azure portal, follow the process to [create a data collection rule](data-collection-rule-azure-monitor-agent.md#create-rule-and-association-in-azure-portal) in the Azure portal. This allows you to associate the data collection rule with one or more Azure virtual machines or Azure Arc enabled servers. The agent will be installed on any of these virtual machines that don't already have it.


## Install with Resource Manager template
You can use Resource Manager templates to install the Azure Monitor agent on Azure virtual machines and on Azure Arc enabled servers and to create an association with data collection rules. You must create any data collection rule prior to creating the association.

Get sample templates for installing the agent and creating the association from the following: 

- [Template to install Azure Monitor agent (Azure and Azure Arc)](../agents/resource-manager-agent.md#azure-monitor-agent-preview) 
- [Template to create association with data collection rule](./resource-manager-data-collection-rules.md)

Install the templates using [any deployment method for Resource Manager templates](../../azure-resource-manager/templates/deploy-powershell.md) such as the following commands.

# [PowerShell](#tab/ARMAgentPowerShell)
```powershell
New-AzResourceGroupDeployment -ResourceGroupName "<resource-group-name>" -TemplateFile "<template-filename.json>" -TemplateParameterFile "<parameter-filename.json>"
```
# [CLI](#tab/ARMAgentCLI)
```powershell
New-AzResourceGroupDeployment -ResourceGroupName "<resource-group-name>" -TemplateFile "<template-filename.json>" -TemplateParameterFile "<parameter-filename.json>"
```
---

## Install with PowerShell
You can install the Azure Monitor agent on Azure virtual machines and on Azure Arc enabled servers using the PowerShell command for adding a virtual machine extension. 

### Azure virtual machines
Use the following PowerShell commands to install the Azure Monitor agent on Azure virtual machines.
# [Windows](#tab/PowerShellWindows)
```powershell
Set-AzVMExtension -Name AMAWindows -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion 1.0
```
# [Linux](#tab/PowerShellLinux)
```powershell
Set-AzVMExtension -Name AMALinux -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion 1.5
```
---

### Azure Arc enabled servers
Use the following PowerShell commands to install the Azure Monitor agent onAzure Arc enabled servers.
# [Windows](#tab/PowerShellWindowsArc)
```powershell
New-AzConnectedMachineExtension -Name AMAWindows -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location>
```
# [Linux](#tab/PowerShellLinuxArc)
```powershell
New-AzConnectedMachineExtension -Name AMALinux -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location>
```
---
## Azure CLI
You can install the Azure Monitor agent on Azure virtual machines and on Azure Arc enabled servers using the Azure CLI command for adding a virtual machine extension. 

### Azure virtual machines
Use the following CLI commands to install the Azure Monitor agent on Azure virtual machines.
# [Windows](#tab/CLIWindows)
```azurecli
az vm extension set --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --ids <vm-resource-id>
```
# [Linux](#tab/CLILinux)
```azurecli
az vm extension set --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --ids <vm-resource-id>
```
---
### Azure Arc enabled servers
Use the following CLI commands to install the Azure Monitor agent onAzure Arc enabled servers.

# [Windows](#tab/CLIWindowsArc)
```azurecli
az connectedmachine extension create --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --machine-name <arc-server-name> --resource-group <resource-group-name> --location <arc-server-location>
```
# [Linux](#tab/CLILinuxArc)
```azurecli
az connectedmachine extension create --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --machine-name <arc-server-name> --resource-group <resource-group-name> --location <arc-server-location>
```
---


## Next steps

- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.
