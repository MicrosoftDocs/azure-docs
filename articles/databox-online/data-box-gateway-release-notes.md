---
title: Data Box Gateway Preivew release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the Data Box Gateway running Preview release.
services: databox-edge
documentationcenter: ''
author: alkohli
manager: twooley
editor: ''

ms.assetid: 
ms.service: databox-edge
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/11/2018
ms.author: alkohli

---
# Data Box Gateway Preview release notes

## Overview

The following release notes identify the critical open issues and the resolved issues for Microsoft Azure Data Box Gateway Preview release.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your Data Box Gateway, carefully review the information contained in the release notes.

Preview release corresponds to the software version **Data Box Gateway Version 1.2**.

> [!IMPORTANT]
> - Updates are disruptive and restart your device. If I/O are in progress, the device incurs downtime. <!--For detailed instructions on how to apply the release, go to [Install Preview release](data-box-gateway-install-update.md).-->


## Issues fixed in Preview release

The following table provides a summary of issues fixed in this release.

| No. | Feature | Issue |
| --- | --- | --- |
| 1 |AAD-based authentication| This release contains changes that allows AAD to authenticate with the StorSimple Device Manager.|


## Known issues in Preview release

The following table provides a summary of known issues for the Data Box Gateway running preview release.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
| **1.** |Updates |The virtual arrays created in the preview release cannot be updated to a supported General Availability version. |These virtual arrays must be failed over for the General Availability release using a disaster recovery (DR) workflow. |
| **2.** |Provisioned data disk |Once you have provisioned a data disk of a certain specified size and created the corresponding Data Box Gateway, you must not shrink the data disk. Attempting to do results in a loss of all the data in the local tiers on the device. | |
| **3.** |Group policy |In this release, when a file that was uploaded by another tool (AzCopy) is refreshed and then updated in a way that increases/extends the file size, then the following error is observed: Error 400: InvalidBlobOrBlock (The specified blob or block content is invalid.)  |This error will be fixed in a future release. |
| **4.** |Local web UI |In this release, you can refresh only one share at a time. |This behavior will likely change in a future release. |
| **5.** |Local web UI |Rename of objects is not supported. |Contact Edge Support if this feature is crucial for your workflow. |
| **6.** |If a read-only file is copied to the device, the read-only property is not preserved. | |
| **7.** |Tiered shares |The Help links in the Azure preview portal do not link to Edge-specific documentation.| |



## Next steps
<!--[Install Update](data-box-gateway-install-update.md) on your Data Box Gateway.-->


