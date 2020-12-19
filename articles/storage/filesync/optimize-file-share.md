---
title: Optimize Azure file shares | Microsoft Docs
description: Understand planning for an Azure Files deployment. You can either direct mount an Azure file share, or cache Azure file share on-premises with Azure File Sync.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 09/15/2020
ms.author: rogarana
ms.subservice: files
ms.custom: references_regions
---

Azure file shares are deployed into *storage accounts*, which are top-level objects that represent a shared pool of storage. This pool of storage can be used to deploy multiple file shares, as well as other storage resources such as blob containers, queues, or tables. All storage resources that are deployed into a storage account share the limits that apply to that storage account. For current storage account limits, see [Azure Files scalability and performance targets](../articles/storage/files/storage-files-scale-targets.md).

There are two main types of storage accounts you will use for Azure Files deployments: 
- **General purpose version 2 (GPv2) storage accounts**: GPv2 storage accounts allow you to deploy Azure file shares on standard/hard disk-based (HDD-based) hardware. In addition to storing Azure file shares, GPv2 storage accounts can store other storage resources such as blob containers, queues, or tables. 
- **FileStorage storage accounts**: FileStorage storage accounts allow you to deploy Azure file shares on premium/solid-state disk-based (SSD-based) hardware. FileStorage accounts can only be used to store Azure file shares; no other storage resources (blob containers, queues, tables, etc.) can be deployed in a FileStorage account. Only FileStorage accounts can deploy both SMB and NFS file shares.

[!INCLUDE [storage-files-tiers-overview](../../../includes/storage-files-tiers-overview.md)]