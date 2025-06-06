---
title: Upload a VHD file to lab storage by using Storage Explorer
description: Walk through the steps to upload a virtual hard disk (VHD) file to a DevTest Labs lab storage account by using Azure Storage Explorer.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/20/2025
ms.custom: UpdateFrequency2

#customer intent: As a lab user, I want to learn how to upload a VHD to a lab storage account so I can use the VHD to create a custom image and lab VMs.
---

# Upload a VHD file to lab storage by using Storage Explorer

[!INCLUDE [devtest-lab-upload-vhd-selector](../../includes/devtest-lab-upload-vhd-selector.md)]

In this article, you learn how to use Azure Storage Explorer to upload a virtual hard disk (VHD) file to a lab storage account in Azure DevTest Labs. Storage Explorer is a standalone app that runs on Windows, macOS, and Linux. After you upload your VHD file to your lab, you can create a custom image from the uploaded file and use the image to create lab virtual machines (VMs).

Storage Explorer supports several connection options. This article describes how to connect to a storage account associated with your Azure subscription. For information about other Storage Explorer connection options, see [Get started with Storage Explorer](/azure/vs-azure-tools-storage-manage-with-storage-explorer).

## Prerequisites

- Write access to a lab in DevTest Labs.
- A VHD or virtual hard disk v2 (VHDX) virtual hard disk file to upload.
- The [latest version of Storage Explorer](https://www.storageexplorer.com) installed.

## Upload a VHD file to a lab

To upload a VHD file to a lab storage account by using Storage Explorer, first get the lab storage account name by using the Azure portal. Then use Storage Explorer to upload the VHD file to the storage account.

### Get the lab storage account name

To get the name of the lab storage account:

1. In the [Azure portal](https://portal.azure.com), go to the **Overview** page for your lab.
1. Select **Configuration and policies** under **Settings** in the left navigation.
1. Select **Virtual machine bases** > **Custom images** from the left navigation on the **Activity log** page.
1. On the **Custom images** page, select **Add**.
1. On the **Custom image** page, select the **Upload a VHD using PowerShell** link under **VHD**.

   :::image type="content" source="media/devtest-lab-upload-vhd-using-storage-explorer/upload-image-powershell.png" alt-text="Screenshot that shows the link to upload a VHD by using PowerShell.":::

1. On the **Upload an image using PowerShell** page, scroll right to see the call to the `Add-AzureRmVhd` cmdlet. The `Destination` parameter contains the URI for the blob container in the format `https://<storageAccountName>.blob.core.windows.net`.

   :::image type="content" source="media/devtest-lab-upload-vhd-using-storage-explorer/destination-parameter.png" alt-text="Screenshot that shows an example of a storage account name in the Add VHD box.":::

1. Note the `<storageAccountName>` to use in the next section.

### Upload the VHD file

When you open Storage Explorer, the Explorer pane shows all the Azure subscriptions you have access to. If you need to add a different account, select the **Account Management** icon, and then select **Add an account**.

:::image type="content" source="media/devtest-lab-upload-vhd-using-storage-explorer/add-account-link.png" alt-text="Screenshot that shows Add an account in the Account Management pane.":::

1. Follow the prompts to sign in with the Microsoft account associated with the Azure subscription that has your lab.
1. After you sign in, select the dropdown arrow next to the Azure subscription you want to use.
1. The left pane shows the storage accounts associated with the selected Azure subscription. If you don't see your storage account listed, select **Refresh all**.
1. Select the dropdown arrow next to the lab storage account name you noted earlier, expand **Blob Containers**, and then select **uploads**.

   :::image type="content" source="media/devtest-lab-upload-vhd-using-storage-explorer/upload-dir.png" alt-text="Screenshot that shows the expanded Blob Containers node with the uploads directory.":::

1. In the Storage Explorer right pane, on the blob editor toolbar, select **Upload** > **Upload Files**.

   :::image type="content" source="media/devtest-lab-upload-vhd-using-storage-explorer/upload-button.png" alt-text="Screenshot that shows the Upload button and Upload Files.":::

1. On the **Upload Files** screen, select **...** next to **Selected files**, browse to and select the VHD file on your computer, and then select **Open**.
1. For **Blob type**, select **Page Blob**.
1. Select **Upload**.

   :::image type="content" source="media/devtest-lab-upload-vhd-using-storage-explorer/upload-file.png" alt-text="Screenshot that shows the Upload Files dialog box.":::

1. Track the upload status in the **Activities** pane at the bottom of Storage Explorer. Uploading the VHD file might take a long time, depending on the size of the VHD file and your connection speed.

   :::image type="content" source="media/devtest-lab-upload-vhd-using-storage-explorer/upload-status.png" alt-text="Screenshot that shows the Activities pane with upload status.":::

After the VHD file uploads, you can see it in your lab storage account in the Azure portal.

1. Open your lab storage account by searching for and selecting its name in the Azure Search bar, or by selecting it from **Storage accounts**.
1. On the storage account's **Overview** page, select **Data storage** > **Containers** from the left navigation.
1. On the **Containers** page, open the **Uploads** folder to see the uploaded VHD file and any other uploads to the storage account.

   :::image type="content" source="media/devtest-lab-upload-vhd-using-storage-explorer/uploads.png" alt-text="Screenshot that shows the uploaded VHD file in the Azure storage account.":::

## Related content

- For more information about VHDs and managed disks in Azure, see [Introduction to managed disks](/azure/virtual-machines/managed-disks-overview).
- Learn how to [create a custom image in Azure DevTest Labs from a VHD file by using the Azure portal](devtest-lab-create-template.md).
- Learn how to [create a custom image in Azure DevTest Labs from a VHD file using PowerShell](devtest-lab-create-custom-image-from-vhd-using-powershell.md).
