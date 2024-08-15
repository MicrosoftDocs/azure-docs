---
title: Azure Data Box Gateway 2408 release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the Azure Data Box Gateway running 2408 release.
services: databox
author: stevenmatthew
 
ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 08/15/2024
ms.author: shaas
---

# Azure Data Box Gateway 2408 release notes

The following release notes identify the critical open issues and the resolved issues for the 2408 release of Azure Data Box Gateway.

The release notes are continuously updated. Critical issues that require a workaround are added when they're discovered. Carefully review the information in the release notes before deploying Azure Data Box Gateway.

This release corresponds to the software version:

- **Data Box Gateway 2408 (2.0.2780.3333)** - KB 5043357

> [!NOTE]
> Update 2408 can be applied only to devices that are running 2301 versions of the software or later. If you are running a version earlier than 2105, update your device to 2301 and then update to 2408.

## What's new

This release contains the following bug fixes:

- **Web UI certificate format** - Implemented bug fixes pertaining to the web UI certificate format, potentially causing compatibility issues when using web UI.

This release contains the following updates:

- **Migration to a newer OS version** - Provides better long term security and vulnerability management.
- **Defense in depth:**
    - Malware protection on OS disk
    - Defender-based Device Guard support for more stringent checks on the binary running within the system.
- **Utilizing a newer .NET framework** - Provides better security.
- **Improved Hypervisor support** - Support added for Hyper-V 2022.

## Known issues in this release

Because this release is a major upgrade, rollback or downgrade isn't allowed. Any upgrade failure might cause downtime and the need for data recovery. The following precautions should be taken before initiating an upgrade:

- Plan for an appropriate downtime window.
- Ensure that your data is stored in Azure before disconnecting any clients writing to Data Box Gateway. You can validate that data transfer is complete by ensuring that all top-level directories in the Data Box Gateway's share haver the 'offline' attribute enabled.

All the release noted issues are carried forward from the previous releases. For a list of known issues, see [Known issues in the GA release](data-box-gateway-release-notes.md#known-issues-in-ga-release).

## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md)
