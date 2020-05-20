---
title: 'Connect to different data sources from Azure Databricks '
description: Learn how to connect to Azure SQL Database, Azure Data Lake Store, blob storage, Cosmos DB, Event Hubs, and Azure SQL Data Warehouse from Azure Databricks.
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

The following list provides the data sources in Azure that you can use with Azure Databricks. For a complete list of data sources that can be used with Azure Databricks, see [Data sources for Azure Databricks](/azure/databricks/data/data-sources/index).

- [Azure SQL database](/azure/databricks/data/data-sources/sql-databases)

    This link provides the DataFrame API for connecting to SQL databases using JDBC and how to control the parallelism of reads through the JDBC interface. This topic provides detailed examples using the Scala API, with abbreviated Python and Spark SQL examples at the end.
- [Azure Data Lake Storage](/azure/databricks/data/data-sources/azure/azure-datalake-gen2)

    This link provides examples on how to use the Azure Active Directory service principal to authenticate with Azure Data Lake Storage. It also provides instructions on how to access the data in Azure Data Lake Storage from Azure Databricks.

- [Azure Blob Storage](/azure/databricks/data/data-sources/azure/azure-storage)

    This link provides examples on how to directly access Azure Blob Storage from Azure Databricks using access key or the SAS for a given container. The link also provides info on how to access the Azure Blob Storage from Azure Databricks using the RDD API.

- [Azure Cosmos DB](/azure/databricks/data/data-sources/azure/cosmosdb-connector)

    This link provides instructions on how to use the [Azure Cosmos DB Spark connector](https://github.com/Azure/azure-cosmosdb-spark) from Azure Databricks to access data in Azure Cosmos DB.

- [Azure Event Hubs](/azure/event-hubs/event-hubs-spark-connector)

    This link provides instructions on how to use the [Azure Event Hubs Spark connector](https://github.com/Azure/azure-event-hubs-spark) from Azure Databricks to access data in Azure Event Hubs.

- [Azure SQL Data Warehouse](/azure/synapse-analytics/sql-data-warehouse/)

    This link provides instructions on how to use the Azure SQL Data Warehouse connector to connect from Azure Databricks.
    

## Next steps

To learn about sources from where you can import data into Azure Databricks, see [Data sources for Azure Databricks](/azure/databricks/data/data-sources/index).


