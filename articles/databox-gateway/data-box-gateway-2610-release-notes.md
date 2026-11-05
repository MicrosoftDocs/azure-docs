---
title: Azure Data Box Gateway 2610 Release Notes and Updates
description: Azure Data Box Gateway 2610 release notes cover security fixes, software version details, upgrade requirements, and known issues. Review before deploying.
services: databox
author: bchakra
ms.service: azure-data-box-gateway
ms.topic: concept-article
ms.date: 11/05/2026
ms.author: bchakra
# Customer intent: "As a system administrator, I want to review the Azure Data Box Gateway 2610 release notes so that I can understand security fixes, upgrade requirements, and known issues before deploying the update."
---

# Azure Data Box Gateway 2610 release notes

The following release notes identify the critical updates, open issues, and resolved issues for the 2610 release of Azure Data Box Gateway.

The release notes are continuously updated. Critical issues that require a workaround are added when discovered. Carefully review the information in the release notes before deploying Azure Data Box Gateway.

This release corresponds to the software version:

- **Data Box Gateway 2610 (1.7.3565.194)**

> [!NOTE]
> You can apply update 2610 only to devices that are running 2301 versions of the software or later. If you're running a version earlier than 2105, update your device to 2301 and then update to 2610.

## What's new

This release contains the following bug fixes:

- **MSRC fixes** - Critical security fixes for MSRC issues. A security vulnerability in Azure Data Box Gateway lets an authenticated attacker exploit a flaw in the software update upload process, allowing remote code execution.

- **Security updates** - This release also contains the June 2026 cumulative security updates: KB5094123 for the Data Box Gateway host and KB5094128 for Windows Server 2022, along with the required servicing-stack updates to the VHD images.

## Known issues in this release

No new issues are release noted for this release. All the release noted issues are carried over from the previous releases. For a list of known issues, see [Known issues in the GA release](data-box-gateway-release-notes.md#known-issues-in-ga-release).

## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md)
