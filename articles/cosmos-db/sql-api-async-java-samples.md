---
title: 'Azure Cosmos DB: Async Java examples for the SQL API'
description: Find Async Java examples on GitHub for common tasks using the Azure Cosmos DB SQL API, including CRUD operations.
author: SnehaGunda
ms.service: cosmos-db
ms.devlang: java
ms.topic: sample
ms.date: 12/03/2018
ms.author: sngun

---
# Azure Cosmos DB: Async Java examples for the SQL API

> [!div class="op_single_selector"]
> * [.NET Examples](sql-api-dotnet-samples.md)
> * [Java Examples](sql-api-java-samples.md)
> * [Async Java Examples](sql-api-async-java-samples.md)
> * [Node.js Examples](sql-api-nodejs-samples.md)
> * [Python Examples](sql-api-python-samples.md)
> * [Azure Code Sample Gallery](https://azure.microsoft.com/resources/samples/?sort=0&service=cosmos-db)
> 
> 

The latest sample applications that perform CRUD operations and other common operations on Azure Cosmos DB resources are included in the [azure-cosmosdb-java](https://github.com/Azure/azure-cosmosdb-java) GitHub repository. This article provides:

* Links to the tasks in each of the example Async Java project files. 
* Links to the related API reference content.

**Prerequisites**

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
  
- You can [activate Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio): Your Visual Studio subscription gives you credits every month that you can use for paid Azure services.

[!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]

You need the following to run this sample application:

* Java Development Kit 8
* Microsoft Azure Cosmos DB Java SDK

You can optionally use Maven to get the latest Microsoft Azure Cosmos DB Java SDK binaries for use in your project. You can choose the latest version from [here](https://mvnrepository.com/artifact/com.microsoft.azure/azure-cosmosdb). Maven automatically adds any necessary dependencies. Otherwise, you can directly download the dependencies listed in the pom.xml file and add them to your build path.

```bash
<dependency>
	<groupId>com.microsoft.azure</groupId>
	<artifactId>azure-cosmosdb</artifactId>
	<version>${LATEST}</version>
</dependency>
```

**Running the sample applications**

Clone the sample repo:
```bash
$ git clone https://github.com/Azure/azure-cosmosdb-java.git

$ cd azure-cosmosdb-java
```

You can run the samples either using Eclipse or from the command line using Maven.

To run from Eclipse:
* Load the main parent project pom.xml file in Eclipse; it should automatically load azure-cosmosdb-examples.
* To run the samples, you need a valid Azure Cosmos DB Endpoint. The endpoints are read from `src/test/java/com/microsoft/azure/cosmosdb/rx/examples/TestConfigurations.java`.
* You can pass your endpoint credentials as VM Arguments in Eclipse JUnit Run Config or you can put your endpoint credentials in TestConfigurations.java.
    ```bash
    -DACCOUNT_HOST=<Fill your Azure Cosmos DB account name> -DACCOUNT_KEY=<Fill your Azure Cosmos DB primary key>
    ```
* Now you can run the samples as JUnit tests in Eclipse.

To run from the command line:
* The other way for running samples is to use maven:
* Run Maven and pass your Azure Cosmos DB Endpoint credentials:
    ```bash
    mvn test -DACCOUNT_HOST=<Fill your Azure Cosmos DB account name> -DACCOUNT_KEY=<Fill your Azure Cosmos DB primary key>
    ```

   > [!NOTE]
   > Each sample is self-contained; it sets itself up and cleans up after itself. The samples issue multiple calls to [DocumentClient.createCollection](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.createcollection). Each time this is done, your subscription is billed for 1 hour of usage for the performance tier of the collection created. 
   > 
   > 

## Database examples
The [DatabaseCrudAsyncAPITest](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DatabaseCRUDAsyncAPITest.java) file shows how to perform the following tasks. To learn about the Azure Cosmos databases before running the following samples, see [Working with databases, containers, and items](databases-containers-items.md) conceptual article. 

| Task | API reference |
| --- | --- |
| [Create a database](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DatabaseCRUDAsyncAPITest.java#L115-L132) | [AsyncDocumentClient.createDatabase](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.createdatabase) |
| [Fail to create a database that already exists](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DatabaseCRUDAsyncAPITest.java#L189-L204) | |
| [Create and read a database](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DatabaseCRUDAsyncAPITest.java#L228-L249) | [AsyncDocumentClient.readDatabase](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.readdatabase) |
| [Create and delete a database](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DatabaseCRUDAsyncAPITest.java#L255-L276) | [AsyncDocumentClient.deleteDatabase](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.deletedatabase) |
| [Create and query a database](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DatabaseCRUDAsyncAPITest.java#L282-L312) | [AsyncDocumentClient.queryDatabases](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.querydatabases) |

## Collection examples
The [CollectionCrudAsyncAPITest](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/CollectionCRUDAsyncAPITest.java) file shows how to perform the following tasks. To learn about the Azure Cosmos collections before running the following samples, see [Working with databases, containers, and items](databases-containers-items.md) conceptual article. 

| Task | API reference |
| --- | --- |
| [Create a single partition collection](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/CollectionCRUDAsyncAPITest.java#L134-L153) | [AsyncDocumentClient.createCollection](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.createcollection) |
| [Create a custom multi-partition collection](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/CollectionCRUDAsyncAPITest.java#L164-L184) | [DocumentCollection](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.documentcollection)<br>[PartitionKeyDefinition](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.partitionkeydefinition)<br>[RequestOptions](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.requestoptions) |
| [Fail to create a collection that already exists](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/CollectionCRUDAsyncAPITest.java#L241-L256) | |
| [Create and read a collection](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/CollectionCRUDAsyncAPITest.java#L281-L304) | [AsyncDocumentClient.readCollection](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.readcollection) |
| [Create and delete a collection](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/CollectionCRUDAsyncAPITest.java#L310-L333) | [AsyncDocumentClient.deleteCollection](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.deletecollection) |
| [Create and query a collection](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/CollectionCRUDAsyncAPITest.java#L339-L372) | [AsyncDocumentClient.queryCollection](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.querycollections) |

## Document examples
The [DocumentCrudAsyncAPITest](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DocumentCRUDAsyncAPITest.java) file shows how to perform the following tasks. To learn about the Azure Cosmos documents before running the following samples, see [Working with databases, containers, and items](databases-containers-items.md) conceptual article. 

| Task | API reference |
| --- | --- |
| [Create a document](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DocumentCRUDAsyncAPITest.java#L137-L156) | [AsyncDocumentClient.createDocument](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.createdocument) |
| [Create a document with a programmable document definition](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DocumentCRUDAsyncAPITest.java#L213-L242) | [Document](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.document)<br>[Resource.setId](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.resource.setid) |
| [Create documents and find total RU cost](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DocumentCRUDAsyncAPITest.java#L248-L280) | [ResourceResponse.getRequestCharge](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.resourceresponse.getrequestcharge) |
| [Fail to create a document that already exists](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DocumentCRUDAsyncAPITest.java#L316-L336) | |
| [Create and replace a document](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DocumentCRUDAsyncAPITest.java#L342-L365) | [AsyncDocumentClient.replaceDocument](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.replacedocument) |
| [Create and upsert a document](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DocumentCRUDAsyncAPITest.java#L371-L393) | [AsyncDocumentClient.upsertDocument](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.upsertdocument) |
| [Create and delete a document](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DocumentCRUDAsyncAPITest.java#L399-L431) | [AsyncDocumentClient.deleteDocument](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.deletedocument) |
| [Create and read a document](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DocumentCRUDAsyncAPITest.java#L437-L458) | [AsyncDocumentClient.readDocument](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.readdocument) |

## Indexing examples
The [CollectionCrudAsyncAPITest](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/CollectionCRUDAsyncAPITest.java) file shows how to perform the following tasks.  To learn about indexing in Azure Cosmos DB before running the following samples, see [indexing policies](index-policy.md), [indexing types](index-types.md), and [indexing paths](index-paths.md) conceptual articles. 

| Task | API reference |
| --- | --- |
| [Create an index and set indexing policy](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/CollectionCRUDAsyncAPITest.java#L394-L410) | [Index](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.index)<br>[IndexingPolicy](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.indexingpolicy) |

For more information about indexing, see [Azure Cosmos DB indexing policies](index-policy.md).

## Query examples
The [DocumentQuerySamples](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DocumentQueryAsyncAPITest.java) file shows how to perform the following tasks. To learn about the SQL query reference in Azure Cosmos DB before running the following samples, see [SQL query examples](how-to-sql-query.md) conceptual article. 

| Task | API reference |
| --- | --- |
| [Perform a simple document query](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DocumentQueryAsyncAPITest.java#L154-L190) | [AsyncDocumentClient.queryDocuments](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.querydocuments) |
| [Perform a simple document query and find Total RU cost](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DocumentQueryAsyncAPITest.java#L249-L268) | [FeedResponse.getRequestCharge](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.feedresponse.getrequestcharge) |
| [Perform a simple document query, read one page and unsubscribe from the returned observable](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DocumentQueryAsyncAPITest.java#L274-L312) | |
| [Perform a simple document query and filter the results](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DocumentQueryAsyncAPITest.java#L318-L368) | |
| [Perform an order-by cross-partition document query](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/DocumentQueryAsyncAPITest.java#L410-L457) | [FeedOptions.setEnableCrossPartitionQuery](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.feedoptions.setenablecrosspartitionquery) |

For more information about writing queries, see [SQL query within Azure Cosmos DB](how-to-sql-query.md).

## Offer examples
The [OfferCRUDAsyncAPITest](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/OfferCRUDAsyncAPITest.java) file shows how to perform the following tasks:

| Task | API reference |
| --- | --- |
| [Create a collection and set throughput](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/OfferCRUDAsyncAPITest.java#L106-L113) | [AsyncDocumentClient.createCollection](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.createcollection)<br>[RequestOptions.setOfferThroughput](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.requestoptions.setofferthroughput) |
| [Read a collection to find the associated offer](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/OfferCRUDAsyncAPITest.java#L118-L130) | [Offer.getContent](https://docs.microsoft.com/java/api/com.microsoft.azure.documentdb.offer.getContent)<br>[DocumentClient.queryOffers](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.queryoffers) |
| [Update a collection's throughput by replacing its offer](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/OfferCRUDAsyncAPITest.java#L101-L153) | [AsyncDocumentClient.replaceOffer](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.replaceoffer) |

## Stored procedure examples
The [StoredProcedureAsyncAPITest](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/StoredProcedureAsyncAPITest.java) file shows how to perform the following tasks. To learn about Server-side programming  in Azure Cosmos DB before running the following samples, see [Stored procedures, triggers, and user-defined functions](stored-procedures-triggers-udfs.md) conceptual article. 

| Task | API reference |
| --- | --- |
| [Create and run a stored procedure](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/StoredProcedureAsyncAPITest.java#L108-L155) | [StoredProcedure](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.storedprocedure)<br>[DocumentClient.createStoredProcedure](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.createstoredprocedure)<br>[AsyncDocumentClient.executeStoredProcedure](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.rx.asyncdocumentclient.executestoredprocedure) |
| [Create and run a stored procedure with arguments](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/StoredProcedureAsyncAPITest.java#L161-L195) | |
| [Create and run a stored procedure with an object argument](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/StoredProcedureAsyncAPITest.java#L201-L241) | |

## Unique Key
The [UniqueIndexAsyncAPITest](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/UniqueIndexAsyncAPITest.java) file shows how to perform the following tasks. To learn about the unique keys in Azure Cosmos DB before running the following samples, see [Unique key constraints](unique-keys.md) conceptual article. 

| Task | API reference |
| --- | --- |
| [Create a collection with a unique key](https://github.com/Azure/azure-cosmosdb-java/blob/master/examples/src/test/java/com/microsoft/azure/cosmosdb/rx/examples/UniqueIndexAsyncAPITest.java#L65-L97) | [UniqueKey](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.uniquekey)<br>[UniqueKeyPolicy](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.uniquekeypolicy)<br>[DocumentCollection.setUniqueKeyPolicy](https://docs.microsoft.com/java/api/com.microsoft.azure.cosmosdb.documentcollection.setuniquekeypolicy) |
