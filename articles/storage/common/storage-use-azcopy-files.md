---
title: Transfer data with AzCopy and file storage | Microsoft Docs
description: Transfer data with AzCopy and file storage.
services: storage
author: normesta
ms.service: storage
ms.topic: article
ms.date: 01/03/2019
ms.author: normesta
ms.subservice: common
---
# Transfer data with AzCopy and file storage 

AzCopy is a command-line utility that you can use to copy data to, from, or between storage accounts. This article contains example commands that work with file storage.

## First, set up AzCopy

See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy and authenticate your identity.

> [!NOTE]
> The examples in this article assume that you've authenticated your identity by using the `AzCopy login` command.
> If you'd rather use a SAS token, then you can append that token to the resource url in each command.
> For example: `https://<storage-account-name>.file.core.windows.net/<file-share-name>?<SAS-token>"`.

## Create file shares

|    |     |
|--------|-----------|
| **Syntax** | `azcopy make "https://<storage-account-name>.file.core.windows.net/<file-share-name>"` |
| **Example** | `azcopy make "https://mystorageaccount.file.core.windows.net/myfileshare"` |

## Upload files

You can use AzCopy to upload files and folders from your local computer.

This section contains the following examples:

> [!div class="checklist"]
> * Upload a file
> * Upload a folder
> * Upload files by using wildcard characters

### Upload a file

|    |     |
|--------|-----------|
| **Syntax** | `azcopy cp "<local-file-path>" "https://<storage-account-name>.<uri-suffix>/<file-share-name>/<file-name>"` |
| **Example** | `azcopy copy "C:\myFolder\myTextFile.txt" "https://mystorageaccount.file.core.windows.net/myfileshare/myTextFile.txt"` |

> [!NOTE]
> If you append the `--put-md5` flag to this command, AzCopy will calculate the file's md5 hash code, and then store that code in the `Content-md5` property of the corresponding file for later use.

### Upload a folder

This example copies a folder (and all of the files in that folder) to a file share. The result is a folder in the file share by the same name.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy "<local-folder-path>" "https://<storage-account-name>.<uri-suffix>/<file-share-name>" --recursive=true` |
| **Example** | `azcopy copy "C:\myFolder" "https://mystorageaccount.file.core.windows.net/myfileshare" --recursive=true` |

To copy to a folder within the file share, just specify the name of that folder in your command string.

|    |     |
|--------|-----------|
| **Example** | `azcopy copy "C:\myFolder" "https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareFolder" --recursive=true` |

If you specify the name of a folder that does not exist in the file share, AzCopy creates a new folder by that name.

> [!NOTE]
> If you append the `--put-md5` flag to this command, AzCopy will calculate each file's md5 hash code, and then store that code in the `Content-md5` property of each corresponding file for later use.

### Upload files by using wildcard characters

You can use the wildcard symbol (*) to provide partial file names.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy "<local-folder-path>/*<partial-file-name>*" "https://<storage-account-name>.<uri-suffix>/<file-share-name>/<folder-path>` |
| **Example** | `azcopy copy "C:\myFolder\*.pdf" "https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareFolder"` |

> [!NOTE]
> Append the `--recursive=true` flag to upload files in all sub-folders.

## Download files

You can use AzCopy to download files and file shares to your local computer.

This section contains the following examples:

> [!div class="checklist"]
> * Download a file
> * Download a folder
> * Download files by using wildcard characters

### Download a file

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy "https://<storage-account-name>.<uri-suffix>/<file-share-name>/<file-path>" "<local-file-path>"` |
| **Example** | `azcopy copy "https://mystorageaccount.file.core.windows.net/myfileshare/myTextFile.txt" "C:\myFolder\myTextFile.txt"` |

### Download a folder

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy "https://<storage-account-name>.<uri-suffix>/<file-share-name>/<folder-path>" "<local-folder-path>" --recursive=true` |
| **Example** | `azcopy copy "https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareFolder "C:\myFolder"  --recursive=true` |

This example results in a folder named `C:\myFolder\myFileShareFolder` that contains all of the downloaded files.

### Download files by using wildcard characters

