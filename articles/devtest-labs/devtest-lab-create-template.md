---
title: Create custom images for lab VMs from VHD files
description: Use the Azure portal to create an Azure DevTest Labs virtual machine (VM) custom image from a virtual hard disk (VHD) file.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/31/2025
ms.custom: UpdateFrequency2

#customer intent: As a lab user, I want to create lab VM custom images by using VHD files, so I can provide a variety of images to lab users for creating VMs.

---

# Create a custom image for an Azure DevTest Labs virtual machine from a VHD file

[!INCLUDE [devtest-lab-create-custom-image-from-vhd-selector](../../includes/devtest-lab-create-custom-image-from-vhd-selector.md)]

In this article, you learn how to create an Azure DevTest Labs virtual machine (VM) custom image by using a virtual hard disk (VHD) file. This article describes how to create a custom image in the Azure portal. You can also [use PowerShell to create a custom image](devtest-lab-create-custom-image-from-vhd-using-powershell.md).

[!INCLUDE [devtest-lab-custom-image-definition](../../includes/devtest-lab-custom-image-definition.md)]

## Prerequisites

- **Owner** or **Contributor** permissions in the lab where you want to create the custom image.
- A VHD file uploaded to the Azure Storage account for the lab. To upload a VHD file:

  1. Go to your lab storage account in the Azure portal and select **Upload**.
  1. Browse to and select the VHD file, select the **uploads** container or create a new container named **uploads**, and then select **Upload**.

  You can also upload a VHD file by following the instructions in any of these articles:

  - [Upload a VHD file by using the AzCopy command-line utility](devtest-lab-upload-vhd-using-azcopy.md)
  - [Upload a VHD file by using Microsoft Azure Storage Explorer](devtest-lab-upload-vhd-using-storage-explorer.md)
  - [Upload a VHD file by using PowerShell](devtest-lab-upload-vhd-using-powershell.md)

## Create the custom image

To create a custom image for DevTest Labs from a VHD file, follow these steps:

1. In the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040), go to the lab that has the uploaded VHD file.
1. On the lab **Overview** page, select **Configuration and policies** in the left navigation.
1. On the **Configuration and policies** page, select **Custom images** under **Virtual machine bases** in the left navigation.
1. On the **Custom images** page, select **Add**.

   :::image type="content" source="media/devtest-lab-create-template/add-custom-image.png" alt-text="Screenshot that shows the Custom image page with the Add button.":::

1. Fill out the **Custom image** page as follows:

   - **Name**: Enter a name for the custom image to display in the list of base images for creating a VM.
   - **Description**: Enter an optional description to display in the base image list.
   - **OS type**: Select whether the OS for the VHD and custom image is **Windows** or **Linux**.
     - If you choose **Windows**, select the checkbox if you ran **sysprep** on the machine when you created the VHD file.
     - If you choose **Linux**, select the checkbox if you ran **deprovision** on the machine when you created the VHD file.
   - **VHD Generation**: Select whether you have a **V1** (VHD) or **V2** (VHDX) file.
   - **VHD**: Select the uploaded VHD file for the custom image from the dropdown menu.
   - **Plan name,** **Plan offer**, and **Plan publisher**: If the VHD isn't a licensed image published by Microsoft, optionally enter the name of the Marketplace image or SKU used to create the VHD, a product or offer name, and the plan publisher. If the image is a licensed image, these fields are prepopulated with the plan information.

1. Select **OK**.

   :::image type="content" source="media/devtest-lab-create-template/create-custom-image.png" alt-text="Screenshot that shows the Custom image page.":::

After creation, the custom image is stored in the lab's storage account. The image appears on the lab **Custom images** page and on the list of VM base images for the lab. Lab users can create new VMs based on the custom image.

:::image type="content" source="media/devtest-lab-create-template/custom-image-available-as-base.png" alt-text="Screenshot that shows the Custom images available in the list of base images.":::

## Related content

- [Add a VM to your lab](devtest-lab-add-vm.md)
- [Compare custom images and formulas in DevTest Labs](devtest-lab-comparing-vm-base-image-types.md)
- [Copying Custom Images between Labs](https://www.visualstudiogeeks.com/blog/DevOps/How-To-Move-CustomImages-VHD-Between-AzureDevTestLabs#copying-custom-images-between-azure-devtest-labs)
