---
title: Develop for Azure Files with Python | Microsoft Docs
description: Learn how to develop Python applications and services that use Azure Files to store file data.
author: roygara

ms.service: storage
ms.topic: how-to
ms.date: 10/08/2020
ms.author: rogarana
ms.subservice: files
ms.custom: devx-track-python
---

# Develop for Azure Files with Python

[!INCLUDE [storage-selector-file-include](../../../includes/storage-selector-file-include.md)]

Learn the basics of using Python to develop apps or services that use Azure Files to store file data. Create a simple console app and learn how to perform basic actions with Python and Azure Files:

- Create Azure file shares
- Create directories
- Enumerate files and directories in an Azure file share
- Upload, download, and delete a file
- Create file share backups by using snapshots

> [!NOTE]
> Because Azure Files may be accessed over SMB, it is possible to write simple applications that access the Azure file share using the standard Python I/O classes and functions. This article will describe how to write apps that use the Azure Files Storage Python SDK, which uses the [Azure Files REST API](/rest/api/storageservices/file-service-rest-api) to talk to Azure Files.

## Download and Install Azure Storage SDK for Python

> [!NOTE]
> If you are upgrading from the Azure Storage SDK for Python version 0.36 or earlier, uninstall the older SDK using `pip uninstall azure-storage` before installing the latest package.

# [Azure Python SDK v12](#tab/python)

The [Azure File Storage client library v12.x for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-share) requires Python 2.7 or 3.6+.

# [Azure Python SDK v2](#tab/python2)