You can use the wildcard symbol (*) to provide partial file names.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy "https://<storage-account-name>.<uri-suffix>/<file-share-name>/*<partial-file-name>*" "<local-folder-path>/"` |
| **Example** | `azcopy copy "https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareFolder/*.pdf" "C:\myFolder"` |

> [!NOTE]
> Append the `--recursive=true` flag to upload files in all sub-folders.

## Copy files between storage accounts

You can use AzCopy to copy files to other storage accounts.

AzCopy uses the [Put Block From URL](https://docs.microsoft.com/rest/api/storageservices/put-block-from-url) API, so data is copied directly between storage servers. These copy operations don't use the network bandwidth of your computer.

This section contains the following examples:

> [!div class="checklist"]
> * Copy a file to another storage account
> * Copy a folder to another storage account
> * Copy a file shares to another storage account
> * Copy all file shares, folders, and files to another storage account

### Copy a file to another storage account

|    |     |
|--------|-----------|
| **Syntax** | `azcopy cp "https://<source-storage-account-name>.<uri-suffix>/<file-share-name>/<file-path>" "https://<destination-storage-account-name>.<uri-suffix>/<file-share-name>/<file-path>"` |
| **Example** | `azcopy cp "https://mysourceaccount.file.core.windows.net/myfileshare/myTextFile.txt" "https://mydestinationaccount.file.core.windows.net/myfileshare/myTextFile.txt"` |

### Copy a folder to another storage account

|    |     |
|--------|-----------|
| **Syntax** | `azcopy cp "https://<source-storage-account-name>.<uri-suffix>/<file-share-name>/<folder-path>" "https://<destination-storage-account-name>.<uri-suffix>/<file-share-name>/<folder-path>" --recursive=true` |
| **Example** | `azcopy cp "https://mysourceaccount.file.core.windows.net/myfileshare/myFileShareFolder" "https://mydestinationaccount.file.core.windows.net/myfileshare/myFileShareFolder" --recursive=true` |

### Copy a file shares to another storage account

|    |     |
|--------|-----------|
| **Syntax** | `azcopy cp "https://<source-storage-account-name>.<uri-suffix>/<file-share-name>" "https://<destination-storage-account-name>.<uri-suffix>/<file-share-name>" --recursive=true` |
| **Example** | `azcopy cp "https://mysourceaccount.file.core.windows.net/myfileshare" "https://mydestinationaccount.file.core.windows.net/myfileshare" --recursive=true` |

### Copy all file shares, folders, and files to another storage account

|    |     |
|--------|-----------|
| **Syntax** | `azcopy cp "https://<source-storage-account-name>.<uri-suffix>/" "https://<destination-storage-account-name>.<uri-suffix>/" --recursive=true" --recursive=true` |
| **Example** | `azcopy cp "https://mysourceaccount.file.core.windows.net" "https://mydestinationaccount.file.core.windows.net" --recursive=true` |

## Synchronize files

You can synchronize the contents of a source folder to a folder in the destination.

The `sync` command compares file names and last modified timestamps. Set the `--delete-destination` optional flag to a value of `true` or `prompt` to delete files in the destination folder if those files no longer exist in the source folder.

If you set the `--delete-destination` flag to `true` AzCopy deletes files without providing a prompt. If you want a prompt to appear before AzCopy deletes a file, set the `--delete-destination` flag to `prompt`.

### Synchronize a local file system with a file share

|    |     |
|--------|-----------|
| **Syntax** | `azcopy sync "<local-folder-path>" "https://<storage-account-name>.<uri-suffix>/<file-share-name>" --recursive=true` |
| **Example** | `azcopy sync "C:\myFolder" "https://<storage-account-name>.file.core.windows.net/myfileshare" --recursive=true` |

### Synchronize a file share with a local file system

|    |     |
|--------|-----------|
| **Syntax** | `azcopy sync "https://<storage-account-name>.<uri-suffix>/<file-share-name>" "C:\myFolder" --recursive=true` |
| **Example** | `azcopy sync "https://mystorageaccount.file.core.windows.net/myfileshare" "C:\myFolder" --recursive=true` |

## More examples

See these articles:

- [Get started with AzCopy](storage-use-azcopy-v10.md)

- [Transfer data with AzCopy and blob storagee](storage-use-azcopy-blobs.md)

- [Transfer data with AzCopy and Amazon S3 buckets](storage-use-azcopy-s3.md)

- [Configure, optimize, and troubleshoot AzCopy](storage-use-azcopy-configure.md)