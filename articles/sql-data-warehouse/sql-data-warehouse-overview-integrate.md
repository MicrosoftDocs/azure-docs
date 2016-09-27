<properties
   pageTitle="Build integrated solutions with SQL Data Warehouse | Microsoft Azure"
   description="Tools and partners with solutions that integrate with SQL Data Warehouse. "
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="lodipalm"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/31/2016"
   ms.author="lodipalm;barbkess;sonyama"/>

#Leverage other services with SQL Data Warehouse
In addition to its core functionality, SQL Data Warehouse enables users to leverage many of the other services in Azure alongside it.  Specifically, we have currently taken steps to deeply integrate with the following:

+ Power BI
+ Azure Data Factory
+ Azure Machine Learning
+ Azure Stream Analytics

We are working to connect with more services across the Azure ecosystem.

##Power BI
Power BI integration allows you to leverage the compute power of SQL Data Warehouse with the dynamic reporting and visualization of Power BI. Power BI integration currently includes:

+ **Direct Connect**: A more advanced connection with logical pushdown against SQL Data Warehouse.  This provides faster analysis on a larger scale.
+ **Open in Power BI**: The 'Open in Power BI' button passes instance information to Power BI, allowing for a more seamless connection.

See [Integrate with Power BI](./sql-data-warehouse-integrate-power-bi.md) or the [Power BI documentation](http://blogs.msdn.com/b/powerbi/archive/2015/06/24/exploring-azure-sql-data-warehouse-with-power-bi.aspx) for more information.

##Azure Data Factory
Azure Data Factory gives users a managed platform to create complex Extract-Load pipelines.  SQL Data Warehouse's integration with Azure Data Factory includes the following:

+ **Stored Procedures**: Orchestrate the execution of stored procedures on SQL Data Warehouse.
+ **Copy**: Use ADF to move data into SQL Data Warehouse.  This operation can use ADF's standard data movement mechanism or PolyBase under the covers. 

See [Integrate with Azure Data Factory](./sql-data-warehouse-integrate-azure-data-factory.md) or the [Azure Data Factory documentation](https://azure.microsoft.com/documentation/services/data-factory/) for more information.

##Azure Machine Learning
Azure Machine Learning is a fully managed analytics service which allows users to create intricate models leveraging a large set of predictive tools.  SQL Data Warehouse is supported as both a source and destination for these models with the following functionality:

+ **Read Data:** Drive models at scale using T-SQL against SQL Data Warehouse.
+ **Write Data:** Commit changes from any model back to SQL Data Warehouse.

See [Integrate with Azure Machine Learning](./sql-data-warehouse-integrate-azure-machine-learning.md) or the [Azure Machine Learning documentation](https://azure.microsoft.com/services/machine-learning/) for more information.

##Azure Stream Analytics
Azure Stream Analytics is a complex, fully managed infrastructure for processing and consuming event data generated from Azure Event Hub.  Integration with SQL Data Warehouse allows for streaming data to be effectively processed and stored alongside relational data enabling deeper, more advanced analysis.  

+ **Job Output:** Send output from Stream Analytics jobs directly to SQL Data Warehouse.

See [Integrate with Azure Stream Analytics](./sql-data-warehouse-integrate-azure-stream-analytics.md) or the [Azure Stream Analytics documentation](https://azure.microsoft.com/documentation/services/stream-analytics/) for more information.

<!--Image references-->

<!--Article references-->
[development overview]: sql-data-warehouse-overview-develop/

[Azure Data Factory]: sql-data-warehouse-integrate-azure-data-factory.md
[Azure Machine Learning]: sql-data-warehouse-integrate-azure-machine-learning.md
[Azure Stream Analytics]: sql-data-warehouse-integrate-azure-stream-analytics.md
[Power BI]: sql-data-warehouse-integrate-power-bi.md
[Partners]: sql-data-warehouse-partner-business-intelligence.md

<!--MSDN references-->

<!--Other Web references-->
