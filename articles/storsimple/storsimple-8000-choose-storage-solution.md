---
title: Options for data transfer to Azure using an appliance | Microsoft Docs
description: Learn how to choose the right appliance to transfer data to Azure
services: storsimple
author: alkohli

ms.service: storsimple
ms.topic: article
ms.date: 04/01/2019
ms.author: alkohli
---

# Compare StorSimple with Azure File Sync and Data Box Edge data transfer options 
 
This document provides an overview of options for on-premises data transfer to Azure, comparing: Data Box Edge vs. Azure File Sync vs. StorSimple 8000 series.

- **[Data Box Edge](/azure/databox-online/data-box-edge-overview)** – Data Box Edge is an on-premises network device that moves data into and out of Azure and has AI-enabled Edge compute to pre-process data during upload. Data Box Gateway is a virtual version of the device with the same data transfer capabilities.
- **[Azure File Sync](/azure/storage/files/storage-sync-files-deployment-guide)** – Azure File Sync can be used to centralize your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of an on-premises file server. Azure File Sync transforms Windows Server into a quick cache of your Azure file share. General availability of Azure File Sync was announced earlier in 2018.
- **[StorSimple](/azure/storsimple/storsimple-overview)** – StorSimple is a hybrid device that helps enterprises consolidate their storage infrastructure for primary storage, data protection, archiving, and disaster recovery on a single solution by tightly integrating with Azure storage. The product lifecycle for StorSimple can be found [here](https://support.microsoft.com/lifecycle/search?alpha=Azure%20StorSimple%208000%20Series).

## Comparison summary

|                           |StorSimple 8000   |Azure File Sync   |Data Box Edge           |
|---------------------------|----------------------------------------|-------------------------------|-----------------------------------------|
|Overview         |Tiered hybrid storage and archival|General file server storage with cloud tiering and multi-site sync.  |Storage solution to pre-process data and send it over network to Azure.        |
|Scenarios        |File server, archival, backup target |File server, archival (multi-site)   |Data transfer, data pre-processing including ML inferencing, IoT, archival    |
|Edge compute     |Not available |Not available |Supports running containers using Azure IoT Edge    |
|Form factor      |Physical device   |Agent installed on Windows Server |Physical device   |
|Hardware         |Physical device provided from Microsoft as part of the service | Customer provided |Physical device provided from Microsoft as part of the service  |
|Data format      |Custom format   |Files         |Blobs or Files    |
|Protocol support |iSCSI          |SMB, NFS    | SMB or NFS      |
|Pricing          |[StorSimple](https://azure.microsoft.com/pricing/details/storsimple/) |[Azure File Sync](https://azure.microsoft.com/pricing/details/storage/files/)  |[Data Box Edge](https://azure.microsoft.com/pricing/details/storage/databox/edge/)  |

## Next steps

- Learn about [Azure Data Box Edge](/azure/databox-online/data-box-edge-overview) and [Azure Data Box Gateway](/azure/databox-online/data-box-gateway-overview)
- Learn about [Azure File Sync](/azure/storage/files/storage-sync-files-deployment-guide)
