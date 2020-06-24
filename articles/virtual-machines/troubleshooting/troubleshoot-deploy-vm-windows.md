---
title: Troubleshoot deploying Windows virtual machine issues in Azure | Microsoft Docs
description: Troubleshoot deploying Windows virtual machine issues in the Azure Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: genlin
manager: dcscontentpm
editor: ''
tags: azure-resource-manager

ms.assetid: 4e383427-4aff-4bf3-a0f4-dbff5c6f0c81
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: na

ms.topic: troubleshooting
ms.date: 11/01/2018
ms.author: genli

---
# Troubleshoot deploying Windows virtual machine issues in Azure

To troubleshoot virtual machine (VM) deployment issues in Azure, review the [top issues](#top-issues) for common failures and resolutions.

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.

## Top issues
[!INCLUDE [virtual-machines-windows-troubleshoot-deploy-vm-top](../../../includes/virtual-machines-windows-troubleshoot-deploy-vm-top.md)]

## The cluster cannot support the requested VM size
\<properties
supportTopicIds="123456789"
resourceTags="windows"
productPesIds="1234, 5678"
/>
- Retry the request using a smaller VM size.
- If the size of the requested VM cannot be changed:
    - Stop all the VMs in the availability set. Click **Resource groups** > your resource group > **Resources** > your availability set > **Virtual Machines** > your virtual machine > **Stop**.
    - After all the VMs stop, create the VM in the desired size.
    - Start the new VM first, and then select each of the stopped VMs and click Start.


## The cluster does not have free resources
\<properties
supportTopicIds="123456789"
resourceTags="windows"
productPesIds="1234, 5678"
/>
- Retry the request later.
- If the new VM can be part of a different availability set
    - Create a VM in a different availability set (in the same region).
    - Add the new VM to the same virtual network.

## How can I use and deploy a windows client image into Azure?

You can use Windows 7, Windows 8, or Windows 10 in Azure for dev/test scenarios if you have an appropriate Visual Studio (formerly MSDN) subscription. This [article](../windows/client-images.md) outlines the eligibility requirements for running Windows client in Azure and uses of the Azure Gallery images.

## How can I deploy a virtual machine using the Hybrid Use Benefit (HUB)?

There are a couple of different ways to deploy Windows virtual machines with the Azure Hybrid Use Benefit.

For an Enterprise Agreement subscription:

•	Deploy VMs from specific Marketplace images that are pre-configured with Azure Hybrid Use Benefit.

For Enterprise agreement:

•	Upload a custom VM and deploy using a Resource Manager template or Azure PowerShell.

For more information, see the following resources:

 - [Azure Hybrid Use Benefit overview](https://azure.microsoft.com/pricing/hybrid-use-benefit/)

 - [Downloadable FAQ](https://download.microsoft.com/download/4/2/1/4211AC94-D607-4A45-B472-4B30EDF437DE/Windows_Server_Azure_Hybrid_Use_FAQ_EN_US.pdf)

 - [Azure Hybrid Use Benefit for Windows Server and Windows Client](../windows/hybrid-use-benefit-licensing.md).

 - [How can I use the Hybrid Use Benefit in Azure](https://blogs.msdn.microsoft.com/azureedu/2016/04/13/how-can-i-use-the-hybrid-use-benefit-in-azure)

## How do I activate my monthly credit for Visual studio Enterprise (BizSpark)

To activate your monthly  credit, see this [article](https://azure.microsoft.com/offers/ms-azr-0064p/).

## How to add Enterprise Dev/Test to my Enterprise Agreement (EA) to get access to Window client images?

The ability to create subscriptions based on the Enterprise Dev/Test offer is restricted to Account Owners who have been given permission to do so by an Enterprise Administrator. The Account Owner creates subscriptions via the Azure Account Portal, and then should add active Visual Studio subscribers as co-administrators. So that they can manage and use the resources needed for development and testing. For more information, see [Enterprise Dev/Test](https://azure.microsoft.com/offers/ms-azr-0148p/).

## My drivers are missing for my Windows N-Series VM

Instructions to install drivers for Windows-based VMs are located [here](../sizes-gpu.md#supported-operating-systems-and-drivers).

## I can’t find a GPU instance within my N-Series VM

To take advantage of the GPU capabilities of Azure N-series VMs, you must install graphics drivers on each VM after deployment. Driver setup information is available [here](../sizes-gpu.md#supported-operating-systems-and-drivers).

## Are N-Series VMs available in my region?

You can check the availability from the [Products available by region table](https://azure.microsoft.com/regions/services), and pricing [here](https://azure.microsoft.com/pricing/details/virtual-machines/series/#n-series).

## What client images can I use and deploy in Azure, and how to I get them?

You can use Windows 7, Windows 8, or Windows 10 in Azure for dev/test scenarios provided you have an appropriate Visual Studio (formerly MSDN) subscription. 

- Windows 10 images are available from the Azure Gallery within [eligible dev/test offers](../windows/client-images.md#eligible-offers). 
- Visual Studio subscribers within any type of offer can also [adequately prepare and create](../windows/prepare-for-upload-vhd-image.md) a 64-bit Windows 7, Windows 8, or Windows 10 image and then [upload to Azure](../windows/upload-generalized-managed.md). The use remains limited to dev/test by active Visual Studio subscribers.

This [article](../windows/client-images.md) outlines the eligibility requirements for running Windows client in Azure and use of the Azure Gallery images.

## I am not able to see VM Size family that I want when resizing my VM.

When a VM is running, it is deployed to a physical server. The physical servers in Azure regions are grouped in clusters of common physical hardware. Resizing a VM that requires the VM to be moved to different hardware clusters is different depending on which deployment model was used to deploy the VM.

- VMs deployed in Classic deployment model, the cloud service deployment must be removed and redeployed to change the VMs to a size in another size family.

[!INCLUDE [classic-vm-deprecation](../../../includes/classic-vm-deprecation.md)]

- VMs deployed in Resource Manager deployment model, you must stop all VMs in the availability set before changing the size of any VM in the availability set.

## The listed VM size is not supported while deploying in Availability Set.

Choose a size that is supported on the availability set's cluster. It is recommended when creating an availability set to choose the largest VM size you think you need, and have that be your first deployment to the Availability set.

## Can I add an existing Classic VM to an availability set?

Yes. You can add an existing classic VM to a new or existing Availability Set. For more information see [Add an existing virtual machine to an availability set](/previous-versions/azure/virtual-machines/windows/classic/configure-availability-classic#addmachine).


## Next steps
If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/).

Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
