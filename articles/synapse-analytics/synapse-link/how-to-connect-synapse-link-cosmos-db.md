---
title: Connect to Azure Synapse Link (preview) for Azure Cosmos DB
description: How to connect an Azure Cosmos DB to a Synapse workspace with Azure Synapse Link
services: synapse-analytics 
author: ArnoMicrosoft
ms.service: synapse-analytics 
ms.topic: quickstart
ms.subservice: 
ms.date: 04/21/2020
ms.author: acomet
ms.reviewer: jrasnick
---

# Connect to Azure Synapse Link (preview) for Azure Cosmos DB

This article describes how to access an Azure Cosmos DB database from Azure Synapse Analytics Studio with Azure Synapse Link.

## Prerequisites

Before you connect an Azure Cosmos DB database to your workspace, you'll need the following:

> [!IMPORTANT]
> Azure Synapse Link for Azure Cosmos DB is currently supported for workspaces that do not have managed virtual network enabled. 

* Existing Azure Cosmos DB database or create a new account following this [quickstart](https://docs.microsoft.com/azure/cosmos-db/how-to-manage-database-account)
* Existing Synapse workspace or create a new workspace following this [quickstart](https://docs.microsoft.com/azure/synapse-analytics/quickstart-create-workspace) 

## Enable Azure Cosmos DB analytical store

To run large-scale analytics into Azure Cosmos DB without impacting your operational performance, we recommend enabling Synapse Link for Azure Cosmos DB. Synapse Link brings HTAP capability to a container and built-in support in Azure Synapse.

## Navigate to Synapse Studio

From your Synapse workspace, select **Launch Synapse Studio**. On the Synapse Studio home page, select **Data, which will take you to the **Data Object Explorer**.

## Connect an Azure Cosmos DB database to a Synapse workspace

Connecting an Azure Cosmos DB database is done as a linked service. An Azure Cosmos DB linked service enables users to browse and explore data, read, and write from Apache Spark for Azure Synapse Analytics or SQL into Azure Cosmos DB.

From the Data Object Explorer, you can directly connect to an Azure Cosmos DB database by doing the following steps:

1. Select ***+*** icon near Data
2. Select **Connect to external data**
3. Select the API that you want to connect to: SQL API or API for MongoDB
4. Select ***Continue***
5. Name the linked service. The name will be displayed in the Object Explorer and used by Synapse run-times to connect to the database and containers. We recommend using a friendly name.
6. Select the **Azure Cosmos DB account name** and **database name**
7. (Optional) If no region is specified, Synapse run-time operations will be routed toward the nearest region where the analytical store is enabled. However, you can set manually which region you want your users to access Azure Cosmos DB Analytical Store. Select **Additional connection properties** and then **New**. Under **Property Name**, write ***PreferredRegions*** and set the **Value** to the region you want (example: WestUS2, there is no space between words and number)
8. Select ***Create***

Azure Cosmos DB databases are visible under the tab **Linked** in the Azure Cosmos DB section. With Azure Cosmos DB, you can differentiate an HTAP enabled container from an OLTP only container through the following icons:

**OLTP only container**:

![OLTP container](../media/quickstart-connect-synapse-link-cosmosdb/oltp-container.png)

**HTAP enabled container**:

![HTAP container](../media/quickstart-connect-synapse-link-cosmosdb/htap-container.png)

## Quickly interact with code-generated actions

By right-clicking into a container, you have list of gestures that will trigger a Spark or SQL run-time. Writing into a container will happen through the Transactional Store of Azure Cosmos DB and will consume Request Units.  

## Next steps

* [Learn what is supported between Synapse and Azure Cosmos DB](./concept-synapse-link-cosmos-db-support.md)
* [Learn how to query the analytical store with Spark](./how-to-query-analytical-store-spark.md)