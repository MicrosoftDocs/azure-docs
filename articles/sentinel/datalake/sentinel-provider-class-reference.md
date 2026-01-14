---  
title: Microsoft Sentinel data lake Microsoft Sentinel Provider class reference
description: Reference documentation for the Microsoft Sentinel Provider class, which allows you to connect to the Microsoft Sentinel data lake and perform various operations.
author: EdB-MSFT
ms.service: microsoft-sentinel
ms.subservice: sentinel-graph
ms.topic: reference 
ms.author: edbaynash  
ms.date: 07/13/2025

# Customer intent: As a security engineer or data scientist, I want to understand how to use the Microsoft Sentinel Provider class to connect to the Microsoft Sentinel data lake and perform operations such as listing databases, reading tables, and saving data.
---
 

# Microsoft Sentinel Provider class

The `MicrosoftSentinelProvider` class provides a way to interact with the Microsoft Sentinel data lake, allowing you to perform operations such as listing databases, reading tables, and saving data. This class is designed to work with the Spark sessions in Jupyter notebooks and provides methods to access and manipulate data stored in the Microsoft Sentinel data lake. 

This class is part of the `sentinel.datalake` module and provides methods to interact with the data lake. To use this class, import it and create an instance of the class using the `spark` session.

```python
from sentinel_lake.providers import MicrosoftSentinelProvider
data_provider = MicrosoftSentinelProvider(spark)      
```
You must have the necessary permissions to perform operations such as reading and writing data. For more information on permissions, see [Microsoft Sentinel data lake permissions](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake).

## Methods

The `MicrosoftSentinelProvider` class provides several methods to interact with the Microsoft Sentinel data lake. 
Each method listed below assumes the `MicrosoftSentinelProvider` class has been imported and an instance has been created using the `spark` session as follows:

```python
from sentinel_lake.providers import MicrosoftSentinelProvider
data_provider = MicrosoftSentinelProvider(spark) 
```

### list_databases

List all available databases / Microsoft Sentinel workspaces.

```python
data_provider.list_databases()    
```

Returns:
- `list[str]`: A list of database names (workspaces) available in the Microsoft Sentinel data lake.    
 
### list_tables

List all tables in a given database.

```python
data_provider.list_tables([database_name],[database_id])
   
```

Parameters:
- `database_name` (str, optional): The name of the database (workspace) to list tables from. IF not specified the system tables database is used.
- `database_id` (str, optional): The unique identifier of the database if workspace names aren't unique.

Returns:
- `list[str]`: A list of table names in the specified database.

Examples:

List all tables in the system tables database:


```python
data_provider.list_tables() 
```


List all tables in a specific database. Specify the `database_id` of the database if your workspace names aren't unique:

```python
data_provider.list_tables("workspace1", database_id="ab1111112222ab333333")
```


### read_table

Load a DataFrame from a table in Lake.

```python
data_provider.read_table({table}, [database_name], [database_id])
```

Parameters:
- `table_name` (str): The name of the table to read.
- `database_name` (str, optional): The name of the database (workspace) containing the table. Defaults to `System tables`.
- `database_id` (str, optional): The unique identifier of the database if workspace names aren't unique.

Returns:
- `DataFrame`: A DataFrame containing the data from the specified table.

Example:
```python
df = data_provider.read_table("EntraGroups", "Workspace001")
```

### save_as_table

Write a DataFrame as a managed table. You can write to the lake tier by using the `_SPRK` suffix in your table name, or to the analytics tier by using the `_SPRK_CL` suffix.                

```python
data_provider.save_as_table({DataFrame}, {table_name}, [database_name], [database_id], [write_options])
```

Parameters:
- `DataFrame` (DataFrame): The DataFrame to write as a table.
- `table_name` (str): The name of the table to create or overwrite.
- `database_name` (str, optional): The name of the database (workspace) to save the table in. Defaults to `System tables`.
- `database_id` (str, optional, analytics tier only): The unique identifier of the database in the analytics tier if workspace names aren't unique.
- `write_options` (dict, optional): Options for writing the table. Supported options:
                - mode: `append` or `overwrite` (default: `append`)
                - partitionBy: list of columns to partition by
                Example: {'mode': 'append', 'partitionBy': ['date']}
 

Returns:
- `str`: The run ID of the write operation.

> [!NOTE]
> The partitioning option only applies to custom tables in system tables database (workspace) in the data lake tier. It isn't supported for tables in the analytics tier or for tables in databases other than the system tables database in the data lake tier.


Examples:

Create new custom table in the data lake tier in the `System tables` workspace.

```python
data_provider.save_as_table(dataframe, "CustomTable1_SPRK", "System tables")
```

Append to a table in the system tables database (workspace) in the data lake tier.
```python
write_options = {
    'mode': 'append'
}
data_provider.save_as_table(dataframe, "CustomTable1_SPRK", write_options=write_options)
```


Create new custom table in the analytics tier.
```python
data_provider.save_as_table(dataframe, "CustomTable1_SPRK_CL", "analyticstierworkspace")
```

Append or overwrite to an existing custom table in the analytics tier.
```python
write_options = {
    'mode': 'append'
}
data_provider.save_as_table(dataframe, "CustomTable1_SPRK_CL", "analyticstierworkspace", write_options)
```

Append to the system tables database with partitioning on the `TimeGenerated` column.
```python
data_loader.save_as_table(dataframe, "table1", write_options: {'mode': 'append', 'partitionBy': ['TimeGenerated']})
```

### delete_table

Deletes the table from the lake tier. You can delete table from lake tier by using the `_SPRK` suffix in your table name. You can't delete a table from the analytics tier using this function. To delete a custom table in the analytics tier, use the Log Analytics API functions. For more information, see [Add or delete tables and columns in Azure Monitor Logs](/azure/azure-monitor/logs/create-custom-table?tabs=azure-portal-1%2Cazure-portal-2%2Cazure-portal-3#delete-a-table).


```python
data_provider.delete_table({table_name}, [database_name], [database_id])
```
Parameters:
- `table_name` (str): The name of the table to delete.
- `database_name` (str, optional): The name of the database (workspace) containing the table. Defaults to `System tables`.
- `database_id` (str, optional): The unique identifier of the database if workspace names aren't unique.

Returns:
- `dict`: A dictionary containing the result of the delete operation.

Example:
```python
data_provider.delete_table("customtable_SPRK", "System tables")
``` 


## Related content

- [Use Jupyter notebooks with Microsoft Sentinel data lake](./notebooks.md)
- [Microsoft Sentinel data lake overview](./sentinel-lake-overview.md)
- [Microsoft Sentinel data lake permissions](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake)
- [Sample notebooks for Microsoft Sentinel data lake](./notebook-examples.md)