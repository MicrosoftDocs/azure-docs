---
title: Create a custom image from a lab VM
description: Learn how to create a custom image from an Azure DevTest Labs virtual machine (VM) by using the Azure portal.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 04/02/2025
ms.custom: UpdateFrequency2

#customer intent: As a lab administrator, I want to create custom images from existing VMs so I can make the custom images available to lab users as bases for creating more VMs.
---

# Create a custom image from a VM in DevTest Labs

In this article, you learn how to create a custom image from a provisioned Azure DevTest Labs virtual machine (VM). The custom image includes the OS disk, attached data disks, and any artifacts associated with the VM. Lab users can use the custom image to create identical provisioned lab VMs.

[!INCLUDE [devtest-lab-custom-image-definition](../../includes/devtest-lab-custom-image-definition.md)]

## Prerequisites

- **Owner** or **Contributor** role in a lab that has an existing VM.

## Create the custom image

To create a custom image from a lab VM, take the following steps:

1. On your lab's **Overview** page in the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040), select **All resources** from the left navigation menu.
1. On the **All resources** page, select the VM to use for the image from the **All virtual machines** list.

   :::image type="content" source="./media/devtest-lab-create-custom-image-vm/overview-page.png" alt-text="Screenshot that shows a VM selected on a lab's All resources page.":::

1. On the VM's **Overview** page, select **Create custom image** under **Operations** in the left navigation.
1. On the **Create custom image** page, enter a **Name** and optional **Description** for the custom image.

1. Under **Image preparation**, select one of the following options:

   - **I have not generalized this virtual machine** 
   - **I have already generalized this virtual machine**
   - **Generalize this virtual machine** (for Windows: **(Run sysprep)** or for Linux: **(Run deprovision)**)

   [Sysprep](/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview) for Windows or [deprovision](/azure/virtual-machines/generalize#linux) for Linux create generalized images that have user profiles and other VM-specific settings removed. If you don't run sysprep or deprovision, the custom image creates exact copies of the machine that can run in isolated networks. For more information, see [Generalize a VM](/azure/virtual-machines/generalize).

   If you want sysprep or deprovision to be run on the VM when creating the custom image, choose **Generalize this virtual machine**. Running sysprep or deprovision when you create the custom image makes the existing VM unusable.

1. Select **OK**.

   :::image type="content" source="./media/devtest-lab-create-custom-image-vm/create-custom-image.png" alt-text="Screenshot that shows the Create custom image page.":::

The custom image is created and stored in the lab's storage account. The image now appears on the **Custom images** list for the lab and is available in the list of base images for creating a new lab VM.

:::image type="content" source="./media/devtest-lab-create-custom-image-vm/custom-image-available-as-base.png" alt-text="Screenshot that shows custom images available in the list of VM base images.":::

## Related content

- [Add a VM to your lab](devtest-lab-add-vm.md)
- [Create a custom image from a VHD file](devtest-lab-create-template.md)
- [Compare custom images and formulas in DevTest Labs](devtest-lab-comparing-vm-base-image-types.md)
