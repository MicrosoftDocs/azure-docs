---
title: Transfer data to or from Azure Blob storage by using AzCopy v10 | Microsoft Docs
description: This article contains a collection of AzCopy example commands that help you create containers, copy files, and synchronize directories between local file systems and containers.
author: normesta
ms.service: storage
ms.topic: how-to
ms.date: 04/10/2020
ms.author: normesta
ms.subservice: common
ms.reviewer: dineshm
---

# Transfer data with AzCopy and Blob storage

AzCopy is a command-line utility that you can use to copy data to, from, or between storage accounts. This article contains example commands that work with Blob storage.

> [!TIP]
> The examples in this article enclose path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

## Get started

See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy and learn about the ways that you can provide authorization credentials to the storage service.

> [!NOTE]
> The examples in this article assume that you've authenticated your identity by using the `AzCopy login` command. AzCopy then uses your Azure AD account to authorize access to data in Blob storage.
>
> If you'd rather use a SAS token to authorize access to blob data, then you can append that token to the resource URL in each AzCopy command.
>
> For example: `'https://<storage-account-name>.blob.core.windows.net/<container-name><SAS-token>'`.

## Create a container

You can use the [azcopy make](storage-ref-azcopy-make.md) command to create a container. The examples in this section create a container named `mycontainer`.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy make 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>'` |
| **Example** | `azcopy make 'https://mystorageaccount.blob.core.windows.net/mycontainer'` |
| **Example** (hierarchical namespace) | `azcopy make 'https://mystorageaccount.dfs.core.windows.net/mycontainer'` |

For detailed reference docs, see [azcopy make](storage-ref-azcopy-make.md).

## Upload files

You can use the [azcopy copy](storage-ref-azcopy-copy.md) command to upload files and directories from your local computer.

This section contains the following examples:

> [!div class="checklist"]
> * Upload a file
> * Upload a directory
> * Upload the contents of a directory 
> * Upload specific files

