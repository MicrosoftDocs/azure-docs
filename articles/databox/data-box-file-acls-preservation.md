---
title: Preserving file ACLs, attributes, and timestamps with Azure Data Box 
description: ACLs, timestamps, and attributes preserved during data copy via SMB to Azure Data Box. Copying metadata with Windows and Linux data copy tools.  
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: conceptual
ms.date: 09/12/2022
ms.author: alkohli
---

# Preserving file ACLs, attributes, and timestamps with Azure Data Box

Azure Data Box lets you preserve access control lists (ACLs), timestamps, and file attributes when sending data to Azure. This article describes the metadata that you can transfer when copying data to Data Box via Server Message Block (SMB) to upload it to Azure Files. 

## Transferred metadata

ACLs, timestamps, and file attributes are the metadata that is transferred when the data from Data Box is uploaded to Azure Files. In this article, ACLs, timestamps, and file attributes are referred to collectively as *metadata*.

The metadata can be copied with Windows and Linux data copy tools. Metadata isn't preserved when transferring data to blob storage. Metadata is also not transferred when copying data over NFS. 

The subsequent sections of the article discuss in detail as to how the timestamps, file attributes, and ACLs are transferred when the data from Data Box is uploaded to Azure Files. 

## Timestamps

The following timestamps are transferred:
- CreationTime
- LastWriteTime

The following timestamp isn't transferred:
- LastAccessTime

## File attributes

File attributes on both files and directories are transferred unless otherwise noted.

The following file attributes are transferred:
- FILE_ATTRIBUTE_READONLY (file only)
- FILE_ATTRIBUTE_HIDDEN
- FILE_ATTRIBUTE_SYSTEM
- FILE_ATTRIBUTE_DIRECTORY (directory only)
- FILE_ATTRIBUTE_ARCHIVE
- FILE_ATTRIBUTE_TEMPORARY (file only)
- FILE_ATTRIBUTE_NO_SCRUB_DATA

The following file attributes aren't transferred:
- FILE_ATTRIBUTE_OFFLINE
- FILE_ATTRIBUTE_NOT_CONTENT_INDEXED
  
Read-only attributes on directories aren't transferred.

## Alternate data streams and extended attributes

[Alternate data streams](/openspecs/windows_protocols/ms-fscc/e2b19412-a925-4360-b009-86e3b8a020c8) and extended attributes are not supported in Azure Files, page blob, or block blob storage, so they are not transferred when copying data. 

## ACLs

<!--ACLs DEFINITION

**Transfer methods.** Support for ACLs transfer during a data copy varies with the file transfer protocol or service that you use. There are also some differences when you use a Windows client vs. a Linux client for the data copy.

- SMB transfers. When you [copy data over SMB](databox/data-box-deploy-copy-data.md), all the ACLs for directories and files that you copy to your Data Box over SMB are copied and transferred. Transfers include both discretionary ACLs (DACLs) and system ACLs (SACLs). If you're using a Linux client for an SMB transfer, only Windows NT ACLs are transferred.

- NFS transfers. ACLs aren't transferred when you [copy data over Network File System (NFS)](databox/data-box-deploy-copy-data-via-nfs.md).

- Data copy service - ACLs aren't transferred when you [copy data via the data copy service](data-box-deploy-copy-data-via-copy-service.md). The data copy service reads data directly from your shares and can't read ACLs.
 
**Default ACLs.** Even if your data copy tool does not copy ACLs, in Windows, the default ACLs on directories and files are transferred to Azure Files. The default ACLs aren't transferred in Linux.

The default ACLs have permissions for the built-in Administrator account, the SYSTEM account, and the SMB share user account that was used to mount and copy data in the Data Box.

The ACLs contain security descriptors with the following properties: ACLs, Owner, Group, SACL.

