<properties
	pageTitle="Availability Set Guidelines | Microsoft Azure"
	description="Learn about the key design and implementation guidelines for deploying Availability Sets in Azure infrastructure services."
	documentationCenter=""
	services="virtual-machines-linux"
	authors="iainfoulds"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/22/2016"
	ms.author="iainfou"/>

# Azure Availability Sets Infrastructure Guidelines

[AZURE.INCLUDE [virtual-machines-linux-infrastructure-guidelines-intro](../../includes/virtual-machines-linux-infrastructure-guidelines-intro.md)] 

This article focuses on understanding the required planning steps for availability sets to ensure your applications remains accessible during planned or unplanned events.

## Implementation guidelines for availability sets

Decisions:

- How many availability sets do you need for the various roles and tiers in application infrastructure?

Tasks:

- Define the number of VMs in each application tier you require.
- Understand [update and fault domains](virtual-machines-linux-manage-availability.md#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy) and define if you need to adjust the number of domains in use for your application.
- Define the required availability sets using your naming convention and what VMs will reside in them. A VM can only reside in one availability set. 

## Availability sets

Within Azure, virtual machines (VMs) can be placed in to a logical grouping called an availability set. When you create VMs within an availability set, the Azure platform will distribute the placement of those VMs across the underlying infrastructure. Should there be a planned maintenance event to the Azure platform or an underlying hardware / infrastructure fault, the use of availability sets would ensure that at least one VM remains running.

As a best practice, applications should not reside on a single VM. An availability set that contains a single VM doesn't gain any protection from planned or unplanned events within the Azure platform. The [Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines) requires two or more VMs within an availability set in order to allow the distribution of VMs across the underlying infrastructure. 

When designing your application infrastructure, you should also plan out the application tiers that you will use. Group together VMs that serve the same purpose in to availability sets, such as an availability set for your front-end VMs running IIS, Nginx, Apache, etc. Create a separate availability set for your back-end VMs running SQL Server, MongoDB, MySQL, etc. The goal is to ensure that each component of your application is protected by an availability set and at least once instance will always remain running.

Load balancers can be utilized in front of each application tier to work alongside an availability set and ensure traffic can always be routed to a running instance.

For more detailed information about availability sets and how VMs are distributed across update domains and fault domains, see [Manage the availability of virtual machines](virtual-machines-linux-manage-availability.md).


## Next steps
[AZURE.INCLUDE [virtual-machines-linux-infrastructure-guidelines-next-steps](../../includes/virtual-machines-linux-infrastructure-guidelines-next-steps.md)] 