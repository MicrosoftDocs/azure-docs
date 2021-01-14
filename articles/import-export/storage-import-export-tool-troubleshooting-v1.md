---
title: Troubleshooting the Azure Import/Export Tool | Microsoft Docs
description: Learn about some of the common issues seen when using the Azure Import/Export Tool, and how to handle them.
author: alkohli
services: storage
ms.service: storage
ms.topic: article
ms.date: 01/14/2021
ms.author: alkohli
ms.subservice: common
---

# Troubleshooting the Azure Import/Export Tool
The Microsoft Azure Import/Export Tool returns error messages if it runs into issues. This topic lists some common issues that users may run into.  

## A copy session failed. What I should do?  
 When a copy session fails, there are two options:  
 - If the error can be retried - for example, if the network share was offline for a short period and now is back online - you can resume the copy session.
 - If the error can't be retried - for example, if you specified the wrong source file directory in the command-line parameters - you need to abort the copy session.
 
For information about resuming and aborting copy sessions, see [Preparing Hard Drives for an Import Job](../storage-import-export-tool-preparing-hard-drives-import-v1.md).<!--This is the article we removed from the DBG TOC.-->

## I can't resume or abort a copy session.  
 If the copy session is the first copy session for a drive, then the error message should state: "The first copy session cannot be resumed or aborted." In this case, you can delete the old journal file and rerun the command.  

 If a copy session is not the first one for a drive, the session can always be resumed or aborted.  

## I lost the journal file. Can I still create the job?
 The journal file for a drive contains the complete information of copying data to that drive. When you add files to the drive, the journal file is used to create an import job. If you lose the journal file, you'll have to redo all the copy sessions for the drive.

## Next steps

* [Setting up the Azure Import/Export Tool](storage-import-export-tool-setup-v1.md)
* [Prepare hard drives for an import job](storage-import-export-tool-preparing-hard-drives-import-v1.md)
* [Review job status with copy log files](storage-import-export-tool-reviewing-job-status-v1.md)
* [Repair an import job](storage-import-export-tool-repairing-an-import-job-v1.md)
* [Repair an export job](storage-import-export-tool-repairing-an-export-job-v1.md)