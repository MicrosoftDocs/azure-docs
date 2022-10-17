---
title: 'Quickstart: Connect to Azure Synapse Link for Azure Cosmos DB'
description: How to connect an Azure Cosmos DB to a Synapse workspace with Synapse Link
author: Rodrigossz
ms.service: synapse-analytics
ms.subservice: synapse-link
ms.topic: quickstart
ms.date: 04/21/2020
ms.author: rosouz
ms.reviewer: sngun
ms.custom: cosmos-db, mode-other, ignite-2022
---

# Quickstart: Connect to Azure Synapse Link for Azure Cosmos DB

This article describes how to access an Azure Cosmos DB database from Azure Synapse Analytics studio with Synapse Link. 

## Prerequisites

Before you connect an Azure Cosmos DB account to your workspace, there are a few things that you need.

* Existing Azure Cosmos DB account or create a new account following this [quickstart](../cosmos-db/how-to-manage-database-account.md)
* Existing Synapse workspace or create a new workspace following this [quickstart](./quickstart-create-workspace.md) 

## Enable Azure Cosmos DB analytical store

To run large-scale analytics into Azure Cosmos DB without impacting your operational performance, we recommend enabling Synapse Link for Azure Cosmos DB. This function brings HTAP capability to a container and built-in support in Azure Synapse. Follow this quickstart to enable Synapse Link for Azure Cosmos DB containers.

## Navigate to Synapse Studio

From your Synapse workspace, select **Launch Synapse Studio**. On the Synapse Studio home page, select **Data, which will take you to the **Data Object Explorer**.

## Connect an Azure Cosmos DB database to a Synapse workspace

Connecting an Azure Cosmos DB database is done as linked service. An Azure Cosmos DB linked service enables users to browse and explore data, read, and write from Apache Spark for Azure Synapse Analytics or SQL into Azure Cosmos DB.

From the Data Object Explorer, you can directly connect an Azure Cosmos DB database by doing the following steps:

1. Select ***+*** icon near Data
2. Select **Connect to external data**
3. Select the API that you want to connect to: SQL or MongoDB
4. Select ***Continue***
5. Name the linked service. The name will be displayed in the Object Explorer and used by Synapse run-times to connect to the database and containers. We recommend using a friendly name.
6. Select the **Cosmos DB account name** and **database name**
7. (Optional) If no region is specified, Synapse run-time operations will be routed toward the nearest region where the analytical store is enabled. However, you can set manually the region where you want your users to access the Azure Cosmos DB analytical store. Select **Additional connection properties** and then **New**. Under **Property Name**, write ***PreferredRegions*** and set the **Value** to the region you want (example: WestUS2, there is no space between words and numbers)
8. Select ***Create***

Azure Cosmos DB databases are visible under the tab **Linked** in the Azure Cosmos DB section. You can differentiate an HTAP enabled Azure Cosmos DB container from an OLTP only container with the following icons:

**Synapse container**:

![HTAP container](./media/quickstart-connect-synapse-link-cosmosdb/htap-container.png)

**OLTP only container**:

![OLTP container](./media/quickstart-connect-synapse-link-cosmosdb/oltp-container.png)

## Quickly interact with code-generated actions

When you right-click into a container, you'll have a list of gestures that will trigger a Spark or SQL run-time. Writing into a container will happen through the Transactional Store of Azure Cosmos DB and will consume Request Units.  

## Next steps

* [Learn what is supported between Synapse and Azure Cosmos DB](./synapse-link/concept-synapse-link-cosmos-db-support.md)
* [Learn how to query an analytical store with Apache Spark 3 for Azure Synapse Analytics](synapse-link/how-to-query-analytical-store-spark-3.md)
* [Learn how to query an analytical store with Apache Spark 2 for Azure Synapse Analytics](synapse-link/how-to-query-analytical-store-spark.md)
