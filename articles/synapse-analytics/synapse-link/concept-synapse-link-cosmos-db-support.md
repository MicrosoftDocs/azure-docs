---
title: Synapse Link for Cosmos DB supported features
description: Understand the current list of actions supported by Synapse Link for Cosmos DB
services: synapse-analytics 
author: acomet
ms.service: synapse-analytics 
ms.topic: quickstart
ms.subservice: 
ms.date: 04/21/2020
ms.author: acomet
ms.reviewer: jrasnick
---

# Synapse Link for Azure Cosmos DB supported features

This article describes what functionalities are currently supported in Synapse Link for Azure Cosmos DB. 

## Azure Synapse support

Here is list of the currently supported features within Synapse Link for Cosmos DB. 

| Category              | Description |Spark | SQL serverless |
| :-------------------- | :----------------------------------------------------------- |:----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **Run-time Support** |Support for read or write by Azure Synapse run-time| ✓ | [Contact Us](mailto:AskSynapse@microsoft.com?subject=[Enable%20Preview%20Feature]%20SQL%20serverless%20for%20Cosmos%20DB)|
| **Cosmos DB API support** |API support as a Synapse Link| SQL / Mongo DB | SQL / Mongo DB |
| **Object**  |Objects such as table that can be created, pointing directly to Azure Cosmos DB container| View, Table | View |
| **Read**    |Read data from an Azure Cosmos DB container| OLTP / HTAP | HTAP |
| **Write**   |Write data from run-time into an Azure Cosmos DB container| OLTP | n/a |

Writing back into an Azure Cosmos DB container from Spark only happens through the transactional store of Azure Cosmos DB and will impact the transactional performance of Azure Cosmos DB by consuming Request Units. Data will be automatically replicated into the analytical store if analytical store is enabled at the database level.

## Supported code-generated actions for Spark

| Gesture              | Description |OLTP only container |HTAP container |
| :-------------------- | :----------------------------------------------------------- |:----------------------------------------------------------- |:----------------------------------------------------------- |
| **Load to DataFrame** |Load and read data into a Spark DataFrame |X| ✓ |
| **Create Spark table** |Create a table pointing to an Azure Cosmos DB container|X| ✓ |
| **Write DataFrame to container** |Write data into a container|✓| ✓ |
| **Load streaming DataFrame from container** |Stream data using Azure Cosmos DB change feed|✓| ✓ |
| **Write streaming DataFrame to container** |Stream data using Azure Cosmos DB change feed|✓| ✓ |



## Supported code-generated actions for SQL serverless

| Gesture              | Description |OLTP only container |HTAP container |
| :-------------------- | :----------------------------------------------------------- |:----------------------------------------------------------- |:----------------------------------------------------------- |
| **Select top 100** |Preview top 100 items from a container|X| ✓ |
| **Create view** |Create a view to directly have BI access in a container through Synapse SQL|X| ✓ |

## Next steps

See the [Connect to Synapse Link for Azure Cosmos DB quickstart](../quickstart-connect-synapse-link-cosmos-db.md)