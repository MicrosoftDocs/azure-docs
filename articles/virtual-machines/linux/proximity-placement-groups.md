---
title: Proximity placement groups preview for Linux VMs | Microsoft Docs
description: Learn about creating and using proximity placement groups for Linux virtual machines in Azure. 
services: virtual-machines-linux
author: cynthn
manager: jeconnoc

ms.service: virtual-machines-linux
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 05/09/2019
ms.author: cynthn

---

# Creating and using proximity placement groups using Azure CLI


[!INCLUDE [virtual-machines-common-ppg-overview](../../../includes/virtual-machines-common-ppg-overview.md)]

## CLI
Create a proximity placement group using [az ppg create](/cli/azure/ppg#az-ppg-create). 

```azurecli-interactive
az ppg create \
   -n myPPG \
   -g myPPGGroup \
   -l westus \
   -t standard 
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


## Next steps

Learn more about the [Azure CLI](/cli/azure/ppg) commands for proximity placement groups.