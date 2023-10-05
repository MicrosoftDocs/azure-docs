---
title: Build integrated solutions
description: Solution tools and partners that integrate with a dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 04/17/2018
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom: seo-lt-2019
---

# Integrate other services with a dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics.

The dedicated SQL pool (formerly SQL DW) capability within Azure Synapse Analytics enables users to integrate with many of the other services in Azure. A dedicated SQL pool can  utilize several additional services, some of which include:

* Power BI
* Azure Data Factory
* Azure Machine Learning
* Azure Stream Analytics

For more information about integration services across Azure, review the [Integration partners](sql-data-warehouse-partner-data-integration.md)article.

## Power BI

Power BI integration allows you to combine the compute power of a data warehouse with the dynamic reporting and visualization of Power BI. Power BI integration currently includes:

* **Direct Connect**: A more advanced connection with logical pushdown against a data warehouse provisioned using dedicated SQL pool (formerly SQL DW). Pushdown provides faster analysis on a larger scale.
* **Open in Power BI**: The 'Open in Power BI' button passes instance information to Power BI for a simplified way to connect.

For more information, see [Integrate with Power BI](/power-bi/connect-data/service-azure-sql-data-warehouse-with-direct-connect), or the [Power BI documentation](https://powerbi.microsoft.com/blog/exploring-azure-sql-data-warehouse-with-power-bi/).

## Azure Data Factory

Azure Data Factory gives users a managed platform to create complex extract and load pipelines. Dedicated SQL pool (formerly SQL DW) integration with Azure Data Factory includes:

* **Stored Procedures**: Orchestrate the execution of stored procedures.
* **Copy**: Use ADF to move data into dedicated SQL pool (formerly SQL DW). This operation can use ADF's standard data movement mechanism or PolyBase under the covers.

For more information, see [Integrate with Azure Data Factory](../../data-factory/load-azure-sql-data-warehouse.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json).

## Azure Machine Learning

Azure Machine Learning is a fully managed analytics service, which allows you to create intricate models using a large set of predictive tools. Dedicated SQL pool (formerly SQL DW) is supported as both a source and destination for these models, and has the following functionality:

* **Read Data:** Drive models at scale using T-SQL against a dedicated SQL pool (formerly SQL DW).
* **Write Data:** Commit changes from any model back to a dedicated SQL pool (formerly SQL DW).

For more information, see [Integrate with Azure Machine Learning](sql-data-warehouse-get-started-analyze-with-azure-machine-learning.md).

## Azure Stream Analytics

Azure Stream Analytics is a complex, fully managed infrastructure for processing and consuming event data generated from Azure Event Hub.  Integration with dedicated SQL pool (formerly SQL DW) allows for streaming data to be effectively processed and stored alongside relational data enabling deeper, more advanced analysis.  

* **Job Output:** Send output from Stream Analytics jobs directly to a dedicated SQL pool (formerly SQL DW).

For more information, see [Integrate with Azure Stream Analytics](sql-data-warehouse-integrate-azure-stream-analytics.md).
