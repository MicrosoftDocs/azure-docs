---
title: Transfer data with AzCopy and blob storage | Microsoft Docs
description: This article contains a collection of AzCopy example commands that help you create containers, copy files, and synchronize folders between local file systems and containers.
services: storage
author: normesta
ms.service: storage
ms.topic: article
ms.date: 01/03/2019
ms.author: normesta
ms.subservice: common
---

# Transfer data with AzCopy and blob storage 

AzCopy is a command-line utility that you can use to copy data to, from, or between storage accounts.

This article contains a collection of AzCopy example commands. You can use them to create containers, upload files, download files, copy files, and synchronize folders.

## First, set up AzCopy

See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to perform these set up tasks:

> [!div class="checklist"]
> * Download AzCopy
> * Authenticate your identity

> [!NOTE]
> The examples in this article assume that you authenticate your identity by using the `AzCopy login` command.
>
> If you choose to authenticate your identity by using a SAS token, then for each AzCopy command, append that token to url of the container resource (For example: "https://\<storage-account-name\>.blob.core.windows.net/\<container-name\>?**\<SAS-token\>**").

## Create containers

Use this command to create a blob container.

```
azcopy make "https://<storage-account-name>.blob.core.windows.net/<container-name>"
```

Example:

`azcopy make "https://mystorageaccount.blob.core.windows.net/mycontainer"`

## Upload files

You can use AzCopy to upload files and folders from your local computer or from a Virtual Hard Disk (VHD).

### Upload a file

Use this command to upload a file from your local computer to a blob in a container.

```
azcopy cp "<local-file-path>" "https://<storage-account-name>.blob.core.windows.net/<container-name>/<blob-name>"
```

Example:

`azcopy copy "C:\myFolder\myTextFile.txt" "https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt"`

> [!NOTE]
> If you append the `--put-md5` flag to this command, AzCopy will calculate the file's md5 hash code, and then store that code in the `Content-md5` property of the corresponding blob for later use.

### Upload a folder

This example copies a folder (and all of the files in that folder) to a blob container. The result is a folder in the container by the same name. 

```
azcopy copy "<local-folder-path>" "https://<storage-account-name>.blob.core.windows.net/<container-name>" --recursive=true
```

Example:

`azcopy copy "C:\myFolder" "https://mystorageaccount.blob.core.windows.net/mycontainer --recursive=true`

To copy to a folder within the container, just specify the name of that folder in your command string.

Example:

`azcopy copy "C:\myFolder" "https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobFolder --recursive=true`

If you specify the name of a folder that does not exist in the container, AzCopy creates a new folder by that name.

> [!NOTE]
> If you append the `--put-md5` flag to this command, AzCopy will calculate each file's md5 hash code, and then store that code in the `Content-md5` property of each corresponding blob for later use.

### Upload files by using wildcard characters

You can use the wildcard symbol (*) to provide partial file names.

```
azcopy copy "<local-folder-path>/*<partial-file-name>" "https://<storage-account-name>.blob.core.windows.net/<container-name>/<folder-path>
```

Example:

`azcopy copy "C:\myFolder\*.pdf" "https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobFolder`

> [!NOTE]
> Append the `--recursive=true` flag to upload files in all sub-folders.

### Upload data from a VHD

Intro line.


```
azcopy copy "<local-vhd-file-path>" "https://<storage-account-name>.blob.core.windows.net/<container-name>/<vhd-name>" --blob-type=PageBlob
```

Example:

`.\azcopy copy "C:\myFolder\myVHD.vhd" "https://mystorageaccount.blob.core.windows.net/mycontainer/myVHD.vhd" --blob-type=PageBlob`

> [!NOTE]
> AzCopy by default uploads data into block blobs. To upload files as Append Blobs, or Page Blobs use the flag `--blob-type=[BlockBlob|PageBlob|AppendBlob]`.

## Download files

You can use AzCopy to download blobs and containers to your local computer.

### Download a file

Intro line.

```
command
```

Example:

`example`

### Download a folder

Intro line.

```
command
```

Example:

`example`

### Download files by using wildcard characters

Intro line.

```
command
```

Example:

`example`

### Download files and directories by using wild card characters

Intro line.

```
command
```

Example:

`example`

## Copy files

You can use AzCopy to copy blobs and containers between blob folders and across storage accounts.

