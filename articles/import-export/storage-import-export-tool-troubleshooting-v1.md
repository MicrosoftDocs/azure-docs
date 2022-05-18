---
title: Troubleshooting import and export issues in Azure Import/Export | Microsoft Docs
description: Learn how to handle common issues when using Azure Import/Export.
author: v-dalc
services: storage
ms.service: azure-import-export
ms.topic: troubleshooting
ms.date: 03/14/2022
ms.author: alkohli
---

# Troubleshoot issues in Azure Import/Export
This article describes how to troubleshoot common issues when importing and exporting data in Azure Import/Export.

## A copy session failed. What I should do?  

When a copy session fails, you have two options:  
* If the error can be retried - for example, if the network share was offline for a short period and now is back online - you can resume the copy session.
* If the error can't be retried - for example, if you specified the wrong source file directory in the command-line parameters - you need to abort the copy session.

## I got an UnsupportedDrive error. What should I do?

You'll need to create a new order and use a disk with a supported drive format. An UnsupportedDrive error happens when you use a hard disk drive (HDD) with 4096-byte (4K) sectors. Only 512-byte sectors are supported for HDDs. Create a new order and use a supported HDD with 512-byte sectors. For more information, see [Supported disks](storage-import-export-requirements.md#supported-disks).

## I can't resume or abort a copy session.

If the copy session is the first copy session for a drive, then the error message should state: "The first copy session cannot be resumed or aborted." In this case, you can delete the old journal file and rerun the command.  

If a copy session isn't the first one for a drive, the session can always be resumed or aborted.  

## I lost the journal file. Can I still create the job?

The journal file for a drive contains complete session information from the data copy. When you add files to the drive, the journal file is used to create an import job. If you lose the journal file, you'll have to redo all the copy sessions for the drive.

## Next steps

* [Prepare hard drives for an import job](storage-import-export-data-to-blobs.md#step-1-prepare-the-drives)
* [Review job status with copy log files](storage-import-export-tool-reviewing-job-status-v1.md)
