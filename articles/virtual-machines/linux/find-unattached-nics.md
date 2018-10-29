---
title: Find and delete unattached Azure NICs | Microsoft Docs
description: How to find and delete Azure NICs that are not attached to VMs with the Azure CLI
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 04/10/2018
ms.author: cynthn
---

# How to find and delete unattached network interface cards (NICs) for Azure VMs
When you delete a virtual machine (VM) in Azure, the network interface cards (NICs) are not deleted by default. If you create and delete multiple VMs, the unused NICs continue to use the internal IP address leases. As you create other VM NICs, they may be unable to obtain an IP lease in the address space of the subnet. This article shows you how to find and delete unattached NICs.

## Find and delete unattached NICs

The *virtualMachine* property for a NIC stores the ID and resource group of the VM the NIC is attached to. The following script loops through all the NICs in a subscription and checks if the *virtualMachine* property is null. If this property is null, the NIC is not attached to a VM.

To view all the unattached NICs, it's highly recommend to first run the script with the *deleteUnattachedNics* variable to *0*. To delete all the unattached NICs after you review the list output, run the script with *deleteUnattachedNics* to *1*.

```azurecli
# Set deleteUnattachedNics=1 if you want to delete unattached NICs
# Set deleteUnattachedNics=0 if you want to see the Id(s) of the unattached NICs
deleteUnattachedNics=0

unattachedNicsIds=$(az network nic list --query '[?virtualMachine==`null`].[id]' -o tsv)
for id in ${unattachedNicsIds[@]}
do
   if (( $deleteUnattachedNics == 1 ))
   then

       echo "Deleting unattached NIC with Id: "$id
       az network nic delete --ids $id
       echo "Deleted unattached NIC with Id: "$id
   else
       echo $id
   fi
done
```

## Next steps

For more information on how to create and manage virtual networks in Azure, see [create and manage VM networks](tutorial-virtual-network.md).
