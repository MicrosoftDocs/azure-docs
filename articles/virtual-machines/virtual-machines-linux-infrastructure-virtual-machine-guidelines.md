<properties
	pageTitle="Azure Virtual Machines Guidelines"
	description="Learn about the key design and implementation guidelines for deploying virtual machines into Azure infrastructure services."
	documentationCenter=""
	services="virtual-machines-linux"
	authors="iainfoulds"
	manager="timlt"
	editor=""
	tags="azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/17/2016"
	ms.author="iainfouh"/>

# Azure Virtual Machines Guidelines

[AZURE.INCLUDE [virtual-machines-linux-infrastructure-guidelines-intro](../../includes/virtual-machines-linux-infrastructure-guidelines-intro.md)] This article focuses on understanding the required planning steps for creating and managing virtual machines (VMs) within your Azure environment.

## Virtual machines

One of the main components within your Azure environment will likely be VMs. VMs will run your applications, databases, authentication services, etc.

It is important to understand the [different VM sizes](virtual-machines-linux-sizes.md) in order to correctly size your environment from a performance and cost perspective. If your VMs do not have an adequate amount of CPU cores or memory, performance of your application will suffer regardless of how well it is designed and developed. You should also read about [storage infrastructure guidelines](virtual-machines-linux-infrastructure-storage-solutions-guidelines.md) to understand how to design appropriate storage for optimum performance of your VMs.

Resources such as VMs are logically grouped together for ease of management and update cycles using [resource groups](../resource-group-overview.md). By using resource groups, you can create, manage, and monitor all the resources that make up a given application. You can also implement [role-based access controls](../active-directory/role-based-access-control-what-is.md) to grant access to others within your team to only the resources they require. Take time to plan out your resource groups and role assignments.

## Implementation guidelines recap for virtual machines

Decision:

- How many VMs do you require for your various application tiers and components of your infrastructure and will you manage them?

Tasks:

- Define your VM naming convention.
- Define your resource groups for the different tiers and components of your infrastructure.
- Create your VMs using the Azure portal, the Azure CLI, or with Resource Manager templates.

## Next steps

Now that you have read about virtual machines you can read up on the guidelines for other Azure services.

* [Azure Availability Set Guidelines](availability-sets-guidelines.md)
* [Azure Cloud Services Infrastructure Guidelines](virtual-machines-linux-infrastructure-cloud-services-guidelines.md)
* [Azure Subscription and Accounts Guidelines](virtual-machines-linux-infrastructure-subscription-accounts-guidelines.md)
* [Azure Infrastructure Naming Guidelines](virtual-machines-linux-infrastructure-naming-guidelines.md)
* [Azure Networking Infrastructure Guidelines](virtual-machines-linux-infrastructure-networking-guidelines.md)
* [Azure Storage Solutions Infrastructure Guidelines](virtual-machines-linux-infrastructure-storage-solutions-guidelines.md)
* [Azure Example Infrastructure Walkthrough](virtual-machines-linux-infrastructure-example.md)

Once you have reviewed the guidelines documents you can move over to the [Azure Concepts section](virtual-machines-linux-azure-overview.md) to start building your new infrastructure on Azure.
