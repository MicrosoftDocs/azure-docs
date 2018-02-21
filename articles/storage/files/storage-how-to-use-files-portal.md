---
title: Managing Azure file shares in the portal | Microsoft Docs
description: Learn to use the Azure portal to manage Azure Files.
services: storage
documentationcenter: ''
author: wmgries
manager: jeconnoc
editor: 

ms.assetid: 
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 02/21/2018
ms.author: wgries
---

# Managing Azure file shares with the Azure portal 

[Azure Files](storage-files-introduction.md) is Microsoft's easy to use cloud file system. Azure File shares can be mounted in Windows and Windows Server. This guide walks you through the basics of working with Azure file shares using the [Azure portal](https://portal.azure.com). Learn how to:
- Create a resource group and a storage account
- Create an Azure file share within the storage
- Create a directory within the share, and upload and download files to it


If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Log in to Azure

Log in to the Azure portal at http://portal.azure.com.

## Create a storage account
A storage account is a shared pool of storage in which you can deploy Azure file share, or other storage resources such as blobs or queues. A storage account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the capacity limits of the storage account.

1. In the left menu, click on the **+** to create a resource.
2. Type **Storage account** into the search, select ** 
Storage account - blob, file, table, queue and then click **Create**.
3. In **Name**, type *mystorageaccount* followed by a few random numbers until you get the green check mark indicating that it is a unique name. A storage account name must be all lower-case and globally unique. Make a note of your storage account name because you will be using it later. 
4. In **Deployment model**, leave the default value of **Resource manager**.
5. In **Account kind**, select **StorageV2 (general purpose v2)**. 
6. In **Performance**, keep the default value of **Standard storage**. Azure Files currently only supports standard storage; even if you select premium storage, your file share is stored on standard storage.
7. In **Replication**, select *Locally-redundant storage (LRS)*. 
8. In **Secure transfer required** we recommend you always select *Enabled*. To learn more about this option, see [Understanding encryption in-transit](../common/storage-require-secure-transfer.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).
9. In **Subscription**, select subscription to create the storage account in. If you only have one subscription, it should be the default.
10. In **Resource group**, select *Create new* and type in *myResourceGroup* as the name.
11. In **Location**, select *East US*.
12 In **Virtual networks**, leave the default option as *Disabled*. 
13. Select **Pin to dashboard** to make the storage account easier to find.
13. When you're finished, click **Create** to start the deployment.

It takes a few moments to deploy the storage account. You can watch the progress from your dashboard.

## Create a file share

Create your first Azure file share within the storage account you created.

1. Select the new storage account from your dashboard.
2. On the storage account page, in the **Services** section, select **Files**.
	![A screenshot of the services section of the storage account; select the Files service](media/storage-how-to-use-files-portal/create-file-share-2.png)
3. On the menu at the top of the **File service** page, click **+ File share**. The **New file share** page drops down.
4. In **Name** type *myshare*.
5. In **Quota**, leave the field blank to set the quota to the [maximum size of a file share](storage-files-scale-targets.md).
6. When you're done, click **OK** to create the Azure file share.

When finished, the portal displays the **File service** page and lists your new file share.

## Create a directory

Create a directory within your file share. Adding a directory provides a hierarchical structure for managing your file share. You can create multiple levels, but you must ensure that all parent directories exist before creating a subdirectory. For example, for path myDirectory/mySubDirectory, you must first create directory *myDirectory*, then create *mySubDirectory*. 

1. On the **File Service** page, select the *myshare* file share. The page for your file share opens.
2. On the menu at the top of the page, select **+ Add directory**. The **New directory** page drops down.
3. Type *myDirectory* and then click **OK**.

When finished, the *myDirectory* directory will be listed on the page for the *myshare* file share.


### Upload a file 

Upload a file from your local machine to the new directory in your file share.

1. Click on the *myDirectory* directory. The *myDirecotry* page opens.
2. In the menu at the top, click **Upload**. The **Upload files** page opens.
3. Click on the folder icon to open a window to browse your local files. 
4. Select a file and then click **Open**. 
5. In the **Upload files** page, verify the file name and then click **Upload**.
6. WHen finished, the file should appear in the list on the **myDirectory** page.


## Download a file
You can download a copy of a file in your file share by right-clicking on the file and selecting **Download**. The download experience depends on the operating system and browser you're using.

![A screenshot of the download button in the context menu for a file](media/storage-how-to-use-files-portal/download-file-1.png) 


## Optional: Mount the file share

You can mount the file share with SMB on [Windows](storage-how-to-use-files-windows.md), [Linux](storage-how-to-use-files-linux.md), or [macOS](storage-how-to-use-files-mac.md).

## Clean up resources
When you're done, you can delete the resource group, which deletes the storage account, Azure file share inside the storage account, and any other resources you may have deployed inside the resource group.

1. In the left menu, click **Resource groups**
2. Right-click the resource group and select **Delete resource group*. A page opens, warning you about what resources will be deleted along with the resource group.
3. Type the name of the resource group and then click **Delete**.


## Next steps
- [Managing file shares with the Azure PowerShell](storage-how-to-use-files-powershell.md)
- [Managing file shares with Azure CLI](storage-quickstart-files-cli.md)
- [Planning for an Azure Files deployment](storage-files-planning.md)