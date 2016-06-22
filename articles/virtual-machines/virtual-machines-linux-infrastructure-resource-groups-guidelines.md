<properties
	pageTitle="Azure Resource Groups Infrastructure Guidelines | Microsoft Azure"
	description="Learn about the key design and implementation guidelines for deploying Resource Groups in Azure infrastructure services."
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

# Azure Resource Group Infrastructure Guidelines

[AZURE.INCLUDE [virtual-machines-linux-infrastructure-guidelines-intro](../../includes/virtual-machines-linux-infrastructure-guidelines-intro.md)] This article focuses on understanding how to logically build out your environment and group together all the components in Resource Groups.

## Resource Groups

In Azure, you can group together related resources in order to deploy, manage, and maintain them as a single entity. Using Resource Groups, you can logically bring together storage accounts, virtual networks, IP addresses, virtual machines (VMs), load balancers, etc. and maintain them in a single pane. This makes it easier to deploy applications and keep all the related resources together from a management or maintenance perspective, or to grant others access to that particular application.

A key component to Resource Groups is to build our your environment using a JSON file that declares the building blocks for storage, networking, compute, and any related custom scripts or configurations to apply. By using these JSON templates, you can create consistent, reproducible deployments for your applications. This makes it easy to build out an environment in development and then use that same template to create a production deployment, or vice versa.

There are two different approaches you could take when designing your environment with Resource Groups:

- Resource Groups for each application deployment, combining the storage accounts, virtual networks and subnets, VMs, load balancers, etc.
- Centralized Resource Groups that contain your core virtual networking and subnets, or storage accounts, with your applications in their own Resource Groups that only contain VMs, load balancers, network interfaces, etc.

As you scale out, creating Resource Groups for your virtual networking and subnets makes it easier to make cross-premises network connections for hybrid connectivity options, rather than each application having their own virtual network that requires configuration and maintenance. Your application owners only then have access to the application components within their Resource Group and not the core Azure infrastructure of your environment.

Role-Based Access Controls also then allow you to very granular in how you assign out access to Resource Groups. For production applications, you can control users that can access those resources, or for the core infrastructure resources you can limit only infrastructure engineers to work with them. As you design our your environment, consider which users will require access to resources and try to design your Resource Groups accordingly. 

## Implementation guidelines recap for Resource Groups

Decision:

- Are you going to build our Resource Groups for the core infrastructure components, or by complete application deployment?
- Do you need to restrict access to Resource Groups using Role-Based Access Controls?

Task:

- Define what core infrastructure components you will need and if you will use dedicated Resource Groups.
- Review how you can implement Resource Manager templates for consistent, reproducible deployments.
- Define what user access roles you will need for controlling access to Resource Groups.
- Create the set of Resource Groups using your naming convention. You can use the Azure CLI or portal.

## Next steps

Now that you have read about Azure Availability Sets you can read up on the guidelines for other Azure services.

* [Azure Availability Sets Infrastructure Guidelines](virtual-machines-linux-infrastructure-availability-sets-guidelines.md)
* [Azure Subscription and Accounts Guidelines](virtual-machines-linux-infrastructure-subscription-accounts-guidelines.md)
* [Azure Infrastructure Naming Guidelines](virtual-machines-linux-infrastructure-naming-guidelines.md)
* [Azure Virtual Machines Guidelines](virtual-machines-linux-infrastructure-virtual-machine-guidelines.md)
* [Azure Networking Infrastructure Guidelines](virtual-machines-linux-infrastructure-networking-guidelines.md)
* [Azure Storage Solutions Infrastructure Guidelines](virtual-machines-linux-infrastructure-storage-solutions-guidelines.md)
* [Azure Example Infrastructure Walkthrough](virtual-machines-linux-infrastructure-example.md)

Once you have reviewed the guidelines documents you can move over to the [Azure Concepts section](virtual-machines-linux-azure-overview.md) to start building your new infrastructure on Azure.
