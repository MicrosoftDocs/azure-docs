---
title: How to use Blob storage from Python
description: Use the Azure Storage Client Library for Python to interact with Blob storage
services: storage
author: normesta
ms.service: storage
ms.date: 04/14/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# How to use Blob storage from Python

Intro text here.

## Create a storage account

To create a storage account, see [Create a storage account](../common/storage-quickstart-create-account.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

Enable a hierarchical namespace if you want to use the code snippets in this article that perform operations on a hierarchical file system.

![Enabling a hierarchical namespace](media/storage-python-how-to-use-blobs/enable-hierarchical-namespace.png)

## Install Python and the Azure SDK for Python

See these resources:

* [Python](https://www.python.org/downloads/)

* [Azure Storage SDK for Python](https://github.com/Azure/azure-sdk-for-python)

## Add Python modules

Add these import statements to your code file.

```python
import os, uuid, sys
from azure.storage.blob import BlockBlobService, PublicAccess
```
[!INCLUDE [storage-copy-account-key-portal](../../../includes/storage-copy-account-key-portal.md)]

## Create a container and set permissions

First create an instance of the [BlockBlobService](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob.blockblobservice.blockblobservice?view=azure-python) class by using the name of your storage account and the storage account key that you obtained the previous section.

Then, create a container and set the permissions on that container.

```python
def create_container(storage_account_name, storage_account_key):
    global block_blob_service
    block_blob_service = BlockBlobService(account_name=storage_account_name, account_key=storage_account_key)

    global container_name
    container_name = 'my-blob'
    block_blob_service.create_container(container_name)

    # Set the permission so the blobs are public.
    block_blob_service.set_container_acl(container_name, public_access=PublicAccess.Container)
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [BlockBlobService](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob.blockblobservice.blockblobservice?view=azure-python) class.
> * [BlockBlobService.set_container_acl](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob.baseblobservice.baseblobservice?view=azure-python#set-container-acl-container-name--signed-identifiers-none--public-access-none--lease-id-none--if-modified-since-none--if-unmodified-since-none--timeout-none-) method.
> * [BlockBlobService.create_container](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob.baseblobservice.baseblobservice?view=azure-python#create-container-container-name--metadata-none--public-access-none--fail-on-exist-false--timeout-none-) method.

## Upload blobs to the container

Some guidance goes here.

```python
def upload_blob(file_path, file_name):
    block_blob_service.create_blob_from_path(container_name, file_path, file_name)
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]().
> * [Method]().

## List blobs in the container

Some guidance goes here.

```python
def list_blobs():
    print("\nList blobs in the container")
    generator = block_blob_service.list_blobs(container_name)
    for blob in generator:
        print("\t Blob name: " + blob.name)
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]().
> * [Method]().

## Download blobs from the container

Some guidance goes here.

```python
def download_blob(file_name, file_destination_path):
    block_blob_service.get_blob_to_path(container_name, local_file_name, file_destination_path)
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]().
> * [Method]().

## Delete blobs from the container

Some guidance goes here.

```python
def delete_blob(file_name):
    block_blob_service.delete_blob(container_name, file_name)

```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]().
> * [Method]().

## Delete the container

Some guidance goes here.

```python
def delete_container():
    block_blob_service.delete_container(container_name)
```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]().
> * [Method]().

## Add directories to the container

This is only for accounts that have a hierarchical namespace.

```python

```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]().
> * [Method]().

## Add files to directories in the container

This is only for accounts that have a hierarchical namespace.

```python

```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]().
> * [Method]().

## Set Access Control Lists (ACL) permission on a directory

This is only for accounts that have a hierarchical namespace.

```python

```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]().
> * [Method]().

## Set Access Control Lists (ACL) permission on a file in a directory

This is only for accounts that have a hierarchical namespace.

```python

```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]().
> * [Method]().

## Something here for append data and flush methods (scenario TBD)

This is only for accounts that have a hierarchical namespace.

```python

```

### APIs featured in this snippet

> [!div class="checklist"]
> * [Type]().
> * [Method]().

## Next steps

Now that you've learned the basics of blob storage, follow these links to learn more about Azure Storage.  

Put next steps here.
