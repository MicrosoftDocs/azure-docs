---
title: Azure stack storage differences and considerations | Microsoft Docs
description: Understand the differences between Azure stack storage and Azure storage, along with Azure Stack deployment considerations.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 12/03/2018
ms.author: mabrigg
ms.reviwer: xiaofmao

---
# Azure Stack storage: Differences and considerations

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Azure Stack storage is the set of storage cloud services in Microsoft Azure Stack. Azure Stack storage provides blob, table, queue, and account management functionality with Azure-consistent semantics.

This article summarizes the known Azure Stack Storage differences from Azure Storage services. It also lists things to consider when you deploy Azure Stack. To learn about high-level differences between global Azure and Azure Stack, see the [Key considerations](azure-stack-considerations.md) article.

## Cheat sheet: Storage differences

| Feature | Azure (global) | Azure Stack |
| --- | --- | --- |
|File storage|Cloud-based SMB file shares supported|Not yet supported
|Azure storage service encryption for data at Rest|256-bit AES encryption. Support encryption using customer-managed keys in Key Vault.|BitLocker 128-bit AES encryption. Encryption using customer-managed keys isn’t supported.
|Storage account type|General-purpose V1, V2 and Blob storage accounts|General-purpose V1 only.
|Replication options|Locally redundant storage, geo-redundant storage, read-access geo-redundant storage, and zone-redundant storage|Locally redundant storage.
|Premium storage|Fully supported|Can be provisioned, but no performance limit or guarantee.
|Managed disks|Premium and standard supported|Supported when you use version 1808 or later.
|Blob name|1,024 characters (2,048 bytes)|880 characters (1,760 bytes)
|Block blob max size|4.75 TB (100 MB X 50,000 blocks)|4.75 TB (100 MB x 50,000 blocks) for the 1802 update or newer version. 50,000 X 4 MB (approx. 195 GB) for previous versions.
|Page blob incremental snapshot copy|Premium and standard Azure page blobs supported|Not yet supported.
|Storage tiers for blob storage|Hot, cool, and archive storage tiers.|Not yet supported.
|Soft delete for blob storage|General available|Not yet supported.
|Page blob max size|8 TB|1 TB
|Page blob page size|512 bytes|4 KB
|Table partition key and row key size|1,024 characters (2,048 bytes)|400 characters (800 bytes)
|Blob snapshot|The max number of snapshots of one blob isn’t limited.|The max number of snapshots of one blob is 1,000.
|Azure AD Authentication for storage|In preview|Not yet supported.
|Immutable Blobs|General available|Not yet supported.
|Firewall and virtual network rules for storage|General available|Not yet supported.|

There are also differences with storage metrics:

* The transaction data in storage metrics does not differentiate internal or external network bandwidth.
* The transaction data in storage metrics does not include virtual machine access to the mounted disks.

## API version

The following versions are supported with Azure Stack Storage:

Azure Storage services APIs:

1811 update or newer versions:

 - [2017-11-09](https://docs.microsoft.com/rest/api/storageservices/version-2017-11-09)
 - [2017-07-29](https://docs.microsoft.com/rest/api/storageservices/version-2017-07-29)
 - [2017-04-17](https://docs.microsoft.com/rest/api/storageservices/version-2017-04-17)
 - [2016-05-31](https://docs.microsoft.com/rest/api/storageservices/version-2016-05-31)
 - [2015-12-11](https://docs.microsoft.com/rest/api/storageservices/version-2015-12-11)
 - [2015-07-08](https://docs.microsoft.com/rest/api/storageservices/version-2015-07-08)
 - [2015-04-05](https://docs.microsoft.com/rest/api/storageservices/version-2015-04-05)

1802 update to 1809 update:

 - [2017-04-17](https://docs.microsoft.com/rest/api/storageservices/version-2017-04-17)
 - [2016-05-31](https://docs.microsoft.com/rest/api/storageservices/version-2016-05-31)
 - [2015-12-11](https://docs.microsoft.com/rest/api/storageservices/version-2015-12-11)
 - [2015-07-08](https://docs.microsoft.com/rest/api/storageservices/version-2015-07-08)
 - [2015-04-05](https://docs.microsoft.com/rest/api/storageservices/version-2015-04-05)

Previous versions:

 - [2015-04-05](https://docs.microsoft.com/rest/api/storageservices/version-2015-04-05)

Azure Storage services management APIs:

1811 update or newer versions:

 - [2017-10-01](https://docs.microsoft.com/rest/api/storagerp/?redirectedfrom=MSDN)
 - [2017-06-01](https://docs.microsoft.com/rest/api/storagerp/?redirectedfrom=MSDN)
 - [2016-12-01](https://docs.microsoft.com/rest/api/storagerp/?redirectedfrom=MSDN)
 - [2016-05-01](https://docs.microsoft.com/rest/api/storagerp/?redirectedfrom=MSDN)
 - [2016-01-01](https://docs.microsoft.com/rest/api/storagerp/?redirectedfrom=MSDN)
 - [2015-06-15](https://docs.microsoft.com/rest/api/storagerp/?redirectedfrom=MSDN)
 - [2015-05-01-preview](https://docs.microsoft.com/rest/api/storagerp/?redirectedfrom=MSDN)
 

Previous versions:

 - [2016-01-01](https://docs.microsoft.com/rest/api/storagerp/?redirectedfrom=MSDN)
 - [2015-06-15](https://docs.microsoft.com/rest/api/storagerp/?redirectedfrom=MSDN)
 - [2015-05-01-preview](https://docs.microsoft.com/rest/api/storagerp/?redirectedfrom=MSDN)
 
## SDK versions

For more information about Azure Stack supported storage client libraries, see [Get started with Azure Stack storage development tools](azure-stack-storage-dev.md).

## Next steps

* [Get started with Azure Stack Storage development tools](azure-stack-storage-dev.md)
* [Introduction to Azure Stack Storage](azure-stack-storage-overview.md)
