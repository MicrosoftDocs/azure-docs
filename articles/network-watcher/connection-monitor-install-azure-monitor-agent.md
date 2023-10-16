---
title: Install Azure Monitor Agent for connection monitor
description: This article describes how to install Azure Monitor Agent.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.custom: ignite-2022, devx-track-azurecli, devx-track-azurepowershell
ms.topic: how-to
ms.date: 10/25/2022
ms.author: halkazwini
#Customer intent: I need to monitor a connection by using Azure Monitor Agent.
---

# Install Azure Monitor Agent 

Azure Monitor Agent is implemented as an Azure virtual machine (VM) extension. You can install Azure Monitor Agent by using any of the methods for installing virtual machine extensions, including those described in the [Azure Monitor Agent overview](../azure-monitor/agents/agents-overview.md) article. 

The following section covers installing Azure Monitor Agent on Azure Arc-enabled servers by using PowerShell and the Azure CLI. For more information, see [Manage Azure Monitor Agent](../azure-monitor/agents/azure-monitor-agent-manage.md?tabs=ARMAgentPowerShell%2CPowerShellWindows%2CPowerShellWindowsArc%2CCLIWindows%2CCLIWindowsArc).

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

## Next steps

- After you've installed the monitoring agents, [create a connection monitor](connection-monitor-create-using-portal.md#create-a-connection-monitor). Then, after you've created a connection monitor, analyze your monitoring data, set alerts, and diagnose issues in your connection monitor and your network. 

- Monitor the network connectivity of your Azure and non-Azure setups by using [Connection Monitor](connection-monitor-overview.md). 
