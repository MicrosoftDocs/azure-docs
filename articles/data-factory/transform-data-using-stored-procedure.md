---
title: Transform data using Stored Procedure Activity in Azure Data Factory | Microsoft Docs
description: Explains how to use SQL Server Stored Procedure Activity to invoke a stored procedure in an Azure SQL Database/Data Warehouse from a Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/10/2017
ms.author: shlo

---
# Transform data using SQL Server Stored Procedure Activity in Azure Data Factory
You use data transformation activities in a Data Factory [pipeline](data-factory-create-pipelines.md) to transform and process raw data into predictions and insights. The Stored Procedure Activity is one of the transformation activities that Data Factory supports. This article builds on the [data transformation activities](data-factory-data-transformation-activities.md) article, which presents a general overview of data transformation and the supported transformation activities in Data Factory.

You can use the Stored Procedure Activity to invoke a stored procedure in one of the following data stores in your enterprise or on an Azure virtual machine (VM): 

- Azure SQL Database
- Azure SQL Data Warehouse
- SQL Server Database.  If you are using SQL Server, install Self-Hosted Integration Runtime on the same machine that hosts the database or on a separate machine that has access to the database. Self-Hosted Integration Runtime is a component that connects data sources on-premises/on Azure VM with cloud services in a secure and managed way. See [Self-Hosted Integration Runtime](...) article for details.

> [!IMPORTANT]
> When copying data into Azure SQL Database or SQL Server, you can configure the **SqlSink** in copy activity to invoke a stored procedure by using the **sqlWriterStoredProcedureName** property. For more information, see [Invoke stored procedure from copy activity](data-factory-invoke-stored-procedure-from-copy-activity.md). For details about the property, see following connector articles: [Azure SQL Database](data-factory-azure-sql-connector.md#copy-activity-properties), [SQL Server](data-factory-sqlserver-connector.md#copy-activity-properties). Invoking a stored procedure while copying data into an Azure SQL Data Warehouse by using a copy activity is not supported. But, you can use the stored procedure activity to invoke a stored procedure in a SQL Data Warehouse. 
>
> When copying data from Azure SQL Database or SQL Server or Azure SQL Data Warehouse, you can configure **SqlSource** in copy activity to invoke a stored procedure to read data from the source database by using the **sqlReaderStoredProcedureName** property. For more information, see the following connector articles: [Azure SQL Database](data-factory-azure-sql-connector.md#copy-activity-properties), [SQL Server](data-factory-sqlserver-connector.md#copy-activity-properties), [Azure SQL Data Warehouse](data-factory-azure-sql-data-warehouse-connector.md#copy-activity-properties)          

> 

## Syntax details
Here is the JSON format for defining a Stored Procedure Activity:

```JSON
{
    "name": "Stored Procedure Activity",
    "description":"Description",
    "type": "SqlServerStoredProcedure",
    "linkedServiceName": {
        "referenceName": "AzureSqlLinkedService",
        "type": "LinkedServiceReference"
    },
    "typeProperties": {
        "storedProcedureName": "sp_sample",
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
| type                      | For Stored Procedure Activity, the activity type is SqlServerStoredProcedure | Yes      |
| linkedServiceName         | Reference to the Azure SQL Database or Azure SQL Data Warehouse or SQL Server registered as a linked service in Data Factory | Yes      |
| storedProcedureName       | Specify the name of the stored procedure in the Azure SQL database or Azure SQL Data Warehouse or SQL Server database that is represented by the linked service that the output table uses. | Yes      |
| storedProcedureParameters | Specify values for stored procedure parameters. Use *"param1": { "value": "param1Value","type":"param1Type" }* for to pass parameter values and their native type supported by the data source. If you need to pass null for a parameter, use *"param1": { "value": null }* (all lower case). | No       |
