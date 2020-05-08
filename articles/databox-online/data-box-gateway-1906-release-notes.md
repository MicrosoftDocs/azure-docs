---
title: Azure Data Box Gateway & Azure Data Box Edge 1906 release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the Azure Data Box Gateway and Azure Data Box Edge running 1906 release.
services: databox
author: alkohli
 
ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 09/18/2019
ms.author: alkohli
---

# Azure Data Box Edge and Azure Data Box Gateway 1906 release notes

The following release notes identify the critical open issues and the resolved issues for the 1906 release for Azure Data Box Edge and Azure Data Box Gateway. 

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your Data Box Edge/Data Box Gateway, carefully review the information contained in the release notes.

This release corresponds to the software versions:

- **Data Box Gateway 1906 (1.6.978.743)**
- **Data Box Edge 1906 (1.6.978.743)**

> [!NOTE]
> Update 1906 can be applied only to Data Box Edge devices that are running general availability (GA) or 1905 version of the software.

## What's new

- **Bug fix in the recovery key management workflow** -  In the earlier release, there was a bug owing to which the recovery key was not getting applied. This bug is fixed in this release. We strongly recommend that you apply this update as the recovery key allows you to recover the data on the device, in the event the device doesn't boot up. For more information, see how to [save the recovery key when deploying Data Box Edge or Data Box Gateway](azure-stack-edge-deploy-connect-setup-activate.md#set-up-and-activate-the-physical-device).
- **Field Programmable Gate Array (FPGA) logging improvements** -  Starting 1905 release, logging and alert enhancements related to FPGA were made. This continues to be a required update for Data Box Edge if you are using the Edge compute feature with the FPGA. For more information, see how to [transform data with Edge compute on your Data Box Edge](azure-stack-edge-deploy-configure-compute-advanced.md).

## Known issues in GA release

No new issues are release noted for this release. All the release noted issues have carried over from the previous releases. To see a list of known issues, go to [Known issues in the GA release](data-box-gateway-release-notes.md#known-issues-in-ga-release).


## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md)
- [Prepare to deploy Azure Data Box Edge](azure-stack-edge-deploy-prep.md)
