---
title: 'Azure Stack Storage: Differences and considerations'
description: Understand the differences between Azure Stack Storage and Azure Storage, along with Azure Stack deployment considerations.
services: azure-stack
documentationcenter: ''
author: xiaofmao
manager:
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 06/22/2017
ms.author: xiaofmao

---
# Azure Stack Storage: Differences and considerations
Azure Stack Storage is the set of storage cloud services in
Microsoft Azure Stack. Azure Stack Storage provides blob, table, queue, and account
management functionality with Azure-consistent semantics.

This article summarizes the known Azure Stack Storage differences from Azure Storage. It also summarizes other
considerations to keep in mind when you deploy Azure Stack. To learn about high-level differences between Azure Stack and Azure, see the [Key considerations](azure-stack-considerations.md) topic.

## Cheat sheet: Storage differences

| Feature | Azure (global) | Azure Stack |
| --- | --- | --- |
|File storage|Cloud-based SMB file shares supported|Not yet supported
|Data at rest encryption|256-bit AES encryption|Not yet supported
|Storage account type|General-purpose and Azure Blob storage accounts|General-purpose only
|Replication options|Locally redundant storage, geo-redundant storage, read-access geo-redundant storage, and zone-redundant storage|Locally redundant storage
|Premium storage|Fully supported|Can be provisioned, but no performance limit or guarantee
|Managed disks|Premium and standard supported|Not yet supported
|Blob name|1,024 characters (2,048 bytes)|880 characters (1,760 bytes)
|Block blob max size|4.75 TB (100 MB X 50,000 blocks)|50,000 X 4 MB (approx. 195 GB)
|Page blob incremental snapshot copy|Premium and standard Azure page blobs supported|Not yet supported
|Page blob page size|512 bytes|4 KB
|Table partition key and row key size|1,024 characters (2,048 bytes)|400 characters (800 bytes)

### Metrics
There are also some differences with storage metrics:
* The transaction data in storage metrics does not differentiate internal or external network bandwidth.
* The transaction data in storage metrics does not include virtual machine access to the mounted disks.

## API version
The following versions are supported with Azure Stack Storage:

* Azure Storage data services: [2015-04-05 REST API version](https://docs.microsoft.com/en-us/rest/api/storageservices/Version-2015-04-05?redirectedfrom=MSDN)
* Azure Storage management services: [2015-05-01-preview, 2015-06-15, and 2016-01-01](https://docs.microsoft.com/en-us/rest/api/storagerp/?redirectedfrom=MSDN) 

## Next steps

* [Get started with Azure Stack Storage development tools](azure-stack-storage-dev.md)
* [Introduction to Azure Stack Storage](azure-stack-storage-overview.md)

