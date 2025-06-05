## Microsoft Sentinel Provider class 

To connect to the Microsoft Sentinel data lake,  use the `SentinelLakeProvider` class.
This class is part of the `access_module.data_loader` module and provides methods to interact with the data lake. To use this class, you need to import it and create an instance of the class using the `spark` session.

```python
from access_module.data_loader import SentinelLakeProvider
lake_provider = SentinelLakeProvider(spark)    
```

The `SentinelLakeProvider` class provides methods to interact with the data lake, including listing databases, reading tables, and saving data. Below is a summary of the available methods:

| Method | Arguments | Type | Return | Example |
|--------|-----------|------|--------|---------|
| `list_databases` <p>List all available databases / Sentinel workspaces | none | None | list[str] | `SentinelLakeProvider.list_databases()` |
| `list_tables` <p>List all tables in a given database | `database`<br><br>`id` (optional) | str<br><br> str | list[str] | 1. List lake tables:<br>`SentinelLakeProvider.list_tables("workspace1")`<br><br>2. If your workspace names are not unique, use the table GUID:<br>`SentinelLakeProvider.list_tables("workspace1", id="ab1111112222ab333333")` |
| `read_table` <p>Load a DataFrame from a table in Lake | `table_name`<br><br>`database`<br><br>`id` (optional) | str<br><br> str<br><br>str | DataFrame | 1. Native tables, custom tables:<br>`SentinelLakeProvider.read_table("user", "default")`<br><br>2. Aux tables:<br>`SentinelLakeProvider.read_table("SignInLogs", "workspace1")`<br><br>3.  If your workspace names are not unique, use the table GUID:<br>`SentinelLakeProvider.read_table("SignInLogs", "workspace1", id="ab1111112222ab333333")` |
| `save_as_table` <p>Write a DataFrame as a managed table | `DataFrame`<br><br>`table_name`<br><br>`database: `<br><br>`id` (optional)<br><br>`WriteOptions {mode: Append, Overwrite}` (optional) | DataFrame<br><br>str<br><br>str<br><br>str<br><br>dict| str (runId) | 1. Create new custom table:<br>`SentinelLakeProvider.save_as_table(dataframe, "CustomTable1_SPRK", "msgworkspace1")`<br><br>`SentinelLakeProvider.save_as_table(dataframe, "CustomTable1_CL", "workspace1")`<br><br>2. Append/Overwrite to existing custom table:<br>`SentinelLakeProvider.save_as_table(dataframe, "CustomTable1_CL", "workspace1", mode="Append")`<br><br>3. If your workspace names are not unique, use GUID:<br>`SentinelLakeProvider.save_as_table(dataframe, "CustomTable1_CL", "workspace1", id="ab1111112222ab333333", mode="Append")` |
| `delete_table` <p>Deletes the table from the schema | `table_name`<br><br>`database`<br><br>`id` (optional) | str<br><br>str<br><br>str| dict | 1. Delete a custom table:<br>`SentinelLakeProvider.delete_table("customtable_SPRK", "msgworkspace")`<br><br>2.  If your workspace names are not unique, use the table  GUID:<br>`SentinelLakeProvider.delete_table("SignInLogs", "workspace1", id="ab1111112222ab333333")` |
| `get_status` <p>Check status of a save/write to table | `run_id`<br><br>`plan: lake/analytics` | str<br><br>str | dict (run_id, status, message_col) | 1. Get write status for lake table:<br>`SentinelLakeProvider.get_status("123456", plan="lake")`<br><br>2. Get write status for analytics table:<br>`SentinelLakeProvider.get_status("123456", plan="analytics")` |
| `get_metadata` <p>Retrieve metadata about a table | `table_name`, `schema` | str<br><br> str | dict | |
