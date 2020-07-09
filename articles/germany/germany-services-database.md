---
title: Azure Germany database services | Microsoft Docs
description: This article provides a comparison of SQL database services for Azure Germany.
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
ms.date: 12/12/2019
ms.author: ralfwi
---

# Azure Germany database services

> [!IMPORTANT]
> Since [August 2018](https://news.microsoft.com/europe/2018/08/31/microsoft-to-deliver-cloud-services-from-new-datacentres-in-germany-in-2019-to-meet-evolving-customer-needs/), we have not been accepting new customers or deploying any new features and services into the original Microsoft Cloud Germany locations.
>
> Based on the evolution in customers’ needs, we recently [launched](https://azure.microsoft.com/blog/microsoft-azure-available-from-new-cloud-regions-in-germany/) two new datacenter regions in Germany, offering customer data residency, full connectivity to Microsoft’s global cloud network, as well as market competitive pricing. 
>
> Take advantage of the breadth of functionality, enterprise-grade security, and comprehensive features available in our new German datacenter regions by [migrating](germany-migration-main.md) today.

## SQL Database
Azure SQL Database and Azure SQL Managed Instance V12 is generally available in Azure Germany. For guidance on metadata visibility configuration and protection best practices, see the [Microsoft Security Center for SQL Database Engine](/sql/relational-databases/security/security-center-for-sql-server-database-engine-and-azure-sql-database) as well as the [SQL Database global documentation](../azure-sql/database/index.yml) and the [SQL Managed Instance global documentation](../azure-sql/managed-instance/index.yml).

### Variations
The address for SQL Database in Azure Germany is different from the address in global Azure:

| Service type | Global Azure | Azure Germany |
| --- | --- | --- |
| SQL Database | *.database.windows.net | *.database.cloudapi.de |


## Azure Cache for Redis
For details on Azure Cache for Redis and how to use it, see [Azure Cache for Redis global documentation](../azure-cache-for-redis/index.yml).

### Variations
The URLs for accessing and managing Azure Cache for Redis in Azure Germany are different from the URLs in global Azure:

| Service type | Global Azure | Azure Germany |
| --- | --- | --- |
| Cache endpoint | *.redis.cache.windows.net | *.redis.cache.cloudapi.de |
| Azure portal | https://portal.azure.com | https://portal.microsoftazure.de |

> [!NOTE]
> All your scripts and code need to account for the appropriate endpoints and environments. For more information, see "To connect to Microsoft Azure Germany" in [Manage Azure Cache for Redis with Azure PowerShell](../azure-cache-for-redis/cache-how-to-manage-redis-cache-powershell.md).
>
>


## Next steps
For supplemental information and updates, subscribe to the
[Azure Germany blog](https://blogs.msdn.microsoft.com/azuregermany/).
