<properties
	pageTitle="Azure Availability Sets Infrastructure Guidelines"
	description="Learn about the key design and implementation guidelines for deploying Availability Sets in Azure infrastructure services."
	documentationCenter=""
	services="virtual-machines-linux"
	authors="vlivech"
	manager="timlt"
	editor=""
	tags="azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/05/2016"
	ms.author="v-livech"/>

# Azure Availability Sets Infrastructure Guidelines

This guidance identifies many areas for which planning is vital to the success of an IT workload in Azure. In addition, planning provides an order to the creation of the necessary resources. Although there is some flexibility, we recommend that you apply the order in this article to your planning and decision-making.

## Availability sets

In Azure PaaS, cloud services contain one or more roles that execute application code. Roles can have one or more virtual machine instances that the fabric automatically provisions. At any given time, Azure might update the instances in these roles, but because they are part of the same role, Azure knows not to update all at the same time to prevent a service outage for the role.

In Azure IaaS, the concept of role is not significant, because each IaaS virtual machine represents a role with a single instance. In order to hint to Azure not to bring down two or more associated machines at the same time (for example, for operating system updates of the node where they reside), the concept of availability sets was introduced. An availability set tells Azure not to bring down all the machines in the same availability set at the same time to prevent a service outage. The virtual machine members of an availability set have a 99.95% uptime service level agreement.

Availability sets must be part of the high-availability planning of the solution. An availability set is defined as the set of virtual machines within a single cloud service that have the same availability set name. You can create availability sets after you create cloud services.

## Implementation guidelines recap for availability sets

Decision:

- How many availability sets do you need for the various roles and tiers in your IT workload or infrastructure?

Task:

- Define the set of availability sets using your naming convention. You can associate a virtual machine to an availability set when you create the virtual machines, or you can associate a virtual machine to an availability set after the virtual machine has been created.
