---
title: Repeatable copy in Azure Data Factory
description: 'Learn how to avoid duplicates even though a slice that copies data is run more than once.'
author: jianleishen
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: jianleishen
robots: noindex
---

# Repeatable copy in Azure Data Factory

## Repeatable read from relational sources
When copying data from relational data stores, keep repeatability in mind to avoid unintended outcomes. In Azure Data Factory, you can rerun a slice manually. You can also configure retry policy for a dataset so that a slice is rerun when a failure occurs. When a slice is rerun in either way, you need to make sure that the same data is read no matter how many times a slice is run.  
 
> [!NOTE]
> The following samples are for Azure SQL but are applicable to any data store that supports rectangular datasets. You may have to adjust the **type** of source and the **query** property (for example: query instead of sqlReaderQuery) for the data store.   

Usually, when reading from relational stores, you want to read only the data corresponding to that slice. A way to do so would be by using the WindowStart and WindowEnd system variables available in Azure Data Factory. Read about the variables and functions in Azure Data Factory here in the [Azure Data Factory - Functions and System Variables](data-factory-functions-variables.md) article. Example: 

```json
"source": {
    "type": "SqlSource",
    "sqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm\\'', WindowStart, WindowEnd)"
},
```
This query reads data that falls in the slice duration range (WindowStart -> WindowEnd) from the table MyTable. Rerun of this slice would also always ensure that the same data is read. 

In other cases, you may wish to read the entire table and may define the sqlReaderQuery as follows:

```json
"source": 
{            
    "type": "SqlSource",
    "sqlReaderQuery": "select * from MyTable"
},
```

## Repeatable write to SqlSink
When copying data to **Azure SQL/SQL Server** from other data stores, you need to keep repeatability in mind to avoid unintended outcomes. 

When copying data to Azure SQL/SQL Server Database, the copy activity appends data to the sink table by default. Say, you are copying data from a CSV (comma-separated values) file containing two records to the following table in an Azure SQL/SQL Server Database. When a slice runs, the two records are copied to the SQL table. 

```
ID    Product        Quantity    ModifiedDate
...    ...            ...            ...
6    Flat Washer    3            2015-05-01 00:00:00
7     Down Tube    2            2015-05-01 00:00:00
```

Suppose you found errors in source file and updated the quantity of Down Tube from 2 to 4. If you rerun the data slice for that period manually, you'll find two new records appended to Azure SQL/SQL Server Database. This example assumes that none of the columns in the table has the primary key constraint.

```
ID    Product        Quantity    ModifiedDate
...    ...            ...            ...
6    Flat Washer    3            2015-05-01 00:00:00
7     Down Tube    2            2015-05-01 00:00:00
6    Flat Washer    3            2015-05-01 00:00:00
7     Down Tube    4            2015-05-01 00:00:00
```

To avoid this behavior, you need to specify UPSERT semantics by using one of the following two mechanisms:

### Mechanism 1: using sqlWriterCleanupScript
You can use the **sqlWriterCleanupScript** property to clean up data from the sink table before inserting the data when a slice is run. 

```json
"sink":  
{ 
  "type": "SqlSink", 
  "sqlWriterCleanupScript": "$$Text.Format('DELETE FROM table WHERE ModifiedDate >= \\'{0:yyyy-MM-dd HH:mm}\\' AND ModifiedDate < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
}
```

When a slice runs, the cleanup script is run first to delete data that corresponds to the slice from the SQL table. The copy activity then inserts data into the SQL Table. If the slice is rerun, the quantity is updated as desired.

```
ID    Product        Quantity    ModifiedDate
...    ...            ...            ...
6    Flat Washer    3            2015-05-01 00:00:00
7     Down Tube    4            2015-05-01 00:00:00
```

Suppose the Flat Washer record is removed from the original csv. Then rerunning the slice would produce the following result: 

```
ID    Product        Quantity    ModifiedDate
...    ...            ...            ...
7     Down Tube    4            2015-05-01 00:00:00
```

The copy activity ran the cleanup script to delete the corresponding data for that slice. Then it read the input from the csv (which then contained only one record) and inserted it into the Table. 

### Mechanism 2: using sliceIdentifierColumnName
> [!IMPORTANT]
> Currently, sliceIdentifierColumnName is not supported for Azure Synapse Analytics. 

The second mechanism to achieve repeatability is by having a dedicated column (sliceIdentifierColumnName) in the target Table. This column would be used by Azure Data Factory to ensure the source and destination stay synchronized. This approach works when there is flexibility in changing or defining the destination SQL Table schema. 

This column is used by Azure Data Factory for repeatability purposes and in the process Azure Data Factory does not make any schema changes to the Table. Way to use this approach:

1. Define a column of type **binary (32)** in the destination SQL Table. There should be no constraints on this column. Let's name this column as AdfSliceIdentifier for this example.


    Source table:

    ```sql
    CREATE TABLE [dbo].[Student](
       [Id] [varchar](32) NOT NULL,
       [Name] [nvarchar](256) NOT NULL
    )
    ```

    Destination table: 

    ```sql
    CREATE TABLE [dbo].[Student](
       [Id] [varchar](32) NOT NULL,
       [Name] [nvarchar](256) NOT NULL,
       [AdfSliceIdentifier] [binary](32) NULL
    )
    ```

1. Use it in the copy activity as follows:
   
    ```json
    "sink":  
    { 
   
        "type": "SqlSink", 
        "sliceIdentifierColumnName": "AdfSliceIdentifier"
    }
    ```

Azure Data Factory populates this column as per its need to ensure the source and destination stay synchronized. The values of this column should not be used outside of this context. 

Similar to mechanism 1, Copy Activity automatically cleans up the data for the given slice from the destination SQL Table. It then inserts data from source in to the destination table. 

## Next steps
Review the following connector articles that for complete JSON examples: 

- [Azure SQL Database](data-factory-azure-sql-connector.md)
- [Azure Synapse Analytics](data-factory-azure-sql-data-warehouse-connector.md)
- [SQL Server](data-factory-sqlserver-connector.md)
