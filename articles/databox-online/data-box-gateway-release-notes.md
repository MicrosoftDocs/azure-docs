---
title: Azure Data Box Gateway Preivew release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the Azure Data Box Gateway running Preview release.
services: databox
author: alkohli
 
ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 09/24/2018
ms.author: alkohli
---

# Azure Data Box Gateway Preview release notes

## Overview

The following release notes identify the critical open issues and the resolved issues for Microsoft Azure Data Box Gateway Preview release.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your Data Box Gateway, carefully review the information contained in the release notes.

Preview release corresponds to the software version **Data Box Gateway Preview Version 2.0**.

## Issues fixed in Preview release

The following table provides a summary of issues fixed in this release.

| No. | Issue |
| --- | --- |
| 1 | In this release, when a file that was uploaded by another tool (AzCopy) is refreshed and then updated in a way that increases/extends the file size, then the following error is observed: *Error 400: InvalidBlobOrBlock (The specified blob or block content is invalid.)*|


## Known issues in Preview release

The following table provides a summary of known issues for the Data Box Gateway running preview release.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
| **1.** |Updates |The Data Box Gateway devices created in the earlier preview releases cannot be updated to this version. |Download the virtual disk images from the new release and configure and deploy new devices. For more information, go to [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md). |
| **2.** |Provisioned data disk |Once you have provisioned a data disk of a certain specified size and created the corresponding Data Box Gateway, you must not shrink the data disk. Attempting to shrink the disk results in a loss of all the local data on the device. | |
| **3.** |Refresh |In this release, you can refresh only one share at a time. | |
| **4.** |Rename |Rename of objects is not supported. |Contact Microsoft Support if this feature is crucial for your workflow. |
| **5.** |Copy| If a read-only file is copied to the device, the read-only property is not preserved. | |
| **6.** |Logs| Due to a bug in this release, you may see instances of error code 110 in *error.xml* with unrecognizable item names. | |
| **7.** |Upload | Due to a bug in this release, you may see instances of error code 2003 during the upload of specific files. | |
| **8.** |File types | The following Linux file types are not supported: character files, block files, sockets, pipes, symbolic links.  |Copying these files results in 0-length files getting created on the NFS share. These files remain in an error state and are also reported in *error.xml*. |
| **9.** |Deletion | Due to a bug in this release, if an NFS share is deleted, then the share may not be deleted. The share status will display *Deleting*.  |This occurs only when the share is using an unsupported file name. |
| **10.** |Refresh | Permissions and access control lists (ACLs) are not preserved across a refresh operation.  | |
| **11.** |Online help |The Help links in the Azure portal may not link to  documentation.|The Help links will work in the General Availability release. |



## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md).


