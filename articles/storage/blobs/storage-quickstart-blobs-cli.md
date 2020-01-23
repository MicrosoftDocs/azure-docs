---
title: Quickstart - Create a blob with Azure CLI
titleSuffix: Azure Storage
description: In this quickstart, you learn how to use the Azure CLI upload a blob to Azure Storage, download a blob, and list the blobs in a container.
services: storage
author: tamram

ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 12/04/2019
ms.author: tamram
---

# Quickstart: Create, download, and list blobs with Azure CLI

The Azure CLI is Azure's command-line experience for managing Azure resources. You can use it in your browser with Azure Cloud Shell. You can also install it on macOS, Linux, or Windows and run it from the command line. In this quickstart, you learn to use the Azure CLI to upload and download data to and from Azure Blob storage.

[!INCLUDE [storage-multi-protocol-access-preview](../../../includes/storage-multi-protocol-access-preview.md)]

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to determine your version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

[!INCLUDE [storage-quickstart-tutorial-intro-include-cli](../../../includes/storage-quickstart-tutorial-intro-include-cli.md)]

## Create a container

Blobs are always uploaded into a container. You can organize groups of blobs similar to the way you organize your files on your computer in folders.

Create a container for storing blobs with the [az storage container create](/cli/azure/storage/container) command.

```azurecli-interactive
az storage container create --name sample-container
```

## Upload a blob

Blob storage supports block blobs, append blobs, and page blobs. The examples in this quickstart show how to work with block blobs.

First, create a file to upload to a block blob. If you're using Azure Cloud Shell, use the following command to create a file:

```bash
vi helloworld
```

When the file opens, press **insert**. Type *Hello world*, then press **Esc**. Next, type *:x*, then press **Enter**.

In this example, you upload a blob to the container you created in the last step using the [az storage blob upload](/cli/azure/storage/blob) command. It's not necessary to specify a file path since the file was created at the root directory:

```azurecli-interactive
az storage blob upload \
    --container-name sample-container \
    --name helloworld \
    --file helloworld
```

This operation creates the blob if it doesn't already exist, and overwrites it if it does. Upload as many files as you like before continuing.

To upload multiple files at the same time, you can use the [az storage blob upload-batch](/cli/azure/storage/blob) command.

## List the blobs in a container

List the blobs in the container with the [az storage blob list](/cli/azure/storage/blob) command.

```azurecli-interactive
az storage blob list \
    --container-name sample-container \
    --output table
```

## Download a blob

Use the [az storage blob download](/cli/azure/storage/blob) command to download the blob you uploaded earlier.

```azurecli-interactive
az storage blob download \
    --container-name sample-container \
    --name helloworld \
    --file ~/destination/path/for/file
```

## Data transfer with AzCopy

The [AzCopy](../common/storage-use-azcopy-linux.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) utility is another option for high-performance scriptable data transfer for Azure Storage. You can use AzCopy to transfer data to and from Blob, File, and Table storage.

The following example uses AzCopy to upload a file called *myfile.txt* to the *sample-container* container. Remember to replace placeholder values in angle brackets with your own values:

```bash
azcopy \
    --source /mnt/myfiles \
    --destination https://<account-name>.blob.core.windows.net/sample-container \
    --dest-key <account-key> \
    --include "myfile.txt"
```

## Clean up resources

If you no longer need any of the resources in your resource group, including the storage account you created in this quickstart, delete the resource group with the [az group delete](/cli/azure/group) command. Remember to replace placeholder values in angle brackets with your own values:

```azurecli-interactive
az group delete --name <resource-group-name>
```

## Next steps

In this quickstart, you learned how to transfer files between a local file system and a container in Azure Blob storage. To learn more about working with blobs in Azure Storage, continue to the tutorial for working with Azure Blob storage.

> [!div class="nextstepaction"]
> [How to: Blob storage operations with the Azure CLI](storage-how-to-use-blobs-cli.md)
