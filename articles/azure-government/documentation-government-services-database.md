---
title: Azure Government Databases | Microsoft Docs
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: zakramer
manager: liki

ms.assetid: a1e173a9-996a-4091-a2e3-6b1e36da9ae1
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 03/06/2019
ms.author: zakramer

---
# Azure Government Databases
## SQL Database
For more information, see the<a href="https://msdn.microsoft.com/library/bb510589.aspx"> Microsoft Security Center for SQL Database Engine </a> and [Azure SQL Database documentation](../sql-database/index.yml) for additional guidance on metadata visibility configuration, and protection best practices.

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
| All data stored and processed in Microsoft Azure SQL can contain Azure Government-regulated data. Use database tools for data transfer of Azure Government-regulated data. |Azure SQL metadata is not permitted to contain export-controlled data. This metadata includes all configuration data entered when creating and maintaining your storage product.  Do not enter regulated/controlled data into the following fields: Database name, Subscription name, Resource groups, Server name, Server admin login, Deployment names, Resource names, Resource tags |

## SQL Data Warehouse
For details on this service and how to use it, see [Azure SQL Data Warehouse documentation](../sql-data-warehouse/sql-data-warehouse-overview-what-is.md).

## SQL Server Stretch Database
For details on this service and how to use it, see [Azure SQL Server Stretch Database documentation](../sql-server-stretch-database/index.md)

## Azure Cosmos DB
For details on this service and how to use it, see [Azure Cosmos DB documentation](../cosmos-db/index.yml).

### Variations
Azure Cosmos DB is generally available in Azure Government. The **Add Azure Search** function currently isn't available in Cosmos DB for Azure Government because Azure Search is not yet deployed in Azure Government.

Also, the URLs for accessing Cosmos DB in Azure Government are different:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| Cosmos DB | *.documents.azure.com | *.documents.azure.us |


### Considerations
The following information identifies the Azure Government boundary for Azure Cosmos DB:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
| All data stored and processed in Azure Cosmos DB can contain Azure Government-regulated data. |Azure Cosmos DB metadata is not permitted to contain export-controlled data. Do not enter regulated/controlled data into the following fields: **DB name, Subscription name, Resource groups, Resource tags**. |


## Azure Cache for Redis
For details on this service and how to use it, see [Azure Cache for Redis documentation](../azure-cache-for-redis/index.md).

### Variations
The URLs for accessing and managing Azure Cache for Redis in Azure Government are different:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| Cache endpoint |*.redis.cache.windows.net |*.redis.cache.usgovcloudapi.net |

> [!NOTE]
> All scripts and code need to account for the appropriate endpoints and environments. For more information, see [How to connect to other clouds](../azure-cache-for-redis/cache-howto-manage-redis-cache-powershell.md#how-to-connect-to-other-clouds).
>
>

### Considerations
The following information identifies the Azure Government boundary for Azure Cache for Redis:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
| All data stored and processed in Azure Cache for Redis can contain Azure Government-regulated data. |Azure Cache for Redis metadata is not permitted to contain export-controlled data. Do not enter regulated/controlled data into the following fields: **Cache name, Subscription name, Resource groups, Resource tags, Redis properties**. |

## Azure Database for PostgreSQL
For details on this service and how to use it, see [Azure Database for PostgreSQL documentation](../postgresql/index.yml).

### Variations
Advanced Threat Protection, Query Performance Insights and Performance Recommendations for Azure Database for PostgreSQL are **not** available in Azure Government.

The URLs for accessing and managing Azure Database for PostgreSQL in Azure Government are different:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| PostgreSQL endpoint |*.postgres.database.azure.com |*.postgres.database.usgovcloudapi.net |

### Considerations
The following information identifies the Azure Government boundary for Azure Database for PostgreSQL:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
| All data stored and processed in Azure Database for PostgreSQL can contain Azure Government-regulated data. Use database tools for data transfer of Azure Government-regulated data. |Azure Database for PostgreSQL metadata is not permitted to contain export-controlled data. This metadata includes all configuration data entered when creating and maintaining your storage product.  Do not enter regulated/controlled data into the following fields: Database name, Subscription name, Resource groups, Server name, Server admin login, Deployment names, Resource names, Resource tags. |

## Azure Database for MariaDB
For details on this service and how to use it, see [Azure Database for MariaDB documentation](../mariadb/index.yml).

### Variations
Query Performance Insights and Performance Recommendations for Azure Database for MariaDB are **not** available in Azure Government.

The URLs for accessing and managing Azure Database for MariaDB in Azure Government are different:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| MariaDB endpoint |*.mariadb.database.azure.com |*.mariadb.database.usgovcloudapi.net |

### Considerations
The following information identifies the Azure Government boundary for Azure Database for MariaDB:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
| All data stored and processed in Azure Database for MariaDB can contain Azure Government-regulated data. Use database tools for data transfer of Azure Government-regulated data. |Azure Database for MariaDB metadata is not permitted to contain export-controlled data. This metadata includes all configuration data entered when creating and maintaining your storage product.  Do not enter regulated/controlled data into the following fields: Database name, Subscription name, Resource groups, Server name, Server admin login, Deployment names, Resource names, Resource tags. |

## Azure Database for MySQL
For details on this service and how to use it, see [Azure Database for MySQL documentation](../mysql/index.yml).

### Variations
Advanced Threat Protection, Query Performance Insights and Performance Recommendations for Azure Database for MySQL are **not** available in Azure Government.

The URLs for accessing and managing Azure Database for MySQL in Azure Government are different:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| MySQL endpoint |*.mysql.database.azure.com |*.mysql.database.usgovcloudapi.net |

### Considerations
The following information identifies the Azure Government boundary for Azure Database for MySQL:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
| All data stored and processed in Azure Database for MySQL can contain Azure Government-regulated data. Use database tools for data transfer of Azure Government-regulated data. |Azure Database for MySQL metadata is not permitted to contain export-controlled data. This metadata includes all configuration data entered when creating and maintaining your storage product.  Do not enter regulated/controlled data into the following fields: Database name, Subscription name, Resource groups, Server name, Server admin login, Deployment names, Resource names, Resource tags. |

## Next steps
For supplemental information and updates subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
