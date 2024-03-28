---
title: Manage Network Watcher Agent VM extension - Windows 
description: Learn about the Network Watcher Agent virtual machine extension on Windows virtual machines and how to deploy it.
author: halkazwini
ms.author: halkazwini
ms.service: virtual-machines
ms.subservice: extensions
ms.topic: how-to
ms.date: 03/28/2024
ms.collection: windows

#CustomerIntent: As an Azure administrator, I want to learn about Network Watcher Agent VM extension so that I can use Network watcher features to diagnose and monitor my VMs.
---

# Manage Network Watcher Agent virtual machine extension for Windows

[Azure Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) is a network performance monitoring, diagnostic, and analytics service that allows monitoring for Azure networks. The Network Watcher Agent virtual machine extension is a requirement for some of the Network Watcher features on Azure virtual machines (VMs). For more information, see [Network Watcher Agent FAQ](../../network-watcher/frequently-asked-questions.md#network-watcher-agent).

In this article, you learn about the supported platforms and deployment options for the Network Watcher Agent VM extension for Windows. Installation of the agent doesn't disrupt, or require a reboot of the virtual machine. You can install the extension on virtual machines that you deploy. If the virtual machine is deployed by an Azure service, check the documentation for the service to determine whether or not it permits installing extensions in the virtual machine.

## Prerequisites

Network Watcher Agent virtual machine extension for Windows has the following prerequisites:

- An Azure Windows virtual machine. For more information, see [Supported Windows versions](supported-windows-versions).

- Internet connectivity: Some of the Network Watcher Agent functionality requires that the virtual machine is connected to the Internet. Without the ability to establish outgoing connections, the Network Watcher Agent can't upload packet captures to your storage account. For more information, see [Packet capture overview](../../network-watcher/packet-capture-overview.md).


## Supported Windows versions

Network Watcher Agent extension for Windows can be configured for Windows Server 2012, 2012 R2, 2016, 2019 and 2022 releases. Currently, Nano Server isn't supported.

## Extension schema

The following JSON shows the schema for the Network Watcher Agent extension. The extension doesn't require, or support, any user-supplied settings, and relies on its default configuration.

```json
{
    "name": "[concat(parameters('vmName'), '/AzureNetworkWatcherExtension')]",
    "type": "Microsoft.Compute/virtualMachines/extensions",
    "apiVersion": "2023-03-01",
    "location": "[resourceGroup().location]",
    "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachines/', parameters('vmName'))]"
    ],
    "properties": {
        "autoUpgradeMinorVersion": true,
        "publisher": "Microsoft.Azure.NetworkWatcher",
        "type": "NetworkWatcherAgentWindows",
        "typeHandlerVersion": "1.4"
    }
}
```

## Install the extension

# [**Portal**](#tab/portal)


# [**PowerShell**](#tab/powershell)


Use the `Set-AzVMExtension` command to deploy the Network Watcher Agent virtual machine extension to an existing virtual machine:

```powershell
Set-AzVMExtension `
  -ResourceGroupName "myResourceGroup" `
  -Location "WestUS" `
  -VMName "myVM" `
  -Name "networkWatcherAgent" `
  -Publisher "Microsoft.Azure.NetworkWatcher" `
  -Type "NetworkWatcherAgentWindows" `
  -TypeHandlerVersion "1.4"
```

# [**Azure CLI**](#tab/cli)


# [**Resource Manager**](#tab/arm)

You can deploy Azure VM extensions with an Azure Resource Manager template (ARM template) using the previous JSON [schema](#extension-schema).

---


## Troubleshoot

You can retrieve data about the state of extension deployments from the Azure portal and PowerShell. To see the deployment state of extensions for a given VM, run the following command using the Azure PowerShell module:

```powershell
Get-AzVMExtension -ResourceGroupName myResourceGroup1 -VMName myVM1 -Name networkWatcherAgent
```

Extension execution output is logged to files found in the following directory:

```cmd
C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.NetworkWatcher.NetworkWatcherAgentWindows\
```

## Related content

- [Network Watcher documentation](../../network-watcher/index.yml).
- [Microsoft Q&A - Network Watcher](/answers/topics/azure-network-watcher.html).
