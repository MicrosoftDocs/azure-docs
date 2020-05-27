---
title: Migrate Azure database resources, Azure Germany to global Azure
description: This article provides information about migrating your Azure database resources from Azure Germany to global Azure
author: gitralf
services: germany
cloud: Azure Germany
ms.author: juliako 
ms.service: germany
ms.date: 11/12/2019
ms.topic: article
ms.custom: bfmigrate
---

# Migrate database resources to global Azure

> [!IMPORTANT]
> Since [August 2018](https://news.microsoft.com/europe/2018/08/31/microsoft-to-deliver-cloud-services-from-new-datacentres-in-germany-in-2019-to-meet-evolving-customer-needs/), we have not been accepting new customers or deploying any new features and services into the original Microsoft Cloud Germany locations.
>
> Based on the evolution in customers' needs, we recently [launched](https://azure.microsoft.com/blog/microsoft-azure-available-from-new-cloud-regions-in-germany/) two new datacenter regions in Germany, offering customer data residency, full connectivity to Microsoft's global cloud network, as well as market competitive pricing. 
>
> Take advantage of the breadth of functionality, enterprise-grade security, and comprehensive features available in our new German datacenter regions by [migrating](germany-migration-main.md) today.

This article has information that can help you migrate Azure database resources from Azure Germany to global Azure.

## SQL Database

To migrate smaller Azure SQL Database workloads, use the export function to create a BACPAC file. A BACPAC file is a compressed (zipped) file that contains metadata and the data from the SQL Server database. After you create the BACPAC file, you can copy the file to the target environment (for example, by using AzCopy) and use the import function to rebuild the database. Be aware of the following considerations:

- For an export to be transactionally consistent, make sure that one of the following conditions is true:
  - No write activity occurs during the export.
  - You export from a transactionally consistent copy of your SQL database.
- To export to Azure Blob storage, the BACPAC file size is limited to 200 GB. For a larger BACPAC file, export to local storage.
- If the export operation from SQL Database takes longer than 20 hours, the operation might be canceled. Check the following articles for tips about how to increase performance.

> [!NOTE]
> The connection string changes after the export operation because the DNS name of the server changes during export.

For more information:

- Learn how to [export a database to a BACPAC file](../azure-sql/database/database-export.md).
- Learn how to [import a BACPAC file to a database](../azure-sql/database/database-import.md).
- Review the [Azure SQL Database documentation](https://docs.microsoft.com/azure/sql-database/).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## SQL Data Warehouse

To migrate Azure SQL Data Warehouse resources from Azure Germany to global Azure, follow the steps that are described in Azure SQL Database.

## Azure Cosmos DB

You can use Azure Cosmos DB Data Migration Tool to migrate data to Azure Cosmos DB. Azure Cosmos DB Data Migration Tool is an open-source solution that imports data to Azure Cosmos DB from different sources.

Azure Cosmos DB Data Migration Tool is available as a graphical interface tool or as command-line tool. The source code is available in the [Azure Cosmos DB Data Migration Tool](https://github.com/azure/azure-documentdb-datamigrationtool) GitHub repository. A [compiled version of the tool](https://www.microsoft.com/download/details.aspx?id=46436) is available in the Microsoft Download Center.

To migrate Azure Cosmos DB resources, we recommend that you complete the following steps:

1. Review application uptime requirements and account configurations to determine the best action plan.
1. Clone the account configurations from Azure Germany to the new region by running the data migration tool.
1. If using a maintenance window is possible, copy data from the source to the destination by running the data migration tool.
1. If using a maintenance window isn't an option, copy data from the source to the destination by running the tool, and then complete these steps:
   1. Use a config-driven approach to make changes to read/write in an application.
   1. Complete a first-time sync.
   1. Set up an incremental sync and catch up with the change feed.
   1. Point reads to the new account and validate the application.
   1. Stop writes to the old account, validate that the change feed is caught up, and then point writes to the new account.
   1. Stop the tool and delete the old account.
1. Run the tool to validate that data is consistent across old and new accounts.

For more information:

- Read an [introduction to Azure Cosmos DB](../cosmos-db/introduction.md).
- Learn how to [import data to Azure Cosmos DB](../cosmos-db/import-data.md).

## Azure Cache for Redis

You have a few options if you want to migrate an Azure Cache for Redis instance from Azure Germany to global Azure. The option you choose depends on your requirements.

### Option 1: Accept data loss, create a new instance

This approach makes the most sense when both of the following conditions are true:

- You're using Azure Cache for Redis as a transient data cache.
- Your application will repopulate the cache data automatically in the new region.

To migrate with data loss and create a new instance:

1. Create a new Azure Cache for Redis instance in the new target region.
1. Update your application to use the new instance in the new region.
1. Delete the old Azure Cache for Redis instance in the source region.

### Option 2: Copy data from the source instance to the target instance

A member of the Azure Cache for Redis team wrote an open-source tool that copies data from one Azure Cache for Redis instance to another without requiring import or export functionality. See step 4 in the following steps for information about the tool.

To copy data from the source instance to the target instance:

1. Create a VM in the source region. If your dataset in Azure Cache for Redis is large, make sure that you select a relatively powerful VM size to minimize copying time.
1. Create a new Azure Cache for Redis instance in the target region.
1. Flush data from the **target** instance. (Make sure *not* to flush from the **source** instance. Flushing is required because the copy tool *doesn't overwrite* existing keys in the target location.)
1. Use the following tool to automatically copy data from the source Azure Cache for Redis instance to the target Azure Cache for Redis instance: [Tool source](https://github.com/deepakverma/redis-copy) and [tool download](https://github.com/deepakverma/redis-copy/releases/download/alpha/Release.zip).

> [!NOTE]
> This process can take a long time depending on the size of your dataset.

### Option 3: Export from the source instance, import to the destination instance

This approach takes advantage of features that are available only in the Premium tier.

To export from the source instance and import to the destination instance:

1. Create a new Premium tier Azure Cache for Redis instance in the target region. Use the same size as the source Azure Cache for Redis instance.
1. [Export data from the source cache](../redis-cache/cache-how-to-import-export-data.md) or use the [Export-AzRedisCache PowerShell cmdlet](/powershell/module/az.rediscache/export-azrediscache).

   > [!NOTE]
   > The export Azure Storage account must be in the same region as the cache instance.

1. Copy the exported blobs to a storage account in destination region (for example, by using AzCopy).
1. [Import data to the destination cache](../redis-cache/cache-how-to-import-export-data.md) or use the [Import-AzRedisCAche PowerShell cmdlet](/powershell/module/az.rediscache/import-azrediscache).
1. Reconfigure your application to use the target Azure Cache for Redis instance.

### Option 4: Write data to two Azure Cache for Redis instances, read from one instance

For this approach, you must modify your application. The application needs to write data to more than one cache instance while reading from one of the cache instances. This approach makes sense if the data stored in Azure Cache for Redis meets the following criteria:
- The data is refreshed on a regular basis. 
- All data is written to the target Azure Cache for Redis instance.
- You have enough time for all data to be refreshed.

For more information:

- Review the [overview of Azure Cache for Redis](../redis-cache/cache-overview.md).

## PostgreSQL and MySQL

For more information, see the articles in the "Back up and migrate data" section of [PostgreSQL](https://docs.microsoft.com/azure/postgresql/) and [MySQL](https://docs.microsoft.com/azure/mysql/).

![PostgreSQL and MySQL](./media/germany-migration-main/databases.png)

## Next steps

Learn about tools, techniques, and recommendations for migrating resources in the following service categories:

- [Compute](./germany-migration-compute.md)
- [Networking](./germany-migration-networking.md)
- [Storage](./germany-migration-storage.md)
- [Web](./germany-migration-web.md)
- [Analytics](./germany-migration-analytics.md)
- [IoT](./germany-migration-iot.md)
- [Integration](./germany-migration-integration.md)
- [Identity](./germany-migration-identity.md)
- [Security](./germany-migration-security.md)
- [Management tools](./germany-migration-management-tools.md)
- [Media](./germany-migration-media.md)
