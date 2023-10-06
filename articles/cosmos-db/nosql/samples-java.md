---

title: 'Azure Cosmos DB for NoSQL: Java SDK v4 examples'
description: Find Java examples on GitHub for common tasks using the Azure Cosmos DB for NoSQL, including CRUD operations.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: sample
ms.date: 08/26/2021
ms.devlang: java
ms.custom: devx-track-java, ignite-2022, devx-track-extended-java
ms.author: sidandrews
ms.reviewer: mjbrown
---
# Azure Cosmos DB for NoSQL: Java SDK v4 examples
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!div class="op_single_selector"]
> * [.NET SDK Examples](samples-dotnet.md)
> * [Java V4 SDK Examples](samples-java.md)
> * [Spring Data V3 SDK Examples](samples-java-spring-data.md)
> * [Node.js Examples](samples-nodejs.md)
> * [Python Examples](samples-python.md)
> * [Azure Code Sample Gallery](https://azure.microsoft.com/resources/samples/?sort=0&service=cosmos-db)
> 
> 

> [!IMPORTANT]  
> To learn more about Java SDK v4, please see the Azure Cosmos DB Java SDK v4 [Release notes](sdk-java-v4.md), [Maven repository](https://mvnrepository.com/artifact/com.azure/azure-cosmos), Azure Cosmos DB Java SDK v4 [performance tips](performance-tips-java-sdk-v4.md), and Azure Cosmos DB Java SDK v4 [troubleshooting guide](troubleshoot-java-sdk-v4.md) for more information. If you are currently using an older version than v4, see the [Migrate to Azure Cosmos DB Java SDK v4](migrate-java-v4-sdk.md) guide for help upgrading to v4.
>

> [!IMPORTANT]  
>[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
>  
>- You can [activate Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio): Your Visual Studio subscription gives you credits every month that you can use for paid Azure services.
>
>[!INCLUDE [cosmos-db-emulator-docdb-api](../includes/cosmos-db-emulator-docdb-api.md)]
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
ACCOUNT_HOST=your account hostname;ACCOUNT_KEY=your account primary key
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
> Each sample is self-contained; it sets itself up and cleans up after itself. The samples issue multiple calls to create a `CosmosContainer` or `CosmosAsyncContainer`. Each time this is done, your subscription is billed for 1 hour of usage for the performance tier of the collection created. 
> 
> 

## Database examples
The Database CRUD Sample files for [sync](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/databasecrud/sync/DatabaseCRUDQuickstart.java) and [async](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/databasecrud/async/DatabaseCRUDQuickstartAsync.java) show how to perform the following tasks. To learn about the Azure Cosmos DB databases before running the following samples, see [Working with databases, containers, and items](../resource-model.md) conceptual article. 

| Task | API reference |
| --- | --- |
| Create a database | [CosmosClient.createDatabaseIfNotExists](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/databasecrud/sync/DatabaseCRUDQuickstart.java#L76-L84) <br> [CosmosAsyncClient.createDatabaseIfNotExists](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/databasecrud/async/DatabaseCRUDQuickstartAsync.java#L80-L89) |
| Read a database by ID | [CosmosClient.getDatabase](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/databasecrud/sync/DatabaseCRUDQuickstart.java#L87-L94) <br> [CosmosAsyncClient.getDatabase](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/databasecrud/async/DatabaseCRUDQuickstartAsync.java#L92-L99) |
| Read all the databases | [CosmosClient.readAllDatabases](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/databasecrud/sync/DatabaseCRUDQuickstart.java#L97-L111) <br> [CosmosAsyncClient.readAllDatabases](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/databasecrud/async/DatabaseCRUDQuickstartAsync.java#L102-L124) |
| Delete a database | [CosmosDatabase.delete](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/databasecrud/sync/DatabaseCRUDQuickstart.java#L114-L122)  <br> [CosmosAsyncDatabase.delete](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/databasecrud/async/DatabaseCRUDQuickstartAsync.java#L127-L135)  |

## Collection examples
The Collection CRUD Samples files for [sync](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/containercrud/sync/ContainerCRUDQuickstart.java) and [async](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/containercrud/async/ContainerCRUDQuickstartAsync.java) show how to perform the following tasks. To learn about the Azure Cosmos DB collections before running the following samples, see [Working with databases, containers, and items](../resource-model.md) conceptual article.

| Task | API reference |
| --- | --- |
| Create a collection | [CosmosDatabase.createContainerIfNotExists](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/containercrud/sync/ContainerCRUDQuickstart.java#L92-L107) <br> [CosmosAsyncDatabase.createContainerIfNotExists](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/containercrud/async/ContainerCRUDQuickstartAsync.java#L96-L111) |
| Change configured performance of a collection | [CosmosContainer.replaceThroughput](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/containercrud/sync/ContainerCRUDQuickstart.java#L110-L118) <br> [CosmosAsyncContainer.replaceProvisionedThroughput](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/containercrud/async/ContainerCRUDQuickstartAsync.java#L114-L122) |
| Get a collection by ID | [CosmosDatabase.getContainer](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/containercrud/sync/ContainerCRUDQuickstart.java#L121-L128) <br> [CosmosAsyncDatabase.getContainer](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/containercrud/async/ContainerCRUDQuickstartAsync.java#L125-L132) |
| Read all the collections in a database | [CosmosDatabase.readAllContainers](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/containercrud/sync/ContainerCRUDQuickstart.java#L131-L145) <br> [CosmosAsyncDatabase.readAllContainers](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/containercrud/async/ContainerCRUDQuickstartAsync.java#L135-L158) |
| Delete a collection | [CosmosContainer.delete](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/containercrud/sync/ContainerCRUDQuickstart.java#L148-L156) <br> [CosmosAsyncContainer.delete](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/containercrud/async/ContainerCRUDQuickstartAsync.java#L161-L169) |

## Autoscale collection examples

To learn more about autoscale before running these samples, take a look at these instructions for enabling autoscale in your [account](https://azure.microsoft.com/resources/templates/cosmosdb-sql-autoscale/) and in your [databases and containers](../provision-throughput-autoscale.md).

The autoscale database sample files for [sync](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/autoscaledatabasecrud/sync/AutoscaleDatabaseCRUDQuickstart.java) and [async](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/autoscaledatabasecrud/async/AutoscaleDatabaseCRUDQuickstartAsync.java) show how to perform the following task.

| Task | API reference |
| --- | --- |
| Create a database with specified autoscale max throughput | [CosmosClient.createDatabase](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/autoscaledatabasecrud/sync/AutoscaleDatabaseCRUDQuickstart.java#L77-L88) <br> [CosmosAsyncClient.createDatabase](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/autoscaledatabasecrud/async/AutoscaleDatabaseCRUDQuickstartAsync.java#L81-L94) |


The autoscale collection samples files for [sync](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/autoscalecontainercrud/sync/AutoscaleContainerCRUDQuickstart.java) and [async](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/autoscalecontainercrud/async/AutoscaleContainerCRUDQuickstartAsync.java) show how to perform the following tasks. 

| Task | API reference |
| --- | --- |
| Create a collection with specified autoscale max throughput | [CosmosDatabase.createContainerIfNotExists](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/autoscalecontainercrud/sync/AutoscaleContainerCRUDQuickstart.java#L97-L110) <br> [CosmosAsyncDatabase.createContainerIfNotExists](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/autoscalecontainercrud/async/AutoscaleContainerCRUDQuickstartAsync.java#L101-L114) |
| Change configured autoscale max throughput of a collection | [CosmosContainer.replaceThroughput](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/autoscalecontainercrud/sync/AutoscaleContainerCRUDQuickstart.java#L113-L120) <br> [CosmosAsyncContainer.replaceThroughput](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/autoscalecontainercrud/async/AutoscaleContainerCRUDQuickstartAsync.java#L117-L124) |
| Read autoscale throughput configuration of a collection | [CosmosContainer.readThroughput](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/autoscalecontainercrud/sync/AutoscaleContainerCRUDQuickstart.java#L122-L133) <br> [CosmosAsyncContainer.readThroughput](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/autoscalecontainercrud/async/AutoscaleContainerCRUDQuickstartAsync.java#L126-L137) |

## Analytical storage collection examples

The Analytical storage Collection CRUD Samples files for [sync](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/analyticalcontainercrud/sync/AnalyticalContainerCRUDQuickstart.java) and [async](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/analyticalcontainercrud/async/AnalyticalContainerCRUDQuickstartAsync.java) show how to perform the following tasks. To learn about the Azure Cosmos DB collections before running the following samples, read about Azure Cosmos DB Synapse and Analytical Store.

| Task | API reference | 
| --- | --- | 
| Create a collection | [CosmosDatabase.createContainerIfNotExists](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/analyticalcontainercrud/sync/AnalyticalContainerCRUDQuickstart.java#L91-L106) <br> [CosmosAsyncDatabase.createContainerIfNotExists](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/analyticalcontainercrud/async/AnalyticalContainerCRUDQuickstartAsync.java#L91-L106) |

## Item examples
The Document CRUD Samples files for [sync](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java) and [async](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/documentcrud/async/DocumentCRUDQuickstartAsync.java) show how to perform the following tasks. To learn about the Azure Cosmos DB documents before running the following samples, see [Working with databases, containers, and items](../resource-model.md) conceptual article.

> [!NOTE]
> You must specify a partition key when performing operations against a specific item.

| Task | API reference |
| --- | --- |
| Create a document | [CosmosContainer.createItem](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L132-L146) <br> [CosmosAsyncContainer.createItem](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/documentcrud/async/DocumentCRUDQuickstartAsync.java#L188-L212) |
| Read a document by ID | [CosmosContainer.readItem](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L177-L192) <br> [CosmosAsyncContainer.readItem](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/documentcrud/async/DocumentCRUDQuickstartAsync.java#L318-L340) |
| Query for documents | [CosmosContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L161-L175) <br> [CosmosAsyncContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/documentcrud/async/DocumentCRUDQuickstartAsync.java#L270-L287) |
| Replace a document | [CosmosContainer.replaceItem](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L177-L192) <br> [CosmosAsyncContainer.replaceItem](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/documentcrud/async/DocumentCRUDQuickstartAsync.java#L318-L340) |
| Upsert a document | [CosmosContainer.upsertItem](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L194-L207) <br> [CosmosAsyncContainer.upsertItem](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/documentcrud/async/DocumentCRUDQuickstartAsync.java#L342-L364) |
| Delete a document | [CosmosContainer.deleteItem](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L285-L292) <br> [CosmosAsyncContainer.deleteItem](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/documentcrud/async/DocumentCRUDQuickstartAsync.java#L494-L510) |
| Replace a document with conditional ETag check | [CosmosItemRequestOptions.setIfMatchETag](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L209-L246) (sync) <br>[CosmosItemRequestOptions.setIfMatchETag](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/documentcrud/async/DocumentCRUDQuickstartAsync.java#L366-L418) (async) |
| Read document only if document has changed | [CosmosItemRequestOptions.setIfNoneMatchETag](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/documentcrud/sync/DocumentCRUDQuickstart.java#L248-L282) (sync) <br>[CosmosItemRequestOptions.setIfNoneMatchETag](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/documentcrud/async/DocumentCRUDQuickstartAsync.java#L420-L491) (async)|
| Partial document update | [CosmosContainer.patchItem](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/patch/sync/SamplePatchQuickstart.java) |
| Bulk document update | [Bulk samples](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/bulk/async/SampleBulkQuickStartAsync.java) |
| Transactional batch | [batch samples](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/batch/async/SampleBatchQuickStartAsync.java) |

## Indexing examples
The [Collection CRUD Samples](https://github.com/Azure/azure-documentdb-java/blob/master/documentdb-examples/src/test/java/com/microsoft/azure/documentdb/examples/CollectionCrudSamples.java) file shows how to perform the following tasks. To learn about indexing in Azure Cosmos DB before running the following samples, see [indexing policies](../index-policy.md), [indexing types](../index-overview.md#types-of-indexes), and [indexing paths](../index-policy.md#include-exclude-paths) conceptual articles. 

| Task | API reference |
| --- | --- |
| Include specified documents paths in the index | [IndexingPolicy.IncludedPaths](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/indexmanagement/sync/SampleIndexManagement.java#L143-L146) |
| Exclude specified documents paths from the index | [IndexingPolicy.ExcludedPaths](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/indexmanagement/sync/SampleIndexManagement.java#L148-L151) |
| Create a composite index | [IndexingPolicy.setCompositeIndexes](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/indexmanagement/sync/SampleIndexManagement.java#L167-L184) <br> CompositePath |
| Create a geospatial index | [IndexingPolicy.setSpatialIndexes](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/indexmanagement/sync/SampleIndexManagement.java#L153-L165) <br> SpatialSpec <br> SpatialType |
<!-- | Exclude a document from the index | ExcludedIndex<br>IndexingPolicy | -->
<!-- | Use Lazy Indexing | IndexingPolicy.IndexingMode | -->
<!-- | Force a range scan operation on a hash indexed path | FeedOptions.EnableScanInQuery | -->
<!-- | Use range indexes on Strings | IndexingPolicy.IncludedPaths<br>RangeIndex | -->
<!-- | Perform an index transform | - | -->


For more information about indexing, see [Azure Cosmos DB indexing policies](../index-policy.md).

## Query examples
The Query Samples files for [sync](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java) and [async](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/async/QueriesQuickstartAsync.java) show how to do the following tasks using the SQL query grammar. To learn about the SQL query reference in Azure Cosmos DB before you run the following samples, see [SQL query examples for Azure Cosmos DB](query/getting-started.md). 

| Task | API reference |
| --- | --- |
| Query for all documents | [CosmosContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L204-L208) <br> [CosmosAsyncContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/queries/async/QueriesQuickstartAsync.java#L244-L247)|
| Query for equality using == | [CosmosContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L286-L290) <br> [CosmosAsyncContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/queries/async/QueriesQuickstartAsync.java#L325-L329)|
| Query for inequality using != and NOT | [CosmosContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L292-L300) <br> [CosmosAsyncContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/queries/async/QueriesQuickstartAsync.java#L331-L339)|
| Query using range operators like >, <, >=, <= | [CosmosContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L302-L307) <br> [CosmosAsyncContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/queries/async/QueriesQuickstartAsync.java#L341-L346)|
| Query using range operators against strings | [CosmosContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L309-L314) <br> [CosmosAsyncContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/queries/async/QueriesQuickstartAsync.java#L348-L353)|
| Query with ORDER BY | [CosmosContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L316-L321) <br> [CosmosAsyncContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/queries/async/QueriesQuickstartAsync.java#L355-L360)|
| Query with DISTINCT | [CosmosContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L323-L328) <br> [CosmosAsyncContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/queries/async/QueriesQuickstartAsync.java#L362-L367)|
| Query with aggregate functions | [CosmosContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L330-L338) <br> [CosmosAsyncContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/queries/async/QueriesQuickstartAsync.java#L369-L377)|
| Work with subdocuments | [CosmosContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L340-L348) <br> [CosmosAsyncContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/queries/async/QueriesQuickstartAsync.java#L379-L387)|
| Query with intra-document Joins | [CosmosContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L350-L372) <br> [CosmosAsyncContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/queries/async/QueriesQuickstartAsync.java#L389-L411)|
| Query with string, math, and array operators | [CosmosContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L374-L385) <br> [CosmosAsyncContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/queries/async/QueriesQuickstartAsync.java#L413-L424)|
| Query with parameterized SQL using SqlQuerySpec | [CosmosContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L387-L416) <br> [CosmosAsyncContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/queries/async/QueriesQuickstartAsync.java#L426-L455)|
| Query with explicit paging | [CosmosContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L211-L261) <br>  [CosmosAsyncContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/queries/async/QueriesQuickstartAsync.java#L250-L300)|
| Query partitioned collections in parallel | [CosmosContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/queries/sync/QueriesQuickstart.java#L263-L284) <br> [CosmosAsyncContainer.queryItems](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/queries/async/QueriesQuickstartAsync.java#L302-L323)|
<!-- | Query with ORDER BY for partitioned collections | CosmosContainer.queryItems <br> CosmosAsyncContainer.queryItems | -->

## Change feed examples 
The [Change Feed Processor Sample](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java) file shows how to do the following tasks. To learn about change feed in Azure Cosmos DB before you run the following samples, see [Read Azure Cosmos DB change feed](read-change-feed.md) and [Change feed processor](/azure/cosmos-db/sql/change-feed-processor?tabs=java).

| Task | API reference |
| --- | --- |
| Basic change feed functionality | [ChangeFeedProcessor.changeFeedProcessorBuilder](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java#L141-L172) |
| Read change feed from the beginning | [ChangeFeedProcessorOptions.setStartFromBeginning()](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/0ead4ca33dac72c223285e1db866c9dc06f5fb47/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java#L65) |
<!-- | Read change feed from a specific time | ChangeFeedProcessor.changeFeedProcessorBuilder | -->

## Server-side programming examples

The [Stored Procedure Sample](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/storedprocedure/sync/SampleStoredProcedure.java) file shows how to do the following tasks. To learn about server-side programming in Azure Cosmos DB before you run the following samples, see [Stored procedures, triggers, and user-defined functions](stored-procedures-triggers-udfs.md).

| Task | API reference |
| --- | --- |
| Create a stored procedure | [CosmosScripts.createStoredProcedure](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/storedprocedure/sync/SampleStoredProcedure.java#L134-L153) |
| Execute a stored procedure | [CosmosStoredProcedure.execute](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/storedprocedure/sync/SampleStoredProcedure.java#L213-L227) |
| Delete a stored procedure | [CosmosStoredProcedure.delete](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/storedprocedure/sync/SampleStoredProcedure.java#L254-L264) |

<!-- ## User management examples
The User Management Sample file shows how to do the following tasks:

| Task | API reference |
| --- | --- |
| Create a user | - |
| Set permissions on a collection or document | - |
| Get a list of a user's permissions |- | -->

## Next steps

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
