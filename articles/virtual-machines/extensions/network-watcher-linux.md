---
title: Manage Network Watcher Agent VM extension - Linux
description: Learn about the Network Watcher Agent virtual machine extension for Linux virtual machines and how to install and uninstall it.
author: halkazwini
ms.author: halkazwini
ms.service: virtual-machines
ms.subservice: extensions
ms.topic: how-to
ms.collection: linux
ms.date: 03/31/2024
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-arm-template, linux-related-content
---

# Manage Network Watcher Agent virtual machine extension for Linux

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

[Azure Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) is a network performance monitoring, diagnostic, and analytics service that allows monitoring for Azure networks. The Network Watcher Agent virtual machine extension is a requirement for some of the Network Watcher features on Azure virtual machines (VMs), such as capturing network traffic on demand, and other advanced functionality.

In this article, you learn about the supported platforms and deployment options for the Network Watcher Agent VM extension for Linux. Installation of the agent doesn't disrupt, or require a reboot of the virtual machine. You can install the extension on virtual machines that you deploy. If the virtual machine is deployed by an Azure service, check the documentation for the service to determine whether or not it permits installing extensions in the virtual machine.

> [!NOTE]
> Network Watcher Agent extension is not supported on AKS clusters.

## Prerequisites

# [**Portal**](#tab/portal)

- An Azure Linux virtual machine (VM). For more information, see [Supported operating systems](#supported-operating-systems).

- Internet connectivity: some of the Network Watcher Agent functionality requires that the virtual machine is connected to the internet. For example, without the ability to establish outgoing connections, the Network Watcher Agent can't upload packet captures to your storage account. For more information, see [Packet capture overview](../../network-watcher/packet-capture-overview.md).

# [**PowerShell**](#tab/powershell)

- An Azure Linux virtual machine (VM). For more information, see [Supported operating systems](#supported-operating-systems).

- Internet connectivity: some of the Network Watcher Agent functionality requires that the virtual machine is connected to the internet. For example, without the ability to establish outgoing connections, the Network Watcher Agent can't upload packet captures to your storage account. For more information, see [Packet capture overview](../../network-watcher/packet-capture-overview.md).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. This article requires the Azure PowerShell `Az` module. To find the installed version, run `Get-Module -ListAvailable Az`. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure Linux virtual machine (VM). For more information, see [Supported operating systems](#supported-operating-systems).

- Internet connectivity: some of the Network Watcher Agent functionality requires that the virtual machine is connected to the internet. For example, without the ability to establish outgoing connections, the Network Watcher Agent can't upload packet captures to your storage account. For more information, see [Packet capture overview](../../network-watcher/packet-capture-overview.md).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

# [**Resource Manager**](#tab/arm)

- An Azure Linux virtual machine (VM). For more information, see [Supported operating systems](#supported-operating-systems).

- Internet connectivity: some of the Network Watcher Agent functionality requires that the virtual machine is connected to the internet. For example, without the ability to establish outgoing connections, the Network Watcher Agent can't upload packet captures to your storage account. For more information, see [Packet capture overview](../../network-watcher/packet-capture-overview.md).

- Azure PowerShell or Azure CLI installed locally to deploy the template. 

    - You can [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet to sign in to Azure.

    - You can [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. Use [az login](/cli/azure/reference-index#az-login) command to sign in to Azure.

---

## Supported operating systems

Network Watcher Agent extension for Linux can be installed on the following Linux distributions:

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

## Extension schema

The following JSON shows the schema for the Network Watcher Agent extension. The extension doesn't require, or support, any user-supplied settings. The extension relies on its default configuration.

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
        "type": "NetworkWatcherAgentLinux",
        "typeHandlerVersion": "1.4"
    }
}
```

## Template deployment

You can deploy Azure VM extensions with an Azure Resource Manager template (ARM template) using the previous JSON [schema](#extension-schema).

## Azure CLI deployment

The following example deploys the Network Watcher Agent VM extension to an existing VM deployed through Resource Manager:

```azurecli
az vm extension set --resource-group myResourceGroup1 --vm-name myVM1 --name NetworkWatcherAgentLinux --publisher Microsoft.Azure.NetworkWatcher --version 1.4
```

## Troubleshooting

You can retrieve data about the state of extension deployments using either the Azure portal or Azure CLI.

The following example shows the deployment state of the NetworkWatcherAgentLinux extension for a VM deployed through Resource Manager, using the Azure CLI:

```azurecli
az vm extension show --name NetworkWatcherAgentLinux --resource-group myResourceGroup1 --vm-name myVM1
```

## Related content

- [Update Azure Network Watcher extension to the latest version](network-watcher-update.md).
- [Network Watcher documentation](../../network-watcher/index.yml).
- [Microsoft Q&A - Network Watcher](/answers/topics/azure-network-watcher.html).
