---
title: Upload a VHD file to Azure DevTest Labs by using AzCopy
description: Walk through the steps to use the AzCopy command-line utility to upload a VHD file to a lab storage account in Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: UpdateFrequency2
---

# Upload a VHD file to a lab storage account by using AzCopy

[!INCLUDE [devtest-lab-upload-vhd-selector](../../includes/devtest-lab-upload-vhd-selector.md)]

In this article, learn how to use the AzCopy command-line utility to upload a VHD file to a lab storage account in Azure DevTest Labs. After you upload your VHD file, you can create a custom image from the uploaded VHD file and use the image to provision a virtual machine.

For more information about disks and VHDs in Azure, see [Introduction to managed disks](../virtual-machines/managed-disks-overview.md).

> [!NOTE]
>  
> AzCopy is a Windows-only command-line utility.

## Prerequisites

- Download and install the [latest version of AzCopy](https://aka.ms/downloadazcopy).

To upload a VHD file to a lab storage account by using AzCopy, first, get the lab storage account name via the Azure portal. Then, use AzCopy to upload the file.

## Get the lab storage account name

To get the name of the lab storage account:

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Select **All resources**, and then select your lab.  

1. In the lab menu under **Settings**, select **Configuration and policies**.

1. In **Activity log**, in the resource menu under **Virtual machine bases**, select **Custom images**.

1. In **Custom images**, select **Add**.

1. In **Custom image**, under **VHD**, select the **Upload an image using PowerShell** link.

    :::image type="content" source="media/devtest-lab-upload-vhd-using-azcopy/upload-image-powershell.png" alt-text="Screenshot that shows settings to upload a VHD by using PowerShell on the Custom image pane.":::

1. In **Upload an image using PowerShell**, scroll right to see a call to the Add-AzureRmVhd cmdlet.

    The `-Destination` parameter contains the URI for a blob container in the following format:

    `https://<storageAccountName>.blob.core.windows.net/uploads/...`

    :::image type="content" source="media/devtest-lab-upload-vhd-using-azcopy/destination-parameter.png" alt-text="Screenshot that shows an example of a URI in the Add VHD box.":::

1. Copy the storage account URI to use in the next section.

## Upload a VHD file

To upload a VHD file by using AzCopy:

1. In Windows, open a Command Prompt window and go to the AzCopy installation directory.

    By default, AzCopy is installed in *ProgramFiles(x86)\Microsoft SDKs\Azure\AzCopy*.

    Optionally, you can add the AzCopy installation location to your system path.

1. At the command prompt, run the following command. Use the storage account key and blob container URI you copied from the Azure portal. The value for `vhdFileName` must be in quotes.

    ```cmd
    AzCopy /Source:<sourceDirectory> /Dest:<blobContainerUri> /DestKey:<storageAccountKey> /Pattern:"<vhdFileName>" /BlobType:page
    ```

The process of uploading a VHD file might be lengthy depending on the size of the VHD file and your connection speed.

## Automate uploading VHD files
To automate uploading VHD files to create custom images, use [AzCopy](../storage/common/storage-use-azcopy-v10.md) to copy or upload VHD files to the storage account that's associated with the lab.
      
To find the destination storage account that's associated with your lab:
          
1.	Sign in to the [Azure portal](https://portal.azure.com).
2.	On the left menu, select **Resource Groups**.
3.	Find and select the resource group that's associated with your lab.
4.	Under **Overview**, select one of the storage accounts.
5.	Select **Blobs**.
6.	Look for uploads in the list. If none exists, return to step 4 and try another storage account.
7.	Use the **URL** as the destination in your AzCopy command.

## Next steps

- Learn how to [create a custom image in Azure DevTest Labs from a VHD file by using the Azure portal](devtest-lab-create-template.md).
- Learn how to [create a custom image in Azure DevTest Labs from a VHD file by using PowerShell](devtest-lab-create-custom-image-from-vhd-using-powershell.md).
