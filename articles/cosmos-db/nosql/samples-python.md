---
title: Examples for Azure Cosmos DB for NoSQL SDK for Python
description: Find Python examples on GitHub for common tasks in Azure Cosmos DB, including CRUD operations.
author: seesharprun
ms.author: sidandrews
ms.reviewer: rosouz
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: python
ms.topic: sample
ms.date: 12/19/2022
ms.custom: devx-track-python, ignite-2022, devguide-python, py-fresh-zinc
---

# Examples for Azure Cosmos DB for NoSQL SDK for Python

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[Samples selector](includes/samples-selector.md)]

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
- [Python 3.7+](https://www.python.org/downloads/), with the `python` executable in your `PATH`. (For more information, see the [Azure SDKs Python version support policy](https://github.com/Azure/azure-sdk-for-python/wiki/Azure-SDKs-Python-version-support-policy).)
- [Visual Studio Code](https://code.visualstudio.com/).
- [Python extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-python.python#overview).
- [Git](https://www.git-scm.com/downloads).
- [Azure Cosmos DB for NoSQL SDK for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cosmos/azure-cosmos)

## Database examples

The [database_management.py](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/database_management.py) Python sample shows how to do the following tasks using [CosmosClient methods](/python/api/azure-cosmos/azure.cosmos.cosmos_client.cosmosclient#methods). To learn about the Azure Cosmos DB databases before running the following samples, see [Working with databases, containers, and items](../resource-model.md) conceptual article.

| Task | API reference |
| --- | --- |
| [Create a database](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/database_management.py#L54-L73) |CosmosClient.create_database|
| [Read a database by ID](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/database_management.py#L76-L85) |CosmosClient.get_database_client|
| [Query the databases](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/database_management.py#L38-L51) |CosmosClient.query_databases|
| [List databases for an account](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/database_management.py#L88-L99) |CosmosClient.list_databases|
| [Delete a database](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/database_management.py#L102-L111) |CosmosClient.delete_database|

## Container examples

The [container_management.py](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/container_management.py) Python sample shows how to do the following tasks using [DatabaseProxy methods](/python/api/azure-cosmos/azure.cosmos.database.databaseproxy#methods). To learn about the Azure Cosmos DB collections before running the following samples, see [Working with databases, containers, and items](../resource-model.md) conceptual article.

| Task | API reference |
| --- | --- |
| [Query for a container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/container_management.py#L58-L73) |database.query_containers |
| [Create a container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/container_management.py#L76-L198) |database.create_container |
| [List all the containers in a database](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/container_management.py#L243-L254) |database.list_containers |
| [Get a container by its ID](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/container_management.py#L231-L240) |database.get_container_client |
| [Manage container's provisioned throughput](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/container_management.py#L202-L228) |container.replace_throughput|
| [Delete a container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/container_management.py#L257-L266) |database.delete_container |

## Item examples

The [document_management.py](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py) and [change_feed_management.py](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/cosmos/azure-cosmos/samples/change_feed_management.py) Python samples show how to do the following tasks using [ContainerProxy methods](/python/api/azure-cosmos/azure.cosmos.container.containerproxy#methods). To learn about the Azure Cosmos DB items before running the following samples, see [Working with databases, containers, and items](../resource-model.md) conceptual article.

| Task | API reference |
| --- | --- |
| [Create items in a container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py#L31-L43) |container.create_item |
| [Read an item by its ID](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py#L46-L54) |container.read_item |
| [Read all the items in a container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py#L57-L68) |container.read_all_items |
| [Query an item by its ID](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py#L71-L83) |container.query_items |
| [Replace an item](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py#L86-L93) |container.replace_item |
| [Upsert an item](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py#L95-L103) |container.upsert_item |
| [Delete an item](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/document_management.py#L106-L111) |container.delete_item |
| [Get the change feed of items in a container](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/change_feed_management.py) |container.query_items_change_feed |

## Indexing examples

The [index_management.py](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/index_management.py) Python sample shows how to do the following tasks. To learn about indexing in Azure Cosmos DB before running the following samples, see [indexing policies](../index-policy.md), [indexing types](../index-overview.md#types-of-indexes), and [indexing paths](../index-policy.md#include-exclude-paths) conceptual articles.

| Task | API reference |
| --- | --- |
| [Exclude a specific item from indexing](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/index_management.py#L149-L205) | documents.[IndexingDirective](/python/api/azure-cosmos/azure.cosmos.documents.indexingdirective).Exclude|
| [Use manual indexing with specific items indexed](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/index_management.py#L208-L267) | documents.IndexingDirective.Include |
| [Exclude paths from indexing](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/index_management.py#L270-L340) |Define paths to exclude in [IndexingPolicy](/python/api/azure-mgmt-cosmosdb/azure.mgmt.cosmosdb.models.indexingpolicy) property |
| [Use range indexes on strings](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/index_management.py#L405-L490) | Define indexing policy with range indexes on string data type. `'kind': documents.IndexKind.Range`, `'dataType': documents.DataType.String`|
| [Perform an index transformation](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/index_management.py#L492-L548) |database.[replace_container](/python/api/azure-cosmos/azure.cosmos.database.databaseproxy#azure-cosmos-database-databaseproxy-replace-container) (use the updated indexing policy)|
| [Use scans when only hash index exists on the path](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/cosmos/azure-cosmos/samples/index_management.py#L343-L402) | set the `enable_scan_in_query=True` and `enable_cross_partition_query=True` when querying the items |

## Next steps

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.

- If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md)
- If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
