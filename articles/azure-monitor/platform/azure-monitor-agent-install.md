---
title: Install the Azure Monitor agent
description: Overview of the Azure Monitor agent (AMA), which collects monitoring data from the guest operating system of virtual machines.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 08/10/2020

---

# Install the Azure Monitor agent (preview)
The Azure Monitor Agent is implemented as an [Azure VM extension](../../virtual-machines/extensions/overview.md) with the details in the following table. 

| Property | Windows | Linux |
|:---|:---|:---|
| Publisher | Microsoft.Azure.Monitor  | Microsoft.Azure.Monitor |
| Type      | AzureMonitorWindowsAgent | AzureMonitorLinuxAgent  |
| TypeHandlerVersion  | 1.0 | 1.5 |

Install the Azure Monitor agent using any of the methods to install virtual machine agents including the following using PowerShell or CLI. Alternatively, you can install the agent and configure data collection on virtual machines in your Azure subscription using the portal with the procedure described in [Configure data collection for the Azure Monitor agent (preview)](data-collection-rule-azure-monitor-agent.md#create-using-the-azure-portal).

### Windows

# [CLI](#tab/CLI1)

```azurecli
az vm extension set --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --ids {resource ID of the VM}

```

# [PowerShell](#tab/PowerShell1)

```powershell
Set-AzVMExtension -Name AMAWindows -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName {Resource Group Name} -VMName {VM name} -Location eastus
```
---


### Linux

# [CLI](#tab/CLI2)

```azurecli
az vm extension set --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --ids {resource ID of the VM}

```

# [PowerShell](#tab/PowerShell2)

```powershell
Set-AzVMExtension -Name AMALinux -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName {Resource Group Name} -VMName {VM name} -Location eastus
```
---

## Install on Azure Arc


## Next steps

- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.
