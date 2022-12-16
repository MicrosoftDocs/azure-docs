---
title: Overview of virtual machines in Azure 
description: Overview of virtual machines in Azure.
author: cynthn
ms.service: virtual-machines
ms.collection: linux
ms.topic: overview
ms.date: 10/03/2022
ms.author: cynthn
ms.custom: mvc, engagement-fy23
---

# Virtual machines in Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

Azure virtual machines are one of several types of [on-demand, scalable computing resources](/azure/architecture/guide/technology-choices/compute-decision-tree) that Azure offers. Typically, you choose a virtual machine when you need more control over the computing environment than the other choices offer. This article gives you information about what you should consider before you create a virtual machine, how you create it, and how you manage it.

An Azure virtual machine gives you the flexibility of virtualization without having to buy and maintain the physical hardware that runs it. However, you still need to maintain the virtual machine by performing tasks, such as configuring, patching, and installing the software that runs on it.

Azure virtual machines can be used in various ways. Some examples are:

* **Development and test** – Azure virtual machines offer a quick and easy way to create a computer with specific configurations required to code and test an application.
* **Applications in the cloud** – Because demand for your application can fluctuate, it might make economic sense to run it on a virtual machine in Azure. You pay for extra virtual machines when you need them and shut them down when you don’t.
* **Extended datacenter** – virtual machines in an Azure virtual network can easily be connected to your organization’s network.

The number of virtual machines that your application uses can scale up and out to whatever is required to meet your needs.

## What do I need to think about before creating a virtual machine?
There is always a multitude of [design considerations](/azure/architecture/reference-architectures/n-tier/linux-vm) when you build out an application infrastructure in Azure. These aspects of a virtual machine are important to think about before you start:

* The names of your application resources
* The location where the resources are stored
* The size of the virtual machine
* The maximum number of virtual machines that can be created
* The operating system that the virtual machine runs
* The configuration of the virtual machine after it starts
* The related resources that the virtual machine needs

### Locations
There are multiple [geographical regions](https://azure.microsoft.com/regions/) around the world where you can create Azure resources. Usually, the region is called **location** when you create a virtual machine. For a virtual machine, the location specifies where the virtual hard disks will be stored.

This table shows some of the ways you can get a list of available locations.

| Method | Description |
| --- | --- |
| Azure portal |Select a location from the list when you create a virtual machine. |
| Azure PowerShell |Use the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) command. |
| REST API |Use the [List locations](/rest/api/resources/subscriptions) operation. |
| Azure CLI |Use the [az account list-locations](/cli/azure/account) operation. |

## Availability
There are multiple options to manage the availability of your virtual machines in Azure. 
- **[Availability Zones](../availability-zones/az-overview.md)** are physically separated zones within an Azure region. Availability zones guarantee you will have virtual machine Connectivity to at least one instance at least 99.99% of the time when you have two or more instances deployed across two or more Availability Zones in the same Azure region. 
- **[Virtual machine scale sets](../virtual-machine-scale-sets/overview.md)** let you create and manage a group of load balanced virtual machines. The number of virtual machine instances can automatically increase or decrease in response to demand or a defined schedule. Scale sets provide high availability to your applications, and allow you to centrally manage, configure, and update many virtual machines. Virtual machines in a scale set can also be deployed into multiple availability zones, a single availability zone, or regionally.

Fore more information see [Availability options for Azure virtual machines](availability.md) and [SLA for Azure virtual machines](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_9/). 

## Sizes and pricing
The [size](sizes.md) of the virtual machine that you use is determined by the workload that you want to run. The size that you choose then determines factors such as processing power, memory, storage capacity, and network bandwidth. Azure offers a wide variety of sizes to support many types of uses.

Azure charges an [hourly price](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) based on the virtual machine’s size and operating system. For partial hours, Azure charges only for the minutes used. Storage is priced and charged separately.

## Virtual machine limits
Your subscription has default [quota limits](../azure-resource-manager/management/azure-subscription-service-limits.md) in place that could impact the deployment of many virtual machines for your project. The current limit on a per subscription basis is 20 virtual machines per region. Limits can be raised by [filing a support ticket requesting an increase](../azure-portal/supportability/regional-quota-requests.md)

