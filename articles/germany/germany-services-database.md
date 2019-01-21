---
title: Azure Germany database services | Microsoft Docs
description: Provides a comparison of database services for Azure Germany
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

# Azure Germany database services
## SQL Database
Azure SQL Database V12 is generally available in Azure Germany. For guidance on metadata visibility configuration and protection best practices, see the [Microsoft Security Center for SQL Database Engine](/sql/relational-databases/security/security-center-for-sql-server-database-engine-and-azure-sql-database) and the [SQL Database global documentation](../sql-database/index.yml).

### Variations
The address for SQL Database in Azure Germany is different from the address in global Azure:

| Service type | Global Azure | Azure Germany |
| --- | --- | --- |
| SQL Database | *.database.windows.net | *.database.cloudapi.de |


## Azure Cache for Redis
For details on Azure Cache for Redis and how to use it, see [Azure Cache for Redis global documentation](../azure-cache-for-redis/index.md).

### Variations
The URLs for accessing and managing Azure Cache for Redis in Azure Germany are different from the URLs in global Azure:

| Service type | Global Azure | Azure Germany |
| --- | --- | --- |
| Cache endpoint | *.redis.cache.windows.net | *.redis.cache.cloudapi.de |
| Azure portal | https://portal.azure.com | https://portal.microsoftazure.de |

> [!NOTE]
> All your scripts and code need to account for the appropriate endpoints and environments. For more information, see "To connect to Microsoft Azure Germany" in [Manage Azure Cache for Redis with Azure PowerShell](../azure-cache-for-redis/cache-howto-manage-redis-cache-powershell.md).
>
>


## Next steps
For supplemental information and updates, subscribe to the
[Azure Germany blog](https://blogs.msdn.microsoft.com/azuregermany/).
