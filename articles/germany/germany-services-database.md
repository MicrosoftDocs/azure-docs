---
title: Azure Germany Databases | Microsoft Docs
description: This provides a comparision of database services for Azure Germany
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
ms.date: 04/13/2017
ms.author: ralfwi
---

# Azure Germany Databases
## SQL Database
Refer to the [Microsoft Security Center for SQL Database Engine](https://msdn.microsoft.com/en-us/library/bb510589.aspx) and [Azure SQL Database Public Documentation](../sql-database/index.md) for additional guidance on metadata visibility configuration, and protection best practices.

### Variations
SQL V12 Database is generally available in Azure Germany.

The Address for SQL Azure Servers in Azure Germany is different:

| Service Type | Azure Public | Azure Germany |
| --- | --- | --- |
| SQL Database | *.database.windows.net | *.database.cloudapi.de |


## Azure Redis Cache
For details on this service and how to use it, see [Azure Redis Cache public documentation](../redis-cache/index.md).

### Variations
The URLs for accessing and managing Azure Redis Cache in Azure Germany are different:

| Service Type | Azure Public | Azure Germany |
| --- | --- | --- |
| Cache endpoint | *.redis.cache.windows.net | *.redis.cache.cloudapi.de |
| Azure portal | https://portal.azure.com | https://portal.microsoftazure.de |

> [!NOTE]
> All of your scripts and code needs to account for the appropriate endpoints and environments. For more information, see [How to connect to Azure Germany Cloud](../redis-cache/cache-howto-manage-redis-cache-powershell.md).
> 
> 


## Next Steps
For supplemental information and updates, subscribe to the 
[Azure Germany Blog](https://blogs.msdn.microsoft.com/azuregermany/)






