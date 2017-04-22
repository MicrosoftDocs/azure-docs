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
For details on this service and how to use it, see [Azure Storage global documentation](../storage/index.md).

Data stored in Azure storage is replicated to ensure high availability. For geo-redundant storage (GRS) and read-access geo-redundant storage (RA-GRS) Azure uses *pairing regions* where data is replicated between. For Azure Germany these pairing regions are:

| Primary Region | Secondary (Pairing) Region |
| --- | --- |
| Germany Central | Germany Northeast |
| Germany Northeast | Germany Central |

Please notice that all replication of data will assure that the data stays within German borders. Primary and secondary regions are paired to ensure necessary distance between datacenters to ensure availability in the event of an area-wide outage or disaster. For geo-redundant, high availability storage, select either geo-redundant storage (GRS) or read-access geo-redundant storage (RA-GRS) when creating a new storage account.  

Azure Storage Service Encryption (SSE) safeguards data at rest within Azure storage accounts. When enabled, Azure automatically encrypts data prior to persisting to storage. Data is encrypted using 256-bit AES encryption. SSE supports encryption of block blobs, append blobs, and page blobs.

### Storage service availability by Azure Germany region

| Service | Germany Central | Germany Northeast |
| --- | --- | --- | --- |
| [Blob Storage](../storage/storage-introduction.md#blob-storage) |GA |GA |
| [Table Storage](../storage/storage-introduction.md#table-storage) |GA  |GA |
| [Queue Storage](../storage/storage-introduction.md#queue-storage) |GA | GA |
| [File Storage](../storage/storage-introduction.md#file-storage) |GA |GA |
| [Hot/Cool Blob Storage](../storage/storage-blob-storage-tiers.md) |GA |GA |
| [Storage Service Encryption](../storage/storage-service-encryption.md) |GA |GA |
| [Premium Storage](../storage/storage-premium-storage.md) |GA |GA |
| Blob Import/Export |NA |NA |
| StorSimple |NA |NA |

### Variations
The URLs for storage accounts in Azure Germany are different from those in global Azure:

| Service Type | global Azure | Azure Germany |
| --- | --- | --- |
| Blob Storage | *.blob.core.windows.net | *.blob.core.cloudapi.de |
| Queue Storage | *.queue.core.windows.net | *.queue.core.cloudapi.de |
| Table Storage | *.table.core.windows.net | *.table.core.cloudapi.de |
| File Storage | *.file.core.windows.net | *.file.core.cloudapi.de | 

> [!NOTE]
> All of your scripts and code need to account for the appropriate endpoints.  See [Configure Azure Storage Connection Strings](../storage/storage-configure-connection-string.md). 
>
>

For more information on APIs see the [Cloud Storage Account Constructor](https://msdn.microsoft.com/en-us/library/azure/mt616540.aspx).

The endpoint suffix to use in these overloads is *core.cloudapi.de*.

> [!NOTE]
> If error 53 "The network path was not found." is returned while [Mounting the file share](../storage/storage-dotnet-how-to-use-files.md#mount-the-file-share). It could be due to firewall blocking the outbound port. Try mounting the file share on VM that's in the same Azure Subscription as storage account.
>
>


## Next Steps
For supplemental information and updates, subscribe to the 
[Azure Germany Blog](https://blogs.msdn.microsoft.com/azuregermany/).
