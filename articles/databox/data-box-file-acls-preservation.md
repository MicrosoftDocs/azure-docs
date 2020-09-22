---
title: Preserving ACLs and metadata on files in Azure Data Box and Azure Files 
description: Describes metadata preserved (file ACLs, timestamps, attributes) when copying data to Azure Data Box and Azure Files and requirements for metadata transfer.  
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: conceptual
ms.date: 09/22/2019
ms.author: alkohli
---

# Preserving ACLs and metadata on files in Azure Data Box and Azure Files

This article describes metadata (ACLs, timestamps, and attributes) that you can preserve when copying data to Azure Data Box and Azure Files, and requirements for transferring the metadata. Steps for copying metadata with Windows-based and Linux-based data are provided.

## Supported source data

Supported:
- For Windows, metadata and ACLs are fully supported.
- For Linux, when transferring data over SMB, only Windows NT ACLs are supported.

Not supported (for all data transferred via Data Box):
- Read-only attributes on directories (applies to Windows and Linux)
- ACLs on data transferred over NFS
- ACLs and metadata on data copied using the data copy service 

  The data copy service reads data directly from your shares. It can't read ACLs. 

## Transported metadata

The following metadata for data transferred over SMB.

- Timestamps:
  - CreationTime
  - CreationTimeUtc
  - LastAccessTime
  - LastAccessTimeUtc
  - LastWriteTime
  - LastWriteTimeUtc

- File attributes:<!--Identify these as NTFS file attributes, as in the original draft?-->

  Supported:
  - FILE_ATTRIBUTE_READONLY (file only)
  - FILE_ATTRIBUTE_HIDDEN
  - FILE_ATTRIBUTE_SYSTEM
  - FILE_ATTRIBUTE_DIRECTORY (directory only)
  - FILE_ATTRIBUTE_ARCHIVE
  - FILE_ATTRIBUTE_TEMPORARY (file only)
  - FILE_ATTRIBUTE_NO_SCRUB_DATA

  Not supported:
  - FILE_ATTRIBUTE_OFFLINE
  - FILE_ATTRIBUTE_NOT_CONTENT_INDEXED

- ACLs

  Share ACLs for the directories and files that are copied to your Data Box over SMB are all copied and transported. 

  The ACLs contain security descriptors, and these have the following properties: ACLs, Owner, Group, SACL.<!--Does the following note become a release note INSTEAD of staying here?-->

  > [!NOTE]
  > A known issue exists for files with ACLs containing conditional access control entry (ACE) strings, causing the files not to be copied. Until this issue is fixed, you need to copy these files to the Azure Files share manually, by mounting the share and using a copy tool that supports copying ACLs.

  By default, transport of the ACLs is enabled. You might want to disable this setting by accessing the local web UI on your Data Box. For more information, see [Use the local web UI to administer your Data Box and Data Box Heavy](./data-box-local-web-ui-admin.md).

## Detailed steps

### For Window-based source data

To copy data to your Data Box via SMB, use an SMB-compatible file copy tool such as robocopy.

If the tool used to copy data to the Data Box does not copy ACLs, the default ACLs on the directories and files are present and are transported to Azure Files. The default ACLs have permissions for Built-in Administrators, System, and the SMB Share user account that was used to mount and copy data. <!--This seems buried in this section. The info about default ACLs pertains to supported ACLs?-->

The following sample command copies all files and directories.

> [!NOTE]
> The copyall command <!--command or switch?-->requires Backup Operator privileges. These are enabled by default. Before using copyall commands, make sure these privileges are not disabled. For more information, see [Use the local web UI to administer your Data Box and Data Box Heavy](./data-box-local-web-ui-admin.md). 

```console
robocopy <Source> <Target> * /copyall /e /r:3 /w:60 /is /nfl /ndl /np /MT:32 or 64 /fft /Log+:<LogFile>
```

where

|Parameter |Description |
|------------------- | ----- |
|/copyall |Copies all files.|
|/e      |Copies subdirectories, including empty directories.         |
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

### For Linux-based source data

Copy Linux-based source data using a tool such as rsync, which does not preserve metadata. After you copy the data, you can transfer the metadata using a tool such as SMBCACL or CIFSACL. The following sample commands copy the data using rsync. 

```console
cp -aR /etc /opt/ 
rsync -avP /etc /opt (-a copies a directory)
```