### Copy a blob to another blob

Intro line.

```
command
```

Example:

`example`

### Copy a folder to another folder within a container

Intro line.

```
command
```

Example:

`example`

### Copy data between containers in different storage accounts

Intro line.

```
command
```

Example:

`example`

### Copy containers between different storage accounts

Intro line.

```
command
```

Example:

`example`

## Synchronize files

You can use AzCopy to synchronize folders and files.

### Synchronize a local file system with a container

Intro line.

```
command
```

Example:

`example`

### Synchronize a container with a local file system

Intro line.

```
command
```

Example:

`example`

## Raw material

### Copy data to Azure Storage

The following command uploads all files under the folder `C:\local\path` recursively to the container `mycontainer1`, creating `path` folder in the container. When `--put-md5` flag is provided, AzCopy calculates and stores each file's md5 hash in `Content-md5` property of the corresponding blob for later use.

```azcopy
.\azcopy cp "C:\local\path" "https://account.blob.core.windows.net/mycontainer1<sastoken>" --recursive=true --put-md5
```

The following command uploads all files under the folder `C:\local\path` (without recursing into the subdirectories) to the container `mycontainer1`:

```azcopy
.\azcopy cp "C:\local\path\*" "https://account.blob.core.windows.net/mycontainer1<sastoken>" --put-md5
```

To find more examples, use the following command:

```azcopy
.\azcopy cp -h
```

### Copy Blob data between two storage accounts

Copying data between two storage accounts uses the [Put Block From URL](https://docs.microsoft.com/rest/api/storageservices/put-block-from-url) API, and doesn't use the client machine's network bandwidth. Data is copied between two Azure Storage servers directly, while AzCopy simply orchestrates the copy operation. This option is currently only available for Blob storage.

To copy the all of the Blob data between two storage accounts, use the following command:
```azcopy
.\azcopy cp "https://myaccount.blob.core.windows.net/<sastoken>" "https://myotheraccount.blob.core.windows.net/<sastoken>" --recursive=true
```

To copy a Blob container to another Blob container, use the following command:
```azcopy
.\azcopy cp "https://myaccount.blob.core.windows.net/mycontainer/<sastoken>" "https://myotheraccount.blob.core.windows.net/mycontainer/<sastoken>" --recursive=true
```

### Copy a VHD image to a storage account

AzCopy by default uploads data into block blobs. To upload files as Append Blobs, or Page Blobs use the flag `--blob-type=[BlockBlob|PageBlob|AppendBlob]`.

```azcopy
.\azcopy cp "C:\local\path\mydisk.vhd" "https://myotheraccount.blob.core.windows.net/mycontainer/mydisk.vhd<sastoken>" --blob-type=PageBlob
```

### Sync: incremental copy and delete (Blob storage only)

The sync command synchronizes contents of a source folder to a folder in the destination, comparing file names and last modified timestamps. This operation includes the optional deletion of destination files if those do not exist in the source when the `--delete-destination=prompt|true` flag is provided. By default, the delete behavior is disabled. 

> [!NOTE] 
> Use the `--delete-destination` flag with caution. Enable the [soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete) feature before you enable delete behavior in sync to prevent accidental deletions in your account. 
>
> When `--delete-destination` is set to true, AzCopy will delete files that do not exist in the source from destination without any prompt to the user. If you want to be prompted for confirmation, use `--delete-destination=prompt`.

To sync your local file system to a storage account, use the following command:

```azcopy
.\azcopy sync "C:\local\path" "https://account.blob.core.windows.net/mycontainer1<sastoken>" --recursive=true
```

You can also sync a blob container down to a local file system:

```azcopy
# The SAS token isn't required for Azure Active Directory authentication.
.\azcopy sync "https://account.blob.core.windows.net/mycontainer1" "C:\local\path" --recursive=true
```

This command incrementally syncs the source to the destination based on the last modified timestamps. If you add or delete a file in the source, AzCopy will do the same in the destination. Before deletion, AzCopy will prompt you to confirm.

## More examples

See these articles:

- [Transfer data with AzCopy and Azure Data Lake Storage Gen2](storage-use-azcopy-data-lake-gen2.md)

- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

- [Transfer data with AzCopy and Amazon S3 buckets](storage-use-azcopy-s3.md)