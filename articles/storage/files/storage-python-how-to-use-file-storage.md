---
title: Develop for Azure Files with Python | Microsoft Docs
description: Learn how to develop Python applications and services that use Azure Files to store file data.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 12/14/2018
ms.author: rogarana
ms.subservice: files
ms.custom: tracking-python
---

# Develop for Azure Files with Python
[!INCLUDE [storage-selector-file-include](../../../includes/storage-selector-file-include.md)]

[!INCLUDE [storage-try-azure-tools-files](../../../includes/storage-try-azure-tools-files.md)]

This tutorial will demonstrate the basics of using Python to develop applications or services that use Azure Files to store file data. In this tutorial, we will create a simple console application and show how to perform basic actions with Python and Azure Files:

* Create Azure file shares
* Create directories
* Enumerate files and directories in an Azure file share
* Upload, download, and delete a file

> [!Note]  
> Because Azure Files may be accessed over SMB, it is possible to write simple applications that access the Azure file share using the standard Python I/O classes and functions. This article will describe how to write applications that use the Azure Storage Python SDK, which uses the [Azure Files REST API](https://docs.microsoft.com/rest/api/storageservices/file-service-rest-api) to talk to Azure Files.

## Download and Install Azure Storage SDK for Python

The [Azure Storage SDK for Python](https://github.com/azure/azure-storage-python) requires Python 2.7, 3.3, 3.4, 3.5, or 3.6.
 
## Install via PyPi

To install via the Python Package Index (PyPI), type:

```bash
pip install azure-storage-file
```

> [!NOTE]
> If you are upgrading from the Azure Storage SDK for Python version 0.36 or earlier, uninstall the older SDK using `pip uninstall azure-storage` before installing the latest package.

For alternative installation methods, visit the [Azure Storage SDK for Python on GitHub](https://github.com/Azure/azure-storage-python/).

## View the sample application
To view and run a sample application that shows how to use Python with Azure Files, see [Azure Storage: Getting Started with Azure Files in Python](https://github.com/Azure-Samples/storage-file-python-getting-started). 

To run the sample application, make sure you have installed both the `azure-storage-file` and `azure-storage-common` packages.

## Set up your application to use Azure Files
Add the following near the top of any Python source file in which you wish to programmatically access Azure Storage.

```python
from azure.storage.file import FileService
```

## Set up a connection to Azure Files 
The `FileService` object lets you work with shares, directories and files. The following code creates a `FileService` object using the storage account name and account key. Replace `<myaccount>` and `<mykey>` with your account name and key.

```python
file_service = FileService(account_name='myaccount', account_key='mykey')
```

## Create an Azure file share
In the following code example, you can use a `FileService` object to create the share if it doesn't exist.

```python
file_service.create_share('myshare')
```

## Create a directory
You can also organize storage by putting files inside sub-directories instead of having all of them in the root directory. Azure Files allows you to create as many directories as your account will allow. The code below will create a sub-directory named **sampledir** under the root directory.

```python
file_service.create_directory('myshare', 'sampledir')
```

## Enumerate files and directories in an Azure file share
To list the files and directories in a share, use the **list\_directories\_and\_files** method. This method returns a generator. The following code outputs the **name** of each file and directory in a share to the console.

```python
generator = file_service.list_directories_and_files('myshare')
for file_or_dir in generator:
    print(file_or_dir.name)
```

## Upload a file 
Azure file share contains at the very least, a root directory where files can reside. In this section, you'll learn how to upload a file from local storage onto the root directory of a share.

To create a file and upload data, use the `create_file_from_path`, `create_file_from_stream`, `create_file_from_bytes` or `create_file_from_text` methods. They are high-level methods that perform the necessary chunking when the size of the data exceeds 64 MB.

`create_file_from_path` uploads the contents of a file from the specified path, and `create_file_from_stream` uploads the contents from an already opened file/stream. `create_file_from_bytes` uploads an array of bytes, and `create_file_from_text` uploads the specified text value using the specified encoding (defaults to UTF-8).

The following example uploads the contents of the **sunset.png** file into the **myfile** file.

```python
from azure.storage.file import ContentSettings
file_service.create_file_from_path(
    'myshare',
    None,  # We want to create this blob in the root directory, so we specify None for the directory_name
    'myfile',
    'sunset.png',
    content_settings=ContentSettings(content_type='image/png'))
```

## Download a file
To download data from a file, use `get_file_to_path`, `get_file_to_stream`, `get_file_to_bytes`, or `get_file_to_text`. They are high-level methods that perform the necessary chunking when the size of the data exceeds 64 MB.

The following example demonstrates using `get_file_to_path` to download the contents of the **myfile** file and store it to the **out-sunset.png** file.

```python
file_service.get_file_to_path('myshare', None, 'myfile', 'out-sunset.png')
```

## Delete a file
Finally, to delete a file, call `delete_file`.

```python
file_service.delete_file('myshare', None, 'myfile')
```

## Create share snapshot
You can create a point in time copy of your entire file share.

```python
snapshot = file_service.snapshot_share(share_name)
snapshot_id = snapshot.snapshot
```

**Create share snapshot with metadata**

```python
metadata = {"foo": "bar"}
snapshot = file_service.snapshot_share(share_name, metadata=metadata)
```

## List shares and snapshots 
You can list all the snapshots for a particular share.

```python
shares = list(file_service.list_shares(include_snapshots=True))
```

## Browse share snapshot
You can browse content of each share snapshot to retrieve files and directories from that point in time.

```python
directories_and_files = list(
    file_service.list_directories_and_files(share_name, snapshot=snapshot_id))
```

## Get file from share snapshot
You can download a file from a share snapshot for your restore scenario.

```python
with open(FILE_PATH, 'wb') as stream:
    file = file_service.get_file_to_stream(
        share_name, directory_name, file_name, stream, snapshot=snapshot_id)
```

## Delete a single share snapshot  
You can delete a single share snapshot.

```python
file_service.delete_share(share_name, snapshot=snapshot_id)
```

## Delete share when share snapshots exist
A share that contains snapshots cannot be deleted unless all the snapshots are deleted first.

```python
file_service.delete_share(share_name, delete_snapshots=DeleteSnapshot.Include)
```

## Next steps
Now that you've learned how to manipulate Azure Files with Python, follow these links to learn more.

* [Python Developer Center](https://azure.microsoft.com/develop/python/)
* [Azure Storage Services REST API](https://msdn.microsoft.com/library/azure/dd179355)
* [Microsoft Azure Storage SDK for Python](https://github.com/Azure/azure-storage-python)
