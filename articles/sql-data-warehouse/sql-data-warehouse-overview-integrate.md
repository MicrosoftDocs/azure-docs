---
title: Build integrated solutions with SQL Data Warehouse | Microsoft Docs
description: 'Tools and partners with solutions that integrate with SQL Data Warehouse. '
services: sql-data-warehouse
author: kavithaj
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: consume
ms.date: 04/17/2018
ms.author: kavithaj
ms.reviewer: igorstan
---

# Integrate other services with SQL Data Warehouse
In addition to its core functionality, SQL Data Warehouse enables users to integrate with many of the other services in Azure. Some of these services include:

* Power BI
* Azure Data Factory
* Azure Machine Learning
* Azure Stream Analytics

SQL Data Warehouse continues to integrate with more services across Azure, and more [Integration partners](sql-data-warehouse-partner-data-integration.md).

## Power BI
Power BI integration allows you to combine the compute power of SQL Data Warehouse with the dynamic reporting and visualization of Power BI. Power BI integration currently includes:

* **Direct Connect**: A more advanced connection with logical pushdown against SQL Data Warehouse. Pushdown provides faster analysis on a larger scale.
* **Open in Power BI**: The 'Open in Power BI' button passes instance information to Power BI for a simplifed way to connect.

For more information, see [Integrate with Power BI](sql-data-warehouse-get-started-visualize-with-power-bi.md), or the [Power BI documentation](http://blogs.msdn.com/b/powerbi/archive/2015/06/24/exploring-azure-sql-data-warehouse-with-power-bi.aspx).

## Azure Data Factory
Azure Data Factory gives users a managed platform to create complex extract and load pipelines. SQL Data Warehouse's integration with Azure Data Factory includes:

* **Stored Procedures**: Orchestrate the execution of stored procedures on SQL Data Warehouse.
* **Copy**: Use ADF to move data into SQL Data Warehouse. This operation can use ADF's standard data movement mechanism or PolyBase under the covers. 

For more information, see [Integrate with Azure Data Factory](sql-data-warehouse-get-started-visualize-with-power-bi.md).

## Azure Machine Learning
Azure Machine Learning is a fully managed analytics service, which allows you to create intricate models using a large set of predictive tools. SQL Data Warehouse is supported as both a source and destination for these models with the following functionality:

* **Read Data:** Drive models at scale using T-SQL against SQL Data Warehouse.
* **Write Data:** Commit changes from any model back to SQL Data Warehouse.

For more information, see [Integrate with Azure Machine Learning](sql-data-warehouse-get-started-analyze-with-azure-machine-learning.md).

## Azure Stream Analytics
Azure Stream Analytics is a complex, fully managed infrastructure for processing and consuming event data generated from Azure Event Hub.  Integration with SQL Data Warehouse allows for streaming data to be effectively processed and stored alongside relational data enabling deeper, more advanced analysis.  

* **Job Output:** Send output from Stream Analytics jobs directly to SQL Data Warehouse.

For more information, see [Integrate with Azure Stream Analytics](sql-data-warehouse-integrate-azure-stream-analytics.md).

## Next steps
To integrate with Azure SQL Database, see [Configure SQL Database elastic query](tutorial-elastic-query-with-sql-datababase-and-sql-data-warehouse.md)

