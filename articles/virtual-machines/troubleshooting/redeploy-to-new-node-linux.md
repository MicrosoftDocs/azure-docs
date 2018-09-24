---
title: Redeploy Linux Virtual Machines in Azure | Microsoft Docs
description: How to redeploy Linux virtual machines in Azure to mitigate SSH connection issues.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: genlin
manager: jeconnoc
tags: azure-resource-manager,top-support-issue

ms.assetid: e9530dd6-f5b0-4160-b36b-d75151d99eb7
ms.service: virtual-machines-linux
ms.topic: troubleshooting
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 12/14/2017
ms.author: genli

---

# Redeploy Linux virtual machine to new Azure node
If you face difficulties troubleshooting SSH or application access to a Linux virtual machine (VM) in Azure, redeploying the VM may help. When you redeploy a VM, it moves the VM to a new node within the Azure infrastructure and then powers it back on. All your configuration options and associated resources are retained. This article shows you how to redeploy a VM using Azure CLI or the Azure portal.

> [!NOTE]
> After you redeploy a VM, the temporary disk is lost and dynamic IP addresses associated with virtual network interface are updated. 


## Use the Azure CLI
Install the latest [Azure CLI](/cli/azure/install-az-cli2) and log in to your Azure account using [az login](/cli/azure/reference-index#az_login).

Redeploy your VM with [az vm redeploy](/cli/azure/vm#az_vm_redeploy). The following example redeploys the VM named *myVM* in the resource group named *myResourceGroup*:

```azurecli
az vm redeploy --resource-group myResourceGroup --name myVM 
```

## Use the Azure classic CLI
Install the [latest Azure classic CLI](../../cli-install-nodejs.md) and log in to your Azure account. Make sure that you are in Resource Manager mode (`azure config mode arm`).

The following example redeploys the VM named *myVM* in the resource group named *myResourceGroup*:

```azurecli
azure vm redeploy --resource-group myResourceGroup --vm-name myVM 
```

[!INCLUDE [virtual-machines-common-redeploy-to-new-node](../../../includes/virtual-machines-common-redeploy-to-new-node.md)]

## Next steps
If you are having issues connecting to your VM, you can find specific help on [troubleshooting SSH connections](troubleshoot-ssh-connection.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) or [detailed SSH troubleshooting steps](detailed-troubleshoot-ssh-connection.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). If you cannot access an application running on your VM, you can also read [application troubleshooting issues](troubleshoot-app-connection.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).


