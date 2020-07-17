---
title: Transfer data to or from Azure Files by using AzCopy v10 | Microsoft Docs
description: Transfer data with AzCopy and file storage.
author: normesta
ms.service: storage
ms.topic: how-to
ms.date: 04/10/2020
ms.author: normesta
ms.subservice: common
---
# Transfer data with AzCopy and file storage 

AzCopy is a command-line utility that you can use to copy blobs or files to or from a storage account. This article contains example commands that work with Azure Files.

Before you begin, see the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy and familiarize yourself with the tool.

> [!TIP]
> The examples in this article enclose path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

## Create file shares

You can use the [azcopy make](storage-ref-azcopy-make.md) command to create a file share. The example in this section creates a file share named `myfileshare`.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy make 'https://<storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>'` |
| **Example** | `azcopy make 'https://mystorageaccount.file.core.windows.net/myfileshare?sv=2018-03-28&ss=bjqt&srs=sco&sp=rjklhjup&se=2019-05-10T04:37:48Z&st=2019-05-09T20:37:48Z&spr=https&sig=%2FSOVEFfsKDqRry4bk3qz1vAQFwY5DDzp2%2B%2F3Eykf%2FJLs%3D'` |

For detailed reference docs, see [azcopy make](storage-ref-azcopy-make.md).

## Upload files

You can use the [azcopy copy](storage-ref-azcopy-copy.md) command to upload files and directories from your local computer.

This section contains the following examples:

> [!div class="checklist"]
> * Upload a file
> * Upload a directory
> * Upload the contents of a directory
> * Upload a specific file

> [!TIP]
> You can tweak your upload operation by using optional flags. Here's a few examples.
>
> |Scenario|Flag|
> |---|---|
> |Copy access control lists (ACLs) along with the files.|**--preserve-smb-permissions**=\[true\|false\]|
> |Copy SMB property information along with the files.|**--preserve-smb-info**=\[true\|false\]|
> |Upload files as Append Blobs or Page Blobs.|**--blob-type**=\[BlockBlob\|PageBlob\|AppendBlob\]|
> |Upload to a specific access tier (such as the archive tier).|**--block-blob-tier**=\[None\|Hot\|Cool\|Archive\]|
> 
> For a complete list, see [options](storage-ref-azcopy-copy.md#options).

> [!NOTE]
> AzCopy doesn't automatically calculate and store the file's md5 hash code. If you want AzCopy to do that, then append the `--put-md5` flag to each copy command. That way, when the file is downloaded, AzCopy calculates an MD5 hash for downloaded data and verifies that the MD5 hash stored in the file's `Content-md5` property matches the calculated hash.

### Upload a file

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy '<local-file-path>' 'https://<storage-account-name>.file.core.windows.net/<file-share-name>/<file-name><SAS-token>'` |
| **Example** | `azcopy copy 'C:\myDirectory\myTextFile.txt' 'https://mystorageaccount.file.core.windows.net/myfileshare/myTextFile.txt?sv=2018-03-28&ss=bjqt&srs=sco&sp=rjklhjup&se=2019-05-10T04:37:48Z&st=2019-05-09T20:37:48Z&spr=https&sig=%2FSOVEFfsKDqRry4bk3qz1vAQFwY5DDzp2%2B%2F3Eykf%2FJLs%3D'` |

You can also upload a file by using a wildcard symbol (*) anywhere in the file path or file name. For example: `'C:\myDirectory\*.txt'`, or `C:\my*\*.txt`.

### Upload a directory

This example copies a directory (and all of the files in that directory) to a file share. The result is a directory in the file share by the same name.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy '<local-directory-path>' 'https://<storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' --recursive` |
| **Example** | `azcopy copy 'C:\myDirectory' 'https://mystorageaccount.file.core.windows.net/myfileshare?sv=2018-03-28&ss=bjqt&srs=sco&sp=rjklhjup&se=2019-05-10T04:37:48Z&st=2019-05-09T20:37:48Z&spr=https&sig=%2FSOVEFfsKDqRry4bk3qz1vAQFwY5DDzp2%2B%2F3Eykf%2FJLs%3D' --recursive` |

To copy to a directory within the file share, just specify the name of that directory in your command string.

|    |     |
|--------|-----------|
| **Example** | `azcopy copy 'C:\myDirectory' 'https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareDirectory?sv=2018-03-28&ss=bjqt&srs=sco&sp=rjklhjup&se=2019-05-10T04:37:48Z&st=2019-05-09T20:37:48Z&spr=https&sig=%2FSOVEFfsKDqRry4bk3qz1vAQFwY5DDzp2%2B%2F3Eykf%2FJLs%3D' --recursive` |

If you specify the name of a directory that does not exist in the file share, AzCopy creates a new directory by that name.

### Upload the contents of a directory

You can upload the contents of a directory without copying the containing directory itself by using the wildcard symbol (*).

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy '<local-directory-path>/*' 'https://<storage-account-name>.file.core.windows.net/<file-share-name>/<directory-path><SAS-token>` |
| **Example** | `azcopy copy 'C:\myDirectory\*' 'https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareDirectory?sv=2018-03-28&ss=bjqt&srs=sco&sp=rjklhjup&se=2019-05-10T04:37:48Z&st=2019-05-09T20:37:48Z&spr=https&sig=%2FSOVEFfsKDqRry4bk3qz1vAQFwY5DDzp2%2B%2F3Eykf%2FJLs%3D"` |

