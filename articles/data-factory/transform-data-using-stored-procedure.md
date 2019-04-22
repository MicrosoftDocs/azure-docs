---
title: Transform data by using the Stored Procedure activity in Azure Data Factory | Microsoft Docs
description: Explains how to use SQL Server Stored Procedure Activity to invoke a stored procedure in an Azure SQL Database/Data Warehouse from a Data Factory pipeline.
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 11/27/2018
author: nabhishek
ms.author: abnarain
manager: craigg
---


# Transform data by using the SQL Server Stored Procedure activity in Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-stored-proc-activity.md)
> * [Current version](transform-data-using-stored-procedure.md)

You use data transformation activities in a Data Factory [pipeline](concepts-pipelines-activities.md) to transform and process raw data into predictions and insights. The Stored Procedure Activity is one of the transformation activities that Data Factory supports. This article builds on the [transform data](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities in Data Factory.

> [!NOTE]
> If you are new to Azure Data Factory, read through [Introduction to Azure Data Factory](introduction.md) and do the tutorial: [Tutorial: transform data](tutorial-transform-data-spark-powershell.md) before reading this article. 

You can use the Stored Procedure Activity to invoke a stored procedure in one of the following data stores in your enterprise or on an Azure virtual machine (VM): 

- Azure SQL Database
- Azure SQL Data Warehouse
- SQL Server Database.  If you are using SQL Server, install Self-hosted integration runtime on the same machine that hosts the database or on a separate machine that has access to the database. Self-Hosted integration runtime is a component that connects data sources on-premises/on Azure VM with cloud services in a secure and managed way. See [Self-hosted integration runtime](create-self-hosted-integration-runtime.md) article for details.

> [!IMPORTANT]
> When copying data into Azure SQL Database or SQL Server, you can configure the **SqlSink** in copy activity to invoke a stored procedure by using the **sqlWriterStoredProcedureName** property. For details about the property, see following connector articles: [Azure SQL Database](connector-azure-sql-database.md), [SQL Server](connector-sql-server.md). Invoking a stored procedure while copying data into an Azure SQL Data Warehouse by using a copy activity is not supported. But, you can use the stored procedure activity to invoke a stored procedure in a SQL Data Warehouse. 
>
> When copying data from Azure SQL Database or SQL Server or Azure SQL Data Warehouse, you can configure **SqlSource** in copy activity to invoke a stored procedure to read data from the source database by using the **sqlReaderStoredProcedureName** property. For more information, see the following connector articles: [Azure SQL Database](connector-azure-sql-database.md), [SQL Server](connector-sql-server.md), [Azure SQL Data Warehouse](connector-azure-sql-data-warehouse.md)          

 

## Syntax details
Here is the JSON format for defining a Stored Procedure Activity:

```json
{
    "name": "Stored Procedure Activity",
    "description":"Description",
    "type": "SqlServerStoredProcedure",
    "linkedServiceName": {
        "referenceName": "AzureSqlLinkedService",
        "type": "LinkedServiceReference"
    },
    "typeProperties": {
        "storedProcedureName": "usp_sample",
        "storedProcedureParameters": {
            "identifier": { "value": "1", "type": "Int" },
            "stringData": { "value": "str1" }

        }
    }
}
```

The following table describes these JSON properties:

| Property                  | Description                              | Required |
| ------------------------- | ---------------------------------------- | -------- |
| name                      | Name of the activity                     | Yes      |
| description               | Text describing what the activity is used for | No       |
| type                      | For Stored Procedure Activity, the activity type is **SqlServerStoredProcedure** | Yes      |
| linkedServiceName         | Reference to the **Azure SQL Database** or **Azure SQL Data Warehouse** or **SQL Server** registered as a linked service in Data Factory. To learn about this linked service, see [Compute linked services](compute-linked-services.md) article. | Yes      |
| storedProcedureName       | Specify the name of the stored procedure to invoke. | Yes      |
| storedProcedureParameters | Specify the values for stored procedure parameters. Use `"param1": { "value": "param1Value","type":"param1Type" }` to pass parameter values and their type supported by the data source. If you need to pass null for a parameter, use `"param1": { "value": null }` (all lower case). | No       |

## Error info

When a stored procedure fails and returns error details, you can't capture the error info directly in the activity output. However, Data Factory pumps all of its activity run events to Azure Monitor. Among the events that Data Factory pumps to Azure Monitor, it pushes error details there. You can, for example, set up email alerts from those events. For more info, see [Alert and Monitor data factories using Azure Monitor](monitor-using-azure-monitor.md).

## Next steps
See the following articles that explain how to transform data in other ways: 

* [U-SQL Activity](transform-data-using-data-lake-analytics.md)
* [Hive Activity](transform-data-using-hadoop-hive.md)
* [Pig Activity](transform-data-using-hadoop-pig.md)
* [MapReduce Activity](transform-data-using-hadoop-map-reduce.md)
* [Hadoop Streaming Activity](transform-data-using-hadoop-streaming.md)
* [Spark Activity](transform-data-using-spark.md)
* [.NET custom activity](transform-data-using-dotnet-custom-activity.md)
* [Machine Learning Bach Execution Activity](transform-data-using-machine-learning.md)
* [Stored procedure activity](transform-data-using-stored-procedure.md)
