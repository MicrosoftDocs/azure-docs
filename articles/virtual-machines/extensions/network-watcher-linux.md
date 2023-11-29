---
title: Network Watcher Agent VM extension - Linux 
description: Deploy the Network Watcher Agent virtual machine extension on Linux virtual machines.
ms.topic: conceptual
ms.service: virtual-machines
ms.subservice: extensions
author: halkazwini
ms.author: halkazwini
ms.collection: linux
ms.date: 06/29/2023
ms.custom: devx-track-azurecli, devx-track-linux
---

# Network Watcher Agent virtual machine extension for Linux

[Azure Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) is a network performance monitoring, diagnostic, and analytics service that allows monitoring for Azure networks. The Network Watcher Agent virtual machine extension is a requirement for some of the Network Watcher features on Azure virtual machines (VMs), such as capturing network traffic on demand, and other advanced functionality.

This article details the supported platforms and deployment options for the Network Watcher Agent VM extension for Linux. Installation of the agent doesn't disrupt, or require a reboot of the virtual machine. You can install the extension on virtual machines that you deploy. If the virtual machine is deployed by an Azure service, check the documentation for the service to determine whether or not it permits installing extensions in the virtual machine.

> [!NOTE]
> Network Watcher Agent extension is not supported on AKS clusters.

## Prerequisites

### Operating system

The Network Watcher Agent extension can be configured for the following Linux distributions:

| Distribution | Version |
|---|---|
| AlmaLinux  | 9.2 |
| Azure Linux | 2.0 |
| CentOS | 6.10 and 7 |
| Debian | 7 and 8 |
| OpenSUSE Leap | 42.3+ |
| Oracle Linux | 6.10, 7 and 8+ |
| Red Hat Enterprise Linux (RHEL) | 6.10, 7, 8 and 9.2 |
| Rocky Linux | 9.1 |
| SUSE Linux Enterprise Server (SLES) | 12 and 15 (SP2, SP3 and SP4) |
| Ubuntu | 16+ |

> [!NOTE]
> - Red Hat Enterprise Linux 6.X and Oracle Linux 6.x have reached their end-of-life (EOL). RHEL 6.10 has available [extended life cycle (ELS) support](https://www.redhat.com/en/resources/els-datasheet) through [June 30, 2024]( https://access.redhat.com/product-life-cycles/?product=Red%20Hat%20Enterprise%20Linux,OpenShift%20Container%20Platform%204).
> - Oracle Linux version 6.10 has available [ELS support](https://www.oracle.com/a/ocom/docs/linux/oracle-linux-extended-support-ds.pdf) through [July 1, 2024](https://www.oracle.com/a/ocom/docs/elsp-lifetime-069338.pdf).

### Internet connectivity

Some of the Network Watcher Agent functionality requires that the virtual machine is connected to the Internet. Without the ability to establish outgoing connections, some of the Network Watcher Agent features may malfunction, or become unavailable. For more information about Network Watcher functionality that requires the agent, see the [Network Watcher documentation](../../network-watcher/index.yml).

## Extension schema

The following JSON shows the schema for the Network Watcher Agent extension. The extension doesn't require, or support, any user-supplied settings. The extension relies on its default configuration.

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
        "type": "NetworkWatcherAgentLinux",
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
| type | NetworkWatcherAgentLinux |
| typeHandlerVersion | 1.4 |

## Template deployment

You can deploy Azure VM extensions with an Azure Resource Manager template (ARM template) using the previous JSON [schema](#extension-schema).

## Azure classic CLI deployment

[!INCLUDE [classic-vm-deprecation](../../../includes/classic-vm-deprecation.md)]

The following example deploys the Network Watcher Agent VM extension to an existing VM deployed through the classic deployment model:

```console
azure config mode asm
azure vm extension set myVM1 NetworkWatcherAgentLinux Microsoft.Azure.NetworkWatcher 1.4
```

## Azure CLI deployment

The following example deploys the Network Watcher Agent VM extension to an existing VM deployed through Resource Manager:

```azurecli
az vm extension set --resource-group myResourceGroup1 --vm-name myVM1 --name NetworkWatcherAgentLinux --publisher Microsoft.Azure.NetworkWatcher --version 1.4
```

## Troubleshooting and support

### Troubleshooting

You can retrieve data about the state of extension deployments using either the Azure portal or Azure CLI.

The following example shows the deployment state of the NetworkWatcherAgentLinux extension for a VM deployed through Resource Manager, using the Azure CLI:

```azurecli
az vm extension show --name NetworkWatcherAgentLinux --resource-group myResourceGroup1 --vm-name myVM1
```

### Support

If you need more help at any point in this article, you can refer to the [Network Watcher documentation](../../network-watcher/index.yml), or contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get support**. For information about using Azure Support, see the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
