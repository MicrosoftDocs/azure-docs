<properties
	pageTitle="windows Virtual Machines Guidelines | Microsoft Azure"
	description="Learn about the key design and implementation guidelines for deploying windows virtual machines into Azure"
	documentationCenter=""
	services="virtual-machines-windows"
	authors="iainfoulds"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/30/2016"
	ms.author="iainfou"/>

# Virtual machines guidelines

[AZURE.INCLUDE [virtual-machines-windows-infrastructure-guidelines-intro](../../includes/virtual-machines-windows-infrastructure-guidelines-intro.md)] 

This article focuses on understanding the required planning steps for creating and managing virtual machines (VMs) within your Azure environment.

## Implementation guidelines for VMs
Decisions:

- How many VMs do you require for your various application tiers and components of your infrastructure?
- What CPU and memory resources does each VM need, and what are the storage requirements?

Tasks:

- Define the workloads for your application and the resources the VM will require.
- Align the resource demands for each VM with the appropriate VM size and storage type.
- Define your resource groups for the different tiers and components of your infrastructure.
- Define your VM naming convention.
- Create your VMs using the Azure PowerShell, web portal, or with Resource Manager templates.

## Virtual machines

One of the main components within your Azure environment will likely be VMs. This is where you will run your applications, databases, authentication services, etc.

It is important to understand the [different VM sizes](virtual-machines-windows-sizes.md) in order to correctly size your environment from a performance and cost perspective. If your VMs do not have an adequate amount of CPU cores or memory, performance of your application will suffer regardless of how well it is designed and developed. Review the suggested workloads for each VM series as a starting point as you decide which size VM to use for each component in your infrastructure. You can [change the size of a VM](https://azure.microsoft.com/blog/resize-virtual-machines/) after deployment.

Storage plays a key role in VM performance. You can use Standard storage that use regular spinning disks, or Premium storage for high I/O workloads and peak performance that use SSD disks. As with the VM size, there are cost considerations when it comes to selecting the storage medium. You can read the [storage infrastructure guidelines article](virtual-machines-windows-infrastructure-storage-solutions-guidelines.md) to understand how to design appropriate storage for optimum performance of your VMs.


## Resource groups
Components such as VMs are logically grouped together for ease of management and maintenance using [Azure Resource Groups](../resource-group-overview.md). By using resource groups, you can create, manage, and monitor all the resources that make up a given application. You can also implement [role-based access controls](../active-directory/role-based-access-control-what-is.md) to grant access to others within your team to only the resources they require. Take time to plan out your resource groups and role assignments. There are different approaches to actually design and implement resource groups, so be sure to read the [resource groups guidelines article](virtual-machines-windows-infrastructure-resource-groups-guidelines.md) to understand how best to build out your VMs.


## Templates 
You can build templates, defined by declarative JSON files, to create your VMs. Templates will typically also build out the required storage, networking, network interfaces, IP addressing, etc. along with the VMs themselves. You can use templates to create consistent, reproducible environments for development and testing purposes to easily replicate production environments and vice versa. You can read more about [building and using templates](../resource-group-overview.md#template-deployment) to understand how you can use them for creating and deploying your VMs.


## Next steps
[AZURE.INCLUDE [virtual-machines-windows-infrastructure-guidelines-next-steps](../../includes/virtual-machines-windows-infrastructure-guidelines-next-steps.md)] 