---
title: Replace Azure Blob Storage properties & metadata with AzCopy (preview)
description: This article contains a collection of AzCopy example commands that help you set properties and metadata. 
author: normesta
ms.service: azure-storage
ms.topic: how-to
ms.date: 07/21/2022
ms.author: normesta
ms.subservice: storage-common-concepts

---

# Replace blob properties and metadata by using AzCopy v10 (preview)

You can use AzCopy to change the [access tier](../blobs/access-tiers-overview.md) of one or more blobs and replace (_overwrite_) the metadata, and index tags of one or more blobs. 

> [!IMPORTANT]
> This capability is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Get started

See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy and learn about the ways that you can provide authorization credentials to the storage service.

> [!NOTE]
> The examples in this article assume that you've provided authorization credentials by using Microsoft Entra ID.
>
> If you'd rather use a SAS token to authorize access to blob data, then you can append that token to the resource URL in each AzCopy command. For example: `'https://<storage-account-name>.blob.core.windows.net/<container-name><SAS-token>'`.

## Change the access tier

To change the access tier of a blob, use the [azcopy set-properties](storage-ref-azcopy-set-properties.md) command and set the `-block-blob-tier` parameter to the name of the access tier. 

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy set-properties 'https://<storage-account-name>.blob.core.windows.net/<container-name>/<blob-name>' --block-blob-tier=<access-tier>`

**Example**

```azcopy
azcopy set-properties 'https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt' --block-blob-tier=hot

```

To change the access tier for all blobs in a virtual directory, refer to the virtual directory name instead of the blob name, and then append `--recursive=true` to the command.

**Example**

```azcopy
azcopy set-properties 'https://mystorageaccount.blob.core.windows.net/mycontainer/myvirtualdirectory' --block-blob-tier=hot --recursive=true
```

To _rehydrate_ a blob from the archive tier to an online tier, set the `--rehydrate-priority` to `standard` or `high`. By default, this parameter is set to `standard`. To learn more about the trade offs of each option, see [Rehydration priority](../blobs/archive-rehydrate-overview.md#rehydration-priority). 

**Example**

```azcopy
azcopy set-properties 'https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt' --block-blob-tier=hot --rehydrate-priority=high
```

## Replace metadata

To replace the metadata of a blob, use the [azcopy set-properties](storage-ref-azcopy-set-properties.md) command and set the `--metadata` parameter to one or more key-value pairs.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy set-properties 'https://<storage-account-name>.blob.core.windows.net/<container-name>/<blob-name>' --metadata=<key>=<value>;<key>=<value>`

**Example**

```azcopy
azcopy set-properties 'https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt' --metadata=mykey1=myvalue1;mykey2=myvalue2
```

To replace the metadata for all blobs in a virtual directory, refer to the virtual directory name instead of the blob name, and then append `--recursive=true` to the command.

**Example**

```azcopy
azcopy set-properties 'https://mystorageaccount.blob.core.windows.net/mycontainer/myvirtualdirectory' --metadata=mykey1=myvalue1;mykey2=myvalue2 --recursive=true
```

To clear metadata, omit the tags and append `--metadata=clear` to the end of the command.

**Example**

```azcopy
azcopy set-properties 'https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt' --metadata=clear
```

## Replace index tags

To replace the index tags of a blob, use the [azcopy set-properties](storage-ref-azcopy-set-properties.md) command and set the `--blob-tags` parameter to one or more key-value pairs. Setting blob index tags can be performed by the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) and by anyone with a Shared Access Signature that has permission to access the blob's tags (the `t` SAS permission). In addition, RBAC users with the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` permission can perform this operation.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy set-properties 'https://<storage-account-name>.blob.core.windows.net/<container-name>/<blob-name>' --blob-tags=<tag>=<value>;<tag>=<value>`

**Example**

```azcopy
azcopy set-properties 'https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt' --blob-tags=mytag1=mytag1value;mytag2=mytag2value
```

To replace the index tags for all blobs in a virtual directory, refer to the virtual directory name instead of the blob name, and then append `--recursive=true` to the command.

**Example**

```azcopy
azcopy set-properties 'https://mystorageaccount.blob.core.windows.net/mycontainer/myvirtualdirectory' --blob-tags=mytag1=mytag1value;mytag2=mytag2value
```

## Next steps

Find more examples in these articles:

- [Examples: Upload](storage-use-azcopy-blobs-upload.md)
- [Examples: Download](storage-use-azcopy-blobs-download.md)
- [Examples: Copy between accounts](storage-use-azcopy-blobs-copy.md)
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
