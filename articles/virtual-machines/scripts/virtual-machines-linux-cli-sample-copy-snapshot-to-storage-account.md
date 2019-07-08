---
title: Azure CLI sample - Copy a snapshot to a storage account in another region | Microsoft Docs
description: Azure CLI Script Sample - Export/Copy snapshot as VHD to a storage account in same or different region.
services: virtual-machines-linux
documentationcenter: storage
author: ramankumarlive
manager: kavithag
editor: tysonn
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/19/2017
ms.author: ramankum
ms.custom: "mvc,seodec18"
---

# Export/Copy a snapshot to a storage account in different region with CLI

This script exports a managed snapshot to a storage account in different region. It first generates the SAS URI of the snapshot and then uses it to copy it to a storage account in different region. Use this script to maintain backup of your managed disks in different region for disaster recovery. 


[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli[main](../../../cli_scripts/virtual-machine/copy-snapshots-to-storage-account/copy-snapshots-to-storage-account.sh "Copy snapshot")]


## Script explanation

This script uses following commands to generate SAS URI for a managed snapshot and copies the snapshot to a storage account using SAS URI. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az snapshot grant-access](https://docs.microsoft.com/cli/azure/snapshot) | Generates read-only SAS that is used to copy underlying VHD file to a storage account or download it to on-premises  |
| [az storage blob copy start](https://docs.microsoft.com/cli/azure/storage/blob/copy) | Copies a blob asynchronously from one storage account to another |

## Next steps

[Create a managed disk from a VHD](virtual-machines-linux-cli-sample-create-managed-disk-from-vhd.md?toc=%2fcli%2fmodule%2ftoc.json)

[Create a virtual machine from a managed disk](./virtual-machines-linux-cli-sample-create-vm-from-managed-os-disks.md?toc=%2fcli%2fmodule%2ftoc.json)

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional virtual machine and managed disks CLI script samples can be found in the [Azure Linux VM documentation](../linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
