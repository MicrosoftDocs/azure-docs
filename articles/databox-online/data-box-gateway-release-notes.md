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


## What's new

1. Updates
2. NFS
3. Storage resiliency
4. 


## Known issues in GA release

The following table provides a summary of known issues for the Data Box Gateway running release.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
| **1.** |Updates |The Data Box Gateway devices created in the earlier preview releases cannot be updated to this version. |Download the virtual disk images from the new release and configure and deploy new devices. For more information, go to [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md). |
| **2.** |File types | The following file types are not supported: character files, block files, sockets, pipes, symbolic links.  |Copying these files results in 0-length files getting created on the NFS share. These files remain in an error state and are also reported in *error.xml*. <br> Symbolic links to directories result in directories never getting marked offline. As a result, you may not see the gray cross on the directories that indicates that the directories are offline and all the associated content was completely uploaded to Azure. |
| **3.** |Deletion | Due to a bug in this release, if an NFS share is deleted, then the share may not be deleted. The share status will display *Deleting*.  |This occurs only when the share is using an unsupported file name. |
| **4.** |Copy | Data copy fails with Error:  The requested operation could not be completed due to a file system limitation.  |The Alternate Data Stream (ADS) associated with the file size greater than 128 KB is not supported.   |



| **2.** |Provisioned data disk |Once you have provisioned a data disk of a certain specified size and created the corresponding Data Box Gateway, you must not shrink the data disk. Attempting to shrink the disk results in a loss of all the local data on the device. | |
| **7.** |Refresh | Permissions and access control lists (ACLs) are not preserved across a refresh operation.  | |


## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md).
- [Prepare to deploy Azure Data Box Edge](data-box-edge-deploy-prep.md).

