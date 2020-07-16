---
title: Azure SQL Database output from Azure Stream Analytics
description: This article describes data output options available in Azure Stream Analytics, including Power BI for analysis results.
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 05/8/2020
---

# Azure SQL Database output from Azure Stream Analytics

You can use [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) as an output for data that's relational in nature or for applications that depend on content being hosted in a relational database. Stream Analytics jobs write to an existing table in SQL Database. The table schema must exactly match the fields and their types in your job's output. You can also specify [Azure SQL Data Warehouse](https://azure.microsoft.com/documentation/services/sql-data-warehouse/) as an output via the SQL Database output option. To learn about ways to improve write throughput, see the [Stream Analytics with Azure SQL Database as output](stream-analytics-sql-output-perf.md) article.

You can also use [Azure SQL Managed Instance](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance) as an output. You have to [configure public endpoint in SQL Managed Instance](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-public-endpoint-configure) and then manually configure the following settings in Azure Stream Analytics. Azure virtual machine running SQL Server with a database attached is also supported by manually configuring the settings below.

The following table lists the property names and their description for creating a SQL Database output.

| Property name | Description |
| --- | --- |
| Output alias |A friendly name used in queries to direct the query output to this database. |
| Database | The name of the database where you're sending your output. |
| Server name | The logical SQL server name or managed instance name. For SQL Managed Instance, it is required to specify the port 3342. For example, *sampleserver.public.database.windows.net,3342* |
| Username | The username that has write access to the database. Stream Analytics supports only SQL authentication. |
| Password | The password to connect to the database. |
| Table | The table name where the output is written. The table name is case-sensitive. The schema of this table should exactly match the number of fields and their types that your job output generates. |
|Inherit partition scheme| An option for inheriting the partitioning scheme of your previous query step, to enable fully parallel topology with multiple writers to the table. For more information, see [Azure Stream Analytics output to Azure SQL Database](stream-analytics-sql-output-perf.md).|
|Max batch count| The recommended upper limit on the number of records sent with every bulk insert transaction.|

There are two adapters that enable output from Azure Stream Analytics to Azure Synapse Analytics (formerly SQL Data Warehouse): SQL Database and Azure Synapse. We recommend that you choose the Azure Synapse Analytics adapter instead of the SQL Database adapter if any of the following conditions hold true:

* **Throughput**: If your expected throughput now or in the future is greater than 10MB/sec, use the Azure Synapse output option for better performance.

* **Input Partitions**: If you have eight or more input partitions, use the Azure Synapse output option for better scale-out.



## Partitioning

| Azure SQL Database | Yes, needs to enabled. | Based on the PARTITION BY clause in the query. | When Inherit Partitioning option is enabled, follows the input partitioning for [fully parallelizable queries](stream-analytics-scale-jobs.md). To learn more about achieving better write throughput performance when you're loading data into Azure SQL Database, see [Azure Stream Analytics output to Azure SQL Database](stream-analytics-sql-output-perf.md). |

## Output batch size 

| Azure SQL Database | Configurable using Max batch count. 10,000 maximum and 100 minimum rows per single bulk insert by default.<br />See [Azure SQL limits](../sql-database/sql-database-resource-limits.md). |  Every batch is initially bulk inserted with maximum batch count. Batch is split in half (until minimum batch count) based on retryable errors from SQL. |