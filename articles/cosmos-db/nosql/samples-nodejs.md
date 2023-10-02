---
title: Examples for Azure Cosmos DB for NoSQL SDK for JS
description: Find Node.js examples on GitHub for common tasks in Azure Cosmos DB, including CRUD operations.
author: seesharprun
ms.author: sidandrews
ms.reviewer: deborahc
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: javascript
ms.topic: sample
ms.date: 08/26/2021
ms.custom: devx-track-js, ignite-2022, devguide-js
---

# Examples for Azure Cosmos DB for NoSQL SDK for JS

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[Samples selector](includes/samples-selector.md)]

Sample solutions that perform CRUD operations and other common operations on Azure Cosmos DB resources are included in the [JavaScript SDK for Azure Cosmos DB](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cosmosdb/cosmos/samples) GitHub repository. This article provides:

- Links to the tasks in each of the Node.js example project files.
- Links to the related API reference content.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

- You can [activate Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio): Your Visual Studio subscription gives you credits every month that you can use for paid Azure services.

[!INCLUDE [cosmos-db-emulator-docdb-api](../includes/cosmos-db-emulator-docdb-api.md)]

You also need the [JavaScript SDK](sdk-nodejs.md).

> [!NOTE]
> Each sample is self-contained, it sets itself up and cleans up after itself. As such, the samples issue multiple calls to [Containers.create](/javascript/api/%40azure/cosmos/containers). Each time this is done your subscription will be billed for 1 hour of usage per the performance tier of the container being created.

## Database examples

