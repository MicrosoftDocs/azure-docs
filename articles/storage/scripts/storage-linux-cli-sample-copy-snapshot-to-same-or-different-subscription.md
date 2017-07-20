---
title: Azure CLI Script Sample - Copy (move) snapshot of a managed disk to same or different subscription with CLI| Microsoft Docs
description: Azure CLI Script Sample - Copy (move) snapshot of a managed disk to same or different subscription with CLI
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

# Copy snapshot of a managed disk to same or different subscription with CLI

This script copies a snapshot of a managed disk to same or different subscription. Use this script to move a snapshot to different subscription in the same region as the parent snapshot.


[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli[main](../../../cli_scripts/storage/copy-snapshot-to-same-or-different-subscription/copy-snapshot-to-same-or-different-subscription.sh "Copy snapshot")]


## Script explanation

This script uses following commands to create a snapshot in the target subscription using the Id of the source snapshot. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az snapshot show](https://docs.microsoft.com/cli/azure/snapshot#show) | Gets all the properties of a snapshot using the name and resource group properties of the snapshot. Id property is used to copy the snapshot to different subscription.  |
| [az snapshot create](https://docs.microsoft.com/cli/azure/snapshot#create) | Copies a snapshot by creating a snapshot in different subscription using the Id and name of the parent snapshot.  |

## Next steps

[Create a virtual machine from a snapshot](./../../virtual-machines/scripts/virtual-machines-linux-cli-sample-create-vm-from-snapshot.md?toc=%2fpowershell%2fmodule%2ftoc.json)

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional virtual machine and managed disks CLI script samples can be found in the [Azure Linux VM documentation](../../virtual-machines/linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
