---
title: Azure Cosmos DB Migration options
description: This doc describes the various options to migrate your on-premises or cloud data to Azure Cosmos DB
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 04/02/2022
---
# Options to migrate your on-premises or cloud data to Azure Cosmos DB
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

You can load data from various data sources to Azure Cosmos DB. Since Azure Cosmos DB supports multiple APIs, the targets can be any of the existing APIs. The following are some scenarios where you migrate data to Azure Cosmos DB:

* Move data from one Azure Cosmos DB container to another container within the Azure Cosmos DB account (could be in the same database or a different database). 
* Move data from one Azure Cosmos DB account to another Azure Cosmos DB account (could be in the same region or a different region, same subscription or a different one).
* Move data from a source such as Azure blob storage, a JSON file, Oracle database, Couchbase, DynamoDB to Azure Cosmos DB.

In order to support migration paths from the various sources to the different Azure Cosmos DB APIs, there are multiple solutions that provide specialized handling for each migration path. This document lists the available solutions and describes their advantages and limitations.

## Factors affecting the choice of migration tool

The following factors determine the choice of the migration tool:

* **Online vs offline migration**: Many migration tools provide a path to do a one-time migration only. This means that the applications accessing the database might experience a period of downtime. Some migration solutions provide a way to do a live migration where there's a replication pipeline set up between the source and the target.

* **Data source**: The existing data can be in various data sources like Oracle DB2, Datastax Cassanda, Azure SQL Database, PostgreSQL, etc. The data can also be in an existing Azure Cosmos DB account and the intent of migration can be to change the data model or repartition the data in a container with a different partition key.

* **Azure Cosmos DB API**: For the API for NoSQL in Azure Cosmos DB, there are a variety of tools developed by the Azure Cosmos DB team which aid in the different migration scenarios. All of the other APIs have their own specialized set of tools developed and maintained by the community. Since Azure Cosmos DB supports these APIs at a wire protocol level, these tools should work as-is while migrating data into Azure Cosmos DB too. However, they might require custom handling for throttles as this concept is specific to Azure Cosmos DB.

* **Size of data**: Most migration tools work very well for smaller datasets. When the data set exceeds a few hundred gigabytes, the choices of migration tools are limited. 

* **Expected migration duration**: Migrations can be configured to take place at a slow, incremental pace that consumes less throughput or can consume the entire throughput provisioned on the target Azure Cosmos DB container and complete the migration in less time.

## Azure Cosmos DB API for NoSQL

If you need help with capacity planning, consider reading our [guide to estimating RU/s using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md). 
* If you're migrating from a vCores- or server-based platform and you need guidance on estimating request units, consider reading our [guide to estimating RU/s based on vCores](estimate-ru-with-capacity-planner.md).

