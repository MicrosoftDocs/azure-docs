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

## Install the Azure Storage Client Library for Python

Put guidance here.

## Add library references to your code file

Put these things in your file.

```python

```

## Get the connection string of your storage account

Use same guidance as is presented in the related Java quickstart.

## Create a container and set permissions

Some guidance goes here.

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

## Upload blobs to the container

Some guidance goes here.

```python
def upload_blob(file_path, file_name):
    block_blob_service.create_blob_from_path(container_name, file_path, file_name)
```

## List blobs in the container

Some guidance goes here.

```python
def list_blobs():
    print("\nList blobs in the container")
    generator = block_blob_service.list_blobs(container_name)
    for blob in generator:
        print("\t Blob name: " + blob.name)
```

## Download blobs from the container

Some guidance goes here.

```python
def download_blob(file_name, file_destination_path):
    block_blob_service.get_blob_to_path(container_name, local_file_name, file_destination_path)
```

## Delete blobs from the container

Some guidance goes here.

```python
def delete_blob(file_name):
    block_blob_service.delete_blob(container_name, file_name)

```

## Delete the container

Some guidance goes here.

```python
def delete_container():
    block_blob_service.delete_container(container_name)
```

## Add directories to the container

This is only for accounts that have a hierarchical namespace.

```python

```

## Add files to directories in the container

This is only for accounts that have a hierarchical namespace.

```python

```

## Set Access Control Lists (ACL) permission on a directory

This is only for accounts that have a hierarchical namespace.

```python

```

## Set Access Control Lists (ACL) permission on a file in a directory

This is only for accounts that have a hierarchical namespace.

```python

```

## Something here for append data and flush methods (scenario TBD)

This is only for accounts that have a hierarchical namespace.

```python

```

## Next steps

Now that you've learned the basics of blob storage, follow these links to learn more about Azure Storage.  

Put next steps here.
