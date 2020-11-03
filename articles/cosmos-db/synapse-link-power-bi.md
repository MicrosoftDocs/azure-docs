---
title: Power BI and serverless SQL pool to analyze Azure Cosmos DB data with Synapse Link
description: Learn how to build a Synapse SQL serverless database and views over Synapse Link for Azure Cosmos DB, query the Azure Cosmos DB containers and then build a model with Power BI over those views.
author: ArnoMicrosoft
ms.service: cosmos-db
ms.topic: how-to
ms.date: 09/22/2020
ms.author: acomet
---

# Use Power BI and serverless SQL pool to analyze Azure Cosmos DB data with Synapse Link (preview)

[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)][!INCLUDE[appliesto-mongodb-apis](includes/appliesto-mongodb-api.md)]

In this article, you learn how to build a serverless SQL pool database and views over Synapse Link for Azure Cosmos DB. You will query the Azure Cosmos DB containers and then build a model with Power BI over those views to reflect that query.

In this scenario, you will use dummy data about Surface product sales in a partner retail store. You will analyze the revenue per store based on the proximity to large households and the impact of advertising for a specific week. In this article, you create two views named **RetailSales** and **StoreDemographics** and a query between them. You can get the sample product data from this [GitHub](https://github.com/Azure-Samples/Synapse/tree/master/Notebooks/PySpark/Synapse%20Link%20for%20Cosmos%20DB%20samples/Retail/RetailData) repo.

## Prerequisites

Make sure to create the following resources before you start:

* [Create an Azure Cosmos DB account of kind SQL(core) or MongoDB.](create-cosmosdb-resources-portal.md)

* Enable Azure Synapse Link for your [Azure Cosmos account](configure-synapse-link.md#enable-synapse-link)

* Create a database within the Azure Cosmos account and two containers that have [analytical store enabled.](configure-synapse-link.md#create-analytical-ttl)

* Load products data into the Azure Cosmos containers as described in this [batch data ingestion](https://github.com/Azure-Samples/Synapse/blob/master/Notebooks/PySpark/Synapse%20Link%20for%20Cosmos%20DB%20samples/Retail/spark-notebooks/pyspark/1CosmoDBSynapseSparkBatchIngestion.ipynb) notebook.

* [Create a Synapse workspace](../synapse-analytics/quickstart-create-workspace.md) named **SynapseLinkBI**.

* [Connect the Azure Cosmos database to the Synapse workspace](../synapse-analytics/synapse-link/how-to-connect-synapse-link-cosmos-db.md?toc=/azure/cosmos-db/toc.json&bc=/azure/cosmos-db/breadcrumb/toc.json).

## Create a database and views

From the Synapse workspace go the **Develop** tab, select the **+** icon, and select **SQL Script**.

:::image type="content" source="./media/synapse-link-power-bi/add-sql-script.png" alt-text="Add a SQL script to the Synapse Analytics workspace":::

Every workspace comes with a serverless SQL endpoint. After creating a SQL script, from the tool bar on the top connect to **SQL on-demand**.

:::image type="content" source="./media/synapse-link-power-bi/enable-sql-on-demand-endpoint.png" alt-text="Enable the SQL script to use the serverless SQL endpoint in the workspace":::

Create a new database, named **RetailCosmosDB**, and a SQL view over the Synapse Link enabled containers. The following command shows how to create a database:

```sql
-- Create database
Create database RetailCosmosDB
```

Next, create multiple views across different Synapse Link enabled Azure Cosmos containers. Views will allow you to use T-SQL to join and query Azure Cosmos DB data sitting in different containers.  Make sure to select the **RetailCosmosDB** database when creating the views.

The following scripts show how to create views on each container. For simplicity, let’s use the [automatic schema inference](analytical-store-introduction.md#analytical-schema) feature of Synapse SQL serverless over Synapse Link enabled containers:


### RetailSales view:

```sql
-- Create view for RetailSales container
CREATE VIEW  RetailSales
AS  
SELECT  *
FROM OPENROWSET (
    'CosmosDB', N'account=<Your Azure Cosmos account name>;database=<Your Azure Cosmos database name>;region=<Your Azure Cosmos DB Region>;key=<Your Azure Cosmos DB key here>',RetailSales)
AS q1
```

Make sure to insert your Azure Cosmos DB region and the primary key in the previous SQL script. All the characters in the region name should be in lower case without spaces. Unlike the other parameters of the `OPENROWSET` command, the container name parameter should be specified without quotes around it.

### StoreDemographics view:

```sql
-- Create view for StoreDemographics container
CREATE VIEW StoreDemographics
AS  
SELECT  *
FROM OPENROWSET (
    'CosmosDB', N'account=<Your Azure Cosmos account name>;database=<Your Azure Cosmos database name>;region=<Your Azure Cosmos DB Region>;key=<Your Azure Cosmos DB key here>', StoreDemographics)
AS q1
```

Now run the SQL script by selecting the **Run** command.

## Query the views

Now that the two views are created, let’s define the query to join those two views as follows:

```sql
SELECT 
sum(p.[revenue]) as revenue
,p.[advertising]
,p.[storeId]
,p.[weekStarting]
,q.[largeHH]
 FROM [dbo].[RetailSales] as p
INNER JOIN [dbo].[StoreDemographics] as q ON q.[storeId] = p.[storeId]
GROUP BY p.[advertising], p.[storeId], p.[weekStarting], q.[largeHH]
```

Select **Run** that gives the following table as result:

:::image type="content" source="./media/synapse-link-power-bi/join-views-query-results.png" alt-text="Query results after joining the StoreDemographics and RetailSales views":::

## Model views over containers with Power BI

Next open the Power BI desktop and connect to the serverless SQL endpoint by using the following steps:

1. Open the Power BI Desktop application. Select **Get data** and select **more**.

1. Choose **Azure Synapse Analytics (SQL DW)** from the list of connection options.

1. Enter the name of the SQL endpoint where the database is located. Enter `SynapseLinkBI-ondemand.sql.azuresynapse.net` within the **Server** field. In this example,  **SynapseLinkBI** is  name of the workspace. Replace it if you have given a different name to your workspace. Select **Direct Query** for data connectivity mode and then **OK**.

1. Select the preferred authentication method such as Azure AD.

1. Select the **RetailCosmosDB** database and the **RetailSales**, **StoreDemographics** views.

1. Select **Load** to load the two views into the direct query mode.

1. Select **Model** to create a relationship between the two views through the **storeId** column.

1. Drag the **StoreId** column from the **RetailSales** view towards the **StoreId** column in the **StoreDemographics** view.

1. Select the Many to one (*:1) relationship because there are multiple rows with the same store ID in the **RetailSales** view. **StoreDemographics** has only one store ID row (it is a dimension table).

Now navigate to the **report** window and create a report to compare the relative importance of household size to the average revenue per store based on the scattered representation of revenue and LargeHH index:

1. Select **Scatter chart**.

1. Drag and drop **LargeHH** from the **StoreDemographics** view into the X-axis.

1. Drag and drop **Revenue** from **RetailSales** view into the Y-axis. Select **Average** to get the average sales per product per store and per week.

1. Drag and drop the **productCode** from **RetailSales** view into the legend to select a specific product line.
After you choose these options, you should see a graph like the following screenshot:

:::image type="content" source="./media/synapse-link-power-bi/household-size-average-revenue-report.png" alt-text="Report that compares the relative importance of household size to the average revenue per store":::

## Next steps

[Use T-SQL to query Azure Cosmos DB data using Azure Synapse Link](../synapse-analytics/sql/query-cosmos-db-analytical-store.md)

Use serverless SQL pool to [analyze Azure Open Datasets and visualize the results in Azure Synapse Studio](../synapse-analytics/sql/tutorial-data-analyst.md)