|Migration type|Solution|Supported sources|Supported targets|Considerations|
|---------|---------|---------|---------|---------|
|Offline|[Intra-account container copy](intra-account-container-copy.md)|Azure Cosmos DB for NoSQL|Azure Cosmos DB for NoSQL|&bull; CLI-based; No set up needed. <br/>&bull; Supports large datasets.|
|Offline|[Azure Cosmos DB desktop data migration tool](how-to-migrate-desktop-tool.md)|&bull;Azure Cosmos DB for NoSQL<br/>&bull;Azure Cosmos DB for MongoDB<br/>&bull;Azure Cosmos DB for Table<br/>&bull;Azure Table storage<br/>&bull;JSON Files<br/>&bull;MongoDB<br/>&bull;SQL Server<br/>|&bull;Azure Cosmos DB for NoSQL<br/>&bull;Azure Cosmos DB for MongoDB<br/>&bull;Azure Cosmos DB for Table<br/>&bull;Azure Table storage<br/>&bull;JSON Files<br/>&bull;MongoDB<br/>&bull;SQL Server<br/>|&bull; Command-line tool<br/>&bull; Open-source|
|Offline|[Azure Data Factory](../data-factory/connector-azure-cosmos-db.md)| &bull;JSON/CSV Files<br/>&bull;Azure Cosmos DB for NoSQL<br/>&bull;Azure Cosmos DB for MongoDB<br/>&bull;MongoDB <br/>&bull;SQL Server<br/>&bull;Table Storage<br/>&bull;Azure Blob Storage <br/> <br/>See the [Azure Data Factory](../data-factory/connector-overview.md) article for other supported sources.|&bull;Azure Cosmos DB for NoSQL<br/>&bull;Azure Cosmos DB for MongoDB<br/>&bull;JSON Files <br/><br/> See the [Azure Data Factory](../data-factory/connector-overview.md) article for other supported targets. |&bull; Easy to set up and supports multiple sources.<br/>&bull; Makes use of the Azure Cosmos DB bulk executor library. <br/>&bull; Suitable for large datasets. <br/>&bull; Lack of checkpointing - It means that if an issue occurs during the course of migration, you need to restart the whole migration process.<br/>&bull; Lack of a dead letter queue - It means that a few erroneous files can stop the entire migration process.|
|Offline|[Azure Cosmos DB Spark connector](./nosql/quickstart-spark.md)|Azure Cosmos DB for NoSQL. <br/><br/>You can use other sources with additional connectors from the Spark ecosystem.| Azure Cosmos DB for NoSQL. <br/><br/>You can use other targets with additional connectors from the Spark ecosystem.| &bull; Makes use of the Azure Cosmos DB bulk executor library. <br/>&bull; Suitable for large datasets. <br/>&bull; Needs a custom Spark setup. <br/>&bull; Spark is sensitive to schema inconsistencies and this can be a problem during migration. |
|Online|[Azure Cosmos DB Spark connector + Change Feed sample](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/cosmos/azure-cosmos-spark_3_2-12/Samples/DatabricksLiveContainerMigration)|Azure Cosmos DB for NoSQL. <br/><br/>Uses Azure Cosmos DB Change Feed to stream all historic data as well as live updates.| Azure Cosmos DB for NoSQL. <br/><br/>You can use other targets with additional connectors from the Spark ecosystem.| &bull; Makes use of the Azure Cosmos DB bulk executor library. <br/>&bull; Suitable for large datasets. <br/>&bull; Needs a custom Spark setup. <br/>&bull; Spark is sensitive to schema inconsistencies and this can be a problem during migration. |
|Offline|[Custom tool with Azure Cosmos DB bulk executor library](migrate.md)| The source depends on your custom code | Azure Cosmos DB for NoSQL| &bull; Provides checkpointing, dead-lettering capabilities which increases migration resiliency. <br/>&bull; Suitable for very large datasets (10 TB+).  <br/>&bull; Requires custom setup of this tool running as an App Service. |
|Online|[Azure Cosmos DB Functions + ChangeFeed API](change-feed-functions.md)| Azure Cosmos DB for NoSQL | Azure Cosmos DB for NoSQL| &bull; Easy to set up. <br/>&bull; Works only if the source is an Azure Cosmos DB container. <br/>&bull; Not suitable for large datasets. <br/>&bull; Doesn't capture deletes from the source container. |
|Online|[Striim](cosmosdb-sql-api-migrate-data-striim.md)| &bull;Oracle <br/>&bull;Apache Cassandra<br/><br/> See the [Striim website](https://www.striim.com/sources-and-targets/) for other supported sources. |&bull;Azure Cosmos DB for NoSQL <br/>&bull; Azure Cosmos DB for Cassandra<br/><br/> See the [Striim website](https://www.striim.com/sources-and-targets/) for other supported targets. | &bull; Works with a large variety of sources like Oracle, DB2, SQL Server.<br/>&bull; Easy to build ETL pipelines and provides a dashboard for monitoring. <br/>&bull; Supports larger datasets. <br/>&bull; Since this is a third-party tool, it needs to be purchased from the marketplace and installed in the user's environment.|

## Azure Cosmos DB API for MongoDB

Follow the [pre-migration guide](mongodb/pre-migration-steps.md) to plan your migration. 
* If you need help with capacity planning, consider reading our [guide to estimating RU/s using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md). 
* If you're migrating from a vCores- or server-based platform and you need guidance on estimating request units, consider reading our [guide to estimating RU/s based on vCores](convert-vcore-to-request-unit.md).

When you're ready to migrate, you can find detailed guidance on migration tools below
* [Offline migration using Intra-account container copy](intra-account-container-copy.md)
* [Offline migration using MongoDB native tools](mongodb/tutorial-mongotools-cosmos-db.md)
* [Offline migration using Azure database migration service (DMS)](../dms/tutorial-mongodb-cosmos-db.md)
* [Online migration using Azure database migration service (DMS)](../dms/tutorial-mongodb-cosmos-db-online.md)
* [Offline/online migration using Azure Databricks and Spark](mongodb/migrate-databricks.md)

Then, follow our [post-migration guide](mongodb/post-migration-optimization.md) to optimize your Azure Cosmos DB data estate once you've migrated.

A summary of migration pathways from your current solution to Azure Cosmso DB for MongoDB is provided below:

|Migration type|Solution|Supported sources|Supported targets|Considerations|
|---------|---------|---------|---------|---------|
|Offline|[Intra-account container copy](intra-account-container-copy.md)|Azure Cosmos DB for MongoDB|Azure Cosmos DB for MongoDB|&bull; Command-line tool; No set up needed.<br/>&bull; Suitable for large datasets|
|Offline|[Azure Cosmos DB desktop data migration tool](how-to-migrate-desktop-tool.md)|&bull;Azure Cosmos DB for NoSQL<br/>&bull;Azure Cosmos DB for MongoDB<br/>&bull;Azure Cosmos DB for Table<br/>&bull;Azure Table storage<br/>&bull;JSON Files<br/>&bull;MongoDB<br/>&bull;SQL Server<br/>|&bull;Azure Cosmos DB for NoSQL<br/>&bull;Azure Cosmos DB for MongoDB<br/>&bull;Azure Cosmos DB for Table<br/>&bull;Azure Table storage<br/>&bull;JSON Files<br/>&bull;MongoDB<br/>&bull;SQL Server<br/>|&bull; Command-line tool<br/>&bull; Open-source|
|Online|[Azure Database Migration Service](../dms/tutorial-mongodb-cosmos-db-online.md)| MongoDB|Azure Cosmos DB for MongoDB |&bull; Makes use of the Azure Cosmos DB bulk executor library. <br/>&bull; Suitable for large datasets and takes care of replicating live changes. <br/>&bull; Works only with other MongoDB sources.|
|Offline|[Azure Database Migration Service](../dms/tutorial-mongodb-cosmos-db.md)| MongoDB| Azure Cosmos DB for MongoDB| &bull; Makes use of the Azure Cosmos DB bulk executor library. <br/>&bull; Suitable for large datasets and takes care of replicating live changes. <br/>&bull; Works only with other MongoDB sources.|
|Offline|[Azure Data Factory](../data-factory/connector-azure-cosmos-db-mongodb-api.md)| &bull;JSON/CSV Files<br/>&bull;Azure Cosmos DB for NoSQL<br/>&bull;Azure Cosmos DB for MongoDB <br/>&bull;MongoDB<br/>&bull;SQL Server<br/>&bull;Table Storage<br/>&bull;Azure Blob Storage <br/><br/> See the [Azure Data Factory](../data-factory/connector-overview.md) article for other supported sources. | &bull;Azure Cosmos DB for NoSQL<br/>&bull;Azure Cosmos DB for MongoDB <br/>&bull; JSON files <br/><br/> See the [Azure Data Factory](../data-factory/connector-overview.md) article for other supported targets.| &bull; Easy to set up and supports multiple sources. <br/>&bull; Makes use of the Azure Cosmos DB bulk executor library. <br/>&bull; Suitable for large datasets. <br/>&bull; Lack of checkpointing means that any issue during the course of migration would require a restart of the whole migration process.<br/>&bull; Lack of a dead letter queue would mean that a few erroneous files could stop the entire migration process. <br/>&bull; Needs custom code to increase read throughput for certain data sources.|
|Offline|Existing Mongo Tools ([mongodump](mongodb/tutorial-mongotools-cosmos-db.md#mongodumpmongorestore), [mongorestore](mongodb/tutorial-mongotools-cosmos-db.md#mongodumpmongorestore), [Studio3T](mongodb/connect-using-mongochef.md))|&bull;MongoDB<br/>&bull;Azure Cosmos DB for MongoDB<br/> | Azure Cosmos DB for MongoDB| &bull; Easy to set up and integration. <br/>&bull; Needs custom handling for throttles.|

## Azure Cosmos DB API for Cassandra

If you need help with capacity planning, consider reading our [guide to estimating RU/s using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md). 

|Migration type|Solution|Supported sources|Supported targets|Considerations|
|---------|---------|---------|---------|---------|
|Offline|[Intra-account container copy](intra-account-container-copy.md)|Azure Cosmos DB API for Cassandra | Azure Cosmos DB API for Cassandra| &bull; CLI-based; No set up needed. <br/>&bull; Supports large datasets.|
|Offline|[cqlsh COPY command](cassandra/migrate-data.md#migrate-data-by-using-the-cqlsh-copy-command)|CSV Files | Azure Cosmos DB API for Cassandra| &bull; Easy to set up. <br/>&bull; Not suitable for large datasets. <br/>&bull; Works only when the source is a Cassandra table.|
|Offline|[Copy table with Spark](cassandra/migrate-data.md#migrate-data-by-using-spark) | &bull;Apache Cassandra<br/> | Azure Cosmos DB API for Cassandra | &bull; Can make use of Spark capabilities to parallelize transformation and ingestion. <br/>&bull; Needs configuration with a custom retry policy to handle throttles.|
|Online|[Dual-write proxy + Spark](cassandra/migrate-data-dual-write-proxy.md)| &bull;Apache Cassandra<br/>|&bull;Azure Cosmos DB API for Cassandra <br/>| &bull; Supports larger datasets, but careful attention required for setup and validation. <br/>&bull; Open-source tools, no purchase required.|
|Online|[Striim (from Oracle DB/Apache Cassandra)](cassandra/migrate-data-striim.md)| &bull;Oracle<br/>&bull;Apache Cassandra<br/><br/> See the [Striim website](https://www.striim.com/sources-and-targets/) for other supported sources.|&bull;Azure Cosmos DB API for NoSQL<br/>&bull;Azure Cosmos DB API for Cassandra <br/><br/> See the [Striim website](https://www.striim.com/sources-and-targets/) for other supported targets.| &bull; Works with a large variety of sources like Oracle, DB2, SQL Server. <br/>&bull; Easy to build ETL pipelines and provides a dashboard for monitoring. <br/>&bull; Supports larger datasets. <br/>&bull; Since this is a third-party tool, it needs to be purchased from the marketplace and installed in the user's environment.|
|Online|[Arcion (from Oracle DB/Apache Cassandra)](cassandra/oracle-migrate-cosmos-db-arcion.md)|&bull;Oracle<br/>&bull;Apache Cassandra<br/><br/>See the [Arcion website](https://www.arcion.io/) for other supported sources. |Azure Cosmos DB API for Cassandra. <br/><br/>See the [Arcion website](https://www.arcion.io/) for other supported targets. | &bull; Supports larger datasets. <br/>&bull; Since this is a third-party tool, it needs to be purchased from the marketplace and installed in the user's environment.|

## Other APIs

For APIs other than the API for NoSQL, API for MongoDB and the API for Cassandra, there are various tools supported by each of the API's existing ecosystems. 

### API for Gremlin

* [Graph bulk executor library](gremlin/bulk-executor-dotnet.md)
* [Gremlin Spark](https://github.com/Azure/azure-cosmosdb-spark/blob/2.4/samples/graphframes/main.scala) 

### API for Table

* [Azure Cosmos DB desktop data migration tool](how-to-migrate-desktop-tool.md)

## Next steps

* Trying to do capacity planning for a migration to Azure Cosmos DB?
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
* Learn more by trying out the sample applications consuming the bulk executor library in [.NET](nosql/bulk-executor-dotnet.md) and [Java](bulk-executor-java.md). 
* The bulk executor library is integrated into the Azure Cosmos DB Spark connector, to learn more, see [Azure Cosmos DB Spark connector](./nosql/quickstart-spark.md) article.  
* Contact the Azure Cosmos DB product team by opening  a support ticket under the "General Advisory" problem type and "Large (TB+) migrations" problem subtype for additional help with large scale migrations.
