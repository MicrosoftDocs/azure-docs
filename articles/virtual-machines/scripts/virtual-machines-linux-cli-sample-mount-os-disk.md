---
title: Azure CLI Script Sample - Mount operating system disk | Microsoft Docs
description: Azure CLI Script Sample - Mount operating system disk
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: gwallace
editor: tysonn
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 02/27/2017
ms.author: cynthn
ms.custom: mvc
---

# Troubleshoot a VMs operating system disk

This script mounts the operating system disk of a failed or problematic virtual machine as a data disk to a second virtual machine. This can be useful when troubleshooting disk issues or recovering data.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine/mount-os-disk/mount-os-disk.sh "Quick Create VM")]

## Script explanation

This script uses the following commands to create a resource group, virtual machine, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az vm show](https://docs.microsoft.com/cli/azure/vm) | Return a list of virtual machines. In this case, the query option is used to return the virtual machine operating system disk. This value is then added to a variable name ‘uri’. |
| [az vm delete](https://docs.microsoft.com/cli/azure/vm) | Deletes a virtual machine. |
| [az vm create](https://docs.microsoft.com/cli/azure/vm) | Creates a virtual machine.  |
| [az vm disk attach](https://docs.microsoft.com/cli/azure/vm/disk) | Attaches a disk to a virtual machine. |
| [az vm list-ip-addresses](https://docs.microsoft.com/cli/azure/vm) | Returns the IP addresses of a virtual machine. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional virtual machine CLI script samples can be found in the [Azure Linux VM documentation](../linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
