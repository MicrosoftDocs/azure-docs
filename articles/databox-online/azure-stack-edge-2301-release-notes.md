---
title: Azure Stack Edge Pro FPGA 2301 release notes | Microsoft Docs
description: Describes Azure Stack Edge Pro FPGA 2301 release critical open issues and resolutions.
services: databox
author: alkohli
ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 02/15/2023
ms.author: alkohli
---

# Azure Stack Edge Pro with FPGA 2301 release notes

The following release notes identify critical open issues and the resolved issues for the 2301 release of Azure Stack Edge Pro FPGA with a built-in Field Programmable Gate Array (FPGA).

The release notes are continuously updated. As critical issues that require a workaround are discovered, they are added. Before you deploy your Azure Stack Edge device, carefully review the information in the release notes.  

This release corresponds to software version:

- **Azure Stack Edge 2301 (1.6.2225.773)** - KB 5023528

> [!NOTE]
> Update 2301 can be applied only to devices that are running 2101 versions of the software or later. If you are running a version earlier than 2101, update your device to 2101 and then update to 2301. 

## What's new

This release contains the following bug fixes:

- **Update Azure agent SDK** - Update to SaaS agent SDK enables certificate rotation.
- **MSRC fixes** - Critical security fixes for MSRC issues listed in [CVE-2023-21703](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-21703).

This release also contains the following updates:

- **Update Nuget Package References** - Enhances security.
- **Other updates** - All cumulative updates and .NET framework updates through November 2022.## What's new

This release contains the following bug fixes:

- **Update Azure agent SDK** - Update to SaaS agent SDK enables certificate rotation.
- **MSRC fixes** - Critical security fixes for MSRC issues listed in CVE-2023-21703.

This release also contains the following updates:

- **Update Nuget Package References** - Enhances security.
- **Other updates** - All cumulative updates and .NET framework updates through November 2022.

## Known issues in this release

No new issues are release noted for this release. All the release noted issues have carried over from the previous releases. To see a list of known issues, go to [Known issues in the GA release](../databox-gateway/data-box-gateway-release-notes.md#known-issues-in-ga-release).

## Next steps

- [Prepare to deploy Azure Stack Edge](../databox-online/azure-stack-edge-deploy-prep.md)
