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
ms.date: 05/02/2017
ms.author: cynthn

---

# How to use availability sets

To protect application workload from downtime during maintenance or hardware fault, virtual machines need to be made highly available. In this tutorial, you learn about increasing the availability of your virtual machines (VMs) by putting them into a logical grouping called availability sets.

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Availability set overview

Virtual machines can be created across logical groupings of hardware in the underlying Azure datacenter. When you create two or more VMs, your compute and storage resources are distributed across hardware, such as servers, network switches and storage. This distribution maintains the availability of your app should a hardware component undergo maintenance. Availability sets let you define this logical grouping.

Availability sets provide high availability to the VMs. You should also ensure your applications are also designed to tolerate outages or maintenance events.

## Create an availability set

You can create an availability set using [az vm availability-set create](/cli/azure/availability-set#create). In this example, we set both the number of update and fault domains at *2* for the availability set named *myAvailabilitySet* in the *myResourceGroupAvailability* resource group.

```azurecli
az vm availability-set create \
    --resource-group myResourceGroupAvailability \
    --name myAvailabilitySet \
    --platform-fault-domain-count 2 \
    --platform-update-domain-count 2
```

## Create VMs inside an availability set

VMs need to be created within the availability set to make sure they are correctly distributed across the hardware. You can't add an existing VM to an availability set after it is created. 

The hardware in a location is divided in to multiple update domains and fault domains. An **update domain** is a group of VMs and underlying physical hardware that can be rebooted at the same time. VMs in the same **fault domain** share common storage as well as a common power source and network switch. 

When you create a VM using [az vm create](/cli/azure/vm#create) you specify the availability set using the `--availability-set` parameter to specify the name of the availability set.

```azurecli
for i in `seq 1 2`; do
   az vm create \
     --resource-group myResourceGroupAvailability \
     --name myVM$i \
     --availability-set myAvailabilitySet \
     --size Standard_DS1_v2  \
     --image Canonical:UbuntuServer:14.04.4-LTS:latest \
     --admin-username azureuser \
     --generate-ssh-keys \
     --no-wait
done 
```

We now have 2 virtual machines distributed across the underlying hardware. 

## Check for available VM sizes 

You can add more VMs to the availability set later, but you need to know what VM sizes are available on the hardware. Use [az vm availability-set list-sizes](/cli/azure/availability-set#list-sizes) to list all the available sizes on the hardware cluster for the availability set.

```azurecli
az vm availability-set list-sizes \
     --resource-group myResourceGroupAvailability \
     --name myAvailabilitySet \
	 --output table  
```

## Next steps

In this tutorial, you have learned about using availability sets. Advance to the next tutorial to learn about virtual machine scale sets.

[Create a VM scale set](tutorial-create-vmss.md)

