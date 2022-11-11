---
title: API for NoSQL Python examples for Azure Cosmos DB
description: Find Python examples on GitHub for common tasks in Azure Cosmos DB, including CRUD operations.
author: seesharprun
ms.author: sidandrews
ms.reviewer: rosouz
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: python
ms.topic: sample
ms.date: 10/18/2021
ms.custom: devx-track-python, ignite-2022
---

# Azure Cosmos DB Python examples

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!div class="op_single_selector"]
>
> - [.NET SDK Examples](samples-dotnet.md)
> - [Java V4 SDK Examples](samples-java.md)
> - [Spring Data V3 SDK Examples](samples-java-spring-data.md)
> - [Node.js Examples](samples-nodejs.md)
> - [Python Examples](samples-python.md)
> - [Azure Code Sample Gallery](https://azure.microsoft.com/resources/samples/?sort=0&service=cosmos-db)
>

Sample solutions that do CRUD operations and other common operations on Azure Cosmos DB resources are included in the `main/sdk/cosmos` folder of the [azure/azure-sdk-for-python](https://github.com/azure/azure-sdk-for-python/tree/main/sdk/cosmos) GitHub repository. This article provides:

- Links to the tasks in each of the Python example project files.
- Links to the related API reference content.

## Prerequisites

- An Azure Cosmos DB Account. Your options are:
  - Within an Azure active subscription:
    - [Create an Azure free Account](https://azure.microsoft.com/free) or use your existing subscription
    - [Visual Studio Monthly Credits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers)
    - [Azure Cosmos DB Free Tier](../free-tier.md)
    - Without an Azure active subscription:
      - [Try Azure Cosmos DB for free](../try-free.md), a tests environment that lasts for 30 days.
      - [Azure Cosmos DB Emulator](https://aka.ms/cosmosdb-emulator)
- [Python 2.7 or 3.6+](https://www.python.org/downloads/), with the `python` executable in your `PATH`.
- [Visual Studio Code](https://code.visualstudio.com/).
- The [Python extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-python.python#overview).
- [Git](https://www.git-scm.com/downloads).
- [Azure Cosmos DB for NoSQL SDK for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cosmos/azure-cosmos)

## Database examples

The [database_management.py](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/database_management.py) Python sample shows how to do the following tasks. To learn about the Azure Cosmos DB databases before running the following samples, see [Working with databases, containers, and items](../account-databases-containers-items.md) conceptual article.

| Task | API reference |
| --- | --- |
| [Create a database](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/database_management.py#L53-L62) |CosmosClient.create_database|
| [Read a database by ID](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/database_management.py#L64-L73) |CosmosClient.get_database_client|
| [Query the databases](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/database_management.py#L37-L50) |CosmosClient.query_databases|
| [List databases for an account](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/database_management.py#L76-L87) |CosmosClient.list_databases|
| [Delete a database](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/database_management.py#L90-L99) |CosmosClient.delete_database|

## Container examples

The [container_management.py](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/container_management.py) Python sample shows how to do the following tasks. To learn about the Azure Cosmos DB collections before running the following samples, see [Working with databases, containers, and items](../account-databases-containers-items.md) conceptual article.

| Task | API reference |
| --- | --- |
| [Query for a container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/container_management.py#L51-L66) |database.query_containers |
| [Create a container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/container_management.py#L69-L163) |database.create_container |
| [List all the containers in a database](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/container_management.py#L206-L217) |database.list_containers |
| [Get a container by its ID](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/container_management.py#L195-L203) |database.get_container_client |
| [Manage container's provisioned throughput](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/container_management.py#L166-L192) |container.read_offer, container.replace_throughput|
| [Delete a container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/container_management.py#L220-L229) |database.delete_container |

## Item examples

The [item_management.py](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py) Python sample shows how to do the following tasks. To learn about the Azure Cosmos DB documents before running the following samples, see [Working with databases, containers, and items](../account-databases-containers-items.md) conceptual article.

| Task | API reference |
| --- | --- |
| [Create items in a container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py#L31-L43) |container.create_item |
| [Read an item by its ID](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py#L46-L54) |container.read_item |
| [Read all the items in a container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py#L57-L68) |container.read_all_items |
| [Query an item by its ID](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py#L71-L83) |container.query_items |
| [Replace an item](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py#L86-L93) |container.replace_items |
| [Upsert an item](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py#L95-L103) |container.upsert_item |
| [Delete an item](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py#L106-L111) |container.delete_item |
| [Get the change feed of items in a container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/change_feed_management.py) |container.query_items_change_feed |

## Indexing examples

The [index_management.py](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/index_management.py) Python sample shows how to do the following tasks. To learn about indexing in Azure Cosmos DB before running the following samples, see [indexing policies](../index-policy.md), [indexing types](../index-overview.md#index-types), and [indexing paths](../index-policy.md#include-exclude-paths) conceptual articles.

| Task | API reference |
| --- | --- |
| [Exclude a specific item from indexing](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/index_management.py#L149-L205) | documents.IndexingDirective.Exclude|
| [Use manual indexing with specific items indexed](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/index_management.py#L208-L267) | documents.IndexingDirective.Include |
| [Exclude paths from indexing](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/index_management.py#L270-L340) |Define paths to exclude in `IndexingPolicy` property |
| [Use range indexes on strings](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/index_management.py#L405-L490) | Define indexing policy with range indexes on string data type. `'kind': documents.IndexKind.Range`, `'dataType': documents.DataType.String`|
| [Perform an index transformation](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/index_management.py#L492-L548) |database.replace_container (use the updated indexing policy)|
| [Use scans when only hash index exists on the path](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/index_management.py#L343-L402) | set the `enable_scan_in_query=True` and `enable_cross_partition_query=True` when querying the items |

## Next steps

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.

- If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md)
- If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
