---
title: Azure Data Box Gateway 2105 release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the Azure Data Box Gateway running 2105 release.
services: databox
author: v-dalc
 
ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 01/04/2022
ms.author: alkohli
---

# Azure Data Box Gateway 2105 release notes

The following release notes identify the critical open issues and the resolved issues for the 2105 release of Azure Data Box Gateway.

The release notes are continuously updated. As critical issues that require a workaround are discovered, they are added. Before you deploy your Azure Data Box Gateway, carefully review the information in the release notes.  

This release corresponds to the software versions:

- **Data Box Gateway 2105 (2105b.1.6.1588.3220-42623-42265845)** **<!--REPLACES (1.6.1475.2528)**- How to handle "2015b" in the release number? No precedent in 2012.--> - KB 4603462

> [!NOTE]
> Update 2105 can be applied only to Data Box Gateway devices that are running general availability (GA) versions of the software or later. <!--REPLACES: Update 2101 can be applied only to all devices that are running general availability (GA) versions of the software or later.-->

## What's new

This release contains the following bug fix:

- **Description TBD** - IcM Incident 237917515 -Bug 9809509: Dvfilter/64kB ReFS bugcheck on unghost - MDL buffer read overrun. *BLOCKING ISSUE: No access to incident, bug.*

This release also contains the following updates:

- Windows Cumulative Update 4B, which includes:
  - **[KB4601558](https://support.microsoft.com/en-us/topic/may-11-2021-kb4601558-cumulative-update-for-net-framework-3-5-and-4-7-2-for-windows-10-version-1809-and-windows-server-version-2019-19f6d33a-8685-9c24-418f-5db20cf59b73):** Cumulative update for .NET Framework 3.5 and 4.7.2 for Windows 10 version 1809 and Windows Server version 2019
  - **KB5001439**: Servicing Stack Updates (SSU) *BLOCKING ISSUE: Can't find KB.*
  - **KB5001341**: Latest cumulative update (LCU) *BLOCKING ISSUE: Can't find KB.*

## Known issues in this release

No new issues are release noted for this release. All the release noted issues have carried over from the previous releases. To see a list of known issues, go to [Known issues in the GA release](data-box-gateway-release-notes.md#known-issues-in-ga-release).

## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md)
