---
title: DevTest Labs concepts | Microsoft Docs
description: Learn the basic concepts of DevTest Labs, and how it can make it easy to create, manage, and monitor Azure virtual machines
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila
editor: ''

ms.assetid: 105919e8-3617-4ce3-a29f-a289fa608fb2
ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/05/2018
ms.author: spelluru

---
# DevTest Labs concepts
## Overview
The following list contains key DevTest Labs concepts and definitions:

## Labs
A lab is the infrastructure that encompasses a group of resources, such as Virtual Machines (VMs), that lets you better manage those resources by specifying limits and quotas.

## Virtual machine
An Azure VM is one of several types of [on-demand, scalable computing resources](/azure/architecture/guide/technology-choices/compute-decision-tree) that Azure offers. Azure VMs give you the flexibility of virtualization without having to buy and maintain the physical hardware that runs it, although you still need to maintain the VM by performing certain tasks, such as configuring, patching, and installing the software that runs on it.

[Overview of Windows virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-overview) gives you information about what you should consider before you create a VM, how you create it, and how you manage it.

## Claimable VM
An Azure Claimable VM is a virtual machine that is available for use by any lab user with permissions. A lab admin can prepare VMs with specific base images and artifacts and save them to a shared pool. A lab user can then claim a working VM from the pool when they need one with that specific configuration.

A VM that is claimable is not initially assigned to any particular user, but will show up in every user's list under "Claimable virtual machines". After a VM is claimed by a user, it is moved up to their "My virtual machines" area and is no longer claimable by any other user.

## Environment
In DevTest Labs, an environment refers to a collection of Azure resources in a lab. [This blog post](https://blogs.msdn.microsoft.com/devtestlab/2016/11/16/connect-2016-news-for-azure-devtest-labs-azure-resource-manager-template-based-environments-vm-auto-shutdown-and-more/) discusses how to create multi-VM environments from your Azure Resource Manager templates.

## Base images
Base images are VM images with all the tools and settings preinstalled and configured to quickly create a VM. You can provision a VM by picking an existing base and adding an artifact to install your test agent. You can then save the provisioned VM as a base so that the base can be used without having to reinstall the test agent for each provisioning of the VM.

## Artifacts
Artifacts are used to deploy and configure your application after a VM is provisioned. Artifacts can be:

* Tools that you want to install on the VM - such as agents, Fiddler, and Visual Studio.
* Actions that you want to run on the VM - such as cloning a repo.
* Applications that you want to test.

Artifacts are [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) JSON files that contain instructions to perform deployment and apply configuration.

## Artifact repositories
Artifact repositories are git repositories where artifacts are checked in. Artifact repositories can be added to multiple labs in your organization enabling reuse and sharing.

## Formulas
Formulas, in addition to base images, provide a mechanism for fast VM provisioning. A formula in DevTest Labs is a list of default property values used to create a lab VM.
With formulas, VMs with the same set of properties - such as base image, VM size, virtual network, and artifacts - can be created without needing to specify those
properties each time. When creating a VM from a formula, the default values can be used as-is or modified.

## Policies
Policies help in controlling cost in your lab. For example, you can create a policy to automatically shut down VMs based on a defined schedule.

## Caps
Caps is a mechanism to minimize waste in your lab. For example, you can set a cap to restrict the number of VMs that can be created per user, or in a lab.

## Security levels
Security access is determined by Azure Role-Based Access Control (RBAC). To understand how access works, it helps to understand the differences between a permission, a role, and a scope as defined by RBAC.

* Permission - A permission is a defined access to a specific action (e.g. read-access to all virtual machines).
* Role - A role is a set of permissions that can be grouped and assigned to a user. For example, the *subscription owner* role has access to all resources within a subscription.
* Scope - A scope is a level within the hierarchy of an Azure resource, such as a resource group, a single lab, or the entire subscription.

Within the scope of DevTest Labs, there are two types of roles to define user permissions: lab owner and lab user.

* Lab Owner - A lab owner has access to any resources within the lab. Therefore, a lab owner can modify policies, read and write any VMs, change the virtual network, and so on.
* Lab User - A lab user can view all lab resources, such as VMs, policies, and virtual networks, but cannot modify policies or any VMs created by other users.

To see how to create custom roles in DevTest Labs, refer to the article, [Grant user permissions to specific lab policies](devtest-lab-grant-user-permissions-to-specific-lab-policies.md).

Since scopes are hierarchical, when a user has permissions at a certain scope, they are automatically granted those permissions at every lower-level scope encompassed. For instance, if a user is assigned to the role of subscription owner, then they have access to all resources in a subscription, which include all virtual machines, all virtual networks, and all labs. Therefore, a subscription owner automatically inherits the role of lab owner. However, the opposite is not true. A lab owner has access to a lab, which is a lower scope than the subscription level. Therefore, a lab owner will not be able to see virtual machines or virtual networks or any resources that are outside of the lab.

## Azure Resource Manager templates
All of the concepts discussed in this article can be configured by using Azure Resource Manager templates, which let you define the infrastructure/configuration of your Azure solution and repeatedly deploy it in a consistent state.

[Understand the structure and syntax of Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-authoring-templates#template-format) describes the structure of an Azure Resource Manager template and the properties that are available in the different sections of a template.

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Next steps
[Create a lab in DevTest Labs](devtest-lab-create-lab.md)
