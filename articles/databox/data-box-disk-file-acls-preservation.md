---
title: Preserving file ACLs, attributes, and timestamps with Azure Data Box disk
description: ACLs, timestamps, and attributes preserved during data copy to Azure Data Box Disk. Copying metadata with Windows and Linux data copy tools.  
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: pod
ms.topic: conceptual
ms.date: 12/22/2022
ms.author: shaas
---

# Preserving file ACLs, attributes, and timestamps with Azure Data Box disk

Azure Data Box Disk lets you preserve access control lists (ACLs), timestamps, and file attributes when sending data to Azure. This article describes the metadata that you can transfer when copying data to Data Box Disk to upload it to Azure Files. 

## Transferred metadata

ACLs, timestamps, and file attributes are the metadata that is transferred when the data from Data Box Disk is uploaded to Azure Files. In this article, ACLs, timestamps, and file attributes are referred to collectively as *metadata*.

The metadata can be copied with Windows data copy tools. Metadata isn't preserved when transferring data to blob storage.

The subsequent sections of the article discuss in detail as to how the timestamps, file attributes, and ACLs are transferred when the data from Data Box Disk is uploaded to Azure Files. 

[!INCLUDE [data-box-transferred-metadata](../../includes/data-box-transferred-metadata.md)]

## ACLs

Depending on the transfer method used and whether you're using a Windows or Linux client, some or all discretionary and default access control lists (ACLs) on files and folders may be transferred during the data copy to Azure Files.
 
> [!NOTE]
> Files with ACLs containing conditional access control entry (ACE) strings are not copied. This is a known issue. To work around this, copy these files to the Azure Files share manually by mounting the share and then using a copy tool that supports copying ACLs.

## Copying data and metadata

To transfer the ACLs, timestamps, and attributes for your data, use the following procedures to copy data into the Data Box.

### Windows data copy tool

To copy data to your Data Box Disk, use a file copy tool such as `robocopy`. The following sample command copies all files and directories, transferring metadata along with the data.

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
> If you use `/copyall` to copy your data, the source ACLs on directories and files are transferred to Azure Files. If you only had read-access on your source data and could not modify the source data, you'll have read-access only on the data in the Data Box Disk. Use `/copyall` only if you intend to copy all the ACLs on the directories and files along with the data.

#### Use robocopy to list, copy, modify files on Data Box disk

Here are some of the common scenarios you'll use when copying data using `robocopy`.

- **Copy only data to Data Box Disk, no ACLs on directories and files**

    Use the `/dcopy:DAT` option to only copy data, attributes, timestamps. ACLs on directories and files are not copied.

- **Copy data and ACLs on directories and files to Data Box Disk**

    Use `/copyall` to copy all the source data including all the ACLs on directories and files.

- **List the filesystem on Data Box Disk using robocopy**

    Use this command to list directory contents:

    `robocopy <source-dir> NULL /l /s /xx /njh /njs /fp /B`

    Note that the File Explorer doesn't allow you to list these files.
    
- **Copy or delete folders and files on Data Box Disk**

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

- [Copy data to Azure Data Box Disk](data-box-disk-deploy-copy-data.md)
