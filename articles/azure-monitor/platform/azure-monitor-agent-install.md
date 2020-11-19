---
title: Install the Azure Monitor agent
description: Options for installing the Azure Monitor Agent (AMA) on Azure virtual machines and Azure Arc enabled servers.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 11/17/2020

---

# Install the Azure Monitor agent (preview)
This article provides the different options currently available to install the [Azure Monitor agent](azure-monitor-agent-overview.md) on both Azure virtual machines and Azure Arc enabled servers and also the options to create [associations with data collection rules](data-collection-rule-azure-monitor-agent.md).

## Virtual machine extension details
The Azure Monitor Agent is implemented as an [Azure VM extension](../../virtual-machines/extensions/overview.md) with the details in the following table. It can be installed using any of the methods to install virtual machine extensions including those described in this article.

| Property | Windows | Linux |
|:---|:---|:---|
| Publisher | Microsoft.Azure.Monitor  | Microsoft.Azure.Monitor |
| Type      | AzureMonitorWindowsAgent | AzureMonitorLinuxAgent  |
| TypeHandlerVersion  | 1.0 | 1.5 |


## Install with Azure portal
To install the Azure Monitor agent using the Azure portal, follow the process to [create a data collection rule](data-collection-rule-azure-monitor-agent.md#create-using-the-azure-portal) in the Azure portal. This allows you to associate the data collection rule with one or more Azure virtual machines. The agent will be installed on any of these virtual machines that don't already have it.

> [!NOTE]
> You can only install the Azure Monitor agent on Azure virtual machines using the Azure portal. FOr Azure Arc enabled servers, use one of the methods described below.


## Install with Resource Manager template
You can use Resource Manager templates to install the Azure Monitor agent on Azure virtual machines and on Azure Arc enabled servers and to create an association with data collection rules. You must create any data collection rule prior to creating the association.

Get sample templates for installing the agent and creating the association at the following locations: 

- [Install Azure Monitor agent](../samples/resource-manager-agent.md#azure-monitor-agent-preview) 
- [Create association with data collection rule](../samples/resource-manager-data-collection-rule.md)

Install the templates using [any deployment method for Resource Manager templates](../../azure-resource-manager/templates/deploy-powershell.md) such as the following commands.

# [PowerShell](#tab/ARMAgentPowerShell)
```powershell
New-AzResourceGroupDeployment -ResourceGroupName "<resource-group-name>" -TemplateFile "<template-filename.json>" -TemplateParameterFile "<parameter-filename.json>"
```
# [CLI](#tab/ARMAgentCLI)
```powershell
New-AzResourceGroupDeployment -ResourceGroupName "<resource-group-name>" -TemplateFile "<template-filename.json>" -TemplateParameterFile "<parameter-filename.json>"
```
.
## Install with PowerShell
You can install the Azure Monitor agent on Azure virtual machines and on Azure Arc enabled servers using the PowerShell command for adding a virtual machine extension. 

### Azure virtual machines
Use the following commands to install the Azure Monitor agent on Azure virtual machines.
# [Windows](#tab/PowerShellWindows)
```powershell
Set-AzVMExtension -Name AMAWindows -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName {Resource Group Name} -VMName {VM name} -Location eastus
```
# [Linux](#tab/PowerShellLinux)
```powershell
Set-AzVMExtension -Name AMALinux -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName {Resource Group Name} -VMName {VM name} -Location eastus
```
---

### Azure Arc enabled servers
Use the following commands to install the Azure Monitor agent onAzure Arc enabled servers.
# [Windows](#tab/PowerShellWindowsArc)
```powershell
New-AzConnectedMachineExtension -Name AMAWindows -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName {Resource Group Name} -VMName {VM name} -Location {location}
```
# [Linux](#tab/PowerShellLinuxArc)
```powershell
New-AzConnectedMachineExtension -Name AMALinux -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName {Resource Group Name} -VMName {VM name} -Location {location}
```
---
## Azure CLI
You can install the Azure Monitor agent on Azure virtual machines and on Azure Arc enabled servers using the Azure CLI command for adding a virtual machine extension. 

### Azure virtual machines
Use the following commands to install the Azure Monitor agent on Azure virtual machines.
# [Windows](#tab/CLIWindows)
```azurecli
az vm extension set --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --ids {resource ID of the VM}
```
# [Linux](#tab/CLILinux)
```azurecli
az vm extension set --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --ids {resource ID of the VM}
```
---
### Azure virtual machines
Use the following commands to install the Azure Monitor agent onAzure Arc enabled servers.

# [Windows](#tab/CLIWindowsArc)
```azurecli
az connectedmachine machine-extension create --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --ids {resource ID of the VM}
```
# [Linux](#tab/CLILinuxArc)
```azurecli
az connectedmachine machine-extension create --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --ids {resource ID of the VM}
```
---


## Next steps

- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.
