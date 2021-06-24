---
title: Troubleshooting import and export issues in Azure Import/Export | Microsoft Docs
description: Learn how to handle common issues when using Azure Import/Export.
author: v-dalc
services: storage
ms.service: storage
ms.topic: troubleshooting
ms.date: 01/19/2021
ms.author: alkohli
ms.subservice: common
---

# Troubleshoot issues in Azure Import/Export
This article describes how to troubleshoot common issues when importing and exporting data in Azure Import/Export.

## A copy session failed. What I should do?  

When a copy session fails, you have two options:  
* If the error can be retried - for example, if the network share was offline for a short period and now is back online - you can resume the copy session.
* If the error can't be retried - for example, if you specified the wrong source file directory in the command-line parameters - you need to abort the copy session.
 
<!--For information about resuming and aborting copy sessions, see [Preparing Hard Drives for an Import Job](../storage-import-export-tool-preparing-hard-drives-import-v1.md  - Article we removed from TOC. File remains.-->

## I can't resume or abort a copy session.

If the copy session is the first copy session for a drive, then the error message should state: "The first copy session cannot be resumed or aborted." In this case, you can delete the old journal file and rerun the command.  

If a copy session is not the first one for a drive, the session can always be resumed or aborted.  

## I lost the journal file. Can I still create the job?

The journal file for a drive contains complete session information from the data copy. When you add files to the drive, the journal file is used to create an import job. If you lose the journal file, you'll have to redo all the copy sessions for the drive.

## Next steps

* [Set up the Azure Import/Export Tool](storage-import-export-tool-setup-v1.md)
* [Prepare hard drives for an import job](storage-import-export-data-to-blobs.md#step-1-prepare-the-drives)
* [Review job status with copy log files](storage-import-export-tool-reviewing-job-status-v1.md)
* [Repair an import job](storage-import-export-tool-repairing-an-import-job-v1.md)
* [Repair an export job](storage-import-export-tool-repairing-an-export-job-v1.md)