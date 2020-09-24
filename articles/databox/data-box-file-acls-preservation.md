---
title: Preserving file ACLs/attributes/timestamps with Azure Data Box 
description: Metadata (ACLs/timestamps/attributes) preserved during data copy via SMB to Azure Data Box. Copying metadata with Windows and Linux data copy tools.  
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: conceptual
ms.date: 09/24/2019
ms.author: alkohli
---

# Preserving file ACLs, attributes, and timestamps with Azure Data Box

Azure Data Box lets you preserve ACLs, timestamps, and file attributes when sending data to Azure. This article describes the metadata that you can transfer when copying data to Data Box via Server Message Block (SMB) to upload it to Azure Files. Specific steps are provided to copy metadata with Windows and Linux data copy tools.

In this article, the ACLs, timestamps, and file attributes that are transferred are referred to collectively as *metadata*.

<!--## Supported metadata in source data

When using Data Box to copy data from your source data servers, some of the metadata is preserved.

Depending on the data source, the following metadata is preserved:
- For Windows, metadata and ACLs are fully supported.
- For Linux, when transferring data over SMB, only Windows NT ACLs are supported.

Regardless of the data source, for all data transferred over SMB, the following metadata is not preserved in the following situations:
- Read-only attributes on directories.
- ACLs on data transferred over Network File System (NFS).
- When using the data copy service to transfer your data. The data copy service reads data directly from your shares and can't read ACLs.-->

## Transferred metadata

The following metadata is transferred when data from the Data Box is uploaded to Azure Files.

- Timestamps:

  The following timestamps are transferred:
  - CreationTime
  - LastWriteTime

  The following timestamp is not transferred.
  - LastAccessTime
  
- File attributes:

  File attributes on both files and directories are transferred unless otherwise noted.

  Read-only attributes on directories aren't transferred.

  The following file attributes are transferred:
  - FILE_ATTRIBUTE_READONLY (file only)
  - FILE_ATTRIBUTE_HIDDEN
  - FILE_ATTRIBUTE_SYSTEM
  - FILE_ATTRIBUTE_DIRECTORY (directory only)
  - FILE_ATTRIBUTE_ARCHIVE
  - FILE_ATTRIBUTE_TEMPORARY (file only)
  - FILE_ATTRIBUTE_NO_SCRUB_DATA

  The following file attributes are not transferred:
  - FILE_ATTRIBUTE_OFFLINE
  - FILE_ATTRIBUTE_NOT_CONTENT_INDEXED

- ACLs:

  All the ACLs for directories and files that you copy to your Data Box over SMB are copied and transferred. Transfers include both discretionary ACLs (DACLs) and system ACLs (SACLs). For Linux, only Windows NT ACLs are transferred.

  ACLs aren't transferred during data copies over Network File System (NTS) and when you use the data copy service to transfer your data. The data copy service reads data directly from your shares and can't read ACLs.

  The ACLs contain security descriptors with the following properties: ACLs, Owner, Group, SACL.

  Transfer of ACLs is enabled by default. You might want to disable this setting in the local web UI on your Data Box. For more information, see [Use the local web UI to administer your Data Box and Data Box Heavy](./data-box-local-web-ui-admin.md).

  If the tool that you use to copy data to the Data Box doesn't copy ACLs, the default ACLs on the directories and files are present and<!--Is "are present" needed?--> are transferred to Azure Files. The default ACLs have permissions for Built-in Administrators, System, and the SMB Share user account that was used to mount and copy data.

  > [!NOTE]
  > Files with ACLs containing conditional access control entry (ACE) strings are not copied. This is a known issue. To work around this, copy these files to the Azure Files share manually by mounting the share and then using a copy tool that supports copying ACLs.

## Copying data and metadata

To transfer the ACLs, timestamps, and attributes for your data, use the following procedures to copy data into the Data Box. 

### Windows data copy tool

To copy data to your Data Box via SMB, use an SMB-compatible file copy tool such as robocopy. The following sample command copies all files and directories, transferring metadata along with the data.<!--ADDED LAST CLAUSE TO CONTRAST WINDOWS WITH LINUX.-->

When using the /copyall <!--or /dcopy:DAT?--> option, make sure the required Backup Operator privileges aren't disabled. For more information, see [Use the local web UI to administer your Data Box and Data Box Heavy](./data-box-local-web-ui-admin.md). 

```console
robocopy <Source> <Target> * /copyall /e /dcopy:DAT /r:3 /w:60 /is /nfl /ndl /np /MT:32 or 64 /fft /Log+:<LogFile>
```

where

|Option |Description |
|------------------- | ----- |
|/copyall |Copies all attributes.|
|/e      |Copies subdirectories, including empty directories.         |
|/dcopy:DAT  |Copies data, attributes, and timestamps.|
|/r:3    |Specifies 3 retries on failed copies.         |
|/w:60   |Specifies a wait time of 60 seconds between retries.         |
|/is     |Includes the same files.         |
|/nfl    |Does not log file names.         |
|/ndl    |Does not log directory names.        |
|/np     |Does not display progress of the copying operation.         |
|/MT:32 or 64  |Uses multithreading, with 32 or 64 threads.           |
|/fft    |Reduces time stamp granularity for any file system.        |
|log+:\<LogFile>  |Appends the output to the existing log file.|

For more information on these robocopy parameters, see [Tutorial: Copy data to Azure Data Box via SMB](./data-box-deploy-copy-data.md)

### Linux data copy tool

<!--Revised to emphasize that this is step 1 of a 2-step process.-->Transferring metadata in Linux is a two-step process. First, you copy the source data using a tool such as rsync, which does not preserve metadata. After you copy the data, you can transfer the metadata using a tool such as SMBCACL or CIFSACL. 

The following sample commands do the first step, copying the data using rsync.

```console
cp -aR /etc /opt/ 
rsync -avP /etc /opt (-a copies a directory)
```