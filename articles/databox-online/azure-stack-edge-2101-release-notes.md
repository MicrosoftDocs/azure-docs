---
title: Azure Stack Edge Pro FPGA 2101 release notes | Microsoft Docs
description: Describes Azure Stack Edge Pro FPGA 2101 release critical open issues and resolutions.
services: databox
author: v-dalc
ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 02/01/2021
ms.author: alkohli
---

# Azure Stack Edge Pro with FPGA 2101 release notes

The following release notes identify the critical open issues and the resolved issues for the 2101 release of Azure Stack Edge Pro FPGA with a built-in Field Programmable Gate Array (FPGA).

The release notes are continuously updated. As critical issues that require a workaround are discovered, they are added. Before you deploy your Azure Stack Edge device, carefully review the information in the release notes.  

This release corresponds to software version:

- **Azure Stack Edge 2101 (1.6.1475.2528)** - KB 4599267

> [!NOTE]
> Update 2101 can be applied only to devices that are running general availability (GA) versions of the software or later.

## What's new

This release contains the following bug fix:

- **Upload issue** - This release fixes an upload problem, where upload restarts caused by a failure can slow the rate of upload completion. This problem can occur when uploading a dataset that primarily consists of files that are large relative to available bandwidth, particularly, but not limited to, when bandwidth throttling is active. This change ensures sufficient opportunity for upload completion before restarting upload for a given file.

This release also contains the following updates:

- All cumulative Windows updates and .NET framework updates released through October 2020.
- The baseboard management controller (BMC) firmware version is upgraded from 3.32.32.32 to 3.36.36.36 during factory install to address incompatibility with newer Dell power supply units.
- This release supports IoT Edge 1.0.9.3 on Azure Stack Edge devices.

## Known issues in this release

No new issues are release noted for this release. All the release noted issues have carried over from the previous releases. To see a list of known issues, go to [Known issues in the GA release](../databox-gateway/data-box-gateway-release-notes.md#known-issues-in-ga-release).

## Next steps

- [Prepare to deploy Azure Stack Edge](../databox-online/azure-stack-edge-deploy-prep.md)