---
title: Preserving file ACLs, attributes, and timestamps with Azure Data Box 
description: ACLs, timestamps, and attributes preserved during data copy via SMB to Azure Data Box. Copying metadata with Windows and Linux data copy tools.  
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: conceptual
ms.date: 10/06/2020
ms.author: alkohli
---

# Preserving file ACLs, attributes, and timestamps with Azure Data Box

Azure Data Box lets you preserve access control lists (ACLs), timestamps, and file attributes when sending data to Azure. This article describes the metadata that you can transfer when copying data to Data Box via Server Message Block (SMB) to upload it to Azure Files. 

Specific steps are provided to copy metadata with Windows and Linux data copy tools. Metadata isn't preserved when transferring data to blob storage.

In this article, the ACLs, timestamps, and file attributes that are transferred are referred to collectively as *metadata*.

## Transferred metadata

The following metadata is transferred when data from the Data Box is uploaded to Azure Files.

#### Timestamps

The following timestamps are transferred:
- CreationTime
- LastWriteTime

The following timestamp isn't transferred:
- LastAccessTime
  
#### File attributes

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

#### ACLs

All the ACLs for directories and files that you copy to your Data Box over SMB are copied and transferred. Transfers include both discretionary ACLs (DACLs) and system ACLs (SACLs). For Linux, only Windows NT ACLs are transferred.

ACLs aren't transferred during data copies over Network File System (NTS) and when you use the data copy service to transfer your data. The data copy service reads data directly from your shares and can't read ACLs.

Even if your data copy tool does not copy ACLs, the default ACLs on directories and files are transferred to Azure Files. The default ACLs have permissions for the built-in Administrator account, the SYSTEM account, and the SMB share user account that was used to mount and copy data in the Data Box.

The ACLs contain security descriptors with the following properties: ACLs, Owner, Group, SACL.

Transfer of ACLs is enabled by default. You might want to disable this setting in the local web UI on your Data Box. For more information, see [Use the local web UI to administer your Data Box and Data Box Heavy](./data-box-local-web-ui-admin.md).

> [!NOTE]
> Files with ACLs containing conditional access control entry (ACE) strings are not copied. This is a known issue. To work around this, copy these files to the Azure Files share manually by mounting the share and then using a copy tool that supports copying ACLs.

## Copying data and metadata

To transfer the ACLs, timestamps, and attributes for your data, use the following procedures to copy data into the Data Box. 

### Windows data copy tool

To copy data to your Data Box via SMB, use an SMB-compatible file copy tool such as `robocopy`. The following sample command copies all files and directories, transferring metadata along with the data.

When using the `/copyall` or `/dcopy:DAT` option, make sure the required Backup Operator privileges aren't disabled. For more information, see [Use the local web UI to administer your Data Box and Data Box Heavy](./data-box-local-web-ui-admin.md). 

```console
robocopy <Source> <Target> * /copyall /e /dcopy:DAT /r:3 /w:60 /is /nfl /ndl /np /MT:32 or 64 /fft /log+:<LogFile>
```

where

|Option |Description |
|------------------- | ----- |
|`/copyall` |Copies all attributes.|
|`/e`      |Copies subdirectories, including empty directories.         |
|`/dcopy:DAT`  |Copies data, attributes, and timestamps. Note: The /dcopy:DAT option must be used to transfer `CreationTime` on directories. |
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

### Linux data copy tool

Transferring metadata in Linux is a two-step process. First, you copy the source data using a tool such as `rsync`, which does not copy metadata. After you copy the data, you can copy the metadata using a tool such as `smbcacls` or `cifsacl`. 

The following sample commands do the first step, copying the data using `rsync`. 

```console
cp -aR /etc /opt/ 
rsync -avP /etc /opt (-a copies a directory)
```

## Next steps

- [Copy data to Azure Data Box via SMB](./data-box-deploy-copy-data.md)