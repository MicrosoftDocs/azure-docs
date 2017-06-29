---
title: Develop for Azure File Storage with Python | Microsoft Docs
description: Learn how to develop Python applications and services that use Azure File Storage to store file data.
services: storage
documentationcenter: python
author: robinsh
manager: timlt
editor: tysonn

ms.assetid: 297f3a14-6b3a-48b0-9da4-db5907827fb5
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: python
ms.topic: article
ms.date: 12/08/2016
ms.author: robinsh
---

# Develop for Azure File Storage with Python
[!INCLUDE [storage-selector-file-include](../../includes/storage-selector-file-include.md)]

[!INCLUDE [storage-try-azure-tools-files](../../includes/storage-try-azure-tools-files.md)]

## About this tutorial
This tutorial will demonstrate the basics of using Python to develop applications or services that use Azure File Storage to store file data. In this tutorial, we will create a simple console application and show how to perform basic actions with Python and Azure File Storage:

* Create Azure File shares
* Create directories
* Enumerate files and directories in an Azure File share
* Upload, download, and delete a file

> [!Note]  
> Because Azure File Storage may be accessed over SMB, it is possible to write simple applications that access the Azure File share using the standard Python I/O classes and functions. This article will describe how to write applications that use the Azure Storage Python SDK, which uses the [Azure File Storage REST API](https://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/file-service-rest-api) to talk to Azure File Storage.

### Set up your application to use Azure File Storage
Add the following near the top of any Python source file in which you wish to programmatically access Azure Storage.

```python
from azure.storage.file import FileService
```

### Set up a connection to Azure File Storage 
The `FileService` object lets you work with shares, directories and files. The following code creates a `FileService` object using the storage account name and account key. Replace `<myaccount>` and `<mykey>` with your account name and key.

```python
file_service = FileService(account_name='myaccount', account_key='mykey')
```

### Create an Azure File share
In the following code example, you can use a `FileService` object to create the share if it doesn't exist.

```python
file_service.create_share('myshare')
```

### Create a directory
You can also organize storage by putting files inside sub-directories instead of having all of them in the root directory. Azure File Storage allows you to create as many directories as your account will allow. The code below will create a sub-directory named **sampledir** under the root directory.

```python
file_service.create_directory('myshare', 'sampledir')
```

### Enumerate files and directories in an Azure File share
To list the files and directories in a share, use the **list\_directories\_and\_files** method. This method returns a generator. The following code outputs the **name** of each file and directory in a share to the console.

```python
generator = file_service.list_directories_and_files('myshare')
for file_or_dir in generator:
    print(file_or_dir.name)
```

### Upload a file 
Azure File share contains at the very least, a root directory where files can reside. In this section, you'll learn how to upload a file from local storage onto the root directory of a share.

To create a file and upload data, use the `create_file_from_path`, `create_file_from_stream`, `create_file_from_bytes` or `create_file_from_text` methods. They are high-level methods that perform the necessary chunking when the size of the data exceeds 64 MB.

`create_file_from_path` uploads the contents of a file from the specified path, and `create_file_from_stream` uploads the contents from an already opened file/stream. `create_file_from_bytes` uploads an array of bytes, and `create_file_from_text` uploads the specified text value using the specified encoding (defaults to UTF-8).

The following example uploads the contents of the **sunset.png** file into the **myfile** file.

```python
from azure.storage.file import ContentSettings
file_service.create_file_from_path(
    'myshare',
    None, # We want to create this blob in the root directory, so we specify None for the directory_name
    'myfile',
    'sunset.png',
    content_settings=ContentSettings(content_type='image/png'))
```

### Download a file
To download data from a file, use `get_file_to_path`, `get_file_to_stream`, `get_file_to_bytes`, or `get_file_to_text`. They are high-level methods that perform the necessary chunking when the size of the data exceeds 64 MB.

The following example demonstrates using `get_file_to_path` to download the contents of the **myfile** file and store it to the **out-sunset.png** file.

```python
file_service.get_file_to_path('myshare', None, 'myfile', 'out-sunset.png')
```

### Delete a file
Finally, to delete a file, call `delete_file`.

```python
file_service.delete_file('myshare', None, 'myfile')
```

## Next steps
Now that you've learned how to manipulate Azure File Storage with Python, follow these links to learn more.

* [Python Developer Center](/develop/python/)
* [Azure Storage Services REST API](http://msdn.microsoft.com/library/azure/dd179355)
* [Microsoft Azure Storage SDK for Python](https://github.com/Azure/azure-storage-python)