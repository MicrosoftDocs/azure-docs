---
title: Create and manage directories in Azure Storage by using Python
description: Use the Azure Storage Client Library to create and managed directories in Azure Blob storage accounts that have a hierarchical namespace
services: storage
author: normesta
ms.service: storage
ms.date: 06/28/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# Create and manage directories in Azure Storage by using Python

This article shows you how to use Python to manage directories in storage accounts that have a hierarchical namespace.

> [!NOTE]
> The content featured in this article uses terms such as *blobs* and *containers* instead of *files* and *file systems*. That's because Azure Data Lake Storage Gen2 is built on blob storage, and in blob storage a *file* is persisted as a *blob*, and a *file system* is persisted as a *container*. 

## Connect to the storage account

Comment

```python
def initialize_storage_account(storage_account_name, storage_account_key):
    try:
       global block_blob_service

       block_blob_service = BlockBlobService(account_name=storage_account_name, account_key=storage_account_key)

    except Exception as e:
        print(e)
```

## Create a directory

Add a directory by calling the [BlockBlobService.create_directory](https://www.microsoft.com) method. Pass these items as parameters to the method:

* The name of the container.

* The path of the new directory.

This example adds a directory named `my-directory` to a container named `my-file-system`. 

```python
def create_directory(container_name):
    try:

        block_blob_service.create_directory(container_name, "my-directory")

    except Exception as e:
        print(e)
```

## Move a directory

Move a directory by calling the [BlockBlobService.rename_path](https://www.microsoft.com) method. Pass these items as parameters to the method:

* The name of the container.

* The path that you want to give the directory.

* The path of the existing directory.


This example moves a directory named `my-directory` to a sub-directory of another directory named `my-directory-2`. 

```python
def rename_directory(container_name):
  
    try:

        block_blob_service.rename_path(container_name, "my-directory", "my-directory-2/my-directory") )

    except Exception as e:
        print(e)) 

```

## Rename a directory

Rename a directory by calling the [BlockBlobService.rename_path](https://www.microsoft.com) method. Pass these items as parameters to the method:

* The name of the container.

* The path that you want to give the directory.

* The path of the existing directory.

This example renames the directory `my-directory` to the name `my-new-directory`.

```python
def rename_directory(container_name):
  
    try:

        block_blob_service.rename_path(container_name,"my-new-directory","my-directory")

    except Exception as e:
        print(e)) 
```

## Delete a directory

The following example deletes a directory by calling the [BlockBlobService.delete_directory](https://www.microsoft.com) method. Pass these items as parameters to the method:

* The name of the container.

* The path of the directory that you want to delete.

This method deletes a directory named `my-directory`.  

```python
def delete_directory(container_name):
  
    try:

        block_blob_service.delete_directory(container_name, "my-directory")

    except Exception as e:
        print(e)
```

## Upload a file to a directory 

Text here.

```python
def upload_file_to_directory(container_name, file_name):

        # Upload the created file, use local_file_name for the blob name
        block_blob_service.create_blob_from_path(container_name, "my-directory/my-file.txt", file_name)
```

## Download a file from a directory 

Text here.

```python
def download_file_from_directory(container_name, file_destination_path):

    block_blob_service.get_blob_to_path(container_name, "my-directory/my-file.txt", file_destination_path)
```
## List the contents of a directory 

Text here.

```python
def list_directory_contents():
    print("\nList blobs in the 'my-directory' directory")
    generator = block_blob_service.list_blobs("mycontainer/my-directory")
    for blob in generator:
        print("\t Blob name: " + blob.name)
```

## Next steps

Explore more APIs in the [blob package](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob?view=azure-python) section of the [Azure Client SDK for Python](https://docs.microsoft.com/python/api/overview/azure/storage/client?view=azure-python) docs.
