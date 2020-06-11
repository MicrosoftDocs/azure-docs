---
title: Setting up the Azure Import/Export Tool | Microsoft Docs
description: Learn how to set up the drive preparation and repair tool for the Azure Import/Export service.
author: twooley
services: storage
ms.service: storage
ms.topic: article
ms.date: 06/29/2017
ms.author: twooley
ms.subservice: common
---

# Setting up the Azure Import/Export Tool

The Microsoft Azure Import/Export Tool is the drive preparation and repair tool that you can use with the Microsoft Azure Import/Export service. You can use the tool for the following functions:

* Before creating an import job, you can use this tool to copy data to the hard drives you are going to ship to an Azure data center.
* After an import job has completed, you can use this tool to repair any blobs that were corrupted, were missing, or conflicted with other blobs.
* After you receive the drives from a completed export job, you can use this tool to repair any files that were corrupted or missing on the drives.

## Prerequisites

If you are **preparing drives** for an import job, the following prerequisites must be met:

* You must have an active Azure subscription.
* Your subscription must include a storage account with enough available space to store the files you are going to import.
* You need at least one of the storage account access keys.
* You need a computer (the "copy machine") with Windows 7, Windows Server 2008 R2, or a newer Windows operating system installed.
* The .NET Framework 4 must be installed on the copy machine.
* BitLocker must be enabled on the copy machine.
* You need one or more empty 2.5-inch or 3.5-inch SATAII or III or SSD hard drives connected to the copy machine.
* The files you plan to import must be accessible from the copy machine, whether they are on a network share or a local hard drive.

If you are attempting to **repair an import** that has partially failed, you need:

* The copy log files
* The storage account key

If you are attempting to **repair an export**  that has partially failed, you need:

* The copy log files
* The manifest files (optional)
* The storage account key

## Installing the Azure Import/Export Tool

