---
title: Upload a VHD file to lab storage by using Storage Explorer
description: Walk through the steps to upload a VHD file to a DevTest Labs lab storage account by using Azure Storage Explorer.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 12/23/2022
ms.custom: UpdateFrequency2
---

# Upload a VHD file to a lab storage account by using Storage Explorer

[!INCLUDE [devtest-lab-upload-vhd-selector](../../includes/devtest-lab-upload-vhd-selector.md)]

In this article, learn how to use [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) to upload a VHD file to a lab storage account in Azure DevTest Labs. After you upload your VHD file, you can create a custom image from the uploaded VHD file and use the image to provision a virtual machine.

For more information about disks and VHDs in Azure, see [Introduction to managed disks](../virtual-machines/managed-disks-overview.md).

Storage Explorer supports several connection options. This article describes how to connect to a storage account that's associated with your Azure subscription. For information about other Storage Explorer connection options, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

## Prerequisites

- Download and install the [latest version of Storage Explorer](https://www.storageexplorer.com).

To upload a VHD file to a lab storage account by using Storage Explorer, first, get the lab storage account name via the Azure portal. Then, use Storage Explorer to upload the file.

## Get the lab storage account name

To get the name of the lab storage account:

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Select **All resources**, and then select your lab.  

1. In the lab menu under **Settings**, select **Configuration and policies**.

1. In **Activity log**, in the resource menu under **Virtual machine bases**, select **Custom images**.

1. In **Custom images**, select **Add**.

1. In **Custom image**, under **VHD**, select the **Upload an image using PowerShell** link.

    :::image type="content" source="media/devtest-lab-upload-vhd-using-storage-explorer/upload-image-powershell.png" alt-text="Screenshot that shows settings to upload a VHD by using PowerShell on the Custom image pane.":::

1. In **Upload an image using PowerShell**, scroll right to see a call to the Add-AzureRmVhd cmdlet.

    The `-Destination` parameter contains the URI for a blob container in the following format:

    `https://<storageAccountName>.blob.core.windows.net/uploads/...`

    :::image type="content" source="media/devtest-lab-upload-vhd-using-storage-explorer/destination-parameter.png" alt-text="Screenshot that shows an example of a storage account name in the Add VHD box.":::

1. Copy the storage account name to use in the next section.

## Upload a VHD file

To upload a VHD file by using Storage Explorer:

1. When you open Storage Explorer, the Explorer pane shows all the Azure subscriptions you're signed in to.

   If you need to add a different account, select the **Account Management** icon. In **Account Management**, select **Add an account**.

   :::image type="content" source="media/devtest-lab-upload-vhd-using-storage-explorer/add-account-link.png" alt-text="Screenshot that shows Add an account in the Account Management pane.":::

   Follow the prompts to sign in with the Microsoft account associated with your Azure subscription.

1. After you sign in, the Explorer pane shows the Azure subscriptions that are associated with your account. Select the dropdown arrow next to the Azure subscription you want to use. The left pane shows the storage accounts that are associated with the selected Azure subscription.

   :::image type="content" source="media/devtest-lab-upload-vhd-using-storage-explorer/storage-accounts-list.png" alt-text="Screenshot that shows the storage accounts for a selected Azure subscription.":::
  
1. Select the dropdown arrow next to the lab storage account name you saved earlier.

1. Expand **Blob Containers**, and then select **uploads**.

   :::image type="content" source="media/devtest-lab-upload-vhd-using-storage-explorer/upload-dir.png" alt-text="Screenshot that shows the expanded Blob Containers node with the uploads directory.":::

1. In the Storage Explorer right pane, on the blob editor toolbar, select **Upload**, and then select **Upload Files**.

   :::image type="content" source="media/devtest-lab-upload-vhd-using-storage-explorer/upload-button.png" alt-text="Screenshot that shows the Upload button and Upload Files.":::

1. In the **Upload Files** dialog:

    1. Select **...** next to **Selected files**. Go to the VHD file on your computer, select the file, and then select **Open**.

    1. For **Blob type**, select **Page Blob**.

    1. Select **Upload**.

   :::image type="content" source="media/devtest-lab-upload-vhd-using-storage-explorer/upload-file.png" alt-text="Screenshot that shows the Upload Files dialog box.":::

1. Check the **Activities** pane at the bottom of Storage Explorer to see the upload status. Uploading the VHD file might take a long time, depending on the size of the VHD file and your connection speed.

   :::image type="content" source="media/devtest-lab-upload-vhd-using-storage-explorer/upload-status.png" alt-text="Screenshot that shows the Activities pane with upload status.":::


## Automate uploading VHD files
To automate uploading VHD files to create custom images, use [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md). Storage Explorer is a standalone app that runs on Windows, OS X, and Linux.
      
To find the destination storage account that's associated with your lab:
          
1.	Sign in to the [Azure portal](https://portal.azure.com).
2.	On the left menu, select **Resource Groups**.
3.	Find and select the resource group that's associated with your lab.
4.	Under **Overview**, select one of the storage accounts.
5.	Select **Blobs**.
6.	Look for uploads in the list. If none exists, return to step 4 and try another storage account.
7.	Use the **URL** as the destination for your VHDs.

## Next steps

- Learn how to [create a custom image in Azure DevTest Labs from a VHD file by using the Azure portal](devtest-lab-create-template.md).
- Learn how to [create a custom image in Azure DevTest Labs from a VHD file using PowerShell](devtest-lab-create-custom-image-from-vhd-using-powershell.md).
