---
title: Azure Data Box Gateway 2105 release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the Azure Data Box Gateway running 2105 release.
services: databox
author: stevenmatthew
 
ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 01/07/2022
ms.author: shaas
---

# Azure Data Box Gateway 2105 release notes

The following release notes identify the critical open issues and the resolved issues for the 2105 release of Azure Data Box Gateway.

The release notes are continuously updated. As critical issues that require a workaround are discovered, they are added. Before you deploy your Azure Data Box Gateway, carefully review the information in the release notes.  

This release corresponds to the software version:

- **Data Box Gateway 2105 (1.6.1588.3220-42623-42265845)** - 4618211

Update 2105 can be applied to all prior releases of Data Box Gateway.

## What's new

This release contains the following bug fix:

- **Buffer overrun results in abrupt reboot of gateway** - This release fixes a bug that can cause a buffer overrun resulting in access of invalid memory, leading to an abrupt, unexpected reboot of the gateway device. The error can occur when a client accesses the last several bytes of a file whose data needs to be read back by the appliance from Azure, and the file size isn't a multiple of 4096 bytes.

This release also contains the following updates:

- All cumulative updates and .NET framework updates through April 2021.

## Known issues in this release

No new issues are release noted for this release. All the release noted issues have carried over from the previous releases. To see a list of known issues, go to [Known issues in the GA release](data-box-gateway-release-notes.md#known-issues-in-ga-release).

## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md)
