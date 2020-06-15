---
title: Build integrated solutions
description: Solution tools and partners that integrate with a Synapse SQL pool.
services: synapse-analytics
author: mlee3gsd 
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: 
ms.date: 04/17/2018
ms.author: martinle
ms.reviewer: igorstan
ms.custom: seo-lt-2019
---

# Integrate other services with a Synapse SQL pool (data warehouse)

The SQL pool capability within Azure Synapse Analytics enables users to integrate with many of the other services in Azure. Using Synapse SQL, you can create a data warehouse via its SQL pool resource, which can then utilize several additional services, some of which include:

* Power BI
* Azure Data Factory
* Azure Machine Learning
* Azure Stream Analytics

For more information about integration services across Azure, review the [Integration partners](sql-data-warehouse-partner-data-integration.md)article.

## Power BI

Power BI integration allows you to combine the compute power of a data warehouse with the dynamic reporting and visualization of Power BI. Power BI integration currently includes:

* **Direct Connect**: A more advanced connection with logical pushdown against a data warehouse provisioned using SQL pool. Pushdown provides faster analysis on a larger scale.
* **Open in Power BI**: The 'Open in Power BI' button passes instance information to Power BI for a simplified way to connect.

For more information, see [Integrate with Power BI](sql-data-warehouse-get-started-visualize-with-power-bi.md), or the [Power BI documentation](https://powerbi.microsoft.com/blog/exploring-azure-sql-data-warehouse-with-power-bi/).

## Azure Data Factory

Azure Data Factory gives users a managed platform to create complex extract and load pipelines. SQL pool integration with Azure Data Factory includes:

* **Stored Procedures**: Orchestrate the execution of stored procedures.
* **Copy**: Use ADF to move data into SQL pool. This operation can use ADF's standard data movement mechanism or PolyBase under the covers.

For more information, see [Integrate with Azure Data Factory](../../data-factory/load-azure-sql-data-warehouse.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

## Azure Machine Learning

Azure Machine Learning is a fully managed analytics service, which allows you to create intricate models using a large set of predictive tools. SQL pool is supported as both a source and destination for these models, and has the following functionality:

* **Read Data:** Drive models at scale using T-SQL against SQL pool.
* **Write Data:** Commit changes from any model back to SQL pool.

For more information, see [Integrate with Azure Machine Learning](sql-data-warehouse-get-started-analyze-with-azure-machine-learning.md).

## Azure Stream Analytics

Azure Stream Analytics is a complex, fully managed infrastructure for processing and consuming event data generated from Azure Event Hub.  Integration with SQL pool allows for streaming data to be effectively processed and stored alongside relational data enabling deeper, more advanced analysis.  

* **Job Output:** Send output from Stream Analytics jobs directly to SQL pool.

For more information, see [Integrate with Azure Stream Analytics](sql-data-warehouse-integrate-azure-stream-analytics.md).
