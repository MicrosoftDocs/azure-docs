---
title: Supported features for Cosmos DB
description: Understand the current list of actions supported between Azure Synapse Analytics and Cosmos DB
services: synapse-analytics 
author: acomet
ms.service: synapse-analytics 
ms.topic: quickstart
ms.subservice: 
ms.date: 04/21/2020
ms.author: acomet
ms.reviewer: jrasnick
---

# Supported features between Azure Synapse Analytics and Cosmos DB

This article describes what functionalities are currently supported (and not supported) between Azure Synapse and Cosmos DB analytical store. 

## Azure Synapse support

Here is list of the currently supported features between Azure Synapse and Cosmos DB. 

| Category              | Description |Spark | SQL serverless | SQL provisioned |
| :-------------------- | :----------------------------------------------------------- |:----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **Azure Synapse Support** |Support for read or write by Azure Synapse run-time| ✓ | [Contact Us](mailto:AskSynapse@microsoft.com?subject=[Enable%20Preview%20Feature]%20SQL%20serverless%20for%20Cosmos%20DB)| n/a|
| **Cosmos DB API support** |API support as a Synapse Link| SQL / Mongo DB | SQL / Mongo DB | n/a|
| **Object**  |Objects such as table that can be created, pointing directly to  Cosmos DB collection| View, Table | View | n/a|
| **Read**    |Read data from a Cosmos DB collection| OLTP / HTAP | HTAP | n/a|
| **Write**   |Write data from Azure Synapse run-time into a Cosmos DB collection| OLTP | n/a | n/a|

Writing back into a Cosmos DB collection from Spark only happens through the transactional side of Cosmos DB and will impact the transactional performance of Cosmos DB. Data will be automatically replicated into the analytical store if analytical store is enabled at the database level.

## Supported code-generated actions for Spark

| Gesture              | Description |OLTP only collection |HTAP collection |
| :-------------------- | :----------------------------------------------------------- |:----------------------------------------------------------- |:----------------------------------------------------------- |
| **Stream data** |Stream data using Cosmos DB change feed|✓| ✓ |
| **Ingest into a collection** |Write back data into a collection with Spark|✓| ✓ |
| **Load to data frame** |Load and read data into a Spark dataframe |✓| ✓ |

## Supported code-generated actions for SQL serverless

| Gesture              | Description |OLTP only collection |HTAP collection |
| :-------------------- | :----------------------------------------------------------- |:----------------------------------------------------------- |:----------------------------------------------------------- |
| **Select top 100** |Preview top 100 items from a collection|X| ✓ |
| **Create view** |Create a view to directly access data in the collection through Synapse and BI tool|X| ✓ |

## Next steps

[See the Connect to Cosmos DB quickstart](../quickstart-connect-cosmos-db.md)