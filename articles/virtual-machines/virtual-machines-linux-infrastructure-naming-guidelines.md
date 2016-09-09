<properties
	pageTitle="Infrastructure Naming Guidelines | Microsoft Azure"
	description="Learn about the key design and implementation guidelines for naming in Azure infrastructure services."
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

# Infrastructure naming guidelines

[AZURE.INCLUDE [virtual-machines-linux-infrastructure-guidelines-intro](../../includes/virtual-machines-linux-infrastructure-guidelines-intro.md)] 

This article focuses on understanding how to approach naming conventions for all your various Azure resources in order to build a logical and easily identifiable set of resources across your environment.

## Implementation guidelines for naming conventions

Decisions:

- What are your naming conventions for Azure resources?

Tasks:

- Define the affixes that you will use across your resources to maintain consistency.
- Define storage account names given the requirement for them to be globally unique.
- Document the naming convention to be used and distribute to all parties involved to ensure consistency across deployments.

## Naming conventions

You should have a good naming convention in place before creating anything in Azure. A naming convention ensures that all the resources have a predictable name, which helps lower the administrative burden associated with managing those resources.

You might choose to follow a specific set of naming conventions defined for your entire organization or for a specific Azure subscription or account. Although it is easy for individuals within organizations to establish implicit rules when working with Azure resources, when a team needs to work on a project on Azure, that model does not scale well.

You should agree on a set of naming conventions up front. There are some considerations regarding naming conventions that cut across that sets of rules.

## Affixes

As you look to define a naming convention, one decision comes as to whether the affix will be at:

- The beginning of the name (prefix)
- The end of the name (suffix)

For instance, here are two possible names for a Resource Group using the `rg` affix:

- Rg-WebApp (prefix)
- WebApp-Rg (suffix)

Affixes can refer to different aspects that describe the particular resources. The following table shows some examples typically used.

| Aspect                               | Examples                                                               | Notes                                                                                                      |
|:-------------------------------------|:-----------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------|
| Environment                          | dev, stg, prod                                                         | Depending on the purpose and name of each environment.                                                     |
| Location                             | usw (West US), use (East US 2)                                         | Depending on the region of the datacenter or the region of the organization.                               |
| Azure component, service, or product | Rg for resource group, VNet for virtual network                        | Depending on the product for which the resource provides support.                                          |
| Role                                 | db, app, web                                                           | Depending on the role of the virtual machine.                                                              |
| Instance                             | 01, 02, 03, etc.                                                       | For resources that have more than one instance. For example, load balanced web servers in a cloud service. |


When establishing your naming conventions, make sure that they clearly state which affixes to use for each type of resource, and in which position (prefix vs suffix).

## Dates

It is often important to determine the date of creation from the name of a resource. We recommend the YYYYMMDD date format. This format ensures that not only the full date is recorded, but also that two resources whose names differ only on the date will be sorted alphabetically and chronologically at the same time.

## Naming resources

You should define each type of resource in the naming convention, which should have rules that define how to assign names to each resource that is created. These rules should apply to all types of resources, for example:

- Subscriptions
- Accounts
- Storage accounts
- Virtual networks
- Subnets
- Availability sets
- Resource groups
- Virtual machines
- Endpoints
- Network security groups
- Roles

To ensure that the name provides enough information to determine to which resource it refers, you should use descriptive names.

## Computer names

When you create a virtual machine (VM), Microsoft Azure requires a VM name of up to 15 characters which is used for the resource name. Azure uses the same name for the operating system installed in the VM. However, these names might not always be the same.

In case a VM is created from a .vhd image file that already contains an operating system, the VM name in Azure can differ from the VM's operating system computer name. This situation can add a degree of difficulty to VM management, which we therefore do not recommend. Assign the Azure VM resource the same name as the computer name that you assign to the operating system of that VM.

We recommend that the Azure VM name be the same as the underlying operating system computer name.

## Storage account names

Storage accounts have special rules governing their names. You can only use lowercase letters and numbers. See [Create a storage account](../storage/storage-create-storage-account.md#create-a-storage-account) for more information. Additionally, the storage account name, in combination with core.windows.net, should be a globally valid, unique DNS name. For instance, if the storage account is called mystorageaccount, the following resulting DNS names should be unique:

- mystorageaccount.blob.core.windows.net
- mystorageaccount.table.core.windows.net
- mystorageaccount.queue.core.windows.net


## Next steps
[AZURE.INCLUDE [virtual-machines-linux-infrastructure-guidelines-next-steps](../../includes/virtual-machines-linux-infrastructure-guidelines-next-steps.md)] 