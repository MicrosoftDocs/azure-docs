---
title: Transfer data to or from Azure Blob storage by using AzCopy v10 | Microsoft Docs
description: This article contains a collection of AzCopy example commands that help you create containers, copy files, and synchronize folders between local file systems and containers.
services: storage
author: normesta
ms.service: storage
ms.topic: article
ms.date: 05/14/2019
ms.author: normesta
ms.subservice: common
---

# Transfer data with AzCopy and Blob storage

AzCopy is a command-line utility that you can use to copy data to, from, or between storage accounts. This article contains example commands that work with Blob storage.

## Get started

See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy and learn about the ways that you can provide authorization credentials to the storage service.

> [!NOTE]
> The examples in this article assume that you've authenticated your identity by using the `AzCopy login` command. AzCopy then uses your Azure AD account to authorize access to data in Blob storage.
>
> If you'd rather use a SAS token to authorize access to blob data, then you can append that token to the resource URL in each AzCopy command.
>
> For example: `https://<storage-account-name>.blob.core.windows.net/<container-name>?<SAS-token>"`.

## Create a container

You can use the AzCopy `make` command to create a container. The examples in this section create a container named `mycontainer`.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy make "https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>` |
| **Example** | `azcopy make "https://mystorageaccount.blob.core.windows.net/mycontainer"` |
| **Example** (hierarchical namespace) | `azcopy make "https://mystorageaccount.dfs.core.windows.net/mycontainer"` |

## Upload files

You can use the AzCopy `copy` command to upload files and folders from your local computer.

This section contains the following examples:

> [!div class="checklist"]
> * Upload a file
> * Upload a folder
> * Upload files by using wildcard characters

> [!NOTE]
> AzCopy doesn't automatically calculate and store the file's md5 hash code. If you want AzCopy to do that, then append the `--put-md5` flag to each copy command. That way, when the blob is downloaded, AzCopy calculates an MD5 hash for downloaded data and verifies that the MD5 hash stored in the blob's `Content-md5` property matches the calculated hash.

### Upload a file

|    |     |
|--------|-----------|
| **Syntax** | `azcopy cp "<local-file-path>" "https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<blob-name>"` |
| **Example** | `azcopy copy "C:\myFolder\myTextFile.txt" "https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt"` |
| **Example** (hierarchical namespace) | `azcopy copy "C:\myFolder\myTextFile.txt" "https://mystorageaccount.dfs.core.windows.net/mycontainer/myTextFile.txt"` |

> [!NOTE]
> AzCopy by default uploads data into block blobs. To upload files as Append Blobs, or Page Blobs use the flag `--blob-type=[BlockBlob|PageBlob|AppendBlob]`.

### Upload a folder

This example copies a folder (and all of the files in that folder) to a blob container. The result is a folder in the container by the same name.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy "<local-folder-path>" "https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>" --recursive` |
| **Example** | `azcopy copy "C:\myFolder" "https://mystorageaccount.blob.core.windows.net/mycontainer" --recursive` |
| **Example** (hierarchical namespace) | `azcopy copy "C:\myFolder" "https://mystorageaccount.dfs.core.windows.net/mycontainer" --recursive` |

To copy to a folder within the container, just specify the name of that folder in your command string.

|    |     |
|--------|-----------|
| **Example** | `azcopy copy "C:\myFolder" "https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobFolder" --recursive` |
| **Example** (hierarchical namespace) | `azcopy copy "C:\myFolder" "https://mystorageaccount.dfs.core.windows.net/mycontainer/myBlobFolder" --recursive` |

If you specify the name of a folder that does not exist in the container, AzCopy creates a new folder by that name.

### Upload the contents of a folder

You can upload the contents of a folder without copying the containing folder itself by using the wildcard symbol (*).

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy "<local-folder-path>\*" "https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<folder-path>` |
| **Example** | `azcopy copy "C:\myFolder\*" "https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobFolder"` |
| **Example** (hierarchical namespace) | `azcopy copy "C:\myFolder\*" "https://mystorageaccount.dfs.core.windows.net/mycontainer/myBlobFolder"` |

> [!NOTE]
> Append the `--recursive` flag to upload files in all sub-folders.

## Download files

You can use the AzCopy `copy` command to download blobs, folders, and containers to your local computer.

This section contains the following examples:

> [!div class="checklist"]
> * Download a file
> * Download a folder
> * Download files by using wildcard characters

> [!NOTE]
> If the `Content-md5` property value of a blob contains a hash, AzCopy calculates an MD5 hash for downloaded data and verifies that the MD5 hash stored in the blob's `Content-md5` property matches the calculated hash. If these values don't match, the download fails unless you override this behavior by appending `--check-md5=NoCheck` or `--check-md5=LogOnly` to the copy command.

### Download a file

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy "https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<blob-path>" "<local-file-path>"` |
| **Example** | `azcopy copy "https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt" "C:\myFolder\myTextFile.txt"` |
| **Example** (hierarchical namespace) | `azcopy copy "https://mystorageaccount.dfs.core.windows.net/mycontainer/myTextFile.txt" "C:\myFolder\myTextFile.txt"` |

### Download a folder

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy "https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<folder-path>" "<local-folder-path>" --recursive` |
| **Example** | `azcopy copy "https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobFolder "C:\myFolder"  --recursive` |
| **Example** (hierarchical namespace) | `azcopy copy "https://mystorageaccount.dfs.core.windows.net/mycontainer/myBlobFolder "C:\myFolder"  --recursive` |

