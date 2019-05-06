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

AzCopy is a command-line utility that you can use to copy data to, from, or between storage accounts. This article contains example commands that work with blob storage.

## First, set up AzCopy

See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy and authenticate your identity.

> [!NOTE]
> The examples in this article assume that you've authenticated your identity by using the `AzCopy login` command. If you'd rather use a SAS token, then append that token to the resource url in each command (For example: `https://<storage-account-name>.blob.core.windows.net/<container-name>?<SAS-token>"`).

## Create containers

Use this command to create a blob container.

```
azcopy make "https://<storage-account-name>.<uri-suffix>/<container-name>"
```

**Example**

`azcopy make "https://mystorageaccount.blob.core.windows.net/mycontainer"`

**Example (hierarchical namespace)**

`azcopy make "https://mystorageaccount.dfs.core.windows.net/mycontainer"`

## Upload files

You can use AzCopy to upload files and folders from your local computer.

This section contains the following examples:

> [!div class="checklist"]
> * Upload a file
> * Upload a folder
> * Upload files by using wildcard characters

### Upload a file

Use this command to upload a file from your local computer to a blob in a container.

> [!NOTE]
> AzCopy by default uploads data into block blobs. To upload files as Append Blobs, or Page Blobs use the flag `--blob-type=[BlockBlob|PageBlob|AppendBlob]`.

```
azcopy cp "<local-file-path>" "https://<storage-account-name>.<uri-suffix>/<container-name>/<blob-name>"
```

**Example**

`azcopy copy "C:\myFolder\myTextFile.txt" "https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt"`

**Example (hierarchical namespace)**

`azcopy copy "C:\myFolder\myTextFile.txt" "https://mystorageaccount.dfs.core.windows/mycontainer/myTextFile.txt"`

> [!NOTE]
> If you append the `--put-md5` flag to this command, AzCopy will calculate the file's md5 hash code, and then store that code in the `Content-md5` property of the corresponding blob for later use.

### Upload a folder

This example copies a folder (and all of the files in that folder) to a blob container. The result is a folder in the container by the same name.

```
azcopy copy "<local-folder-path>" "https://<storage-account-name>.<uri-suffix>/<container-name>" --recursive=true
```

**Example**

`azcopy copy "C:\myFolder" "https://mystorageaccount.blob.core.windows.net/mycontainer" --recursive=true`

**Example (hierarchical namespace)**

`azcopy copy "C:\myFolder" "https://mystorageaccount.dfs.core.windows/mycontainer" --recursive=true`

To copy to a folder within the container, just specify the name of that folder in your command string.

**Example**

`azcopy copy "C:\myFolder" "https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobFolder" --recursive=true`

**Example (hierarchical namespace)**

`azcopy copy "C:\myFolder" "https://mystorageaccount.dfs.core.windows/mycontainer/myBlobFolder" --recursive=true`

If you specify the name of a folder that does not exist in the container, AzCopy creates a new folder by that name.

> [!NOTE]
> If you append the `--put-md5` flag to this command, AzCopy will calculate each file's md5 hash code, and then store that code in the `Content-md5` property of each corresponding blob for later use.

### Upload files by using wildcard characters

You can use the wildcard symbol (*) to provide partial file names.

```
azcopy copy "<local-folder-path>/*<partial-file-name>*" "https://<storage-account-name>.<uri-suffix>/<container-name>/<folder-path>
```

**Example**

`azcopy copy "C:\myFolder\*.pdf" "https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobFolder"`

**Example (hierarchical namespace)**

`azcopy copy "C:\myFolder\*.pdf" "https://mystorageaccount.dfs.core.windows/mycontainer/myBlobFolder"`

> [!NOTE]
> Append the `--recursive=true` flag to upload files in all sub-folders.

## Download files

You can use AzCopy to download blobs and containers to your local computer.

This section contains the following examples:

> [!div class="checklist"]
> * Download a file
> * Download a folder
> * Download files by using wildcard characters

### Download a file

```
azcopy copy "https://<storage-account-name>.<uri-suffix>/<container-name>/<blob-path>" "<local-file-path>"
```

**Example**

`azcopy copy "https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt" "C:\myFolder\myTextFile.txt"`

**Example (hierarchical namespace)**

`azcopy copy "https://mystorageaccount.dfs.core.windows/mycontainer/myTextFile.txt" "C:\myFolder\myTextFile.txt"`

### Download a folder

This example downloads a folder (and all of the files in that folder) to the local computer. 

```
azcopy copy "https://<storage-account-name>.<uri-suffix>/<container-name>/<folder-path>" "<local-folder-path>" --recursive=true
```

**Example**

`azcopy copy "https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobFolder "C:\myFolder"  --recursive=true`

**Example (hierarchical namespace)**

`azcopy copy "https://mystorageaccount.dfs.core.windows/mycontainer/myBlobFolder "C:\myFolder"  --recursive=true`

This example results in a folder named `C:\myFolder\myBlobFolder` that contains all of the downloaded files.

### Download files by using wildcard characters

You can use the wildcard symbol (*) to provide partial file names.

```
azcopy copy "https://<storage-account-name>.<uri-suffix>/<container-name>/*<partial-file-name>*" "<local-folder-path>/"
```