> [!NOTE]
> Append the `--recursive` flag to upload files in all sub-directories.

### Upload specific files

You can specify complete file names, or use partial names with wildcard characters (*).

#### Specify multiple complete file names

Use the [azcopy copy](storage-ref-azcopy-copy.md) command with the `--include-path` option. Separate individual file names by using a semicolon (`;`).

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy '<local-directory-path>' 'https://<storage-account-name>.file.core.windows.net/<file-share-or-directory-name><SAS-token>' --include-path <semicolon-separated-file-list>` |
| **Example** | `azcopy copy 'C:\myDirectory' 'https://mystorageaccount.file.core.windows.net/myfileshare?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' --include-path 'photos;documents\myFile.txt'` |

In this example, AzCopy transfers the `C:\myDirectory\photos` directory and the `C:\myDirectory\documents\myFile.txt` file. You need to include the `--recursive` option to transfer all files in the `C:\myDirectory\photos` directory.

You can also exclude files by using the `--exclude-path` option. To learn more, see [azcopy copy](storage-ref-azcopy-copy.md) reference docs.

#### Use wildcard characters

Use the [azcopy copy](storage-ref-azcopy-copy.md) command with the `--include-pattern` option. Specify partial names that include the wildcard characters. Separate names by using a semicolin (`;`).

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy '<local-directory-path>' 'https://<storage-account-name>.file.core.windows.net/<file-share-or-directory-name><SAS-token>' --include-pattern <semicolon-separated-file-list-with-wildcard-characters>` |
| **Example** | `azcopy copy 'C:\myDirectory' 'https://mystorageaccount.file.core.windows.net/myfileshare?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' --include-pattern 'myFile*.txt;*.pdf*'` |

You can also exclude files by using the `--exclude-pattern` option. To learn more, see [azcopy copy](storage-ref-azcopy-copy.md) reference docs.

The `--include-pattern` and `--exclude-pattern` options apply only to filenames and not to the path.  If you want to copy all of the text files that exist in a directory tree, use the `–recursive` option to get the entire directory tree, and then use the `–include-pattern` and specify `*.txt` to get all of the text files.

## Download files

