---
title: Managing Azure file shares with Azure CLI | Microsoft Docs
description: Learn to use the Azure CLI to manage Azure Files.
services: storage
documentationcenter: na
author: wmgries
manager: jeconnoc
editor: 

ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 02/27/2018
ms.author: wgries
---

# Quickstart: Managing Azure file shares using the CLI

[Azure Files](storage-files-introduction.md) is Microsoft's easy to use cloud file system. Azure file shares can be mounted in Windows and Windows Server. This guide walks you through the basics of working with Azure file shares using PowerShell. In this article you learn how to:

> [!div class="checklist"]
> * Create a resource group and a storage account
> * Create an Azure file share 
> * Create a directory
> * Upload a file
> * Download a file
> * Create and use a share snapshot

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you decide to install and use the Azure CLI locally, this guide requires that you are running the Azure CLI version 2.0.4 or later. Run **az --version** to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 


## Create a resource group
A resource group is a logical container into which Azure resources are deployed and managed. If you don't already have an Azure resource group, you can create a new one with the [az group create](/cli/azure/group#create) command. 

The following example creates a resource group named *myResourceGroup* in the *East US* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

## Create a storage account
A storage account is a shared pool of storage in which you can deploy Azure file shares, or other storage resources such as blobs or queues. A storage account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the capacity limits of the storage account.

This example creates a storage account named `mystorageaccount<random number>` and puts the name of that storage account in the variable `$STORAGEACCT`. Storage account names must be unique, using `$RANDOM` to appends a number to the end to make it unique. 

