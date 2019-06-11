---
title: Azure Data Box Gateway 1905 release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the Azure Data Box Gateway running general availability release.
services: databox
author: alkohli
 
ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 06/11/2019
ms.author: alkohli
---

# Azure Data Box Edge/Azure Data Box Gateway 1905 release notes

## Overview

The following release notes identify the critical open issues and the resolved issues for the 1905 release for Azure Data Box Edge and Azure Data Box Gateway.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your Data Box Edge/Data Box Gateway, carefully review the information contained in the release notes.

This release corresponds to the software versions:

- **Data Box Gateway 1905 (1.6.887.626)**
- **Data Box Edge 1905 (1.6.887.626)**


## What's new

- **New virtual disk images** - New VHDX and VMDK are now available in the Azure portal. Download these images to provision, configure, and deploy new Data Box Gateway GA devices. The Data Box Gateway devices created in the earlier preview releases cannot be updated to this version. For more information, go to [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md).
- **NFS support** - NFS support is currently in preview and available for v3.0 and v4.1 clients that access the Data Box Edge and Data Box Gateway devices.
- **Storage resiliency** - Your Data Box Edge device can withstand the failure of one data disk with the Storage resiliency feature. This feature is currently in preview. You can enable storage resiliency by selecting the **Resilient** option in the **Storage settings** in the local web UI.


## Known issues in GA release

No new issues are release noted for this release. All the release noted issues have carried over from the previous releases. To see a list, go to [Known issues in the GA release](data-box-gateway-release-notes.md#known-issues-in-ga-release).



## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md).
- [Prepare to deploy Azure Data Box Edge](data-box-edge-deploy-prep.md).
