---
title: Set Azure Blob Storage properties & metadata with AzCopy v10 | Microsoft Docs
description: This article contains a collection of AzCopy example commands that help you set properties and metadata. 
author: normesta
ms.service: storage
ms.topic: how-to
ms.date: 06/30/2022
ms.author: normesta
ms.subservice: common

---

# Set blob properties and metadata by using AzCopy v10

You can set properties and metadata for Blob storage by using the AzCopy v10 command-line utility.

To see examples for other types of tasks such as uploading blobs, downloading blobs, synchronizing with Blob storage, or copying blobs between accounts, see the links presented in the [Next Steps](#next-steps) section of this article.

## Get started

See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy and learn about the ways that you can provide authorization credentials to the storage service.

> [!NOTE]
> The examples in this article assume that you've provided authorization credentials by using Azure Active Directory (Azure AD).
>
> If you'd rather use a SAS token to authorize access to blob data, then you can append that token to the resource URL in each AzCopy command. For example: `'https://<storage-account-name>.blob.core.windows.net/<container-name><SAS-token>'`.

## Example 1

You can use the [blah](storage-ref-azcopy-make.md) command to blah.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy make 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>'`

**Example**

```azcopy
https://mystorageaccount.blob.core.windows.net/mycontainer
```

**Example 1 (hierarchical namespace)**

```azcopy
https://mystorageaccount.dfs.core.windows.net/mycontainer
```

For detailed reference docs, see [blah](storage-ref-azcopy-make.md).

## Optional flags

You can tweak your upload operation by using optional flags. Here's a few examples.

|Scenario|Flag|
|---|---|
|Upload files as Append Blobs or Page Blobs.|**--blob-type**=\[BlockBlob\|PageBlob\|AppendBlob\]|
|Upload to a specific access tier (such as the archive tier).|**--block-blob-tier**=\[None\|Hot\|Cool\|Archive\]|

For a complete list, see [options](storage-ref-azcopy-copy.md#options).

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
