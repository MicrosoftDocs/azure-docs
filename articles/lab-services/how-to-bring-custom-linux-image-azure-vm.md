---
title: How to bring a Linux custom image from an Azure virtual machine.
description: Describes how to bring a Linux custom image from an Azure virtual machine.
ms.date: 07/27/2021
ms.topic: how-to
---

# Bring a Linux custom image from an Azure virtual machine

The steps in this article show how to import a custom image that starts from an [Azure virtual machine (VM)](https://azure.microsoft.com/services/virtual-machines/). With this approach, you set up an image on an Azure VM and import the image into a compute gallery so that it can be used within Azure Lab Services. Before you use this approach for creating a custom image, read [Recommended approaches for creating custom images](approaches-for-custom-image-creation.md) to decide the best approach for your scenario.

## Prerequisites

You'll need permission to create an Azure VM in your school's Azure subscription to complete the steps in this article.

## Prepare a custom image on an Azure VM

1. Create an Azure VM by using the [Azure portal](../virtual-machines/windows/quick-create-portal.md), [PowerShell](../virtual-machines/windows/quick-create-powershell.md), the [Azure CLI](../virtual-machines/windows/quick-create-cli.md), or an [Azure Resource Manager template](../virtual-machines/windows/quick-create-template.md).
    
    - When you specify the disk settings, ensure the disk's size is *not* greater than 128 GB.
    
1. Install software and make any necessary configuration changes to the Azure VM's image.

1. Optionally, you can generalize the image. If you decide to create a generalized image, follow the steps outlined in [Step 1: Deprovision the VM](../virtual-machines/linux/capture-image.md#step-1-deprovision-the-vm). When you use the **-deprovision+user** command, it generalizes the image. But it doesn't guarantee that the image is cleared of all sensitive information or that it's suitable for redistribution.

    Otherwise, if you decide to create a specialized image, you can skip to the next step.

    Create a specialized image if you want to maintain machine-specific information and user profiles. For more information about the differences between generalized and specialized images, see [Generalized and specialized images](../virtual-machines/shared-image-galleries.md#generalized-and-specialized-images).

## Import the custom image into a compute gallery

1. In a compute gallery, [create an image definition](../virtual-machines/image-version.md) or choose an existing image definition.
     - Choose **Gen 1** for the **VM generation**.
     - Choose whether you're creating a **specialized** or **generalized** image for the **Operating system state**.

    For more information about the values you can specify for an image definition, see [Image definitions](../virtual-machines/shared-image-galleries.md#image-definitions). 
    
    You can also choose to use an existing image definition and create a new version for your custom image.
    
1. [Create an image version](../virtual-machines/image-version.md).
    - The **Version number** property uses the following format: *MajorVersion.MinorVersion.Patch*.
    - For the **Source**, select **Disks and/or snapshots** from the dropdown list.
    - For the **OS disk** property, choose your Azure VM's disk that you created in previous steps.

## Create a lab

[Create the lab](tutorial-setup-lab.md) in Lab Services, and select the custom image from the compute gallery.

## Next steps

- [Azure Compute Gallery overview](../virtual-machines/shared-image-galleries.md)
- [Attach or detach a compute gallery](how-to-attach-detach-shared-image-gallery.md)
- [Use a compute gallery](how-to-use-shared-image-gallery.md)
