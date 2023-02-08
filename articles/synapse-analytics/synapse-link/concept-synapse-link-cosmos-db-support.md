---
title: Azure Synapse Link for Azure Cosmos DB supported features
description: Understand the current list of actions supported by Azure Synapse Link for Azure Cosmos DB
services: synapse-analytics 
author: Rodrigossz
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: synapse-link
ms.date: 06/02/2021
ms.author: rosouz
ms.reviewer: sngun
ms.custom: cosmos-db, ignite-2022
---

# Azure Synapse Link for Azure Cosmos DB supported features

This article describes the functionalities that are currently supported in Azure Synapse Link for Azure Cosmos DB.

## Azure Synapse support

There are two types of containers in Azure Cosmos DB:
* HTAP container - A container with Synapse Link enabled. This container has both transactional store and analytical store. 
* OLTP container - A container with Synaspe Link not enabled. This container has only transactional store and no analytical store.

You can connect to an Azure Cosmos DB container without enabling Synapse Link. In this scenario, you can only read/write to the transactional store. What follows is a list of the currently supported features within Synapse Link for Azure Cosmos DB. 

| Category              | Description |[Apache Spark pool](../sql/on-demand-workspace-overview.md) | [Serverless SQL pool](../sql/on-demand-workspace-overview.md) |
| -------------------- | ----------------------------------------------------------- |----------------------------------------------------------- | ----------------------------------------------------------- |
| **Run-time Support** |Supported Azure Synapse runtime to access Azure Cosmos DB| ✓ | ✓ |
| **Azure Cosmos DB API support** | Supported Azure Cosmos DB API kind | SQL / MongoDB | SQL / MongoDB |
| **Object**  |Objects such as a table that can be created, pointing directly to Azure Cosmos DB container| Dataframe, View, Table | View |
| **Read**    | Type of Azure Cosmos DB container that can be read | OLTP / HTAP | HTAP  |
| **Write**   | Can the Azure Synapse runtime be used to write data to an Azure Cosmos DB container | Yes | No |

* If you write data into an Azure Cosmos DB container from Spark, this process happens through the transactional store of Azure Cosmos DB. It will impact the transactional performance of Azure Cosmos DB by consuming Request Units.
* Dedicated SQL pool integration through external tables is currently not supported.
 
## Supported code-generated actions for Spark

| Gesture              | Description |OLTP |HTAP  |
| -------------------- | ----------------------------------------------------------- |----------------------------------------------------------- |----------------------------------------------------------- |
| **Load to DataFrame** |Load and read data into a Spark DataFrame |✓| ✓ |
| **Create Spark table** |Create a table pointing to an Azure Cosmos DB container|✓| ✓ |
| **Write DataFrame to container** |Write data into a container|✓| ✓ |
| **Load streaming DataFrame from container** |Stream data using Azure Cosmos DB change feed|✓| ✓ |
| **Write streaming DataFrame to container** |Stream data using Azure Cosmos DB change feed|✓| ✓ |

## Supported code-generated actions for serverless SQL pool

| Gesture              | Description |OLTP |HTAP |
| -------------------- | ----------------------------------------------------------- |----------------------------------------------------------- |----------------------------------------------------------- |
| **Explore data** |Explore data from a container with familiar T-SQL syntax and automatic schema inference|X| ✓ |
| **Create views and build BI reports** |Create a SQL view to have direct access to a container for BI through serverless SQL pool |X| ✓ |
| **Join disparate data sources along with Azure Cosmos DB data** | Store results of query reading data from Azure Cosmos DB containers along with data in Azure Blob Storage or Azure Data Lake Storage using CETAS |X| ✓ |

## Next steps

* See how to [connect to Synapse Link for Azure Cosmos DB](../quickstart-connect-synapse-link-cosmos-db.md)
* [Learn how to query the Azure Cosmos DB Analytical Store with Spark 3](how-to-query-analytical-store-spark-3.md)
* [Learn how to query the Azure Cosmos DB Analytical Store with Spark 2](how-to-query-analytical-store-spark.md)
