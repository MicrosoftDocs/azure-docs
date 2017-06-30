---
title: Azure Government Databases | Microsoft Docs
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: ryansoc
manager: zakramer

ms.assetid: a1e173a9-996a-4091-a2e3-6b1e36da9ae1
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 11/14/2016
ms.author: ryansoc

---
# Azure Government Databases
## SQL Database
Refer to the<a href="https://msdn.microsoft.com/en-us/library/bb510589.aspx"> Microsoft Security Center for SQL Database Engine </a> and [Azure SQL Database Public Documentation](../sql-database/index.yml) for additional guidance on metadata visibility configuration, and protection best practices.

### Variations
SQL V12 Database is generally available in Azure Government.

The Address for SQL Azure Servers in Azure Government is different:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| SQL Database |*.database.windows.net |*.database.usgovcloudapi.net |

### Considerations
The following information identifies the Azure Government boundary for Azure SQL:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
| All data stored and processed in Microsoft Azure SQL can contain Azure Government-regulated data. You must use database tools for data transfer of Azure Government-regulated data. |Azure SQL metadata is not permitted to contain export controlled data. This metadata includes all configuration data entered when creating and maintaining your storage product.  Do not enter regulated/controlled data into the following fields: Database name, Subscription name, Resource groups, Server name, Server admin login, Deployment names, Resource names, Resource tags |

## Azure Redis Cache
For details on this service and how to use it, see [Azure Redis Cache public documentation](../redis-cache/index.md).

### Variations
The URLs for accessing and managing Azure Redis Cache in Azure Government are different:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| Cache endpoint |*.redis.cache.windows.net |*.redis.cache.usgovcloudapi.net |
| Azure portal |https://portal.azure.com |https://portal.azure.us |

> [!NOTE]
> All of your scripts and code needs to account for the appropriate endpoints and environments. For more information, see [How to connect to other clouds](../redis-cache/cache-howto-manage-redis-cache-powershell.md#how-to-connect-to-other-clouds).
>
>

### Considerations
The following information identifies the Azure Government boundary for Azure Redis Cache:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
| All data stored and processed in Azure Redis Cache can contain Azure Government-regulated data. |Azure Redis Cache metadata is not permitted to contain export controlled data. Do not enter regulated/controlled data into the following fields: Cache name, VNET name, Subscription name, Resource groups, Resource tags, Redis properties. |

## Next Steps
For supplemental information and updates subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
