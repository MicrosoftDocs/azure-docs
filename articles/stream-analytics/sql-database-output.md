---
title: Azure SQL Database output from Azure Stream Analytics
description: This article describes Azure SQL Database as output for Azure Stream Analytics.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 07/21/2022
---

# Azure SQL Database output from Azure Stream Analytics

You can use [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) as an output for data that's relational in nature or for applications that depend on content being hosted in a relational database. Azure Stream Analytics jobs write to an existing table in SQL Database. The table schema must exactly match the fields and their types in your job's output. The Azure portal experience for Stream Analytics allows you to [test your streaming query and also detect if there are any mismatches between the schema](sql-db-table.md) of the results produced by your job and the schema of the target table in your SQL database. To learn about ways to improve write throughput, see the [Stream Analytics with Azure SQL Database as output](stream-analytics-sql-output-perf.md) article. While you can also specify [Azure Synapse Analytics SQL pool](/azure/sql-data-warehouse/) as an output via the SQL Database output option, it is recommended to use the dedicated [Azure Synapse Analytics output connector](azure-synapse-analytics-output.md) for best performance.

You can also use [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview) as an output. You have to [configure public endpoint in SQL Managed Instance](/azure/azure-sql/managed-instance/public-endpoint-configure) and then manually configure the following settings in Azure Stream Analytics. Azure virtual machine running SQL Server with a database attached is also supported by manually configuring the settings below.

## Output configuration

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

There are two adapters that enable output from Azure Stream Analytics to Azure Synapse Analytics: SQL Database and Azure Synapse. We recommend that you choose the Azure Synapse Analytics adapter instead of the SQL Database adapter if any of the following conditions are true:

* **Throughput**: If your expected throughput now or in the future is greater than 10MB/sec, use the Azure Synapse output option for better performance.

* **Input Partitions**: If you have eight or more input partitions, use the Azure Synapse output option for better scale-out.

## Partitioning

Partitioning needs to enabled and is based on the PARTITION BY clause in the query. When the Inherit Partitioning option is enabled, it follows the input partitioning for [fully parallelizable queries](stream-analytics-scale-jobs.md). To learn more about achieving better write throughput performance when you're loading data into Azure SQL Database, see [Azure Stream Analytics output to Azure SQL Database](stream-analytics-sql-output-perf.md).

## Output batch size

You can configure the max message size by using **Max batch count**. The default maximum is 10,000 and the default minimum is 100 rows per single bulk insert. For more information, see [Azure SQL limits](/azure/azure-sql/database/resource-limits-logical-server). Every batch is initially bulk inserted with maximum batch count. Batch is split in half (until minimum batch count) based on retryable errors from SQL.

## Limitation

Self-signed SSL certifacte is not supported when trying to connect ASA jobs to SQL on VM.

## Next steps

* [How to add SQL DB output in Stream Analytics](sql-db-table.md) 
* [Increase throughput performance to Azure SQL Database from Azure Stream Analytics](stream-analytics-sql-output-perf.md)
* [Use managed identities to access Azure SQL Database or Azure Synapse Analytics from an Azure Stream Analytics job](./sql-database-output-managed-identity.md)
* [Use reference data from a SQL Database for an Azure Stream Analytics job](sql-reference-data.md)
* [Update or merge records in Azure SQL Database with Azure Functions](sql-database-upsert.md)
* [Understand outputs from Azure Stream Analytics](stream-analytics-define-outputs.md)
