---
title: Azure Data Box Gateway & Azure Data Box Edge 1906 release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the Azure Data Box Gateway and Azure Data Box Edge running 1906 release.
services: databox
author: stevenmatthew
 
ms.service: azure-data-box-gateway
ms.topic: release-notes
ms.date: 11/11/2020
ms.author: shaas
---

# Azure Data Box Edge and Azure Data Box Gateway 1906 release notes

The following release notes identify the critical open issues and the resolved issues for the 1906 release for Azure Data Box Edge and Azure Data Box Gateway.

The release notes are continuously updated, and critical issues requiring a workaround are added as they're discovered. Before you deploy your Data Box Edge/Data Box Gateway, carefully review the information contained in the release notes.

This release corresponds to the software versions:

- **Data Box Gateway 1906 (1.6.978.743)**
- **Data Box Edge 1906 (1.6.978.743)**

> [!NOTE]
> Update 1906 can be applied only to Data Box Edge devices that are running general availability (GA) or 1905 version of the software.

## What's new

- **Bug fix in the recovery key management workflow** - In the earlier release, there was a bug owing to which the recovery key wasn't getting applied. This bug is fixed in this release. We strongly recommend that you apply this update as the recovery key allows you to recover the data on the device if the device doesn't boot. For more information, see how to [save the recovery key when deploying Data Box Edge or Data Box Gateway](../databox-online/azure-stack-edge-deploy-connect-setup-activate.md#set-up-and-activate-the-physical-device).
- **Field Programmable Gate Array (FPGA) logging improvements** - Starting in the 1905 release, both logging and alert enhancements related to Field Programmable Gate Arrays (FPGA) were made. This update continues to be required for Data Box Edge if you're using the Edge compute feature with the FPGA. For more information, see how to [transform data with Edge compute on your Data Box Edge](../databox-online/azure-stack-edge-deploy-configure-compute-advanced.md).

## Known issues in GA release

No new issues are release noted for this release. All the release noted issues carry over from the previous releases. To see a list of known issues, go to [Known issues in the GA release](data-box-gateway-release-notes.md#known-issues-in-ga-release).

## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md)
- [Prepare to deploy Azure Data Box Edge](../databox-online/azure-stack-edge-deploy-prep.md)