**Disabling ACLs transfer.** Transfer of ACLs is enabled by default. You might want to disable this setting in the local web UI on your Data Box. For more information, see [Use the local web UI to administer your Data Box and Data Box.-->

Depending on the transfer method used and whether you're using a Windows or Linux client, some or all discretionary and default access control lists (ACLs) on files and folders may be transferred during the data copy to Azure Files.

Transfer of ACLs is enabled by default. You might want to disable this setting in the local web UI on your Data Box. For more information, see [Use the local web UI to administer your Data Box and Data Box Heavy](./data-box-local-web-ui-admin.md).
 
> [!NOTE]
> Files with ACLs containing conditional access control entry (ACE) strings are not copied. This is a known issue. To work around this, copy these files to the Azure Files share manually by mounting the share and then using a copy tool that supports copying ACLs.

### ACLs transfer over SMB

During an [SMB file transfer](./data-box-deploy-copy-data.md), the following ACLs are transferred:

- Discretionary ACLs (DACLs) and system ACLs (SACLs) for directories and files that you copy to your Data Box.
- If you use a Linux client, only Windows NT ACLs are transferred.<!--Kyle asked: What are Windows NT ACLs.-->

### ACLs transfer over Data Copy Service

During a [data copy service file transfer](data-box-deploy-copy-data-via-copy-service.md), the following ACLs are transferred:

- Discretionary ACLs (DACLs) and system ACLs (SACLs) for directories and files that you copy to your Data Box.

To copy SACLs from your files, you must provide credentials for a user with **SeBackupPrivilege**. Users in the Administrators or Backup Operators group will have this privilege by default

If you do not have **SeBackupPrivilege**:
- You will not be able to copy SACLs for Azure Files copy service jobs.
- You may experience access issues and receive this error in the error log: *Could not read SACLs from share due to insufficient privileges*.

 For more information, learn more about [SeBackupPrivilege](/windows/win32/secauthz/privilege-constants). 

### ACLs transfer over NFS
 
ACLs (and metadata attributes) aren't transferred when you copy data over [NFS](data-box-deploy-copy-data-via-nfs.md).


### Default ACLs transfer

Even if your data copy tool doesn't copy ACLs, the default ACLs on directories and files are transferred to Azure Files when you use a Windows client. The default ACLs aren't transferred when you use a Linux client.

The following default ACLs are transferred:

- Account permissions:
  - Built-in Administrator account
  - SYSTEM account
  - SMB share user account used to mount and copy data in the Data Box

- Security descriptors with these properties: DACL, Owner, Group, SACL

## Copying data and metadata

To transfer the ACLs, timestamps, and attributes for your data, use the following procedures to copy data into the Data Box.

### Windows data copy tool

To copy data to your Data Box via SMB, use an SMB-compatible file copy tool such as `robocopy`. The following sample command copies all files and directories, transferring metadata along with the data.

When using the `/copyall` or `/dcopy:DAT` option, make sure the required Backup Operator privileges aren't disabled. For more information, see [Use the local web UI to administer your Data Box and Data Box Heavy](./data-box-local-web-ui-admin.md).

```console
robocopy <Source> <Target> * /copyall /e /dcopy:DAT /B /r:3 /w:60 /is /nfl /ndl /np /MT:32 or 64 /fft /log+:<LogFile>
```

where

|Option |Description |
|------------------- | ----- |
|`/copyall` |Copies all attributes.|
|`/e`      |Copies subdirectories, including empty directories.         |
|`/dcopy:DAT`  |Copies data, attributes, and timestamps. Note: The /dcopy:DAT option must be used to transfer `CreationTime` on directories. |
|`/B`      |Copies files in Backup mode. |
|`/r:3`    |Specifies 3 retries on failed copies.         |
|`/w:60`   |Specifies a wait time of 60 seconds between retries.         |
|`/is`     |Includes the same files.         |
|`/nfl`    |Does not log file names.         |
|`/ndl`    |Does not log directory names.        |
|`/np`     |Does not display progress of the copying operation.         |
|`/MT:32 or 64`  |Uses multithreading, with 32 or 64 threads.           |
|`/fft`    |Reduces time stamp granularity for any file system.        |
|`/log+:<LogFile>`  |Appends the output to the existing log file.|

For more information on these `robocopy` parameters, see [Tutorial: Copy data to Azure Data Box via SMB](./data-box-deploy-copy-data.md)

> [!NOTE]
> If you use `/copyall` to copy your data, the source ACLs on directories and files are transferred to Azure Files. If you only had read-access on your source data and could not modify the source data, you'll have read-access only on the data in the Data Box. Use `/copyall` only if you intend to copy all the ACLs on the directories and files along with the data.

#### Use robocopy to list, copy, modify files on Data Box

Here are some of the common scenarios you'll use when copying data using `robocopy`.

- **Copy only data to Data Box, no ACLs on directories and files**

    Use the `/dcopy:DAT` option to only copy data, attributes, timestamps. ACLs on directories and files are not copied.

- **Copy data and ACLs on directories and files to Data Box**

    Use `/copyall` to copy all the source data including all the ACLs on directories and files.

- **List the filesystem on Data Box using robocopy**

    Use this command to list directory contents:

    `robocopy <source-dir> NULL /l /s /xx /njh /njs /fp /B`

    Note that the File Explorer doesn't allow you to list these files.
    
- **Copy or delete folders and files on Data Box**

    Use this command to copy a single file:

    `robocopy <source-dir> <destination-dir> <file-name> /B`

    Use this command to delete a single file:

    `robocopy <source-dir> <destination-dir> <file-name> /purge /B`

    In the above command, the `<source-dir>` should not have the file: `<file-name>`. Then, the above command syncs the destination with the source, resulting in the removal of the file from the destination.

    Note that the File Explorer may not allow you to perform the above operations.

For more information, see [Using robocopy commands](/windows-server/administration/windows-commands/robocopy).

### Linux data copy tools

Transferring metadata in Linux is a two-step process. First, you copy the source data using a tool such as `rsync`, which does not copy metadata. After you copy the data, you can copy the metadata using a tool such as `smbcacls` or `cifsacl`.

The following sample commands do the first step, copying the data using `rsync`. 

```console
cp -aR /etc /opt/ 
rsync -avP /etc /opt (-a copies a directory)
```

## Next steps

- [Copy data to Azure Data Box via SMB](./data-box-deploy-copy-data.md)
