---  
title: Microsoft Sentinel Provider class reference (Preview)
description: Reference documentation for the Microsoft Sentinel Provider class, which allows you to connect to the Microsoft Sentinel data lake and perform various operations.
titleSuffix: Microsoft Security  
description: This article provides reference documentation for the Microsoft Sentinel Provider class. Tis class allows you to connect to the Microsoft Sentinel data lake and perform various operations such as listing databases, reading tables, and saving data.
author: EdB-MSFT
ms.topic: reference 
ms.date: 06/23/2025
ms.author: edbayansh  

# Customer intent: As a security engineer or data scientist, I want to understand how to use the Microsoft Sentinel Provider class to connect to the Microsoft Sentinel data lake and perform operations such as listing databases, reading tables, and saving data.
---
 

# Microsoft Sentinel Provider class 

The `MicrosoftSentinelProvider` class provides a way to interact with the Microsoft Sentinel data lake, allowing you to perform operations such as listing databases, reading tables, and saving data. This class is designed to work with the Spark sessions in Jupyter notebooks and provides methods to access and manipulate data stored in the Microsoft Sentinel data lake. 

This class is part of the `sentinel.datalake` module and provides methods to interact with the data lake. To use this class, import it and create an instance of the class using the `spark` session.

```python
from sentinel_lake.providers import MicrosoftSentinelProvider
lake_provider = MicrosoftSentinelProvider(spark)      
```
You must have the necessary permissions to perform operations such as reading and writing data. For more information on permissions, see [Microsoft Sentinel data lake permissions](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake-preview).

## Methods

The `MicrosoftSentinelProvider` class provides several methods to interact with the Microsoft Sentinel data lake. 
Each method listed below assumes the `MicrosoftSentinelProvider` class has been imported and an instance has been created using the `spark` session as follows:

```python
from sentinel_lake.providers import MicrosoftSentinelProvider
lake_provider = MicrosoftSentinelProvider(spark) 
```

### list_databases

List all available databases / Microsoft Sentinel workspaces 

```python
lake_provider.list_databases()    
```

Returns:
- `list[str]`: A list of database names (workspaces) available in the Microsoft Sentinel data lake.    
 
### list_tables

List all tables in a given database

```python
lake_provider.list_tables({database})
   
```

Parameters:
- `database` (str): The name of the database (workspace) to list tables from.
- `id` (str, optional): The unique identifier of the database if workspace names aren't unique.

Returns:
- `list[str]`: A list of table names in the specified database.

Example:

Specify the `id` of the database if your workspace names aren't unique

```python
lake_provider.list_tables("workspace1", id="ab1111112222ab333333")
```


### read_table

Load a DataFrame from a table in Lake

```python
lake_provider.read_table({table}, {database}, [id])
```

Parameters:
- `table_name` (str): The name of the table to read.
- `database` (str): The name of the database (workspace) containing the table.
- `id` (str, optional): The unique identifier of the database if workspace names aren't unique.

Returns:
- `DataFrame`: A DataFrame containing the data from the specified table.

Example:
```python
# Native tables, custom tables
df = lake_provider.read_table("user", "default")
```

### save_as_table

Write a DataFrame as a managed table. You can write to the lake tier by using the `_SPRK` suffix in your table name, or to the analytics tier by using the `_SPRK_CL` suffix.                

```python
lake_provider.save_as_table({DataFrame}, {table_name}, {database}, [id], [WriteOptions])
```

Parameters:
- `DataFrame` (DataFrame): The DataFrame to write as a table.
- `table_name` (str): The name of the table to create or overwrite.
- `database` (str): The name of the database (workspace) to save the table in.
- `id` (str, optional): The unique identifier of the database if workspace names aren't unique.
- `WriteOptions` (dict, optional): Options for writing the table, such as `mode` ("append", "overwrite").

Returns:
- `str`: The run ID of the write operation.

Examples:

Create new custom table in the data lake tier

```python
lake_provider.save_as_table(dataframe, "CustomTable1_SPRK", "lakeworkspace")
```

Create new custom table in the analytics tier
```python
lake_provider.save_as_table(dataframe, "CustomTable1_SPRK_CL", "analyticstierworkspace")
```

Append or overwrite to an existing custom table in the analytics tier
```python
write_options = {
    'mode': 'append'
}
lake_provider.save_as_table(dataframe, "CustomTable1_SPRK_CL", "analyticstierworkspace", write_options)
```

### delete_table

Deletes the table from the lake tier. You can delete table from lake tier by using the `_SPRK` suffix in your table name. You can't delete a table from the analytics tier using this function. To delete a custom table in the analytics tier, use the Log Analytics API functions. For more information, see [Add or delete tables and columns in Azure Monitor Logs](/azure/azure-monitor/logs/create-custom-table?tabs=azure-portal-1%2Cazure-portal-2%2Cazure-portal-3#delete-a-table).


```python
lake_provider.delete_table({table_name}, {database}, [id])
```
Parameters:
- `table_name` (str): The name of the table to delete.
- `database` (str): The name of the database (workspace) containing the table.
- `id` (str, optional): The unique identifier of the database if workspace names aren't unique.

Returns:
- `dict`: A dictionary containing the result of the delete operation.

Example:
```python
lake_provider.delete_table("customtable_SPRK", "lakeworkspace")
``` 


## Related content

- [Use Jupyter notebooks with Microsoft Sentinel Data lake](./notebooks.md)
- [Microsoft Sentinel data lake overview](./sentinel-lake-overview.md)
- [Microsoft Sentinel data lake permissions](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake-preview)
- [Sample notebooks for Microsoft Sentinel data lake](./notebook-examples.md)