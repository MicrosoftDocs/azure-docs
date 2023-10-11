---
title: Synchronize with Azure Blob storage by using AzCopy v10
description: This article contains a collection of AzCopy example commands that help you synchronize with Azure Blob storage. 
author: normesta
ms.service: azure-storage
ms.topic: how-to
ms.date: 10/02/2022
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: dineshm
---

# Synchronize with Azure Blob storage by using AzCopy

You can synchronize local storage with Azure Blob storage by using the AzCopy v10 command-line utility.

You can synchronize the contents of a local file system with a blob container. You can also synchronize containers and virtual directories with one another. Synchronization is one way. In other words, you choose which of these two endpoints is the source and which one is the destination. Synchronization also uses server to server APIs. The examples presented in this section also work with accounts that have a hierarchical namespace.

> [!NOTE]
> The current release of AzCopy doesn't synchronize between other sources and destinations (For example: File storage or Amazon Web Services (AWS) S3 buckets).

To see examples for other types of tasks such as uploading files, downloading blobs, or copying blobs between accounts, see the links presented in the [Next Steps](#next-steps) section of this article.

## Get started

See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy and learn about the ways that you can provide authorization credentials to the storage service.

> [!NOTE]
> The examples in this article assume that you've provided authorization credentials by using Microsoft Entra ID.
>
> If you'd rather use a SAS token to authorize access to blob data, then you can append that token to the resource URL in each AzCopy command. For example: `'https://<storage-account-name>.blob.core.windows.net/<container-name><SAS-token>'`.

## Guidelines

[!INCLUDE [Azcopy sync command general guidelines](../../../includes/azure-storage-azcopy-sync-guidelines.md)]

- To prevent accidental deletions, make sure to enable the [soft delete](../blobs/soft-delete-blob-overview.md) feature before you use the `--delete-destination=prompt|true` flag.

## Update a container with changes to a local file system

In this case, the container is the destination, and the local file system is the source.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy sync '<local-directory-path>' 'https://<storage-account-name>.blob.core.windows.net/<container-name>' --recursive`

**Example**

```azcopy
azcopy sync 'C:\myDirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer' --recursive
```

## Update a local file system with changes to a container

In this case, the local file system is the destination, and the container is the source.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy sync 'https://<storage-account-name>.blob.core.windows.net/<container-name>' 'C:\myDirectory' --recursive`

**Example**

```azcopy
azcopy sync 'https://mystorageaccount.blob.core.windows.net/mycontainer' 'C:\myDirectory' --recursive
```

## Update a container with changes in another container

The first container that appears in this command is the source. The second one is the destination. Make sure to append a SAS token to each source URL.

If you provide authorization credentials by using Microsoft Entra ID, you can omit the SAS token only from the destination URL. Make sure that you've set up the proper roles in your destination account. See [Option 1: Use Microsoft Entra ID](storage-use-azcopy-v10.md?toc=/azure/storage/blobs/toc.json#option-1-use-azure-active-directory).

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy sync 'https://<source-storage-account-name>.blob.core.windows.net/<container-name>/<SAS-token>' 'https://<destination-storage-account-name>.blob.core.windows.net/<container-name>' --recursive`

**Example**

```azcopy
azcopy sync 'https://mysourceaccount.blob.core.windows.net/mycontainer?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive
```

## Update a directory with changes to a directory in another container

The first directory that appears in this command is the source. The second one is the destination. Make sure to append a SAS token to each source URL.

If you provide authorization credentials by using Microsoft Entra ID, you can omit the SAS token only from the destination URL. Make sure that you've set up the proper roles in your destination account. See [Option 1: Use Microsoft Entra ID](storage-use-azcopy-v10.md?toc=/azure/storage/blobs/toc.json#option-1-use-azure-active-directory).

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy sync 'https://<source-storage-account-name>.blob.core.windows.net/<container-name>/<directory-name>/<SAS-token>' 'https://<destination-storage-account-name>.blob.core.windows.net/<container-name>/<directory-name>' --recursive`

**Example**

```azcopy
azcopy sync 'https://mysourceaccount.blob.core.windows.net/<container-name>/myDirectory?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer/myDirectory' --recursive
```

## Synchronize with optional flags

You can tweak your sync operation by using optional flags. Here's a few examples.

|Scenario|Flag|
|---|---|
|Specify how strictly MD5 hashes should be validated when downloading.|**--check-md5**=\[NoCheck\|LogOnly\|FailIfDifferent\|FailIfDifferentOrMissing\]|
|Exclude files based on a pattern.|**--exclude-path**|
|Specify how detailed you want your sync-related log entries to be.|**--log-level**=\[WARNING\|ERROR\|INFO\|NONE\]|

For a complete list of flags, see [options](storage-ref-azcopy-sync.md#options).

> [!NOTE]
> The `--recursive` flag is set to `true` by default. The `--exclude-pattern` and `--include-pattern` flags apply to only to file names and not other parts of the file path.

## Next steps

Find more examples in these articles:

- [Examples: Upload](storage-use-azcopy-blobs-upload.md)
- [Examples: Download](storage-use-azcopy-blobs-download.md)
- [Examples: Copy between accounts](storage-use-azcopy-blobs-copy.md)
- [Examples: Amazon S3 buckets](storage-use-azcopy-s3.md)
- [Examples: Google Cloud Storage](storage-use-azcopy-google-cloud.md)
- [Examples: Azure Files](storage-use-azcopy-files.md)
- [Tutorial: Migrate on-premises data to cloud storage by using AzCopy](storage-use-azcopy-migrate-on-premises-data.md)

See these articles to configure settings, optimize performance, and troubleshoot issues:

- [AzCopy configuration settings](storage-ref-azcopy-configuration-settings.md)
- [Optimize the performance of AzCopy](storage-use-azcopy-optimize.md)
- [Find errors and resume jobs by using log and plan files in AzCopy](storage-use-azcopy-configure.md)
- [Troubleshoot problems with AzCopy v10](storage-use-azcopy-troubleshoot.md)
