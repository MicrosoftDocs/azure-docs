---
title: Upload a VHD file to Azure DevTest Labs by using PowerShell
description: Walk through the steps to use PowerShell to upload a VHD file to a lab storage account in Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 12/22/2022
---

# Upload a VHD file to a lab storage account by using PowerShell

[!INCLUDE [devtest-lab-upload-vhd-selector](../../includes/devtest-lab-upload-vhd-selector.md)]

In this article, learn how to use PowerShell to upload a VHD file to a lab storage account in Azure DevTest Labs. After you upload your VHD file, you can create a custom image from the uploaded VHD file and use the image to provision a virtual machine.

For more information about disks and VHDs in Azure, see [Introduction to managed disks](../virtual-machines/managed-disks-overview.md).

## Upload a VHD file

To upload a VHD file to Azure DevTest Labs by using PowerShell:

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Select **All resources**, and then select your lab.  

1. In the lab menu under **Settings**, select **Configuration and policies**.

1. In **Activity log**, in the resource menu under **Virtual machine bases**, select **Custom images**.

1. In **Custom images**, select **Add**.

1. In **Custom image**, under **VHD**, select the **Upload an image using PowerShell** link.

    :::image type="content" source="media/devtest-lab-upload-vhd-using-powershell/upload-image-powershell.png" alt-text="Screenshot that shows settings to upload a VHD by using PowerShell on the Custom image pane.":::

1. In **Upload an image using PowerShell** > **Add VHD**, copy the generated PowerShell script to a text editor.

1. Modify the `-LocalFilePath` parameter of the Add-AzureRmVhd cmdlet to point to the location of the VHD file you want to upload.

1. At a PowerShell prompt, run the Add-AzureRmVhd cmdlet with the modified `-LocalFilePath` parameter.

> [!WARNING]
> The process of uploading a VHD file might be lengthy depending on the size of the VHD file and your connection speed.

## Next steps

- Learn how to [create a custom image in Azure DevTest Labs from a VHD file by using the Azure portal](devtest-lab-create-template.md).
- Learn how to [create a custom image in Azure DevTest Labs from a VHD file by using PowerShell](devtest-lab-create-custom-image-from-vhd-using-powershell.md).
