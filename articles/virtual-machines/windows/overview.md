---
title: Windows Virtual Machines Overview - Azure | Microsoft Docs
description: Learn about creating and managing Windows virtual machines in Azure.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: fbae9c8e-2341-4ed0-bb20-fd4debb2f9ca
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/04/2018
ms.author: cynthn
ms.custom: mvc
---

# Overview of Windows virtual machines in Azure

Azure Virtual Machines (VM) is one of several types of [on-demand, scalable computing resources](../../app-service/choose-web-site-cloud-service-vm.md) that Azure offers. Typically, you choose a VM when you need more control over the computing environment than the other choices offer. This article gives you information about what you should consider before you create a VM, how you create it, and how you manage it.

An Azure VM gives you the flexibility of virtualization without having to buy and maintain the physical hardware that runs it. However, you still need to maintain the VM by performing tasks, such as configuring, patching, and installing the software that runs on it.

Azure virtual machines can be used in various ways. Some examples are:

* **Development and test** – Azure VMs offer a quick and easy way to create a computer with specific configurations required to code and test an application.
* **Applications in the cloud** – Because demand for your application can fluctuate, it might make economic sense to run it on a VM in Azure. You pay for extra VMs when you need them and shut them down when you don’t.
* **Extended datacenter** – Virtual machines in an Azure virtual network can easily be connected to your organization’s network.

The number of VMs that your application uses can scale up and out to whatever is required to meet your needs.

## What do I need to think about before creating a VM?
There are always a multitude of [design considerations](/azure/architecture/reference-architectures/virtual-machines-windows?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) when you build out an application infrastructure in Azure. These aspects of a VM are important to think about before you start:

* The names of your application resources
* The location where the resources are stored
* The size of the VM
* The maximum number of VMs that can be created
* The operating system that the VM runs
* The configuration of the VM after it starts
* The related resources that the VM needs