You can use the [azcopy copy](storage-ref-azcopy-copy.md) command to download files, directories, and file shares to your local computer.

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
> |Copy access control lists (ACLs) along with the files.|**--preserve-smb-permissions**=\[true\|false\]|
> |Copy SMB property information along with the files.|**--preserve-smb-info**=\[true\|false\]|
> |Automatically decompress files.|**--decompress**|
> 
> For a complete list, see [options](storage-ref-azcopy-copy.md#options).

> [!NOTE]
> If the `Content-md5` property value of a file contains a hash, AzCopy calculates an MD5 hash for downloaded data and verifies that the MD5 hash stored in the file's `Content-md5` property matches the calculated hash. If these values don't match, the download fails unless you override this behavior by appending `--check-md5=NoCheck` or `--check-md5=LogOnly` to the copy command.

### Download a file

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<storage-account-name>.file.core.windows.net/<file-share-name>/<file-path><SAS-token>' '<local-file-path>'` |
| **Example** | `azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/myTextFile.txt?sv=2018-03-28&ss=bjqt&srs=sco&sp=rjklhjup&se=2019-05-10T04:37:48Z&st=2019-05-09T20:37:48Z&spr=https&sig=%2FSOVEFfsKDqRry4bk3qz1vAQFwY5DDzp2%2B%2F3Eykf%2FJLs%3D' 'C:\myDirectory\myTextFile.txt'` |

### Download a directory

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<storage-account-name>.file.core.windows.net/<file-share-name>/<directory-path><SAS-token>' '<local-directory-path>' --recursive` |
| **Example** | `azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareDirectory?sv=2018-03-28&ss=bjqt&srs=sco&sp=rjklhjup&se=2019-05-10T04:37:48Z&st=2019-05-09T20:37:48Z&spr=https&sig=%2FSOVEFfsKDqRry4bk3qz1vAQFwY5DDzp2%2B%2F3Eykf%2FJLs%3D' 'C:\myDirectory'  --recursive` |

This example results in a directory named `C:\myDirectory\myFileShareDirectory` that contains all of the downloaded files.

### Download the contents of a directory

You can download the contents of a directory without copying the containing directory itself by using the wildcard symbol (*).

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<storage-account-name>.file.core.windows.net/<file-share-name>/*<SAS-token>' '<local-directory-path>/'` |
| **Example** | `azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareDirectory/*?sv=2018-03-28&ss=bjqt&srs=sco&sp=rjklhjup&se=2019-05-10T04:37:48Z&st=2019-05-09T20:37:48Z&spr=https&sig=%2FSOVEFfsKDqRry4bk3qz1vAQFwY5DDzp2%2B%2F3Eykf%2FJLs%3D' 'C:\myDirectory'` |

> [!NOTE]
> Append the `--recursive` flag to download files in all sub-directories.

### Download specific files

You can specify complete file names, or use partial names with wildcard characters (*).

#### Specify multiple complete file names

Use the [azcopy copy](storage-ref-azcopy-copy.md) command with the `--include-path` option. Separate individual file names by using a semicolin (`;`).

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<storage-account-name>.file.core.windows.net/<file-share-or-directory-name><SAS-token>' '<local-directory-path>'  --include-path <semicolon-separated-file-list>` |
| **Example** | `azcopy copy 'https://mystorageaccount.file.core.windows.net/myFileShare/myDirectory?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'C:\myDirectory'  --include-path 'photos;documents\myFile.txt' --recursive` |

In this example, AzCopy transfers the `https://mystorageaccount.file.core.windows.net/myFileShare/myDirectory/photos` directory and the `https://mystorageaccount.file.core.windows.net/myFileShare/myDirectory/documents/myFile.txt` file. You need to include the `--recursive` option to transfer all files in the `https://mystorageaccount.file.core.windows.net/myFileShare/myDirectory/photos` directory.

You can also exclude files by using the `--exclude-path` option. To learn more, see [azcopy copy](storage-ref-azcopy-copy.md) reference docs.

#### Use wildcard characters

Use the [azcopy copy](storage-ref-azcopy-copy.md) command with the `--include-pattern` option. Specify partial names that include the wildcard characters. Separate names by using a semicolin (`;`).

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-or-directory-name><SAS-token>' '<local-directory-path>' --include-pattern <semicolon-separated-file-list-with-wildcard-characters>` |
| **Example** | `azcopy copy 'https://mystorageaccount.blob.core.windows.net/mycontainer/FileDirectory?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'C:\myDirectory'  --include-pattern 'myFile*.txt;*.pdf*'` |

You can also exclude files by using the `--exclude-pattern` option. To learn more, see [azcopy copy](storage-ref-azcopy-copy.md) reference docs.

The `--include-pattern` and `--exclude-pattern` options apply only to filenames and not to the path.  If you want to copy all of the text files that exist in a directory tree, use the `–recursive` option to get the entire directory tree, and then use the `–include-pattern` and specify `*.txt` to get all of the text files.

## Copy files between storage accounts

You can use AzCopy to copy files to other storage accounts. The copy operation is synchronous so when the command returns, that indicates that all files have been copied.

AzCopy uses [server-to-server](https://docs.microsoft.com/rest/api/storageservices/put-block-from-url) [APIs](https://docs.microsoft.com/rest/api/storageservices/put-page-from-url), so data is copied directly between storage servers. These copy operations don't use the network bandwidth of your computer. You can increase the throughput of these operations by setting the value of the `AZCOPY_CONCURRENCY_VALUE` environment variable. To learn more, see [Optimize throughput](storage-use-azcopy-configure.md#optimize-throughput).

This section contains the following examples:

> [!div class="checklist"]
> * Copy a file to another storage account
> * Copy a directory to another storage account
> * Copy a file share to another storage account
> * Copy all file shares, directories, and files to another storage account

> [!TIP]
> You can tweak your copy operation by using optional flags. Here's a few examples.
>
> |Scenario|Flag|
> |---|---|
> |Copy access control lists (ACLs) along with the files.|**--preserve-smb-permissions**=\[true\|false\]|
> |Copy SMB property information along with the files.|**--preserve-smb-info**=\[true\|false\]|
> |Copy files as Append Blobs or Page Blobs.|**--blob-type**=\[BlockBlob\|PageBlob\|AppendBlob\]|
> |Copy to a specific access tier (such as the archive tier).|**--block-blob-tier**=\[None\|Hot\|Cool\|Archive\]|
> 
> For a complete list, see [options](storage-ref-azcopy-copy.md#options).

### Copy a file to another storage account

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name>/<file-path><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name>/<file-path><SAS-token>'` |
| **Example** | `azcopy copy 'https://mysourceaccount.file.core.windows.net/mycontainer/myTextFile.txt?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.file.core.windows.net/mycontainer/myTextFile.txt?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D'` |

### Copy a directory to another storage account

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name>/<directory-path><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' --recursive` |
| **Example** | `azcopy copy 'https://mysourceaccount.file.core.windows.net/mycontainer/myBlobDirectory?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.file.core.windows.net/mycontainer?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' --recursive` |

### Copy a file share to another storage account

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' --recursive` |
| **Example** | `azcopy copy 'https://mysourceaccount.file.core.windows.net/mycontainer?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.file.core.windows.net/mycontainer?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' --recursive` |

### Copy all file shares, directories, and files to another storage account

|    |     |
|--------|-----------|
| **Syntax** | `azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<SAS-token>' --recursive'` |
| **Example** | `azcopy copy 'https://mysourceaccount.file.core.windows.net?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.file.core.windows.net?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' --recursive` |

## Synchronize files

You can synchronize the contents of a file share with another file share. You can also synchronize the contents of a directory in a file share with the contents of a directory that is located in another file share. Synchronization is one-way. In other words, you choose which of these two endpoints is the source and which one is the destination. Synchronization also uses server to server APIs.

> [!NOTE]
> Currently, this scenario is supported only for accounts that don't have a hierarchical namespace. The current release of AzCopy doesn't synchronize between Azure Files and Blob Storage.

The [sync](storage-ref-azcopy-sync.md) command compares file names and last modified timestamps. Set the `--delete-destination` optional flag to a value of `true` or `prompt` to delete files in the destination directory if those files no longer exist in the source directory.

If you set the `--delete-destination` flag to `true` AzCopy deletes files without providing a prompt. If you want a prompt to appear before AzCopy deletes a file, set the `--delete-destination` flag to `prompt`.

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

### Update a file share with changes to another file share

The first file share that appears in this command is the source. The second one is the destination.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy sync 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' --recursive` |
| **Example** | `azcopy sync 'https://mysourceaccount.file.core.windows.net/myfileShare?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.file.core.windows.net/myfileshare?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' --recursive` |

### Update a directory with changes to a directory in another file share

The first directory that appears in this command is the source. The second one is the destination.

|    |     |
|--------|-----------|
| **Syntax** | `azcopy sync 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name>/<directory-name><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name>/<directory-name><SAS-token>' --recursive` |
| **Example** | `azcopy sync 'https://mysourceaccount.file.core.windows.net/myFileShare/myDirectory?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' 'https://mydestinationaccount.file.core.windows.net/myFileShare/myDirectory?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' --recursive` |

### Update a file share to match the contents of a share snapshot

The first file share that appears in this command is the source. At the end of the URI, append the string `&sharesnapshot=` followed by the **DateTime** value of the snapshot. 

|    |     |
|--------|-----------|
| **Syntax** | `azcopy sync 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>&sharesnapsot<snapshot-ID>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' --recursive` |
| **Example** | `azcopy sync 'https://mysourceaccount.file.core.windows.net/myfileShare?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D&sharesnapshot=2020-03-03T20%3A24%3A13.0000000Z' 'https://mydestinationaccount.file.core.windows.net/myfileshare?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-07-04T05:30:08Z&st=2019-07-03T21:30:08Z&spr=https&sig=CAfhgnc9gdGktvB=ska7bAiqIddM845yiyFwdMH481QA8%3D' --recursive` |

To learn more about share snapshots, see [Overview of share snapshots for Azure Files](https://docs.microsoft.com/azure/storage/files/storage-snapshots-files).

## Next steps

Find more examples in any of these articles:

- [Get started with AzCopy](storage-use-azcopy-v10.md)

- [Transfer data with AzCopy and blob storage](storage-use-azcopy-blobs.md)

- [Transfer data with AzCopy and Amazon S3 buckets](storage-use-azcopy-s3.md)

- [Configure, optimize, and troubleshoot AzCopy](storage-use-azcopy-configure.md)
