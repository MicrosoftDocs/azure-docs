---
title: Recommendation for creating custom images
titleSuffix: Azure Lab Services
description: Describes approaches for creating custom virtual machine images for labs in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.date: 04/24/2023
ms.topic: conceptual
---

# Recommended approaches for creating custom images for Azure Lab Services labs

This article describes recommended approaches for creating a custom image for Azure Lab Services labs. Learn how you can create a save a custom image from an existing lab template virtual machine, or import a virtual machine image from an Azure VM or physical lab environment.

-   Create and save a custom image from a [lab's template virtual machine (VM)](how-to-create-manage-template.md).
-   Bring a custom image from outside of the context of a lab by using:
    - An [Azure VM](https://azure.microsoft.com/services/virtual-machines/).
    - A VHD in your physical lab environment.

## Save a custom image from a lab template virtual machine

The easiest way to create a custom virtual machine image for labs is to export an existing lab template virtual machine in the Azure portal.

For example, you can start to create a new lab with one of the Azure Marketplace images, and then install extra software applications and tooling in the [template VM](./how-to-create-manage-template.md) that are needed for a class. After you've finished setting up the template VM, you can save it in the [connected compute gallery](how-to-attach-detach-shared-image-gallery.md), for others to use for creating new labs.

You can use a lab's template VM to create either Windows or Linux custom images. For more information, see [Save an image to a compute gallery](how-to-use-shared-image-gallery.md#save-an-image-to-a-compute-gallery)

There are a few key points to be aware of with this approach:

- Azure Lab Services automatically saves a *specialized* image when you export the image from the template VM. In most cases, specialized images are well suited for creating new labs because the image retains machine-specific information and user profiles. Using a specialized image helps to ensure that the installed software runs the same when you use the image to create new labs. If you need to create a *generalized* image, you must use one of the other recommended approaches in this article to create a custom image.

    You can create labs based on both generalized and specialized images in Azure Lab Services. For more information about the differences, see [Generalized and specialized images](../virtual-machines/shared-image-galleries.md#generalized-and-specialized-images).

- For more advanced scenarios with setting up your image, you might instead create an image outside of Azure Lab Services by using either an Azure VM or a VHD from your physical lab environment. For example, if you need to use virtual machine extensions.

## Bring a custom image from an Azure VM

Another approach to set up a custom image is to use an Azure VM. After you've finished setting up the image, you can save it to a compute gallery so that you can use the image to create new labs.

Using an Azure VM gives you more flexibility:

- You can create either [generalized or specialized](/azure/virtual-machines/shared-image-galleries#generalized-and-specialized-images) images. Otherwise, if you use a lab template VM to [export an image](how-to-use-shared-image-gallery.md) the image is always specialized.

- You have access to more advanced features of an Azure VM that might be helpful for setting up an image. For example, you can use [extensions](/azure/virtual-machines/extensions/overview) to do post-deployment configuration and automation. Also, you can access the VM's [boot diagnostics](/azure/virtual-machines/boot-diagnostics) and [serial console](/troubleshoot/azure/virtual-machines/serial-console-overview).

The process for setting up an image by using an Azure VM is more complex. As a result, IT departments are typically responsible for creating custom images on Azure VMs.

### Use an Azure VM to set up a custom image

To create a custom image from an Azure virtual machine:

1. Create an [Azure VM](https://azure.microsoft.com/services/virtual-machines/) by using a Windows or Linux Azure Marketplace image.

1. Connect to the Azure VM and install more software. You can also make other customizations that are needed for your lab.

1. When you've finished setting up the image, [save the VM image to a compute gallery](/azure/virtual-machines/image-version). As part of this step, you also need to create the image definition and version.

1. After you save the custom image in the gallery, use your image to create new labs.

The steps might vary depending on if you're creating a custom Windows or Linux image. Read the following articles for the detailed steps:

-   [Bring a custom Windows image from an Azure VM](how-to-bring-custom-windows-image-azure-vm.md)
-   [Bring a custom Linux image from an Azure VM](how-to-bring-custom-linux-image-azure-vm.md)

## Bring a custom image from a VHD in your physical lab environment

Another approach is to import a custom image from a virtual hard drive (VHD) in your physical lab environment to an Azure compute gallery. After the image is in a compute gallery, you can use it to create new labs.

The reasons you might import a custom image from a physical environment are:

- You can create either [generalized or specialized](../virtual-machines/shared-image-galleries.md#generalized-and-specialized-images) images to use in your labs. Otherwise, if you use a [lab's template VM](how-to-use-shared-image-gallery.md) to export an image, the image is always specialized.

- You can access resources that exist within your on-premises environment during the VM configuration. For example, you might have large installation files in your on-premises environment that are too time-consuming to copy to a lab template VM.

- You can upload images created by using other tools, such as [Microsoft Configuration Manager](/mem/configmgr/core/understand/introduction), so that you don't have to manually set up an image by using a lab's template VM.

Bringing a custom image from a VHD is the most advanced approach because you must ensure that the image is set up properly to function in Azure. As a result, IT departments are typically responsible for creating custom images from VHDs.

### Bring a custom image from a VHD

Follow these steps to import a custom image from a VHD:

1. Use [Windows Hyper-V](/virtualization/hyper-v-on-windows/about/) on your on-premises machine to create a Windows or Linux VHD.

1. Connect to the Hyper-V VM and install more software. You can also make other customizations that are needed for your lab.

1. When you've finished setting up the image, upload the VHD to create a [managed disk](../virtual-machines/managed-disks-overview.md) in Azure.

1. From the managed disk, create the [image's definition](../virtual-machines/shared-image-galleries.md#image-definitions) and version in a compute gallery.

1. After you saved the custom image in the gallery, you can use the image to create new labs.

The steps vary depending on if you're creating a custom Windows or Linux image. Read the following articles for the detailed steps:

-   [Bring a custom Windows image from a VHD](upload-custom-image-shared-image-gallery.md)
-   [Bring a custom Linux image from a VHD](how-to-bring-custom-linux-image-vhd.md)

## Next steps

* [Azure Compute gallery overview](../virtual-machines/shared-image-galleries.md)
* [Attach or detach an Azure Compute Gallery](how-to-attach-detach-shared-image-gallery.md)
* [Use an Azure Compute Gallery](how-to-use-shared-image-gallery.md)
