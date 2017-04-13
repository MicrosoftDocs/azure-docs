---
title: Azure Germany Storage | Microsoft Docs
description: This provides a comparision of storage services for Azure Germany
services: germany
cloud: na
documentationcenter: na
author: gitralf
manager: rainerst

ms.assetid: na
ms.service: germany
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/07/2017
ms.author: ralfwi
---

# Azure Germany Storage
## Azure Storage
For details on this service and how to use it, see [Azure Storage public documentation](../storage/index.md).

### Storage Service Availability by Azure Germany Region

| Service | Germany Central | Germany Northeast |
| --- | --- | --- | --- |
| [Blob Storage](../storage/storage-introduction.md#blob-storage) |GA |GA |
| [Table Storage](../storage/storage-introduction.md#table-storage) |GA  |GA |
| [Queue Storage](../storage/storage-introduction.md#queue-storage) |GA | GA |
| [File Storage](../storage/storage-introduction.md#file-storage) |GA |GA |
| [Hot/Cool Blob Storage](../storage/storage-blob-storage-tiers.md) |GA |GA |
| [Storage Service Encryption](../storage/storage-service-encryption.md) |GA |GA |
| [Premium Storage](../storage/storage-premium-storage.md) |GA |GA |
| [Blob Import/Export](../storage/storage-import-export-service.md) |NA |NA |
| [StorSimple](../storsimple/storsimple-ova-overview.md) |NA |NA |

### Variations
The URLs for storage accounts in Azure Germany are different:

| Service Type | Azure Public | Azure Germany |
| --- | --- | --- |
| Blob Storage | *.blob.core.windows.net | *.blob.core.cloudapi.de |
| Queue Storage | *.queue.core.windows.net | *.queue.core.cloudapi.de |
| Table Storage | *.table.core.windows.net | *.table.core.cloudapi.de |
| File Storage | *.file.core.windows.net | *.file.core.cloudapi.de | 

> [!NOTE]
> All of your scripts and code needs to account for the appropriate endpoints.  See [Configure Azure Storage Connection Strings](../storage/storage-configure-connection-string.md). 
>
>

For more information on APIs see the [Cloud Storage Account Constructor](https://msdn.microsoft.com/en-us/library/azure/mt616540.aspx).

The endpoint suffix to use in these overloads is core.cloudapi.de

> [!NOTE]
> If error 53 "The network path was not found." is returned, while [Mounting the file share](../storage/storage-dotnet-how-to-use-files.md#mount-the-file-share). It could be due to firewall blocking the outbound port. Try mounting the file share on VM that's in the same Azure Subscription as storage account.
>
>


## Next Steps
For supplemental information and updates, subscribe to the 
[Azure Germany Blog](https://blogs.msdn.microsoft.com/azuregermany/)





