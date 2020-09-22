---
title: File ACLs preservation using Azure Data Box and Azure Files 
description: Describes how file ACLs and metadata are preserved during file transfers in Azure Data Box or Azure files
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: conceptual
ms.date: 09/21/2019
ms.author: alkohli
---

# Preserving file ACLs using Azure Data Box and Azure Files

Data Box lets you transfer your files to Azure Files and Azure Files Sync in an offline fashion, and is especially suited to situations when your bandwidth is limited and your data set is large. This article explains how you can use Data Box to transfer files into Azure Files with your metadata (ACLs, timestamps, and attributes) preserved. This article also goes on to enumerate the steps that you can take to work with Azure Files Sync.

## Source share types

| Source data type | Supported metadata |
| ------------------- | ----- |
|Window-based | Metadata and ACLs fully supported. |
|Unix/Linux-based | Only NT ACLs supported. <break> Windows NT ACLs alone supported, and they must be ingested into the Data Box over SMB.| 

Limitations:

- Read-only attributes on directories are not preserved in the Data Box.

- Transfer of ACLs is not supported over NFS.

## Preserve metadata in Azure Data Box

All the file, directory, and share ACLs for the directories and files that are copied to your Data Box over SMB are transported to the Azure Files share. Create time and Last Write time also are copied to the share. 

The following file attributes can be transported to Azure Files:

| NTFS File Attribute | Notes |
| ------------------- | ----- |
| FILE_ATTRIBUTE_READONLY | File only |
| FILE_ATTRIBUTE_HIDDEN | |
| FILE_ATTRIBUTE_SYSTEM | |
| FILE_ATTRIBUTE_DIRECTORY | Directory only |
| FILE_ATTRIBUTE_ARCHIVE | |
| FILE_ATTRIBUTE_TEMPORARY | File only |
| FILE_ATTRIBUTE_NO_SCRUB_DATA | |

> [!NOTE]
> A known issue exists for files with ACLs containing conditional access control entry (ACE) strings, causing the files not to be copied. Until this issue is fixed, you need to copy these files to the Azure Files share manually, by mounting the share and using a copy tool that supports copying ACLs.

If the tool used to copy data to the Data Box does not copy ACLs, the default ACLs on the directories and files are present and are transported to Azure Files. The default ACLs have permissions for Built-in Administrators, System, and the SMB Share user account that was used to mount and copy data.

By default, the supported attributes, ACLs, and timestamps on directories and files copied to a Data Box are transported to Azure during the data copy. To enable or disable metadata transport, change the Enable ACLs for Azure Files setting in the local web UI. For more information, see [Use the local web UI to administer your Data Box and Data Box Heavy](./data-box-local-web-ui-admin.md).

## Preserve NTFS metadata in Azure Files

The following metadata can be transported to Azure Files:

|Metadata type |Properties transported |
|------------------- | ----- |
|Security Descriptor |ACLs, Owner, Group, SACL |
|Attributes |   |
|Timestamps |LastWriteTime, CreationTime (but not ChangeTime) |

### Transfer data via data copy service

When you ingest data using the data copy service running in Data Box, you can only transfer data, not metadata. The data copy service reads data directly from your shares. It can't read ACLs.

## Detailed steps

### Copy metadata via SMB

To copy data to your Data Box via SMB, use an SMB-compatible file copy tool such as robocopy. The following sample command copies all files and directories. For a fuller description of robocopy attributes, see [Tutorial: Copy data to Azure Data Box via SMB](./data-box-deploy-copy-data.md)

```console
robocopy <Source> <Target> * /copyall /e /r:3 /w:60 /is /nfl /ndl /np /MT:32 or 64 /fft /Log+:<LogFile>
```

where

|copyall |Copies all files.|
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

### Copy metadata via NFS

Linux tools for copying data, such as rsync, do not preserve metadata. The following sample commands will copy metadata when using rsync for a data copy.

```console
cp -aR /etc /opt/ 
rsync -avP /etc /opt (-a copies a directory)
```