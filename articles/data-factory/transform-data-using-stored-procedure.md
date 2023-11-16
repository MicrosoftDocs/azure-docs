---
title: Transform data by using the Stored Procedure activity
titleSuffix: Azure Data Factory & Azure Synapse
description: Explains how to use SQL Server Stored Procedure Activity to invoke a stored procedure in an Azure SQL Database/Data Warehouse from an Azure Data Factory or Synapse Analytics pipeline.
ms.service: data-factory
ms.subservice: tutorials
ms.topic: conceptual
author: nabhishek
ms.author: abnarain
ms.custom: synapse
ms.date: 08/10/2023
---

# Transform data by using the SQL Server Stored Procedure activity in Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

You use data transformation activities in a Data Factory or Synapse [pipeline](concepts-pipelines-activities.md) to transform and process raw data into predictions and insights. The Stored Procedure Activity is one of the transformation activities that pipelines support. This article builds on the [transform data](transform-data.md) article, which presents a general overview of data transformation and the supported transformation activities.

> [!NOTE]
> If you are new to Azure Data Factory, read through [Introduction to Azure Data Factory](introduction.md) and do the tutorial: [Tutorial: transform data](tutorial-transform-data-spark-powershell.md) before reading this article.  To learn more about Synapse Analytics, read [What is Azure Synapse Analytics](../synapse-analytics/overview-what-is.md).

You can use the Stored Procedure Activity to invoke a stored procedure in one of the following data stores in your enterprise or on an Azure virtual machine (VM): 

- Azure SQL Database
- Azure Synapse Analytics
- SQL Server Database.  If you are using SQL Server, install Self-hosted integration runtime on the same machine that hosts the database or on a separate machine that has access to the database. Self-Hosted integration runtime is a component that connects data sources on-premises/on Azure VM with cloud services in a secure and managed way. See [Self-hosted integration runtime](create-self-hosted-integration-runtime.md) article for details.

> [!IMPORTANT]
> When copying data into Azure SQL Database or SQL Server, you can configure the **SqlSink** in copy activity to invoke a stored procedure by using the **sqlWriterStoredProcedureName** property. For details about the property, see following connector articles: [Azure SQL Database](connector-azure-sql-database.md), [SQL Server](connector-sql-server.md). Invoking a stored procedure while copying data into an Azure Synapse Analytics by using a copy activity is not supported. But, you can use the stored procedure activity to invoke a stored procedure in Azure Synapse Analytics. 
>
> When copying data from Azure SQL Database or SQL Server or Azure Synapse Analytics, you can configure **SqlSource** in copy activity to invoke a stored procedure to read data from the source database by using the **sqlReaderStoredProcedureName** property. For more information, see the following connector articles: [Azure SQL Database](connector-azure-sql-database.md), [SQL Server](connector-sql-server.md), [Azure Synapse Analytics](connector-azure-sql-data-warehouse.md)          

 ## Create a Stored Procedure activity with UI

To use a Stored Procedure activity in a pipeline, complete the following steps:

1. Search for _Stored Procedure_ in the pipeline Activities pane, and drag a Stored Procedure activity to the pipeline canvas.
1. Select the new Stored Procedure activity on the canvas if it is not already selected, and its  **Settings** tab, to edit its details.

   :::image type="content" source="media/transform-data-using-stored-procedure/stored-procedure-activity.png" alt-text="Shows the UI for a Stored Procedure activity.":::

1. Select an existing or create a new linked service to an Azure SQL Database, Azure Synapse Analytics, or SQL Server.
1. Choose a stored procedure, and provide any parameters for its execution.

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
| linkedServiceName         | Reference to the **Azure SQL Database** or **Azure Synapse Analytics** or **SQL Server** registered as a linked service in Data Factory. To learn about this linked service, see [Compute linked services](compute-linked-services.md) article. | Yes      |
| storedProcedureName       | Specify the name of the stored procedure to invoke. | Yes      |
| storedProcedureParameters | Specify the values for stored procedure parameters. Use `"param1": { "value": "param1Value","type":"param1Type" }` to pass parameter values and their type supported by the data source. If you need to pass null for a parameter, use `"param1": { "value": null }` (all lower case). | No       |

## Parameter data type mapping
The data type you specify for the parameter is the internal service type that maps to the data type in the data source you are using. You can find the data type mappings for your data source described in the connectors documentation. For example:

- [Azure Synapse Analytics](connector-azure-sql-data-warehouse.md#data-type-mapping-for-azure-synapse-analytics)
- [Azure SQL Database data type mapping](connector-azure-sql-database.md#data-type-mapping-for-azure-sql-database)
- [Oracle  data type mapping](connector-oracle.md#data-type-mapping-for-oracle)
- [SQL Server data type mapping](connector-sql-server.md#data-type-mapping-for-sql-server)

## Next steps
See the following articles that explain how to transform data in other ways: 

* [U-SQL Activity](transform-data-using-data-lake-analytics.md)
* [Hive Activity](transform-data-using-hadoop-hive.md)
* [Pig Activity](transform-data-using-hadoop-pig.md)
* [MapReduce Activity](transform-data-using-hadoop-map-reduce.md)
* [Hadoop Streaming Activity](transform-data-using-hadoop-streaming.md)
* [Spark Activity](transform-data-using-spark.md)
* [.NET custom activity](transform-data-using-dotnet-custom-activity.md)
* [Stored procedure activity](transform-data-using-stored-procedure.md)
