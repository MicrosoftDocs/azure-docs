---
title: Azure Data Box Gateway 2301 release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the Azure Data Box Gateway running 2301 release.
services: databox
author: stevenmatthew
 
ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 08/05/2024
ms.author: shaas
---

# Azure Data Box Gateway 2408 release notes

The following release notes identify the critical open issues and the resolved issues for the 2408 release of Azure Data Box Gateway.

The release notes are continuously updated. As critical issues that require a workaround are discovered, they are added. Before you deploy your Azure Data Box Gateway, carefully review the information in the release notes.  

This release corresponds to the software version:

- **Data Box Gateway 2408 (X.X.XXXX.XXX)** - KB XXXXXXX

> [!NOTE]
> Update 2408 can be applied only to devices that are running 2301 versions of the software or later. If you are running a version earlier than 2301, update your device to 2105 and then update to 2301.

Select the appropriate link to download the latest version.

- [VHDX v. X.X.XXXX.XXX](data-box-gateway-2408-release-notes.md)
- [VMDK v. X.X.XXXX.XXX](data-box-gateway-2408-release-notes.md)

## What's new

This release contains the following bug fixes:

## Bug Fixes

- **Bug Fix 1** - Description of Bug Fix 1.
- **Bug Fix 2** - Description of Bug Fix 2.

## Updates

This release contains the following updates:

1. Migration to a newer OS version, providing better long term security and vulnerability management.
1. Defense in depth:
    - Malware protection on OS disk
    - Device Guard Siging Service support for more stringent checks on the binary signing.
    - Utilizing a newer .NET framework for better security.
1. Implemented bug fixes pertaining to the web UI certificate format, potentially causing compatibility issues when using web-UI.
1. Hypervisor support for Hyper-V 2022.

## Known issues in this release

Because this release is a major upgrade, rollback or downgrade isn't allowed. Any upgrade failure might cause downtime and the need for data recovery. The following precautions should be taken before initiating an upgrade upgrade:

- Plan for an appropriate downtime window.
- Ensure that your data is stored in Azure before disconnecting any clients writing to Data Box Gateway.

All the release noted issues are carried forward from the previous releases. For a list of known issues, see [Known issues in the GA release](data-box-gateway-release-notes.md#known-issues-in-ga-release).

## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md)
