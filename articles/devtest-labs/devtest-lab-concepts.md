---
title: Azure DevTest Labs concepts
description: Learn the basic concepts of DevTest Labs, and how it can make it easy to create, manage, and monitor Azure virtual machines
ms.topic: conceptual
ms.date: 10/29/2021
---

# DevTest Labs concepts

This article lists key DevTest Labs concepts and definitions:

## Lab
A lab is the infrastructure that encompasses a group of resources, such as Virtual Machines (VMs), that lets you better manage those resources by specifying limits and quotas.

## Virtual machine
An Azure VM is one type of [on-demand, scalable computing resource](/azure/architecture/guide/technology-choices/compute-decision-tree) that Azure offers. Azure VMs give you the flexibility of virtualization without having to buy and maintain the physical hardware that runs it.

[Overview of Windows virtual machines in Azure](../virtual-machines/windows/overview.md) gives you information to consider before you create a VM, how you create it, and how you manage it.

## Claimable VM
An Azure Claimable VM is a virtual machine available to any lab user with permissions. Lab admins can prepare VMs with specific base images and artifacts and then save them to a shared pool. Lab users can claim a VM from the pool when they need one with that specific configuration.

A VM that is claimable isn't initially assigned to any particular user, but will show up in every user's list under "Claimable virtual machines". After a VM is claimed by a user, it's moved up to **My virtual machines**  and is no longer claimable by any other user.

## Environment
In DevTest Labs, an environment refers to a collection of Azure resources in a lab. [Create an environment](./devtest-lab-create-environment-from-arm.md) discusses how to create multi-VM environments from your Azure Resource Manager templates.

## Base images
Base images are VM images with all the tools and settings preinstalled and configured. You can create a VM by picking an existing base and adding an artifact to install your test agent. The use of base images reduces VM creation time.

## Artifacts
Artifacts are used to deploy and configure your application after a VM is provisioned. Artifacts can be:

* Tools that you want to install on the VM - such as agents, Fiddler, and Visual Studio.
* Actions that you want to run on the VM - such as cloning a repo.
* Applications that you want to test.

Artifacts are [Azure Resource Manager](../azure-resource-manager/management/overview.md) JSON files that contain instructions to deploy and apply configurations.

## Artifact repositories
Artifact repositories are git repositories where artifacts are checked in. Artifact repositories can be added to multiple labs in your organization enabling reuse and sharing.

## Formulas
Formulas provide a mechanism for fast VM provisioning. A formula in DevTest Labs is a list of default property values used to create a lab VM.
With formulas, VMs with the same set of properties - such as base image, VM size, virtual network, and artifacts - can be created without needing to specify those
properties each time. When creating a VM from a formula, the default values can be used as-is or modified.

## Policies
Policies help in controlling cost in your lab. For example, you can create a policy to automatically shut down VMs based on a defined schedule.

## Caps
Caps is a mechanism to minimize waste in your lab. For example, you can set a cap to restrict the number of VMs that can be created per user, or in a lab.

## Security levels
Security access is determined by Azure role-based access control (Azure RBAC). To understand how access works, it helps to understand the differences between a permission, a role, and a scope as defined by Azure RBAC.

|Term | Description |
|---|---|
|Permission|A defined access to a specific action (for example, read-access to all virtual machines).|
|Role| A set of permissions that can be grouped and assigned to a user. For example, the *subscription owner* role has access to all resources within a subscription.|
|Scope| A level within the hierarchy of an Azure resource, such as a resource group, a single lab, or the entire subscription.|


Within the scope of DevTest Labs, there are two types of roles to define user permissions: lab owner and lab user.

|Role | Description |
|---|---|
|Lab&nbsp;Owner| Has access to any resources within the lab. A lab owner can modify policies, read and write any VMs, change the virtual network, and so on.|
|Lab User | Can view all lab resources, such as VMs, policies, and virtual networks, but can't modify policies or any VMs created by other users.|

To see how to create custom roles in DevTest Labs, refer to the article [Grant user permissions to specific lab policies](devtest-lab-grant-user-permissions-to-specific-lab-policies.md).

Since scopes are hierarchical, when a user has permissions at a certain scope, they also have permissions at every lower-level scope. Subscription owners have access to all resources in a subscription, which include virtual machines, virtual networks, and labs. A subscription owner automatically inherits the role of lab owner. However, the opposite isn't true; a lab owner has access to a lab, which is a lower scope than the subscription level. So, a lab owner can't see virtual machines or virtual networks or any resources that are outside of the lab.

## Azure Resource Manager templates
The concepts discussed in this article can be configured by using Azure Resource Manager (ARM) templates. ARM templates let you define the infrastructure/configuration of your Azure solution and repeatedly deploy it in a consistent state.

[Template format](../azure-resource-manager/templates/syntax.md#template-format) describes the structure of an Azure Resource Manager template and the properties that are available in the different sections of a template.

## Next steps

[Create a lab in DevTest Labs](devtest-lab-create-lab.md)
