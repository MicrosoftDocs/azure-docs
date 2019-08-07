---
title: Create and manage directories in Azure Storage by using Python
description: Use the Azure Storage Client Library to create and managed directories in Azure Blob storage accounts that have a hierarchical namespace
author: normesta
ms.service: storage
ms.date: 06/28/2019
ms.author: normesta
ms.topic: article
ms.subservice: data-lake-storage-gen2
ms.reviewer: prishet
---

# Create and manage directories in Azure Storage by using Python

This article shows you how to use Python to manage directories in storage accounts that have a hierarchical namespace.

## Connect to the storage account

Create an object that represents Blob storage in your storage account by creating an instance of a [BlockBlobService](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob.blockblobservice.blockblobservice?view=azure-python). 

```python
def initialize_storage_account(storage_account_name, storage_account_key):
    try:
       global block_blob_service

       block_blob_service = BlockBlobService(account_name=storage_account_name, account_key=storage_account_key)

    except Exception as e:
        print(e)
```
 
- Replace the `storage_account_name` placeholder value with the name of your storage account.

- Replace the `storage-account-key` placeholder value with your storage account access key.

## Create a directory

Add a directory by calling the **BlockBlobService.create_directory** method. Pass these items as parameters to the method:

- The name of the container.
- The path of the new directory.

This example adds a directory named `my-directory` to a container. 

```python
def create_directory(container_name):
    try:

        block_blob_service.create_directory(container_name, "my-directory")

    except Exception as e:
        print(e)
```

## Rename a directory

Rename a directory by calling the **BlockBlobService.rename_path** method. Pass these items as parameters to the method:

- The name of the container.
- The path that you want to give the directory.
- The path of the existing directory.

This example renames the directory `my-directory` to the name `my-new-directory`.

```python
def rename_directory(container_name):
  
    try:

        block_blob_service.rename_path(container_name,"my-new-directory","my-directory")

    except Exception as e:
        print(e)) 
```

## Move a directory

Move a directory by calling the **BlockBlobService.rename_path** method. Pass these items as parameters to the method:

- The name of the container.
- The path that you want to give the directory.
- The path of the existing directory.


This example moves a directory named `my-directory` to a sub-directory of another directory named `my-directory-2`. 

```python
def rename_directory(container_name):
  
    try:

        block_blob_service.rename_path(container_name, "my-directory", "my-directory-2/my-directory") )

    except Exception as e:
        print(e)) 

```

## Delete a directory

Delete a directory by calling the **BlockBlobService.delete_directory** method. Pass these items as parameters to the method:

- The name of the container.
- The path of the directory that you want to delete.

This method deletes a directory named `my-directory`.  

```python
def delete_directory(container_name):
  
    try:

        block_blob_service.delete_directory(container_name, "my-directory")

    except Exception as e:
        print(e)
```

## Upload a file to a directory 

Upload a file to a directory by calling the **BlockBlobService.create_blob_from_path** method. Pass these items as parameters to the method:

- The name of the container.
- The path to the location in your container where you want to place this file along with the name of the file.
- The path to the local file that you want to upload.

This example uploads a file named `my-file.txt` to a directory named `my-directory`.

```python
def upload_file_to_directory(container_name, file_name):

        # Upload the created file, use local_file_name for the blob name
        block_blob_service.create_blob_from_path(container_name, "my-directory/my-file.txt", file_name)
```

## Download a file from a directory 

Download a file from a directory by calling the **BlockBlobService.get_blob_to_path** method. Pass these items as parameters to the method:

- The name of the container.
- The path to the file in your storage account. 
- The path to the local file system where you want to download this file along with the name that you want to give the downloaded file.

```python
def download_file_from_directory(container_name, file_destination_path):

    block_blob_service.get_blob_to_path(container_name, "my-directory/my-file.txt", file_destination_path)
```
## List the contents of a directory 

List the contents of a directory by calling the **BlockBlobService.list_blobs** method.

```python
def list_directory_contents():
    print("\nList blobs in the 'my-directory' directory")
    generator = block_blob_service.list_blobs("mycontainer/my-directory")
    for blob in generator:
        print("\t Blob name: " + blob.name)
```

## Next steps

Explore more APIs in the [blob package](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob?view=azure-python) section of the [Azure Client SDK for Python](https://docs.microsoft.com/python/api/overview/azure/storage/client?view=azure-python) docs.
