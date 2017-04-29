---
title: Redeploy Linux Virtual Machines in Azure | Microsoft Docs
description: How to redeploy Linux virtual machines in Azure to mitigate SSH connection issues.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: iainfoulds
manager: timlt
tags: azure-resource-manager,top-support-issue

ms.assetid: e9530dd6-f5b0-4160-b36b-d75151d99eb7
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: support-article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 12/16/2016
ms.author: iainfou

---
# Redeploy Linux virtual machine to new Azure node
If you have been facing difficulties troubleshooting SSH or application access to a Linux virtual machine (VM) in Azure, redeploying the VM may help. When you redeploy a VM, it moves the VM to a new node within the Azure infrastructure and then powers it back on, retaining all your configuration options and associated resources. This article shows you how to redeploy a VM using Azure CLI or the Azure portal.

> [!NOTE]
> After you redeploy a VM, the temporary disk is lost and dynamic IP addresses associated with virtual network interface are updated. 

You can redeploy a VM using one of the following options. You only need to choose one option to redeploy your VM:

- [Azure CLI 2.0](#azure-cli-20)
- [Azure CLI 1.0](#azure-cli-10)
- [Azure portal](#using-azure-portal)

## Azure CLI 2.0
Install the latest [Azure CLI 2.0](/cli/azure/install-az-cli2) and log in to an Azure account using [az login](/cli/azure/#login).

Redeploy your VM with [az vm redeploy](/cli/azure/vm#redeploy). The following example redeploys the VM named `myVM` in the resource group named `myResourceGroup`:

```azurecli
az vm redeploy --resource-group myResourceGroup --name myVM 
```

## Azure CLI 1.0
Install the [latest Azure CLI 1.0](../../cli-install-nodejs.md), log in to an Azure account, and make sure that you are in Resource Manager mode (`azure config mode arm`).

The following example redeploys the VM named `myVM` in the resource group named `myResourceGroup`:

```azurecli
azure vm redeploy --resource-group myResourceGroup --vm-name myVM 
```

[!INCLUDE [virtual-machines-common-redeploy-to-new-node](../../../includes/virtual-machines-common-redeploy-to-new-node.md)]

## Next steps
If you are having issues connecting to your VM, you can find specific help on [troubleshooting SSH connections](troubleshoot-ssh-connection.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) or [detailed SSH troubleshooting steps](detailed-troubleshoot-ssh-connection.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). If you cannot access an application running on your VM, you can also read [application troubleshooting issues](troubleshoot-app-connection.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

