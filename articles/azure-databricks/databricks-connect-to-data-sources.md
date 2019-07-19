---
title: 'Connect to different data sources from Azure Databricks '
description: Learn how to connect to different data sources from Azure Databricks.
services: azure-databricks
author: mamccrea
ms.reviewer: jasonh
ms.service: azure-databricks
ms.workload: big-data
ms.topic: conceptual
ms.date: 03/21/2018
ms.author: mamccrea
---

# Connect to data sources from Azure Databricks

This article provides links to all the different data sources in Azure that can be connected to Azure Databricks. Follow the examples in these links to extract data from the Azure data sources (for example, Azure Blob Storage, Azure Event Hubs, etc.) into an Azure Databricks cluster, and run analytical jobs on them. 

## Prerequisites

* You must have an Azure Databricks workspace and a Spark cluster. Follow the instructions at [Get started with Azure Databricks](quickstart-create-databricks-workspace-portal.md).

## Data sources for Azure Databricks

The following list provides the data sources in Azure that you can use with Azure Databricks. For a complete list of data sources that can be used with Azure Databricks, see [Data sources for Azure Databricks](https://docs.azuredatabricks.net/spark/latest/data-sources/index.html).

- [Azure SQL database](https://docs.azuredatabricks.net/spark/latest/data-sources/sql-databases.html)

    This link provides the DataFrame API for connecting to SQL databases using JDBC and how to control the parallelism of reads through the JDBC interface. This topic provides detailed examples using the Scala API, with abbreviated Python and Spark SQL examples at the end.
- [Azure Data Lake Store](https://docs.azuredatabricks.net/spark/latest/data-sources/azure/azure-datalake-gen2.html)

    This link provides examples on how to use the Azure Active Directory service principal to authenticate with Data Lake Store. It also provides instructions on how to access the data in Data Lake Store from Azure Databricks.

- [Azure Blob Storage](https://docs.azuredatabricks.net/spark/latest/data-sources/azure/azure-storage.html)

    This link provides examples on how to directly access Azure Blob Storage from Azure Databricks using access key or the SAS for a given container. The link also provides info on how to access the Azure Blob Storage from Azure Databricks using the RDD API.

- [Azure Cosmos DB](https://docs.azuredatabricks.net/spark/latest/data-sources/azure/cosmosdb-connector.html)

    This link provides instructions on how to use the [Azure Cosmos DB Spark connector](https://github.com/Azure/azure-cosmosdb-spark) from Azure Databricks to access data in Azure Cosmos DB.

- [Azure Event Hubs](https://docs.azuredatabricks.net/spark/latest/data-sources/azure/eventhubs-connector.html)

    This link provides instructions on how to use the [Azure Event Hubs Spark connector](https://github.com/Azure/azure-event-hubs-spark) from Azure Databricks to access data in Azure Event Hubs.

- [Azure SQL Data Warehouse](https://docs.azuredatabricks.net/spark/latest/data-sources/azure/sql-data-warehouse.html)

    This link provides instructions on how to use the Azure SQL Data Warehouse connector to connect from Azure Databricks.
    

## Next steps

To learn about sources from where you can import data into Azure Databricks, see [Data sources for Azure Databricks](https://docs.azuredatabricks.net/spark/latest/data-sources/index.html#).


