---
title: Copy blobs between Azure storage accounts with AzCopy v10
description: This article contains a collection of AzCopy example commands that help you copy blobs between storage accounts.
author: normesta
ms.service: azure-storage
ms.topic: how-to
ms.date: 10/31/2023
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: dineshm
---

# Copy blobs between Azure storage accounts by using AzCopy

You can copy blobs, directories, and containers between storage accounts by using the AzCopy v10 command-line utility.

To see examples for other types of tasks such as uploading files, downloading blobs, and synchronizing with Blob storage, see the links presented in the [Next Steps](#next-steps) section of this article.

AzCopy uses [server-to-server](/rest/api/storageservices/put-block-from-url) [APIs](/rest/api/storageservices/put-page-from-url), so data is copied directly between storage servers.

## Get started

See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy and learn about the ways that you can provide authorization credentials to the storage service.

> [!NOTE]
> The examples in this article assume that you've provided authorization credentials by using Microsoft Entra ID and that your Microsoft Entra identity has the proper role assignments for both source and destination accounts. 
>
> Alternatively you can append a SAS token to either the source or destination URL in each AzCopy command. For example: `azcopy copy 'https://<source-storage-account-name>.blob.core.windows.net/<container-name>/<blob-path><SAS-token>' 'https://<destination-storage-account-name>.blob.core.windows.net/<container-name>/<blob-path><SAS-token>'`.

## Guidelines

Apply the following guidelines to your AzCopy commands.

- If you're using Microsoft Entra authorization for both source and destination, then both accounts must belong to the same Microsoft Entra tenant.

- Your client must have network access to both the source and destination storage accounts. To learn how to configure the network settings for each storage account, see [Configure Azure Storage firewalls and virtual networks](storage-network-security.md?toc=/azure/storage/blobs/toc.json).

-  If you copy to a premium block blob storage account, omit the access tier of a blob from the copy operation by setting the `s2s-preserve-access-tier` to `false` (For example: `--s2s-preserve-access-tier=false`). Premium block blob storage accounts don't support access tiers.

- You can increase the throughput of copy operations by setting the value of the `AZCOPY_CONCURRENCY_VALUE` environment variable. To learn more, see [Increase Concurrency](storage-use-azcopy-optimize.md#increase-concurrency).

- If the source blobs have index tags, and you want to retain those tags, you'll have to reapply them to the destination blobs. For information about how to set index tags, see the [Copy blobs to another storage account with index tags](#copy-between-accounts-and-add-index-tags) section of this article.

## Copy a blob

Copy a blob to another storage account by using the [azcopy copy](storage-ref-azcopy-copy.md) command.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy copy 'https://<source-storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<blob-path>' 'https://<destination-storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<blob-path>'`

**Example**

```azcopy
azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer/myTextFile.txt' 'https://mydestinationaccount.blob.core.windows.net/mycontainer/myTextFile.txt'
```

**Example (Data Lake Storage endpoints)**

```azcopy
azcopy copy 'https://mysourceaccount.dfs.core.windows.net/mycontainer/myTextFile.txt' 'https://mydestinationaccount.dfs.core.windows.net/mycontainer/myTextFile.txt'
```

The copy operation is synchronous so when the command returns, that indicates that all files have been copied.

## Copy a directory

Copy a directory to another storage account by using the [azcopy copy](storage-ref-azcopy-copy.md) command.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy copy 'https://<source-storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<directory-path>' 'https://<destination-storage-account-name>.<blob or dfs>.core.windows.net/<container-name>' --recursive`

**Example**

```azcopy
azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer/myBlobDirectory' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive
```

**Example (Data Lake Storage endpoints)**

```azcopy
azcopy copy 'https://mysourceaccount.dfs.core.windows.net/mycontainer/myBlobDirectory' 'https://mydestinationaccount.dfs.core.windows.net/mycontainer' --recursive
```

The copy operation is synchronous. All files have been copied when the command returns.

## Copy a container

Copy a container to another storage account by using the [azcopy copy](storage-ref-azcopy-copy.md) command.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy copy 'https://<source-storage-account-name>.<blob or dfs>.core.windows.net/<container-name>' 'https://<destination-storage-account-name>.<blob or dfs>.core.windows.net/<container-name>' --recursive`

**Example**

```azcopy
azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive
```

**Example (Data Lake Storage endpoints)**

```azcopy
azcopy copy 'https://mysourceaccount.dfs.core.windows.net/mycontainer' 'https://mydestinationaccount.dfs.core.windows.net/mycontainer' --recursive
```

The copy operation is synchronous. All files have been copied when the command returns.

## Copy containers, directories, and blobs

Copy all containers, directories, and blobs to another storage account by using the [azcopy copy](storage-ref-azcopy-copy.md) command.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy copy 'https://<source-storage-account-name>.<blob or dfs>.core.windows.net/' 'https://<destination-storage-account-name>.<blob or dfs>.core.windows.net/' --recursive`

**Example**

```azcopy
azcopy copy 'https://mysourceaccount.blob.core.windows.net/' 'https://mydestinationaccount.blob.core.windows.net' --recursive
```

**Example (Data Lake Storage endpoints)**

```azcopy
azcopy copy 'https://mysourceaccount.dfs.core.windows.net/' 'https://mydestinationaccount.dfs.core.windows.net' --recursive
```

The copy operation is synchronous so when the command returns, that indicates that all files have been copied.

<a id="copy-between-accounts-and-add-index-tags"></a>

## Copy blobs and add index tags

Copy blobs to another storage account and add [blob index tags](../blobs/storage-manage-find-blobs.md) to the target blob.

If you're using Microsoft Entra authorization, your security principal must be assigned the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role, or it must be given permission to the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftstorage) via a custom Azure role. If you're using a Shared Access Signature (SAS) token, that token must provide access to the blob's tags via the `t` SAS permission.

To add tags, use the `--blob-tags` option along with a URL encoded key-value pair.

For example, to add the key `my tag` and a value `my tag value`, you would add `--blob-tags='my%20tag=my%20tag%20value'` to the destination parameter.

Separate multiple index tags by using an ampersand (`&`).  For example, if you want to add a key `my second tag` and a value `my second tag value`, the complete option string would be `--blob-tags='my%20tag=my%20tag%20value&my%20second%20tag=my%20second%20tag%20value'`.

The following examples show how to use the `--blob-tags` option.

> [!TIP]
> These examples enclose path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Blob example**

```azcopy

azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer/myTextFile.txt' 'https://mydestinationaccount.blob.core.windows.net/mycontainer/myTextFile.txt' --blob-tags='my%20tag=my%20tag%20value&my%20second%20tag=my%20second%20tag%20value'
```

**Directory example**

```azcopy
azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer/myBlobDirectory' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive --blob-tags='my%20tag=my%20tag%20value&my%20second%20tag=my%20second%20tag%20value'
```

 **Container example**

```azcopy
azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive --blob-tags='my%20tag=my%20tag%20value&my%20second%20tag=my%20second%20tag%20value'
```

**Account example**

```azcopy
azcopy copy 'https://mysourceaccount.blob.core.windows.net/' 'https://mydestinationaccount.blob.core.windows.net' --recursive --blob-tags='my%20tag=my%20tag%20value&my%20second%20tag=my%20second%20tag%20value'
```

The copy operation is synchronous. All files have been copied when the command returns.

> [!NOTE]
> If you specify a directory, container, or account for the source, all the blobs that are copied to the destination will have the same tags that you specify in the command.

## Copy with optional flags

You can tweak your copy operation by using optional flags. Here's a few examples.

|Scenario|Flag|
|---|---|
|Copy blobs as Block, Page, or Append Blobs.|**--blob-type**=\[BlockBlob\|PageBlob\|AppendBlob\]|
|Copy to a specific access tier (such as the archive tier).|**--block-blob-tier**=\[None\|Hot\|Cool\|Archive\]|
|Automatically decompress files.|**--decompress**=\[gzip\|deflate\]|

For a complete list, see [options](storage-ref-azcopy-copy.md#options).

## Next steps

Find more examples in these articles:

- [Examples: Upload](storage-use-azcopy-blobs-upload.md)
- [Examples: Download](storage-use-azcopy-blobs-download.md)
- [Examples: Synchronize](storage-use-azcopy-blobs-synchronize.md)
- [Examples: Amazon S3 buckets](storage-use-azcopy-s3.md)
- [Examples: Google Cloud Storage](storage-use-azcopy-google-cloud.md)
- [Examples: Azure Files](storage-use-azcopy-files.md)
- [Tutorial: Migrate on-premises data to cloud storage by using AzCopy](storage-use-azcopy-migrate-on-premises-data.md)

See these articles to configure settings, optimize performance, and troubleshoot issues:

- [AzCopy configuration settings](storage-ref-azcopy-configuration-settings.md)
- [Optimize the performance of AzCopy](storage-use-azcopy-optimize.md)
- [Find errors and resume jobs by using log and plan files in AzCopy](storage-use-azcopy-configure.md)
- [Troubleshoot problems with AzCopy v10](storage-use-azcopy-troubleshoot.md)
