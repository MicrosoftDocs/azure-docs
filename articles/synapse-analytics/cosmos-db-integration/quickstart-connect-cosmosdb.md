---
title: How to connect a Cosmos DB database to a workspace  
description: How to connect a Cosmos DB database to a workspace
services: synapse-analytics 
author: acomet
ms.service: synapse-analytics 
ms.topic: quickstart
ms.subservice: 
ms.date: 04/21/2020
ms.author: acomet
ms.reviewer: jrasnick
---

# Connect and access an Azure Cosmos DB database in Azure Synapse Analytics

This article describes how to access an Azure Cosmos database from Azure Synapse Analytics studio.

## Prerequisites
Before you connect a Cosmos DB account to your workspace, there are a few things that you need.

* Have an existing Cosmos DB account or create a new account following this [quickstart](https://docs.microsoft.com/azure/cosmos-db/how-to-manage-database-account)
* Have an existing Synapse workspace or create a new workspace following this [quickstart](https://docs.microsoft.com/azure/synapse-analytics/quickstart-create-workspace) 

## Enable Cosmos DB analytical store

To run large-scale analytics into Cosmos DB without impacting your operational performance, we recommend using HTAP collections. HTAP collections can be enabled through the analytical store. Follow this [quickstart]() to enable HTAP containers.

## Connect a Cosmos DB database to a Synapse workspace 

Connecting a Cosmos DB database is done as linked service. A Cosmos DB linked service enables users to browse and explore data, read, and write from Synapse Spark or SQL into Cosmos DB. 

From the Data Object Explorer, you can directly connect a Cosmos DB database by doing the following steps:
1. Select ***+*** icon near Data
2. Select **Connect to external data**
3. Select the API that you want to connect to: SQL or MongoDB
4. Select ***Continue***
5. Name the linked service. The name will be displayed in the Object Explorer and used by Synapse run-times to connect to the database and collections. We recommend using a friendly name.
6. Select the **Cosmos DB account name** and **database name**
7. Select ***Create***

The Cosmos DB database, should be visible under the tab **Linked** in the Cosmos DB section. You can differentiate an HTAP enabled Cosmos DB collection from an OLTP only collection with the following icons:

**HTAP collection**:

![HTAP collection](./media/htap-collection.png)

**OLTP only collection**:

![OLTP collection](./media/oltp-collection.png)

## Quickly interact with code-generated actions

By right-clicking into a collection, you can use the following gesture that will trigger a Spark or SQL run-time. 

## Next steps
* [Learn what is supported between Synapse and Cosmos DB](./concept-cosmosdb-support.md)