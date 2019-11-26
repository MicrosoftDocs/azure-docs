---
title: Azure Germany storage services | Microsoft Docs
description: Provides a comparison of storage services for Azure Germany
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

# Azure Germany storage services
## Storage
For details on Azure Storage and how to use it, see the [Storage global documentation](../storage/index.yml).

Data stored in Azure Storage is replicated to ensure high availability. For geo-redundant storage and read-access geo-redundant storage, Azure replicates data between *pairing regions*. For Azure Germany, these pairing regions are:

| Primary region | Secondary (pairing) region |
| --- | --- |
| Germany Central | Germany Northeast |
| Germany Northeast | Germany Central |

Replication of data keeps the data within German borders. Primary and secondary regions are paired to ensure necessary distance between datacenters to ensure availability in the event of an area-wide outage or disaster. For geo-redundant, high-availability storage, select either geo-redundant storage or read-access geo-redundant storage when you're creating a storage account.  

Storage Service Encryption safeguards data at rest within Azure storage accounts. When you enable that feature, Azure automatically encrypts data before persisting to storage. Data is encrypted through 256-bit AES encryption. Storage Service Encryption supports encryption of block blobs, append blobs, and page blobs.

### Storage service availability by Azure Germany region

| Service | Germany Central | Germany Northeast |
| --- | --- | --- |
| [Blob storage](../storage/common/storage-introduction.md#blob-storage) |GA |GA |
| [Azure Files](../storage/common/storage-introduction.md#azure-files) | GA | GA |
| [Table storage](../storage/common/storage-introduction.md#table-storage) |GA  |GA |
| [Queue storage](../storage/common/storage-introduction.md#queue-storage) |GA | GA |
| [Hot/cool blob storage](../storage/blobs/storage-blob-storage-tiers.md) |GA |GA |
| [Storage Service Encryption](../storage/common/storage-service-encryption.md) |GA |GA |
| Import/Export |NA |NA |
| StorSimple |NA |NA |

### Variations
The URLs for storage accounts in Azure Germany are different from those in global Azure:

| Service type | Global Azure | Azure Germany |
| --- | --- | --- |
| Blob storage | *.blob.core.windows.net | *.blob.core.cloudapi.de |
| Azure Files | *.file.core.windows.net | *.file.core.cloudapi.de | 
| Queue storage | *.queue.core.windows.net | *.queue.core.cloudapi.de |
| Table storage | *.table.core.windows.net | *.table.core.cloudapi.de |

> [!NOTE]
> All your scripts and code need to account for the appropriate endpoints. For more information, see [Configure Azure Storage connection strings](../storage/common/storage-configure-connection-string.md). 
>
>

For more information on APIs, see [Cloud Storage Account Constructor](/dotnet/api/microsoft.azure.cosmos.table.cloudstorageaccount.-ctor).

The endpoint suffix to use in these overloads is *core.cloudapi.de*.

> [!NOTE]
> If error 53 ("The network path was not found") is returned while you're [mounting the file share](../storage/files/storage-dotnet-how-to-use-files.md), a firewall might be blocking the outbound port. Try mounting the file share on a virtual machine that's in the same Azure subscription as storage account.
>
>


## Next steps
For supplemental information and updates, subscribe to the 
[Azure Germany blog](https://blogs.msdn.microsoft.com/azuregermany/).
