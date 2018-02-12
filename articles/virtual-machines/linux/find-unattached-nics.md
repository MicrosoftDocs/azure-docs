---
title: Find and delete unattached Azure NICs | Microsoft Docs
description: How to find and delete unattached Azure NICs, by using Azure CLI
services: virtual-machines-linux
documentationcenter: ''
author: gpetrousov
manager: ''
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 01/10/2017
ms.author: gpetrousov
---
# Find and delete unattached Azure NICs
When you delete a virtual machine in Azure, the nics attached to it are not deleted by default. Creating and deleting multiple VMs may cause the existance of many unused NICs which are still using the internal IPs and thus taking address space in the subnet. Use this article to find and delete all the unattached NICs and clean the address space.


## Find and delete unattached NICs

The following script shows you how to find unattached NICs by using the *macAddress* property. It loops through all the NICs in a subscription and checks if the *macAddress* property is null to find unattached NICs. *macAddress* property stores the MAC address of the interface when it's attached to a VM.

We highly recommend you to first run the script by setting the *deleteUnattachedNics* variable to 0 to view all the unattached NICs. After reviewing the unattached NICs, run the script by setting *deleteUnattachedNics* to 1 to delete all the unattached NICs.

 ```azurecli

# Set deleteUnattachedNics=1 if you want to delete unattached Nics
# Set deleteUnattachedNics=0 if you want to see the Id of the unattached Nics
deleteUnattachedNics=0

unattachedNicsIds=$(az network nic list --query '[?macAddress==`null`].[id]' -o tsv)
for id in ${unattachedNicsIds[@]}
do
   if (( $deleteUnattachedNics == 1 ))
   then

       echo "Deleting unattached Nic with Id: "$id
       az network nic delete --ids $id
       echo "Deleted unattached Nic with Id: "$id
   else
       echo $id
   fi
done
