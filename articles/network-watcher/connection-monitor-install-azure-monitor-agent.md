---
title: Install Azure monitor agent for connection monitor
description: This article describes how to install Azure monitor agent
services: network-watcher
author: v-ksreedevan
ms.service: network-watcher
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 09/11/2022
ms.author: v-ksreedevan
#Customer intent: I need to monitor a connection using Azure Monitor agent.
---

# Install Azure Monitor Agent 

The Azure Monitor agent is implemented as an Azure VM extension with the details in the following table. It can be installed using any of the methods to install virtual machine extensions including those described in this article. [Learn more](../azure-monitor/agents/agents-overview.md) about Azure Monitor. 

The following section covers installing an Azure Monitor Agent on Arc-enabled servers using PowerShell and Azure CLI. For more information, see [Manage the Azure Monitor Agent](../azure-monitor/agents/azure-monitor-agent-manage.md?tabs=ARMAgentPowerShell%2CPowerShellWindows%2CPowerShellWindowsArc%2CCLIWindows%2CCLIWindowsArc).

## Using PowerShell
You can install the Azure Monitor agent on Azure virtual machines and on Azure Arc-enabled servers using New-AzConnectedMachineExtension, the PowerShell cmdlet for adding a virtual machine extension. 

### Install on Azure Arc-enabled servers
Use the following PowerShell commands to install the Azure Monitor agent on Azure Arc-enabled servers.
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
Use the following PowerShell commands to uninstall the Azure Monitor agent from the Azure Arc-enabled servers.

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

To perform a **one time** upgrade of the agent, use the following PowerShell commands:

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
## Using Azure CLI

You can install the Azure Monitor agent on Azure virtual machines and on Azure Arc-enabled servers using the Azure CLI command for adding a virtual machine extension.

### Install on Azure Arc-enabled servers
Use the following CLI commands to install the Azure Monitor agent on Azure Arc-enabled servers.

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
Use the following CLI commands to uninstall the Azure Monitor agent from the Azure Arc-enabled servers.

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
To perform a **one time upgrade** of the agent, use the following CLI commands:
# [Windows](#tab/CLIWindowsArc)
```azurecli
az connectedmachine upgrade-extension --extension-targets "{\"Microsoft.Azure.Monitor.AzureMonitorWindowsAgent\":{\"targetVersion\":\"<target-version-number>\"}}" --machine-name <arc-server-name> --resource-group <resource-group-name>
```
# [Linux](#tab/CLILinuxArc)
```azurecli
az connectedmachine upgrade-extension --extension-targets "{\"Microsoft.Azure.Monitor.AzureMonitorWindowsAgent\":{\"targetVersion\":\"<target-version-number>\"}}" --machine-name <arc-server-name> --resource-group <resource-group-name>
```
---

## Enable Network Watcher Agent 

After your machine is Arc-enabled, the same is recognized as an Azure resource. After enabling the Azure Monitor Agent extension, follow the steps to install the Network Watcher extension. The steps are similar to installing the Network Watcher extension in an Azure VM. 

To make Connection Monitor recognize your Azure Arc-enabled on-premises machines with Azure Monitor Agent extension as monitoring sources, install the Network Watcher Agent virtual machine extension on them. This extension is also known as the Network Watcher extension. 
Refer [here](connection-monitor-overview.md#agents-for-azure-virtual-machines-and-virtual-machine-scale-sets) to install the Network Watcher extension on your Azure Arc-enabled servers with Azure Monitor Agent extension installed. 

You can also use the following command to install the Network Watcher extension in your Arc-enabled machine with Azure Monitor Agent extension. 

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

- After installing the monitoring agents, proceed to [create a Connection Monitor](connection-monitor-create-using-portal.md#create-a-connection-monitor). After creating a Connection Monitor, analyze monitoring data and set alerts. Diagnose issues in your connection monitor and your network. 

- Monitor the network connectivity of your Azure and Non-Azure set-ups using [Connection Monitor](connection-monitor-overview.md). 
