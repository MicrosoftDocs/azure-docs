---
title: Migrate Azure database resources from Azure Germany to global Azure
description: This article provides information about migrating Azure database resources from Azure Germany to global Azure
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 8/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migrate Azure database resources to global Azure

This article has information that can help you migrate Azure database resources from Azure Germany to global Azure.

## Azure SQL Database

To migrate Azure SQL Database resources, for smaller workloads, you can use the export function to create a BACPAC file. BACPAC file is a compressed (zipped) file that contains metadata and the data from the SQL Server database. After you create the BACPAC file, you can copy it to the target environment (for example, by using AzCopy) and use the import function to rebuild the database. Be aware of the following considerations:

- For an export to be transactionally consistent, make sure that one of the following conditions is true:
  - No write activity occurs during the export.
  - You export from a transactionally consistent copy of your SQL database.
- To export to Azure Blob storage, the BACPAC file size is limited to 200 GB. For a larger BACPAC file, export to local storage.
- If the export operation from Azure SQL Database takes longer than 20 hours, it might be canceled. Look for hints about how to increase performance in the following links.

> [!NOTE]
> The connection string changes after the export operation because the DNS name of the server changes during export.

For more information:

- Learn how to [export a database to a BACPAC file](../sql-database/sql-database-export.md).
- Learn how to [import a BACPAC file to a database](../sql-database/sql-database-import.md).
- Review the [Azure SQL Database documentation](https://docs.microsoft.com/azure/sql-database/).

## SQL Data Warehouse

There are no special migration options for Azure SQL Data Warehouse. To migrate SQL Data Warehouse resources from Azure Germany to global Azure, follow the steps that are described in [Azure SQL Database](#azure-sql-database).

## Azure Cosmos DB

You can use Azure Cosmos DB Data Migration Tool to easily migrate data to Azure Cosmos DB. Azure Cosmos DB Data Migration Tool is an open-source solution that imports data to Azure Cosmos DB from different sources.

The tool is available as a graphical interface tool or as command-line tool. The source code is available in the [Azure Cosmos DB Data Migration Tool](https://github.com/azure/azure-documentdb-datamigrationtool) GitHub repository. A [compiled version of the tool](https://www.microsoft.com/download/details.aspx?id=46436) is available in the Microsoft Download Center.

To migrate Azure Cosmos DB resources, we recommend that you complete the following steps:

1. Review application uptime requirements and account configurations to determine the best action plan.
1. Clone the account configurations from Azure Germany to the new region by running the data migration tool.
1. If a maintenance window is possible, copy data from the source to the destination by running the data migration tool.
1. If a maintenance window isn't possible, copy data from the source to the destination by running the tool and by completing these steps:
  1. Make changes to read/write in an application by usingc a config-driven approach.
  1. Perform a first-time sync.
  1. Set up an incremental sync and catch up with the change feed.
  1. Point reads to the new account and validate the application.
  1. Stop writes to the old account, validate that the change feed is caught up, and then point writes to the new accounts.
  1. Stop the tool and delete the old account.
1. Run the tool to validate that data is consistent across old and new accounts.

For more information:

- Read an [introduction to Azure Cosmos DB](../cosmos-db/introduction.md).
- Learn how to [import data to Azure Cosmos DB](../cosmos-db/import-data.md).

## Redis Cache

You have a few options if you want to migrate an Azure Redis Cache instance from Azure Germany to global Azure. The option you choose depends on your requirements.

### Option 1: Accept data loss, create a new instance

This approach makes most sense when both of the following conditions are true:

- You're using Redis as a transient data cache.
- Your application will repopulate the cache data automatically in the new region.

To migrate with data loss and create a new instance:

1. Create a new Redis instance in the new target region.
1. Update your application to use the new instance in the new region.
1. Delete the old Redis instance in the source region.

### Option 2: Copy data from the source instance to the target instance

A member of the Azure Redis team wrote an open-source tool that copies data from one Redis instance to another without requiring import or export functionality. See step 4 in the following steps for information about the tool.

To copy date from the source instance to the target instance:

1. Create a VM in the source region. If your dataset in Redis is large, make sure that you select a relatively powerful VM size to minimize copying time.
1. Create a new Redis instance in the target region.
1. Flush data from the **target** instance. (Make sure *not* to flush from the **source** instance. Flushing is required because the copy tool *doesn't overwrite* existing keys in the target location.)
1. Use a tool like the following to automatically copy data from source Redis instance to target Redis instance: [Source](https://github.com/deepakverma/redis-copy), [Download](https://github.com/deepakverma/redis-copy/releases/download/alpha/Release.zip).

> [!NOTE]
> This process can take a long time depending on the size of your dataset.

### Option 3: Export from the source instance, import to the destination instance

This approach takes advantage of features that are available only in the Premium tier.

To export from the source instance and import to the destination instance:

1. Create a new Premium tier Redis instance in the target region. Use the same size as the source Redis instance.
1. [Export data from the source cache](../redis-cache/cache-how-to-import-export-data.md) or use the [Export-AzureRmRedisCache PowerShell cmdlet](/powershell/module/azurerm.rediscache/export-azurermrediscache?view=azurermps-6.4.0).

    > [!NOTE]
    > The export storage account must be in the same region as the cache instance.

1. Copy the exported blobs to a storage account in destination region (for example, by using AzCopy).
1. [Import data to the destination cache](../redis-cache/cache-how-to-import-export-data.md) or use the [Import-AzureRmRedisCAche PowerShell cmdlet](/powershell/module/azurerm.rediscache/import-azurermrediscache?view=azurermps-6.4.0).
1. Reconfigure your application to use the target Redis instance.

### Option 4: Write data to two Redis instances, read from one instance

For this approach, you must modify your application. The application needs to write data to more than one cache instance while reading from one of the cache instances. This approach makes sense if the data stored in Redis meets the following criteria:
- The data is refreshed on a regular basis. 
- All data is written to the target Redis instance.
- You have enough time for all data to be refreshed.

For more information:

- Review the [overview for Azure Redis Cache](../redis-cache/cache-overview.md).

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
