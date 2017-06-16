---
title: 'Azure-consistent storage: differences and considerations'
description: Understand the differences from Azure Storage and other Azure-consistent storage deployment considerations.
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
ms.date: 06/19/2017
ms.author: xiaofmao

---
# Azure Stack storage: differences and considerations
Azure Stack storage is the set of storage cloud services in
Microsoft Azure Stack. Azure Stack storage provides blob, table, queue, and account
management functionality with Azure-consistent semantics.

This article summarizes the known Azure Stack storage differences with Azure Storage. It also summarizes other
considerations to keep in mind when you deploy Azure Stack. To learn about high-level differences between Azure Stack and Azure, see the [Key considerations](azure-stack-considerations.md) topic.

## Cheat sheet: Storage differences

| Feature | Azure (global) | Azure Stack |
| --- | --- | --- |
|File storage|Cloud-based SMB file shares supported|Not yet supported
|Data at rest encryption|Offers 256-bit AES encryption|Not yet supported
|Internal or external network bandwidth storage metrics|Supported|Not yet supported
|Replication options|LRS,GRS, RAGRS, and ZRS|LRS
|Premium storage|Fully supported|Can be provisioned, but no performance limit or guarantee.
|Storage account type|General-purpose and Blob storage accounts|General-purpose only
|Blob name|1024 characters (2048 bytes)|Limited to 880 characters (1760 bytes)
|Managed disks|Premium and standard supported|Not yet supported
|Large block blob|4.75 TB (100 MB X 50,000 blocks)|Max size of a block blob is 50,000 X 4 MB (approx. 195 GB)
|Page blob incremental snapshot copy|Premium and Standard Azure Page Blobs supported|Not yet supported
|Page blob granularity|512 bytes|4 KB
|Virtual machine access to mounted disks metrics|Supported|Not yet supported
|Partition key and row key size|1024 characters (2048 bytes)|400 characters (800 bytes)


## API version
The following versions are supported with Azure Stack Storage:

* Azure Storage data services: [2015-04-05 REST API version](https://docs.microsoft.com/en-us/rest/api/storageservices/Version-2015-04-05?redirectedfrom=MSDN)
* Azure Storage management services: 
    * [2015-05-01-preview and 2015-06-15](https://docs.microsoft.com/en-us/rest/api/storagerp/?redirectedfrom=MSDN) 

## Next steps


* [Introduction to Azure Stack storage](azure-stack-storage-overview.md)

