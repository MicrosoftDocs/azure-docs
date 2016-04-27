<properties
	pageTitle="What are VM scale sets? | Microsoft Azure"
	description="Learn about VM scale sets."
	keywords="linux virtual machine,virtual machine scale sets" 
	services="virtual-machines-linux"
	documentationCenter=""
	authors="gatneil"
	manager="madhana"
	editor="tysonn"
	tags="azure-resource-manager" />

<tags
	ms.service="virtual-machine-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/24/2016"
	ms.author="gatneil"/>

# What are virtual machine scale sets?

Virtual Machine Scale Sets allow you to manage multiple VMs as a set. At a high level, scale sets have the following pros and cons:

Pros:

1. High availability. Each scale set puts its VMs into an Availability Set with 5 Fault Domains (FDs) and 5 Update Domains (UDs) to ensure availability (for more information on FDs and UDs, see [VM availability](./virtual-machines-linux-manage-availability.md)). 
2. Easy integration with Azure Load Balancer and App Gateway.
3. Easy integration with Azure Autoscale.
4. Simplified deployment, management, and clean up of VMs.
5. Support common Windows and Linux flavors, as well as custom images.

Cons:

1. Cannot attach data disks to VM instances in a scale set. Instead, must use Blob Storage, Azure Files, Azure Tables, or other storage solution.

## Quick-create using Azure CLI

[AZURE.INCLUDE [cli-vmss-quick-create](../../includes/virtual-machines-linux-cli-vmss-quick-create-include.md)]

## Next steps

For general information, check out the [main landing page for scale sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/).

For more documentation, check out the [main documentation page for scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md).

For example Resource Manager templates using scale sets, search for "vmss" in the [Azure Quickstart Templates github repo](https://github.com/Azure/azure-quickstart-templates).

