---
title: Perform operations on Azure Blob storage (object storage) with the Azure CLI | Microsoft Docs
description: Learn how to upload and download blobs in Azure Blob storage, as well as construct a shared access signature (SAS) to manage access to a blob in your storage account.
services: storage
documentationcenter: na
author: mmacy
manager: timlt
editor: tysonn

ms.assetid:
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 06/15/2017
ms.author: marsma
---

# Perform Blob storage operations with the Azure CLI

Azure Blob storage is a service for storing large amounts of unstructured object data, such as text or binary data, that can be accessed from anywhere in the world via HTTP or HTTPS. This tutorial covers basic operations in Azure Blob storage such as uploading, downloading, and deleting blobs. You learn how to:

> [!div class="checklist"]
> * Create a container
> * Upload a file (blob) to a container
> * List the blobs in a container
> * Download a blob from a container
> * Copy a blob between storage accounts
> * Delete a blob
> * Display and modify blob properties and metadata
> * Manage security with a shared access signature (SAS)

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [storage-quickstart-tutorial-intro-include-cli](../../../includes/storage-quickstart-tutorial-intro-include-cli.md)]

## Create a container

Containers are similar to directories on your computer, allowing you to organize groups of blobs in a container like you organize files in a directory. A storage account can have any number of containers. You can store up to 500 TB of blob data in a container, which is the maximum amount of data in a storage account.

