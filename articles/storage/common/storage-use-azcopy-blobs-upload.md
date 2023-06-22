---
title: Upload files to Azure Blob storage by using AzCopy v10
description: This article contains a collection of AzCopy example commands that help you upload files to Azure Blob storage. 
author: normesta
ms.service: azure-storage
ms.topic: how-to
ms.date: 09/22/2022
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: dineshm
---

# Upload files to Azure Blob storage by using AzCopy

You can upload files and directories to Blob storage by using the AzCopy v10 command-line utility.

To see examples for other types of tasks such as downloading blobs, synchronizing with Blob storage, or copying blobs between accounts, see the links presented in the [Next Steps](#next-steps) section of this article.

## Get started

See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy and learn about the ways that you can provide authorization credentials to the storage service.

> [!NOTE]
> The examples in this article assume that you've provided authorization credentials by using Azure Active Directory (Azure AD).
>
> If you'd rather use a SAS token to authorize access to blob data, then you can append that token to the resource URL in each AzCopy command. For example: `'https://<storage-account-name>.blob.core.windows.net/<container-name><SAS-token>'`.

## Create a container

You can use the [azcopy make](storage-ref-azcopy-make.md) command to create a container.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy make 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>'`

**Example**

```azcopy
azcopy make 'https://mystorageaccount.blob.core.windows.net/mycontainer'
```

**Example (hierarchical namespace)**

```azcopy
azcopy make 'https://mystorageaccount.dfs.core.windows.net/mycontainer'
```

For detailed reference docs, see [azcopy make](storage-ref-azcopy-make.md).

## Upload a file

Upload a file by using the [azcopy copy](storage-ref-azcopy-copy.md) command.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy copy '<local-file-path>' 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<blob-name>'`

**Example**

```azcopy
azcopy copy 'C:\myDirectory\myTextFile.txt' 'https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt'
```

**Example (hierarchical namespace)**

```azcopy
azcopy copy 'C:\myDirectory\myTextFile.txt' 'https://mystorageaccount.dfs.core.windows.net/mycontainer/myTextFile.txt'
```

You can also upload a file by using a wildcard symbol (*) anywhere in the file path or file name. For example: `'C:\myDirectory\*.txt'`, or `C:\my*\*.txt`.

## Upload a directory

Upload a directory by using the [azcopy copy](storage-ref-azcopy-copy.md) command.

This example copies a directory (and all of the files in that directory) to a blob container. The result is a directory in the container by the same name.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy copy '<local-directory-path>' 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>' --recursive`

**Example**

```azcopy
azcopy copy 'C:\myDirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer' --recursive
```

**Example (hierarchical namespace)**

```azcopy
azcopy copy 'C:\myDirectory' 'https://mystorageaccount.dfs.core.windows.net/mycontainer' --recursive
```

To copy to a directory within the container, just specify the name of that directory in your command string.

**Example**

```azcopy
azcopy copy 'C:\myDirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobDirectory' --recursive
```

**Example (hierarchical namespace)**

```azcopy
azcopy copy 'C:\myDirectory' 'https://mystorageaccount.dfs.core.windows.net/mycontainer/myBlobDirectory' --recursive
```

If you specify the name of a directory that doesn't exist in the container, AzCopy creates a new directory by that name.

## Upload directory contents

Upload the contents of a directory by using the [azcopy copy](storage-ref-azcopy-copy.md) command. Use the wildcard symbol (*) to upload the contents without copying the containing directory itself.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy copy '<local-directory-path>\*' 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<directory-path>'`

**Example**

```azcopy
azcopy copy 'C:\myDirectory\*' 'https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobDirectory'
```

**Example (hierarchical namespace)**

```azcopy
azcopy copy 'C:\myDirectory\*' 'https://mystorageaccount.dfs.core.windows.net/mycontainer/myBlobDirectory'
```

Append the `--recursive` flag to upload files in all subdirectories.

## Upload specific files

You can upload specific files by using complete file names, partial names with wildcard characters (*), or by using dates and times.

> [!TIP]
> These examples enclose path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

### Specify multiple complete file names

Use the [azcopy copy](storage-ref-azcopy-copy.md) command with the `--include-path` option. Separate individual file names by using a semicolon (`;`).

**Syntax**

`azcopy copy '<local-directory-path>' 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>' --include-path <semicolon-separated-file-list>`

**Example**

```azcopy
azcopy copy 'C:\myDirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer' --include-path 'photos;documents\myFile.txt' --recursive'
```

**Example (hierarchical namespace)**

```azcopy
azcopy copy 'C:\myDirectory' 'https://mystorageaccount.dfs.core.windows.net/mycontainer' --include-path 'photos;documents\myFile.txt' --recursive'
```

In this example, AzCopy transfers the `C:\myDirectory\photos` directory and the `C:\myDirectory\documents\myFile.txt` file. Include the `--recursive` option to transfer all files in the `C:\myDirectory\photos` directory.

You can also exclude files by using the `--exclude-path` option. To learn more, see [azcopy copy](storage-ref-azcopy-copy.md) reference docs.

### Use wildcard characters

Use the [azcopy copy](storage-ref-azcopy-copy.md) command with the `--include-pattern` option. Specify partial names that include the wildcard characters. Separate names by using a semicolin (`;`).

**Syntax**

`azcopy copy '<local-directory-path>' 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>' --include-pattern <semicolon-separated-file-list-with-wildcard-characters>`

**Example**

```azcopy
azcopy copy 'C:\myDirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer' --include-pattern 'myFile*.txt;*.pdf*'
```

**Example (hierarchical namespace)**

```azcopy
azcopy copy 'C:\myDirectory' 'https://mystorageaccount.dfs.core.windows.net/mycontainer' --include-pattern 'myFile*.txt;*.pdf*'
```

You can also exclude files by using the `--exclude-pattern` option. To learn more, see [azcopy copy](storage-ref-azcopy-copy.md) reference docs.

The `--include-pattern` and `--exclude-pattern` options apply only to filenames and not to the path.  If you want to copy all of the text files that exist in a directory tree, use the `–recursive` option to get the entire directory tree, and then use the `–include-pattern` and specify `*.txt` to get all of the text files.

### Upload files that were modified before or after a date and time

Use the [azcopy copy](storage-ref-azcopy-copy.md) command with the `--include-before` or `--include-after` option. Specify a date and time in ISO-8601 format (For example: `2020-08-19T15:04:00Z`).

The following examples upload files that were modified on or after the specified date.

**Syntax**

`azcopy copy '<local-directory-path>\*' 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-or-directory-name>'  --include-after <Date-Time-in-ISO-8601-format>`

**Example**

```azcopy
azcopy copy 'C:\myDirectory\*' 'https://mystorageaccount.blob.core.windows.net/mycontainer/FileDirectory'  --include-after '2020-08-19T15:04:00Z'
```

**Example (hierarchical namespace)**

```azcopy
azcopy copy 'C:\myDirectory\*' 'https://mystorageaccount.dfs.core.windows.net/mycontainer/FileDirectory'   --include-after '2020-08-19T15:04:00Z'
```

For detailed reference, see the [azcopy copy](storage-ref-azcopy-copy.md) reference docs.

## Upload with index tags

You can upload a file and add [blob index tags](../blobs/storage-manage-find-blobs.md) to the target blob.

If you're using Azure AD authorization, your security principal must be assigned the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role, or it must be given permission to the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftstorage) via a custom Azure role. If you're using a Shared Access Signature (SAS) token, that token must provide access to the blob's tags via the `t` SAS permission.

To add tags, use the `--blob-tags` option along with a URL encoded key-value pair. 
For example, to add the key `my tag` and a value `my tag value`, you would add `--blob-tags='my%20tag=my%20tag%20value'` to the destination parameter.

Separate multiple index tags by using an ampersand (`&`).  For example, if you want to add a key `my second tag` and a value `my second tag value`, the complete option string would be `--blob-tags='my%20tag=my%20tag%20value&my%20second%20tag=my%20second%20tag%20value'`.

The following examples show how to use the `--blob-tags` option.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Upload a file**

```azcopy
azcopy copy 'C:\myDirectory\myTextFile.txt' 'https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt' --blob-tags='my%20tag=my%20tag%20value&my%20second%20tag=my%20second%20tag%20value'
```

**Upload a directory**

```azcopy
azcopy copy 'C:\myDirectory' 'https://mystorageaccount.blob.core.windows.net/mycontainer' --recursive --blob-tags='my%20tag=my%20tag%20value&my%20second%20tag=my%20second%20tag%20value'
```

**Upload directory contents**

```azcopy
azcopy copy 'C:\myDirectory\*' 'https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobDirectory' --blob-tags='my%20tag=my%20tag%20value&my%20second%20tag=my%20second%20tag%20value'
```

> [!NOTE]
> If you specify a directory for the source, all the blobs that are copied to the destination will have the same tags that you specify in the command.

## Upload with optional flags

You can tweak your upload operation by using optional flags. Here's a few examples.

|Scenario|Flag|
|---|---|
|Upload files as Append Blobs or Page Blobs.|**--blob-type**=\[BlockBlob\|PageBlob\|AppendBlob\]|
|Upload to a specific access tier (such as the archive tier).|**--block-blob-tier**=\[None\|Hot\|Cool\|Archive\]|

For a complete list, see [options](storage-ref-azcopy-copy.md#options).

## Next steps

Find more examples in these articles:

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
