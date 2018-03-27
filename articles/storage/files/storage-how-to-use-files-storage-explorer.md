---
title: Managing Azure file shares Azure Storage Explorer | Microsoft Docs
description: Learn to use Azure Storage Explorer to manage Azure Files.
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
ms.date: 02/27/2018
ms.author: wgries
---

# Quickstart: Managing Azure file shares with Azure Storage Explorer 

[Azure Files](storage-files-introduction.md) is Microsoft's easy-to-use cloud file system. This guide walks you through the basics of working with Azure file shares using [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/). Storage Explorer is a multi platform user interface for managing the contents of your storage accounts. 

This quickstart requires the Azure Storage Explorer to be installed. If you need to install it, visit [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to download it.


In this article you learn how to:

> [!div class="checklist"]
> * Create a resource group and a storage account
> * Create an Azure file share 
> * Create a directory
> * Upload a file
> * Download a file
> * Create and use a share snapshot


If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Login

On first launch, the **Microsoft Azure Storage Explorer - Connect** window is shown. Storage Explorer provides several ways to connect to storage accounts. The following table lists the different ways you can connect:

|Task|Purpose|
|---|---|
|Add an Azure Account | Redirects you to your organizations login page to authenticate you to Azure. |
|Use a connection string or shared access signature URI | Can be used to directly access a container or storage account with a SAS token or a shared connection string. |
|Use a storage account name and key| Use the storage account name and key of your storage account to connect to Azure storage.|

Select **Add an Azure Account** and click **Sign in**. Follow the on-screen prompts to sign into your Azure account.

![Microsoft Azure Storage Explorer - Connect window](./media/storage-how-to-use-files-storage-explorer/connect.png)

When it completes connecting, Azure Storage Explorer loads with the **Explorer** tab shown. This view gives you insight to all of your Azure storage accounts as well as local storage configured through the [Azure Storage Emulator](../common/storage-use-emulator.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json), [Cosmos DB](../../cosmos-db/storage-explorer.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) accounts, or [Azure Stack](../../azure-stack/user/azure-stack-storage-connect-se.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) environments.


## Create a storage account

A storage account is a shared pool of storage in which you can deploy Azure file share, or other storage resources such as blobs or queues. A storage account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the capacity limits of the storage account.

You can't create a storage account in the Storage Explorer. For this example, create a resource group and storage account using the [Azure portal](https://portal.azure.com).

1. In the left menu, click on the **+** to create a resource.
2. Type **Storage account** into the search and select **Storage account - blob, file, table, queue** and then click **Create**.
3. In **Name**, type *mystorageaccount* followed by a few random numbers until you get the green check mark indicating that it is a unique name. A storage account name must be all lower-case and globally unique. Make a note of your storage account name because you will be using it later. 
4. In **Deployment model**, leave the default value of **Resource manager**.
5. In **Account kind**, select **StorageV2**. 
6. In **Performance**, keep the default value of **Standard storage**. Azure Files currently only supports standard storage; even if you select premium storage, your file share is stored on standard storage.
7. In **Replication**, select *Locally-redundant storage (LRS)*. 
8. In **Secure transfer required** we recommend you always select **Enabled**. To learn more about this option, see [Understanding encryption in-transit](../common/storage-require-secure-transfer.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).
9. In **Subscription**, select subscription to create the storage account in. If you only have one subscription, it should be the default.
10. In **Resource group**, select **Create new** and type in *myResourceGroup* as the name.
11. In **Location**, select **East US**.
12 In **Virtual networks**, leave the default option as *Disabled*. 
13. Select **Pin to dashboard** to make the storage account easier to find.
13. When you're finished, click **Create** to start the deployment.

It takes a few moments to deploy the storage account. You can watch the progress from your dashboard.

## Create a file share

Create your first Azure file share within the storage account you created.

1. Expand the storage account you created.
2. Right-click on **File Shares** and select **Create File Share**. 
3. Type a name for the file share and hit **Enter**.

Once the file share has been created, the right pane will open a tab for your file share. 

## Create a directory

Adding a directory provides a hierarchical structure for managing your file share. You can create multiple levels, but you must ensure that all parent directories exist before creating a subdirectory. For example, for path myDirectory/mySubDirectory, you must first create directory *myDirectory*, then create *mySubDirectory*. 

1. On the tab for the file share, on the top menu, click the **+ New Folder** button. The **Create New Directory** page will open. 
2. Type *myDirectory* as the name and then click **OK**. 

The *myDirectory* directory will be listed on the tab for the *myshare* file share.


## Upload a file 

Upload a file from your local machine to the new directory in your file share. You can upload an entire folder or just a single file.

1. In the menu at the top, select **Upload**. This gives you the option to upload a folder or a file.

2. Select **Upload File** and then choose a file from your local machine to upload.

3. In **Upload to a directory** type *myDirectory* and then click **Upload**. 


When finished, the file should appear in the list on the **myDirectory** page.


## Download a file

You can download a copy of a file in your file share by right-clicking on the file and selecting **Download**. Choose where you want to put the file on your local machine and then click **Save**.

You will see the progress of the download in the **Activities** pane at the bottom of the window.


## Optional: Use snapshots

A snapshot preserves a point-in-time copy of an Azure file share. File share snapshots are similar to other technologies you may already be familiar with like:
- [Logical Volume Manager (LVM)](https://en.wikipedia.org/wiki/Logical_Volume_Manager_(Linux)#Basic_functionality) snapshots for Linux systems
- [Apple File System (APFS)](https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/APFS_Guide/Features/Features.html) snapshots for macOS. 
- [Volume Shadow Copy Service (VSS)](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee923636) for Windows file systems such as NTFS and ReFS.

This example will walk you through creating a snapshot, viewing the contents, deleting a file and then restoring the file from the snapshot.

1. Open the tab for the *myshare* file share.
2. In the menu at the top of the tab, click **Create Snapshot**.
3. View the snapshot by clicking on the **... More** button in the menu at the top of the tab and select **View Snapshots for File Share**.
4. The snapshot contents should be the same as the contents of the file share.
5. Go back to the **myshare** file share by clicking on it in the left pane. 
6. Navigate to the file you uploaded, right-click on it and select **Delete**. You can see the progress in the Activities tab at the bottom right.
7. Click on the **... More** button again and select **View Snapshots for File Share** again. 
8. Navigate through the snapshot until you find the file you deleted and select it, then click on the **... More** button and select **Restore Snapshot**. You will get a warning that restoring the file will overwrite the contents of the file share and it cannot be undone. Select **OK**.
9. Go back to your file share and the file should now be back in the file share.



## Clean up resources

When you're done, you can delete the resource group in the [Azure portal](https://portal.azure.com), which deletes the storage account, the Azure file share, and any other resources you deployed inside the resource group.

1. In the left menu, click **Resource groups**.
2. Right-click the *myResourceGroup* and select **Delete resource group**. A page opens, warning you about what resources will be deleted along with the resource group.
3. Type *myResourceGroup* as the name of the resource group and then click **Delete**.


## Next steps

You can mount a file share with SMB on [Windows](storage-how-to-use-files-windows.md), [Linux](storage-how-to-use-files-linux.md), or [macOS](storage-how-to-use-files-mac.md) operating systems.
