---
title: How to manage Azure File storage from the Azure portal | Microsoft Docs
description: Learn to use the Azure portal to manage Azure File storage.
services: storage
documentationcenter: ''
author: RenaShahMSFT
manager: aungoo
editor: tysonn

ms.assetid: a4a1bc58-ea14-4bf5-b040-f85114edc1f1
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 05/27/2017
ms.author: renash
---

# How to use File Storage from the Azure Portal
The [Azure portal](https://portal.azure.com) provides a user interface for managing Azure File Storage. You can perform the following actions from your web browser:

* Create a File Share
* Upload and download files to and from your file share.
* Monitor the actual usage of each file share.
* Adjust the file share size quota.
* Copy the `net use` command to use to mount your file share from a Windows client.

## Create file share
1. Sign in to the Azure portal.
2. On the navigation menu, click **Storage accounts** or **Storage accounts (classic)**.
    
    ![Screenshot that shows how to create file share in the portal](media/storage-file-how-to-use-files-portal/use-files-portal-create-file-share1.png)

3. Choose your storage account.

    ![Screenshot that shows how to create file share in the portal](media/storage-file-how-to-use-files-portal/use-files-portal-create-file-share2.png)

4. Choose "Files" service.

    ![Screenshot that shows how to create file share in the portal](media/storage-file-how-to-use-files-portal/use-files-portal-create-file-share3.png)

5. Click "File shares" and follow the link to create your first file share.

    ![Screenshot that shows how to create file share in the portal](media/storage-file-how-to-use-files-portal/use-files-portal-create-file-share4.png)

6. Fill in the file share name and the size of the file share (up to 5120 GB) to create your first file share. Once the file share has been created, you can mount it from any file system that supports SMB 2.1 or SMB 3.0. You could click on **Quota** on the file share to change the size of the file up to 5120 GB. Please refer to [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) to estimate the storage cost of using Azure File Storage.

    ![Screenshot that shows how to create file share in the portal](media/storage-file-how-to-use-files-portal/use-files-portal-create-file-share5.png)

## Upload and download files
1. Choose one file share your have already created.

    ![Screenshot that shows how to upload and download files from the portal](media/storage-file-how-to-use-files-portal/use-files-portal-upload-file1.png)

2. Click **Upload** to open the user interface for files uploading.

    ![Screenshot that shows how to upload files from the portal](media/storage-file-how-to-use-files-portal/use-files-portal-upload-file2.png)

## Connect to file share
-  Click **Connect** to get the command line for mounting the file share from Windows and Linux. For Linux users, you can also refer to [How to use Azure File Storage with Linux](storage-how-to-use-files-linux.md) for more mounting instructions for other Linux distros.

    ![Screenshot that shows how to mount the file share](media/storage-file-how-to-use-files-portal/use-files-portal-connect.png)
-  You can copy the commands for mounting file share on Windows or Linux and run it from you Azure VM or on-premises machine.

    ![Screenshot that shows the mount commands for Windows and Linux](media/storage-file-how-to-use-files-portal/use-files-portal-show-mount-commands.png)

**Tip:**  
To find the storage account access key for mounting, click on **View access keys for this storage account** at the bottom of the connect page.

## See also
See these links for more information about Azure File storage.

* [FAQ](storage-files-faq.md)
* [Troubleshooting](storage-troubleshoot-file-connection-problems.md)