> [!TIP]
> You can tweak your upload operation by using optional flags. Here's a few examples.
>
> |Scenario|Flag|
> |---|---|
> |Upload files as Append Blobs or Page Blobs.|**--blob-type**=\[BlockBlob\|PageBlob\|AppendBlob\]|
> |Upload to a specific access tier (such as the archive tier).|**--block-blob-tier**=\[None\|Hot\|Cool\|Archive\]|
> 
> For a complete list, see [options](storage-ref-azcopy-copy.md#options).

### Upload a file

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy '<local-file-path>' 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<blob-name>'` |
| **Example** | `azcopy copy 'C:\myDirectory\myTextFile.txt' 'https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt'` |
| **Example** (hierarchical namespace) | `azcopy copy 'C:\myDirectory\myTextFile.txt' 'https://mystorageaccount.dfs.core.windows.net/mycontainer/myTextFile.txt'` |

You can also upload a file by using a wildcard symbol (*) anywhere in the file path or file name. For example: `'C:\myDirectory\*.txt'`, or `C:\my*\*.txt`.

### Upload a directory

This example copies a directory (and all of the files in that directory) to a blob container. The result is a directory in the container by the same name.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy '<local-directory-path>' 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>' --recursive` |
| **Example** | `azcopy copy 'C:\myDirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer' --recursive` |
| **Example** (hierarchical namespace) | `azcopy copy 'C:\myDirectory' 'https://mystorageaccount.dfs.core.windows.net/mycontainer' --recursive` |

To copy to a directory within the container, just specify the name of that directory in your command string.

|    |     |
|--------|-----------|
| **Example** | `azcopy copy 'C:\myDirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobDirectory' --recursive` |
| **Example** (hierarchical namespace) | `azcopy copy 'C:\myDirectory' 'https://mystorageaccount.dfs.core.windows.net/mycontainer/myBlobDirectory' --recursive` |

If you specify the name of a directory that does not exist in the container, AzCopy creates a new directory by that name.

### Upload the contents of a directory

You can upload the contents of a directory without copying the containing directory itself by using the wildcard symbol (*).

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy '<local-directory-path>\*' 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<directory-path>'` |
| **Example** | `azcopy copy 'C:\myDirectory\*' 'https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobDirectory'` |
| **Example** (hierarchical namespace) | `azcopy copy 'C:\myDirectory\*' 'https://mystorageaccount.dfs.core.windows.net/mycontainer/myBlobDirectory'` |

> [!NOTE]
> Append the `--recursive` flag to upload files in all sub-directories.

### Upload specific files

You can specify complete file names, or use partial names with wildcard characters (*).

#### Specify multiple complete file names

Use the [azcopy copy](storage-ref-azcopy-copy.md) command with the `--include-path` option. Separate individual file names by using a semicolon (`;`).

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy '<local-directory-path>' 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>' --include-path <semicolon-separated-file-list>` |
| **Example** | `azcopy copy 'C:\myDirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer' --include-path 'photos;documents\myFile.txt' --recursive` |
| **Example** (hierarchical namespace) | `azcopy copy 'C:\myDirectory' 'https://mystorageaccount.dfs.core.windows.net/mycontainer' --include-path 'photos;documents\myFile.txt' --recursive` |

In this example, AzCopy transfers the `C:\myDirectory\photos` directory and the `C:\myDirectory\documents\myFile.txt` file. You need to include the `--recursive` option to transfer all files in the `C:\myDirectory\photos` directory.

You can also exclude files by using the `--exclude-path` option. To learn more, see [azcopy copy](storage-ref-azcopy-copy.md) reference docs.

#### Use wildcard characters

Use the [azcopy copy](storage-ref-azcopy-copy.md) command with the `--include-pattern` option. Specify partial names that include the wildcard characters. Separate names by using a semicolin (`;`). 

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy '<local-directory-path>' 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>' --include-pattern <semicolon-separated-file-list-with-wildcard-characters>` |
| **Example** | `azcopy copy 'C:\myDirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer' --include-pattern 'myFile*.txt;*.pdf*'` |
| **Example** (hierarchical namespace) | `azcopy copy 'C:\myDirectory' 'https://mystorageaccount.dfs.core.windows.net/mycontainer' --include-pattern 'myFile*.txt;*.pdf*'` |

You can also exclude files by using the `--exclude-pattern` option. To learn more, see [azcopy copy](storage-ref-azcopy-copy.md) reference docs.

The `--include-pattern` and `--exclude-pattern` options apply only to filenames and not to the path.  If you want to copy all of the text files that exist in a directory tree, use the `–recursive` option to get the entire directory tree, and then use the `–include-pattern` and specify `*.txt` to get all of the text files.

## Download files

You can use the [azcopy copy](storage-ref-azcopy-copy.md) command to download blobs, directories, and containers to your local computer.

This section contains the following examples:

> [!div class="checklist"]
> * Download a file
> * Download a directory
> * Download the contents of a directory
> * Download specific files

> [!TIP]
> You can tweak your download operation by using optional flags. Here's a few examples.
>
> |Scenario|Flag|
> |---|---|
> |Automatically decompress files.|**--decompress**|
> |Specify how detailed you want your copy-related log entries to be.|**--log-level**=\[WARNING\|ERROR\|INFO\|NONE\]|
> |Specify if and how to overwrite the conflicting files and blobs at the destination.|**--overwrite**=\[true\|false\|ifSourceNewer\|prompt\]|
> 
> For a complete list, see [options](storage-ref-azcopy-copy.md#options).

> [!NOTE]
> If the `Content-md5` property value of a blob contains a hash, AzCopy calculates an MD5 hash for downloaded data and verifies that the MD5 hash stored in the blob's `Content-md5` property matches the calculated hash. If these values don't match, the download fails unless you override this behavior by appending `--check-md5=NoCheck` or `--check-md5=LogOnly` to the copy command.

### Download a file

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<blob-path>' '<local-file-path>'` |
| **Example** | `azcopy copy 'https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt' 'C:\myDirectory\myTextFile.txt'` |
| **Example** (hierarchical namespace) | `azcopy copy 'https://mystorageaccount.dfs.core.windows.net/mycontainer/myTextFile.txt' 'C:\myDirectory\myTextFile.txt'` |

### Download a directory

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<directory-path>' '<local-directory-path>' --recursive` |
| **Example** | `azcopy copy 'https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobDirectory' 'C:\myDirectory'  --recursive` |
| **Example** (hierarchical namespace) | `azcopy copy 'https://mystorageaccount.dfs.core.windows.net/mycontainer/myBlobDirectory' 'C:\myDirectory'  --recursive` |

This example results in a directory named `C:\myDirectory\myBlobDirectory` that contains all of the downloaded files.

### Download the contents of a directory

You can download the contents of a directory without copying the containing directory itself by using the wildcard symbol (*).

> [!NOTE]
> Currently, this scenario is supported only for accounts that don't have a hierarchical namespace.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<storage-account-name>.blob.core.windows.net/<container-name>/*' '<local-directory-path>/'` |
| **Example** | `azcopy copy 'https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobDirectory/*' 'C:\myDirectory'` |

> [!NOTE]
> Append the `--recursive` flag to download files in all sub-directories.

### Download specific files

You can specify complete file names, or use partial names with wildcard characters (*).

#### Specify multiple complete file names

Use the [azcopy copy](storage-ref-azcopy-copy.md) command with the `--include-path` option. Separate individual file names by using a semicolin (`;`).

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-or-directory-name>' '<local-directory-path>'  --include-path <semicolon-separated-file-list>` |
| **Example** | `azcopy copy 'https://mystorageaccount.blob.core.windows.net/mycontainer/FileDirectory' 'C:\myDirectory'  --include-path 'photos;documents\myFile.txt' --recursive` |
| **Example** (hierarchical namespace) | `azcopy copy 'https://mystorageaccount.dfs.core.windows.net/mycontainer/FileDirectory' 'C:\myDirectory'  --include-path 'photos;documents\myFile.txt'--recursive` |

In this example, AzCopy transfers the `https://mystorageaccount.blob.core.windows.net/mycontainer/FileDirectory/photos` directory and the `https://mystorageaccount.blob.core.windows.net/mycontainer/FileDirectory/documents/myFile.txt` file. You need to include the `--recursive` option to transfer all files in the `https://mystorageaccount.blob.core.windows.net/mycontainer/FileDirectory/photos` directory.

You can also exclude files by using the `--exclude-path` option. To learn more, see [azcopy copy](storage-ref-azcopy-copy.md) reference docs.

#### Use wildcard characters

Use the [azcopy copy](storage-ref-azcopy-copy.md) command with the `--include-pattern` option. Specify partial names that include the wildcard characters. Separate names by using a semicolin (`;`).

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-or-directory-name>' '<local-directory-path>' --include-pattern <semicolon-separated-file-list-with-wildcard-characters>` |
| **Example** | `azcopy copy 'https://mystorageaccount.blob.core.windows.net/mycontainer/FileDirectory' 'C:\myDirectory'  --include-pattern 'myFile*.txt;*.pdf*'` |
| **Example** (hierarchical namespace) | `azcopy copy 'https://mystorageaccount.dfs.core.windows.net/mycontainer/FileDirectory' 'C:\myDirectory'  --include-pattern 'myFile*.txt;*.pdf*'` |

You can also exclude files by using the `--exclude-pattern` option. To learn more, see [azcopy copy](storage-ref-azcopy-copy.md) reference docs.

The `--include-pattern` and `--exclude-pattern` options apply only to filenames and not to the path.  If you want to copy all of the text files that exist in a directory tree, use the `–recursive` option to get the entire directory tree, and then use the `–include-pattern` and specify `*.txt` to get all of the text files.

## Copy blobs between storage accounts

You can use AzCopy to copy blobs to other storage accounts. The copy operation is synchronous so when the command returns, that indicates that all files have been copied. 

AzCopy uses [server-to-server](https://docs.microsoft.com/rest/api/storageservices/put-block-from-url) [APIs](https://docs.microsoft.com/rest/api/storageservices/put-page-from-url), so data is copied directly between storage servers. These copy operations don't use the network bandwidth of your computer. You can increase the throughput of these operations by setting the value of the `AZCOPY_CONCURRENCY_VALUE` environment variable. To learn more, see [Optimize throughput](storage-use-azcopy-configure.md#optimize-throughput).

> [!NOTE]
> This scenario has the following limitations in the current release.
>
> - You have to append a SAS token to each source URL. If you provide authorization credentials by using Azure Active Directory (AD), you can omit the SAS token only from the destination URL. Make sure that you've set up the proper roles in your destination account. See [Option 1: Use Azure Active Directory](storage-use-azcopy-v10.md?toc=/azure/storage/blobs/toc.json#option-1-use-azure-active-directory).
>-  Premium block blob storage accounts don't support access tiers. Omit the access tier of a blob from the copy operation by setting the `s2s-preserve-access-tier` to `false` (For example: `--s2s-preserve-access-tier=false`).

This section contains the following examples:

> [!div class="checklist"]
> * Copy a blob to another storage account
> * Copy a directory to another storage account
> * Copy a container to another storage account
> * Copy all containers, directories, and files to another storage account

These examples also work with accounts that have a hierarchical namespace. [Multi-protocol access on Data Lake Storage](../blobs/data-lake-storage-multi-protocol-access.md) enables you to use the same URL syntax (`blob.core.windows.net`) on those accounts.

> [!TIP]
> You can tweak your copy operation by using optional flags. Here's a few examples.
>
> |Scenario|Flag|
> |---|---|
> |Copy files as Append Blobs or Page Blobs.|**--blob-type**=\[BlockBlob\|PageBlob\|AppendBlob\]|
> |Copy to a specific access tier (such as the archive tier).|**--block-blob-tier**=\[None\|Hot\|Cool\|Archive\]|
> |Automatically decompress files.|**--decompress**=\[gzip\|deflate\]|
> 
> For a complete list, see [options](storage-ref-azcopy-copy.md#options).

### Copy a blob to another storage account

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<source-storage-account-name>.blob.core.windows.net/<container-name>/<blob-path><SAS-token>' 'https://<destination-storage-account-name>.blob.core.windows.net/<container-name>/<blob-path>'` |
| **Example** | `azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer/myTextFile.txt?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer/myTextFile.txt'` |
| **Example** (hierarchical namespace) | `azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer/myTextFile.txt?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer/myTextFile.txt'` |

### Copy a directory to another storage account

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<source-storage-account-name>.blob.core.windows.net/<container-name>/<directory-path><SAS-token>' 'https://<destination-storage-account-name>.blob.core.windows.net/<container-name>' --recursive` |
| **Example** | `azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer/myBlobDirectory?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive` |
| **Example** (hierarchical namespace)| `azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer/myBlobDirectory?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive` |

### Copy a container to another storage account

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<source-storage-account-name>.blob.core.windows.net/<container-name><SAS-token>' 'https://<destination-storage-account-name>.blob.core.windows.net/<container-name>' --recursive` |
| **Example** | `azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive` |
| **Example** (hierarchical namespace)| `azcopy copy 'https://mysourceaccount.blob.core.windows.net/mycontainer?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive` |

### Copy all containers, directories, and blobs to another storage account

Use the same URL syntax (`blob.core.windows.net`) for accounts that have a hierarchical namespace.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<source-storage-account-name>.blob.core.windows.net/<SAS-token>' 'https://<destination-storage-account-name>.blob.core.windows.net/' --recursive` |
| **Example** | `azcopy copy 'https://mysourceaccount.blob.core.windows.net/?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net' --recursive` |
| **Example** (hierarchical namespace)| `azcopy copy 'https://mysourceaccount.blob.core.windows.net/?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.blob.core.windows.net' --recursive` |

## Synchronize files

You can synchronize the contents of a local file system with a blob container. You can also synchronize containers and virtual directories with one another. Synchronization is one-way. In other words, you choose which of these two endpoints is the source and which one is the destination. Synchronization also uses server to server APIs. The examples presented in this section also work with accounts that have a hierarchical namespace. 

> [!NOTE]
> The current release of AzCopy doesn't synchronize between other sources and destinations (For example: File storage or Amazon Web Services (AWS) S3 buckets).

The [sync](storage-ref-azcopy-sync.md) command compares file names and last modified timestamps. Set the `--delete-destination` optional flag to a value of `true` or `prompt` to delete files in the destination directory if those files no longer exist in the source directory.

If you set the `--delete-destination` flag to `true` AzCopy deletes files without providing a prompt. If you want a prompt to appear before AzCopy deletes a file, set the `--delete-destination` flag to `prompt`.

> [!NOTE]
> To prevent accidental deletions, make sure to enable the [soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete) feature before you use the `--delete-destination=prompt|true` flag.

> [!TIP]
> You can tweak your sync operation by using optional flags. Here's a few examples.
>
> |Scenario|Flag|
> |---|---|
> |Specify how strictly MD5 hashes should be validated when downloading.|**--check-md5**=\[NoCheck\|LogOnly\|FailIfDifferent\|FailIfDifferentOrMissing\]|
> |Exclude files based on a pattern.|**--exclude-path**|
> |Specify how detailed you want your sync-related log entries to be.|**--log-level**=\[WARNING\|ERROR\|INFO\|NONE\]|
> 
> For a complete list, see [options](storage-ref-azcopy-sync.md#options).

### Update a container with changes to a local file system

In this case, the container is the destination, and the local file system is the source. 

|    |     |
|--------|-----------|
| **Syntax** | `azcopy sync '<local-directory-path>' 'https://<storage-account-name>.blob.core.windows.net/<container-name>' --recursive` |
| **Example** | `azcopy sync 'C:\myDirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer' --recursive` |

### Update a local file system with changes to a container

In this case, the local file system is the destination, and the container is the source.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy sync 'https://<storage-account-name>.blob.core.windows.net/<container-name>' 'C:\myDirectory' --recursive` |
| **Example** | `azcopy sync 'https://mystorageaccount.blob.core.windows.net/mycontainer' 'C:\myDirectory' --recursive` |

### Update a container with changes in another container

The first container that appears in this command is the source. The second one is the destination.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy sync 'https://<source-storage-account-name>.blob.core.windows.net/<container-name>' 'https://<destination-storage-account-name>.blob.core.windows.net/<container-name>' --recursive` |
| **Example** | `azcopy sync 'https://mysourceaccount.blob.core.windows.net/mycontainer' 'https://mydestinationaccount.blob.core.windows.net/mycontainer' --recursive` |

### Update a directory with changes to a directory in another file share

The first directory that appears in this command is the source. The second one is the destination.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy sync 'https://<source-storage-account-name>.blob.core.windows.net/<container-name>/<directory-name>' 'https://<destination-storage-account-name>.blob.core.windows.net/<container-name>/<directory-name>' --recursive` |
| **Example** | `azcopy sync 'https://mysourceaccount.blob.core.windows.net/<container-name>/myDirectory' 'https://mydestinationaccount.blob.core.windows.net/mycontainer/myDirectory' --recursive` |

## Next steps

Find more examples in any of these articles:

- [Get started with AzCopy](storage-use-azcopy-v10.md)

- [Tutorial: Migrate on-premises data to cloud storage by using AzCopy](storage-use-azcopy-migrate-on-premises-data.md)

- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

- [Transfer data with AzCopy and Amazon S3 buckets](storage-use-azcopy-s3.md)

- [Configure, optimize, and troubleshoot AzCopy](storage-use-azcopy-configure.md)
