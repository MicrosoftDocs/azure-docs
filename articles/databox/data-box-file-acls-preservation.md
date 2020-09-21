---
title: File ACLs preservation using Azure Data Box and Azure Files 
description: Describes how file ACLs and metadata are preserved during file transfers in Azure Data Box or Azure files
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: conceptual
ms.date: 09/18/2019
ms.author: alkohli
---

# File ACLs preservation using Azure Data Box and Azure Files

## Introduction

Data Box lets you transfer your files to Azure Files and Azure Files Sync in an offline fashion, and is especially suited to situations when your bandwidth is limited and your data set is large. This article explains how you can use Data Box to transfer files into Azure Files with your metadata (ACLs, timestamps and attributes) preserved. This article also goes on to enumerate the steps that you can take to work with Azure Files Sync.

## Things to note

Source share types:

- Read-only attributes on directories are not preserved in the Data Box. 

- Windows-based source data: Metadata and ACLs fully supported. 

- Unix/Linux-based source data:
  - Only NT ACLs supported. 
  - Windows NT ACLs alone supported, and it has to be ingested into the Data Box over SMB. 

- Over NFS, ACLs are not supported. 

## Metadata properties that can be preserved

All the ACLs (DACLs and SACLs) for the directories and files that are copied over SMB to Data Box get transported to Azure Files Share. Create time and Last Write time are preserved and copied over to Azure Files. 

The following File Attributes can be transported to Azure Files:

| NTFS File Attribute | Notes |
| ------------------- | ----- |
| FILE_ATTRIBUTE_READONLY | File only |
| FILE_ATTRIBUTE_HIDDEN | xxx |
| FILE_ATTRIBUTE_SYSTEM | xxx |
| FILE_ATTRIBUTE_DIRECTORY | Directory only |
| FILE_ATTRIBUTE_ARCHIVE | xxx |
| FILE_ATTRIBUTE_TEMPORARY | File only |
| FILE_ATTRIBUTE_NO_SCRUB_DATA | xxx |

> [!NOTE]
> A known issue exists for files which contains ACLs with conditional-ace-types, where the file will fail to be copied. Until this issue is fixed, these files will need to be copied to the Azure File share manually, by mounting the share and using a copy tool that supports copying ACLs.

If the tool that is copying data to the Data box does not also copy ACLs, the default ACLs will be present on the Directories and Files and will be transported to Azure Files. They will have permissions for the Built-in Administrators, System and the specific SMB Share user account that was used to mount and copy data.

The local/OOBE UI has the switch to enable/disable transporting metadata to Azure (Files). When the switch is made to disable metadata transport, none of the ACLs/timestamps or the attributes present on the Directories/Files copied to Data Box will be transported to Azure.

## What NTFS metadata properties does Azure Files support?

- Security Descriptor: ACLs, Owner, group, sacl
- Attributes
- Timestamps: LastWriteTime, CreationTime (but not ChangeTime) 

### Vampire mode limitations
The copy service running in Data Box, that reads data from customers' shares, can only transfer data. It can't read ACLs.

## Detailed steps

1. Copy data into your Data Box using the following robocopy command. To copy all files, use /copyall.
   
   robocopy <Source> <Target> * /copyall /e /r:3 /w:60 /is /nfl /ndl /np /MT:32 or 64 /fft /Log+:<LogFile>

2. Copy data from other Linux tools, such as rsync, that do not preserve metadata, using the following commands:
   cp -aR /etc /opt/ 
   rsync -avP /etc /opt (-a copies a directory)