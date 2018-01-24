---
title: Quickstart with Files using CLI in Azure | Microsoft Docs
description: Use the Azure CLI to work with files in Azure.
services: storage
documentationcenter: na
author: cynthn
manager: jeconnoc
editor: tysonn

ms.assetid: 
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 01/24/2018
ms.author: cynthn
---

# Quickstart with files using CLI for Azure Storage Services

This quickstart walks you through the basics of working with Azure Files shares. Learn how to create a share, a directory within the share, upload files, and copy files between shares.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you decide to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run **az --version** to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Create a resource group

First, create a resource group using the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

## Create a storage account

You need to create a storage account, within the resource group that you created, that will be used to host the file share. Create a storage account using [az storage account create](/cli/azure/storage/account#create). This example creates a storage account named *mystorageaccount* using locally redundant storage.

```azurecli-interactive 
az storage account create --resource-group myResourceGroup \
    --name mystorageaccount \
    --location eastus \
    --sku Standard_LRS
```

## Get the storage account keys.

Storage account keys are used to control access to resources in a storage account. They are automatically created when you create a storage account. View the storage account keys using [az storage account keys list](/cli/azure/storage/account/keys#list). This example displays the storage account keys for *mystorageaccount* in table format.

```azurecli-interactive 
az storage account keys list --resource-group myResourceGroup \
    --account-name mystorageaccount \
	--output table
```

Copy *key 1* where you can get to it easily to use in next set of steps.

## Create a file share.

Now you can create your first file share. An Azure File share is an SMB 3.0 file share in Azure. An Azure storage account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the capacity limits of the storage account. Share names need to be all lower case letters, numbers, and single hyphens but cannot start with a hyphen.

Create file shares using [az storage share create](/cli/azure/storage/share#create). This example creates a share named *myshare* with a 10-GB quota. The quota is in gigabytes (GB). Be sure to enter your own storage account key in the last line.

```azurecli-interactive
az storage share create --name myshare \
    --quota 10 \
    --account-name mystorageaccount \
    --account-key WaAD6NOz/BYR< snip - put your own key here >Wv1pWjGOG1Q==
```

## Create directory

Adding a directory provides a hierarchical structure for managing your file share. You can create multiple levels, but you must ensure that all parent directories exist before creating a subdirectory. For example, for path myDirectory/mySubDirectory, you must first create directory myDirectory, then create mySubDirectory.

This example creates a directory named *myDirectory* in the file share called *myshare*.

```azurecli-interactive
az storage directory create \
   --account-name mystorageaccount \
   --account-key WaAD6NOz/BYR< snip - put your own key here >Wv1pWjGOG1Q== \
   --name myDirectory \
   --share-name myshare
```

## Upload a file

You can upload a file from your local machine to your Azure file share. Because you will be working with local files, you cannot use Cloud Shell for this example.

To upload a file,  use [az storage file upload](/cli/azure/storage/file#az_storage_file_upload). This example uploads a file from ~/temp/myfile.txt to *myDirectory* directory in the *myshare* file share. The **--source** argument specifies the existing local file to upload.

```azurecli
az storage file upload     \
    --account-name mystorageaccount \
    --account-key WaAD6NOz/BYR< snip - put your own key here >Wv1pWjGOG1Q== \
	--share-name myshare/myDirectory \
	--source ~/temp/samplefile.txt
```


## List files

To list the files and directories in a share, use [az storage file list](/cli/azure/storage/file#az_storage_file_list). This example lists the files in *myshare/myDirectory* and returns the name of the file that you uploaded.


```azurecli-interactive
az storage file list \
    --account-name mystorageaccount \
	--account-key WaAD6NOz/BYR< snip - put your own key here >Wv1pWjGOG1Q== \
	--share-name myshare/myDirectory \
	--output table
```


## Copy files

Now, create a new share and copy the file you uploaded over to this new share. To copy files, use [az storage file copy](/cli/azure/storage/file/copy). You can copy a file to another file, a file to a blob, or a blob to a file.  This example creates a second share named *myshare2* and copies *samplefile.txt* to the root of the new share. 

```azurecli
az storage share create --name myshare2 \
    --quota 10 \
    --account-name mystorageaccount \
    --account-key WaAD6NOz/BYR< snip - put your own key here >Wv1pWjGOG1Q==
	
az storage file copy start \
    --account-name mystorageaccount \
    --account-key WaAD6NOz/BYR< snip - put your own key here >Wv1pWjGOG1Q== \
    --source-share myshare \
	--source-path myDirectory/samplefile.txt \
    --destination-share myshare2 \
	--destination-path samplefile.txt
```

Now, if you list the files in the new share, you should see your file.

```azurecli-interactive
az storage file list \
    --account-name mystorageaccount \
	--account-key WaAD6NOz/BYR< snip - put your own key here >Wv1pWjGOG1Q== \
	--share-name myshare2 \
	--output table
```


## Clean up resources

When you are done, you can use [az group delete](/cli/azure/group#delete) to remove the resource group and all related resources. 

```azurecli-interactive 
az group delete --name myResourceGroup
```


## Next steps
In this quickstart, you've learned to create a share, a directory within the share, upload files, and copy files between shares.

Advance to the next article to learn more
> [!div class="nextstepaction"]
> [Next steps button](storage-sync-files-server-endpoint.md)

