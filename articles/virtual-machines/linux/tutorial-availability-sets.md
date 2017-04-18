---
title: Availability sets tutorial for Linux VMs in Azure | Microsoft Docs
description: Learn about the Availability Sets for Linux VMs in Azure.
documentationcenter: ''
services: virtual-machines-linux
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 04/17/2017
ms.author: cynthn

---

# How to use availability sets

To increase the availability of your virtual machines (VMs) you can put them into a logical grouping called an availability set. When you create VMs within an availability set, the Azure platform distributes the VMs across the underlying infrastructure. If there is planned maintenance on the Azure platform or a underlying hardware fault, the use of availability sets ensures that at least one VM remains running.

Each hardware cluster in a location is divided in to multiple update domains and fault domains. 

- **Update domain** - indicate groups of virtual machines and underlying physical hardware that can be rebooted at the same time. You can set the number of fault domains at any number between 1 - 20. For example, if you select 5 as the update domain count, when more than five virtual machines are in the availability set, the sixth virtual machine is placed into the same update domain as the first virtual machine, the seventh in the same update domain as the second virtual machine, and so on. The order of update domains being rebooted may not be sequential, but only one update domain is rebooted at a time.

- **Fault domain** - VMs in the same fault domain share a common power source and network switch. The number of available fault domains varies between two or three fault domains per region.


Based on the settings for the availability set, Azure automatically distributes VMs within an availability set across domains to maintain availability and fault tolerance. Depending on the size of your application and the number of VMs within an availability set, you can adjust the number of domains you wish to use. 




## Create an availability set

You can create an availability set using [az vm availability-set create](/cli/azure/availability-set#create). In this example, we set both the number of update and fault domains at **2** for the the availability set named **myAVSet** in the **myResourceGroup** resource group.

```azurecli
az vm availability-set create \
   -n myAvSet \
   -g myResourceGroup \
   --platform-fault-domain-count 2 \
   --platform-update-domain-count 2
```

## Create a VM inside an availability set

Because hardware cluster for the availability set is selected when the first VM in the availability set is deployed, you can't create a VM and then add it to an availability set later. You have to create the VM within the set so that it is on the correct hardware cluster. 

When you create a VM using [az vm create](/cli/azure/vm#create) you specify the availability set using the `--availability-set` parameter to specify the name of the availability set. 

```azurecli
az vm create \
   --resource-group myResourceGroup \
   --name myVM \
   --image UbuntuLTS \
   --generate-ssh-keys
   --availability-set myAvSet
```

## List the available VM sizes

An availability set can only be hosted on a single hardware cluster and each hardware cluster can only support a certain range of VM sizes. Therefore, the range of VM sizes that can exist in a single availability set is limited to the range of VM sizes supported by the hardware cluster. 

To lists all of the available VM sizes that can be used to create a new virtual machine in an existing availability set, use [az vm availability-set list-sizes](/cli/azure/vm/availability-set#list-sizes).

```azurecli
az vm availability-set list-sizes \
   -n myAvSet \
   -g myResourceGroup
```



## Next steps

