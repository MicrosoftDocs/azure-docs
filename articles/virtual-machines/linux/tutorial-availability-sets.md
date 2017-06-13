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
ms.date: 05/22/2017
ms.author: cynthn
ms.custom: mvc
---

# How to use availability sets


In this tutorial, you will learn how to increase the availability and reliability of your Virtual Machine solutions on Azure using a capability called Availability Sets. Availability sets ensure that the VMs you deploy on Azure are distributed across multiple isolated hardware clusters. Doing this ensures that if a hardware or software failure within Azure happens, only a sub-set of your VMs will be impacted and that your overall solution will remain available and operational from the perspective of your customers using it.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an availability set
> * Create a VM in an availability set
> * Check available VM sizes

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. 

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]


## Availability set overview

An Availability Set is a logical grouping capability that you can use in Azure to ensure that the VM resources you place within it are isolated from each other when they are deployed within an Azure datacenter. Azure ensures that the VMs you place within an Availability Set run across multiple physical servers, compute racks, storage units, and network switches. This ensures that in the event of a hardware or Azure software failure, only a subset of your VMs will be impacted, and your overall application will stay up and continue to be available to your customers. Using Availability Sets is an essential capability to leverage when you want to build reliable cloud solutions.

Let’s consider a typical VM-based solution where you might have 4 front-end web servers and use 2 back-end VMs that host a database. With Azure, you’d want to define two availability sets before you deploy your VMs: one availability set for the “web” tier and one availability set for the “database” tier. When you create a new VM you can then specify the availability set as a parameter to the az vm create command, and Azure will automatically ensure that the VMs you create within the available set are isolated across multiple physical hardware resources. This means that if the physical hardware that one of your Web Server or Database Server VMs is running on has a problem, you know that the other instances of your Web Server and Database VMs will remain running fine because they are on different hardware.

You should always use Availability Sets when you want to deploy reliable VM based solutions within Azure.


## Create an availability set

You can create an availability set using [az vm availability-set create](/cli/azure/availability-set#create). In this example, we set both the number of update and fault domains at *2* for the availability set named *myAvailabilitySet* in the *myResourceGroupAvailability* resource group.

Create a resource group.

```azurecli-interactive 
az group create --name myResourceGroupAvailability --location eastus
```


```azurecli-interactive 
az vm availability-set create \
    --resource-group myResourceGroupAvailability \
    --name myAvailabilitySet \
    --platform-fault-domain-count 2 \
    --platform-update-domain-count 2
```

Availability Sets allow you to isolate resources across "fault domains" and "update domains". A **fault domain** represents an isolated collection of server + network + storage resources. In the preceding example, we indicate that we want our availability set to be distributed across at least two fault domains when our VMs are deployed. We also indicate that we want our availability set distributed across two **update domains**.  Two update domains ensure that when Azure performs software updates our VM resources are isolated, preventing all the software running underneath our VM from being updated at the same time.

## Create VMs inside an availability set

VMs must be created within the availability set to make sure they are correctly distributed across the hardware. You can't add an existing VM to an availability set after it is created. 

When you create a VM using [az vm create](/cli/azure/vm#create) you specify the availability set using the `--availability-set` parameter to specify the name of the availability set.

```azurecli-interactive 
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

We now have two virtual machines within our newly created availability set. Because they are in the same availability set, Azure will ensure that the VMs and all their resources (including data disks) are distributed across isolated physical hardware. This distribution helps ensure much higher availability of our overall VM solution.

One thing you may encounter as you add VMs is that a particular VM size is no longer available to use within your availability set. This issue can happen if there is no longer enough capacity to add it while preserving the isolation rules the availability set enforces. You can check to see what VM sizes are available to use within an existing availability set using the `--availability-set list-sizes` parameter.

## Check for available VM sizes 

You can add more VMs to the availability set later, but you need to know what VM sizes are available on the hardware. Use [az vm availability-set list-sizes](/cli/azure/availability-set#list-sizes) to list all the available sizes on the hardware cluster for the availability set.

```azurecli-interactive 
az vm availability-set list-sizes \
     --resource-group myResourceGroupAvailability \
     --name myAvailabilitySet \
	 --output table  
```

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create an availability set
> * Create a VM in an availability set
> * Check available VM sizes

Advance to the next tutorial to learn about virtual machine scale sets.

> [!div class="nextstepaction"]
> [Create a VM scale set](tutorial-create-vmss.md)

