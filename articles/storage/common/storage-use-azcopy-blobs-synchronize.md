---
title: Synchronize with Azure Blob storage by using AzCopy v10 | Microsoft Docs
description: This article contains a collection of AzCopy example commands that help you synchronize with Azure Blob storage. 
author: normesta
ms.service: storage
ms.topic: how-to
ms.date: 12/01/2020
ms.author: normesta
ms.subservice: common
ms.reviewer: dineshm
---

# Synchronize with Azure Blob storage by using AzCopy v10

AzCopy is a command-line utility that you can use to copy data to, from, or between storage accounts. This article contains example commands that help you synchronize local storage with Azure Blob storage.

You can synchronize the contents of a local file system with a blob container. You can also synchronize containers and virtual directories with one another. Synchronization is one-way. In other words, you choose which of these two endpoints is the source and which one is the destination. Synchronization also uses server to server APIs. The examples presented in this section also work with accounts that have a hierarchical namespace. 

> [!NOTE]
> The current release of AzCopy doesn't synchronize between other sources and destinations (For example: File storage or Amazon Web Services (AWS) S3 buckets).

## Get started

See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy and learn about the ways that you can provide authorization credentials to the storage service.

> [!NOTE]
> The examples in this article assume that you've authenticated your identity by using the `AzCopy login` command. AzCopy then uses your Azure AD account to authorize access to data in Blob storage.
>
> If you'd rather use a SAS token to authorize access to blob data, then you can append that token to the resource URL in each AzCopy command.
>
> For example: `'https://<storage-account-name>.blob.core.windows.net/<container-name><SAS-token>'`.

## Guidelines

- Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes (''). The examples in this article enclose path arguments with single quotes ('').  

- The [sync](storage-ref-azcopy-sync.md) command compares file names and last modified timestamps. Set the `--delete-destination` optional flag to a value of `true` or `prompt` to delete files in the destination directory if those files no longer exist in the source directory.

- If you set the `--delete-destination` flag to `true` AzCopy deletes files without providing a prompt. If you want a prompt to appear before AzCopy deletes a file, set the `--delete-destination` flag to `prompt`.

- To prevent accidental deletions, make sure to enable the [soft delete](../blobs/soft-delete-blob-overview.md) feature before you use the `--delete-destination=prompt|true` flag.

## Update a container with changes to a local file system

In this case, the container is the destination, and the local file system is the source. 

|    |     |
|--------|-----------|
| **Syntax** | `azcopy sync '<local-directory-path>' 'https://<storage-account-name>.blob.core.windows.net/<container-name>' --recursive` |
| **Example** | `azcopy sync 'C:\myDirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer' --recursive` |

## Update a local file system with changes to a container

In this case, the local file system is the destination, and the container is the source.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy sync 'https://<storage-account-name>.blob.core.windows.net/<container-name>' 'C:\myDirectory' --recursive` |
| **Example** | `azcopy sync 'https://mystorageaccount.blob.core.windows.net/mycontainer' 'C:\myDirectory' --recursive` |

## Update a container with changes in another container

The first container that appears in this command is the source. The second one is the destination.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy sync 'https://<source-storage-account-name>.blob.core.windows.net/<container-name>' 'https://<destination-storage-account-name>.blob.core.windows.net/<container-name>' --recursive` |
| **Example** | `azcopy sync 'https://mysourceaccount.blob.core.windows.net/mycontainer' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive` |

## Update a directory with changes to a directory in another file share

The first directory that appears in this command is the source. The second one is the destination.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy sync 'https://<source-storage-account-name>.blob.core.windows.net/<container-name>/<directory-name>' 'https://<destination-storage-account-name>.blob.core.windows.net/<container-name>/<directory-name>' --recursive` |
| **Example** | `azcopy sync 'https://mysourceaccount.blob.core.windows.net/<container-name>/myDirectory' 'https://mydestinationaccount.blob.core.windows.net/mycontainer/myDirectory' --recursive` |

## Use optional flags

You can tweak your sync operation by using optional flags. Here's a few examples.

|Scenario|Flag|
|---|---|
|Specify how strictly MD5 hashes should be validated when downloading.|**--check-md5**=\[NoCheck\|LogOnly\|FailIfDifferent\|FailIfDifferentOrMissing\]|
|Exclude files based on a pattern.|**--exclude-path**|
|Specify how detailed you want your sync-related log entries to be.|**--log-level**=\[WARNING\|ERROR\|INFO\|NONE\]|

For a complete list, see [options](storage-ref-azcopy-sync.md#options).

## Next steps

Find more examples in any of these articles:

- [Get started with AzCopy](storage-use-azcopy-v10.md)

- [Tutorial: Migrate on-premises data to cloud storage by using AzCopy](storage-use-azcopy-migrate-on-premises-data.md)

- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

- [Transfer data with AzCopy and Amazon S3 buckets](storage-use-azcopy-s3.md)

- [Configure, optimize, and troubleshoot AzCopy](storage-use-azcopy-configure.md)