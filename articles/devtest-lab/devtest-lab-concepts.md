<properties
	pageTitle="DevTest Labs concepts | Microsoft Azure"
	description="Learn the basic concepts of DevTest Labs, and how it can make it easy to create, manage, and monitor Azure virtual machines"
	services="devtest-lab,virtual-machines"
	documentationCenter="na"
	authors="tomarcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="devtest-lab"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/25/2016"
	ms.author="tarcher"/>

#DevTest Labs concepts

> [AZURE.NOTE]
> This article is part 3 of a 3 part series:
> 
> 1. [What is DevTest Labs?](devtest-lab-overview.md)
> 1. [Why DevTest Labs?](devtest-lab-why.md)
> 1. **[DevTest Labs concepts](devtest-lab-concepts.md)**

##Overview

The following list contains key DevTest Labs concepts and definitions:

##Artifacts
Artifacts are used to deploy and configure your application after a VM is provisioned. Artifacts can be:

- Tools that you want to install on the VM - such as agents, Fiddler, and Visual Studio.
- Actions that you want to run on the VM - such as cloning a repo.
- Applications that you want to test.

Artifacts are [Azure Resource Manager](../resource-group-overview.md) JSON files that contain instructions to perform deployment and apply configuration. 

##Artifact repositories
Artifact repositories are git repositories where artifacts are checked in. Same artifact repositories can be added to multiple labs in your organization enabling reuse and sharing.

## Base images
Base images are VM images with all the tools and settings preinstalled and configured to quickly create a VM. You can provision a VM by picking an existing base and adding an artifact to install your test agent. You can then save the provisioned VM as a base so that the base can be used without having to reinstall the test agent for each provisioning of the VM.

##Formulas 
Formulas, in addition to base images, provide a mechanism for fast VM provisioning. A formula in DevTest Labs is a list of default property values used to create a lab VM. 
With formulas, VMs with the same set of properties - such as base image, VM size, virtual network, and artifacts - can be created without needing to specify those 
properties each time. When creating a VM from a formula, the default values can be used as-is or modified.

##Caps
Caps is a mechanism to minimize waste in your lab. For example, you can set a cap to restrict the number of VMs that can be created per user, or in a lab.

##Policies
Policies help in controlling cost in your lab. For example, you can create a policy to automatically shut down VMs based on a defined schedule.

##Security levels
Security access is determined by Azure Role-Based Access Control (RBAC). To understand how access works, it helps to understand the differences between a permission, a role, and a scope as defined by RBAC. 

- Permission - A permission is a defined access to a specific action (e.g. read-access to all virtual machines). 
- Role - A role is a set of permissions that can be grouped and assigned to a user. For example, the *subscription owner* role has access to all resources within a subscription. 
- Scope - A scope is a level within the hierarchy of an Azure resource - such as a resource group, a single lab, or the entire subscription).
 
Within the scope of DevTest Labs, there are two types of roles to define user permissions: lab owner and lab user.

- Lab Owner - A lab owner has access to any resources within the lab. Therefore, a lab owner can modify policies, read and write any VMs, change the virtual network, and so on. 
- Lab User - A lab user can view all lab resources, such as VMs, policies, and virtual networks, but cannot modify policies or any VMs created by other users. 


To see how to create custom roles in DevTest Labs, refer to the article, [Grant user permissions to specific lab policies](devtest-lab-grant-user-permissions-to-specific-lab-policies.md).

Since scopes are hierarchical, when a user has permissions at a certain scope, they are automatically granted those permissions at every lower-level scope encompassed. For instance, if a user is assigned to the role of subscription owner, then they have access to all resources in a subscription, which include all virtual machines, all virtual networks, and all labs. Therefore, a subscription owner automatically inherits the role of lab owner. However, the opposite is not true. A lab owner has access to a lab, which is a lower scope than the subscription level. Therefore, a lab owner will not be able to see virtual machines or virtual networks or any resources that are outside of the lab.

[AZURE.INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

##Next steps

[Create a lab in DevTest Labs](devtest-lab-create-lab.md)