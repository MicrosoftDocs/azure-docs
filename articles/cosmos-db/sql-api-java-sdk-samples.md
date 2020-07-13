---

title: 'Azure Cosmos DB SQL API: Java SDK v4 examples'
description: Find Java examples on GitHub for common tasks using the Azure Cosmos DB SQL API, including CRUD operations.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: sample
ms.date: 05/20/2020
ms.author: anfeldma

---
# Azure Cosmos DB SQL API: Java SDK v4 examples

> [!div class="op_single_selector"]
> * [.NET V2 SDK Examples](sql-api-dotnet-samples.md)
> * [.NET V3 SDK Examples](sql-api-dotnet-v3sdk-samples.md)
> * [Java V4 SDK Examples](sql-api-java-sdk-samples.md)
> * [Node.js Examples](sql-api-nodejs-samples.md)
> * [Python Examples](sql-api-python-samples.md)
> * [Azure Code Sample Gallery](https://azure.microsoft.com/resources/samples/?sort=0&service=cosmos-db)
> 
> 

> [!IMPORTANT]  
> To learn more about Java SDK v4, please see the Azure Cosmos DB Java SDK v4 [Release notes](sql-api-sdk-java-v4.md), [Maven repository](https://mvnrepository.com/artifact/com.azure/azure-cosmos), Azure Cosmos DB Java SDK v4 [performance tips](performance-tips-java-sdk-v4-sql.md), and Azure Cosmos DB Java SDK v4 [troubleshooting guide](troubleshoot-java-sdk-v4-sql.md) for more information. If you are currently using an older version than v4, see the [Migrate to Azure Cosmos DB Java SDK v4](migrate-java-v4-sdk.md) guide for help upgrading to v4.
>

> [!IMPORTANT]  
>[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
>  
>- You can [activate Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio): Your Visual Studio subscription gives you credits every month that you can use for paid Azure services.
>
>[!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]
>

The latest sample applications that perform CRUD operations and other common operations on Azure Cosmos DB resources are included in the [azure-cosmos-java-sql-api-samples](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples) GitHub repository. This article provides:

* Links to the tasks in each of the example Java project files. 
* Links to the related API reference content.

**Prerequisites**

You need the following to run this sample application:

* Java Development Kit 8
* Azure Cosmos DB Java SDK v4

You can optionally use Maven to get the latest Azure Cosmos DB Java SDK v4 binaries for use in your project. Maven automatically adds any necessary dependencies. Otherwise, you can directly download the dependencies listed in the pom.xml file and add them to your build path.

```bash
<dependency>
	<groupId>com.azure</groupId>
	<artifactId>azure-cosmos</artifactId>
	<version>LATEST</version>
</dependency>
```

**Running the sample applications**

Clone the sample repo:
```bash
$ git clone https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples.git

$ cd azure-cosmos-java-sql-api-samples
```

You can run the samples using either an IDE (Eclipse, IntelliJ, or VSCODE) or from the command line using Maven.

These environment variables must be set

```
ACCOUNT_HOST=your account hostname;ACCOUNT_KEY=your account master key
```

in order to give the samples read/write access to your account.

To run a sample, specify its Main Class 

```
com.azure.cosmos.examples.sample.synchronicity.MainClass
```

where *sample.synchronicity.MainClass* can be
* crudquickstart.sync.SampleCRUDQuickstart
* crudquickstart.async.SampleCRUDQuickstartAsync
* indexmanagement.sync.SampleIndexManagement
* indexmanagement.async.SampleIndexManagementAsync
* storedprocedure.sync.SampleStoredProcedure
* storedprocedure.async.SampleStoredProcedureAsync
* changefeed.SampleChangeFeedProcessor *(Changefeed has only an async sample, no sync sample.)*
...etc...

> [!NOTE]
> Each sample is self-contained; it sets itself up and cleans up after itself. The samples issue multiple calls to create a `CosmosContainer`. Each time this is done, your subscription is billed for 1 hour of usage for the performance tier of the collection created. 
> 
> 

## Database examples
The [Database CRUD Samples](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/databasecrud/sync/DatabaseCRUDQuickstart.java) file shows how to perform the following tasks. To learn about the Azure Cosmos databases before running the following samples, see [Working with databases, containers, and items](databases-containers-items.md) conceptual article. 

| Task | API reference |
| --- | --- |
| [Create a database](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/databasecrud/sync/DatabaseCRUDQuickstart.java#L77-L85) | CosmosClient.createDatabaseIfNotExists |
| [Read a database by ID](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/databasecrud/sync/DatabaseCRUDQuickstart.java#L88-L95) | CosmosClient.getDatabase |
| [Read all the databases](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/databasecrud/sync/DatabaseCRUDQuickstart.java#L98-L112) | CosmosClient.readAllDatabases |
| [Delete a database](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/databasecrud/sync/DatabaseCRUDQuickstart.java#L115-L123) | CosmosDatabase.delete |

## Collection examples
The [Collection CRUD Samples](https://github.com/Azure/azure-documentdb-java/blob/master/documentdb-examples/src/test/java/com/microsoft/azure/documentdb/examples/CollectionCrudSamples.java) file shows how to perform the following tasks. To learn about the Azure Cosmos collections before running the following samples, see [Working with databases, containers, and items](databases-containers-items.md) conceptual article.

| Task | API reference |
| --- | --- |
| [Create a collection](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/containercrud/sync/ContainerCRUDQuickstart.java#L97-L112) | CosmosDatabase.createContainerIfNotExists |
| [Change configured performance of a collection](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/containercrud/sync/ContainerCRUDQuickstart.java#L115-L123) | CosmosContainer.replaceProvisionedThroughput |
| [Get a collection by ID](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/containercrud/sync/ContainerCRUDQuickstart.java#L126-L133) | CosmosDatabase.getContainer |
| [Read all the collections in a database](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/containercrud/sync/ContainerCRUDQuickstart.java#L136-L150) | CosmosDatabase.readAllContainers |
| [Delete a collection](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/containercrud/sync/ContainerCRUDQuickstart.java#L153-L161) | CosmosContainer.delete |

## Autoscale collection examples

To learn more about autoscale before running these samples, take a look at these instructions for enabling autoscale in your [account](https://azure.microsoft.com/resources/templates/101-cosmosdb-sql-autoscale/) and in your [databases and containers](https://docs.microsoft.com/azure/cosmos-db/provision-throughput-autoscale).

The [autoscale Database CRUD Samples](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/autoscaledatabasecrud/sync/AutoscaleDatabaseCRUDQuickstart.java) file shows how to perform the following tasks.

| Task | API reference |
| --- | --- |
| [Create a database with specified autoscale max throughput](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/autoscaledatabasecrud/sync/AutoscaleDatabaseCRUDQuickstart.java#L78-L89) | CosmosClient.createDatabase<br>ThroughputProperties.createAutoscaledThroughput |

The [autoscale Collection CRUD Samples](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/autoscalecontainercrud/sync/AutoscaleContainerCRUDQuickstart.java) file shows how to perform the following tasks. 

| Task | API reference |
| --- | --- |
| [Create a collection with specified autoscale max throughput](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/autoscalecontainercrud/sync/AutoscaleContainerCRUDQuickstart.java#L97-L110) | CosmosDatabase.createContainerIfNotExists |
| [Change configured autoscale max throughput of a collection](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/autoscalecontainercrud/sync/AutoscaleContainerCRUDQuickstart.java#L113-L120) | CosmosContainer.replaceThroughput |
| [Read autoscale throughput configuration of a collection](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/autoscalecontainercrud/sync/AutoscaleContainerCRUDQuickstart.java#L122-L133) | CosmosContainer.readThroughput |

## Analytical storage collection examples

The [Analytical storage Collection CRUD Samples](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/analyticalcontainercrud/sync/AnalyticalContainerCRUDQuickstart.java) file shows how to perform the following tasks. To learn about the Azure Cosmos collections before running the following samples, read about Azure Cosmos DB Synapse and Analytical Store.

| Task | API reference |
| --- | --- |
| [Create a collection](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/analyticalcontainercrud/sync/AnalyticalContainerCRUDQuickstart.java#L93-L108) | CosmosDatabase.createContainerIfNotExists |

## Document examples
The [Document CRUD Samples](https://github.com/Azure/azure-documentdb-java/blob/master/documentdb-examples/src/test/java/com/microsoft/azure/documentdb/examples/DocumentCrudSamples.java) file shows how to perform the following tasks. To learn about the Azure Cosmos documents before running the following samples, see [Working with databases, containers, and items](databases-containers-items.md) conceptual article.

| Task | API reference |
| --- | --- |
| [Create a document](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L133-L147) | CosmosContainer.createItem |
| [Read a document by ID](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L179-L193) | CosmosContainer.readItem |
| [Query for documents](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L162-L176) | CosmosContainer.queryItems |
| [Replace a document](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L195-L210) | CosmosContainer.replaceItem |
| [Upsert a document](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L212-L2225) | CosmosContainer.upsertItem |
| [Delete a document](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L303-L310) | CosmosContainer.deleteItem |
| [Replace a document with conditional ETag check](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L227-L264) | AccessCondition.setType<br>AccessCondition.setCondition |
| [Read document only if document has changed](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L266-L300) | AccessCondition.setType<br>AccessCondition.setCondition |

## Indexing examples
The [Collection CRUD Samples](https://github.com/Azure/azure-documentdb-java/blob/master/documentdb-examples/src/test/java/com/microsoft/azure/documentdb/examples/CollectionCrudSamples.java) file shows how to perform the following tasks. To learn about indexing in Azure Cosmos DB before running the following samples, see [indexing policies](index-policy.md), [indexing types](index-types.md), and [indexing paths](index-paths.md) conceptual articles. 

| Task | API reference |
| --- | --- |
| Exclude a document from the index | ExcludedIndex<br>IndexingPolicy |
| Use Lazy Indexing | IndexingPolicy.IndexingMode |
| [Include specified documents paths in the index](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/indexmanagement/sync/SampleIndexManagement.java#L145-L148) | IndexingPolicy.IncludedPaths |
| [Exclude specified documents paths from the index](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/indexmanagement/sync/SampleIndexManagement.java#L150-L153) | IndexingPolicy.ExcludedPaths |
| [Create a composite index](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/indexmanagement/sync/SampleIndexManagement.java#L171-L186) | IndexingPolicy.setCompositeIndexes<br>CompositePath |
| Force a range scan operation on a hash indexed path | FeedOptions.EnableScanInQuery |
| Use range indexes on Strings | IndexingPolicy.IncludedPaths<br>RangeIndex |
| Perform an index transform | - |
| [Create a geospatial index](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/indexmanagement/sync/SampleIndexManagement.java#L157-L166) | IndexingPolicy.setSpatialIndexes<br>SpatialSpec<br>SpatialType |

For more information about indexing, see [Azure Cosmos DB indexing policies](index-policy.md).

## Query examples
The [Query Samples](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java) file shows how to do the following tasks using the SQL query grammar. To learn about the SQL query reference in Azure Cosmos DB before you run the following samples, see [SQL query examples for Azure Cosmos DB](how-to-sql-query.md). 

| Task | API reference |
| --- | --- |
| [Query for all documents](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L210-L214) | CosmosContainer.queryItems |
| [Query for equality using ==](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L291-L295) | CosmosContainer.queryItems |
| [Query for inequality using != and NOT](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L297-L305) | CosmosContainer.queryItems |
| [Query using range operators like >, <, >=, <=](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L307-L312) | CosmosContainer.queryItems |
| [Query using range operators against strings](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L314-L319) | CosmosContainer.queryItems |
| [Query with ORDER BY](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L321-L326) | CosmosContainer.queryItems |
| [Query with DISTINCT](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L328-L333) | CosmosContainer.queryItems |
| [Query with aggregate functions](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L335-L343) | CosmosContainer.queryItems |
| [Work with subdocuments](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L345-L353) | CosmosContainer.queryItems |
| [Query with intra-document Joins](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L355-L377) | CosmosContainer.queryItems |
| [Query with string, math, and array operators](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L379-L390) | CosmosContainer.queryItems |
| [Query with parameterized SQL using SqlQuerySpec](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L392-L421) |CosmosContainer.queryItems |
| [Query with explicit paging](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L216-L266) | CosmosContainer.queryItems |
| [Query partitioned collections in parallel](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L268-L289) | CosmosContainer.queryItems |
| Query with ORDER BY for partitioned collections | CosmosContainer.queryItems |

## Change feed examples 
The [Change Feed Processor Sample](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java) file shows how to do the following tasks. To learn about change feed in Azure Cosmos DB before you run the following samples, see [Read Azure Cosmos DB change feed](read-change-feed.md) and [Change feed processor](change-feed-processor.md).

| Task | API reference |
| --- | --- |
| [Basic change feed functionality](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java#L124-L154) |ChangeFeedProcessor.changeFeedProcessorBuilder |
| Read change feed from a specific time | ChangeFeedProcessor.changeFeedProcessorBuilder |
| [Read change feed from the beginning](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java#L124-L154) | - |

## Server-side programming examples

The [Stored Procedure Sample](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/storedprocedure/sync/SampleStoredProcedure.java) file shows how to do the following tasks. To learn about server-side programming in Azure Cosmos DB before you run the following samples, see [Stored procedures, triggers, and user-defined functions](stored-procedures-triggers-udfs.md).

| Task | API reference |
| --- | --- |
| [Create a stored procedure](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/storedprocedure/sync/SampleStoredProcedure.java#L132-L151) | CosmosScripts.createStoredProcedure |
| [Execute a stored procedure](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/storedprocedure/sync/SampleStoredProcedure.java#L167-L181) | CosmosStoredProcedure.execute |
| [Delete a stored procedure](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/master/src/main/java/com/azure/cosmos/examples/storedprocedure/sync/SampleStoredProcedure.java#L183-L193) | CosmosStoredProcedure.delete |

## User management examples
The User Management Sample file shows how to do the following tasks:

| Task | API reference |
| --- | --- |
| Create a user | - |
| Set permissions on a collection or document | - |
| Get a list of a user's permissions |- |