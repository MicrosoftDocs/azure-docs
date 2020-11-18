---
title: Install the Azure Monitor agent
description: Overview of the Azure Monitor agent (AMA), which collects monitoring data from the guest operating system of virtual machines.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 11/17/2020

---

# Install the Azure Monitor agent (preview)
This article provides the different options currently available to install the Azure Monitor agent on both Azure virtual machines and 

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
> You can only install the 

## Install with PowerShell

### Azure virtual machines
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

### Azure virtual machines
# [Windows](#tab/CLIWindows)
```azurecli
az vm extension set --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --ids {resource ID of the VM}
```
# [Linux](#tab/CLILinux)
```azurecli
az vm extension set --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --ids {resource ID of the VM}
```

## Azure CLI

### Azure virtual machines
# [Windows](#tab/CLIWindowsArc)
```azurecli
az vm extension set --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --ids {resource ID of the VM}
```
# [Linux](#tab/CLILinuxArc)
```azurecli
az connectedmachine machine-extension create --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --ids {resource ID of the VM}
```

## Resource Manager template
Get sample Resource Manager templates for installing the Azure Monitor at [Resource Manager template samples for agents in Azure Monitor](../samples/resource-manager-agent.md#azure-monitor-agent-preview). See [Resource Manager template samples for data collection rules in Azure Monitor](../samples/resource-manager-data-collection-rule.md) for sample templates for creating an association between the agent and a data collection rule.


## Create association with data collection rule
After you install the Azure Monitor agent on a virtual machine, you must create an association between the virtual machine and a data collection for data to be collected. See []



## Next steps

- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.
