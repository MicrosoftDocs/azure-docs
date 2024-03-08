---
title: Azure Stack Edge & Azure Data Box Gateway 2007 release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the Azure Stack Edge and Data Box Gateway running 2007 release.
services: databox
author: stevenmatthew
 
ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 11/11/2020
ms.author: shaas
---

# Azure Stack Edge and Azure Data Box Gateway 2007 release notes

The following release notes identify the critical open issues and the resolved issues for the 2007 release for Azure Stack Edge and Data Box Gateway.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your Azure Stack Edge/Data Box Gateway, carefully review the information contained in the release notes.

This release corresponds to the software versions:

- **Azure Stack Edge 2007 (1.6.1280.1667)** - KB 4566549
- **Data Box Gateway 2007 (1.6.1280.1667)** - KB 4566550

> [!NOTE]
> Update 2007 can be applied only to all devices that are running general availability (GA) versions of the software or later.

## What's new

This release contains the following bug fix:

- **Upload issue** - This release fixes an upload problem where upload restarts due to failures can slow the rate of upload completion. This problem can occur when uploading a dataset that primarily consists of files that are large in size relative to available bandwidth, particularly, but not limited to, when bandwidth throttling is active. This change ensures that sufficient opportunity is given for upload completion before restarting upload for a given file.

This release also contains the following updates:

- The base image for the Windows VHD has been updated.
- All cumulative Windows updates and .NET framework updates are included that were released through May 2020.
- This release supports IoT Edge 1.0.9.3 on Azure Stack Edge devices.

## Known issues in this release

No new issues are release noted for this release. All the release noted issues have carried over from the previous releases. To see a list of known issues, go to [Known issues in the GA release](data-box-gateway-release-notes.md#known-issues-in-ga-release).

## Next steps

- [Prepare to deploy Azure Stack Edge](../databox-online/azure-stack-edge-deploy-prep.md)
- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md)