First, [download the Azure Import/Export Tool](https://www.microsoft.com/download/details.aspx?id=55280) and extract it to a directory on your computer, for example `c:\WAImportExport`.

The Azure Import/Export Tool consists of the following files:

* dataset.csv
* driveset.csv
* hddid.dll
* Microsoft.Data.Services.Client.dll
* Microsoft.WindowsAzure.Storage.dll
* Microsoft.WindowsAzure.Storage.pdb
* Microsoft.WindowsAzure.Storage.xml
* WAImportExport.exe
* WAImportExport.exe.config
* WAImportExport.pdb
* WAImportExportCore.dll
* WAImportExportCore.pdb
* WAImportExportRepair.dll
* WAImportExportRepair.pdb

Next, open a Command Prompt window in **Administrator mode**, and change into the directory containing the extracted files.

To output help for the command, run the tool (`WAImportExport.exe`) without parameters:

```
WAImportExport, a client tool for Windows Azure Import/Export Service. Microsoft (c) 2013


Copy directories and/or files with a new copy session:
    WAImportExport.exe PrepImport /j:<JournalFile> /id:<SessionId> [/logdir:<LogDirectory>]
        [/sk:<StorageAccountKey>] [/silentmode] [/InitialDriveSet:<driveset.csv>]
        DataSet:<dataset.csv>

Add more drives:
    WAImportExport.exe PrepImport /j:<JournalFile> /id:<SessionId> /AdditionalDriveSet:<driveset.csv>

Abort an interrupted copy session:
    WAImportExport.exe PrepImport /j:<JournalFile> /id:<SessionId> /AbortSession

Resume an interrupted copy session:
    WAImportExport.exe PrepImport /j:<JournalFile> /id:<SessionId> /ResumeSession

List drives:
    WAImportExport.exe PrepImport /j:<JournalFile> /ListDrives

List copy sessions:
    WAImportExport.exe PrepImport /j:<JournalFile> /ListCopySessions

Repair a Drive:
    WAImportExport.exe RepairImport | RepairExport
        /r:<RepairFile> [/logdir:<LogDirectory>]
        [/d:<TargetDirectories>] [/bk:<BitLockerKey>]
        /sn:<StorageAccountName> /sk:<StorageAccountKey>
        [/CopyLogFile:<DriveCopyLogFile>] [/ManifestFile:<DriveManifestFile>]
        [/PathMapFile:<DrivePathMapFile>]

Preview an Export Job:
    WAImportExport.exe PreviewExport
        [/logdir:<LogDirectory>]
        /sn:<StorageAccountName> /sk:<StorageAccountKey>
        /ExportBlobListFile:<ExportBlobListFile> /DriveSize:<DriveSize>

Parameters:

    /j:<JournalFile>
        - Required. Path to the journal file. A journal file tracks a set of drives and
          records the progress in preparing these drives. The journal file must always
          be specified.
    /logdir:<LogDirectory>
        - Optional. The log directory. Verbose log files as well as some temporary
          files will be written to this directory. If not specified, current directory
          will be used as the log directory. The log directory can be specified only
          once for the same journal file.
    /id:<SessionId>
        - Optional. The session Id is used to identify a copy session. It is used to
          ensure accurate recovery of an interrupted copy session.
    /ResumeSession
        - Optional. If the last copy session was terminated abnormally, this parameter
          can be specified to resume the session.
    /AbortSession
        - Optional. If the last copy session was terminated abnormally, this parameter
          can be specified to abort the session.
    /sn:<StorageAccountName>
        - Required. Only applicable for RepairImport and RepairExport. The name of
          the storage account.
    /sk:<StorageAccountKey>
        - Required. The key of the storage account.
    /InitialDriveSet:<driveset.csv>
        - Required. A .csv file that contains a list of drives to prepare.
    /AdditionalDriveSet:<driveset.csv>
        - Required. A .csv file that contains a list of additional drives to be added.
    /r:<RepairFile>
        - Required. Only applicable for RepairImport and RepairExport.
          Path to the file for tracking repair progress. Each drive must have one
          and only one repair file.
    /d:<TargetDirectories>
        - Required. Only applicable for RepairImport and RepairExport.
          For RepairImport, one or more semicolon-separated directories to repair;
          For RepairExport, one directory to repair, e.g. root directory of the drive.
    /CopyLogFile:<DriveCopyLogFile>
        - Required. Only applicable for RepairImport and RepairExport. Path to the
          drive copy log file (verbose or error).
    /ManifestFile:<DriveManifestFile>
        - Required. Only applicable for RepairExport. Path to the drive manifest file.
    /PathMapFile:<DrivePathMapFile>
        - Optional. Only applicable for RepairImport. Path to the file containing
          mappings of file paths relative to the drive root to locations of actual files
          (tab-delimited). When first specified, it will be populated with file paths
          with empty targets, which means either they are not found in TargetDirectories,
          access denied, with invalid name, or they exist in multiple directories. The
          path map file can be manually edited to include the correct target paths and
          specified again for the tool to resolve the file paths correctly.
    /ExportBlobListFile:<ExportBlobListFile>
        - Required. Path to the XML file containing list of blob paths or blob path
          prefixes for the blobs to be exported. The file format is the same as the
          blob list blob format in the Put Job operation of the Import/Export Service
          REST API.
    /DriveSize:<DriveSize>
        - Required. Size of drives to be used for export. For example, 500GB, 1.5TB.
          Note: 1 GB = 1,000,000,000 bytes
                1 TB = 1,000,000,000,000 bytes
    /DataSet:<dataset.csv>
        - Required. A .csv file that contains a list of directories and/or a list files
          to be copied to target drives.

    /silentmode
        - Optional. If not specified, it will remind you the requirement of drives and
          need your confirmation to continue.

Examples:

    Copy a data set to a drive:
    WAImportExport.exe PrepImport
        /j:9WM35C2V.jrn /id:session#1 /sk:VkGbrUqBWLYJ6zg1m29VOTrxpBgdNOlp+kp0C9MEdx3GEL
        xmBw4hK94f7KysbbeKLDksg7VoN1W/a5UuM2zNgQ== /InitialDriveSet:driveset1.csv
        /DataSet:data.csv

    Copy another dataset to the same drive following the above command:
    WAImportExport.exe PrepImport /j:9WM35C2V.jrn /id:session#2 /DataSet:dataset2.csv

    Preview how many 1.5 TB drives are needed for an export job:
    WAImportExport.exe PreviewExport
        /sn:mytestaccount /sk:VkGbrUqBWLYJ6zg1m29VOTrxpBgdNOlp+kp0C9MEdx3GELxmBw4hK94f7K
        ysbbeKLDksg7VoN1W/a5UuM2zNgQ== /ExportBlobListFile:C:\temp\myexportbloblist.xml
        /DriveSize:1.5TB

    Repair an finished import job:
    WAImportExport.exe RepairImport
        /r:9WM35C2V.rep /d:X:\ /bk:442926-020713-108086-436744-137335-435358-242242-2795
        98 /sn:mytestaccount /sk:VkGbrUqBWLYJ6zg1m29VOTrxpBgdNOlp+kp0C9MEdx3GELxmBw4hK94
        f7KysbbeKLDksg7VoN1W/a5UuM2zNgQ== /CopyLogFile:C:\temp\9WM35C2V_error.log
```

## Next steps

* [Preparing hard drives for an import job](../storage-import-export-tool-preparing-hard-drives-import.md)
* [Previewing drive usage for an export job](../storage-import-export-tool-previewing-drive-usage-export-v1.md)
* [Reviewing job status with copy log files](../storage-import-export-tool-reviewing-job-status-v1.md)
* [Repairing an import job](../storage-import-export-tool-repairing-an-import-job-v1.md)
* [Repairing an export job](../storage-import-export-tool-repairing-an-export-job-v1.md)
* [Troubleshooting the Azure Import/Export Tool](storage-import-export-tool-troubleshooting-v1.md)
