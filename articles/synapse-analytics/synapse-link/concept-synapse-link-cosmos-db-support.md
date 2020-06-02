---
title: Azure Synapse Link (preview) for Azure Cosmos DB supported features
description: Understand the current list of actions supported by Azure Synapse Link for Azure Cosmos DB
services: synapse-analytics 
author: ArnoMicrosoft
ms.service: synapse-analytics 
ms.topic: quickstart
ms.subservice: 
ms.date: 04/21/2020
ms.author: acomet
ms.reviewer: jrasnick
---

# Azure Synapse Link (preview) for Azure Cosmos DB supported features

This article describes the functionalities that are currently supported in Azure Synapse Link for Azure Cosmos DB.

## Azure Synapse support

There are two types of containers in Azure Cosmos DB:
* HTAP container - A container with Synapse Link enabled. This container has both transactional store and analytical store. 
* OLTP container - A container with only transaction store; Synapse Link is not enabled. 

> [!IMPORTANT]
> Azure Synapse Link for Azure Cosmos DB is currently supported for workspaces that do not have managed virtual network enabled. 

You can connect to an Azure Cosmos DB container without enabling Synapse Link, in which case you can only read/write to the transactional store. What follows a is list of the currently supported features within Synapse Link for Azure Cosmos DB. 

| Category              | Description |[Spark](https://docs.microsoft.com/azure/synapse-analytics/sql/on-demand-workspace-overview) | [SQL serverless](https://docs.microsoft.com/azure/synapse-analytics/sql/on-demand-workspace-overview) |
| -------------------- | ----------------------------------------------------------- |----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| **Run-time Support** |Support for read or write by Azure Synapse run-time| ✓ | [Contact Us](mailto:AskSynapse@microsoft.com?subject=[Enable%20Preview%20Feature]%20SQL%20serverless%20for%20Cosmos%20DB)|
| **Azure Cosmos DB API support** |API support as a Synapse Link| SQL / MongoDB | SQL / MongoDB |
| **Object**  |Objects such as a table that can be created, pointing directly to Azure Cosmos DB container| View, Table | View |
| **Read**    |Read data from an Azure Cosmos DB container| OLTP / HTAP | HTAP  |
| **Write**   |Write data from run-time into an Azure Cosmos DB container| OLTP | n/a |

* If you write data into an Azure Cosmos DB container from Spark, this process happens through the transactional store of Azure Cosmos DB and will impact the transactional performance of Azure Cosmos DB by consuming Request Units.
* SQL pool integration through external tables is currently not supported.

## Supported code-generated actions for Spark

| Gesture              | Description |OLTP |HTAP  |
| -------------------- | ----------------------------------------------------------- |----------------------------------------------------------- |----------------------------------------------------------- |
| **Load to DataFrame** |Load and read data into a Spark DataFrame |X| ✓ |
| **Create Spark table** |Create a table pointing to an Azure Cosmos DB container|X| ✓ |
| **Write DataFrame to container** |Write data into a container|✓| ✓ |
| **Load streaming DataFrame from container** |Stream data using Azure Cosmos DB change feed|✓| ✓ |
| **Write streaming DataFrame to container** |Stream data using Azure Cosmos DB change feed|✓| ✓ |



## Supported code-generated actions for SQL serverless

| Gesture              | Description |OLTP |HTAP |
| -------------------- | ----------------------------------------------------------- |----------------------------------------------------------- |----------------------------------------------------------- |
| **Select top 100** |Preview top 100 items from a container|X| ✓ |
| **Create view** |Create a view to directly have BI access in a container through Synapse SQL|X| ✓ |

## Next steps

* See how to [connect to Synapse Link for Azure Cosmos DB](../quickstart-connect-synapse-link-cosmos-db.md)
* [Learn how to query the analytical store with Spark](how-to-query-analytical-store-spark.md)