---
title: Availability Set Guidelines | Microsoft Docs
description: Learn about the key design and implementation guidelines for deploying Availability Sets in Azure infrastructure services.
documentationcenter: ''
services: virtual-machines-windows
author: iainfoulds
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: f9449f58-664b-4d5d-82f6-84c5d083047f
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 09/08/2016
ms.author: iainfou

---
# Availability sets guidelines
[!INCLUDE [virtual-machines-windows-infrastructure-guidelines-intro](../../includes/virtual-machines-windows-infrastructure-guidelines-intro.md)]

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

As a best practice, applications should not reside on a single VM. An availability set that contains a single VM doesn't gain any protection from planned or unplanned events within the Azure platform. The [Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines) requires two or more VMs within an availability set to allow the distribution of VMs across the underlying infrastructure.

The underlying infrastructure in Azure is divided in to update domains and fault domains. These domains are defined by what hosts share a common update cycle, or share similar physical infrastructure such as power and networking. Azure automatically distributes your VMs within an availability set across domains to maintain availability and fault tolerance. Depending on the size of your application and the number of VMs within an availability set, you can adjust the number of domains you wish to use. You can read more about [managing availability and use of update and fault domains](virtual-machines-windows-manage-availability.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

When designing your application infrastructure, you should also plan the application tiers that you use. Group VMs that serve the same purpose in to availability sets, such as an availability set for your front-end VMs running IIS. Create a separate availability set for your back-end VMs running SQL Server. The goal is to ensure that each component of your application is protected by an availability set and at least once instance always remains running.

Load balancers can be utilized in front of each application tier to work alongside an availability set and ensure traffic can always be routed to a running instance. Without a load balancer, your VMs may continue running throughout planned and unplanned maintenance events, but your end users may not be able to resolve them if the primary VM is unavailable.

You should also design your application for high availability at storage layer. The best practice is to use separate storage account for each VM in an Availability Set. You should keep all disks (OS and data) associated with a VM in the same storage account. Storage account [limits](../storage/storage-scalability-targets.md) should also be considered when adding more VHDs to a storage account.

## Next steps
[!INCLUDE [virtual-machines-windows-infrastructure-guidelines-next-steps](../../includes/virtual-machines-windows-infrastructure-guidelines-next-steps.md)]

