---
title: Connect to Synapse Link for Cosmos DB
description: How to connect a Cosmos DB to a Synapse workspace with Synapse Link
services: synapse-analytics 
author: acomet
ms.service: synapse-analytics 
ms.topic: quickstart
ms.subservice: 
ms.date: 04/21/2020
ms.author: acomet
ms.reviewer: jrasnick
---

# Connect to Synapse Link for Cosmos DB

This article describes how to access an Azure Cosmos database from Azure Synapse Analytics studio with Synapse Link. 

## Prerequisites

Before you connect a Cosmos DB account to your workspace, there are a few things that you need.

* Existing Cosmos DB account or create a new account following this [quickstart](https://docs.microsoft.com/azure/cosmos-db/how-to-manage-database-account)
* Existing Synapse workspace or create a new workspace following this [quickstart](https://docs.microsoft.com/azure/synapse-analytics/quickstart-create-workspace) 

## Enable Cosmos DB analytical store

To run large-scale analytics into Cosmos DB without impacting your operational performance, we recommend enabling  Synapse Link for Cosmos DB which bring HTAP capability to a container and built-in support in Azure Synapse. Follow this quickstart to enable Synapse Link  for Cosmos DB containers.

## Connect a Cosmos DB database to a Synapse workspace 

Connecting a Cosmos DB database is done as linked service. A Cosmos DB linked service enables users to browse and explore data, read, and write from Synapse Spark or SQL into Cosmos DB. 

From the Data Object Explorer, you can directly connect a Cosmos DB database by doing the following steps:
1. Select ***+*** icon near Data
2. Select **Connect to external data**
3. Select the API that you want to connect to: SQL or MongoDB
4. Select ***Continue***
5. Name the linked service. The name will be displayed in the Object Explorer and used by Synapse run-times to connect to the database and containers. We recommend using a friendly name.
6. Select the **Cosmos DB account name** and **database name**
7. Select ***Create***

Cosmos DB database are visible under the tab **Linked** in the Cosmos DB section. You can differentiate an HTAP enabled Cosmos DB container from an OLTP only container with the following icons:

**Synapse container**:

![HTAP container](./media/quickstart-connect-synapse-link-cosmosdb/htap-container.png)

**OLTP only container**:

![OLTP container](./media/quickstart-connect-synapse-link-cosmosdb/oltp-container.png)

## Quickly interact with code-generated actions

By right-clicking into a container, you have list of gestures that will trigger a Spark or SQL run-time. Writing into a container will happen through the Transactional Store of Cosmos DB and will consume Request Units.  

## Next steps

* [Learn what is supported between Synapse and Cosmos DB](./synapse-link/concept-synapse-link-cosmos-db-support.md)