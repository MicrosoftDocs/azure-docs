---
title: Manage file and directory level permissions in Azure Storage in Azure Storage by using Python
description: Use Python to manage file and directory level permissions in Azure Blob storage accounts that have a hierarchical namespace
author: normesta
ms.service: storage
ms.date: 06/28/2019
ms.author: normesta
ms.topic: article
ms.subservice: data-lake-storage-gen2
ms.reviewer: prishet
---

# Manage file and directory level permissions in Azure Storage by using Python

This article shows you how to use Python to get and set the access control lists (ACLs) of directories and files in storage accounts that have a hierarchical namespace. 

To learn more about ACLs, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

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

## Get the ACL of a directory

Get the access permissions of a directory by calling the **BlockBlobService.get_path_access_control** method. Pass these items as parameters to the method:

- The name of the container.
- The path of the directory.

This example gets the ACL of a directory named `my-directory`, and then prints the short form of ACL to the console.

```python
def get_directory_permissions(container_name):
  
    try:

        path_properties = PathProperties()
        path_properties = block_blob_service.get_path_access_control(container_name, "my-directory")
        
        print(path_properties.acl)

        print("Acl: {}".format(path_properties.acl))

    except Exception as e:
        print(e)
```

The short form of an ACL might look something like the following:

`user::rwx,group::r-x,other::---`

This string means that the owning user has read, write, and execute permissions. The owning group has only read and execute permissions. 

## Get the ACL of a file

Get the access permissions of a file by calling the **BlockBlobService.get_path_access_control** method. Pass these items as parameters to the method:

- The name of the container.
- The path of the file.

This example gets the ACL of a file named `my-file.txt`, and then prints the short form of ACL to the console.

```python
def get_file_ACL(container_name):
  
    try:

        path_properties = PathProperties()
        path_properties = block_blob_service.get_path_access_control(container_name, "my-directory/my-file.txt")

        print("Acl: {}".format(path_properties.acl))

    except Exception as e:
        print(e)
```

## Set the ACL of a directory

Set the access permissions of a directory by calling the **BlockBlobService.set_directory_permissions** method. Pass these items as parameters to the method:

- The name of the container.
- The path of the directory.
- The short form of the desired ACL.

This example gives read access to all users.

```python
def set_directory_permissions(container_name):
  
    try:

        block_blob_service.set_path_access_control(container_name, "my-directory", acl='other::r--')
        
    except Exception as e:
        print(e)
```

## Set the ACL of a file

Set the access permissions of a file by calling the **BlockBlobService.set_directory_permissions** method. Pass these items as parameters to the method:

- The name of the container.
- The path of the file.
- The short form of the desired ACL.

This example gives read access to all users.

```python
def set_file_ACL(container_name):
  
    try:

        block_blob_service.set_path_access_control(container_name, "my-directory/my-file.txt", acl='other::r--')
        
    except Exception as e:
        print(e)
```

## Next steps

Explore more APIs in the [blob package](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob?view=azure-python) section of the [Azure Client SDK for Python](https://docs.microsoft.com/python/api/overview/azure/storage/client?view=azure-python) docs.
