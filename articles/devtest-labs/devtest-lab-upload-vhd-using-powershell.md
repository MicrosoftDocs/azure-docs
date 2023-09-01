---
title: Upload a VHD file to Azure DevTest Labs by using PowerShell
description: Walk through the steps to use PowerShell to upload a VHD file to a lab storage account in Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 12/22/2022
ms.custom: UpdateFrequency2
---

# Upload a VHD file to a lab storage account by using PowerShell

[!INCLUDE [devtest-lab-upload-vhd-selector](../../includes/devtest-lab-upload-vhd-selector.md)]

In this article, learn how to use PowerShell to upload a VHD file to a lab storage account in Azure DevTest Labs. After you upload your VHD file, you can create a custom image from the uploaded VHD file and use the image to provision a virtual machine.

For more information about disks and VHDs in Azure, see [Introduction to managed disks](../virtual-machines/managed-disks-overview.md).

## Prerequisites

- Download and install the [latest version of PowerShell](/powershell/scripting/install/installing-powershell?).

To upload a VHD file to a lab storage account by using PowerShell, first, get the lab storage account name via the Azure portal. Then, use a PowerShell cmdlet to upload the file.

## Get the lab storage account name

To get the name of the lab storage account:

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Select **All resources**, and then select your lab.  

1. In the lab menu under **Settings**, select **Configuration and policies**.

1. In **Activity log**, in the resource menu under **Virtual machine bases**, select **Custom images**.

1. In **Custom images**, select **Add**.

1. In **Custom image**, under **VHD**, select the **Upload an image using PowerShell** link.

    :::image type="content" source="media/devtest-lab-upload-vhd-using-powershell/upload-image-powershell.png" alt-text="Screenshot that shows the link to upload a VHD by using PowerShell on the Custom image pane.":::

1. In **Upload an image using PowerShell**, select and copy the generated PowerShell script to use in the next section.

## Upload a VHD file

To upload a VHD file by using PowerShell:

1. In a text editor, paste the generated PowerShell script you copied from the Azure portal.

1. Modify the `-LocalFilePath` parameter of the Add-AZVHD cmdlet to point to the location of the VHD file you want to upload.

1. At a PowerShell command prompt, run the Add-AZVHD cmdlet with the modified `-LocalFilePath` parameter.

The process of uploading a VHD file might be lengthy depending on the size of the VHD file and your connection speed.

## Next steps

- Learn how to [create a custom image in Azure DevTest Labs from a VHD file by using the Azure portal](devtest-lab-create-template.md).
- Learn how to [create a custom image in Azure DevTest Labs from a VHD file by using PowerShell](devtest-lab-create-custom-image-from-vhd-using-powershell.md).
