---
title: Update the Network Watcher extension to the latest version 
description: Learn how to update the Azure Network Watcher extension to the latest version.
services: virtual-machines-windows
documentationcenter: ''
author: damendo
manager: balar
editor: ''
tags: azure-resource-manager


ms.service: virtual-machines-windows
ms.topic: article
ms.workload: infrastructure-services
ms.date: 09/23/2020
ms.author: damendo

---
# Update the Network Watcher extension to the latest version

## Overview

[Azure Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) is a network performance monitoring, diagnostic, and analytics service that monitors Azure networks. The Network Watcher Agent virtual machine (VM) extension is a requirement for capturing network traffic on demand and using other advanced functionality on Azure VMs. The Network Watcher extension is used by features like Connection Monitor, Connection Monitor (preview), connection troubleshoot, and packet capture.

## Prerequisites

This article assumes you have the Network Watcher extension installed in your VM.

## Latest version

The latest version of the Network Watcher extension is currently `1.4.1654.1`.

## Update your extension

To update your extension, you need to know your extension version.

### Check your extension version

You can check your extension version by using the Azure portal, the Azure CLI, or PowerShell.

#### Use the Azure portal

1. Go to the **Extensions** pane of your VM in the Azure portal.
1. Select the **AzureNetworkWatcher** extension to see the details pane.
1. Locate the version number in the **Version** field.  

#### Use the Azure CLI

Run the following command from an Azure CLI prompt:

```azurecli
az vm get-instance-view --resource-group  "SampleRG" --name "Sample-VM"
```
Locate **"AzureNetworkWatcherExtension"** in the output and identify the version number from the “TypeHandlerVersion” field in the output.  
Please note: Information about the extension appears multiple times in the JSON output. Please look under the "extensions" block and you should see the full version number of the extension. 

You should see something like the below:
![Azure CLI Screenshot](./media/network-watcher/CLI_Screenshot.png)

#### Use PowerShell

Run the following commands from a PowerShell prompt:

```powershell
Get-AzVM -ResourceGroupName "SampleRG" -Name "Sample-VM" -Status
```
Locate the Azure Network Watcher extension in the output and identify the version number from the “TypeHandlerVersion” field in the output.   

You should see something like the below:
![PowerShell Screenshot](./media/network-watcher/PS_screenshot.png)

### Update your extension

If your version is earlier than `1.4.1654.1`, which is the current latest version, update your extension by using any of the following options.

#### Option 1: Use PowerShell

Run the following commands:

```powershell
#Linux command
Set-AzVMExtension `  -ResourceGroupName "myResourceGroup1" `  -Location "WestUS" `  -VMName "myVM1" `  -Name "AzureNetworkWatcherExtension" `  -Publisher "Microsoft.Azure.NetworkWatcher" -Type "NetworkWatcherAgentLinux"   

#Windows command
Set-AzVMExtension `  -ResourceGroupName "myResourceGroup1" `  -Location "WestUS" `  -VMName "myVM1" `  -Name "AzureNetworkWatcherExtension" `  -Publisher "Microsoft.Azure.NetworkWatcher" -Type "NetworkWatcherAgentWindows"   
```

If that doesn't work. Remove and install the extension again, using the steps below. This will automatically add the latest version.

Removing the extension 

```powershell
#Same command for Linux and Windows
Remove-AzVMExtension -ResourceGroupName "SampleRG" -VMName "Sample-VM" -Name "AzureNetworkWatcherExtension"
``` 

Installing the extension again

```powershell
#Linux command
Set-AzVMExtension -ResourceGroupName "SampleRG" -Location "centralus" -VMName "Sample-VM" -Name "AzureNetworkWatcherExtension" -Publisher "Microsoft.Azure.NetworkWatcher" -Type "NetworkWatcherAgentLinux" -typeHandlerVersion "1.4"

#Windows command
Set-AzVMExtension -ResourceGroupName "SampleRG" -Location "centralus" -VMName "Sample-VM" -Name "AzureNetworkWatcherExtension" -Publisher "Microsoft.Azure.NetworkWatcher" -Type "NetworkWatcherAgentWindows" -typeHandlerVersion "1.4"
```

#### Option 2: Use the Azure CLI

Force an upgrade.

```azurecli
#Linux command
az vm extension set --resource-group "myResourceGroup1" --vm-name "myVM1" --name "NetworkWatcherAgentLinux" --publisher "Microsoft.Azure.NetworkWatcher" --force-update

#Windows command
az vm extension set --resource-group "myResourceGroup1" --vm-name "myVM1" --name "NetworkWatcherAgentWindows" --publisher "Microsoft.Azure.NetworkWatcher" --force-update
```

If that doesn't work, remove and install the extension again, and follow these steps to automatically add the latest version.

Remove the extension.

```azurecli
#Same for Linux and Windows
az vm extension delete --resource-group "myResourceGroup1" --vm-name "myVM1" -n "AzureNetworkWatcherExtension"

```

Install the extension again.

```azurecli
#Linux command
az vm extension set --resource-group "DALANDEMO" --vm-name "Linux-01" --name "NetworkWatcherAgentLinux" --publisher "Microsoft.Azure.NetworkWatcher"  

#Windows command
az vm extension set --resource-group "DALANDEMO" --vm-name "Linux-01" --name "NetworkWatcherAgentWindows" --publisher "Microsoft.Azure.NetworkWatcher" 

```

#### Option 3: Reboot your VMs

If you have auto-upgrade set to true for the Network Watcher extension, reboot your VM installation to the latest extension.

## Support

If you need more help at any point in this article, see the Network Watcher extension documentation for [Linux](./network-watcher-linux.md) or [Windows](./network-watcher-windows.md). You can also contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get support**. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