## Managed Disks

Managed Disks handles Azure Storage account creation and management in the background for you, and ensures that you do not have to worry about the scalability limits of the storage account. You specify the disk size and the performance tier (Standard or Premium), and Azure creates and manages the disk. As you add disks or scale the virtual machine up and down, you don't have to worry about the storage being used. If you're creating new virtual machines, [use the Azure CLI](linux/quick-create-cli.md) or the Azure portal to create virtual machines with Managed OS and data disks. If you have virtual machines with unmanaged disks, you can [convert your virtual machines to be backed with Managed Disks](linux/convert-unmanaged-to-managed-disks.md).

You can also manage your custom images in one storage account per Azure region, and use them to create hundreds of virtual machines in the same subscription. For more information about Managed Disks, see the [Managed Disks Overview](managed-disks-overview.md).

## Distributions 
Microsoft Azure supports a variety of Linux and Windows distributions. You can find available distributions in the [marketplace](https://azuremarketplace.microsoft.com), Azure portal or by querying results using CLI, PowerShell and REST APIs. 

This table shows some ways that you can find the information for an image.

| Method | Description |
| --- | --- |
| Azure portal |The values are automatically specified for you when you select an image to use. |
| Azure PowerShell |[Get-AzVMImagePublisher](/powershell/module/az.compute/get-azvmimagepublisher) -Location *location*<BR>[Get-AzVMImageOffer](/powershell/module/az.compute/get-azvmimageoffer) -Location *location* -Publisher *publisherName*<BR>[Get-AzVMImageSku](/powershell/module/az.compute/get-azvmimagesku) -Location *location* -Publisher *publisherName* -Offer *offerName* |
| REST APIs |[List image publishers](/rest/api/compute/platformimages/platformimages-list-publishers)<BR>[List image offers](/rest/api/compute/platformimages/platformimages-list-publisher-offers)<BR>[List image skus](/rest/api/compute/platformimages/platformimages-list-publisher-offer-skus) |
| Azure CLI |[az vm image list-publishers](/cli/azure/vm/image) --location *location*<BR>[az vm image list-offers](/cli/azure/vm/image) --location *location* --publisher *publisherName*<BR>[az vm image list-skus](/cli/azure/vm) --location *location* --publisher *publisherName* --offer *offerName*|

Microsoft works closely with partners to ensure the images available are updated and optimized for an Azure runtime.  For more information on Azure partner offers, see the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?filters=partners%3Bvirtual-machine-images&page=1)


## Cloud-init 

Azure supports for [cloud-init](https://cloud-init.io/) across most Linux distributions that support it.  We are actively working with our Linux partners in order to have cloud-init enabled images available in the Azure Marketplace. These images will make your cloud-init deployments and configurations work seamlessly with virtual machines and virtual machine scale sets.

For more information, see [Using cloud-init on Azure Linux virtual machines](linux/using-cloud-init.md).

## Storage
* [Introduction to Microsoft Azure Storage](../storage/common/storage-introduction.md)
* [Add a disk to a Linux virtual machine using the azure-cli](linux/add-disk.md)
* [How to attach a data disk to a Linux virtual machine in the Azure portal](linux/attach-disk-portal.md)

## Networking
* [Virtual Network Overview](../virtual-network/virtual-networks-overview.md)
* [IP addresses in Azure](../virtual-network/ip-services/public-ip-addresses.md)
* [Opening ports to a Linux virtual machine in Azure](linux/nsg-quickstart.md)
* [Create a Fully Qualified Domain Name in the Azure portal](create-fqdn.md)


## Data residency

In Azure, the feature to enable storing customer data in a single region is currently only available in the Southeast Asia Region (Singapore) of the Asia Pacific Geo and Brazil South (Sao Paulo State) Region of Brazil Geo. For all other regions, customer data is stored in Geo. For more information, see [Trust Center](https://azure.microsoft.com/global-infrastructure/data-residency/).


## Next steps

Create your first virtual machine!

- [Portal](linux/quick-create-portal.md)
- [Azure CLI](linux/quick-create-cli.md)
- [PowerShell](linux/quick-create-powershell.md)
