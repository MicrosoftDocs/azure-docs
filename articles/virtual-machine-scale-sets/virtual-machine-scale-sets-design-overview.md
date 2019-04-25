---
title: Design Considerations for Azure Virtual Machine Scale Sets | Microsoft Docs
description: Learn about design considerations for your Azure Virtual Machine Scale Sets
keywords: linux virtual machine,virtual machine scale sets
services: virtual-machine-scale-sets
documentationcenter: ''
author: mayanknayar
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: c27c6a59-a0ab-4117-a01b-42b049464ca1
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 06/01/2017
ms.author: manayar

---
# Design Considerations For Scale Sets
This article discusses design considerations for Virtual Machine Scale Sets. For information about what Virtual Machine Scale Sets are, refer to [Virtual Machine Scale Sets Overview](virtual-machine-scale-sets-overview.md).

## When to use scale sets instead of virtual machines?
Generally, scale sets are useful for deploying highly available infrastructure where a set of machines has similar configuration. However, some features are only available in scale sets while other features are only available in VMs. In order to make an informed decision about when to use each technology, you should first take a look at some of the commonly used features that are available in scale sets but not VMs:

### Scale set-specific features

- Once you specify the scale set configuration, you can update the *capacity* property to deploy more VMs in parallel. This process is better than writing a script to orchestrate deploying many individual VMs in parallel.
- You can [use Azure Autoscale to automatically scale a scale set](./virtual-machine-scale-sets-autoscale-overview.md) but not individual VMs.
- You can [reimage scale set VMs](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/reimage) but [not individual VMs](https://docs.microsoft.com/rest/api/compute/virtualmachines).
- You can [overprovision](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-design-overview#overprovisioning) scale set VMs for increased reliability and quicker deployment times. You cannot overprovision individual VMs unless you write custom code to perform this action.
- You can specify an [upgrade policy](./virtual-machine-scale-sets-upgrade-scale-set.md) to make it easy to roll out upgrades across VMs in your scale set. With individual VMs, you must orchestrate updates yourself.

### VM-specific features

Some features are currently only available in VMs:

- You can capture an image from an individual VM, but not from a VM in a scale set.
- You can migrate an individual VM from native disks to managed disks, but you cannot migrate VM instances in a scale set.
- You can assign IPv6 public IP addresses to individual VM virtual network interface cards (NICs), but cannot do so for VM instances in a scale set. You can assign IPv6 public IP addresses to load balancers in front of either individual VMs or scale set VMs.

## Storage

### Scale sets with Azure Managed Disks
Scale sets can be created with [Azure Managed Disks](../virtual-machines/windows/managed-disks-overview.md) instead of traditional Azure storage accounts. Managed Disks provide the following benefits:
- You do not have to pre-create a set of Azure storage accounts for the scale set VMs.
- You can define [attached data disks](virtual-machine-scale-sets-attached-disks.md) for the VMs in your scale set.
- Scale sets can be configured to [support up to 1,000 VMs in a set](virtual-machine-scale-sets-placement-groups.md). 

If you have an existing template, you can also [update the template to use Managed Disks](virtual-machine-scale-sets-convert-template-to-md.md).

### User-managed Storage
A scale set that is not defined with Azure Managed Disks relies on user-created storage accounts to store the OS disks of the VMs in the set. A ratio of 20 VMs per storage account or less is recommended to achieve maximum IO and also take advantage of _overprovisioning_ (see below). It is also recommended that you spread the beginning characters of the storage account names across the alphabet. Doing so helps spread load across different internal systems. 


## Overprovisioning
Scale sets currently default to "overprovisioning" VMs. With overprovisioning turned on, the scale set actually spins up more VMs than you asked for, then deletes the extra VMs once the requested number of VMs are successfully provisioned. Overprovisioning improves provisioning success rates and reduces deployment time. You are not billed for the extra VMs, and they do not count toward your quota limits.

While overprovisioning does improve provisioning success rates, it can cause confusing behavior for an application that is not designed to handle extra VMs appearing and then disappearing. To turn overprovisioning off, ensure you have the following string in your template: `"overprovision": "false"`. More details can be found in the [Scale Set REST API documentation](/rest/api/virtualmachinescalesets/create-or-update-a-set).

If your scale set uses user-managed storage, and you turn off overprovisioning, you can have more than 20 VMs per storage account, but it is not recommended to go above 40 for IO performance reasons. 

## Limits
A scale set built on a Marketplace image (also known as a platform image) and configured to use Azure Managed Disks supports a capacity of up to 1,000 VMs. If you configure your scale set to support more than 100 VMs, not all scenarios work the same (for example load balancing). For more information, see [Working with large virtual machine scale sets](virtual-machine-scale-sets-placement-groups.md). 

A scale set configured with user-managed storage accounts is currently limited to 100 VMs (and 5 storage accounts are recommended for this scale).

A scale set built on a custom image (one built by you) can have a capacity of up to 600 VMs when configured with Azure Managed disks. If the scale set is configured with user-managed storage accounts, it must create all OS disk VHDs within one storage account. As a result, the maximum recommended number of VMs in a scale set built on a custom image and user-managed storage is 20. If you turn off overprovisioning, you can go up to 40.

For more VMs than these limits allow, you need to deploy multiple scale sets as shown in [this template](https://github.com/Azure/azure-quickstart-templates/tree/master/301-custom-images-at-scale).

