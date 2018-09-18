---
title: Introduction to Azure Stack virtual machines
description: Learn about Azure Stack virtual machines
services: azure-stack
author: sethmanheim
manager: femila

ms.service: azure-stack
ms.topic: get-started-article
ms.date: 09/05/2018
ms.author: sethm
ms.reviewer: kivenkat

---
# Introduction to Azure Stack virtual machines

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Azure Stack offers you virtual machines (VMs) as one type of an on-demand, scalable computing resource. You can choose a VM when you need more control over the computing environment than the other choices. This article provides details before you create your VM.

An Azure Stack VM gives you the flexibility of virtualization without the need to manage clusters or individual machines. However, you still need to maintain the VM by performing tasks such as configuring, patching, and installing the software that runs on it.

You can use Azure Stack virtual machines in various ways. For example:

- **Development and test**  
    Azure Stack VMs offer a quick and easy way to create a computer with a specific configuration required to code and test an application.

- **Applications in the cloud**  
    Because demand for your application can fluctuate, it might make economic sense to run it on a VM in Azure Stack. You pay for extra VMs when you need them and shut them down when you don’t.

- **Extended datacenter**  
    Virtual machines in an Azure Stack virtual network can easily be connected to your organization’s network or to Azure.

The VMs that your application uses can scale up or scale out to whatever is required to meet your needs.

## What do I need to think about before creating a VM?

There are always numerous design considerations when you build out an application infrastructure in Azure Stack. These aspects of a VM are important to think about before you start creating your infrastructure:

- The names of your application resources.
- The size of the VM.
- The maximum number of VMs that can be created.
- The operating system that the VM runs.
- The configuration of the VM after it starts.
- The related resources that the VM needs.

### Naming

A virtual machine has a name assigned to it and it has a computer name configured as part of the operating system. The name of a VM can be up to 15 characters.

If you use Azure Stack to create the operating system disk, the computer name and the virtual machine name are the same. If you upload and use your own image that contains a previously configured operating system and use it to create a virtual machine, the names may be different. When you upload your own image file, make the computer name in the operating system and the virtual machine name the same as a best practice.

### VM size

The size of the VM that you use is determined by the workload that you want to run. The size that you choose then determines factors such as processing power, memory, and storage capacity. Azure Stack offers a wide variety of sizes to support many types of uses.

### VM limits

Your subscription has default quota limits in place that can impact the deployment of many VMs for your project. The current limit on a per subscription basis is 20 VMs per region.

### Operating system disks and images

Virtual machines use virtual hard disks (VHDs) to store their operating system (OS) and data. VHDs are also used for the images you can choose from to install an OS.
Azure Stack provides a marketplace to use with various versions and types of operating systems. Marketplace images are identified by image publisher, offer, sku, and version (typically version is specified as latest.)

The following table shows some ways that you can find the information for an image:

|Method|Description|
|---------|---------|
|Azure Stack portal|The values are automatically specified for you when you select an image to use.|
|Azure Stack PowerShell|`Get-AzureRMVMImagePublisher -Location "location"`<br>`Get-AzureRMVMImageOffer -Location "location" -Publisher "publisherName"`<br>`Get-AzureRMVMImageSku -Location "location" -Publisher "publisherName" -Offer "offerName"`|
|REST APIs     |[List image publishers](https://docs.microsoft.com/rest/api/compute/platformimages/platformimages-list-publishers)<br>[List image offers](https://docs.microsoft.com/rest/api/compute/platformimages/platformimages-list-publisher-offers)<br>[List image SKUs](https://docs.microsoft.com/rest/api/compute/platformimages/platformimages-list-publisher-offer-skus)|

You can choose to upload and use your own image. If you do, the publisher name, offer, and sku aren’t used.

### Extensions

VM extensions give your VM additional capabilities through post deployment configuration and automated tasks.
These common tasks can be accomplished using extensions:

- **Run custom scripts**  
    The Custom Script Extension helps you configure workloads on the VM by running your script when the VM is provisioned.

- **Deploy and manage configurations**  
    The PowerShell Desired State Configuration (DSC) Extension helps you set up DSC on a VM to manage configurations and environments.

- **Collect diagnostics data**  
    The Azure Diagnostics Extension helps you configure the VM to collect diagnostics data that can be used to monitor the health of your application.

### Related resources

The resources in the following table are used by the VM and need to exist or be created when the VM is created.


|Resource|Required|Description|
|---------|---------|---------|
|Resource group|Yes|The VM must be contained in a resource group.|
|Storage account|No|The VM does not need the storage account to store its virtual hard disks if using Managed Disks. <br>The VM does need the storage account to store its virtual hard disks if using unmanaged disks.|
|Virtual network|Yes|The VM must be a member of a virtual network.|
|Public IP address|No|The VM can have a public IP address assigned to it to remotely access it.|
|Network interface|Yes|The VM needs the network interface to communicate in the network.|
|Data disks|No|The VM can include data disks to expand storage capabilities.|

## Create your first VM

You have several choices to create a VM. Your choice depends on your environment.
The following table provides information to get you started creating your VM.


|Method|Article|
|---------|---------|
|Azure Stack portal|Create a Windows virtual machine with the Azure Stack portal<br>[Create a Linux virtual machine using the Azure Stack portal](azure-stack-quick-linux-portal.md)|
|Templates|Azure Stack Quickstart templates are located at:<br> [https://github.com/Azure/AzureStack-QuickStart-Templates](https://github.com/Azure/AzureStack-QuickStart-Templates)|
|PowerShell|[Create a Windows virtual machine by using PowerShell in Azure Stack](azure-stack-quick-create-vm-windows-powershell.md)<br>[Create a Linux virtual machine by using PowerShell in Azure Stack](azure-stack-quick-create-vm-linux-powershell.md)|
|CLI|[Create a Windows virtual machine by using CLI in Azure Stack](azure-stack-quick-create-vm-windows-cli.md)<br>[Create a Linux virtual machine by using CLI in Azure Stack](azure-stack-quick-create-vm-linux-cli.md)|

## Manage your VM

You can manage VMs using a browser-based portal, command-line tools with support for scripting, or directly through APIs. Some typical management tasks that you might perform are:

- Getting information about a VM
- Connecting to a VM
- Managing availability
- Making backups

### Get information about your VM

The following table shows you some of the ways you can get information about a VM.


|Method|Description|
|---------|---------|
|Azure Stack portal|On the hub menu, click Virtual Machines and then select the VM from the list. On the page for the VM, you have access to overview information, setting values, and monitoring metrics.|
|Azure PowerShell|Managing VMs is similar in Azure and Azure Stack. For more information about using PowerShell, see the following Azure topic:<br>[Create and Manage Windows VMs with the Azure PowerShell module](https://docs.microsoft.com/azure/virtual-machines/windows/tutorial-manage-vm#understand-vm-sizes)|
|Client SDKs|Using C# to manage VMs is similar in Azure and Azure Stack. For more information, see the following Azure topic:<br>[Create and manage Windows VMs in Azure using C#](https://docs.microsoft.com/azure/virtual-machines/windows/csharp)|

### Connect to your VM

You can use the **Connect** button in the Azure Stack portal to connect to your VM.

## Next steps

- [Considerations for Virtual Machines in Azure Stack](azure-stack-vm-considerations.md)
