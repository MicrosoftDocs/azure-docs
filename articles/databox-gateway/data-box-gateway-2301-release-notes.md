---
title: Azure Data Box Gateway 2301 release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the Azure Data Box Gateway running 2301 release.
services: databox
author: stevenmatthew
 
ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 02/15/2023
ms.author: shaas
---

# Azure Data Box Gateway 2301 release notes

The following release notes identify the critical open issues and the resolved issues for the 2301 release of Azure Data Box Gateway.

The release notes are continuously updated. As critical issues that require a workaround are discovered, they are added. Before you deploy your Azure Data Box Gateway, carefully review the information in the release notes.  

This release corresponds to the software version:

- **Data Box Gateway 2301 (1.6.2225.773)** - KB 5023529

> [!NOTE]
> Update 2301 can be applied only to devices that are running 2105 versions of the software or later. If you are running a version earlier than 2105, update your device to 2105 and then update to 2301.

## What's new

This release contains the following bug fixes:

- **Update Azure agent SDK** - Update to SaaS agent SDK enables certificate rotation.
- **MSRC fixes** - Critical security fixes for MSRC issues listed in [CVE-2023-21703](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-21703).

This release also contains the following updates:

- **Update Nuget Package References** - Enhances security.
- **Other updates** - All cumulative updates and .NET framework updates through November 2022.

## Known issues in this release

No new issues are release noted for this release. All the release noted issues have carried over from the previous releases. For a list of known issues, see [Known issues in the GA release](data-box-gateway-release-notes.md#known-issues-in-ga-release).

## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md)
