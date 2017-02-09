---
title: Azure CLI Script Sample - Mount operating system disk | Microsoft Docs
description: Azure CLI Script Sample - Mount operating system disk
services: virtual-machines-linux
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 02/09/2017
ms.author: nepeters
---

# Troubleshoot a VMs operating system disk

Mount the operating system disk of a failed or problematic virtual machine as a data disk to a second virtual machine. This can be useful when troubleshooting disk issues or recovering data. When running this script an existing virtual machine will be needed. The resource group name and virtual machine name will need to be updated in the script sample.

## Mount disk sample

[!code-azurecli[main](../../cli_scripts/virtual-machine/mount-os-disk/mount-os-disk.sh "Quick Create VM")]

## Script explanation

This script uses the following commands to create a resource group, virtual machine, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az vm show](https://docs.microsoft.com/en-us/cli/azure/vm#show) | |
| [az vm delete](https://docs.microsoft.com/en-us/cli/azure/vm#delete) | |
| [az vm create](https://docs.microsoft.com/en-us/cli/azure/vm#create) | |
| [az vm disk attach-existing](https://docs.microsoft.com/en-us/cli/azure/vm/disk#attach-existing) | |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentaiton](https://docs.microsoft.com/en-us/cli/azure/overview).

Additional virtual machine CLI script samples can be found in the [Azure Linux VM documentation](../virtual-machines-linux-cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).











