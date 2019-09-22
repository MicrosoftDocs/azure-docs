---
title: Tutorial - High availability for Linux VMs in Azure | Microsoft Docs
description: In this tutorial, you learn how to use the Azure CLI to deploy highly available virtual machines in Availability Sets
documentationcenter: ''
services: virtual-machines-linux
author: cynthn
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.topic: tutorial
ms.date: 08/24/2018
ms.author: cynthn
ms.custom: mvc

#Customer intent: As an IT administrator, I want to learn about high availability in Azure so that I can deploy a highly-available and redundant infrastructure.
---

# Tutorial: Create and deploy highly available virtual machines with the Azure CLI

In this tutorial, you learn how to increase the availability and reliability of your Virtual Machine solutions on Azure using a capability called Availability Sets. Availability sets ensure that the VMs you deploy on Azure are distributed across multiple isolated hardware clusters. Doing this ensures that if a hardware or software failure within Azure happens, only a subset of your VMs is impacted and that your overall solution remains available and operational.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an availability set
> * Create a VM in an availability set
> * Check available VM sizes

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## High Availability in Azure overview
High availability in Azure can be created in many different ways. Two options that you have are availability sets and availability zones. By using availability sets, your VMs will be protected from failures that may happen within a datacenter. This includes hardware failures and Azure software failures. By using availability zones, your VMs will be placed on physically separate infrastructure with no shared resources, and will therefore be protected from entire datacenter failures.

Use Availability Sets or Availability Zones when you want to deploy reliable VM-based solutions within Azure.

### Availability set overview

An Availability Set is a logical grouping capability that you can use in Azure to ensure that the VM resources you place within it are isolated from each other when they are deployed within an Azure datacenter. Azure ensures that the VMs you place within an Availability Set run across multiple physical servers, compute racks, storage units, and network switches. If a hardware or Azure software failure occurs, only a subset of your VMs are impacted, and your overall application stays up and continues to be available to your customers. Availability Sets are an essential capability when you want to build reliable cloud solutions.

Let’s consider a typical VM-based solution where you might have four front-end web servers and use two back-end VMs that host a database. With Azure, you’d want to define two availability sets before you deploy your VMs: one availability set for the “web” tier and one availability set for the “database” tier. When you create a new VM you can then specify the availability set as a parameter to the az vm create command, and Azure automatically ensures that the VMs you create within the available set are isolated across multiple physical hardware resources. If the physical hardware that one of your Web Server or Database Server VMs is running on has a problem, you know that the other instances of your Web Server and Database VMs remain running because they are on different hardware.

### Availability zone overview

Availability Zones is a high-availability offering that protects your applications and data from datacenter failures. Availability Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. To ensure resiliency, there is a minimum of three separate zones in all enabled regions. The physical separation of Availability Zones within a region protects applications and data from datacenter failures. Zone-redundant services replicate your applications and data across Availability Zones to protect from single-points-of-failure. With Availability Zones, Azure offers an industry-best 99.99% VM uptime SLA.

Similar to availability sets, let’s consider a typical VM-based solution where you might have four front-end web servers and use two back-end VMs that host a database. Similar to availability sets, you’ll want to deploy your VMs in two separate availability zones: one availability zone for the “web” tier and one availability zone for the “database” tier. When you create a new VM and specify the availability zone as a parameter to the az vm create command, Azure automatically ensures that the VMs you create are isolated across entirely different availability zones. If the entire datacenter that one of your Web Server or Database Server VMs is running on has a problem, you know that the other instances of your Web Server and Database VMs remain running because they are running on completely separate datacenters.

## Create an availability set

You can create an availability set using [az vm availability-set create](/cli/azure/vm/availability-set). In this example, the number of update and fault domains is set to *2* for the availability set named *myAvailabilitySet* in the *myResourceGroupAvailability* resource group.

First, create a resource group with [az group create](/cli/azure/group#az-group-create), then create the availability set:

```azurecli-interactive
az group create --name myResourceGroupAvailability --location eastus

az vm availability-set create \
    --resource-group myResourceGroupAvailability \
    --name myAvailabilitySet \
    --platform-fault-domain-count 2 \
    --platform-update-domain-count 2
```

Availability Sets allow you to isolate resources across fault domains and update domains. A **fault domain** represents an isolated collection of server + network + storage resources. In the preceding example, the availability set is distributed across at least two fault domains when the VMs are deployed. The availability set is also distributed across two **update domains**. Two update domains ensure that when Azure performs software updates, the VM resources are isolated, preventing all the software that runs on the VM from being updated at the same time.


## Create VMs inside an availability set

VMs must be created within the availability set to make sure they are correctly distributed across the hardware. An existing VM cannot be added to an availability set after it is created.

When a VM is created with [az vm create](/cli/azure/vm), use the `--availability-set` parameter to specify the name of the availability set.

```azurecli-interactive
for i in `seq 1 2`; do
   az vm create \
     --resource-group myResourceGroupAvailability \
     --name myVM$i \
     --availability-set myAvailabilitySet \
     --size Standard_DS1_v2  \
     --vnet-name myVnet \
     --subnet mySubnet \
     --image UbuntuLTS \
     --admin-username azureuser \
     --generate-ssh-keys
done
```

There are now two virtual machines within the availability set. Because they are in the same availability set, Azure ensures that the VMs and all their resources (including data disks) are distributed across isolated physical hardware. This distribution helps ensure much higher availability of the overall VM solution.

The availability set distribution can be viewed in the portal by going to Resource Groups > myResourceGroupAvailability > myAvailabilitySet. The VMs are distributed across the two fault and update domains, as shown in the following example:

![Availability set in the portal](./media/tutorial-availability-sets/fd-ud.png)

## Check for available VM sizes

Additional VMs can be added to the availability set later, where VM sizes are available on the hardware. Use [az vm availability-set list-sizes](/cli/azure/vm/availability-set#az-vm-availability-set-list-sizes) to list all the available sizes on the hardware cluster for the availability set:

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
> [Create a virtual machine scale set](tutorial-create-vmss.md)

* To learn more about availability zones, visit the  [Availability Zones documentation](../../availability-zones/az-overview.md).
* More documentation about both availability sets and availability zones is also available [here](./manage-availability.md).
* To try out availability zones, visit [Create a Linux virtual machine in an availability zone with the Azure CLI](./create-cli-availability-zone.md)
