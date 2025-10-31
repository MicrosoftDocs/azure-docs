---
title: Transfer data to or from Azure Files by using AzCopy v10
description: Transfer data with AzCopy and file storage. AzCopy is a command-line tool for copying blobs or files to or from a storage account. Use AzCopy with Azure Files.
author: normesta
ms.service: azure-storage
ms.topic: how-to
ms.date: 10/28/2025
ms.author: normesta
ms.subservice: storage-common-concepts
# Customer intent: As a user of a cloud file storage service, I want to transfer files to and from storage accounts using a command-line tool, so that I can efficiently manage and synchronize large amounts of data between my local environment and the cloud.
---

# Transfer data with AzCopy and file storage

AzCopy is a command-line utility that you can use to copy files to or from a storage account. This article contains example commands that work with Azure Files.

## Get started

See the [Get started with AzCopy](storage-use-azcopy-v10.md) article to download AzCopy and learn about the ways that you can provide authorization credentials to the storage service.

> [!NOTE]
> The examples in this article show the use of a SAS token to authorize access. However, for commands that target files and directories, you can now provide authorization credentials by using Microsoft Entra ID and omit the SAS token from those commands. You still have to use a SAS token in any command that targets only the file share or the account (for example: `'azcopy make https://mystorageaccount.file.core.windows.net/myfileshare'` or `'azcopy copy 'https://mystorageaccount.file.core.windows.net'`. 
> 
> To learn more, see [Authorize AzCopy](storage-use-azcopy-v10.md#authorize-azcopy) 

> [!TIP]
> When using Azure Files NFS, you must specify the `--from-to` CLI switch with one of the following supported options: `FileNFSLocal`, `LocalFileNFS`, or `FileNFSFileNFS` in your commands.
>
> The upload and download scenarios that use LocalFileNFS and FileNFSLocal are supported only on local Linux environments. These operations aren't supported on Windows or macOS.
> In contrast, the FileNFSFileNFS scenario, which uses the server-to-server copy API, is supported across Windows, Linux, and macOS. You can run the associated commands from any of these platforms.


## Create file shares

You can use the [azcopy make](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_make) command to create a file share. The example in this section creates a file share named `myfileshare`.

> [!NOTE]
> AzCopy version 10.30.0 introduces a breaking change where it no longer automatically creates file shares for transfers involving Azure Files using NFS or SMB protocols.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').


**Syntax**

`azcopy make 'https://<storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>'`

**Example**

#### [Azure Files SMB](#tab/smb-createfileshare)

```azcopy
azcopy make 'https://mystorageaccount.file.core.windows.net/myfileshare?[SAS]'
```

#### [Azure Files NFS](#tab/nfs-createfileshare)

```azcopy
azcopy make 'https://mystorageaccount.file.core.windows.net/myfileshare?[SAS]'
```

---

<a id="createfileshare"></a>

For detailed reference docs, see [azcopy make](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_make).

## Upload files

Use the [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) command to upload files and directories from your local computer.

> [!TIP]
> The examples in this section enclose path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

This section contains the following examples:

> [!div class="checklist"]
> - Upload a file
> - Upload a directory
> - Upload the contents of a directory
> - Upload a specific file

> [!TIP]
> Use optional flags to customize your upload operation. Here are a few examples:    
>
> |Scenario|Flag|
> |---|---|
> |Copy access control lists (ACLs) along with the files.|**--preserve-permissions**=[true\|false]|
> |Copy SMB property information along with the files.|**--preserve-info**=[true\|false]|
>
> For a complete list, see [options](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy#options).

> [!NOTE]
> AzCopy doesn't automatically calculate and store the file's MD5 hash code for a file greater than 256 MB. If you want AzCopy to do that, append the `--put-md5` flag to each copy command. That way, when the file is downloaded, AzCopy calculates an MD5 hash for downloaded data and verifies that the MD5 hash stored in the file's `Content-md5` property matches the calculated hash.

### Upload a file

**Syntax**

`azcopy copy '<local-file-path>' 'https://<storage-account-name>.file.core.windows.net/<file-share-name>/<file-name>'`

#### [Azure Files SMB](#tab/smb-uploadfile)

```azcopy
azcopy copy 'C:\myDirectory\myTextFile.txt' 'https://mystorageaccount.file.core.windows.net/myfileshare/myTextFile.txt?[SAS]' --preserve-permissions=true --preserve-info=true
```

You can also upload a file by using a wildcard symbol (*) anywhere in the file path or file name. For example: `'C:\myDirectory\*.txt'`, or `C:\my*\*.txt`.

#### [Azure Files NFS](#tab/nfs-uploadfile)

```azcopy
azcopy copy '/myDirectory/myTextFile.txt' 'https://mystorageaccount.file.core.windows.net/myfileshare/myTextFile.txt?[SAS]' --preserve-permissions=true --preserve-info=true --from-to=LocalFileNFS
```

You can also upload a file by using a wildcard symbol (*) anywhere in the file path or file name. For example: `'/myDirectory/*.txt'`.


---

<a id="uploadfile"></a>

### Upload a directory

This example copies a directory and all of the files in that directory to a file share. The result is a directory in the file share with the same name.

**Syntax**

`azcopy copy '<local-directory-path>' 'https://<storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' --recursive`

#### [Azure Files SMB](#tab/smb-uploaddirectory)

```azcopy
azcopy copy 'C:\myDirectory' 'https://mystorageaccount.file.core.windows.net/myfileshare?[SAS]' --recursive --preserve-permissions=true --preserve-info=true
```

#### [Azure Files NFS](#tab/nfs-uploaddirectory)

```azcopy
azcopy copy '/myDirectory' 'https://mystorageaccount.file.core.windows.net/myfileshare?[SAS]' --recursive --preserve-permissions=true --preserve-info=true --from-to=LocalFileNFS
```

---

<a id="uploaddirectory"></a>

To copy to a directory within the file share, just specify the name of that directory in your command string.

#### [Azure Files SMB](#tab/smb-uploaddirectorynew)

```azcopy
azcopy copy 'C:\myDirectory' 'https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareDirectory?[SAS]' --recursive --preserve-permissions=true --preserve-info=true
```

#### [Azure Files NFS](#tab/nfs-uploaddirectorynew)

```azcopy
azcopy copy '/myDirectory' 'https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareDirectory?[SAS]' --recursive --preserve-permissions=true --preserve-info=true --from-to=LocalFileNFS
```

---

<a id="uploaddirectorynew"></a>

If you specify the name of a directory that doesn't exist in the file share, AzCopy creates a new directory by that name.

### Upload the contents of a directory

You can upload the contents of a directory without copying the containing directory itself by using the wildcard symbol (*).

**Syntax**

`azcopy copy '<local-directory-path>/*' 'https://<storage-account-name>.file.core.windows.net/<file-share-name>/<directory-path><SAS-token>'`

#### [Azure Files SMB](#tab/smb-uploaddirectorycontents)

```azcopy
azcopy copy 'C:\myDirectory\*' 'https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareDirectory?[SAS]' --preserve-permissions=true --preserve-info=true
```

#### [Azure Files NFS](#tab/nfs-uploaddirectorycontents)

```azcopy
azcopy copy '/myDirectory/*' 'https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareDirectory?[SAS]' --preserve-permissions=true --preserve-info=true --from-to=LocalFileNFS
```

---

<a id="uploaddirectorycontents"></a>

> [!NOTE]
> To upload files in all subdirectories, add the `--recursive` flag.

### Upload specific files

You can upload specific files by using complete file names, partial names with wildcard characters (*), or by using dates and times.

#### Specify multiple complete file names

Use the [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) command with the `--include-path` option. Separate individual file names with a semicolon (`;`).

**Syntax**

`azcopy copy '<local-directory-path>' 'https://<storage-account-name>.file.core.windows.net/<file-share-or-directory-name><SAS-token>' --include-path <semicolon-separated-file-list>`

#### [Azure Files SMB](#tab/smb-uploadspecificfiles)

```azcopy
azcopy copy 'C:\myDirectory' 'https://mystorageaccount.file.core.windows.net/myfileshare?[SAS]' --include-path 'photos;documents\myFile.txt' --preserve-permissions=true --preserve-info=true
```

In this example, AzCopy transfers the `C:\myDirectory\photos` directory and the `C:\myDirectory\documents\myFile.txt` file. You need to include the `--recursive` option to transfer all files in the `C:\myDirectory\photos` directory.

#### [Azure Files NFS](#tab/nfs-uploadspecificfiles)

```azcopy
azcopy copy '/myDirectory' 'https://mystorageaccount.file.core.windows.net/myfileshare?[SAS]' --include-path 'photos;documents/myFile.txt' --preserve-permissions=true --preserve-info=true --from-to=LocalFileNFS
```

In this example, AzCopy transfers the `/myDirectory/photos` directory and the `/myDirectory/documents/myFile.txt` file. You need to include the `--recursive` option to transfer all files in the `/myDirectory/photos` directory.

---

<a id="uploadspecificfiles"></a>

You can also exclude files by using the `--exclude-path` option. To learn more, see [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) reference docs.

#### Use wildcard characters

Use the [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) command with the `--include-pattern` option. Specify partial names that include the wildcard characters. Separate names by using a semicolon (`;`).

**Syntax**

`azcopy copy '<local-directory-path>' 'https://<storage-account-name>.file.core.windows.net/<file-share-or-directory-name><SAS-token>' --include-pattern <semicolon-separated-file-list-with-wildcard-characters>`

#### [Azure Files SMB](#tab/smb-usewildcard)

```azcopy
azcopy copy 'C:\myDirectory' 'https://mystorageaccount.file.core.windows.net/myfileshare?[SAS]' --include-pattern 'myFile*.txt;*.pdf*' --preserve-permissions=true --preserve-info=true
```

#### [Azure Files NFS](#tab/nfs-usewildcard)

```azcopy
azcopy copy '/myDirectory' 'https://mystorageaccount.file.core.windows.net/myfileshare?[SAS]' --include-pattern 'myFile*.txt;*.pdf*' --preserve-permissions=true --preserve-info=true --from-to=LocalFileNFS
```

---

<a id="usewildcard"></a>

You can also exclude files by using the `--exclude-pattern` option. To learn more, see [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) reference docs.

The `--include-pattern` and `--exclude-pattern` options apply only to filenames and not to the path.  If you want to copy all of the text files that exist in a directory tree, use the `--recursive` option to get the entire directory tree, and then use the `--include-pattern` and specify `*.txt` to get all of the text files.

#### Upload files that were modified after a date and time

Use the [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) command with the `--include-after` option. Specify a date and time in ISO 8601 format (for example: `2020-08-19T15:04:00Z`).

**Syntax**

`azcopy copy '<local-directory-path>\*' 'https://<storage-account-name>.file.core.windows.net/<file-share-or-directory-name><SAS-token>'  --include-after <Date-Time-in-ISO-8601-format>`

#### [Azure Files SMB](#tab/smb-uploaddatetime)

```azcopy
azcopy copy 'C:\myDirectory\*' 'https://mystorageaccount.file.core.windows.net/myfileshare?[SAS]' --include-after '2020-08-19T15:04:00Z' --preserve-permissions=true --preserve-info=true
```

#### [Azure Files NFS](#tab/nfs-uploaddatetime)

```azcopy
azcopy copy '/myDirectory/*' 'https://mystorageaccount.file.core.windows.net/myfileshare?[SAS]' --include-after '2020-08-19T15:04:00Z' --preserve-permissions=true --preserve-info=true --from-to=LocalFileNFS
```

---

<a id="uploaddatetime"></a>

### Specifying source and destination types when uploading blobs

AzCopy uses the `--from-to` parameter to explicitly define the source and destination resource types when automatic detection might fail, such as in piping scenarios or emulators. This parameter helps AzCopy understand the context of the transfer and optimize accordingly.

| FromTo Value           | Description                                                                           |
|------------------------|---------------------------------------------------------------------------------------|
| `LocalFileSMB`         | Upload from local file system to SMB share in Azure File Storage                      |
| `LocalFileNFS`         | Upload from local file system (Linux only) to NFS share in Azure File Storage         |
| `PipeFile`             | Stream data from a pipe to Azure File Storage                                         |


## Download files

Use the [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) command to download files, directories, and file shares to your local computer.

> [!TIP]
> The examples in this section enclose path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

This section contains the following examples:

> [!div class="checklist"]
> - Download a file
> - Download a directory
> - Download the contents of a directory
> - Download specific files

> [!TIP]
> Use optional flags to customize your download operation. Here are a few examples:
>
> |Scenario|Flag|
> |---|---|
> |Copy access control lists (ACLs) along with the files.|**--preserve-permissions**=[true\|false]|
> |Copy SMB property information along with the files.|**--preserve-info**=[true\|false]|
> |Automatically decompress files.|**--decompress**|
>
> For a complete list, see [options](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy#options).

> [!NOTE]
> If the `Content-md5` property value of a file contains a hash, AzCopy calculates an MD5 hash for downloaded data and verifies that the MD5 hash stored in the file's `Content-md5` property matches the calculated hash. If these values don't match, the download fails unless you override this behavior by appending `--check-md5=NoCheck` or `--check-md5=LogOnly` to the copy command.

### Download a file

**Syntax**

`azcopy copy 'https://<storage-account-name>.file.core.windows.net/<file-share-name>/<file-path><SAS-token>' '<local-file-path>'`

#### [Azure Files SMB](#tab/smb-downloadfile)

```azcopy
azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/myTextFile.txt?[SAS]' 'C:\myDirectory\myTextFile.txt' --preserve-permissions=true --preserve-info=true
```

#### [Azure Files NFS](#tab/nfs-downloadfile)

```azcopy
azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/myTextFile.txt?[SAS]' '/myDirectory/myTextFile.txt' --preserve-permissions=true --preserve-info=true --from-to=FileNFSLocal
```

---

<a id="downloadfile"></a>

### Download a directory

**Syntax**

`azcopy copy 'https://<storage-account-name>.file.core.windows.net/<file-share-name>/<directory-path><SAS-token>' '<local-directory-path>' --recursive`

#### [Azure Files SMB](#tab/smb-downloaddirectory)

```azcopy
azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareDirectory?[SAS]' 'C:\myDirectory'  --recursive --preserve-permissions=true --preserve-info=true
```

This example creates a directory named `C:\myDirectory\myFileShareDirectory` that contains all of the downloaded files.

#### [Azure Files NFS](#tab/nfs-downloaddirectory)

```azcopy
azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareDirectory?[SAS]' '/myDirectory'  --recursive --preserve-permissions=true --preserve-info=true --from-to=FileNFSLocal
```

This example creates a directory named `/myDirectory/myFileShareDirectory` that contains all of the downloaded files.

---

<a id="downloaddirectory"></a>

### Download the contents of a directory

You can download the contents of a directory without copying the containing directory itself by using the wildcard symbol (*).

**Syntax**

`azcopy copy 'https://<storage-account-name>.file.core.windows.net/<file-share-name>/*<SAS-token>' '<local-directory-path>/'`

#### [Azure Files SMB](#tab/smb-downloaddirectorycontent)

```azcopy
azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareDirectory/*?[SAS]' 'C:\myDirectory' --preserve-permissions=true --preserve-info=true
```

#### [Azure Files NFS](#tab/nfs-downloaddirectorycontent)

```azcopy
azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareDirectory/*?[SAS]' '/myDirectory' --preserve-permissions=true --preserve-info=true --from-to=FileNFSLocal
```

---

<a id="downloaddirectorycontent"></a>

> [!NOTE]
> To download files in all subdirectories, add the `--recursive` flag.

### Download specific files

You can download specific files by using complete file names, partial names with wildcard characters (*), or by using dates and times.

#### Specify multiple complete file names

Use the [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) command with the `--include-path` option. Separate individual file names with a semicolon (`;`).

**Syntax**

`azcopy copy 'https://<storage-account-name>.file.core.windows.net/<file-share-or-directory-name><SAS-token>' '<local-directory-path>'  --include-path <semicolon-separated-file-list>`

#### [Azure Files SMB](#tab/smb-downloadspecificfiles)

```azcopy
azcopy copy 'https://mystorageaccount.file.core.windows.net/myFileShare/myDirectory?[SAS]' 'C:\myDirectory' --include-path 'photos;documents\myFile.txt' --recursive --preserve-permissions=true --preserve-info=true
```

#### [Azure Files NFS](#tab/nfs-downloadspecificfiles)

```azcopy
azcopy copy 'https://mystorageaccount.file.core.windows.net/myFileShare/myDirectory?[SAS]' '/myDirectory'  --include-path 'photos;documents\myFile.txt' --recursive --preserve-permissions=true --preserve-info=true --from-to=FileNFSLocal
```

---

<a id="downloadspecificfiles"></a>

In this example, AzCopy transfers the `https://mystorageaccount.file.core.windows.net/myFileShare/myDirectory/photos` directory and the `https://mystorageaccount.file.core.windows.net/myFileShare/myDirectory/documents/myFile.txt` file. Include the `--recursive` option to transfer all files in the `https://mystorageaccount.file.core.windows.net/myFileShare/myDirectory/photos` directory.

You can also exclude files by using the `--exclude-path` option. To learn more, see [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) reference docs.

#### Use wildcard characters

Use the [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) command with the `--include-pattern` option. Specify partial names that include the wildcard characters. Separate names by using a semicolon (`;`).

**Syntax**

`azcopy copy 'https://<storage-account-name>.file.core.windows.net/<file-share-or-directory-name><SAS-token>' '<local-directory-path>' --include-pattern <semicolon-separated-file-list-with-wildcard-characters>`

#### [Azure Files SMB](#tab/smb-downloadwildcard)

```azcopy
azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/myDirectory?[SAS]' 'C:\myDirectory' --include-pattern 'myFile*.txt;*.pdf*' --preserve-permissions=true --preserve-info=true
```

#### [Azure Files NFS](#tab/nfs-downloadwildcard)

```azcopy
azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/myDirectory?[SAS]' '/myDirectory'  --include-pattern 'myFile*.txt;*.pdf*' --preserve-permissions=true --preserve-info=true --from-to=FileNFSLocal
```

---

<a id="downloadwildcard"></a>

You can also exclude files by using the `--exclude-pattern` option. To learn more, see [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) reference docs.

The `--include-pattern` and `--exclude-pattern` options apply only to filenames and not to the path.  If you want to copy all of the text files that exist in a directory tree, use the `--recursive` option to get the entire directory tree, and then use the `--include-pattern` and specify `*.txt` to get all of the text files.

#### Download files that were modified after a date and time

Use the [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) command with the `--include-after` option. Specify a date and time in ISO-8601 format (for example: `2020-08-19T15:04:00Z`).

**Syntax**

`azcopy copy 'https://<storage-account-name>.file.core.windows.net/<file-share-or-directory-name>/*<SAS-token>' '<local-directory-path>'  --include-after <Date-Time-in-ISO-8601-format>`

#### [Azure Files SMB](#tab/smb-downloaddatetime)

```azcopy
azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/*?[SAS]' 'C:\myDirectory' --include-after '2020-08-19T15:04:00Z' --preserve-permissions=true --preserve-info=true
```

#### [Azure Files NFS](#tab/nfs-downloaddatetime)

```azcopy
azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/*?[SAS]' '/myDirectory' --include-after '2020-08-19T15:04:00Z' --preserve-permissions=true --preserve-info=true --from-to=FileNFSLocal
```

---

<a id="downloaddatetime"></a>

For detailed reference, see the [azcopy copy](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy) reference docs.

#### Download from a share snapshot

You can download a specific version of a file or directory by referencing the **DateTime** value of a share snapshot. To learn more about share snapshots, see [Overview of share snapshots for Azure Files](../files/storage-snapshots-files.md).

**Syntax**

`azcopy copy 'https://<storage-account-name>.file.core.windows.net/<file-share-name>/<file-path-or-directory-name><SAS-token>&sharesnapshot=<DateTime-of-snapshot>' '<local-file-or-directory-path>'`

**Example (Download a file)**

#### [Azure Files SMB](#tab/smb-downloadsnapshotfile)

```azcopy
azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/myTextFile.txt?[SAS]&sharesnapshot=2020-09-23T08:21:07.0000000Z' 'C:\myDirectory\myTextFile.txt' --preserve-permissions=true --preserve-info=true
```

#### [Azure Files NFS](#tab/nfs-downloadsnapshotfile)

```azcopy
azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/myTextFile.txt?[SAS]&sharesnapshot=2020-09-23T08:21:07.0000000Z' '/myDirectory/myTextFile.txt' --preserve-permissions=true --preserve-info=true --from-to=FileNFSLocal
```

---

<a id="downloadsnapshotfile"></a>

**Example (Download a directory)**

#### [Azure Files SMB](#tab/smb-downloadsnapshotdirectory)

```azcopy
azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareDirectory?[SAS]&sharesnapshot=2020-09-23T08:21:07.0000000Z' 'C:\myDirectory' --recursive --preserve-permissions=true --preserve-info=true
```

#### [Azure Files NFS](#tab/nfs-downloadsnapshotdirectory)

```azcopy
azcopy copy 'https://mystorageaccount.file.core.windows.net/myfileshare/myFileShareDirectory?[SAS]&sharesnapshot=2020-09-23T08:21:07.0000000Z' '/myDirectory'  --recursive --preserve-permissions=true --preserve-info=true --from-to=FileNFSLocal
```

---

### Specifying source and destination types when downloading files

AzCopy uses the `--from-to` parameter to explicitly define the source and destination resource types when automatic detection might fail, such as in piping scenarios or emulators. This parameter helps AzCopy understand the context of the transfer and optimize accordingly.

| FromTo Value           | Description                                                                           |
|------------------------|---------------------------------------------------------------------------------------|
| `FileSMBLocal`         | Download from SMB share in Azure File Storage to local file system                    |
| `FileNFSLocal`         | Download from NFS share in Azure File Storage to local file system (Linux only)       |
| `FileSMBLocal`         | Download from SMB share to local file system                                          |
| `FilePipe`             | Stream data from Azure File Storage to a pipe                                         |

<a id="downloadsnapshotdirectory"></a>

## Copy files between storage accounts

You can use AzCopy to copy files to other storage accounts. The copy operation is synchronous so all files are copied when the command returns.

AzCopy uses [server-to-server APIs](/rest/api/storageservices/put-range-from-url), so data is copied directly between storage servers. You can increase the throughput of these operations by setting the value of the `AZCOPY_CONCURRENCY_VALUE` environment variable. To learn more, see [Increase Concurrency](storage-use-azcopy-optimize.md#increase-concurrency).

You can also copy specific versions of a file by referencing the **DateTime** value of a share snapshot. To learn more about share snapshots, see [Overview of share snapshots for Azure Files](../files/storage-snapshots-files.md).

> [!TIP]
> The examples in this section enclose path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

This section contains the following examples:

> [!div class="checklist"]
> - Copy a file to another storage account
> - Copy a directory to another storage account
> - Copy a file share to another storage account
> - Copy all file shares, directories, and files to another storage account

> [!TIP]
> You can tweak your copy operation by using optional flags. Here's a few examples.
>
> |Scenario|Flag|
> |---|---|
> |Copy access control lists (ACLs) along with the files.|**--preserve-permissions**=[true\|false]|
> |Copy SMB property information along with the files.|**--preserve-info**=[true\|false]|
>
> For a complete list, see [options](https://github.com/Azure/azure-storage-azcopy/wiki/azcopy_copy#options).

### Copy a file to another storage account

**Syntax**

`azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name>/<file-path><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name>/<file-path><SAS-token>'`

**Example**

#### [Azure Files SMB](#tab/smb-copyfiletoaccount)

```azcopy
azcopy copy 'https://mysourceaccount.file.core.windows.net/mycontainer/myTextFile.txt?[SAS]' 'https://mydestinationaccount.file.core.windows.net/mycontainer/myTextFile.txt?[SAS]' --preserve-permissions=true --preserve-info=true
```

#### [Azure Files NFS](#tab/nfs-copyfiletoaccount)

```azcopy
azcopy copy 'https://mysourceaccount.file.core.windows.net/mycontainer/myTextFile.txt?[SAS]' 'https://mydestinationaccount.file.core.windows.net/mycontainer/myTextFile.txt?[SAS]' --preserve-permissions=true --preserve-info=true --from-to=FileNFSFileNFS
```

---

<a id="copyfiletoaccount"></a>

**Example (share snapshot)**

#### [Azure Files SMB](#tab/smb-copyfilesnapshottoaccount)

```azcopy
azcopy copy 'https://mysourceaccount.file.core.windows.net/mycontainer/myTextFile.txt?[SAS]&sharesnapshot=2020-09-23T08:21:07.0000000Z' 'https://mydestinationaccount.file.core.windows.net/mycontainer/myTextFile.txt?[SAS]' --preserve-permissions=true --preserve-info=true
```
#### [Azure Files NFS](#tab/nfs-copyfilesnapshottoaccount)

```azcopy
azcopy copy 'https://mysourceaccount.file.core.windows.net/mycontainer/myTextFile.txt?[SAS]&sharesnapshot=2020-09-23T08:21:07.0000000Z' 'https://mydestinationaccount.file.core.windows.net/mycontainer/myTextFile.txt?[SAS]' --preserve-permissions=true --preserve-info=true --from-to=FileNFSFileNFS
```

---

<a id="copyfilesnapshottoaccount"></a>

### Copy a directory to another storage account

**Syntax**

`azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name>/<directory-path><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' --recursive`

**Example**

#### [Azure Files SMB](#tab/smb-copydirectorytoaccount)

```azcopy
azcopy copy 'https://mysourceaccount.file.core.windows.net/myFileShare/myFileDirectory?[SAS]' 'https://mydestinationaccount.file.core.windows.net/mycontainer?[SAS]' --recursive --preserve-permissions=true --preserve-info=true
```

#### [Azure Files NFS](#tab/nfs-copydirectorytoaccount)

```azcopy
azcopy copy 'https://mysourceaccount.file.core.windows.net/myFileShare/myFileDirectory?[SAS]' 'https://mydestinationaccount.file.core.windows.net/mycontainer?[SAS]' --recursive --preserve-permissions=true --preserve-info=true --from-to=FileNFSFileNFS
```

---

<a id="copydirectorytoaccount"></a>

**Example (share snapshot)**

#### [Azure Files SMB](#tab/smb-copydirectorysharesnapshottoaccount)

```azcopy
azcopy copy 'https://mysourceaccount.file.core.windows.net/myFileShare/myFileDirectory?[SAS]&sharesnapshot=2020-09-23T08:21:07.0000000Z' 'https://mydestinationaccount.file.core.windows.net/mycontainer?[SAS]' --recursive --preserve-permissions=true --preserve-info=true
```

#### [Azure Files NFS](#tab/nfs-copydirectorysharesnapshottoaccount)

```azcopy
azcopy copy 'https://mysourceaccount.file.core.windows.net/myFileShare/myFileDirectory?[SAS]&sharesnapshot=2020-09-23T08:21:07.0000000Z' 'https://mydestinationaccount.file.core.windows.net/mycontainer?[SAS]' --recursive --preserve-permissions=true --preserve-info=true --from-to=FileNFSFileNFS
```

---

<a id="copydirectorysharesnapshottoaccount"></a>

### Copy a file share to another storage account

**Syntax**

`azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' --recursive`

**Example**

#### [Azure Files SMB](#tab/smb-copysharestoaccount)

```azcopy
azcopy copy 'https://mysourceaccount.file.core.windows.net/mycontainer?[SAS]' 'https://mydestinationaccount.file.core.windows.net/mycontainer?[SAS]' --preserve-permissions=true --preserve-info=true
```

#### [Azure Files NFS](#tab/nfs-copysharestoaccount)

```azcopy
azcopy copy 'https://mysourceaccount.file.core.windows.net/mycontainer?[SAS]' 'https://mydestinationaccount.file.core.windows.net/mycontainer?[SAS] --preserve-permissions=true --preserve-info=true --from-to=FileNFSFileNFS
```

---

<a id="copysharestoaccount"></a>

**Example (share snapshot)**

#### [Azure Files SMB](#tab/smb-copysharesnapshottoaccount)

```azcopy
azcopy copy 'https://mysourceaccount.file.core.windows.net/mycontainer?[SAS]&sharesnapshot=2020-09-23T08:21:07.0000000Z' 'https://mydestinationaccount.file.core.windows.net/mycontainer?[SAS]' --recursive --preserve-permissions=true --preserve-info=true
```
#### [Azure Files NFS](#tab/nfs-copysharesnapshottoaccount)

```azcopy
azcopy copy 'https://mysourceaccount.file.core.windows.net/mycontainer?[SAS]&sharesnapshot=2020-09-23T08:21:07.0000000Z' 'https://mydestinationaccount.file.core.windows.net/mycontainer?[SAS]' --recursive --preserve-permissions=true --preserve-info=true --from-to=FileNFSFileNFS
```

---

<a id="copysharesnapshottoaccount"></a>

### Copy all file shares, directories, and files to another storage account

**Syntax**

`azcopy copy 'https://<source-storage-account-name>.file.core.windows.net/<SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<SAS-token>' --recursive'`

**Example**

#### [Azure Files SMB](#tab/smb-copyaccounttoaccount)

```azcopy
azcopy copy 'https://mysourceaccount.file.core.windows.net?[SAS]' 'https://mydestinationaccount.file.core.windows.net?[SAS]' --recursive --preserve-permissions=true --preserve-info=true
```
#### [Azure Files NFS](#tab/nfs-copyaccounttoaccount)

```azcopy
azcopy copy 'https://mysourceaccount.file.core.windows.net?[SAS]' 'https://mydestinationaccount.file.core.windows.net?[SAS]' --recursive --preserve-permissions=true --preserve-info=true --from-to=FileNFSFileNFS
```

---

<a id="copyaccounttoaccount"></a>

**Example (share snapshot)**

#### [Azure Files SMB](#tab/smb-copyaccountsnapshottoaccount)
```azcopy
azcopy copy 'https://mysourceaccount.file.core.windows.net?[SAS]&sharesnapshot=2020-09-23T08:21:07.0000000Z' 'https://mydestinationaccount.file.core.windows.net?[SAS]' --recursive --preserve-permissions=true --preserve-info=true
```
#### [Azure Files NFS](#tab/nfs-copyaccountsnapshottoaccount)
```azcopy
azcopy copy 'https://mysourceaccount.file.core.windows.net?[SAS]&sharesnapshot=2020-09-23T08:21:07.0000000Z' 'https://mydestinationaccount.file.core.windows.net?[SAS]' --recursive --preserve-permissions=true --preserve-info=true --from-to=FileNFSFileNFS
```

---

### Specifying source and destination types when copying files

AzCopy uses the `--from-to` parameter to explicitly define the source and destination resource types when automatic detection might fail, such as in piping scenarios or emulators. This parameter helps AzCopy understand the context of the transfer and optimize accordingly.

| FromTo Value           | Description                                                                           |
|------------------------|---------------------------------------------------------------------------------------|
| `FileBlob`             | Copy from Azure File Storage to Azure Blob Storage                                    |
| `FileBlobFS`           | Copy from Azure File Storage to Azure Data Lake Gen2 (BlobFS)                         |
| `FileSMBFileSMB`       | Copy between two SMB shares in Azure File Storage                                     |
| `FileNFSFileNFS`       | Copy between two NFS shares in Azure File Storage                                     |
| `FileNFSFileSMB`       | Copy from Azure File Storage NFS to Azure Files Storage SMB                           |
| `FileSMBFileNFS`       | Copy from Azure File Storage SMB to Azure Files Storage NFS                           |


<a id="copyaccountsnapshottoaccount"></a>

## Synchronize files

You can synchronize the contents of a local file system with a file share or synchronize the contents of a file share with another file share. You can also synchronize the contents of a directory in a file share with the contents of a directory that is located in another file share. Synchronization is one way. In other words, you choose which of these two endpoints is the source and which one is the destination. Synchronization also uses server to server APIs.

> [!Warning]  
> AzCopy sync is supported but not fully recommended for Azure Files. AzCopy sync supports up to 10 million files per AzCopy job and some file fidelity might be lost as AzCopy uses the Azure Files REST APIs for copying content to your Azure Files share. To learn more, see [Migrate to Azure file shares](../files/storage-files-migration-overview.md#file-copy-tools).

### Guidelines

[!INCLUDE [Azcopy sync command general guidelines](../../../includes/azure-storage-azcopy-sync-guidelines.md)]

> [!TIP]
> You can tweak your sync operation by using optional flags. Here's a few examples.
>
> |Scenario|Flag|
> |---|---|
> |Copy access control lists (ACLs) along with the files.|**--preserve-permissions**=[true\|false]|
> |Copy SMB property information along with the files.|**--preserve-info**=[true\|false]|
> |Exclude files based on a pattern.|**--exclude-path**|
> |Specify how detailed you want your sync-related log entries to be.|**--log-level**=[WARNING\|ERROR\|INFO\|NONE]|
>
> For a complete list, see [options](storage-ref-azcopy-sync.md#options).

The examples in this section enclose path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

### Update a file share with changes to a local file system

In this case, the file share is the destination, and the local file system is the source.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy sync '<local-directory-path>' 'https://<storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' --recursive`

**Example**

#### [Azure Files SMB](#tab/smb-synclocaltoaccount)
```azcopy
azcopy sync 'C:\myDirectory' 'https://mystorageaccount.file.core.windows.net/myfileShare?[SAS]' --recursive
```
#### [Azure Files NFS](#tab/nfs-synclocaltoaccount)
```azcopy
azcopy sync '/myDirectory' 'https://mystorageaccount.file.core.windows.net/myfileShare?[SAS]' --recursive --from-to=LocalFileNFS
```

---

<a id="synclocaltoaccount"></a>

### Update a local file system with changes to a file share

In this case, the local file system is the destination, and the file share is the source.

> [!TIP]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes ('').

**Syntax**

`azcopy sync 'https://<storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' 'C:\myDirectory' --recursive`

**Example**

#### [Azure Files SMB](#tab/smb-syncaccounttolocal)
```azcopy
azcopy sync 'https://mystorageaccount.file.core.windows.net/myfileShare?[SAS]' 'C:\myDirectory' --recursive
```
#### [Azure Files NFS](#tab/nfs-syncaccounttolocal)
```azcopy
azcopy sync 'https://mystorageaccount.file.core.windows.net/myfileShare?[SAS]' '/myDirectory' --recursive --from-to=FileNFSLocal
```

---

<a id="syncaccounttolocal"></a>

### Update a file share with changes from another file share

The first file share in this command is the source. The command copies changes from this source file share. The second file share is the destination.

**Syntax**

`azcopy sync 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' --recursive`

**Example**

#### [Azure Files SMB](#tab/smb-syncaccounts)
```azcopy
azcopy sync 'https://mysourceaccount.file.core.windows.net/myfileShare?[SAS]' 'https://mydestinationaccount.file.core.windows.net/myfileshare?[SAS]' --recursive --preserve-permissions=true --preserve-info=true
```
#### [Azure Files NFS](#tab/nfs-syncaccounts)
```azcopy
azcopy sync 'https://mysourceaccount.file.core.windows.net/myfileShare?[SAS]' 'https://mydestinationaccount.file.core.windows.net/myfileshare?[SAS]' --recursive --preserve-permissions=true --preserve-info=true --from-to=FileNFSFileNFS
```

---

<a id="syncaccounts"></a>

### Update a directory with changes to a directory in another file share

The first directory that appears in this command is the source. The second one is the destination.

**Syntax**

`azcopy sync 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name>/<directory-name><SAS-token>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name>/<directory-name><SAS-token>' --recursive`

**Example**

#### [Azure Files SMB](#tab/smb-syncdirectory)
```azcopy
azcopy sync 'https://mysourceaccount.file.core.windows.net/myFileShare/myDirectory?[SAS]' 'https://mydestinationaccount.file.core.windows.net/myFileShare/myDirectory?[SAS]' --recursive --preserve-permissions=true --preserve-info=true
```
#### [Azure Files NFS](#tab/nfs-syncdirectory)
```azcopy
azcopy sync 'https://mysourceaccount.file.core.windows.net/myFileShare/myDirectory?[SAS]' 'https://mydestinationaccount.file.core.windows.net/myFileShare/myDirectory?[SAS]' --recursive --preserve-permissions=true --preserve-info=true --from-to=FileNFSFileNFS
```

---

<a id="syncdirectory"></a>

### Update a file share to match the contents of a share snapshot

The first file share that appears in this command is the source. At the end of the URI, append the string `&sharesnapshot=` followed by the **DateTime** value of the snapshot.

**Syntax**

`azcopy sync 'https://<source-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>&sharesnapsot<snapshot-ID>' 'https://<destination-storage-account-name>.file.core.windows.net/<file-share-name><SAS-token>' --recursive`

**Example**

#### [Azure Files SMB](#tab/smb-syncsnapshottoaccount)
```azcopy
azcopy sync 'https://mysourceaccount.file.core.windows.net/myfileShare?[SAS]&sharesnapshot=2020-09-23T08:21:07.0000000Z' 'https://mydestinationaccount.file.core.windows.net/myfileshare?[SAS]' --recursive --preserve-permissions=true --preserve-info=true
```
#### [Azure Files NFS](#tab/nfs-syncsnapshottoaccount)
```azcopy
azcopy sync 'https://mysourceaccount.file.core.windows.net/myfileShare?[SAS]&sharesnapshot=2020-09-23T08:21:07.0000000Z' 'https://mydestinationaccount.file.core.windows.net/myfileshare?[SAS]' --recursive --preserve-permissions=true --preserve-info=true --from-to=FileNFSFileNFS
```

---

<a id="syncsnapshottoaccount"></a>


To learn more about share snapshots, see [Overview of share snapshots for Azure Files](../files/storage-snapshots-files.md).

## Properties and permissions to be preserved 

> [!TIP]
> When you download files to a local Linux system, you need elevated privileges if the specified owner or group differs from that of the current user. To change the ownership or group of downloaded files, run azcopy with sudo or as the root user. 

| **Type**                | **Properties (--preserve-info)**                                                                 | **Permissions (--preserve-permissions)** |
|-------------------------|--------------------------------------------------------------------------------------------------|------------------------------------------|
| **Azure Files SMB**     | NTFSFileAttributes (ReadOn ReadOnly, Hidden, System, Directory, Archive, None, Temporary, Offline, NotContentIndexed, NoScrubData) (x-ms-file-attributes) <br> CreationTime (x-ms-file-creation-time) <br> LastWriteTime (x-ms-file-last-write-time) | ACLs (x-ms-file-permission)              |
| **Azure Files NFS**     | CreationTime (x-ms-file-creation-time) <br> LastWriteTime (x-ms-file-last-write-time)                                                | Owner (x-ms-owner) <br> Group (x-ms-group) <br> FileMode (x-ms-mode) |



## Next steps

Find more examples in any of these articles:

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Transfer data](storage-use-azcopy-v10.md#transfer-data)

See these articles to configure settings, optimize performance, and troubleshoot issues:

- [AzCopy configuration settings](storage-ref-azcopy-configuration-settings.md)
- [Optimize the performance of AzCopy](storage-use-azcopy-optimize.md)
- [Find errors and resume jobs by using log and plan files in AzCopy](storage-use-azcopy-configure.md)
- [Troubleshoot problems with AzCopy v10](storage-use-azcopy-troubleshoot.md)