### Naming
A virtual machine has a [name](/azure/architecture/best-practices/naming-conventions#naming-rules-and-restrictions?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) assigned to it and it has a computer name configured as part of the operating system. The name of a VM can be up to 15 characters.

If you use Azure to create the operating system disk, the computer name and the virtual machine name are the same. If you [upload and use your own image](upload-generalized-managed.md) that contains a previously configured operating system and use it to create a virtual machine, the names can be different. We recommend that when you upload your own image file, you make the computer name in the operating system and the virtual machine name the same.

### Locations
All resources created in Azure are distributed across multiple [geographical regions](https://azure.microsoft.com/regions/) around the world. Usually, the region is called **location** when you create a VM. For a VM, the location specifies where the virtual hard disks are stored.

This table shows some of the ways you can get a list of available locations.

| Method | Description |
| --- | --- |
| Azure portal |Select a location from the list when you create a VM. |
| Azure PowerShell |Use the [Get-AzureRmLocation](/powershell/module/azurerm.resources/get-azurermlocation) command. |
| REST API |Use the [List locations](https://docs.microsoft.com/rest/api/resources/subscriptions#Subscriptions_ListLocations) operation. |
| Azure CLI |Use the [az account list-locations](https://docs.microsoft.com/cli/azure/account?view=azure-cli-latest#az_account_list_locations) operation. |

### VM size
The [size](sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) of the VM that you use is determined by the workload that you want to run. The size that you choose then determines factors such as processing power, memory, and storage capacity. Azure offers a wide variety of sizes to support many types of uses.

Azure charges an [hourly price](https://azure.microsoft.com/pricing/details/virtual-machines/windows/) based on the VM’s size and operating system. For partial hours, Azure charges only for the minutes used. Storage is priced and charged separately.

### VM Limits
Your subscription has default [quota limits](../../azure-subscription-service-limits.md) in place that could impact the deployment of many VMs for your project. The current limit on a per subscription basis is 20 VMs per region. Limits can be raised by [filing a support ticket requesting an increase](../../azure-supportability/resource-manager-core-quotas-request.md)

### Operating system disks and images
Virtual machines use [virtual hard disks (VHDs)](about-disks-and-vhds.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) to store their operating system (OS) and data. VHDs are also used for the images you can choose from to install an OS. 

Azure provides many [marketplace images](https://azure.microsoft.com/marketplace/virtual-machines/) to use with various versions and types of Windows Server operating systems. Marketplace images are identified by image publisher, offer, sku, and version (typically version is specified as latest). Only 64-bit operating systems are supported. For more information on the supported guest operating systems, roles, and features, see [Microsoft server software support for Microsoft Azure virtual machines](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines).

This table shows some ways that you can find the information for an image.

| Method | Description |
| --- | --- |
| Azure portal |The values are automatically specified for you when you select an image to use. |
| Azure PowerShell |[Get-AzureRMVMImagePublisher](https://docs.microsoft.com/powershell/module/azurerm.compute/get-azurermvmimagepublisher) -Location *location*<BR>[Get-AzureRMVMImageOffer](https://docs.microsoft.com/powershell/module/azurerm.compute/get-azurermvmimageoffer) -Location *location* -Publisher *publisherName*<BR>[Get-AzureRMVMImageSku](/powershell/module/azurerm.compute/get-azurermvmimagesku) -Location *location* -Publisher *publisherName* -Offer *offerName* |
| REST APIs |[List image publishers](https://docs.microsoft.com/rest/api/compute/platformimages/platformimages-list-publishers)<BR>[List image offers](https://docs.microsoft.com/rest/api/compute/platformimages/platformimages-list-publisher-offers)<BR>[List image skus](https://docs.microsoft.com/rest/api/compute/platformimages/platformimages-list-publisher-offer-skus) |
| Azure CLI |[az vm image list-publishers](https://docs.microsoft.com/cli/azure/vm/image?view=azure-cli-latest#az_vm_image_list_publishers) --location *location*<BR>[az vm image list-offers](https://docs.microsoft.com/cli/azure/vm/image?view=azure-cli-latest#az_vm_image_list_offers) --location *location* --publisher *publisherName*<BR>[az vm image list-skus](https://docs.microsoft.com/cli/azure/vm?view=azure-cli-latest#az_vm_list_skus) --location *location* --publisher *publisherName* --offer *offerName*|

You can choose to [upload and use your own image](upload-generalized-managed.md#upload-the-vhd-to-your-storage-account) and when you do, the publisher name, offer, and sku aren’t used.

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
| [Resource group](../../azure-resource-manager/resource-group-overview.md) |Yes |The VM must be contained in a resource group. |
| [Storage account](../../storage/common/storage-create-storage-account.md) |Yes |The VM needs the storage account to store its virtual hard disks. |
| [Virtual network](../../virtual-network/virtual-networks-overview.md) |Yes |The VM must be a member of a virtual network. |
| [Public IP address](../../virtual-network/virtual-network-ip-addresses-overview-arm.md) |No |The VM can have a public IP address assigned to it to remotely access it. |
| [Network interface](../../virtual-network/virtual-network-network-interface.md) |Yes |The VM needs the network interface to communicate in the network. |
| [Data disks](attach-managed-disk-portal.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) |No |The VM can include data disks to expand storage capabilities. |

## How do I create my first VM?
You have several choices for creating your VM. The choice that you make depends on the environment you are in. 

This table provides information to get you started creating your VM.

| Method | Article |
| --- | --- |
| Azure portal |[Create a virtual machine running Windows using the portal](../virtual-machines-windows-hero-tutorial.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) |
| Templates |[Create a Windows virtual machine with a Resource Manager template](ps-template.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) |
| Azure PowerShell |[Create a Windows VM using PowerShell](../virtual-machines-windows-ps-create.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) |
| Client SDKs |[Deploy Azure Resources using C#](csharp.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) |
| REST APIs |[Create or update a VM](https://docs.microsoft.com/rest/api/compute/virtualmachines/virtualmachines-create-or-update) |
| Azure CLI |[Create a VM with the Azure CLI](https://docs.microsoft.com/azure/virtual-machines/scripts/virtual-machines-windows-cli-sample-create-vm) |

You hope it never happens, but occasionally something goes wrong. If this situation happens to you, look at the information in [Troubleshoot Resource Manager deployment issues with creating a Windows virtual machine in Azure](../troubleshooting/troubleshoot-deployment-new-vm-windows.md).

## How do I manage the VM that I created?
VMs can be managed using a browser-based portal, command-line tools with support for scripting, or directly through APIs. Some typical management tasks that you might perform are getting information about a VM, logging on to a VM, managing availability, and making backups.

### Get information about a VM
This table shows you some of the ways that you can get information about a VM.

| Method | Description |
| --- | --- |
| Azure portal |On the hub menu, click **Virtual Machines** and then select the VM from the list. On the blade for the VM, you have access to overview information, setting values, and monitoring metrics. |
| Azure PowerShell |For information about using PowerShell to manage VMs, see [Create and manage Windows VMs with the Azure PowerShell module](tutorial-manage-vm.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). |
| REST API |Use the [Get VM information](https://docs.microsoft.com/rest/api/compute/virtualmachines/virtualmachines-get) operation to get information about a VM. |
| Client SDKs |For information about using C# to manage VMs, see [Manage Azure Virtual Machines using Azure Resource Manager and C#](csharp-manage.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). |
| Azure CLI |For information about using Azure CLI to manage VMs, see [Azure CLI Reference](https://docs.microsoft.com/cli/azure/vm). |

### Log on to the VM
You use the Connect button in the Azure portal to [start a Remote Desktop (RDP) session](connect-logon.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). Things can sometimes go wrong when trying to use a remote connection. If this situation happens to you, check out the help information in [Troubleshoot Remote Desktop connections to an Azure virtual machine running Windows](../troubleshooting/troubleshoot-rdp-connection.md).

### Manage availability
It’s important for you to understand how to [ensure high availability](manage-availability.md) for your application. This configuration involves creating multiple VMs to ensure that at least one is running.

In order for your deployment to qualify for our 99.95 VM Service Level Agreement, you need to deploy two or more VMs running your workload inside an [availability set](tutorial-availability-sets.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). This configuration ensures your VMs are distributed across multiple fault domains and are deployed onto hosts with different maintenance windows. The full [Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/) explains the guaranteed availability of Azure as a whole.

### Back up the VM
A [Recovery Services vault](../../backup/backup-introduction-to-azure-backup.md) is used to protect data and assets in both Azure Backup and Azure Site Recovery services. You can use a Recovery Services vault to [deploy and manage backups for Resource Manager-deployed VMs using PowerShell](../../backup/backup-azure-vms-automation.md). 

## Next steps
* If your intent is to work with Linux VMs, look at [Azure and Linux](../linux/overview.md).
* Learn more about the guidelines around setting up your infrastructure in the [Example Azure infrastructure walkthrough](infrastructure-example.md).