The [Azure Storage SDK for Python](https://github.com/azure/azure-storage-python) requires Python 2.7 or 3.6+.

---

## Install via PyPI

To install via the Python Package Index (PyPI), type:

# [Azure Python SDK v12](#tab/python)

```console
pip install azure-storage-file-share
```

# [Azure Python SDK v2](#tab/python2)

```console
pip install azure-storage-file
```

### View the sample application

To view and run a sample application that shows how to use Python with Azure Files, see [Azure Storage: Getting Started with Azure Files in Python](https://github.com/Azure-Samples/storage-file-python-getting-started).

To run the sample application, make sure you've installed both the `azure-storage-file` and `azure-storage-common` packages.

---

## Set up your application to use Azure Files

Add the following near the top of a Python source file to use the code snippets in this article.

# [Azure Python SDK v12](#tab/python)

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_Imports":::

# [Azure Python SDK v2](#tab/python2)

```python
from azure.storage.file import FileService
```

---

## Set up a connection to Azure Files

# [Azure Python SDK v12](#tab/python)

[ShareServiceClient](/azure/developer/python/sdk/storage/azure-storage-file-share/azure.storage.fileshare.shareserviceclient) lets you work with shares, directories, and files. The following code creates a `ShareServiceClient` object using the storage account connection string.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_CreateShareServiceClient":::

# [Azure Python SDK v2](#tab/python2)

The [FileService](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice?view=azure-python-previous&preserve-view=true) object lets you work with shares, directories, and files. The following code creates a `FileService` object using the storage account name and account key. Replace `<myaccount>` and `<mykey>` with your account name and key.

```python
file_service = FileService(account_name='myaccount', account_key='mykey')
```

---

## Create an Azure file share

# [Azure Python SDK v12](#tab/python)

The following code example uses a [ShareClient](/azure/developer/python/sdk/storage/azure-storage-file-share/azure.storage.fileshare.shareclient) object to create the share if it doesn't exist.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_CreateFileShare":::

# [Azure Python SDK v2](#tab/python2)

The following code example uses a [FileService](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice?view=azure-python-previous&preserve-view=true) object to create the share if it doesn't exist.

```python
file_service.create_share('myshare')
```

---

## Create a directory

You can organize storage by putting files inside subdirectories instead of having all of them in the root directory.

# [Azure Python SDK v12](#tab/python)

The following method creates a directory in the root of the specified file share by using a [ShareDirectoryClient](/azure/developer/python/sdk/storage/azure-storage-file-share/azure.storage.fileshare.sharedirectoryclient) object.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_CreateDirectory":::

# [Azure Python SDK v2](#tab/python2)

The code below will create a subdirectory named *sampledir* under the root directory.

```python
file_service.create_directory('myshare', 'sampledir')
```

---

## Upload a file

In this section, you'll learn how to upload a file from local storage into Azure File Storage.

# [Azure Python SDK v12](#tab/python)

The following method uploads the contents of the specified file into the specified directory in the specified Azure file share.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_UploadFile":::

# [Azure Python SDK v2](#tab/python2)

An Azure file share contains, at the least, a root directory where files can reside. To create a file and upload data, use the [create_file_from_path](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice?view=azure-python-previous&preserve-view=true#create-file-from-path-share-name--directory-name--file-name--local-file-path--content-settings-none--metadata-none--validate-content-false--progress-callback-none--max-connections-2--file-permission-none--smb-properties--azure-storage-file-models-smbproperties-object---timeout-none-), [create_file_from_stream](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice?view=azure-python-previous&preserve-view=true#create-file-from-stream-share-name--directory-name--file-name--stream--count--content-settings-none--metadata-none--validate-content-false--progress-callback-none--max-connections-2--timeout-none--file-permission-none--smb-properties--azure-storage-file-models-smbproperties-object--), [create_file_from_bytes](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice?view=azure-python-previous&preserve-view=true#create-file-from-bytes-share-name--directory-name--file-name--file--index-0--count-none--content-settings-none--metadata-none--validate-content-false--progress-callback-none--max-connections-2--timeout-none--file-permission-none--smb-properties--azure-storage-file-models-smbproperties-object--), or [create_file_from_text](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice?view=azure-python-previous&preserve-view=true#create-file-from-text-share-name--directory-name--file-name--text--encoding--utf-8---content-settings-none--metadata-none--validate-content-false--timeout-none--file-permission-none--smb-properties--azure-storage-file-models-smbproperties-object--) methods. They're high-level methods that perform the necessary chunking when the size of the data exceeds 64 MB.

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

---

## Enumerate files and directories in an Azure file share

# [Azure Python SDK v12](#tab/python)

To list the files and directories in a subdirectory, use the [list_directories_and_files](/azure/developer/python/sdk/storage/azure-storage-file-share/azure.storage.fileshare.shareclient#list-directories-and-files-directory-name-none--name-starts-with-none--marker-none----kwargs-) method. This method returns an auto-paging iterable. The following code outputs the **name** of each file and subdirectory in the specified directory to the console.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_ListFilesAndDirs":::

# [Azure Python SDK v2](#tab/python2)

To list the files and directories in a share, use the [list_directories_and_files](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice?view=azure-python-previous&preserve-view=true#list-directories-and-files-share-name--directory-name-none--num-results-none--marker-none--timeout-none--prefix-none--snapshot-none-) method. This method returns a generator. The following code outputs the **name** of each file and directory in a share to the console.

```python
generator = file_service.list_directories_and_files('myshare')
for file_or_dir in generator:
    print(file_or_dir.name)
```

---

## Download a file

# [Azure Python SDK v12](#tab/python)

To download data from a file, use [download_file](/azure/developer/python/sdk/storage/azure-storage-file-share/azure.storage.fileshare.sharefileclient#download-file-offset-none--length-none----kwargs-).

The following example demonstrates using `download_file` to get the contents of the specified file and store it locally with **DOWNLOADED-** prepended to the filename.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_DownloadFile":::

# [Azure Python SDK v2](#tab/python2)

To download data from a file, use [get_file_to_path](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice?view=azure-python-previous&preserve-view=true#get-file-to-path-share-name--directory-name--file-name--file-path--open-mode--wb---start-range-none--end-range-none--validate-content-false--progress-callback-none--max-connections-2--timeout-none--snapshot-none-), [get_file_to_stream](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice?view=azure-python-previous&preserve-view=true#get-file-to-stream-share-name--directory-name--file-name--stream--start-range-none--end-range-none--validate-content-false--progress-callback-none--max-connections-2--timeout-none--snapshot-none-), [get_file_to_bytes](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice?view=azure-python-previous&preserve-view=true#get-file-to-bytes-share-name--directory-name--file-name--start-range-none--end-range-none--validate-content-false--progress-callback-none--max-connections-2--timeout-none--snapshot-none-), or [get_file_to_text](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice?view=azure-python-previous&preserve-view=true#get-file-to-text-share-name--directory-name--file-name--encoding--utf-8---start-range-none--end-range-none--validate-content-false--progress-callback-none--max-connections-2--timeout-none--snapshot-none-). They're high-level methods that perform the necessary chunking when the size of the data exceeds 64 MB.

The following example demonstrates using `get_file_to_path` to download the contents of the **myfile** file and store it to the *out-sunset.png* file.

```python
file_service.get_file_to_path('myshare', None, 'myfile', 'out-sunset.png')
```

---

## Create a share snapshot

You can create a point in time copy of your entire file share.

# [Azure Python SDK v12](#tab/python)

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_CreateSnapshot":::

# [Azure Python SDK v2](#tab/python2)

```python
snapshot = file_service.snapshot_share(share_name)
snapshot_id = snapshot.snapshot
```

**Create share snapshot with metadata**

```python
metadata = {"foo": "bar"}
snapshot = file_service.snapshot_share(share_name, metadata=metadata)
```

---

## List shares and snapshots

You can list all the snapshots for a particular share.

# [Azure Python SDK v12](#tab/python)

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_ListSharesAndSnapshots":::

# [Azure Python SDK v2](#tab/python2)

```python
shares = list(file_service.list_shares(include_snapshots=True))
```

---

## Browse share snapshot

You can browse each share snapshot to retrieve files and directories from that point in time.

# [Azure Python SDK v12](#tab/python)

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_BrowseSnapshotDir":::

# [Azure Python SDK v2](#tab/python2)

```python
directories_and_files = list(
    file_service.list_directories_and_files(share_name, snapshot=snapshot_id))
```

---

## Get file from share snapshot

You can download a file from a share snapshot. This enables you to restore a previous version of a file.

# [Azure Python SDK v12](#tab/python)

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_DownloadSnapshotFile":::

# [Azure Python SDK v2](#tab/python2)

```python
with open(FILE_PATH, 'wb') as stream:
    file = file_service.get_file_to_stream(
        share_name, directory_name, file_name, stream, snapshot=snapshot_id)
```

---

## Delete a single share snapshot
You can delete a single share snapshot.

# [Azure Python SDK v12](#tab/python)

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_DeleteSnapshot":::

# [Azure Python SDK v2](#tab/python2)

```python
file_service.delete_share(share_name, snapshot=snapshot_id)
```

---

## Delete a file

# [Azure Python SDK v12](#tab/python)

To delete a file, call [delete_file](/azure/developer/python/sdk/storage/azure-storage-file-share/azure.storage.fileshare.sharefileclient#delete-file---kwargs-).

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_DeleteFile":::

# [Azure Python SDK v2](#tab/python2)

To delete a file, call [delete_file](/python/api/azure-storage-file/azure.storage.file.fileservice.fileservice?view=azure-python-previous&preserve-view=true#delete-file-share-name--directory-name--file-name--timeout-none-).

```python
file_service.delete_file('myshare', None, 'myfile')
```

---

## Delete share when share snapshots exist

# [Azure Python SDK v12](#tab/python)

To delete a share that contains snapshots, call [delete_share](/azure/developer/python/sdk/storage/azure-storage-file-share/azure.storage.fileshare.shareclient#delete-share-delete-snapshots-false----kwargs-) with `delete_snapshots=True`.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_DeleteShare":::

# [Azure Python SDK v2](#tab/python2)

A share that contains snapshots cannot be deleted unless all the snapshots are deleted first.

```python
file_service.delete_share(share_name, delete_snapshots=DeleteSnapshot.Include)
```

---

## Next steps

Now that you've learned how to manipulate Azure Files with Python, follow these links to learn more.

- [Python Developer Center](/azure/developer/python/)
- [Azure Storage Services REST API](/rest/api/azure/)
- [Microsoft Azure Storage SDK for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage)
