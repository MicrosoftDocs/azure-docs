---
title: Azure CLI Script Sample - Copy (move) managed disks to same or different subscription | Microsoft Docs
description: Azure CLI Script Sample - Copy (move) managed disks to same or different subscription
services: managed-disks-linux
documentationcenter: storage
author: ramankum
manager: kavithag
editor: ramankum
tags: azure-service-management

ms.assetid:
ms.service: managed-disks-linux
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/19/2017
ms.author: ramankum
---

# Copy managed disks to same or different subscription with CLI

This script copies a managed disk to same or different subscription but in the same region. 


[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli[main](../../../cli_scripts/storage/copy-managed-disks-to-same-or-different-subscription/copy-managed-disks-to-same-or-different-subscription.sh "Copy managed disk")]


## Script explanation

This script uses following commands to create a new managed disk in the target subscription using the Id of the source managed disk. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az disk show](https://docs.microsoft.com/cli/azure/disk#show) | Gets all the properties of a managed disk using the name and resource group properties of the managed disk. Id property is used to copy the managed disk to different subscription.  |
| [az disk create](https://docs.microsoft.com/cli/azure/disk#create) | Copies a managed disk by creating a new managed disk in different subscription using Id and name the parent managed disk.  |

## Next steps

[Create a virtual machine from a managed disk](./../../virtual-machines/scripts/virtual-machines-linux-cli-sample-create-vm-from-managed-os-disks.md?toc=%2fpowershell%2fmodule%2ftoc.json)

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional virtual machine and managed disks CLI script samples can be found in the [Azure Linux VM documentation](../../virtual-machines/linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
