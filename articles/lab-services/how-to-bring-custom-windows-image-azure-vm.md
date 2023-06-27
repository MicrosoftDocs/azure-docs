---
title: Create a lab from a Windows Azure VM
description: Learn how to create a lab in Azure Lab Services from an existing Windows-based Azure virtual machine.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.date: 05/17/2023
ms.topic: how-to
---

# Create a lab in Azure Lab Services from a Windows-based Azure virtual machine

Learn how you can create a lab in Azure Lab Services from a Windows-based Azure virtual machine image. Start from an Azure virtual machine, export the virtual machine as an image into an Azure compute gallery, and then create a lab from the compute gallery image.

Before you use this approach for creating a custom image, read [Recommended approaches for creating custom images](approaches-for-custom-image-creation.md) to decide the best approach for your scenario.

## Prerequisites

- Your Azure account has permission to create an Azure VM.

## Prepare a custom image on an Azure VM

Use an existing Azure virtual machine (VM) or create a new VM and configure it with the software and configuration settings.

1. If you don't have an Azure VM yet, create a new VM by using the [Azure portal](/azure/virtual-machines/windows/quick-create-portal), [PowerShell](/azure/virtual-machines/windows/quick-create-powershell), the [Azure CLI](/azure/virtual-machines/windows/quick-create-cli), or an [Azure Resource Manager template](/azure/virtual-machines/windows/quick-create-template).
    
    - When you specify the disk settings, ensure the disk's size is *not* greater than 128 GB.
    
1. Connect to the Azure VM and install software and make any necessary configuration changes.

1. Optionally, you can [generalize the image with SysPrep](/azure/virtual-machines/generalize#windows). Otherwise, if you're creating a specialized image, you can skip to the next step.

    Create a specialized image if you want to maintain machine-specific information and user profiles. For more information about the differences between generalized and specialized images, see [Generalized and specialized images](/azure/virtual-machines/shared-image-galleries#generalized-and-specialized-images).

## Import the custom image into a compute gallery

Next, create an image definition in an Azure compute gallery based on the Azure VM.

1. In a compute gallery, [create an image definition](/azure/virtual-machines/image-version) or choose an existing image definition.

     - Choose **Gen 1** for the **VM generation**.
     - Choose whether you're creating a **specialized** or **generalized** image for the **Operating system state**.

    For more information about the values you can specify for an image definition, see [Image definitions](/azure/virtual-machines/shared-image-galleries#image-definitions).

    You can also choose to use an existing image definition and create a new version for your custom image.

1. [Create an image version](/azure/virtual-machines/image-version).

    - The **Version number** property uses the following format: *MajorVersion.MinorVersion.Patch*.
    - For the **Source**, select **Disks and/or snapshots** from the dropdown list.
    - For the **OS disk** property, choose your Azure VM's disk that you created in previous steps.

## Attach the compute gallery to a lab plan

To use images from the compute gallery to create labs in Azure Lab Services, you first need to attach the compute gallery to your lab plan. 

If you haven't attached the compute gallery yet, follow these steps to [attach the Azure compute gallery to your lab plan](./how-to-attach-detach-shared-image-gallery.md).

## Create a lab

You can now create a lab by using the VM image in the Azure compute gallery. Follow these steps to [create a lab](tutorial-setup-lab.md) in Azure Lab Services, and select the custom image from the compute gallery.

## Next steps

- [Azure Compute Gallery overview](/azure/virtual-machines/shared-image-galleries)
- [Attach or detach a compute gallery](how-to-attach-detach-shared-image-gallery.md)
- [Use a compute gallery in Azure Lab Services](how-to-use-shared-image-gallery.md)
