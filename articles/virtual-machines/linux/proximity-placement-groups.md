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
Create a proximity placement group using [az ppg create](/cli/azure/vm). This example creates a proximity placement group using standard storage. You can also use `-t ultra` to have the proximity placement group backed by Ultra SSD storage.


az ppg create -n myppg -g myPPGGroup -l westus -t standard 


## Create a VMs

az vm create -n myVM -g PPGTest --image UbuntuLTS --ppg myppg  --generate-ssh-keys --size Standard_D1_v2  -l westus


az ppg list  

az ppg show -n myppg -g ppgtest  

 


## Next steps

Learn more about [Azure regions and availability](regions-and-availability.md).