**Example**

`azcopy copy "https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobFolder/*.pdf" "C:\myFolder"`

**Example (hierarchical namespace)**

`azcopy copy "https://mystorageaccount.dfs.core.windows.net/mycontainer/myBlobFolder/*.pdf" "C:\myFolder"`

> [!NOTE]
> Append the `--recursive=true` flag to upload files in all sub-folders.

## Copy blobs between storage accounts

You can use AzCopy to copy blobs to other storage accounts.

AzCopy uses the [Put Block From URL](https://docs.microsoft.com/rest/api/storageservices/put-block-from-url) API, so data is copied directly between storage servers. These copy operations don't use the network bandwidth of your computer.

This section contains the following examples:

> [!div class="checklist"]
> * Copy a blob to another storage account
> * Copy a folder to another storage account
> * Copy a containers to another storage account
> * Copy all containers, folders, and files to another storage account

### Copy a blob to another storage account

```
azcopy cp "https://<source-storage-account-name>.<uri-suffix>/<container-name>/<blob-path>" "https://<destination-storage-account-name>.<uri-suffix>/<container-name>/<blob-path>"
```

**Example**

`azcopy cp "https://mysourceaccount.blob.core.windows.net/mycontainer/myTextFile.txt" "https://mydestinationaccount.blob.core.windows.net/mycontainer/myTextFile.txt"`

**Example (hierarchical namespace)**

`azcopy cp "https://mysourceaccount.dfs.core.windows/mycontainer/myTextFile.txt" "https://mydestinationaccount.dfs.core.windows/mycontainer/myTextFile.txt"`

### Copy a folder to another storage account

```
azcopy cp "https://<source-storage-account-name>.<uri-suffix>/<container-name>/<folder-path>" "https://<destination-storage-account-name>.<uri-suffix>/<container-name>/<folder-path>" --recursive=true
```

**Example**

`azcopy cp "https://mysourceaccount.blob.core.windows.net/mycontainer/myBlobFolder" "https://mydestinationaccount.blob.core.windows.net/mycontainer/myBlobFolder" --recursive=true`

**Example (hierarchical namespace)**

`azcopy cp "https://mysourceaccount.dfs.core.windows/mycontainer/myBlobFolder" "https://mydestinationaccount.dfs.core.windows/mycontainer/myBlobFolder" --recursive=true`

### Copy a containers to another storage account

```
azcopy cp "https://<source-storage-account-name>.<uri-suffix>/<container-name>" "https://<destination-storage-account-name>.<uri-suffix>/<container-name>" --recursive=true
```

**Example**

`azcopy cp "https://mysourceaccount.blob.core.windows.net/mycontainer" "https://mydestinationaccount.blob.core.windows.net/mycontainer" --recursive=true`

**Example (hierarchical namespace)**

`azcopy cp "https://mysourceaccount.dfs.core.windows/mycontainer" "https://mydestinationaccount.dfs.core.windows/mycontainer" --recursive=true`

### Copy all containers, folders, and files to another storage account

```
azcopy cp "https://<source-storage-account-name>.<uri-suffix>/" "https://<destination-storage-account-name>.<uri-suffix>/" --recursive=true
```

**Example**

`azcopy cp "https://mysourceaccount.blob.core.windows.net" "https://mydestinationaccount.blob.core.windows.net" --recursive=true`

**Example (hierarchical namespace)**

`azcopy cp "https://mysourceaccount.dfs.core.windows" "https://mydestinationaccount.dfs.core.windows" --recursive=true`

## Synchronize files

You can synchronize the contents of a source folder to a folder in the destination. 

The `sync` command compares file names and last modified timestamps. Set the `--delete-destination` optional flag to a value of `true` or `prompt` to delete files in the destination folder if those files no longer exist in the source folder. 

If you set the `--delete-destination` flag to `true` AzCopy deletes files without providing a prompt. If you want a prompt to appear before AzCopy deletes a file, set the `--delete-destination` flag to `prompt`.

> [!NOTE]
> To prevent accidental deletions, make sure to enable the [soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete) feature before you use the `--delete-destination=prompt|true` flag.

### Synchronize a local file system with a container

```
azcopy sync "<local-folder-path>" "https://<storage-account-name>.<uri-suffix>/<container-name>" --recursive=true
```

**Example**

`azcopy sync "C:\myFolder" "https://<storage-account-name>.blob.core.windows.net/mycontainer" --recursive=true`

**Example (hierarchical namespace)**

`azcopy sync "C:\myFolder" "https://<storage-account-name>.dfs.core.windows/mycontainer" --recursive=true`

### Synchronize a container with a local file system

```
azcopy sync "https://<storage-account-name>.<uri-suffix>/<container-name>" "C:\myFolder" --recursive=true
```

**Example**

`\azcopy sync "https://mystorageaccount.blob.core.windows.net/mycontainer" "C:\myFolder" --recursive=true`

**Example (hierarchical namespace)**

`\azcopy sync "https://mystorageaccount.dfs.core.windows/mycontainer" "C:\myFolder" --recursive=true`

### Safety tips when using the sync command



## More examples

See these articles:

- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

- [Transfer data with AzCopy and Amazon S3 buckets](storage-use-azcopy-s3.md)