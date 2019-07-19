---
title: Manage directory and file access permissions in Azure Storage by using Python
description: Use Python to manage directory and file access permissions in Azure Blob storage accounts that have a hierarchical namespace
services: storage
author: normesta
ms.service: storage
ms.date: 06/28/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# Manage directory and file access permissions in Azure Storage by using Python

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

## Get the access control list (ACL) for a directory

Get the access permissions of a directory by calling the [BlockBlobService.get_path_access_control](https://www.microsoft.com) method. Pass these items as parameters to the method:

* The name of the container.

* The path of the directory.

The following example returns a [PathProperties](https://www.microsoft.com) instance that contains the access control list (ACL) of the directory.

This example gets the ACL of the `my-directory` directory and then prints the short form of ACL to the console.

```python
def get_directory_permissions(container_name):
  
    try:

        path_properties = PathProperties()
        path_properties = block_blob_service.get_path_access_control(container_name, "my-directory")
        
        print(path_properties.acl)

        print("Owner: {}".format(path_properties.owner))
        print("Permissions: {}".format(path_properties.permissions))
        print("Group: {}".format(path_properties.group))
        print("Acl: {}".format(path_properties.acl))

    except Exception as e:
        print(e)
```

The short form of an ACL might look something like the following:

`user::rwx,group::r-x,other::---`

This string means that the owning user has read, write, and execute permissions. The owning group has only read and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## Set the ACL for a directory

Set the access permissions of a directory by calling the [BlockBlobService.set_directory_permissions](https://www.microsoft.com) method. Pass these items as parameters to the method:

* The name of the container.

* The path of the directory.

* The short form of the desired ACL.

This example gives read access to all users.

```python
def set_directory_permissions(container_name):
  
    try:

        block_blob_service.set_path_access_control(container_name, "my-directory", acl='other::r--')
        
    except Exception as e:
        print(e)
```

For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## Get the ACL of a file

Comment here.

```python
def get_file_ACL(container_name):
  
    try:

        path_properties = PathProperties()
        path_properties = block_blob_service.get_path_access_control(container_name, "my-directory/my-file.txt")

        print("Acl: {}".format(path_properties.acl))

    except Exception as e:
        print(e)
```

## Set the ACL of a file

Comment here.

```python
def set_file_ACL(container_name):
  
    try:

        block_blob_service.set_path_access_control(container_name, "my-directory/my-file.txt", acl='other::r--')
        
    except Exception as e:
        print(e)
```

## Next steps

Explore more APIs in the [blob package](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob?view=azure-python) section of the [Azure Client SDK for Python](https://docs.microsoft.com/python/api/overview/azure/storage/client?view=azure-python) docs.
