---
title: Create an Azure virtual machine offer on Azure Marketplace using your own image
description: Learn how to publish a virtual machine offer to Azure Marketplace using your own image.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: emuench
ms.author: krsh
ms.date: 10/15/2020
---

# Create a virtual machine using your own image

This article describes how to create and deploy a user-provided virtual machine (VM) image.

To use an approved base image, follow the instructions in [Create a VM image from an approved base](azure-vm-create-using-approved-base.md).

## Configure the VM

This section describes how to size, update, and generalize an Azure VM. These steps are necessary to prepare your VM to be deployed on Azure Marketplace.

## Size the VHDs

[!INCLUDE [Discussion of VHD sizing](includes/vhd-size.md)]

## Install the most current updates

[!INCLUDE [Discussion of most current updates](includes/most-current-updates.md)]

## Perform additional security checks

[!INCLUDE [Discussion of addition security checks](includes/additional-security-checks.md)]

## Perform custom configuration and scheduled tasks

[!INCLUDE [Discussion of custom configuration and scheduled tasks](includes/custom-config.md)]

## Upload the VHD to Azure

Configure and prepare the VM to be uploaded as described in [Prepare a Windows VHD or VHDX to upload to Azure](../virtual-machines/windows/prepare-for-upload-vhd-image.md) or [Create and Upload a Linux VHD](../virtual-machines/linux/create-upload-generic.md).

## Extract the VHD from image (if using image building services)

If you are using an image building service such as [Packer](https://www.packer.io/), you may need to extract the VHD from the image. There is no direct way to do this. You will have to create a VM and extract the VHD from the VM disk.

### Create VM on the Azure portal

Follow these steps to create the base VM image on the [Azure portal](https://ms.portal.azure.com/).

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
2. Select **Virtual machines**.
3. Select **+ Add** to open the **Create a virtual machine** screen.
4. Select the image from the dropdown list or select **Browse all public and private images** to search or browse all available virtual machine images.
5. To create a **Gen 2** VM, go to the **Advanced** tab and select the **Gen 2** option.

    :::image type="content" source="media/create-vm/vm-gen-option.png" alt-text="Select Gen 1 or Gen 2.":::

6. Select the size of the VM to deploy.

    :::image type="content" source="media/create-vm/create-virtual-machine-sizes.png" alt-text="Select a recommended VM size for the selected image.":::

7. Provide the other required details to create the VM.
8. Select **Review + create** to review your choices. When the **Validation passed** message appears, select **Create**.

Azure begins provisioning the virtual machine you specified. Track its progress by selecting the **Virtual Machines** tab in the left menu. After it's created the status of Virtual Machine changes to **Running**.

## Connect to your VM

Connect to your [Windows](../virtual-machines/windows/connect-logon.md) or [Linux](../virtual-machines/linux/ssh-from-windows.md#connect-to-your-vm) VM.

[!INCLUDE [Discussion of addition security checks](includes/size-connect-generalize.md)]

## Next steps

- Recommended next step, but optional: [Test your VM image](azure-vm-image-test) to ensure it meets Azure Marketplace publishing requirements.
- If you don't test your VM image, continue with [Generate the SAS URI](azure-vm-get-sas-uri.md).
- If you encountered difficulty creating your new Azure-based VHD, see [VM FAQ for Azure Marketplace](azure-vm-create-faq.md).
