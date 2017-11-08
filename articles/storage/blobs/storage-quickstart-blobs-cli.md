---
title: Azure Quickstart - Transfer objects to/from Azure Blob storage using the Azure CLI | Microsoft Docs
description: Quickly learn to transfer objects to/from Azure Blob storage using the Azure CLI
services: storage
documentationcenter: na
author: mmacy
manager: timlt
editor: tysonn

ms.assetid:
ms.custom: mvc
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 07/19/2017
ms.author: marsma
---

# Transfer objects to/from Azure Blob storage using the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This Quickstart details using the Azure CLI to upload and download data to and from Azure Blob storage.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

[!INCLUDE [storage-quickstart-tutorial-intro-include-cli](../../../includes/storage-quickstart-tutorial-intro-include-cli.md)]

## Create a container

Blobs are always uploaded into a container. Containers allow you to organize groups of blobs like you organize files in directories on your computer.

Create a container for storing blobs with the [az storage container create](/cli/azure/storage/container#create) command.

```azurecli-interactive
az storage container create --name mystoragecontainer
```

## Upload a blob

Blob storage supports block blobs, append blobs, and page blobs. Most files stored in Blob storage are stored as block blobs. Append blobs are used when data must be added to an existing blob without modifying its existing contents, such as for logging. Page blobs back the VHD files of IaaS virtual machines.

In this example, we upload a blob to the container we created in the last step with the [az storage blob upload](/cli/azure/storage/blob#upload) command.

```azurecli-interactive
az storage blob upload \
    --container-name mystoragecontainer \
    --name blobName \
    --file ~/path/to/local/file
```

This operation creates the blob if it doesn't already exist, and overwrites it if it does. Upload as many files as you like before continuing.

## List the blobs in a container

List the blobs in the container with the [az storage blob list](/cli/azure/storage/blob#list) command.

```azurecli-interactive
az storage blob list \
    --container-name mystoragecontainer \
    --output table
```

## Download a blob

Use the [az storage blob download](/cli/azure/storage/blob#download) command to download a blob you uploaded earlier.

```azurecli-interactive
az storage blob download \
    --container-name mystoragecontainer \
    --name blobName \
    --file ~/destination/path/for/file
```

## Data transfer with AzCopy

The [AzCopy](../common/storage-use-azcopy-linux.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) utility is another option for high-performance scriptable data transfer for Azure Storage. You can use AzCopy to transfer data to and from Blob, File, and Table storage.

As a quick example, here is the AzCopy command for uploading a file called *myfile.txt* to the *mystoragecontainer* container.

```bash
azcopy \
    --source /mnt/myfiles \
    --destination https://mystorageaccount.blob.core.windows.net/mystoragecontainer \
    --dest-key <storage-account-access-key> \
    --include "myfile.txt"
```

## Clean up resources

If you no longer need any of the resources in your resource group, including the storage account you created in this Quickstart, delete the resource group with the [az group delete](/cli/azure/group#delete) command.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

In this Quickstart, you learned how to transfer files between local disk and a container in Azure Blob storage. To learn more about working with blobs in Azure Storage, continue to the tutorial for working with Azure Blob storage.

> [!div class="nextstepaction"]
> [How to: Blob storage operations with the Azure CLI](storage-how-to-use-blobs-cli.md)