The [DatabaseManagement](https://github.com/Azure/azure-cosmos-js/blob/master/samples/DatabaseManagement.ts) file shows how to perform the CRUD operations on the database. To learn about the Azure Cosmos DB databases before running the following samples, see [Working with databases, containers, and items](../resource-model.md) conceptual article.

| Task                                                                                                                                                             | API reference                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [Create a database if it doesn't exist](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/DatabaseManagement.ts#LL26C3-L27C63) | [Databases.createIfNotExists](/javascript/api/@azure/cosmos/databases#createifnotexists-databaserequest--requestoptions-) |
| [List databases for an account](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/DatabaseManagement.ts#L30-L31)               | [Databases.readAll](/javascript/api/@azure/cosmos/databases#readall-feedoptions-)                                         |
| [Read a database by ID](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/DatabaseManagement.ts#L34)                           | [Database.read](/javascript/api/@azure/cosmos/database#read-requestoptions-)                                              |
| [Delete a database](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/DatabaseManagement.ts#LL46C18-L46C18)                    | [Database.delete](/javascript/api/@azure/cosmos/database#delete-requestoptions-)                                          |

## Container examples

The [ContainerManagement](https://github.com/Azure/azure-cosmos-js/blob/master/samples/ContainerManagement.ts) file shows how to perform the CRUD operations on the container. To learn about the Azure Cosmos DB collections before running the following samples, see [Working with databases, containers, and items](../resource-model.md) conceptual article.

| Task                                                                                                                                                     | API reference                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Create a container if it doesn't exist](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/ContainerManagement.ts#L27) | [Containers.createIfNotExists](/javascript/api/@azure/cosmos/containers#createifnotexists-containerrequest--requestoptions-) |
| [List containers for an account](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/ContainerManagement.ts#L30-L32)     | [Containers.readAll](/javascript/api/@azure/cosmos/containers#readall-feedoptions-)                                          |
| [Read a container definition](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/ContainerManagement.ts#L36-L37)        | [Container.read](/javascript/api/@azure/cosmos/container#read-requestoptions-)                                               |
| [Delete a container](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/ContainerManagement.ts#L42-L43)                 | [Container.delete](/javascript/api/@azure/cosmos/container#delete-requestoptions-)                                           |

## Item examples

The [ItemManagement](https://github.com/Azure/azure-cosmos-js/blob/master/samples/ItemManagement.ts) file shows how to perform the CRUD operations on the item. To learn about the Azure Cosmos DB documents before running the following samples, see [Working with databases, containers, and items](../resource-model.md) conceptual article.

| Task                                                                                                                                                        | API reference                                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Create items](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/ItemManagement.ts#L33-L34)                               | [Items.create](/javascript/api/@azure/cosmos/items#create-t--requestoptions-)                                                                           |
| [Read all items in a container](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/ItemManagement.ts#L37)                  | [Items.readAll](/javascript/api/@azure/cosmos/items#readall-feedoptions-)                                                                               |
| [Read an item by ID](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/ItemManagement.ts#L46-L49)                         | [Item.read](/javascript/api/@azure/cosmos/item#read-requestoptions-)                                                                                    |
| [Read item only if item has changed](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/ItemManagement.ts#L51-L74)         | [Item.read](/javascript/api/%40azure/cosmos/item) - [RequestOptions.accessCondition](/javascript/api/%40azure/cosmos/requestoptions#accesscondition)    |
| [Query for documents](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/ItemManagement.ts#L76-L97)                        | [Items.query](/javascript/api/%40azure/cosmos/items)                                                                                                    |
| [Replace an item](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/ItemManagement.ts#L100-L118)                          | [Item.replace](/javascript/api/%40azure/cosmos/item)                                                                                                    |
| [Replace item with conditional ETag check](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/ItemManagement.ts#L127-L128) | [Item.replace](/javascript/api/%40azure/cosmos/item) - [RequestOptions.accessCondition](/javascript/api/%40azure/cosmos/requestoptions#accesscondition) |
| [Delete an item](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/ItemManagement.ts#L234-L235)                           | [Item.delete](/javascript/api/%40azure/cosmos/item)                                                                                                     |

## Indexing examples

The [IndexManagement](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/IndexManagement.ts) file shows how to manage indexing. To learn about indexing in Azure Cosmos DB before running the following samples, see [indexing policies](../index-policy.md), [indexing types](../index-overview.md#types-of-indexes), and [indexing paths](../index-policy.md#include-exclude-paths) conceptual articles.

| Task                                                                                                                                                                                            | API reference                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Manually index a specific item](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/IndexManagement.ts#L71-L106)                                               | [RequestOptions.indexingDirective: 'include'](/javascript/api/%40azure/cosmos/requestoptions#indexingdirective)                                                                      |
| [Manually exclude a specific item from the index](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/IndexManagement.ts#L33-L69)                               | [RequestOptions.indexingDirective: 'exclude'](/javascript/api/%40azure/cosmos/requestoptions#indexingdirective)                                                                      |
| [Exclude a path from the index](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/IndexManagement.ts#L165-L237)                                               | [IndexingPolicy.ExcludedPath](/javascript/api/%40azure/cosmos/indexingpolicy#excludedpaths)                                                                                          |
| [Create a range index on a string path](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/IndexManagement.ts#L108-L163)                                       | [IndexKind.Range](/javascript/api/%40azure/cosmos/indexkind), [IndexingPolicy](/javascript/api/%40azure/cosmos/indexingpolicy), [Items.query](/javascript/api/%40azure/cosmos/items) |
| [Create a container with default indexPolicy, then update the container online](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/IndexManagement.ts#L27-L31) | [Containers.create](/javascript/api/%40azure/cosmos/containers)                                                                                                                      |

## Server-side programming examples

The [index.ts](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/ServerSideScripts.ts) file shows how to perform the following tasks. To learn about Server-side programming in Azure Cosmos DB before running the following samples, see [Stored procedures, triggers, and user-defined functions](stored-procedures-triggers-udfs.md) conceptual article.

| Task                                                                                                                                                     | API reference                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Create a stored procedure](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/ServerSideScripts.ts#L117-L118)          | [StoredProcedures.create](/javascript/api/%40azure/cosmos/storedprocedures) |
| [Execute a stored procedure](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/ServerSideScripts.ts#L120-L121)         | [StoredProcedure.execute](/javascript/api/%40azure/cosmos/storedprocedure)  |
| [Bulk update with stored procedure](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/BulkUpdateWithSproc.ts#L70-L101) | [StoredProcedure.execute](/javascript/api/%40azure/cosmos/storedprocedure)  |

For more information about server-side programming, see [Azure Cosmos DB server-side programming: Stored procedures, database triggers, and UDFs](stored-procedures-triggers-udfs.md).

## Azure Identity(AAD) Auth Examples

The [AADAuth.ts](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/AADAuth.ts) file shows how to perform the following tasks.

| Task                                                                                                                                                                | API reference                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [Create credential object from @azure/identity](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/AADAuth.ts#L23-L28)             | [API](/javascript/api/@azure/identity/usernamepasswordcredential#constructors)                            |
| [Pass credentials to client object with key aadCredentials](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/AADAuth.ts#L29-L38) | [API](/javascript/api/@azure/cosmos/cosmosclientoptions#@azure-cosmos-cosmosclientoptions-aadcredentials) |
| [Execute cosmos client with aad credentials](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/AADAuth.ts#L40-L52)                | [API](/javascript/api/@azure/cosmos/databases#readall-feedoptions-)                                       |

## Miscellaneous samples

Following curated samples illustrate common scenarios.

| Task                                                                                                                                                                     | API reference                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| [Alter Query throughput ](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/AlterQueryThroughput.ts#L40-L43)                           | [API](/javascript/api/@azure/cosmos/offer#@azure-cosmos-offer-replace)                        |
| [Getting query throughput ](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/QueryThroughput.ts)                                      | [API](/javascript/api/@azure/cosmos/queryiterator#@azure-cosmos-queryiterator-hasmoreresults) |
| [using SasTokens for granting scoped access to Cosmos DB resources](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/samples-dev/SasTokenAuth.ts) | [API](/javascript/api/@azure/cosmos#@azure-cosmos-createauthorizationsastoken)                |

## Next steps

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.

- If all you know is the number of vCores and servers in your existing database cluster, see [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md)
- If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
