---
title: Connect to Azure Synapse Link for Azure Cosmos DB
description: Learn how to connect an Azure Cosmos DB database to an Azure Synapse workspace with Azure Synapse Link.
author: Rodrigossz
ms.service: synapse-analytics
ms.topic: quickstart
ms.subservice: synapse-link
ms.date: 03/02/2021
ms.author: rosouz
ms.reviewer: sngun
ms.custom: cosmos-db, mode-other
---

# Connect to Azure Synapse Link for Azure Cosmos DB

This article describes how to access an Azure Cosmos DB database from Azure Synapse Analytics Studio with Azure Synapse Link.

## Prerequisites

Before you connect an Azure Cosmos DB database to your workspace, you'll need an:

* Existing Azure Cosmos DB database, or create a new account by following the steps in [Quickstart: Manage an Azure Cosmos DB account](../../cosmos-db/how-to-manage-database-account.md).
* Existing Azure Synapse workspace, or create a new workspace by following the steps in [Quickstart: Create a Synapse workspace](../quickstart-create-workspace.md).

## Enable Synapse Link on an Azure Cosmos DB database account

To run large-scale analytics into Azure Cosmos DB without affecting your operational performance, we recommend enabling Synapse Link for Azure Cosmos DB. Synapse Link brings HTAP capability to a container and built-in support in Azure Synapse.

## Go to Synapse Studio

From your Azure Synapse workspace, select **Launch Synapse Studio**. On the Synapse Studio home page, select **Data**, which takes you to the Data Object Explorer.

## Connect an Azure Cosmos DB database to an Azure Synapse workspace

Connecting an Azure Cosmos DB database is done as a linked service. With an Azure Cosmos DB linked service, you can browse and explore data, read, and write from Apache Spark for Azure Synapse Analytics or SQL into Azure Cosmos DB.

From the Data Object Explorer, you can directly connect to an Azure Cosmos DB database by following these steps:

1. Select the **+** icon near **Data**.
1. Select **Connect to external data**.
1. Select the API that you want to connect to, for example, **SQL API** or **API for MongoDB**.
1. Select **Continue**.
1. Use a friendly name to name the linked service. The name will appear in the Data Object Explorer and is used by Azure Synapse runtimes to connect to the database and containers.
1. Select the **Azure Cosmos DB account name** and the **database name**.
1. (Optional) If no region is specified, Azure Synapse runtime operations will be routed toward the nearest region where the analytical store is enabled. You can also manually set the region you want your users to use to access the Azure Cosmos DB analytical store. Select **Additional connection properties**, and then select **New**. Under **Property Name**, enter **PreferredRegions**. Set the **Value** to the region you want, for example, **WestUS2**. (There are no spaces between the words and the number.)
1. Select **Create**.

Azure Cosmos DB databases appear on the **Linked** tab under the **Azure Cosmos DB** section. With Azure Cosmos DB, you can differentiate an HTAP-enabled container from an OLTP-only container through the following icons:

**OLTP-only container**:

![Visualization that shows the OLTP container icon.](../media/quickstart-connect-synapse-link-cosmosdb/oltp-container.png)

**HTAP-enabled container**:

![Visualization that shows the HTAP container icon.](../media/quickstart-connect-synapse-link-cosmosdb/htap-container.png)

## Quickly interact with code-generated actions

By right-clicking into a container, you have a list of gestures that will trigger a Spark or SQL runtime. Writing into a container will happen through the Transactional Store of Azure Cosmos DB and will consume Request Units.  

## Next steps

* [Learn what is supported between Azure Synapse and Azure Cosmos DB](./concept-synapse-link-cosmos-db-support.md)
* [Configure private endpoints for Azure Cosmos DB analytical store](../../cosmos-db/analytical-store-private-endpoints.md)
* [Learn how to query the analytical store with Spark 3](./how-to-query-analytical-store-spark-3.md)
* [Learn how to query the analytical store with Spark 2](./how-to-query-analytical-store-spark.md)
