---
title: Azure CLI Samples - Attach and use data disks | Microsoft Docs
description: Azure CLI Samples
services: virtual-machine-scale-sets
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machine-scale-sets
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/27/2018
ms.author: cynthn
ms.custom: mvc

---

# Attach and use data disks with a virtual machine scale set with the Azure CLI
This script creates a virtual machine scale set and attaches and prepares data disks.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script
[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine-scale-sets/use-data-disks/use-data-disks.sh "Create a virtual machine scale set with data disks")]

## Clean up deployment
Run the following command to remove the resource group, scale set, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Script explanation
This script uses the following commands to create a resource group, virtual machine scale set, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/ad/group#az_ad_group_create) | Creates a resource group in which all resources are stored. |
| [az vmss create](/cli/azure/vmss#az_vmss_create) | Creates the virtual machine scale set and connects it to the virtual network, subnet, and network security group. A load balancer is also created to distribute traffic to multiple VM instances. This command also specifies the VM image to be used and administrative credentials.  |
| [az vmss disk attach](/cli/azure/vmss/disk#az_vmss_disk_attach) | Creates and attaches a data disk to the virtual machine scale set. |
| [az vmss extension set](/cli/azure/vmss/extension#az_vmss_extension_set) | Installs the Azure Custom Script Extension to run a script that prepares the data disks on each VM instance. |
| [az group delete](/cli/azure/ad/group#delete) | Deletes a resource group including all nested resources. |

## Next steps
For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional virtual machine scale set Azure CLI script samples can be found in the [Azure virtual machine scale set documentation](../cli-samples.md).