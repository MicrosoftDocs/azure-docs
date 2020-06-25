---
title: Azure Data Box Gateway General Availability release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the Azure Data Box Gateway running general availability release.
services: databox
author: alkohli
 
ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 03/26/2019
ms.author: alkohli
---

# Azure Data Box Edge/Azure Data Box Gateway General Availability release notes

## Overview

The following release notes identify the critical open issues and the resolved issues for General Availability (GA) release for Azure Data Box Edge and Azure Data Box Gateway. 

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your Data Box Edge/Data Box Gateway, carefully review the information contained in the release notes.

The GA release corresponds to the software versions:

- **Data Box Gateway 1903 (1.5.814.447)**
- **Data Box Edge 1903 (1.5.814.447)**


## What's new

- **New virtual disk images** - New VHDX and VMDK are now available in the Azure portal. Download these images to provision, configure, and deploy new Data Box Gateway GA devices. The Data Box Gateway devices created in the earlier preview releases cannot be updated to this version. For more information, go to [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md).
- **NFS support** - NFS support is currently in preview and available for v3.0 and v4.1 clients that access the Data Box Edge and Data Box Gateway devices.
- **Storage resiliency** - Your Data Box Edge device can withstand the failure of one data disk with the Storage resiliency feature. This feature is currently in preview. You can enable storage resiliency by selecting the **Resilient** option in the **Storage settings** in the local web UI.


## Known issues in GA release

The following table provides a summary of known issues for the Data Box Gateway running release.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
| **1.** |File types | The following file types are not supported: character files, block files, sockets, pipes, symbolic links.  |Copying these files results in 0-length files getting created on the NFS share. These files remain in an error state and are also reported in *error.xml*. <br> Symbolic links to directories result in directories never getting marked offline. As a result, you may not see the gray cross on the directories that indicates that the directories are offline and all the associated content was completely uploaded to Azure. |
| **2.** |Deletion | Due to a bug in this release, if an NFS share is deleted, then the share may not be deleted. The share status will display *Deleting*.  |This occurs only when the share is using an unsupported file name. |
| **3.** |Copy | Data copy fails with Error:  The requested operation could not be completed due to a file system limitation.  |The Alternate Data Stream (ADS) associated with file size greater than 128 KB is not supported.   |


## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md).
- [Prepare to deploy Azure Data Box Edge](azure-stack-edge-deploy-prep.md).
