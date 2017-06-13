---
title: Availability sets for Linux VMs in Azure | Microsoft Docs
description: Learn about the key design and implementation guidelines for deploying Availability Sets in Azure infrastructure services.
documentationcenter: ''
services: virtual-machines-linux
author: iainfoulds
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 24f1d91c-8cc0-4251-bb67-ac4c4c37e8cd
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 03/17/2017
ms.author: iainfou
ms.custom: H1Hack27Feb2017

---
# Azure availability sets guidelines for Linux VMs

[!INCLUDE [virtual-machines-linux-infrastructure-guidelines-intro](../../../includes/virtual-machines-linux-infrastructure-guidelines-intro.md)]

This article focuses on understanding the required planning steps for availability sets to ensure your applications remains accessible during planned or unplanned events.

## Implementation guidelines for availability sets
Decisions:

* How many availability sets do you need for the various roles and tiers in your application infrastructure?

Tasks:

* Define the number of VMs in each application tier you require.
* Determine if you need to adjust the number of fault or update domains to be used for your application.
* Define the required availability sets using your naming convention and what VMs reside in them. A VM can only reside in one availability set. 

## Availability sets
In Azure, virtual machines (VMs) can be placed in to a logical grouping called an availability set. When you create VMs within an availability set, the Azure platform distributes the placement of those VMs across the underlying infrastructure. Should there be a planned maintenance event to the Azure platform or an underlying hardware / infrastructure fault, the use of availability sets ensures that at least one VM remains running.

As a best practice, applications should not reside on a single VM. An availability set that contains a single VM doesn't gain any protection from planned or unplanned events within the Azure platform. The [Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines) requires two or more VMs within an availability set to allow the distribution of VMs across the underlying infrastructure. If you are using [Azure Premium Storage](../../storage/storage-premium-storage.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json), the Azure SLA applies to a single VM.

The underlying infrastructure in Azure is divided in to multiple hardware clusters. Each hardware cluster can support a range of VM sizes. An availability set can only be hosted on a single hardware cluster at any point in time. Therefore, the range of VM sizes that can exist in a single availability set is limited to the range of VM sizes supported by the hardware cluster. The hardware cluster for the availability set is selected when the first VM in the availability set is deployed or when starting the first VM in an availability set where all VMs are currently in the stopped-deallocated state. The following CLI command can be used to determine the range of VM sizes available for an availability set: “az vm list-sizes --location \<string\>”

Each hardware cluster is divided in to multiple update domains and fault domains. These domains are defined by what hosts share a common update cycle, or share similar physical infrastructure such as power and networking. Azure automatically distributes your VMs within an availability set across domains to maintain availability and fault tolerance. Depending on the size of your application and the number of VMs within an availability set, you can adjust the number of domains you wish to use. You can read more about [managing availability and use of update and fault domains](manage-availability.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

When designing your application infrastructure, plan out the application tiers to use. Group VMs that serve the same purpose in to availability sets, such as an availability set for your front-end VMs running nginx or Apache. Create a separate availability set for your back-end VMs running MongoDB or MySQL. The goal is to ensure that each component of your application is protected by an availability set and at least once instance always remains running.

Load balancers can be utilized in front of each application tier to work alongside an availability set and ensure traffic can always be routed to a running instance. Without a load balancer, your VMs may continue running throughout planned and unplanned maintenance events, but your end user may not be able to resolve them if the primary VM is unavailable.

Design your application for high availability at storage layer. The best practice is to [use Managed Disks for VMs in an Availability Set](manage-availability.md#use-managed-disks-for-vms-in-an-availability-set). If you are currently using unmanaged disks, we highly recommend you to [convert VMs in Availability Set to use Managed Disks](convert-unmanaged-to-managed-disks.md#convert-vm-in-an-availability-set-to-managed-disks).

## Next steps
[!INCLUDE [virtual-machines-linux-infrastructure-guidelines-next-steps](../../../includes/virtual-machines-linux-infrastructure-guidelines-next-steps.md)]

