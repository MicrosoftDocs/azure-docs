---
title: Invoke stored procedure from Azure Data Factory Copy Activity 
description: 'Learn how to invoke a stored procedure in Azure SQL Database, or SQL Server from an Azure Data Factory copy activity.'
author: jianleishen
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: jianleishen
robots: noindex
---

# Invoke stored procedure from copy activity in Azure Data Factory
> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [transform data using stored procedure activity in Data Factory](../transform-data-using-stored-procedure.md).


When copying data into [SQL Server](data-factory-sqlserver-connector.md) or [Azure SQL Database](data-factory-azure-sql-connector.md), you can configure the **SqlSink** in copy activity to invoke a stored procedure. You may want to use the stored procedure to perform any additional processing (merging columns, looking up values, insertion into multiple tables, etc.) is required before inserting data in to the destination table. This feature takes advantage of [Table-Valued Parameters](/dotnet/framework/data/adonet/sql/table-valued-parameters). 

The following sample shows how to invoke a stored procedure in a SQL Server database from a Data Factory pipeline (copy activity):  

## Output dataset JSON
In the output dataset JSON, set the **type** to: **SqlServerTable**. Set it to **AzureSqlTable** to use with Azure SQL Database. The value for **tableName** property must match the name of first parameter of the stored procedure.  

```json
{
  "name": "SqlOutput",
  "properties": {
    "type": "SqlServerTable",
    "linkedServiceName": "SqlLinkedService",
    "typeProperties": {
      "tableName": "Marketing"
    },
    "availability": {
      "frequency": "Hour",
      "interval": 1
    }
  }
}
```

## SqlSink section in copy activity JSON
Define the **SqlSink** section in the copy activity JSON as follows. To invoke a stored procedure while inserting data into the sink/destination database, specify values for both **SqlWriterStoredProcedureName** and **SqlWriterTableType** properties. For descriptions of these properties, see [SqlSink section in the SQL Server connector article](data-factory-sqlserver-connector.md#sqlsink).

```json
"sink":
{
    "type": "SqlSink",
    "SqlWriterTableType": "MarketingType",
    "SqlWriterStoredProcedureName": "spOverwriteMarketing", 
    "storedProcedureParameters":
            {
                "stringData": 
                {
                    "value": "str1"     
                }
            }
}
```

## Stored procedure definition 
In your database, define the stored procedure with the same name as **SqlWriterStoredProcedureName**. The stored procedure handles input data from the source data store, and inserts data into a table in the destination database. The name of the first parameter of stored procedure must match the tableName defined in the dataset JSON (Marketing).

```sql
CREATE PROCEDURE spOverwriteMarketing @Marketing [dbo].[MarketingType] READONLY, @stringData varchar(256)
AS
BEGIN
    DELETE FROM [dbo].[Marketing] where ProfileID = @stringData
    INSERT [dbo].[Marketing](ProfileID, State)
    SELECT * FROM @Marketing
END
```

## Table type definition
In your database, define the table type with the same name as **SqlWriterTableType**. The schema of the table type must match the schema of the input dataset.

```sql
CREATE TYPE [dbo].[MarketingType] AS TABLE(
    [ProfileID] [varchar](256) NOT NULL,
    [State] [varchar](256) NOT NULL
)
```

## Next steps
Review the following connector articles that for complete JSON examples: 

- [Azure SQL Database](data-factory-azure-sql-connector.md)
- [SQL Server](data-factory-sqlserver-connector.md)