This example results in a folder named `C:\myFolder\myBlobFolder` that contains all of the downloaded files.

### Download the contents of a folder

You can download the contents of a folder without copying the containing folder itself by using the wildcard symbol (*).

> [!NOTE]
> Currently, this scenario is supported only for accounts that don't have a hierarchical namespace.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy "https://<storage-account-name>.blob.core.windows.net/<container-name>/*" "<local-folder-path>/"` |
| **Example** | `azcopy copy "https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobFolder/*" "C:\myFolder"` |

> [!NOTE]
> Append the `--recursive` flag to download files in all sub-folders.

## Copy blobs between storage accounts

You can use AzCopy to copy blobs to other storage accounts. The copy operation is synchronous so when the command returns, that indicates that all files have been copied.

> [!NOTE]
> Currently, this scenario is supported only for accounts that don't have a hierarchical namespace.

AzCopy uses the [Put Block From URL](https://docs.microsoft.com/rest/api/storageservices/put-block-from-url) API, so data is copied directly between storage servers. These copy operations don't use the network bandwidth of your computer.

This section contains the following examples:

> [!div class="checklist"]
> * Copy a blob to another storage account
> * Copy a folder to another storage account
> * Copy a containers to another storage account
> * Copy all containers, folders, and files to another storage account

### Copy a blob to another storage account

|    |     |
|--------|-----------|
| **Syntax** | `azcopy cp "https://<source-storage-account-name>.blob.core.windows.net/<container-name>/<blob-path>" "https://<destination-storage-account-name>.blob.core.windows.net/<container-name>/<blob-path>"` |
| **Example** | `azcopy cp "https://mysourceaccount.blob.core.windows.net/mycontainer/myTextFile.txt" "https://mydestinationaccount.blob.core.windows.net/mycontainer/myTextFile.txt"` |

### Copy a folder to another storage account

|    |     |
|--------|-----------|
| **Syntax** | `azcopy cp "https://<source-storage-account-name>.blob.core.windows.net/<container-name>/<folder-path>" "https://<destination-storage-account-name>.blob.core.windows.net/<container-name>/<folder-path>" --recursive` |
| **Example** | `azcopy cp "https://mysourceaccount.blob.core.windows.net/mycontainer/myBlobFolder" "https://mydestinationaccount.blob.core.windows.net/mycontainer/myBlobFolder" --recursive` |

### Copy a containers to another storage account

|    |     |
|--------|-----------|
| **Syntax** | `azcopy cp "https://<source-storage-account-name>.blob.core.windows.net/<container-name>" "https://<destination-storage-account-name>.blob.core.windows.net/<container-name>" --recursive` |
| **Example** | `azcopy cp "https://mysourceaccount.blob.core.windows.net/mycontainer" "https://mydestinationaccount.blob.core.windows.net/mycontainer" --recursive` |

### Copy all containers, folders, and files to another storage account

|    |     |
|--------|-----------|
| **Syntax** | `azcopy cp "https://<source-storage-account-name>.blob.core.windows.net/" "https://<destination-storage-account-name>.blob.core.windows.net/" --recursive"` |
| **Example** | `azcopy cp "https://mysourceaccount.blob.core.windows.net" "https://mydestinationaccount.blob.core.windows.net" --recursive` |

## Synchronize files

You can synchronize the contents of a local file system to a blob container. You can also synchronize a blob container to a local file system on your computer. Synchronization is one-way. In other words, you choose which of these two endpoints is the source and which one is the destination.

> [!NOTE]
> The current release of AzCopy doesn't synchronize between other sources and destinations (For example: File storage or Amazon Web Services (AWS) S3 buckets).

The `sync` command compares file names and last modified timestamps. Set the `--delete-destination` optional flag to a value of `true` or `prompt` to delete files in the destination folder if those files no longer exist in the source folder.

If you set the `--delete-destination` flag to `true` AzCopy deletes files without providing a prompt. If you want a prompt to appear before AzCopy deletes a file, set the `--delete-destination` flag to `prompt`.

> [!NOTE]
> To prevent accidental deletions, make sure to enable the [soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete) feature before you use the `--delete-destination=prompt|true` flag.

### Synchronize a container to a local file system

In this case, the local file system becomes the source and the container is the destination.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy sync "<local-folder-path>" "https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>" --recursive` |
| **Example** | `azcopy sync "C:\myFolder" "https://mystorageaccount.blob.core.windows.net/mycontainer" --recursive` |
| **Example** (hierarchical namespace) | `azcopy sync "C:\myFolder" "https://<storage-account-name>.dfs.core.windows.net/mycontainer" --recursive` |


### Synchronize a local file system to a container

In this case, the container becomes the source and the local file system is the destination.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy sync "https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>" "C:\myFolder" --recursive` |
| **Example** | `azcopy sync "https://mystorageaccount.blob.core.windows.net/mycontainer" "C:\myFolder" --recursive` |
| **Example** (hierarchical namespace) | `azcopy sync "https://mystorageaccount.dfs.core.windows.net/mycontainer" "C:\myFolder" --recursive` |

## Next steps

Find more examples in any of these articles:

- [Get started with AzCopy](storage-use-azcopy-v10.md)

- [Tutorial: Migrate on-premises data to cloud storage by using AzCopy](storage-use-azcopy-migrate-on-premises-data.md)

- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

- [Transfer data with AzCopy and Amazon S3 buckets](storage-use-azcopy-s3.md)

- [Configure, optimize, and troubleshoot AzCopy](storage-use-azcopy-configure.md)