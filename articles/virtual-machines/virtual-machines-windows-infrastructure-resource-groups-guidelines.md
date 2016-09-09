<properties
	pageTitle="Resource Groups Guidelines | Microsoft Azure"
	description="Learn about the key design and implementation guidelines for deploying Resource Groups in Azure infrastructure services."
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

# Azure resource group guidelines

[AZURE.INCLUDE [virtual-machines-windows-infrastructure-guidelines-intro](../../includes/virtual-machines-windows-infrastructure-guidelines-intro.md)] 

This article focuses on understanding how to logically build out your environment and group together all the components in Resource Groups.


## Implementation guidelines for Resource Groups

Decisions:

- Are you going to build out Resource Groups by the core infrastructure components, or by complete application deployment?
- Do you need to restrict access to Resource Groups using Role-Based Access Controls?

Tasks:

- Define what core infrastructure components you will need and if you will use dedicated Resource Groups.
- Review how you can implement Resource Manager templates for consistent, reproducible deployments.
- Define what user access roles you will need for controlling access to Resource Groups.
- Create the set of Resource Groups using your naming convention. You can use Azure PowerShell or the portal.


## Resource Groups

In Azure, you can logically group together related resources such as storage accounts, virtual networks, and virtual machines (VMs) in order to deploy, manage, and maintain them as a single entity. This makes it easier to deploy applications while keeping all the related resources together from a management perspective, or to grant others access to that group of resources. For a more comprehensive understanding of Resource Groups, you can read the [Azure Resource Manager overview](../resource-group-overview.md).

A key feature to Resource Groups is ability to build out your environment using templates. A template is simply a JSON file that declares the storage, networking, and compute resources, along with any related custom scripts or configurations to apply. By using these templates, you can create consistent, reproducible deployments for your applications. This makes it easy to build out an environment in development and then use that same template to create a production deployment, or vice versa. For a better understanding using templates, you can read [the template walkthrough](../resource-manager-template-walkthrough.md) which guides you through each step of the building out a template.

There are two different approaches you can take when designing your environment with Resource Groups:

- Resource Groups for each application deployment that combines the storage accounts, virtual networks and subnets, VMs, load balancers, etc.
- Centralized Resource Groups that contain your core virtual networking and subnets or storage accounts, with your applications in their own Resource Groups that only contain VMs, load balancers, network interfaces, etc.

As you scale out, creating centralized Resource Groups for your virtual networking and subnets makes it easier to build cross-premises network connections for hybrid connectivity options, rather than each application having their own virtual network that requires configuration and maintenance. [Role-Based Access Controls](../active-directory/role-based-access-control-what-is.md) provide a granular way to control access to Resource Groups. For production applications, you can control the users that may access those resources, or for the core infrastructure resources you can limit only infrastructure engineers to work with them. Your application owners will only have access to the application components within their Resource Group and not the core Azure infrastructure of your environment. As you design our your environment, consider the users that will require access to the resources and design your Resource Groups accordingly. 


## Next steps

[AZURE.INCLUDE [virtual-machines-windows-infrastructure-guidelines-next-steps](../../includes/virtual-machines-windows-infrastructure-guidelines-next-steps.md)] 