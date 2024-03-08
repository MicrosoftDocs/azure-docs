---
title: Azure DevTest Labs concepts
description: Learn definitions of some basic DevTest Labs concepts related to labs, virtual machines (VMs), and environments.
ms.topic: conceptual
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: UpdateFrequency2
---

# DevTest Labs concepts

This article lists key [Azure DevTest Labs](https://azure.microsoft.com/services/devtest-lab) concepts and definitions. DevTest Labs is a service for easily creating, using, and managing Azure VMs and other resources.

## Labs

A lab is the infrastructure that encompasses a group of resources such as virtual machines (VMs). In a lab, you can:

- Add and configure users.
- Create ready-made VMs for lab users to claim and use.
- Let users create and configure their own lab VMs and environments.
- Connect artifact and template repositories to the lab.
- Specify allowed VM limits, sizes, and configurations.
- Set auto-shutdown and auto-startup policies.
- Track and manage lab costs.

### Policies

Policies help control lab costs and reduce waste. For example, policies can automatically shut down lab VMs based on a defined schedule, or limit the number or sizes of VMs per user or lab. For more information, see [Manage lab policies to control costs](devtest-lab-set-lab-policy.md).

### Repositories

Lab users can use artifacts and templates from public and private Git repositories to create lab VMs and environments. The [DevTest Labs public GitHub repositories](https://github.com/Azure/azure-devtestlab) offer many ready-to-use artifacts and Azure Resource Manager (ARM) templates.

Lab owners can also create custom artifacts and ARM templates, store them in private Git repositories, and connect the repositories to their labs. Lab users and automated processes can then use the templates and artifacts. You can add the same repositories to multiple labs in your organization, promoting consistency, reuse, and sharing.

For more information, see [Add an artifact repository to a lab](add-artifact-repository.md) and [Add template repositories to labs](devtest-lab-use-resource-manager-template.md#add-template-repositories-to-labs).

### Roles

[Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) defines DevTest Labs access and roles. DevTest Labs has three roles that define lab member permissions: Owner, Contributor, and DevTest Labs User. 

- Lab Owners can do all lab tasks, such as reading or writing to lab resources, managing users, setting policies and configurations, and adding repositories and base images.
  - Because Azure subscription owners have access to all resources in a subscription, which include labs, virtual networks, and VMs, a subscription owner automatically inherits the lab Owner role.
  - Lab Owners can also create custom DevTest Labs roles. For more information, see [Grant user permissions to specific lab policies](devtest-lab-grant-user-permissions-to-specific-lab-policies.md).

- Contributors can do everything that owners can, except manage users.

- DevTest Labs Users can view all lab resources and policies, and create and modify their own VMs and environments.
  - Users automatically have Owner permissions on their own VMs.
  - Users can't modify lab policies, or change any VMs that other users own.

For more information about access and roles, see [Add lab owners, contributors, and users](devtest-lab-add-devtest-user.md).

## Virtual machines

An Azure VM is one type of [on-demand, scalable computing resource](/azure/architecture/guide/technology-choices/compute-decision-tree) that Azure offers. Azure VMs give you the flexibility of virtualization without having to buy and maintain the physical hardware that runs it. For more information about VMs, see [Windows virtual machines in Azure](../virtual-machines/windows/overview.md).

### Artifacts
Artifacts are tools, actions, or software you can add to lab VMs during or after VM creation. For example, artifacts can be:

- Tools to install on the VM, like agents, Fiddler, or Visual Studio.
- Actions to take on the VM, such as cloning a repository or joining a domain.
- Applications that you want to test.

For more information, see [Add artifacts to DevTest Labs VMs](add-artifact-vm.md).

Lab owners can specify mandatory artifacts to be installed on all lab VMs during VM creation. For more information, see [Specify mandatory artifacts for DevTest Labs VMs](devtest-lab-mandatory-artifacts.md).

### Base images

A base image is a VM image that can have software and settings preinstalled and configured. Base images reduce VM creation time and complexity. Lab owners can choose which base images to make available in their labs. Lab users can create VMs by choosing from the available bases. For more information, see [Create and add virtual machines to a lab](devtest-lab-add-vm.md).

### Claimable VMs

Lab owners or admins can prepare VMs with specific base images and artifacts, and save them to a shared pool. These claimable VMs appear in the lab's **Claimable virtual machines** list. Any lab user can claim a VM from the claimable pool when they need a VM with that configuration.

After a lab user claims a VM, the VM moves to that user's **My virtual machines** list, and the user becomes the owner of the VM. The VM is no longer claimable or configurable by other users. For more information, see [Create and manage claimable VMs](devtest-lab-add-claimable-vm.md).

### Custom images and formulas

In DevTest Labs, custom images and formulas are mechanisms for fast VM creation and provisioning.

- A custom image is a VM image created from an existing VM or virtual hard drive (VHD), which can have software and other artifacts installed. Lab users can create identical VMs from the custom image. For more information, see [Create a custom image from a VM](devtest-lab-create-custom-image-from-vm-using-portal.md).

- A formula is a list of default property values for creating a lab VM, such as base image, VM size, virtual network, and artifacts. You can create VMs with the same properties without having to specify those properties each time. When you create a VM from a formula, you can use the default values as-is or modify them. For more information, see [Manage Azure DevTest Labs formulas](devtest-lab-manage-formulas.md).

For more information about the differences between custom images and formulas, see [Compare custom images and formulas](devtest-lab-comparing-vm-base-image-types.md).

## Environments

In DevTest Labs, an environment is a collection of Azure platform-as-a-service (PaaS) resources, such as an Azure Web App or a SharePoint farm. You can create environments in labs by using ARM templates. For more information, see [Use ARM templates to create DevTest Labs environments](devtest-lab-create-environment-from-arm.md). For more information about ARM template structure and properties, see [Template format](../azure-resource-manager/templates/syntax.md#template-format).

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]