Create a new storage account, within the resource group that you created, using [az storage account create](/cli/azure/storage/account#create). This example creates a storage account named *mystorageaccount* using locally redundant storage. When finished, it displays information about the new storage account in a table format.

```azurecli-interactive 
az storage account create --resource-group myResourceGroup \
    --name mystorageaccount$RANDOM \
    --location eastus \
    --sku Standard_LRS \
	--out table
```

The output should list the name of the storage account. We are using the name of the storage account in the rest of the steps in this article, so create a variable to hold the storage account name. In this example, the storage account name is *mystorageaccount12345*.

```azurecli-interactive
STORAGEACCOUNT=mystorageaccount12345
```

## Get the storage account key
Storage account keys are used to control access to resources in a storage account. They are automatically created when you create a storage account. View the storage account keys using [az storage account keys list](/cli/azure/storage/account/keys#list). This example displays the storage account keys for *mystorageaccount12345* in table format.

```azurecli-interactive
az storage account keys list \
    --resource-group myResourceGroup \
    --account-name $STORAGEACCOUNT \
    --output table
```

We are using the storage account key in the rest of the steps in this article, so create a variable to hold the storage account key. Replace the value of the key with your own value for **key1**. 

```azurecli-interactive
STORAGEKEY=WaAD6NOz/BYR< snip - replace with your own key >Wv1pWjGOG1Q==
```

## Create an Azure file share

Create a file share using [az storage share create](/cli/azure/storage/share#create) command. A storage account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the capacity limits of the storage account. 

Share names need to be all lower case letters, numbers, and single hyphens but cannot start with a hyphen. For complete details about naming file shares and files, see [Naming and Referencing Shares, Directories, Files, and Metadata](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Shares--Directories--Files--and-Metadata).

This example creates a share named *myshare* with a 10 GiB quota. 

```azurecli-interactive
az storage share create --name myshare \
    --quota 10 \
    --account-name $STORAGEACCOUNT \
    --account-key $STORAGEKEY
```

## Create a directory
Create  a new directory named *myDirectory* at the root of your Azure file share, use the [az storage directory create](/cli/azure/storage/directory#az_storage_directory_create) command.

Adding a directory provides a hierarchical structure for managing your file share. You can create multiple levels, but you must ensure that all parent directories exist before creating a subdirectory. For example, for path *myDirectory/mySubDirectory*, you must first create directory *myDirectory*, then create *mySubDirectory*.


This example creates a directory named *myDirectory* in the file share called *myshare*.

```azurecli-interactive
az storage directory create \
   --account-name $STORAGEACCOUNT \
   --account-key $STORAGEKEY \
   --name myDirectory \
   --share-name myshare
```

## Upload a file
Upload a file to the file share using the [az storage file upload](/cli/azure/storage/file#az_storage_file_upload) command. In this example, we create a simple file *sampleUpload.txt* in Cloud Shell and then upload that file to the **myDirectory** directory of the **myshare** file share. 

```azurecli-interactive
date > ~/clouddrive/sampleUpload.txt

az storage file upload \
   --account-name $STORAGEACCOUNT \
   --account-key $STORAGEKEY \
   --share-name "myshare" \
   --source "~/clouddrive/sampleUpload.txt" \
   --path "myDirectory/sampleUpload.txt"
```

Use [az storage file list](/cli/azure/storage/file#az_storage_file_list) to make sure that the file was uploaded to your Azure file share.

```azurecli-interactive
az storage file list \
   --account-name $STORAGEACCOUNT \
   --account-key $STORAGEKEY \
   --share-name "myshare" \
   --path "myDirectory" \
   --output table
```

## Download a file

Use [az storage file download](/cli/azure/storage/file#az_storage_file_download) to download a copy of the file you uploaded to your Cloud Shell.

This example downloads the *sampleUpload.txt* file from your Azure file share to your Cloud Shell as a file named *sampleDownload.txt*.

```azurecli-interactive
az storage file download \
   --account-name $STORAGEACCOUNT \
   --account-key $STORAGEKEY \
   --share-name "myshare" \
   --path "myDirectory/sampleUpload.txt" \
   --dest "~/clouddrive/sampleDownload.txt"
```

Check to see if the file was downloaded.

```azurecli-interactive
dir ~/clouddrive/
```

## Copy files
Copy files from one file share to another file share, using the [az storage file copy](/cli/azure/storage/file/copy). This example creates a second Azure file share named *share2* and a new directory in that share named *myDirectory2*, then copies the file *sampleUpload.txt* as a new file named *sampleCopy.txt*.

Create a share named **share2**.

```azurecli-interactive
az storage share create \
   --account-name $STORAGEACCOUNT \
   --account-key $STORAGEKEY \
   --name "myshare2"
```

Create a directory named **myDirectory2** in **myshare2**.

```azurecli-interactive
az storage directory create \
   --account-name $STORAGEACCOUNT \
   --account-key $STORAGEKEY \
   --share-name "myshare2" \
   --name "myDirectory2"
```

Copy **sampleUpload.txt** to the directory of the new share using the name **sampleCopy.txt**.

```azurecli-interactive
az storage file copy start \
   --account-name $STORAGEACCOUNT \
   --account-key $STORAGEKEY \
   --source-share "myshare" \
   --source-path "myDirectory/sampleUpload.txt" \
   --destination-share "myshare2" \
   --destination-path "myDirectory2/sampleCopy.txt"
```

If you list the files in the new share, you should see your copied file.

```azurecli-interactive
az storage file list \
   --account-name $STORAGEACCOUNT \
   --account-key $STORAGEKEY \
   --share-name "myshare2" \
   --path "myDirectory2" \
   --output table
```

While the `az storage file copy start` command is convenient for small file moves between Azure file shares and Azure Blob storage containers, we recommend AzCopy for larger moves. To learn more about AzCopy, see [AzCopy for Linux](../common/storage-use-azcopy-linux.md) and [AzCopy for Windows](../common/storage-use-azcopy.md). AzCopy must be installed locally; it is not available in Cloud Shell.

## Optional: Use snapshots
A snapshot preserves a point in time copy of an Azure file share. File share snapshots are similar to other technologies you may already be familiar with like: 
- [Volume Shadow Copy Service (VSS)](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee923636) for Windows file systems such as NTFS and ReFS
- [Logical Volume Manager (LVM)](https://en.wikipedia.org/wiki/Logical_Volume_Manager_(Linux)#Basic_functionality) snapshots for Linux systems
- [Apple File System (APFS)](https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/APFS_Guide/Features/Features.html) snapshots for macOS. 

Create a share snapshot by using [az storage share snapshot](/cli/azure/storage/share#az_storage_share_snapshot).

```azurecli-interactive
az storage share snapshot \
    --account-name $STORAGEACCOUNT \
    --account-key $STORAGEKEY \
    --name "myshare" \
	--output table
```

The snapshot will be named something like *2018-02-22T20:02:15.0000000Z* which is based on the date and time of the snapshot. Create a variable to store the name of the snapshot to be used later. Replace the snapshot name in this example with the name of your shapshot, listed in the output of the last command.

```azurecli-interactive
SNAPSHOT=2018-02-22T20:02:15.0000000Z
```

Browse the contents of a share snapshot by passing the variable for the snapshot name to [az storage file list](/cli/azure/storage/file#az_storage_file_list).

```azurecli-interactive
az storage file list \
    --account-name $STORAGEACCOUNT \
    --account-key $STORAGEKEY \
    --share-name "myshare" \
    --snapshot $SNAPSHOT \
    --output table
```

Restore a file using [az storage file copy start](/cli/azure/storage/file/copy#az_storage_file_copy_start).  First, delete the **sampleUpload.txt** file so it can be restored from the snapshot.

```azurecli-interactive
az storage file delete \
    --account-name $STORAGEACCOUNT \
    --account-key $STORAGEKEY \
    --share-name "myshare" \
    --path "myDirectory/sampleUpload.txt"
```	

Build a URI for the source file from the variables we have created.

```azurecli-interactive
URI="http://"$STORAGEACCOUNT".file.core.windows.net/myshare/myDirectory/sampleUpload.txt?sharesnapshot="$SNAPSHOT
```

Restore **sampleUpload.txt** from the share snapshot as **sampleRestored.txt**.

```azurecli-interactive
az storage file copy start \
    --account-name $STORAGEACCOUNT \
    --account-key $STORAGEKEY \
    --source-uri $URI \
    --destination-share "myshare" \
    --destination-path "myDirectory/sampleRestored.txt"
```

Use [az storage file list](/cli/azure/storage/file#az_storage_file_list) to make sure that the file was restored to your file share.

```azurecli-interactive
az storage file list \
   --account-name $STORAGEACCOUNT \
   --account-key $STORAGEKEY \
   --share-name "myshare" \
   --path "myDirectory" \
   --output table
```


## Clean up resources
When you are done, you can use the [az group delete](/cli/azure/group#delete) command to remove the resource group and all related resources. 

```azurecli-interactive 
az group delete --name "myResourceGroup"
```

## Next steps

You can mount the file share with SMB on [Windows](storage-how-to-use-files-windows.md), [Linux](storage-how-to-use-files-linux.md), or [macOS](storage-how-to-use-files-mac.md) operating systems. 