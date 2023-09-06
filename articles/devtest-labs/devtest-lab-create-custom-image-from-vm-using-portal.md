---
title: Create a custom image from a lab VM
description: Learn how to create a custom image from a provisioned virtual machine in Azure DevTest Labs by using the Azure portal.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: UpdateFrequency2
---

# Create a custom image from a VM

In this article, you learn how to create a custom image from a provisioned Azure DevTest Labs virtual machine (VM).

[!INCLUDE [devtest-lab-custom-image-definition](../../includes/devtest-lab-custom-image-definition.md)]

The custom image includes the OS disk and all the data disks attached to the VM. Lab users can use the custom image to create identical provisioned lab VMs.

## Step-by-step instructions

To create a custom image from a lab VM, take the following steps:

1. In the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040), on your lab's **Overview** page, select the VM to use for the image from the **My virtual machines** list.

   :::image type="content" source="./media/devtest-lab-create-custom-image-vm/overview-page.png" alt-text="Screenshot that shows a V M selected on a lab's Overview page.":::

1. On the VM's **Overview** page, select **Create custom image** under **Operations** in the left navigation.

1. On the **Create custom image** page, enter a **Name** and optional **Description** for the custom image.

1. Under **Image preparation**, select one of the following options:

   - **I have not generalized this virtual machine** if you haven't run [sysprep](/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview) and don't want to run sysprep on the VM when creating the custom image.
   - **I have already generalized this virtual machine** if you already ran sysprep on the VM.
   - **Generalize this virtual machine (Run sysprep)** if you haven't run sysprep and you want sysprep to be run on the VM when creating the custom image.

1. Select **OK**.

   :::image type="content" source="./media/devtest-lab-create-custom-image-vm/create-custom-image.png" alt-text="Screenshot that shows the Create custom image selection on a V M's Overview page.":::

The custom image is created and stored in the lab's storage account. The image is now available in the list of base images for creating a new lab VM.

:::image type="content" source="./media/devtest-lab-create-custom-image-vm/custom-image-available-as-base.png" alt-text="Screenshot that shows custom images available in the list of VM base images.":::

## Next steps

- [Add a VM to your lab](devtest-lab-add-vm.md)
- [Create a custom image from a VHD file for DevTest Labs](devtest-lab-create-template.md)
- [Compare custom images and formulas in DevTest Labs](devtest-lab-comparing-vm-base-image-types.md)
- [Create a custom image factory in Azure DevTest Labs](image-factory-create.md)
