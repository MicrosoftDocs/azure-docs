---
title: Update the Network Watcher Extension to the latest the version 
description: Learn how to Update Network Watcher Extension to the latest the version 
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
# How to update the Network Watcher Extension to the latest the version 

## Overview

[Azure Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) is a network performance monitoring, diagnostic, and analytics service that allows monitoring of Azure networks. The Network Watcher Agent virtual machine extension is a requirement for capturing network traffic on demand, and other advanced functionality on Azure virtual machines. 
The Network Watcher extension is used by features like Connection Monitor, Connection Monitor (Preview), Connection Troubleshoot and Packet Capture.   

## Prerequisites
This document assumes you have the Network Watcher Extension installed in your virtual machine and provide instructions for updating it to the latest version. 

## Latest version
The latest version of the Network Watcher extension is currently `1.4.1654.1`.

## Updating your extension 

### Check your extension version  

**Using the Azure portal**

1. Go to the ‘Extensions’ blade of your VM in the Azure portal.   
2. Click on the ‘AzureNetworkWatcher’ extension to see the details pane.  
3. Locate the version number in the ‘Version’ field.  

**Using Azure CLI**
Run the below command from an Azure CLI prompt.   

```azurecli
az vm extension list --resource-group  <ResourceGroupName> --vm-name <VMName>
```

Locate the AzureNetworkWatcher extension in the output and identify the version number from the “TypeHandlerVersion” field in the output.  


**Using PowerShell**
Run the following commands from a PowerShell prompt:   

```powershell
Get-AzVMExtension -ResourceGroupName <ResourceGroupName> -VMName <VMName>  
```

Locate the AzureNetworkWatcher extension in the output and identify the version number from the “TypeHandlerVersion” field in the output.   


### Update your extension

In case, your version is lower than `1.4.1654.1` (the current latest version), update your extension using any of the following options. 

**Option 1: Use PowerShell**

```powershell
#Linux command
Set-AzVMExtension `  -ResourceGroupName "myResourceGroup1" `  -Location "WestUS" `  -VMName "myVM1" `  -Name "AzureNetworkWatcherExtension" `  -Publisher "Microsoft.Azure.NetworkWatcher" -Type "NetworkWatcherAgentLinux"   

#Windows command
Set-AzVMExtension `  -ResourceGroupName "myResourceGroup1" `  -Location "WestUS" `  -VMName "myVM1" `  -Name "AzureNetworkWatcherExtension" `  -Publisher "Microsoft.Azure.NetworkWatcher" -Type "NetworkWatcherAgentWindows"   
```


**Option 2: Use Azure CLI**  

Force upgrade 

```azurecli
#Linux command
az vm extension set --resource-group "myResourceGroup1" --vm-name "myVM1" --name "NetworkWatcherAgentLinux" --publisher "Microsoft.Azure.NetworkWatcher" --force-update

#Windows command
az vm extension set --resource-group "myResourceGroup1" --vm-name "myVM1" --name "NetworkWatcherAgentWindows" --publisher "Microsoft.Azure.NetworkWatcher" --force-update
```

If that doesn't work. Remove and install the extension again, using the steps below. This will automatically add the latest version. 

Removing the extension 

```azurecli
#Same for Linux and Windows
az vm extension delete --resource-group "myResourceGroup1" --vm-name "myVM1" -n "AzureNetworkWatcherExtension"

```

Installing the extension again

```azurecli
#Linux command
az vm extension set --resource-group "DALANDEMO" --vm-name "Linux-01" --name "NetworkWatcherAgentLinux" --publisher "Microsoft.Azure.NetworkWatcher"  

#Windows command
az vm extension set --resource-group "DALANDEMO" --vm-name "Linux-01" --name "NetworkWatcherAgentWindows" --publisher "Microsoft.Azure.NetworkWatcher" 

```

**Option 3: Reboot your VMs**

If you have auto-upgrade set to true for the NetworkWatcher extension. Rebooting your VM install the latest extension.


## Support

If you need more help at any point in this article, you can refer to the Network Watcher Extension documentation ([Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/network-watcher-linux), [Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/network-watcher-windows)) or contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
