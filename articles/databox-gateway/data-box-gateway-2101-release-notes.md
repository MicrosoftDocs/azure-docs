---
title: Azure Data Box Gateway 2101 release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the Azure Data Box Gateway running 2101 release.
services: databox
author: stevenmatthew
 
ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 01/29/2021
ms.author: shaas
---

# Azure Data Box Gateway 2101 release notes

The following release notes identify the critical open issues and the resolved issues for the 2101 release of Azure Data Box Gateway.

The release notes are continuously updated. As critical issues that require a workaround are discovered, they are added. Before you deploy your Azure Data Box Gateway, carefully review the information in the release notes.  

This release corresponds to the software versions:

- **Data Box Gateway 2101 (1.6.1475.2528)** - KB 4603462

> [!NOTE]
> Update 2101 can be applied only to all devices that are running general availability (GA) versions of the software or later.

## What's new

This release contains the following bug fix:

- **Upload issue** - This release fixes an upload problem where upload restarts because of failures can slow the rate of upload completion. This problem can occur when uploading a dataset that primarily consists of files that are large in size relative to available bandwidth, particularly, but not limited to, when bandwidth throttling is active. This change ensures sufficient opportunity for upload completion before restarting upload for a given file.

This release also contains the following updates:

- All cumulative Windows updates and .NET framework updates released through October 2020.
- The static IP address for Azure Data Box Gateway is retained across software updates.

## Known issues in this release

No new issues are release noted for this release. All the release noted issues have carried over from the previous releases. To see a list of known issues, go to [Known issues in the GA release](data-box-gateway-release-notes.md#known-issues-in-ga-release).

## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md)
