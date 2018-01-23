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
ms.date: 01/23/2018
ms.author: cynthn
---

# Quickstart with files using CLI for Azure Storage Services
Introductory paragraph

Install CLI
Get CLI context
Create share
Create directory
Upload file
List files
Copy files

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 

az group create --name myResourceGroup --location eastus

```

## Create a storage account

Create an Azure storage account with [az storage account create](/cli/azure/storage/account#create) to store the actual files.

To create a storage account named mystorageaccount by using the Standard_LRS storage SKU, use the following example:

```azurecli-interactive 
az storage account create --resource-group myResourceGroup \
    --name mystorageaccount \
    --location westus \
    --sku Standard_LRS
```

## Get the storage account keys.

View the storage account keys with the [az storage account keys list](/cli/azure/storage/account/keys#list). The storage account keys for the named `mystorageaccount` are listed in the following example:

```azurecli-interactive 
az storage account keys list --resource-group myResourceGroup \
    --account-name mystorageaccount
```

To extract a single key, use the `--query` flag. The following example extracts the first key (`[0]`):

```azurecli
az storage account keys list --resource-group myResourceGroup \
    --account-name mystorageaccount \
    --query '[0].{Key:value}' --output tsv
```

## Create a file share.

The File storage share contains the SMB share with [az storage share create](/cli/azure/storage/share#create). The quota is always expressed in gigabytes (GB). Pass in one of the keys from the preceding `az storage account keys list` command. Create a share named mystorageshare with a 10-GB quota by using the following example:

```azurecli
az storage share create --name mystorageshare \
    --quota 10 \
    --account-name mystorageaccount \
    --account-key nPOgPR<--snip-->4Q==
```

## Create directory


## Upload a file

To upload a file,  use [az storage file upload](/cli/azure/storage/file#az_storage_file_upload).

To upload a batch of files, use [az storage file upload-batch](/cli/azure/storage/file#az_storage_file_upload-batch)

## List files

To list all files, use [az storage file list](/cli/azure/storage/file#az_storage_file_list).


## Copy files

To copy files, use [az storage file copy](/cli/azure/storage/file/copy).

## Clean up resourcesT

When no longer needed, you can use [az group delete](/cli/azure/group#delete) to remove the resource group and all related resources. 

```azurecli-interactive 
az group delete --name myResourceGroup
```


## Next steps
In this quickstart, you've learned to create a storage account, create a share, create a directory, upload, and copy files.

Advance to the next article to learn more
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)

