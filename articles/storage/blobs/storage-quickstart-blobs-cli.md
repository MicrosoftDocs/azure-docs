---
title: Azure Quickstart - Create a blob in object storage using Azure CLI | Microsoft Docs
description: In this quickstart, you use the Azure CLI  in object (Blob) storage. Then you use the CLI to upload a blob to Azure Storage, download a blob, and list the blobs in a container.
services: storage
author: tamram

ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 11/14/2018
ms.author: tamram
ms.reviewer: seguler
---

# Quickstart: Upload, download, and list blobs using the Azure CLI

The Azure CLI is Azure's command-line experience for managing Azure resources. You can use it in your browser with Azure Cloud Shell. You can also install it on macOS, Linux, or Windows and run it from the command line. In this quickstart, you learn to use the Azure CLI to upload and download data to and from Azure Blob storage.

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to determine your version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

[!INCLUDE [storage-quickstart-tutorial-intro-include-cli](../../../includes/storage-quickstart-tutorial-intro-include-cli.md)]

## Create a container

Blobs are always uploaded into a container. You can organize groups of blobs similar to the way you organize your files on your computer in folders.

Create a container for storing blobs with the [az storage container create](/cli/azure/storage/container) command.

```azurecli-interactive
az storage container create --name mystoragecontainer
```

## Upload a blob

Blob storage supports block blobs, append blobs, and page blobs. Most files stored in Blob storage are stored as block blobs. Append blobs are used when data must be added to an existing blob without modifying its existing contents, such as for logging. Page blobs back the VHD files of IaaS virtual machines.

First, create a file to upload to a blob.
If you're using the Azure cloud shell, use the following in order to create a file:
`vi helloworld` when the file opens, press **insert**, type "Hello world" and then press **Esc** and enter `:x` and press **Enter**.

In this example, you upload a blob to the container you created in the last step using the [az storage blob upload](/cli/azure/storage/blob) command.

```azurecli-interactive
az storage blob upload \
    --container-name mystoragecontainer \
    --name blobName \
    --file ~/path/to/local/file
```

If you used the previously described method to create a file in your Azure Cloud Shell, you can use this CLI command instead (note that you didn't need to specify a path since the file was created at the base directory, normally you'd need to specify a path):

```azurecli-interactive
az storage blob upload \
    --container-name mystoragecontainer \
    --name helloworld \
    --file helloworld
```

This operation creates the blob if it doesn't already exist, and overwrites it if it does. Upload as many files as you like before continuing.

To upload multiple files at the same time, you can use the [az storage blob upload-batch](/cli/azure/storage/blob) command.

## List the blobs in a container

List the blobs in the container with the [az storage blob list](/cli/azure/storage/blob) command.

```azurecli-interactive
az storage blob list \
    --container-name mystoragecontainer \
    --output table
```

## Download a blob

Use the [az storage blob download](/cli/azure/storage/blob) command to download the blob you uploaded earlier.

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

If you no longer need any of the resources in your resource group, including the storage account you created in this Quickstart, delete the resource group with the [az group delete](/cli/azure/group) command.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

In this Quickstart, you learned how to transfer files between local disk and a container in Azure Blob storage. To learn more about working with blobs in Azure Storage, continue to the tutorial for working with Azure Blob storage.

> [!div class="nextstepaction"]
> [How to: Blob storage operations with the Azure CLI](storage-how-to-use-blobs-cli.md)
