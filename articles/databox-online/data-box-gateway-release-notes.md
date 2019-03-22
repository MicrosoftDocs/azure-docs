---
title: Azure Data Box Gateway General Availability release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the Azure Data Box Gateway running general availability release.
services: databox
author: alkohli
 
ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 03/22/2019
ms.author: alkohli
---

# Azure Data Box Edge/Azure Data Box Gateway General Availability release notes

## Overview

The following release notes identify the critical open issues and the resolved issues for Microsoft Azure Data Box Gateway General Availability (GA) release.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your Data Box Edge/Data Box Gateway, carefully review the information contained in the release notes.

The GA release corresponds to the software versions:

- **Data Box Gateway 1903 (1.5.810.441)**
- **Data Box Edge 1903 (1.5.810.441)**

## Issues fixed in GA release

The following table provides a summary of issues fixed in this release.

| No. | Issue |
| --- | --- |
| **1.** | In this release, when a file that was uploaded by another tool (AzCopy) is refreshed and then updated in a way that increases/extends the file size, then the following error is observed: *Error 400: InvalidBlobOrBlock (The specified blob or block content is invalid.)*|
| **2.** |Due to a bug in this release, you may see instances of error code 110 in *error.xml* with unrecognizable item names. |
| **3.** |Due to a bug in this release, you may see instances of error code 2003 during the upload of specific files. |
| **4.** |In this release, you can refresh only one share at a time. |


## Known issues in GA release

The following table provides a summary of known issues for the Data Box Gateway running release.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
| **1.** |Updates |The Data Box Gateway devices created in the earlier preview releases cannot be updated to this version. |Download the virtual disk images from the new release and configure and deploy new devices. For more information, go to [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md). |
| **2.** |Provisioned data disk |Once you have provisioned a data disk of a certain specified size and created the corresponding Data Box Gateway, you must not shrink the data disk. Attempting to shrink the disk results in a loss of all the local data on the device. | |
| **3.** |Rename |Rename of objects is not supported. |Contact Microsoft Support if this feature is crucial for your workflow. |
| **4.** |Copy| If a read-only file is copied to the device, the read-only property is not preserved. | |
| **5.** |File types | The following Linux file types are not supported: character files, block files, sockets, pipes, symbolic links.  |Copying these files results in 0-length files getting created on the NFS share. These files remain in an error state and are also reported in *error.xml*. |
| **6.** |Deletion | Due to a bug in this release, if an NFS share is deleted, then the share may not be deleted. The share status will display *Deleting*.  |This occurs only when the share is using an unsupported file name. |
| **7.** |Refresh | Permissions and access control lists (ACLs) are not preserved across a refresh operation.  | |
| **8.** |Copy | Data copy fails with Error:  The requested operation could not be completed due to a file system limitation.  |This error occurs when the Alternate Data Stream (ADS) associated with the file exceeds 128 KB (maximum limit for ReFS).  |
| **9.** |Symbolic links |Symbolic links are not supported.  |Symbolic links to directories result in directories never getting marked offline. As a result, you may not see the gray cross on the directories that indicates that the directories are offline and all the associated content was completely uploaded to Azure. |
| **10.** |Shares |Refreshing an existing container with Page Blobs, to a Block Blob share (or vice-versa) leads to upload failures on file modification.  |This behavior is seen when you follow these steps: <li> Create a Block Blob share on the device. </li><li> Associate the share with an existing cloud container that has Page Blobs.</li><li>Refresh that share. </li><li>Modify some of the refreshed files that are already stored as Page Blobs in the cloud.</li> Upload failures are seen. |
| **11.** |NFS |NFS support is currently in preview. |For more information, see [Supported NFS versions](data-box-edge-system-requirements.md#supported-protocols-for-clients-accessing-device). |
| **12.** |Storage resiliency|The **Resilient** option in **Storage settings** page in the local web UI is currently in preview.||


## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md).
- [Prepare to deploy Azure Data Box Edge](data-box-edge-deploy-prep.md).

