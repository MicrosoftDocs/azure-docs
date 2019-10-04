---
title: Cosmos DB Migration options
description: This doc describes the various options that you can use to migrate data into Cosmos DB
author: bharathsreenivas
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 10/03/2019
ms.author: bharathb

---
# Migrate data into Cosmos DB

Users of Azure Cosmos DB can load data from various data sources. Additionally, since Azure Cosmos DB supports multiple APIs, the targets can be any of the existing APIs. In order to support migration paths from the various sources to the different Azure Cosmos DB APIs, there are multiple solutions which provide specialized handling for each migration path. This documents attempts to list these solutions and describe their advantages and limitations.

## Factors affecting the choice of migration tool

The below factors determine the choice of the migration tool:
* **Online vs Offline migration** : Many migration tools provide a path to do a one-time migration only. This would mean that the applications accessing the database would experience a period of downtime. Some migration solutions provide a way to do a live migration where there is a replication pipeline set up between the source and target. 
* **Data source** : The existing data can be in various data sources like Oracle DB2, Datastax Cassanda, Azure SQL Server, PostGres, etc. The data can also be in an existing Cosmos DB account and the intent of migration would be to change the data model or repartition the data in a container with a different partition key.
* **Azure Cosmos DB API** : For the SQL API in Azure Cosmos DB, there are a variety of tools developed by the Azure Cosmos DB team which aid in the different migration scenarios. Each of the other API have their own specialized set of tools developed and maintained by the community. Since Azure Cosmos DB supports these APIs at a wire protocol level, these tools should work as-is while migrating data into Azure Cosmos DB too. However, they might require custom handling for throttles as this concept is specific to Azure Cosmos DB.
* **Size of data** : Most migration tools work very well for smaller datasets. When the data set exceeds a few hundred gigabytes, the choice of migration tools are limited. 
* **Expected migration duration** : Migrations can be configured to take place at a slow, incremental pace which consumes few RUs or can take advantage of the entirety of the throughput provisioned on the target Cosmos DB container and complete as soon as possible. 

## Azure Cosmos DB SQL API
|**Migration Type**|**Solution**|**Considerations**|
|---------|---------|---------|
|Offline|[Data Migration Tool](https://docs.microsoft.com/en-us/azure/cosmos-db/import-data)|&bull; Easy to setup and supports multiple sources <br/>&bull; Not suitable for large datasets|
|Offline|[Azure Data Factory](https://docs.microsoft.com/en-us/azure/data-factory/connector-azure-cosmos-db)|&bull; Easy to setup and supports multiple sources <br/>&bull; Makes use of the Azure Cosmos DB Bulk Executor library <br/>&bull; Suitable for large datasets <br/>&bull; Lack of checkpointing means that any issue during the course of migration would require a restart of the whole migration process<br/>&bull; Lack of a dead letter queue would mean that a few erroneous files could stop the entire migration process <br/>&bull; Needs custom code to increase read throughput for certain data sources|
|Offline|[Azure Cosmos DB Spark connector](https://docs.microsoft.com/en-us/azure/cosmos-db/spark-connector)|&bull; Makes use of the Azure Cosmos DB Bulk Executor library <br/>&bull; Suitable for large datasets <br/>&bull; Needs a custom Spark setup <br/>&bull; Spark is sensitive to schema inconsistencies and this can be a problem during migration |
|Offline|[Custom tool with Cosmos DB Bulk executor library](https://docs.microsoft.com/en-us/azure/cosmos-db/migrate-cosmosdb-data)|&bull; Provides checkpointing, dead-lettering capabilities which increases migration resiliency <br/>&bull; Suitable for very large datasets (10 TB+)  <br/>&bull; Requires custom setup of this tool running as an App Service |
|Online|[Cosmos DB Functions + ChangeFeed API](https://docs.microsoft.com/en-us/azure/cosmos-db/import-data)|&bull; Easy to setup and supports multiple sources <br/>&bull; Not suitable for large datasets|
