---
title: Migration of database resources from Azure Germany to global Azure
description: This article provides help for migrating database resources from Azure Germany to global Azure
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 8/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migration of database resources from Azure Germany to global Azure

This article will provide you some help for the migration of Azure Database resources from Azure Germany to global Azure.

## Azure SQL Database

To migrate Azure SQL databases, you can use (for smaller workloads) the export function to create a BACPAC file. BaACPAC file is a compressed (zip'ed) file with metadata and data from the SQL Server database. Once created, you can copy it to the target environment (for example with AzCopy) and use the import function to rebuild the database. Be aware of the following considerations (see more in the links provided below):

- For an export to be transactionally consistent, make sure either
  - no write activity is occurring during the export, or
  - you're exporting from a transactionally consistent copy of your Azure SQL database.
- For export to blob storage, the BACPAC file is limited to 200 GB. For a larger BACPAC file, export to local storage.
- If the export operation from Azure SQL Database takes longer than 20 hours, it may be canceled. Look for hints how to increase performance in the links below.

> [!NOTE]
> The connection string will change since the DNS name of the server will change.

### Next Steps

- [Export DB to Bacpac file](../sql-database/sql-database-export.md)
- [Import Bacpac file to a DB](../sql-database/sql-database-import.md)

### References

- [Azure SQL Database documentation](https://docs.microsoft.com/azure/sql-database/)







## SQL Data Warehouse

There are no special migration options for SQL Data Warehouse. Follow the instructions under [Azure SQL Database](#azure-sql-database).







## Azure Cosmos DB

With the Azure Cosmos DB Data Migration tool, you can easily migrate data to Azure Cosmos DB. The Azure Cosmos DB Data Migration tool is an open source solution that imports data to Azure Cosmos DB from different sources.

The tool is available as a graphical interface tool or as command-line tool. The source code is available in the GitHub repository for [Azure Cosmos DB Data Migration Tool](https://github.com/azure/azure-documentdb-datamigrationtool), and a compiled version is available on the [Microsoft Download Center](http://www.microsoft.com/download/details.aspx?id=46436).

The recommended steps are:

- Perform a review of application uptime requirements and account configurations to recommend the right action plan.
- Follow the steps to clone the account configurations from Azure Germany to the new region by running the tool
- If a maintenance window is possible, follow the steps to copy data from source to destination by running the tool
- If a maintenance window isn't possible, follow the steps to copy data from source to destination by running the tool and process that we recommend
  - Make changes to read/write in application with config driven approach
  - Perform first-time sync
  - Setup incremental sync/catch up with change feed
  - Point reads to new account and validate application
  - Stop writes to old account, validate change feed is caught up, then point writes to new accounts
  - Stop tool, and delete old account
- Follow the steps to run the tool to validate that data is consistent across the old and new accounts.


### References

- [Azure Cosmos DB](../cosmos-db/introduction.md)
- [Import data to Azure Cosmos DB](../cosmos-db/import-data.md)








## Redis Cache

There are a few options to migrate to global Azure, depending on the requirements you have.

### Option 1: Data Loss ok, create new instance

This approach makes most sense when

- you're using Redis as a transient data cache and
- your application will repopulate the cache data automatically in the new region.

Follow these steps:

- Create a new Redis instance in the new target region.
- Update your application to use the new instance in new region.
- Delete old Redis instance in source region.

### Option 2: Copy data from Source instance to Target instance

A member of the Azure Redis team wrote an open-source tool that copies data from one Redis instance to another without requiring Import or Export functionality.

- Create a VM in the source region. If your data set in Redis is large, make sure to select a relatively powerful VM size to minimize copying time.
- Create new Redis instance in target region.
- Flush data from the **target** instance (make sure **NOT** to flush from the **source** instance. Flushing is required because the copy tool **doesn't overwrite** existing keys in the target location.
- Use a tool like the following to automatically copy data from source Redis instance to target Redis instance: [Source](https://github.com/deepakverma/redis-copy), [Download](https://github.com/deepakverma/redis-copy/releases/download/alpha/Release.zip).

> [!NOTE]
> This process can take a long time, depending on the size of your data set.

### Option 3: Export from source instance, import into destination instance

This approach takes advantage of features only available in the Premium tier.

- Create a new Premium tier Redis instance in the target region. Use the same size as the source Redis instance.
- [Export data from source cache](../redis-cache/cache-how-to-import-export-data.md) or use the [Export-AzureRmRedisCache PowerShell cmdlet](/powershell/module/azurerm.rediscache/export-azurermrediscache?view=azurermps-6.4.0).

> [!NOTE]
> The export storage account must be in the same region as the cache instance.

- Copy exported blobs to a storage account in destination region (for example by using AzCopy)
- [Import data into destination cache](../redis-cache/cache-how-to-import-export-data.md) or use the [Import-AzureRmRedisCAche PowerShell cmdlet](/powershell/module/azurerm.rediscache/import-azurermrediscache?view=azurermps-6.4.0).
- Reconfigure your application to use the target Redis instance.

### Option 4: Write data to two Redis instances, read from one instance

For this approach, you need to modify your application. It needs to write data to more than one cache instances while reading from one of the cache instances. This approach makes sense if the data stored in Redis
- is refreshed on a regular basis, 
- all data is written to the target Redis instance, and
- you have enough time for all data to be refreshed.

### References

- [Overview Azure Redis Cache](../redis-cache/cache-overview.md)
