---
title: Recommended approaches for creating custom images for labs
description: Describes approaches for creating custom images for labs.
ms.date: 07/27/2021
ms.topic: how-to
---

# Recommended approaches for creating custom images
This article describes the following recommended approaches for creating a custom image:

-   Create and save a custom image from a [lab's template virtual machine (VM)](how-to-create-manage-template.md).
-   Bring a custom image from outside of the context of a lab by using:
    - An [Azure VM](https://azure.microsoft.com/services/virtual-machines/).
    - A VHD in your physical lab environment.

## Save a custom image from a lab's template VM

Using a lab's template VM to create and save a custom image is the simplest way to create an image because it's supported by using the Azure Lab Services portal. As a result, both IT departments and educators can create custom images by using a lab's template VM.

For example, you can start with one of the Azure Marketplace images and then install the software applications and tooling that are needed for a class. After you've finished setting up the image, you can save it in the [connected compute gallery](how-to-attach-detach-shared-image-gallery.md) so that you and other educators can use the image to create new labs.

There are a few key points to be aware of with this approach:

- Lab Services automatically saves a *specialized* image when you export the image from the template VM. In most cases, specialized images are well suited for creating new labs because the image retains machine-specific information and user profiles. Using a specialized image helps to ensure that the installed software will run the same when you use the image to create new labs. If you need to create a *generalized* image, you must use one of the other recommended approaches in this article to create a custom image.

    You can create labs based on both generalized and specialized images in Azure Lab Services. For more information about the differences, see [Generalized and specialized images](../virtual-machines/shared-image-galleries.md#generalized-and-specialized-images).

- For more advanced scenarios with setting up your image, you might find it helpful to instead create an image outside of labs by using either an Azure VM or a VHD from your physical lab environment. Read the next sections for more information.

### Use a lab's template VM to save a custom image

You can use a lab's template VM to create either Windows or Linux custom images. For more information, see [Save an image a compute gallery](how-to-use-shared-image-gallery.md#save-an-image-to-a-compute-gallery)

## Bring a custom image from an Azure VM

Another approach is to use an Azure VM to set up a custom image. After you've finished setting up the image, you can save it to a compute gallery so that you and your colleagues can use the image to create new labs.

Using an Azure VM gives you more flexibility:

- You can create either [generalized or specialized](../virtual-machines/shared-image-galleries.md#generalized-and-specialized-images) images. Otherwise, if you use a lab's template VM to [export an image](how-to-use-shared-image-gallery.md) the image is always specialized.
- You have access to more advanced features of an Azure VM that might be helpful for setting up an image. For example, you can use [extensions](../virtual-machines/extensions/overview.md) to do post-deployment configuration and automation. Also, you can access the VM's [boot diagnostics](../virtual-machines/boot-diagnostics.md) and [serial console](/troubleshoot/azure/virtual-machines/serial-console-overview).

Setting up an image by using an Azure VM is more complex. As a result, IT departments are typically responsible for creating custom images on Azure VMs.

### Use an Azure VM to set up a custom image

Here are the high-level steps to bring a custom image from an Azure VM:

1. Create an [Azure VM](https://azure.microsoft.com/services/virtual-machines/) by using a Windows or Linux Marketplace image.
1. Connect to the Azure VM and install more software. You can also make other customizations that are needed for your lab.
1. When you've finished setting up the image, [save the VM's image to a compute gallery](../virtual-machines/image-version.md). As part of this step, you'll also need to create the image's definition and version.
1. After the custom image is saved in the gallery, you can use your image to create new labs. 


The steps vary depending on if you're creating a custom Windows or Linux image. Read the following articles for the detailed steps:

-   [Bring a custom Windows image from an Azure VM](how-to-bring-custom-windows-image-azure-vm.md)
-   [Bring a custom Linux image from an Azure VM](how-to-bring-custom-linux-image-azure-vm.md)

## Bring a custom image from a VHD in your physical lab environment

The third approach to consider is to bring a custom image from a VHD in your physical lab environment to a compute gallery. After the image is in a compute gallery, you and other educators can use the image to create new labs.

Here are a few reasons why you might want to use this approach:

- You can create either [generalized or specialized](../virtual-machines/shared-image-galleries.md#generalized-and-specialized-images) images to use in your labs. Otherwise, if you use a [lab's template VM](how-to-use-shared-image-gallery.md) to export an image, the image is always specialized.
- You can access resources that exist within your on-premises environment. For example, you might have large installation files in your on-premises environment that are too time consuming to copy to a lab's template VM.
- You can upload images created by using other tools, such as [Microsoft Endpoint Configuration Manager](/mem/configmgr/core/understand/introduction), so that you don't have to manually set up an image by using a lab's template VM.

Bringing a custom image from a VHD is the most advanced approach because you must ensure that the image is set up properly so that it works within Azure. As a result, IT departments are typically responsible for creating custom images from VHDs.

### Bring a custom image from a VHD

Here are the high-level steps to bring a custom image from a VHD:

1. Use [Windows Hyper-V](/virtualization/hyper-v-on-windows/about/) on your on-premises machine to create a Windows or Linux VHD.
1. Connect to the Hyper-V VM and install more software. You can also make other customizations that are needed for your lab.
1. When you've finished setting up the image, upload the VHD to create a [managed disk](../virtual-machines/managed-disks-overview.md) in Azure.
1. From the managed disk, create the [image's definition](../virtual-machines/shared-image-galleries.md#image-definitions) and version in a compute gallery.
1. After the custom image is saved in the gallery, you can use the image to create new labs. 

The steps vary depending on if you're creating a custom Windows or Linux image. Read the following articles for the detailed steps:

-   [Bring a custom Windows image from a VHD](upload-custom-image-shared-image-gallery.md)
-   [Bring a custom Linux image from a VHD](how-to-bring-custom-linux-image-vhd.md)

## Next steps

* [Azure Compute gallery overview](../virtual-machines/shared-image-galleries.md)
* [Attach or detach an Azure Compute Gallery](how-to-attach-detach-shared-image-gallery.md)
* [Use an Azure Compute Gallery](how-to-use-shared-image-gallery.md)
