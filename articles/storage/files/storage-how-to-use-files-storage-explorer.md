---
title: Manage Azure file shares using Azure Storage Explorer
description: Learn how to use Azure Storage Explorer to manage Azure Files.
services: storage
author: wmgries
ms.service: storage
ms.topic: get-started-article
ms.date: 02/27/2018
ms.author: wgries
ms.component: files
---

# Manage Azure file shares with Azure Storage Explorer 
[Azure Files](storage-files-introduction.md) is the easy-to-use cloud file system from Microsoft. This article walks you through the basics of working with Azure file shares by using [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/). Storage Explorer is a popular client tool that's available for Windows, macOS, and Linux. You can use Storage Explorer to manage Azure file shares and other storage resources.

This quickstart requires Storage Explorer to be installed. To download and install it, go to [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

In this article, you learn how to:

> [!div class="checklist"]
> * Create a resource group and a storage account
> * Create an Azure file share 
> * Create a directory
> * Upload a file
> * Download a file
> * Create and use a share snapshot

If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a storage account
You can't use Storage Explorer to create new resources. For the purposes of this demo, create the storage account in the [Azure portal](https://portal.azure.com/). 

[!INCLUDE [storage-files-create-storage-account-portal](../../../includes/storage-files-create-storage-account-portal.md)]

## Connect Storage Explorer to Azure resources
When you first start Storage Explorer, the **Microsoft Azure Storage Explorer - Connect** window appears. Storage Explorer provides several ways to connect to storage accounts: 

- **Sign in by using your Azure account**: You can sign in by using the user credentials for your organization or your Microsoft account. 
- **Connect to a specific storage account by using a connection string or SAS token**: A connection string is a special string that contains a storage account name and storage account key/SAS token. With the token, Storage Explorer directly accesses the storage account (rather than simply seeing all the storage accounts in an Azure account). To learn more about connection strings, see [Configure Azure storage connection strings](../common/storage-configure-connection-string.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).
- **Connect to a specific storage account by using a storage account name and key**: Use the storage account name and the key for your storage account to connect to Azure storage.

For the purposes of this quickstart, sign in by using your Azure account. Select **Add an Azure Account**, and then select **Sign in**. Follow the prompts to sign in to your Azure account.

![A screenshot of the Microsoft Azure Storage Explorer - Connect window](./media/storage-how-to-use-files-storage-explorer/connect-to-azure-storage-1.png)

### Create a file share
To create your first Azure file share in the *storageacct<random number>*  storage account:

1. Expand the storage account that you created.
2. Right-click **File Shares**, and then select **Create File Share**.  
    ![A screenshot of the file shares folder and context menu in context](media/storage-how-to-use-files-storage-explorer/create-file-share-1.png)

3. For the file share, enter *myshare*, and then press Enter.

> [!IMPORTANT]  
> Share names can contain only lowercase letters, numbers, and single hyphens (but they can't start with a hyphen). For complete details about naming file shares and files, see [Naming and referencing shares, directories, files, and metadata](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Shares--Directories--Files--and-Metadata).

After the file share is created, a tab for your file share opens in the right pane. 

## Work with the contents of an Azure file share
Now that you have created an Azure file share, you can mount the file share with SMB on [Windows](storage-how-to-use-files-windows.md), [Linux](storage-how-to-use-files-linux.md), or [macOS](storage-how-to-use-files-mac.md). Alternatively, you can work with your Azure file share by using Azure CLI. The advantage of using Azure CLI instead of mounting the file share by using SMB is that all requests that are made with Azure CLI are made by using the File REST API. You can use the File REST API to create, modify, and delete files and directories on clients that don't have SMB access.

### Create a directory
Adding a directory provides a hierarchical structure for managing your file share. You can create multiple levels in your directory. But, you must ensure that parent directories exist before you create subdirectories. For example, for the path myDirectory/mySubDirectory, you must create the directory *myDirectory* first. Then, you can create *mySubDirectory*. 

1. On the tab for the file share, on the top menu, select the **New Folder** button. The **Create New Directory** pane opens.
    ![A screenshot of the New Folder button in context](media/storage-how-to-use-files-storage-explorer/create-directory-1.png)

2. For the directory name, enter *myDirectory*, and then select **OK**. 

The *myDirectory* directory is listed on the tab for the *myshare* file share.

### Upload a file 
You can upload a file from your local machine to the new directory in your file share. You can upload an entire folder or a single file.

1. In the top menu, select **Upload**. This gives you the option to upload a folder or a file.
2. Select **Upload File**, and then select a file to upload from your local machine.
3. In **Upload to a directory**, enter *myDirectory*, and then select **Upload**. 

When you are finished, the file appears in the list in the *myDirectory* pane.

### Download a file
To download a copy of a file from your file share, right-click the file, and then select **Download**. Choose where you want to put the file on your local machine, and then select **Save**.

The progress of the download appears in the **Activities** pane at the bottom of the window.

## Create and modify share snapshots
A snapshot preserves a point-in-time copy of an Azure file share. File share snapshots are similar to other technologies that you might already be familiar with:
- [Volume Shadow Copy Service (VSS)](https://docs.microsoft.com/windows/desktop/VSS/volume-shadow-copy-service-portal) for Windows file systems, such as NTFS and ReFS
- [Logical Volume Manager (LVM)](https://en.wikipedia.org/wiki/Logical_Volume_Manager_(Linux)#Basic_functionality) snapshots for Linux systems
- [Apple File System (APFS)](https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/APFS_Guide/Features/Features.html) snapshots for macOS

To create a share snapshot:

1. Select the tab for the *myshare* file share.
2. In the top menu, select **Create Snapshot**. (You might need to first select **More** to see this option, depending on the window dimensions of Storage Explorer.)  
    ![A screenshot of the Create Snapshot button in context](media/storage-how-to-use-files-storage-explorer/create-share-snapshot-1.png)

### List and browse share snapshots
After the snapshot is created, to list the snapshots for the share, select **View Snapshots for File Share**. (You might need to first select **More** to see this option, depending on the window dimensions of Storage Explorer.) To browse a share snapshot, double-click the snapshot.

![A screenshot of the browse snapshots window](media/storage-how-to-use-files-storage-explorer/list-browse-snapshots-1.png)

### Restore from a share snapshot
To demonstrate how to restore a file from a share snapshot, first you need to delete a file from the live Azure file share. Go to the *myDirectory* folder, right-click the file you uploaded, and then select **Delete**. To restore that file from the share snapshot:

1. Select **View Snapshots for File Share**. (You might need to first select **More** to see this option, depending on the window dimensions of Storage Explorer.)
2. In the list of share snapshots, double-click the share snapshot.
3. Browse the snapshot until you find the file that you deleted. Select the file share, and then select **Restore Snapshot**. (You might need to first select **More** to see this option, depending on the window dimensions of Storage Explorer.) A window opens and displays a warning that restoring the file will overwrite the contents of the file share, and that it can't be undone. Select **OK**.
4. The file should now be in its original place under the live Azure file share.

### Delete a share snapshot
To delete a share snapshot, go to the [list of share snapshots](#list-and-browse-share-snapshots). Right-click the share snapshot that you want to delete, and then select **Delete**.

## Clean up resources
You can't use Storage Explorer to remove resources. To clean up from this quickstart, you can use the [Azure portal](https://portal.azure.com/). 

[!INCLUDE [storage-files-clean-up-portal](../../../includes/storage-files-clean-up-portal.md)]

## Next steps
- [Manage file shares with the Azure portal](storage-how-to-use-files-portal.md)
- [Manage file shares with Azure PowerShell](storage-how-to-use-files-powershell.md)
- [Manage file shares with Azure CLI](storage-how-to-use-files-cli.md)
- [Plan for an Azure Files deployment](storage-files-planning.md)