---
title: Overview of Windows VMs in Azure 
description: Overview of Windows virtual machines in Azure.
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: overview
ms.date: 11/14/2019
ms.author: cynthn
ms.custom: mvc
---

# Windows virtual machines in Azure

Azure Virtual Machines (VM) is one of several types of [on-demand, scalable computing resources](/azure/architecture/guide/technology-choices/compute-decision-tree) that Azure offers. Typically, you choose a VM when you need more control over the computing environment than the other choices offer. This article gives you information about what you should consider before you create a VM, how you create it, and how you manage it.

An Azure VM gives you the flexibility of virtualization without having to buy and maintain the physical hardware that runs it. However, you still need to maintain the VM by performing tasks, such as configuring, patching, and installing the software that runs on it.

Azure virtual machines can be used in various ways. Some examples are:

* **Development and test** – Azure VMs offer a quick and easy way to create a computer with specific configurations required to code and test an application.
* **Applications in the cloud** – Because demand for your application can fluctuate, it might make economic sense to run it on a VM in Azure. You pay for extra VMs when you need them and shut them down when you don’t.
* **Extended datacenter** – Virtual machines in an Azure virtual network can easily be connected to your organization’s network.

The number of VMs that your application uses can scale up and out to whatever is required to meet your needs.

## What do I need to think about before creating a VM?
There are always a multitude of [design considerations](https://docs.microsoft.com/azure/architecture/reference-architectures/n-tier/windows-vm) when you build out an application infrastructure in Azure. These aspects of a VM are important to think about before you start:

* The names of your application resources
* The location where the resources are stored
* The size of the VM
* The maximum number of VMs that can be created
* The operating system that the VM runs
* The configuration of the VM after it starts
* The related resources that the VM needs

### Locations
All resources created in Azure are distributed across multiple [geographical regions](https://azure.microsoft.com/regions/) around the world. Usually, the region is called **location** when you create a VM. For a VM, the location specifies where the virtual hard disks are stored.

This table shows some of the ways you can get a list of available locations.

| Method | Description |
| --- | --- |
| Azure portal |Select a location from the list when you create a VM. |
| Azure PowerShell |Use the [Get-AzLocation](https://docs.microsoft.com/powershell/module/az.resources/get-azlocation) command. |
| REST API |Use the [List locations](https://docs.microsoft.com/rest/api/resources/subscriptions) operation. |
| Azure CLI |Use the [az account list-locations](https://docs.microsoft.com/cli/azure/account?view=azure-cli-latest) operation. |

## Availability
Azure announced an industry leading single instance virtual machine Service Level Agreement of 99.9% provided you deploy the VM with premium storage for all disks.  In order for your deployment to qualify for the standard 99.95% VM Service Level Agreement, you still need to deploy two or more VMs running your workload inside of an availability set. An availability set ensures that your VMs are distributed across multiple fault domains in the Azure data centers as well as deployed onto hosts with different maintenance windows. The full [Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/) explains the guaranteed availability of Azure as a whole.


## VM size
The [size](sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) of the VM that you use is determined by the workload that you want to run. The size that you choose then determines factors such as processing power, memory, and storage capacity. Azure offers a wide variety of sizes to support many types of uses.

Azure charges an [hourly price](https://azure.microsoft.com/pricing/details/virtual-machines/windows/) based on the VM’s size and operating system. For partial hours, Azure charges only for the minutes used. Storage is priced and charged separately.

## VM Limits
Your subscription has default [quota limits](../../azure-resource-manager/management/azure-subscription-service-limits.md) in place that could impact the deployment of many VMs for your project. The current limit on a per subscription basis is 20 VMs per region. Limits can be raised by [filing a support ticket requesting an increase](../../azure-portal/supportability/resource-manager-core-quotas-request.md)

### Operating system disks and images
Virtual machines use [virtual hard disks (VHDs)](managed-disks-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) to store their operating system (OS) and data. VHDs are also used for the images you can choose from to install an OS. 

Azure provides many [marketplace images](https://azuremarketplace.microsoft.com/marketplace/apps?filters=virtual-machine-images%3Bwindows&page=1) to use with various versions and types of Windows Server operating systems. Marketplace images are identified by image publisher, offer, sku, and version (typically version is specified as latest). Only 64-bit operating systems are supported. For more information on the supported guest operating systems, roles, and features, see [Microsoft server software support for Microsoft Azure virtual machines](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines).

This table shows some ways that you can find the information for an image.

| Method | Description |
| --- | --- |
| Azure portal |The values are automatically specified for you when you select an image to use. |
| Azure PowerShell |[Get-AzVMImagePublisher](https://docs.microsoft.com/powershell/module/az.compute/get-azvmimagepublisher) -Location *location*<BR>[Get-AzVMImageOffer](https://docs.microsoft.com/powershell/module/az.compute/get-azvmimageoffer) -Location *location* -Publisher *publisherName*<BR>[Get-AzVMImageSku](https://docs.microsoft.com/powershell/module/az.compute/get-azvmimagesku) -Location *location* -Publisher *publisherName* -Offer *offerName* |
| REST APIs |[List image publishers](https://docs.microsoft.com/rest/api/compute/platformimages/platformimages-list-publishers)<BR>[List image offers](https://docs.microsoft.com/rest/api/compute/platformimages/platformimages-list-publisher-offers)<BR>[List image skus](https://docs.microsoft.com/rest/api/compute/platformimages/platformimages-list-publisher-offer-skus) |
| Azure CLI |[az vm image list-publishers](https://docs.microsoft.com/cli/azure/vm/image?view=azure-cli-latest) --location *location*<BR>[az vm image list-offers](https://docs.microsoft.com/cli/azure/vm/image?view=azure-cli-latest) --location *location* --publisher *publisherName*<BR>[az vm image list-skus](https://docs.microsoft.com/cli/azure/vm?view=azure-cli-latest) --location *location* --publisher *publisherName* --offer *offerName*|

You can choose to [upload and use your own image](upload-generalized-managed.md) and when you do, the publisher name, offer, and sku aren’t used.

### Extensions
VM [extensions](extensions-features.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) give your VM additional capabilities through post deployment configuration and automated tasks.

These common tasks can be accomplished using extensions:

* **Run custom scripts** – The [Custom Script Extension](extensions-customscript.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) helps you configure workloads on the VM by running your script when the VM is provisioned.
* **Deploy and manage configurations** – The [PowerShell Desired State Configuration (DSC) Extension](extensions-dsc-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) helps you set up DSC on a VM to manage configurations and environments.
* **Collect diagnostics data** – The [Azure Diagnostics Extension](extensions-diagnostics-template.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) helps you configure the VM to collect diagnostics data that can be used to monitor the health of your application.

### Related resources
The resources in this table are used by the VM and need to exist or be created when the VM is created.

| Resource | Required | Description |
| --- | --- | --- |
| [Resource group](../../azure-resource-manager/management/overview.md) |Yes |The VM must be contained in a resource group. |
| [Storage account](../../storage/common/storage-create-storage-account.md) |Yes |The VM needs the storage account to store its virtual hard disks. |
| [Virtual network](../../virtual-network/virtual-networks-overview.md) |Yes |The VM must be a member of a virtual network. |
| [Public IP address](../../virtual-network/public-ip-addresses.md) |No |The VM can have a public IP address assigned to it to remotely access it. |
| [Network interface](../../virtual-network/virtual-network-network-interface.md) |Yes |The VM needs the network interface to communicate in the network. |
| [Data disks](attach-managed-disk-portal.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) |No |The VM can include data disks to expand storage capabilities. |

## Next steps

Create your first VM!

- [Portal](quick-create-portal.md)
- [PowerShell](quick-create-powershell.md)
- [Azure CLI](quick-create-cli.md)