Create a container for storing blobs with the [az storage container create](/cli/azure/storage/container#create) command.

```azurecli-interactive
az storage container create --name mystoragecontainer
```

Container names must start with a letter or number, and can contain only letters, numbers, and the hyphen character (-). For more rules about naming blobs and containers, see [Naming and referencing containers, blobs, and metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

## Enable public read access for container

A newly created container is private by default. That is, nobody can access the container without a [shared access signature](#create-a-shared-access-signature-sas) or the access keys for the storage account. Using the Azure CLI, you can modify this behavior by setting container permissions to one of three levels:

| | |
|---|---|
| `--public-access off` | (Default) No public read access |
| `--public-access blob` | Public read access to blobs only |
| `--public-access container` | Public read access to blobs, can list blobs in container |

When you set public access to `blob` or `container`, you enable read-only access for anyone on the Internet. For example, if you want to display images stored as blobs on your website, you need to enable public read access. If you want to enable read/write access, you must instead use a [shared access signature (SAS)](#create-a-shared-access-signature-sas).

Enable public read access for your container with the [az storage container set-permission](/cli/azure/storage/container#create) command.

```azurecli-interactive
az storage container set-permission \
    --name mystoragecontainer \
    --public-access container
```

## Upload a blob to a container

Blob storage supports block blobs, append blobs, and page blobs. Block blobs are the most common type of blob stored in Azure Storage. Append blobs are used when data must be added to an existing blob without modifying its existing content, such as for logging. Page blobs back the VHD files of IaaS virtual machines.

In this example, we upload a blob into the container we created in the last step with the [az storage blob upload](/cli/azure/storage/blob#upload) command.

```azurecli-interactive
az storage blob upload \
    --container-name mystoragecontainer \
    --name blobName \
    --file ~/path/to/local/file
```

This operation creates the blob if it doesn't already exist, and overwrites it if it does. Upload several files so you can see multiple entries when you list the blobs in the next step.

## List the blobs in a container

List the blobs in the container with the [az storage blob list](/cli/azure/storage/blob#list) command.

```azurecli-interactive
az storage blob list \
    --container-name mystoragecontainer \
    --output table
```

Sample output:

```
Name            Blob Type      Length  Content Type              Last Modified
--------------  -----------  --------  ------------------------  -------------------------
ISSUE_TEMPLATE  BlockBlob         761  application/octet-stream  2017-04-21T18:29:50+00:00
LICENSE         BlockBlob       18653  application/octet-stream  2017-04-21T18:28:50+00:00
LICENSE-CODE    BlockBlob        1090  application/octet-stream  2017-04-21T18:29:02+00:00
README.md       BlockBlob        6700  application/octet-stream  2017-04-21T18:27:33+00:00
dir1/file1.txt  BlockBlob        6700  application/octet-stream  2017-04-21T18:32:51+00:00
```

## Download a blob

Download the blob you uploaded in a previous step using the [az storage blob download](/cli/azure/storage/blob#download) command.

```azurecli-interactive
az storage blob download \
    --container-name mystoragecontainer \
    --name blobName \
    --file ~/destination/path/for/file
```

## Copy a blob between storage accounts

You can copy blobs within or across storage accounts and regions asynchronously.

The following example demonstrates how to copy blobs from one storage account to another. We first create a container in the source storage account, specifying public read-access for its blobs. Next, we upload a file to the container, and finally, copy the blob from that container into a container in the destination storage account.

In this example, the destination container must already exist in the destination storage account for the copy operation to succeed. Additionally, the source blob specified in the `--source-uri` argument must either include a shared access signature (SAS) token, or be publicly accessible, as in this example.

```azurecli
# Create container in source account
az storage container create \
    --account-name sourceaccountname \
    --account-key sourceaccountkey \
    --name sourcecontainer \
    --public-access blob

# Upload blob to container in source account
az storage blob upload \
    --account-name sourceaccountname \
    --account-key sourceaccountkey \
    --container-name sourcecontainer \
    --file ~/path/to/sourcefile \
    --name sourcefile

# Copy blob from source account to destination account (destcontainer must exist)
az storage blob copy start \
    --account-name destaccountname \
    --account-key destaccountkey \
    --destination-blob destfile.png \
    --destination-container destcontainer \
    --source-uri https://sourceaccountname.blob.core.windows.net/sourcecontainer/sourcefile.png
```

## Delete a blob

Delete the blob from the container using the [az storage blob delete](/cli/azure/storage/blob#delete) command.

```azurecli-interactive
az storage blob delete \
    --container-name mystoragecontainer \
    --name blobName
```

## Display and modify blob properties and metadata

Each blob has several service-defined properties you can display with the [az storage blob show](/cli/azure/storage/blob#show) command, including its name, type, length, and others. You can also configure a blob with your own properties and their values by using the [az storage blob metadata update](/cli/azure/storage/blob/metadata#update) command.

In this example, we first display the service-defined properties of a blob, then update the blob with two of our own metadata properties. Finally, we display the blob's metadata properties and their values with the [az storage blob metadata show](/cli/azure/storage/blob/metadata#show) command.

```azurecli-interactive
# Show properties of a blob
az storage blob show \
    --container-name mystoragecontainer \
    --name blobName \
    --output table

# Set metadata properties of a blob (replaces all existing metadata)
az storage blob metadata update \
    --container-name mystoragecontainer \
    --name blobName \
    --metadata "key1=value1" "key2=value2"

# Show metadata properties of a blob
az storage blob metadata show \
    --container-name mystoragecontainer \
    --name blobName
```

## Create a shared access signature (SAS)

Shared access signatures (SAS) provide you with a way to grant limited access to objects in your storage account without exposing your storage account access keys. To produce a URI that permits access to a private resource, you create SAS token with the desired permissions and validity window (its effective duration), and append it as a query string to a resource's URL, thus forming its full SAS URI. Anyone with this SAS URI (the resource's URL plus the SAS token) can then access it during the SAS token's validity window. For example, you might want to permit read access to a private blob for two minutes so someone can view it.

In the following steps, you'll disable public access to your container, test the private-only access, then generate and test a SAS URI.

### Disable container public access

First, set the access level of the container to `off`. This designates that there is no access to the container or its blobs without either a shared access signature or a storage account access key.

```azurecli-interactive
az storage container set-permission \
    --name mystoragecontainer \
    --public-access off
```

### Verify private access

To verify that there is no public read access to the blobs in that container, get the URL for one of its blobs with the [az storage blob url](/cli/azure/storage/blob#url) command.

```azurecli-interactive
az storage blob url \
    --container-name mystoragecontainer \
    --name blobName \
    --output tsv
```

Navigate to the blob's URL in a private browser window. You're presented with a `ResourceNotFound` error because the blob is private, and you have not included a shared access signature.

### Create a SAS URI

Now we'll create a SAS URI that permits access to the blob. In the following example, we first populate a variable with the URL for the blob with [az storage blob url](/cli/azure/storage/blob#url), then populate another variable with a SAS token generated with the [az storage blob generate-sas](/cli/azure/storage/blob#generate-sas) command. Finally, we output the full SAS URI for blob by concatenating the two, separated by the `?` query string separator.

```azurecli-interactive
# Get UTC datetimes for SAS start and expiry (Example: 1994-11-05T13:15:30Z)
sas_start=`date -u +'%Y-%m-%dT%H:%M:%SZ'`
sas_expiry=`date -u +'%Y-%m-%dT%H:%M:%SZ' -d '+2 minute'`

# Get the URL for the blob
blob_url=`az storage blob url \
    --container-name mystoragecontainer \
    --name blobName \
    --output tsv`

# Obtain a SAS token granting read (r) access between the
# SAS start and expiry times
sas_token=`az storage blob generate-sas \
    --container-name mystoragecontainer \
    --name blobName \
    --start $sas_start \
    --expiry $sas_expiry \
    --permissions r \
    --output tsv`

# Display the full SAS URI for the blob
echo $blob_url?$sas_token
```

### Test the SAS URI

In a private browser window, navigate to the full SAS URI that you displayed with the `echo` command in the preceding code snippet. This time, you aren't presented with an error and you can view or download the blob.

Wait long enough for the URL to expire (two minutes in this example), then navigate to the URI in another private browser window. You now see an `AuthenticationFailed` error because the SAS token has expired.

## Clean up resources

If you no longer need any of the resources in your resource group, including the storage account you created and any blobs you've uploaded in this tutorial, delete the resource group with the [az group delete](/cli/azure/group#delete) command.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

In this tutorial, you learned the basics of working with blobs in Azure Storage:

> [!div class="checklist"]
> * Create a container
> * Upload a file (blob) to a container
> * List the blobs in a container
> * Download a blob from a container
> * Copy a blob between storage accounts
> * Delete a blob
> * Display and modify blob properties and metadata
> * Manage security with a shared access signature (SAS)

The following resources provide additional information about working with the Azure CLI, as well as working with the resources in your storage account.

* Azure CLI
  * [Log in with Azure CLI 2.0](/cli/azure/authenticate-azure-cli) - Learn about the different methods of authenticating with the CLI, including non-interactive login via [service principal](/cli/azure/authenticate-azure-cli#logging-in-with-a-service-principal) for running unattended Azure CLI scripts.
  * [Azure CLI 2.0 command reference](/cli/azure/)
* Microsoft Azure Storage Explorer
  * The [Microsoft Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.
