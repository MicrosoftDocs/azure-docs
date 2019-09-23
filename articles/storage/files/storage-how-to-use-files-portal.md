---
title: Quickstart for managing Azure file shares with Azure portal
description: Use this quickstart to learn to use the Azure portal to manage Azure Files.
services: storage
author: roygara
ms.service: storage
ms.topic: quickstart
ms.date: 10/18/2018
ms.author: rogarana
ms.subservice: files
#Customer intent: As a < type of user >, I want < what? > so that < why? >.
---

# Quickstart: Create and manage Azure file shares with the Azure portal 
[Azure Files](storage-files-introduction.md) is Microsoft's easy-to-use cloud file system. Azure file shares can be mounted in Windows, Linux, and macOS. This guide walks you through the basics of working with Azure file shares using the [Azure portal](https://portal.azure.com/).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a storage account
[!INCLUDE [storage-files-create-storage-account-portal](../../../includes/storage-files-create-storage-account-portal.md)]

## Create an Azure file share
To create an Azure file share:

1. Select the storage account from your dashboard.
2. On the storage account page, in the **Services** section, select **Files**.
	![A screenshot of the services section of the storage account; select the Files service](media/storage-how-to-use-files-portal/create-file-share-1.png)

3. On the menu at the top of the **File service** page, click **+ File share**. The **New file share** page drops down.
4. In **Name** type *myshare*.
5. Click **OK** to create the Azure file share.

Share names need to be all lower case letters, numbers, and single hyphens but cannot start with a hyphen. For complete details about naming file shares and files, see [Naming and Referencing Shares, Directories, Files, and Metadata](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Shares--Directories--Files--and-Metadata).

## Use your Azure file share
Azure Files provides two methods of working with files and folders within your Azure file share: the industry standard [Server Message Block (SMB) protocol](https://msdn.microsoft.com/library/windows/desktop/aa365233.aspx) and the [File REST protocol](https://docs.microsoft.com/rest/api/storageservices/file-service-rest-api). 

To mount a file share with SMB, see the following document based on your OS:
- [Windows](storage-how-to-use-files-windows.md)
- [Linux](storage-how-to-use-files-linux.md)
- [macOS](storage-how-to-use-files-mac.md)

### Using an Azure file share from the Azure portal
All requests made via the Azure portal are made with the File REST API enabling you to create, modify, and delete files and directories on clients without SMB access. It is possible work directly with the File REST protocol directly (that is, handcrafting REST HTTP calls yourself), but the most common way (beyond using the Azure portal) to use the File REST protocol is to use the [Azure PowerShell module](storage-how-to-use-files-powershell.md), the [Azure CLI](storage-how-to-use-files-cli.md), or an Azure Storage SDK, all of which provide a nice wrapper around the File REST protocol in the scripting/programming language of your choice. 

We expect most uses of Azure Files will want to work with their Azure file share over the SMB protocol, as this allows them to use the existing applications and tools they expect to be able to use, but there are several reasons why it is advantageous to use the File REST API rather than SMB, such as:

- You need to make a quick change to your Azure file share from on-the-go, such as from a laptop without SMB access, tablet, or mobile device.
- You need to execute a script or application from a client which cannot mount an SMB share, such as on-premises clients, which do not have port 445 unblocked.
- You are taking advantage of serverless resources, such as [Azure Functions](../../azure-functions/functions-overview.md). 

The following examples show how to use the Azure portal to manipulate your Azure file share with the File REST protocol. 

Now that you have created an Azure file share, you can mount the file share with SMB on [Windows](storage-how-to-use-files-windows.md), [Linux](storage-how-to-use-files-linux.md), or [macOS](storage-how-to-use-files-mac.md). Alternatively, you can work with your Azure file share with the Azure portal. 

#### Create a directory
To create a new directory named *myDirectory* at the root of your Azure file share:

1. On the **File Service** page, select the **myshare** file share. The page for your file share opens.
2. On the menu at the top of the page, select **+ Add directory**. The **New directory** page drops down.
3. Type *myDirectory* and then click **OK**.

#### Upload a file 
To demonstrate uploading a file, you first need to create or select a file to be uploaded. You may do this by whatever means you see fit. Once you've selected the file you would like to upload:

1. Click on the **myDirectory** directory. The **myDirectory** panel opens.
2. In the menu at the top, click **Upload**. The **Upload files** panel opens.  
	![A screenshot of the upload files panel](media/storage-how-to-use-files-portal/upload-file-1.png)

3. Click on the folder icon to open a window to browse your local files. 
4. Select a file and then click **Open**. 
5. In the **Upload files** page, verify the file name and then click **Upload**.
6. When finished, the file should appear in the list on the **myDirectory** page.

#### Download a file
You can download a copy of the file you uploaded by right-clicking on the file. After clicking the download button, the exact experience will depend on the operating system and browser you're using.

## Clean up resources
[!INCLUDE [storage-files-clean-up-portal](../../../includes/storage-files-clean-up-portal.md)]

## Next steps

> [!div class="nextstepaction"]
> [What is Azure Files?](storage-files-introduction.md)
