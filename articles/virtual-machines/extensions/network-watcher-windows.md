---
title: Network Watcher Agent VM extension - Windows 
description: Deploy the Network Watcher Agent virtual machine extension on Windows virtual machines.
ms.topic: conceptual
ms.service: virtual-machines
ms.subservice: extensions
ms.author: halkazwini
author: halkazwini
ms.collection: windows
ms.date: 06/09/2023
ms.custom: template-concept, engagement-fy23
---

# Network Watcher Agent virtual machine extension for Windows

[Azure Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) is a network performance monitoring, diagnostic, and analytics service that allows monitoring for Azure networks. The Network Watcher Agent virtual machine extension is a requirement for some of the Network Watcher features on Azure virtual machines (VMs), such as capturing network traffic on demand, and other advanced functionality.

This article details the supported platforms and deployment options for the Network Watcher Agent VM extension for Windows. Installation of the agent doesn't disrupt, or require a reboot of the virtual machine. You can install the extension on virtual machines that you deploy. If the virtual machine is deployed by an Azure service, check the documentation for the service to determine whether or not it permits installing extensions in the virtual machine.

## Prerequisites

### Operating system

The Network Watcher Agent extension for Windows can be configured for Windows Server 2008 R2, 2012, 2012 R2, 2016, 2019 and 2022 releases. Nano Server isn't supported at this time.

### Internet connectivity

Some of the Network Watcher Agent functionality requires that the virtual machine is connected to the Internet. Without the ability to establish outgoing connections, the Network Watcher Agent won't be able to upload packet captures to your storage account. For more details, please see the [Network Watcher documentation](../../network-watcher/index.yml).

## Extension schema

The following JSON shows the schema for the Network Watcher Agent extension. The extension doesn't require, or support, any user-supplied settings, and relies on its default configuration.

```json
{
    "type": "extensions",
    "name": "Microsoft.Azure.NetworkWatcher",
    "apiVersion": "[variables('apiVersion')]",
    "location": "[resourceGroup().location]",
    "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
    ],
    "properties": {
        "publisher": "Microsoft.Azure.NetworkWatcher",
        "type": "NetworkWatcherAgentWindows",
        "typeHandlerVersion": "1.4",
        "autoUpgradeMinorVersion": true
    }
}
```

### Property values

| Name | Value / Example |
| ---- | ---- |
| apiVersion | 2022-11-01 |
| publisher | Microsoft.Azure.NetworkWatcher |
| type | NetworkWatcherAgentWindows |
| typeHandlerVersion | 1.4 |


## Template deployment

You can deploy Azure VM extensions with an Azure Resource Manager template (ARM template) using the previous JSON [schema](#extension-schema).

## PowerShell deployment

Use the `Set-AzVMExtension` command to deploy the Network Watcher Agent virtual machine extension to an existing virtual machine:

```powershell
Set-AzVMExtension `
  -ResourceGroupName "myResourceGroup1" `
  -Location "WestUS" `
  -VMName "myVM1" `
  -Name "networkWatcherAgent" `
  -Publisher "Microsoft.Azure.NetworkWatcher" `
  -Type "NetworkWatcherAgentWindows" `
  -TypeHandlerVersion "1.4"
```

## Troubleshooting and support

### Troubleshooting

You can retrieve data about the state of extension deployments from the Azure portal and PowerShell. To see the deployment state of extensions for a given VM, run the following command using the Azure PowerShell module:

```powershell
Get-AzVMExtension -ResourceGroupName myResourceGroup1 -VMName myVM1 -Name networkWatcherAgent
```

Extension execution output is logged to files found in the following directory:

```cmd
C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.NetworkWatcher.NetworkWatcherAgentWindows\
```

### Support

If you need more help at any point in this article, you can refer to the [Network Watcher documentation](../../network-watcher/index.yml), or contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
