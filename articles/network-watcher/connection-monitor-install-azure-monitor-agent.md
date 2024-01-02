---
title: Install and upgrade Azure Monitor Agent - Azure Arc-enabled servers
titleSuffix: Azure Network Watcher
description: Learn how to install, upgrade, and uninstall Azure Monitor Agent on Azure Arc-enabled servers.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 11/15/2023
ms.custom: devx-track-azurecli, devx-track-azurepowershell

#Customer intent: As an Azure administrator, I need to install the Azure Monitor Agent on Azure Arc-enabled servers so I can monitor a connection using the Connection Monitor.
---

# Install and upgrade Azure Monitor Agent on Azure Arc-enabled servers

Azure Monitor Agent is implemented as an Azure virtual machine (VM) extension. You can install Azure Monitor Agent using any of the methods described in [Azure Monitor Agent overview](../azure-monitor/agents/agents-overview.md?toc=/azure/network-watcher/toc.json). 

This article covers installing Azure Monitor Agent on Azure Arc-enabled servers using PowerShell or the Azure CLI. For more information, see [Manage Azure Monitor Agent](../azure-monitor/agents/azure-monitor-agent-manage.md?tabs=ARMAgentPowerShell%2CPowerShellWindows%2CPowerShellWindowsArc%2CCLIWindows%2CCLIWindowsArc).

## Use PowerShell

You can install Azure Monitor Agent on Azure virtual machines and on Azure Arc-enabled servers by using `New-AzConnectedMachineExtension`, the PowerShell cmdlet for adding a virtual machine extension. 

### Install on Azure Arc-enabled servers
Use the following PowerShell command to install Azure Monitor Agent on Azure Arc-enabled servers.
# [Windows](#tab/PowerShellWindowsArc)
```powershell
New-AzConnectedMachineExtension -Name AMAWindows -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location>
```
# [Linux](#tab/PowerShellLinuxArc)
```powershell
New-AzConnectedMachineExtension -Name AMALinux -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location>
```
---

### Uninstall on Azure Arc-enabled servers
Use the following PowerShell command to uninstall Azure Monitor Agent from Azure Arc-enabled servers.

# [Windows](#tab/PowerShellWindowsArc)
```powershell
Remove-AzConnectedMachineExtension -MachineName <arc-server-name> -ResourceGroupName <resource-group-name> -Name AMAWindows
```
# [Linux](#tab/PowerShellLinuxArc)
```powershell
Remove-AzConnectedMachineExtension -MachineName <arc-server-name> -ResourceGroupName <resource-group-name> -Name AMALinux
```
---

### Upgrade on Azure Arc-enabled servers

To perform a *one-time upgrade* of the agent, use the following PowerShell commands.

# [Windows](#tab/PowerShellWindowsArc)
```powershell
$target = @{"Microsoft.Azure.Monitor.AzureMonitorWindowsAgent" = @{"targetVersion"=<target-version-number>}}
Update-AzConnectedExtension -ResourceGroupName $env.ResourceGroupName -MachineName <arc-server-name> -ExtensionTarget $target
```
# [Linux](#tab/PowerShellLinuxArc)
```powershell
$target = @{"Microsoft.Azure.Monitor.AzureMonitorLinuxAgent" = @{"targetVersion"=<target-version-number>}}
Update-AzConnectedExtension -ResourceGroupName $env.ResourceGroupName -MachineName <arc-server-name> -ExtensionTarget $target
```
---
## Use the Azure CLI

You can install Azure Monitor Agent on Azure virtual machines and on Azure Arc-enabled servers by using the Azure CLI command for adding a virtual machine extension.

### Install on Azure Arc-enabled servers
Use the following Azure CLI commands to install Azure Monitor Agent on Azure Arc-enabled servers.

# [Windows](#tab/CLIWindowsArc)
```azurecli
az connectedmachine extension create --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --type AzureMonitorWindowsAgent --machine-name <arc-server-name> --resource-group <resource-group-name> --location <arc-server-location>
```
# [Linux](#tab/CLILinuxArc)
```azurecli
az connectedmachine extension create --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --type AzureMonitorLinuxAgent --machine-name <arc-server-name> --resource-group <resource-group-name> --location <arc-server-location>
```
---

### Uninstall on Azure Arc-enabled servers
Use the following Azure CLI commands to uninstall Azure Monitor Agent from Azure Arc-enabled servers.

# [Windows](#tab/CLIWindowsArc)
```azurecli
az connectedmachine extension delete --name AzureMonitorWindowsAgent --machine-name <arc-server-name> --resource-group <resource-group-name>
```
# [Linux](#tab/CLILinuxArc)
```azurecli
az connectedmachine extension delete --name AzureMonitorLinuxAgent --machine-name <arc-server-name> --resource-group <resource-group-name>
```
---

### Upgrade on Azure Arc-enabled servers
To perform a *one time upgrade* of the agent, use the following CLI commands:
# [Windows](#tab/CLIWindowsArc)
```azurecli
az connectedmachine upgrade-extension --extension-targets "{\"Microsoft.Azure.Monitor.AzureMonitorWindowsAgent\":{\"targetVersion\":\"<target-version-number>\"}}" --machine-name <arc-server-name> --resource-group <resource-group-name>
```
# [Linux](#tab/CLILinuxArc)
```azurecli
az connectedmachine upgrade-extension --extension-targets "{\"Microsoft.Azure.Monitor.AzureMonitorWindowsAgent\":{\"targetVersion\":\"<target-version-number>\"}}" --machine-name <arc-server-name> --resource-group <resource-group-name>
```
---

## Enable the Network Watcher agent 

After your machine is Azure Arc-enabled, it's recognized as an Azure resource. After you enable the Azure Monitor Agent extension, install the Network Watcher extension. The process is similar to installing the Network Watcher extension in an Azure VM. 

To make Connection Monitor recognize your Azure Arc-enabled on-premises machines with the Azure Monitor Agent extension as monitoring sources, install the Network Watcher agent virtual machine extension on them. This extension is also known as the Network Watcher extension. 
To install the Network Watcher extension on your Azure Arc-enabled servers with the Azure Monitor Agent extension installed, see [Monitor network connectivity by using Connection Monitor](connection-monitor-overview.md#agents-for-azure-virtual-machines-and-virtual-machine-scale-sets). 

You can also use the following command to install the Network Watcher extension in your Azure Arc-enabled machine with Azure Monitor Agent extension. 

# [Windows](#tab/PowerShellWindowsArc)
```powershell
New-AzConnectedMachineExtension -Name AzureNetworkWatcherExtension -ExtensionType NetworkWatcherAgentWindows -Publisher Microsoft.Azure.NetworkWatcher -ResourceGroupName $rg -MachineName $vm -Location $location
```
# [Linux](#tab/PowerShellLinuxArc)
```powershell
New-AzConnectedMachineExtension -Name AzureNetworkWatcherExtension -ExtensionType NetworkWatcherAgentLinux -Publisher Microsoft.Azure.NetworkWatcher -ResourceGroupName $rg -MachineName $vm -Location $location
```
---

## Next step

> [!div class="nextstepaction"]
> [create a connection monitor](connection-monitor-create-using-portal.md)
