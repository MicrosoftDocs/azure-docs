---
title: Download blobs from Azure Blob Storage by using AzCopy v10
description: This article contains a collection of AzCopy example commands that help you download blobs from Azure Blob Storage. 
author: normesta
ms.service: azure-storage
ms.topic: how-to
ms.date: 04/02/2021
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: dineshm
---

# Download blobs from Azure Blob Storage by using AzCopy

You can download blobs and directories from Blob storage by using the AzCopy v10 command-line utility.

To see examples for other types of tasks such as uploading files, synchronizing with Blob storage, or copying blobs between accounts, see the links presented in the [Next Steps](#next-steps) section of this article.

## Get started

See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy and learn about the ways that you can provide authorization credentials to the storage service.

> [!NOTE]
> The examples in this article assume that you've provided authorization credentials by using Microsoft Entra ID.
>
> If you'd rather use a SAS token to authorize access to blob data, then you can append that token to the resource URL in each AzCopy command. For example: `'https://<storage-account-name>.blob.core.windows.net/<container-name><SAS-token>'`.

## Download a blob

Download a blob by using the [azcopy copy](storage-ref-azcopy-copy.md) command.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy copy 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<blob-path>' '<local-file-path>'`

**Example**

```azcopy
azcopy copy 'https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt' 'C:\myDirectory\myTextFile.txt'
```

**Example (Data Lake Storage endpoint)**

```azcopy
azcopy copy 'https://mystorageaccount.dfs.core.windows.net/mycontainer/myTextFile.txt' 'C:\myDirectory\myTextFile.txt'
```

> [!NOTE]
> If the `Content-md5` property value of a blob contains a hash, AzCopy calculates an MD5 hash for downloaded data and verifies that the MD5 hash stored in the blob's `Content-md5` property matches the calculated hash. If these values don't match, the download fails unless you override this behavior by appending `--check-md5=NoCheck` or `--check-md5=LogOnly` to the copy command.

## Download a directory

Download a directory by using the [azcopy copy](storage-ref-azcopy-copy.md) command.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy copy 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<directory-path>' '<local-directory-path>' --recursive`

**Example**

```azcopy
azcopy copy 'https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobDirectory' 'C:\myDirectory'  --recursive
```

**Example (Data Lake Storage endpoint)**

```azcopy
azcopy copy 'https://mystorageaccount.dfs.core.windows.net/mycontainer/myBlobDirectory' 'C:\myDirectory'  --recursive
```

This example results in a directory named `C:\myDirectory\myBlobDirectory` that contains all of the downloaded blobs.

## Download directory contents

You can download the contents of a directory without copying the containing directory itself by using the wildcard symbol (*).

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

> [!NOTE]
> Currently, this scenario is supported only for accounts that don't have a hierarchical namespace.

**Syntax**

`azcopy copy 'https://<storage-account-name>.blob.core.windows.net/<container-name>/*' '<local-directory-path>/'`

**Example**

```azcopy
azcopy copy 'https://mystorageaccount.blob.core.windows.net/mycontainer/myBlobDirectory/*' 'C:\myDirectory'
```

Append the `--recursive` flag to download files in all subdirectories.

## Download specific blobs

You can download specific blobs by using complete file names, partial names with wildcard characters (*), or by using dates and times.

> [!TIP]
> These examples enclose path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

#### Specify multiple complete blob names

Use the [azcopy copy](storage-ref-azcopy-copy.md) command with the `--include-path` option. Separate individual blob names by using a semicolon (`;`).

**Syntax**

`azcopy copy 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-or-directory-name>' '<local-directory-path>'  --include-path <semicolon-separated-file-list>`

**Example**

```azcopy
azcopy copy 'https://mystorageaccount.blob.core.windows.net/mycontainer/FileDirectory' 'C:\myDirectory'  --include-path 'photos;documents\myFile.txt' --recursive
```

**Example (Data Lake Storage endpoint)**

```azcopy
azcopy copy 'https://mystorageaccount.dfs.core.windows.net/mycontainer/FileDirectory' 'C:\myDirectory'  --include-path 'photos;documents\myFile.txt'--recursive
```

In this example, AzCopy transfers the `https://mystorageaccount.blob.core.windows.net/mycontainer/FileDirectory/photos` directory and the `https://mystorageaccount.blob.core.windows.net/mycontainer/FileDirectory/documents/myFile.txt` file. Include the `--recursive` option to transfer all blobs in the `https://mystorageaccount.blob.core.windows.net/mycontainer/FileDirectory/photos` directory.

You can also exclude blobs by using the `--exclude-path` option. To learn more, see [azcopy copy](storage-ref-azcopy-copy.md) reference docs.

#### Use wildcard characters

Use the [azcopy copy](storage-ref-azcopy-copy.md) command with the `--include-pattern` option. Specify partial names that include the wildcard characters. Separate names by using a semicolin (`;`).

**Syntax**

`azcopy copy 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-or-directory-name>' '<local-directory-path>' --include-pattern <semicolon-separated-file-list-with-wildcard-characters>`

**Example**

```azcopy
azcopy copy 'https://mystorageaccount.blob.core.windows.net/mycontainer/FileDirectory' 'C:\myDirectory'  --include-pattern 'myFile*.txt;*.pdf*'
```

**Example (hierarchical namespace)**

```azcopy
azcopy copy 'https://mystorageaccount.dfs.core.windows.net/mycontainer/FileDirectory' 'C:\myDirectory'  --include-pattern 'myFile*.txt;*.pdf*'
```

You can also exclude blobs by using the `--exclude-pattern` option. To learn more, see [azcopy copy](storage-ref-azcopy-copy.md) reference docs.

The `--include-pattern` and `--exclude-pattern` options apply only to blob names and not to the path.  If you want to copy all of the text files (blobs) that exist in a directory tree, use the `–recursive` option to get the entire directory tree, and then use the `–include-pattern` and specify `*.txt` to get all of the text files.

#### Download blobs that were modified before or after a date and time

Use the [azcopy copy](storage-ref-azcopy-copy.md) command with the `--include-before` or `--include-after` option. Specify a date and time in ISO-8601 format (For example: `2020-08-19T15:04:00Z`).

The following examples download files that were modified on or after the specified date.

**Syntax**

`azcopy copy 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-or-directory-name>/*' '<local-directory-path>' --include-after <Date-Time-in-ISO-8601-format>`

**Example**

```azcopy
azcopy copy 'https://mystorageaccount.blob.core.windows.net/mycontainer/FileDirectory/*' 'C:\myDirectory'  --include-after '2020-08-19T15:04:00Z'
```

**Example (Data Lake Storage endpoint)**

```azcopy
azcopy copy 'https://mystorageaccount.dfs.core.windows.net/mycontainer/FileDirectory/*' 'C:\myDirectory'  --include-after '2020-08-19T15:04:00Z'
```

For detailed reference, see the [azcopy copy](storage-ref-azcopy-copy.md) reference docs.

#### Download previous versions of a blob

If you've enabled [blob versioning](../blobs/versioning-enable.md), you can download one or more previous versions of a blob.

First, create a text file that contains a list of [version IDs](../blobs/versioning-overview.md). Each version ID must appear on a separate line. For example:

```
2020-08-17T05:50:34.2199403Z
2020-08-17T05:50:34.5041365Z
2020-08-17T05:50:36.7607103Z
```

Then, use the [azcopy copy](storage-ref-azcopy-copy.md) command with the `--list-of-versions` option. Specify the location of the text file that contains the list of versions (For example: `D:\\list-of-versions.txt`).

#### Download a blob snapshot

You can download a [blob snapshot](../blobs/snapshots-overview.md) by referencing the **DateTime** value of a blob snapshot.

**Syntax**

`azcopy copy 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<blob-path>?sharesnapshot=<DateTime-of-snapshot>' '<local-file-path>'`

**Example**

```azcopy
azcopy copy 'https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt?sharesnapshot=2020-09-23T08:21:07.0000000Z' 'C:\myDirectory\myTextFile.txt'
```

**Example (Data Lake Storage endpoint)**

```azcopy
azcopy copy 'https://mystorageaccount.dfs.core.windows.net/mycontainer/myTextFile.txt?sharesnapshot=2020-09-23T08:21:07.0000000Z' 'C:\myDirectory\myTextFile.txt'
```

> [!NOTE]
> If you are using a SAS token to authorize access to blob data, then append snapshot **DateTime** after the SAS token. For example: `'https://mystorageaccount.blob.core.windows.net/mycontainer/myTextFile.txt?sv=2018-03-28&ss=bjqt&srs=sco&sp=rjklhjup&se=2019-05-10T04:37:48Z&st=2019-05-09T20:37:48Z&spr=https&sig=/SOVEFfsKDqRry4bk3qz1vAQFwY5DDzp2%2B/3Eykf/JLs%3D&sharesnapshot=2020-09-23T08:21:07.0000000Z'`.

## Download with optional flags

You can tweak your download operation by using optional flags. Here's a few examples.

|Scenario|Flag|
|---|---|
|Automatically decompress files.|**--decompress**|
|Specify how detailed you want your copy-related log entries to be.|**--log-level**=\[WARNING\|ERROR\|INFO\|NONE\]|
|Specify if and how to overwrite the conflicting files and blobs at the destination.|**--overwrite**=\[true\|false\|ifSourceNewer\|prompt\]|

For a complete list, see [options](storage-ref-azcopy-copy.md#options).

## Next steps

Find more examples in these articles:

- [Examples: Upload](storage-use-azcopy-blobs-upload.md)
- [Examples: Copy between account](storage-use-azcopy-blobs-copy.md)
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
