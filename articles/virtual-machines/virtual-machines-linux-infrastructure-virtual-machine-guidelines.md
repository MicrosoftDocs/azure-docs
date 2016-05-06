<properties
	pageTitle="Azure Virtual Machines Guidelines"
	description="Learn about the key design and implementation guidelines for deploying virtual machines into Azure infrastructure services."
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

# Azure Virtual Machines Guidelines

This guidance identifies many areas for which planning is vital to the success of an IT workload in Azure. In addition, planning provides an order to the creation of the necessary resources. Although there is some flexibility, we recommend that you apply the order in this article to your planning and decision-making.

## Virtual machines

In Azure PaaS, Azure manages virtual machines and their associated disks. You must create and name cloud services and roles, and then Azure creates instances associated to those roles. In the case of Azure IaaS, it is up to you to provide names for the cloud services, virtual machines, and associated disks.

To reduce administrative burden, the Azure classic portal uses the computer name as a suggestion for the default name for the associated cloud service (in the case the customer chooses to create a new cloud service as part of the virtual machine creation wizard).

In addition, Azure names disks and their supporting VHD blobs using a combination of the cloud service name, the computer name, and the creation date.

In general, the number of disks is much greater than the number of virtual machines. You should be careful when manipulating virtual machines to prevent orphaning disks. Also, disks can be deleted without deleting the supporting blob. If this is the case, the blob remains in the storage account until manually deleted.

## Implementation guidelines recap for virtual machines

Decision:

- How many virtual machines do you need to provide for the IT workload or infrastructure?

Tasks:

- Define each virtual machine name using your naming convention.
- Create your virtual machines with the Azure portal, the Azure classic portal, the **New-AzureVM** PowerShell cmdlet, the Azure CLI, or with Resource Manager templates.
