---
title: SQL API Python examples for Azure Cosmos DB
description: Find Python examples on GitHub for common tasks in Azure Cosmos DB, including CRUD operations.
author: SnehaGunda
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: python
ms.topic: sample
ms.date: 03/14/2018
ms.author: sngun

---
# Azure Cosmos DB Python examples

> [!div class="op_single_selector"]
> * [.NET Examples](sql-api-dotnet-samples.md)
> * [Java Examples](sql-api-java-samples.md)
> * [Async Java Examples](sql-api-async-java-samples.md)
> * [Node.js Examples](sql-api-nodejs-samples.md)
> * [Python Examples](sql-api-python-samples.md)
> * [Azure Code Sample Gallery](https://azure.microsoft.com/resources/samples/?sort=0&service=cosmos-db)
> 
> 

Sample solutions that do CRUD operations and other common operations on Azure Cosmos DB resources are included in the [azure-documentdb-python](https://github.com/Azure/azure-documentdb-python) GitHub repository. This article provides:

* Links to the tasks in each of the Python example project files. 
* Links to the related API reference content.

**Prerequisites**

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

- You can [activate Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio): Your Visual Studio subscription gives you credits every month that you can use for paid Azure services.

[!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]

You also need the [Python SDK](sql-api-sdk-python.md). 
   
   > [!NOTE]
   > Each sample is self-contained; it sets itself up and cleans up after itself. The samples issue multiple calls to [CosmosClient.CreateContainer](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#createcontainer-database-link--collection--options-none-). Each time this is done, your subscription is billed for one hour of usage. For more information about Azure Cosmos DB billing, see [Azure Cosmos DB Pricing](https://azure.microsoft.com/pricing/details/cosmos-db/).
   > 
   > 

## Database examples
The [Program.py](https://github.com/Azure/azure-documentdb-python/blob/master/samples/DatabaseManagement/Program.py) file of the [DatabaseManagement](https://github.com/Azure/azure-documentdb-python/blob/master/samples/DatabaseManagement) project shows how to do the following tasks. To learn about the Azure Cosmos databases before running the following samples, see [Working with databases, containers, and items](databases-containers-items.md) conceptual article. 

| Task | API reference |
| --- | --- |
| [Create a database](https://github.com/Azure/azure-documentdb-python/blob/master/samples/DatabaseManagement/Program.py#L65-L76) |[CosmosClient.CreateDatabase](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#createdatabase-database--options-none-) |
| [Read a database by ID](https://github.com/Azure/azure-documentdb-python/blob/master/samples/DatabaseManagement/Program.py#L79-L96) |[CosmosClient.ReadDatabase](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#readdatabase-database-link--options-none-) |
| [List databases for an account](https://github.com/Azure/azure-documentdb-python/blob/master/samples/DatabaseManagement/Program.py#L99-L110) |[CosmosClient.ReadDatabases](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#readdatabases-options-none-) |
| [Delete a database](https://github.com/Azure/azure-documentdb-python/blob/master/samples/DatabaseManagement/Program.py#L113-L126) |[CosmosClient.DeleteDatabase](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#deletedatabase-database-link--options-none-) |

## Collection examples
The [Program.py](https://github.com/Azure/azure-documentdb-python/blob/master/samples/CollectionManagement/Program.py) file of the [CollectionManagement](https://github.com/Azure/azure-documentdb-python/blob/master/samples/CollectionManagement) project shows how to do the following tasks. To learn about the Azure Cosmos collections before running the following samples, see [Working with databases, containers, and items](databases-containers-items.md) conceptual article. 

| Task | API reference |
| --- | --- |
| [Create a collection](https://github.com/Azure/azure-documentdb-python/blob/master/samples/CollectionManagement/Program.py#L84-L135) |[CosmosClient.CreateContainer](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#createcontainer-database-link--collection--options-none-) |
| [Read a list of all collections in a database](https://github.com/Azure/azure-documentdb-python/blob/master/samples/CollectionManagement/Program.py#L210-L222) |[CosmosClient.ReadContainers](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#readcontainers-database-link--options-none-) |
| [Get a collection by ID](https://github.com/Azure/azure-documentdb-python/blob/master/samples/CollectionManagement/Program.py#L190-L208) |[CosmosClient.ReadContainer](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#readcontainer-collection-link--options-none-) |
| [Change the throughput of a collection](https://github.com/Azure/azure-documentdb-python/blob/master/samples/CollectionManagement/Program.py#L184-L188) | [CosmosClient.ReplaceOffer](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#replaceoffer-offer-link--offer-)|
| [Delete a collection](https://github.com/Azure/azure-documentdb-python/blob/master/samples/CollectionManagement/Program.py#L224-L238) |[CosmosClient.DeleteContainer](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#deletecontainer-collection-link--options-none-) |

## Document examples
The [Program.py](https://github.com/Azure/azure-documentdb-python/blob/master/samples/DocumentManagement/Program.py) file of the [DocumentManagement](https://github.com/Azure/azure-documentdb-python/blob/master/samples/DocumentManagement) project shows how to do the following tasks. To learn about the Azure Cosmos documents before running the following samples, see [Working with databases, containers, and items](databases-containers-items.md) conceptual article. 

| Task | API reference |
| --- | --- |
| [Create a document](https://github.com/Azure/azure-documentdb-python/blob/master/samples/DocumentManagement/Program.py#L55-L66) |[CosmosClient.CreateItem](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#createitem-database-or-container-link--document--options-none-) |
| [Create a collection of documents](https://github.com/Azure/azure-documentdb-python/blob/master/samples/DocumentManagement/Program.py#L55-L66) |[CosmosClient.CreateItem](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#createitem-database-or-container-link--document--options-none-) |
| [Read a document by ID](https://github.com/Azure/azure-documentdb-python/blob/master/samples/DocumentManagement/Program.py#L69-L78) |[CosmosClient.ReadItem](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#readitem-document-link--options-none-) |
| [Read all the documents in a collection](https://github.com/Azure/azure-documentdb-python/blob/master/samples/DocumentManagement/Program.py#L81-L92) |[CosmosClient.ReadItems](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#readitems-collection-link--feed-options-none-) |
| [Replace document with conditional ETag check](https://github.com/Azure/azure-cosmos-python/blob/a21f6fb4bad3f59909ef43558b598f9fb476b7bc/test/crud_tests.py#L1216-L1218) | [CosmosClient.ReplaceItem](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#replaceitem-document-link--new-document--options-none-) |

## Indexing examples
The [Program.py](https://github.com/Azure/azure-documentdb-python/blob/master/samples/IndexManagement/Program.py) file of the [IndexManagement](https://github.com/Azure/azure-documentdb-python/blob/master/samples/IndexManagement) project shows how to do the following tasks.  To learn about indexing in Azure Cosmos DB before running the following samples, see [indexing policies](index-policy.md), [indexing types](index-types.md), and [indexing paths](index-paths.md) conceptual articles. 

| Task | API reference |
| --- | --- |
| [Use manual (instead of automatic) indexing](https://github.com/Azure/azure-documentdb-python/blob/master/samples/IndexManagement/Program.py#L245-L246) | Automatic indexing policy |
| [Exclude specified document paths from the index](https://github.com/Azure/azure-documentdb-python/blob/master/samples/IndexManagement/Program.py#L294-L367) | Indexing policy with excluded paths|
| [Exclude a document from the index](https://github.com/Azure/azure-documentdb-python/blob/master/samples/IndexManagement/Program.py#L204-L210) |[IndexingDirective.Exclude](/python/api/azure-cosmos/azure.cosmos.documents.indexingdirective#exclude) |
| [Set indexing mode](https://github.com/Azure/azure-documentdb-python/blob/master/samples/IndexManagement/Program.py#L533) |[IndexingMode](/python/api/azure-cosmos/azure.cosmos.documents.indexingmode) |
| [Use range indexes on strings](https://github.com/Azure/azure-documentdb-python/blob/master/samples/IndexManagement/Program.py#L440-L456) | Indexing policy with included paths|
| [Perform an index transformation](https://github.com/Azure/azure-documentdb-python/blob/master/samples/IndexManagement/Program.py#L514-L559) |[CosmosClient.ReplaceContainer](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#replacecontainer-collection-link--collection--options-none-) |

## Query examples
The sample projects also show how to do the following query tasks. To learn about the SQL query reference in Azure Cosmos DB before running the following samples, see [SQL query examples](how-to-sql-query.md) conceptual article. To learn about the SQL query reference in Azure Cosmos DB before running the following samples, see [SQL query examples](how-to-sql-query.md) conceptual article. 


| Task | API reference |
| --- | --- |
| [Query an account for a database](https://github.com/Azure/azure-documentdb-python/blob/master/samples/DatabaseManagement/Program.py#L49-L62) |[CosmosClient.QueryDatabases](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#querydatabases-query--options-none-) |
| [Query for documents](https://github.com/Azure/azure-documentdb-python/blob/master/samples/IndexManagement/Program.py#L152-L169) |[CosmosClient.QueryItems](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#queryitems-database-or-container-link--query--options-none--partition-key-none-) |
| [Force a range scan operation on a hash indexed path](https://github.com/Azure/azure-documentdb-python/blob/master/samples/IndexManagement/Program.py#L409-L415) |[HttpHeaders.EnableScanInQuery](/python/api/azure-cosmos/azure.cosmos.http_constants.httpheaders#enablescaninquery) |

