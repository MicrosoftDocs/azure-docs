---
title: Azure File Share code samples using Python version 2 client libraries
titleSuffix: Azure Storage
description: View code samples that use the Azure File Share client library for Python version 2.
services: storage
author: pauljewellmsft
ms.service: azure-file-storage
ms.custom: devx-track-python
ms.topic: how-to
ms.date: 05/05/2023
ms.author: pauljewell
---

# Azure File Share code samples using Python version 2 client libraries

This article shows code samples that use version 2 of the Azure File Share client library for Python.

[!INCLUDE [storage-v11-sdk-support-retirement](../../../includes/storage-v11-sdk-support-retirement.md)]

## Prerequisites

Install the following package using `pip install`:

```console
pip install azure-storage-file
```

Add the following `import` statement:

```python
from azure.storage.file import FileService
```

## Create an Azure file share

Related article: [Develop for Azure Files with Python](storage-python-how-to-use-file-storage.md#create-an-azure-file-share)

The following code example uses a [FileService](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice) object to create the share if it doesn't exist.

```python
file_service.create_share('myshare')
```

## Create a directory

Related article: [Develop for Azure Files with Python](storage-python-how-to-use-file-storage.md#create-a-directory)

You can organize storage by putting files inside subdirectories instead of having all of them in the root directory.

The code below will create a subdirectory named *sampledir* under the root directory.

```python
file_service.create_directory('myshare', 'sampledir')
```

## Upload a file

Related article: [Develop for Azure Files with Python](storage-python-how-to-use-file-storage.md#upload-a-file)

In this section, you'll learn how to upload a file from local storage into Azure Files.

An Azure file share contains, at the least, a root directory where files can reside. To create a file and upload data, use any of the following methods:

- [create_file_from_path](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice#azure-storage-file-fileservice-fileservice-create-file-from-path)
- [create_file_from_stream](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice#azure-storage-file-fileservice-fileservice-create-file-from-stream)
- [create_file_from_bytes](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice#azure-storage-file-fileservice-fileservice-create-file-from-bytes)
- [create_file_from_text](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice#azure-storage-file-fileservice-fileservice-create-file-from-text)

These methods perform the necessary chunking when the size of the data exceeds 64 MiB.

`create_file_from_path` uploads the contents of a file from the specified path, and `create_file_from_stream` uploads the contents from an already opened file/stream. `create_file_from_bytes` uploads an array of bytes, and `create_file_from_text` uploads the specified text value using the specified encoding (defaults to UTF-8).

The following example uploads the contents of the *sunset.png* file into the **myfile** file.

```python
from azure.storage.file import ContentSettings
file_service.create_file_from_path(
    'myshare',
    None,  # We want to create this file in the root directory, so we specify None for the directory_name
    'myfile',
    'sunset.png',
    content_settings=ContentSettings(content_type='image/png'))
```

## Enumerate files and directories in an Azure file share

Related article: [Develop for Azure Files with Python](storage-python-how-to-use-file-storage.md#enumerate-files-and-directories-in-an-azure-file-share)

To list the files and directories in a share, use the [list_directories_and_files](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice#azure-storage-file-fileservice-fileservice-list-directories-and-files) method. This method returns a generator. The following code outputs the **name** of each file and directory in a share to the console.

```python
generator = file_service.list_directories_and_files('myshare')
for file_or_dir in generator:
    print(file_or_dir.name)
```

## Download a file

Related article: [Develop for Azure Files with Python](storage-python-how-to-use-file-storage.md#download-a-file)

To download data from a file, use any of the following methods:

- [get_file_to_path](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice#azure-storage-file-fileservice-fileservice-get-file-to-path)
- [get_file_to_stream](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice#get-file-to-stream-share-name--directory-name--file-name--stream--start-range-none--end-range-none--validate-content-false--progress-callback-none--max-connections-2--timeout-none--snapshot-none-)
- [get_file_to_bytes](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice#azure-storage-file-fileservice-fileservice-get-file-to-bytes)
- [get_file_to_text](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice#azure-storage-file-fileservice-fileservice-get-file-to-text)

These methods perform the necessary chunking when the size of the data exceeds 64 MiB.

The following example demonstrates using `get_file_to_path` to download the contents of the **myfile** file and store it to the *out-sunset.png* file.

```python
file_service.get_file_to_path('myshare', None, 'myfile', 'out-sunset.png')
```

## Create a share snapshot

Related article: [Develop for Azure Files with Python](storage-python-how-to-use-file-storage.md#create-a-share-snapshot)

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

Related article: [Develop for Azure Files with Python](storage-python-how-to-use-file-storage.md#list-shares-and-snapshots)

You can list all the snapshots for a particular share.

```python
shares = list(file_service.list_shares(include_snapshots=True))
```

## Browse share snapshot

Related article: [Develop for Azure Files with Python](storage-python-how-to-use-file-storage.md#browse-share-snapshot)

You can browse each share snapshot to retrieve files and directories from that point in time.

```python
directories_and_files = list(
    file_service.list_directories_and_files(share_name, snapshot=snapshot_id))
```

## Get file from share snapshot

Related article: [Develop for Azure Files with Python](storage-python-how-to-use-file-storage.md#get-file-from-share-snapshot)

You can download a file from a share snapshot. This enables you to restore a previous version of a file.

```python
with open(FILE_PATH, 'wb') as stream:
    file = file_service.get_file_to_stream(
        share_name, directory_name, file_name, stream, snapshot=snapshot_id)
```

## Delete a single share snapshot

Related article: [Develop for Azure Files with Python](storage-python-how-to-use-file-storage.md#delete-a-single-share-snapshot)

You can delete a single share snapshot.

```python
file_service.delete_share(share_name, snapshot=snapshot_id)
```

## Delete a file

Related article: [Develop for Azure Files with Python](storage-python-how-to-use-file-storage.md#delete-a-file)

To delete a file, call [delete_file](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice?view=azure-python-previous&preserve-view=true#delete-file-share-name--directory-name--file-name--timeout-none-).

The following code example shows how to delete a file:

```python
file_service.delete_file('myshare', None, 'myfile')
```

## Delete share when share snapshots exist

Related article: [Develop for Azure Files with Python](storage-python-how-to-use-file-storage.md#delete-share-when-share-snapshots-exist)

A share that contains snapshots cannot be deleted unless all the snapshots are deleted first.

The following code example shows how to delete a share:

```python
file_service.delete_share(share_name, delete_snapshots=DeleteSnapshot.Include)
```
