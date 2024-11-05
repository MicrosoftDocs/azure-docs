---
title: Azure Data Box Gateway 1905 release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the Azure Data Box Gateway 1905 running general availability release.
services: databox
author: stevenmatthew
 
ms.service: azure-data-box-gateway
ms.topic: release-notes
ms.date: 11/11/2020
ms.author: shaas
---

# Azure Data Box Edge and Azure Data Box Gateway 1905 release notes

## Overview

The following release notes identify the critical open issues and the resolved issues for the 1905 release for Azure Data Box Edge and Azure Data Box Gateway.

The release notes are continuously updated, and critical issues requiring a workaround are added as they're discovered. Before you deploy your Data Box Edge/Data Box Gateway, carefully review the information contained in the release notes. 

This release corresponds to the software versions:

- **Data Box Gateway 1905 (1.6.887.626)**
- **Data Box Edge 1905 (1.6.887.626)**

> [!NOTE]
> Update 1905 can be applied only to Data Box Edge devices that are running GA version of the software.

## What's new

- **Field Programmable Gate Array (FPGA) logging improvements** -  This release includes improvements in logging and alert enhancements related to  field-programmable gate arrays (FPGAs). This update is required for Data Box Edge if you're using the Edge compute feature with the FPGA. For more information, see how to [transform data with Edge compute on your Data Box Edge](../databox-online/azure-stack-edge-deploy-configure-compute-advanced.md).

## Known issues in GA release

No new issues are release noted for this release. All the release noted issues are carried over from the previous releases. To see a list of known issues, go to [Known issues in the GA release](data-box-gateway-release-notes.md#known-issues-in-ga-release).


## Next steps

- [Prepare to deploy Azure Data Box Gateway](data-box-gateway-deploy-prep.md)
- [Prepare to deploy Azure Data Box Edge](../databox-online/azure-stack-edge-deploy-prep.md)
