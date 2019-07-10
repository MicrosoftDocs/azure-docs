---
title: Use proximity placement groups preview for Linux VMs | Microsoft Docs
description: Learn about creating and using proximity placement groups for Linux virtual machines in Azure. 
services: virtual-machines-linux
author: cynthn
manager: jeconnoc

ms.service: virtual-machines-linux
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 07/01/2019
ms.author: cynthn

---

# Preview: Deploy VMs to proximity placement groups using Azure CLI

To get VMs as close as possible, achieving the lowest possible latency, you should deploy them within a [proximity placement group](co-location.md#preview-proximity-placement-groups).

A proximity placement group is a logical grouping used to make sure that Azure compute resources are physically located close to each other. Proximity placement groups are useful for workloads where low latency is a requirement.

> [!IMPORTANT]
> Proximity Placement Groups is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> Proximity placement groups are not available in these regions during the preview: **Japan East**, **Australia East** and **India Central**.

## Create the proximity placement group
Create a proximity placement group using [`az ppg create`](/cli/azure/ppg#az-ppg-create). 

```azurecli-interactive
az group create --name myPPGGroup --location westus
az ppg create \
   -n myPPG \
   -g myPPGGroup \
   -l westus \
   -t standard 
```

## List proximity placement groups

You can list all of your proximity placement groups using [az ppg list](/cli/azure/ppg#az-ppg-list).

```azurecli-interactive
az ppg list -o table
```

## Create a VM

Create a VM within the proximity placement group using [new az vm](/cli/azure/vm#az-vm-create).
```azurecli-interactive
az vm create \
   -n myVM \
   -g myPPGGroup \
   --image UbuntuLTS \
   --ppg myPPG  \
   --generate-ssh-keys \
   --size Standard_D1_v2  \
   -l westus
```

## Scale sets

You can also create a scale-set in your proximity placement group. Use the same `--ppg` parameter with [az vmss create](/cli/azure/vmss?view=azure-cli-latest#az-vmss-create) to create a scale set and all of the instances will be created in the same proximity placement group.

## Next steps

Learn more about the [Azure CLI](/cli/azure/ppg) commands for proximity placement groups.