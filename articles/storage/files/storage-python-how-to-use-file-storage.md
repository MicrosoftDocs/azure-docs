---
title: Develop for Azure Files with Python
titleSuffix: Azure Storage
description: Learn how to develop Python applications and services that use Azure Files to store file data. Create and delete files, file shares, and directories.
author: pauljewellmsft
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 04/04/2025
ms.author: pauljewell
ms.custom: devx-track-python, py-fresh-zinc
---

# Develop for Azure Files with Python

[!INCLUDE [storage-selector-file-include](../../../includes/storage-selector-file-include.md)]

Learn how to develop Python applications that use Azure Files to store data. Azure Files is a managed file share service in the cloud. It provides fully managed file shares that are accessible via the industry standard Server Message Block (SMB) and Network File System (NFS) protocols. Azure Files also provides a REST API for programmatic access to file shares.

In this article, you learn about the different approaches to developing with Azure Files in Python, and how to choose the approach that best fits the needs of your app. You also learn how to create a basic console app that interacts with Azure Files resources.

## Applies to

| Management model | Billing model | Media tier | Redundancy | SMB | NFS |
|-|-|-|-|:-:|:-:|
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Download and Install Azure Storage SDK for Python

> [!NOTE]
> If you're upgrading from the Azure Storage SDK for Python version 0.36 or earlier, uninstall the older SDK using `pip uninstall azure-storage` before installing the latest package.

The [Azure Files client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-share) requires Python 3.8+.

## Install via PyPI

To install via the Python Package Index (PyPI), type:

```console
pip install azure-storage-file-share
```

## Set up your application to use Azure Files

Add the following code near the top of a Python source file to use the code snippets in this article.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_Imports":::

## Set up a connection to Azure Files

[ShareServiceClient](/azure/developer/python/sdk/storage/azure-storage-file-share/azure.storage.fileshare.shareserviceclient) lets you work with shares, directories, and files. This code creates a `ShareServiceClient` object using the storage account connection string:

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_CreateShareServiceClient":::

## Create an Azure file share

The following code example uses a [ShareClient](/azure/developer/python/sdk/storage/azure-storage-file-share/azure.storage.fileshare.shareclient) object to create the share if it doesn't exist.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_CreateFileShare":::

## Create a directory

You can organize storage by putting files inside subdirectories instead of having all of them in the root directory.

The following method creates a directory in the root of the specified file share by using a [ShareDirectoryClient](/azure/developer/python/sdk/storage/azure-storage-file-share/azure.storage.fileshare.sharedirectoryclient) object.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_CreateDirectory":::

## Upload a file

In this section, you learn how to upload a file from local storage into Azure Files.

The following method uploads the contents of the specified file into the specified directory in the specified Azure file share.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_UploadFile":::

## Enumerate files and directories in an Azure file share

To list the files and directories in a subdirectory, use the [list_directories_and_files](/python/api/azure-storage-file-share/azure.storage.fileshare.ShareClient#azure-storage-fileshare-shareclient-list-directories-and-files) method. This method returns an auto-paging iterable. The following code outputs the **name** of each file and subdirectory in the specified directory to the console.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_ListFilesAndDirs":::

## Download a file

To download data from a file, use [download_file](/python/api/azure-storage-file-share/azure.storage.fileshare.ShareFileClient#azure-storage-fileshare-sharefileclient-download-file).

The following example demonstrates using `download_file` to get the contents of the specified file and store it locally with **DOWNLOADED-** prepended to the filename.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_DownloadFile":::

## Create a share snapshot

You can create a point in time copy of your entire file share.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_CreateSnapshot":::

## List shares and snapshots

You can list all the snapshots for a particular share.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_ListSharesAndSnapshots":::

## Browse share snapshot

You can browse each share snapshot to retrieve files and directories from that point in time.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_BrowseSnapshotDir":::

## Get file from share snapshot

You can download a file from a share snapshot, which enables you to restore a previous version of a file.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_DownloadSnapshotFile":::

## Delete a single share snapshot

You can delete a single share snapshot.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_DeleteSnapshot":::

## Delete a file

To delete a file, call [delete_file](/python/api/azure-storage-file-share/azure.storage.fileshare.ShareFileClient#azure-storage-fileshare-sharefileclient-delete-file).

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_DeleteFile":::

## Delete share when share snapshots exist

To delete a share that contains snapshots, call [delete_share](/python/api/azure-storage-file-share/azure.storage.fileshare.ShareClient#azure-storage-fileshare-shareclient-delete-share) with `delete_snapshots=True`.

:::code language="python" source="~/azure-storage-snippets/files/howto/python/python-v12/file_share_ops.py" id="Snippet_DeleteShare":::

## Next steps

Now that you've learned how to manipulate Azure Files with Python, follow these links to learn more.

- [Python Developer Center](/azure/developer/python/)
- [Azure Storage Services REST API](/rest/api/azure/)
- [Microsoft Azure Storage SDK for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage)

For related code samples using deprecated Python version 2 SDKs, see [Code samples using Python version 2](files-samples-python-v2.md).
