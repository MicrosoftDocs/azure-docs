---
title: Use Azure Data Box Heavy to move file share content to SharePoint Online
description: Use this tutorial to learn how to migrate file share content to Share Point Online using your Azure Data Box Heavy
services: databox
author: alkohli

ms.service: databox
ms.subservice: heavy
ms.topic: how-to
ms.date: 07/18/2019
ms.author: alkohli
---

# Use the Azure Data Box Heavy to migrate your file share content to SharePoint Online

Use your Azure Data Box Heavy and the SharePoint Migration Tool (SPMT) to easily migrate your file share content to SharePoint Online and OneDrive. By using Data Box Heavy, you can remove the dependency on your Wide-area network (WAN) link to transfer the data.

The Microsoft Azure Data Box is a service that lets you order a device from the Microsoft Azure portal. You can then copy terabytes of data from your servers to the device. After shipping it back to Microsoft, your data is copied into Azure. Depending on the size of data you intend to transfer, you can choose from:

- [Data Box Disk](https://docs.microsoft.com/azure/databox/data-box-disk-overview) with 35-TB usable capacity per order for small-to-medium datasets.
- [Data Box](https://docs.microsoft.com/azure/databox/data-box-overview) with 80-TB usable capacity per device for medium-to-large datasets.
- [Data Box Heavy](https://docs.microsoft.com/azure/databox/data-box-heavy-overview) with 770-TB usable capacity per device for large datasets.

This article specifically talks about how to use the Data Box Heavy to migrate your file share content to SharePoint Online.

## Requirements and costs

### For Data Box Heavy

- Data Box Heavy is only available for Enterprise Agreement (EA), Cloud solution provider (CSP), or Azure sponsorship offers. If your subscription does not fall in any of the above types, contact Microsoft Support to upgrade your subscription or see [Azure subscription pricing](https://azure.microsoft.com/pricing/).
- There is a fee to use Data Box Heavy. Make sure to review the [Data Box Heavy pricing](https://azure.microsoft.com/pricing/details/databox/heavy/).


### For SharePoint Online

- Review the [Minimum requirements for the SharePoint Migration Tool (SPMT)](https://docs.microsoft.com/sharepointmigration/how-to-use-the-sharepoint-migration-tool).

## Workflow overview

This workflow requires you to perform steps on Azure Data Box Heavy as well as on SharePoint Online.
The following steps relate to your Azure Data Box Heavy.

1. Order Azure Data Box Heavy.
2. Receive and set up your device.
3. Copy data from your on-premises file share to folder for Azure Files on your device.
4. After the copy is complete, ship the device back as per the instructions.
5. Wait for the data to completely upload to Azure.

The following steps relate to SharePoint Online.

6. Create a VM in the Azure portal and mount the Azure file share on it.
7. Install the SPMT tool on the Azure VM.
8. Run the SPMT tool using the Azure file share as the *source*.
9. Complete the final steps of the tool.
10. Verify and confirm your data.

## Use Data Box Heavy to copy data

Take the following steps to copy data to your Data Box Heavy.

1. [Order your Data Box Heavy](data-box-heavy-deploy-ordered.md).
2. After you receive your Data Box Heavy, [Set up the Data Box Heavy](data-box-heavy-deploy-set-up.md). You'll cable and configure both the nodes on your device.
3. [Copy data to Azure Data Box Heavy](data-box-heavy-deploy-copy-data.md). While copying, make sure to:

    - Use only the *StorageAccountName_AzFile* folder in the Data Box Heavy to copy the data. This is because you want the data to end up in an Azure file share, not in block blobs or page blobs.
    - Copy files to a folder within *StorageAccountName_AzFile* folder. A subfolder within *StorageAccountName_AzFile* folder creates a file share. Files copied directly to *StorageAccountName_AzFile* folder fail and are uploaded as block blobs. This is the file share that you will mount on your VM in the next step.
    - Copy data to both nodes of your Data Box Heavy.
3. Run [Prepare to ship](data-box-heavy-deploy-picked-up.md#prepare-to-ship) on your device. A successful prepare to ship ensures a successful upload of files to Azure.
4. [Return the device](data-box-heavy-deploy-picked-up.md#ship-data-box-heavy-back).
5. [Verify the data upload to Azure](data-box-heavy-deploy-picked-up.md#verify-data-upload-to-azure).

## Use SPMT to migrate data

After you receive confirmation from the Azure data team that your data copy has completed, proceed to migrate your data to SharePoint Online.

For best performance and connectivity, we recommend that you create an Azure Virtual Machine (VM).

1. Sign into the Azure portal, and then [Create a virtual machine](../virtual-machines/windows/quick-create-portal.md).
2. [Mount the Azure file share onto the VM](../storage/files/storage-how-to-use-files-windows.md#mount-the-azure-file-share-with-file-explorer).
3. [Download the SharePoint Migration tool](https://spmtreleasescus.blob.core.windows.net/install/default.htm) and install it on your Azure VM.
4. Start the SharePoint Migration Tool. Click **Sign in** and enter your Office 365 username and password.
5. When prompted **Where is your data?**, select **File share**. Enter the path to your Azure file share where your data is located.
6. Follow the remaining prompts as normal, including your target location. For more information, go to [How to use the SharePoint Migration Tool](https://docs.microsoft.com/sharepointmigration/how-to-use-the-sharepoint-migration-tool).

> [!IMPORTANT]
> - The speed at which data is ingested into SharePoint Online is affected by several factors, regardless if you have your data already in Azure. Understanding these factors will help you plan and maximize the efficiency of your migration.  For more information, go to [SharePoint Online and OneDrive migration Speed](/sharepointmigration/sharepoint-online-and-onedrive-migration-speed).
> - There is a risk of losing existing permissions on files when migrating the data to SharePoint Online. You may also lose certain metadata, such as *Created by* and *Date modified by*.

## Next steps

[Order your Data Box Heavy](./data-box-heavy-deploy-ordered.md)