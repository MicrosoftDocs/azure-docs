---
title: Copy blobs between Azure storage accounts with AzCopy v10 | Microsoft Docs
description: This article contains a collection of AzCopy example commands that help you copy blobs between storage accounts.
author: normesta
ms.service: storage
ms.topic: how-to
ms.date: 12/01/2020
ms.author: normesta
ms.subservice: common
ms.reviewer: dineshm
---

# Copy blobs between Azure storage accounts by using AzCopy v10

AzCopy is a command-line utility that you can use to copy data to, from, or between storage accounts. This article contains example commands that help you copy blobs between storage accounts. For code examples that help you upload, download or synchronize with Blob storage, see [Transfer data](storage-use-azcopy-v10.md#transfer-data).

The copy operation is synchronous so when the command returns, that indicates that all files have been copied. 

AzCopy uses [server-to-server](/rest/api/storageservices/put-block-from-url) [APIs](/rest/api/storageservices/put-page-from-url), so data is copied directly between storage servers. These copy operations don't use the network bandwidth of your computer. You can increase the throughput of these operations by setting the value of the `AZCOPY_CONCURRENCY_VALUE` environment variable. To learn more, see [Optimize throughput](storage-use-azcopy-configure.md#optimize-throughput).

## Get started

See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy and learn about the ways that you can provide authorization credentials to the storage service.

The examples in this article assume that you've authenticated your identity by using the `AzCopy login` command. AzCopy then uses your Azure AD account to authorize access to data in Blob storage. If you'd rather use a SAS token to authorize access to blob data, then you can append that token to the resource URL in each AzCopy command. For example: `'https://<storage-account-name>.blob.core.windows.net/<container-name><SAS-token>'`.

### Guidelines

Use the following guidelines when copying blobs between accounts.

- Append a SAS token to each source URL. If you provide authorization credentials by using Azure Active Directory (AD), you can omit the SAS token only from the destination URL. Make sure that you've set up the proper roles in your destination account. See [Option 1: Use Azure Active Directory](storage-use-azcopy-v10.md?toc=/azure/storage/blobs/toc.json#option-1-use-azure-active-directory).

-  Premium block blob storage accounts don't support access tiers. If you are copying to a premium block blob storage account, omit the access tier of a blob from the copy operation by setting the `s2s-preserve-access-tier` to `false` (For example: `--s2s-preserve-access-tier=false`).

- These examples also work with accounts that have a hierarchical namespace. However, if you plan to copy to or from those accounts, don't use (`dfs.core.windows.net`) in the URL syntax. Instead, use the same URL syntax (`blob.core.windows.net`) as you would with an account that doesn't have a hierarchical namespace. [Multi-protocol access on Data Lake Storage](../blobs/data-lake-storage-multi-protocol-access.md) enables you to use that syntax. It is the only supported syntax for account to account copy scenarios. 

- The examples in this article enclose path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

## Copy a blob

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<source-storage-account-name>.blob.core.windows.net/<container-name>/<blob-path><SAS-token>' 'https://<destination-storage-account-name>.blob.core.windows.net/<container-name>/<blob-path>'` |
| **Example** | `azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer/myTextFile.txt?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer/myTextFile.txt'` |
| **Example** (hierarchical namespace) | `azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer/myTextFile.txt?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer/myTextFile.txt'` |

> [!NOTE]
> If the source blobs have index tags, and you want to retain those tags, you'll have to re-apply them to the destination blobs. For information about how to set index tags, see the [Copy blobs to another storage account with index tags](#copy-between-accounts-and-add-index-tags) section of this article. 

## Copy a directory

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<source-storage-account-name>.blob.core.windows.net/<container-name>/<directory-path><SAS-token>' 'https://<destination-storage-account-name>.blob.core.windows.net/<container-name>' --recursive` |
| **Example** | `azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer/myBlobDirectory?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive` |
| **Example** (hierarchical namespace)| `azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer/myBlobDirectory?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive` |

> [!NOTE]
> If the source blobs have index tags, and you want to retain those tags, you'll have to re-apply them to the destination blobs. For information about how to set index tags, see the [Copy blobs to another storage account with index tags](#copy-between-accounts-and-add-index-tags) section of this article. 

## Copy a container

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<source-storage-account-name>.blob.core.windows.net/<container-name><SAS-token>' 'https://<destination-storage-account-name>.blob.core.windows.net/<container-name>' --recursive` |
| **Example** | `azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive` |
| **Example** (hierarchical namespace)| `azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive` |

> [!NOTE]
> If the source blobs have index tags, and you want to retain those tags, you'll have to re-apply them to the destination blobs. For information about how to set index tags, see the [Copy blobs to another storage account with index tags](#copy-between-accounts-and-add-index-tags) section of this article. 

## Copy containers, directories, and blobs

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<source-storage-account-name>.blob.core.windows.net/<SAS-token>' 'https://<destination-storage-account-name>.blob.core.windows.net/' --recursive` |
| **Example** | `azcopy copy 'https://mysourceaccount.blob.core.windows.net/?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net' --recursive` |
| **Example** (hierarchical namespace)| `azcopy copy 'https://mysourceaccount.blob.core.windows.net/?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net' --recursive` |

> [!NOTE]
> If the source blobs have index tags, and you want to retain those tags, you'll have to re-apply them to the destination blobs. For information about how to set index tags, see the **Copy blobs to another storage account with index tags** section below. 

<a id="copy-between-accounts-and-add-index-tags"></a>

## Copy blobs and add index tags

You can copy blobs to another storage account and add [blob index tags(preview)](../blobs/storage-manage-find-blobs.md) to the target blob.

If you're using Azure AD authorization, your security principal must be assigned the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role or it must be given permission to the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftstorage) via a custom Azure role. If you're using a Shared Access Signature (SAS) token, that token must provide access to the blob's tags via the `t` SAS permission.

To add tags, use the `--blob-tags` option along with a URL encoded key-value pair. 

For example, to add the a key `my tag` and a value `my tag value`, you would add `--blob-tags='my%20tag=my%20tag%20value'` to the destination parameter. 

Separate multiple index tags by using an ampersand (`&`).  For example, if you want to add a key `my second tag` and a value `my second tag value`, the complete option string would be `--blob-tags='my%20tag=my%20tag%20value&my%20second%20tag=my%20second%20tag%20value'`.

The following examples show how to use the `--blob-tags` option.

|    |     |
|--------|-----------|
| **Blob** | `azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer/myTextFile.txt?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer/myTextFile.txt' --blob-tags='my%20tag=my%20tag%20value&my%20second%20tag=my%20second%20tag%20value'` |
| **Directory** | `azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer/myBlobDirectory?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive --blob-tags='my%20tag=my%20tag%20value&my%20second%20tag=my%20second%20tag%20value'` |
| **Container** | `azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive --blob-tags="--blob-tags='my%20tag=my%20tag%20value&my%20second%20tag=my%20second%20tag%20value'` |
| **Account** | `azcopy copy 'https://mysourceaccount.blob.core.windows.net/?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net' --recursive --blob-tags="--blob-tags='my%20tag=my%20tag%20value&my%20second%20tag=my%20second%20tag%20value'` |

> [!NOTE]
> If you specify a directory, container, or account for the source, all the blobs that are copied to the destination will have the same tags that you specify in the command.

## Use Flags

You can use AzCopy to copy blobs to other storage accounts. 

> [!TIP]
> You can tweak your copy operation by using optional flags. Here's a few examples.
>
> |Scenario|Flag|
> |---|---|
> |Copy blobs as Block, Page, or Append Blobs.|**--blob-type**=\[BlockBlob\|PageBlob\|AppendBlob\]|
> |Copy to a specific access tier (such as the archive tier).|**--block-blob-tier**=\[None\|Hot\|Cool\|Archive\]|
> |Automatically decompress files.|**--decompress**=\[gzip\|deflate\]|
> 
> For a complete list, see [options](storage-ref-azcopy-copy.md#options). 

## Next steps

Find more examples in any of these articles:

- [Get started with AzCopy](storage-use-azcopy-v10.md)

- [Transfer data](storage-use-azcopy-v10.md#transfer-data)

- [Tutorial: Migrate on-premises data to cloud storage by using AzCopy](storage-use-azcopy-migrate-on-premises-data.md)

- [Configure, optimize, and troubleshoot AzCopy](storage-use-azcopy-configure.md)