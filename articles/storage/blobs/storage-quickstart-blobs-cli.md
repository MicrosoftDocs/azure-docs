---
title: Quickstart - Create a blob with Azure CLI
titleSuffix: Azure Storage
description: In this quickstart, you learn how to use the Azure CLI upload a blob to Azure Storage, download a blob, and list the blobs in a container.
services: storage
author: tamram

ms.service: storage
ms.subservice: blobs
ms.topic: quickstart
ms.date: 06/04/2020
ms.author: tamram
---

# Quickstart: Create, download, and list blobs with Azure CLI

The Azure CLI is Azure's command-line experience for managing Azure resources. You can use it in your browser with Azure Cloud Shell. You can also install it on macOS, Linux, or Windows and run it from the command line. In this quickstart, you learn to use the Azure CLI to upload and download data to and from Azure Blob storage.

[!INCLUDE [storage-multi-protocol-access-preview](../../../includes/storage-multi-protocol-access-preview.md)]

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Install the Azure CLI locally

If you choose to install and use the Azure CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.46 or later. Run `az --version` to determine your version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

If you are running the Azure CLI locally, you must log in and authenticate. This step is not necessary if you are using Azure Cloud Shell. To log in to Azure CLI, run `az login` and authenticate in the browser window:

```azurecli
az login
```

For more information about authentication` with Azure CLI, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

## Authorize access to Blob storage

You can authorize access to Blob storage from the Azure CLI either with Azure AD credentials or by using the storage account access key. Using Azure AD credentials is recommended. This article shows how to authorize Blob storage operations using Azure AD.

Azure CLI commands for data operations against Blob storage support the `--auth-mode` parameter, which enables you to specify how to authorize a given operation. Set the `--auth-mode` parameter to `login` to authorize with Azure AD credentials. For more information, see [Authorize access to blob or queue data with Azure CLI](../common/authorize-data-operations-cli.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

Only Blob storage data operations support the `--auth-mode` parameter. Management operations, such as creating a resource group or storage account, automatically use Azure AD credentials for authorization.

## Create a resource group

Create an Azure resource group with the [az group create](/cli/azure/group) command. A resource group is a logical container into which Azure resources are deployed and managed.

Remember to replace placeholder values in angle brackets with your own values:

```azurecli
az group create \
    --name <resource-group> \
    --location <location>
```

## Create a storage account

Create a general-purpose storage account with the [az storage account create](/cli/azure/storage/account) command. The general-purpose storage account can be used for all four services: blobs, files, tables, and queues.

Remember to replace placeholder values in angle brackets with your own values:

```azurecli
az storage account create \
    --name <storage-account> \
    --resource-group <resource-group> \
    --location <location> \
    --sku Standard_ZRS \
    --encryption-services blob
```

## Create a container

Blobs are always uploaded into a container. You can organize groups of blobs in containers similar to the way you organize your files on your computer in folders. Create a container for storing blobs with the [az storage container create](/cli/azure/storage/container) command. 

The following example uses your Azure AD account to authorize the operation to create the container. Before you create the container, assign the [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) role to yourself. Even if you are the account owner, you need explicit permissions to perform data operations against the storage account. For more information about assigning RBAC roles, see [Use Azure CLI to assign an RBAC role for access](../common/storage-auth-aad-rbac-cli.md?toc=/azure/storage/blobs/toc.json).  

You can also use the storage account key to authorize the operation to create the container. For more information about authorizing data operations with Azure CLI, see [Authorize access to blob or queue data with Azure CLI](../common/authorize-data-operations-cli.md?toc=/azure/storage/blobs/toc.json).

Remember to replace placeholder values in angle brackets with your own values:

```azurecli
az storage container create \
    --account-name <storage-account> \
    --name <container> \
    --auth-mode login
```

## Upload a blob

Blob storage supports block blobs, append blobs, and page blobs. The examples in this quickstart show how to work with block blobs.

First, create a file to upload to a block blob. If you're using Azure Cloud Shell, use the following command to create a file:

```bash
vi helloworld
```

When the file opens, press **insert**. Type *Hello world*, then press **Esc**. Next, type *:x*, then press **Enter**.

In this example, you upload a blob to the container you created in the last step using the [az storage blob upload](/cli/azure/storage/blob) command. It's not necessary to specify a file path since the file was created at the root directory. Remember to replace placeholder values in angle brackets with your own values:

```azurecli
az storage blob upload \
    --account-name <storage-account> \
    --container-name <container> \
    --name helloworld \
    --file helloworld \
    --auth-mode login
```

This operation creates the blob if it doesn't already exist, and overwrites it if it does. Upload as many files as you like before continuing.

To upload multiple files at the same time, you can use the [az storage blob upload-batch](/cli/azure/storage/blob) command.

## List the blobs in a container

List the blobs in the container with the [az storage blob list](/cli/azure/storage/blob) command. Remember to replace placeholder values in angle brackets with your own values:

```azurecli
az storage blob list \
    --account-name <storage-account> \
    --container-name <container> \
    --output table \
    --auth-mode login
```

## Download a blob

Use the [az storage blob download](/cli/azure/storage/blob) command to download the blob you uploaded earlier. Remember to replace placeholder values in angle brackets with your own values:

```azurecli
az storage blob download \
    --account-name <storage-account> \
    --container-name <container> \
    --name helloworld \
    --file ~/destination/path/for/file \
    --auth-mode login
```

## Data transfer with AzCopy

The AzCopy command-line utility offers high-performance, scriptable data transfer for Azure Storage. You can use AzCopy to transfer data to and from Blob storage and Azure Files. For more information about AzCopy v10, the latest version of AzCopy, see [Get started with AzCopy](../common/storage-use-azcopy-v10.md). To learn about using AzCopy v10 with Blob storage, see [Transfer data with AzCopy and Blob storage](../common/storage-use-azcopy-blobs.md).

The following example uses AzCopy to upload a local file to a blob. Remember to replace the sample values with your own values:

```bash
azcopy login
azcopy copy 'C:\myDirectory\myTextFile.txt' 'https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt'
```

## Clean up resources

If you want to delete the resources you created as part of this quickstart, including the storage account, delete the resource group by using the [az group delete](/cli/azure/group) command. Remember to replace placeholder values in angle brackets with your own values:

```azurecli
az group delete \
    --name <resource-group> \
    --no-wait
```

## Next steps

In this quickstart, you learned how to transfer files between a local file system and a container in Azure Blob storage. To learn more about working with Blob storage by using Azure CLI, explore Azure CLI samples for Blob storage.

> [!div class="nextstepaction"]
> [Azure CLI samples for Blob storage](/azure/storage/blobs/storage-samples-blobs-cli?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
