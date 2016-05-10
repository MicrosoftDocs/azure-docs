<properties
	pageTitle="Azure Infrastructure Naming Guidelines"
	description="Learn about the key design and implementation guidelines for naming in Azure infrastructure services."
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

# Azure Infrastructure Naming Guidelines

This guidance identifies many areas for which planning is vital to the success of an IT workload in Azure. In addition, planning provides an order to the creation of the necessary resources. Although there is some flexibility, we recommend that you apply the order in this article to your planning and decision-making.

## Naming conventions

You should have a good naming convention in place before creating anything in Azure. A naming convention ensures that all the resources have a predictable name, which helps lower the administrative burden associated with managing those resources.

You might choose to follow a specific set of naming conventions defined for your entire organization or for a specific Azure subscription or account. Although it is easy for individuals within organizations to establish implicit rules when working with Azure resources, when a team needs to work on a project on Azure, that model does not scale well.

You should agree on a set of naming conventions up front. There are some considerations regarding naming conventions that cut across the sets of rules that make up those conventions.

## Affixes

When creating certain resources, Azure uses some defaults to simplify management of the resources that are associated with these resources. For example, when creating the first virtual machine for a new cloud service, the Azure classic portal attempts to use the virtual machine’s name for the name of a new cloud service for the virtual machine.

Therefore, it is beneficial to identify types of resources that need an affix to identify that type. In addition, clearly specify whether the affix will be at:

- The beginning of the name (prefix)
- The end of the name (suffix)

For instance, here are two possible names for a resource group that hosts a calculation engine:

- Rg-CalculationEngine (prefix)
- CalculationEngine-Rg (suffix)

Affixes can refer to different aspects that describe the particular resources. The following table shows some examples typically used.

| Aspect                               | Examples                                                               | Notes                                                                                                      |
|:-------------------------------------|:-----------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------|
| Environment                          | dev, stg, prod                                                         | Depending on the purpose and name of each environment.                                                     |
| Location                             | usw (West US), use (East US 2)                                         | Depending on the region of the datacenter or the region of the organization.                               |
| Azure component, service, or product | Rg for resource group, Svc for cloud service, VNet for virtual network | Depending on the product for which the resource provides support.                                          |
| Role                                 | sql, ora, sp, iis                                                      | Depending on the role of the virtual machine.                                                              |
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
- Cloud services
- Virtual machines
- Endpoints
- Network security groups
- Roles

To ensure that the name provides enough information to determine to which resource it refers, you should use descriptive names.

## Computer names

When administrators create a virtual machine, Microsoft Azure requires them to provide a virtual machine name of up to 15 characters. Azure uses the virtual machine name as the Azure virtual machine resource name. Azure uses the same name as the computer name for the operating system installed in the virtual machine. However, these names might not always be the same.

In case a virtual machine is created from a .vhd image file that already contains an operating system, the virtual machine name in Azure can differ from the virtual machine’s operating system computer name. This situation can add a degree of difficulty to virtual machine management, which we therefore do not recommend. Assign the Azure virtual machine resource the same name as the computer name that you assign to the operating system of that virtual machine.

We recommend that the Azure virtual machine name be the same as the underlying operating system computer name. Because of this, follow the NetBIOS naming rules as described in [Microsoft NetBIOS computer naming conventions](https://support.microsoft.com/kb/188997/).

## Storage account names

Storage accounts have special rules governing their names. You can only use lowercase letters and numbers. See [Create a storage account](../storage/storage-create-storage-account.md#create-a-storage-account) for more information. Additionally, the storage account name, in combination with core.windows.net, should be a globally valid, unique DNS name. For instance, if the storage account is called mystorageaccount, the following resulting DNS names should be unique:

- mystorageaccount.blob.core.windows.net
- mystorageaccount.table.core.windows.net
- mystorageaccount.queue.core.windows.net


## Azure building block names

Azure building blocks are application-level services that Azure offers, typically to those applications taking advantage of PaaS features, although IaaS resources might leverage some, like SQL Database, Traffic Manager, and others.

These services rely on an array of artifacts that are created and registered in Azure. These also need to be considered in your naming conventions.

## Implementation guidelines recap for naming conventions

Decision:

- What are your naming conventions for Azure resources?

Task:

- Define the naming conventions in terms of affixes, hierarchy, string values, and other policies for Azure resources.

## Next steps

Now that you have read about Azure Availability Sets you can read up on the guidelines for other Azure services.

* [Azure Cloud Services Infrastructure Guidelines](virtual-machines-linux-infrastructure-cloud-services-guidelines.md)
* [Azure Subscription and Accounts Guidelines](virtual-machines-linux-infrastructure-subscription-accounts-guidelines.md)
* [Azure Infrastructure Naming Guidelines](virtual-machines-linux-infrastructure-naming-guidelines.md)
* [Azure Virtual Machines Guidelines](virtual-machines-linux-infrastructure-virtual-machine-guidelines.md)
* [Azure Networking Infrastructure Guidelines](virtual-machines-linux-infrastructure-networking-guidelines.md)
* [Azure Storage Solutions Infrastructure Guidelines](virtual-machines-linux-infrastructure-storage-solutions-guidelines.md)
* [Azure Example Infrastructure Walkthrough](virtual-machines-linux-infrastructure-example.md)

Once you have reviewed the guidelines documents you can move over to the [Azure Concepts section](virtual-machines-linux-azure-overview.md) to start building your new infrastructure on Azure.
