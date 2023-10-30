---
title: Read Delta Lake tables (Synapse or External Location)
description: How to read external tables created in Synapse or other systems into a Trino cluster.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Read Delta Lake tables (Synapse or external location)

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This article provides an overview of how to read a Delta Lake table without having any access to the metastore (Synapse or other metastores without public access).

You can perform the following operations on the tables using HDInsight on AKS Trino.

* DELETE
* UPDATE
* INSERT
* MERGE 
  
## Prerequisites

* [Configure Delta Lake catalog](trino-add-delta-lake-catalog.md).

## Create Delta Lake schemas and tables

This section shows how to create a Delta table over a pre-existing location given you already have a Delta Lake catalog configured.

1. Browse the storage account using the `Storage browser` in the Azure portal to where the base directory of your table is. If this table originates in Synapse, it's likely under a `synapse/workspaces/.../warehouse/` path and will be named after your table and contains a `_delta_log` directory. Select `Copy URL` from the three dots located next to the folder.

    You need to convert this http path into an ABFS (Azure Blob File System) path:

    The storage http path is structured like this:
    `https://{{AZURE_STORAGE_ACCOUNT}}.blob.core.windows.net/{{AZURE_STORAGE_CONTAINER}}/synapse/workspaces/my_workspace/warehouse/{{TABLE_NAME}}/`

    ABFS paths need to look like this:
    `abfss://{{AZURE_STORAGE_CONTAINER}}@{{AZURE_STORAGE_ACCOUNT}}.dfs.core.windows.net/synapse/workspaces/my_workspace/warehouse/{{TABLE_NAME}}/`

    Example:
    `abfss://container@storageaccount.dfs.core.windows.net/synapse/workspaces/workspace_name/warehouse/table_name/`


1. Create a Delta Lake schema in HDInsight on AKS Trino.

    ```sql
    CREATE SCHEMA delta.default;
    ```

    Alternatively, you can also create a schema in a specific storage account:

    ```sql
    CREATE SCHEMA delta.default WITH (location = 'abfss://container@storageaccount.dfs.core.windows.net/trino/');
    ```

1. Use the [`register_table` procedure to create the table](https://trino.io/docs/current/connector/delta-lake.html#register-table).

    ```sql
    CALL delta.system.register_table(schema_name => 'default', table_name => 'table_name', table_location => 'abfss://container@storageaccount.dfs.core.windows.net/synapse/workspaces/workspace_name/warehouse/table_name/');
    ```

1.  Query the table to verify.

    ```sql
    SELECT * FROM delta.default.table_name
    ```

## Write Delta Lake tables in Synapse Spark

Use `format("delta")` to save a dataframe as a Delta table, then you can use the path where you saved the dataframe as delta format to register the table in HDInsight on AKS Trino.

```python
my_dataframe.write.format("delta").save("abfss://container@storageaccount.dfs.core.windows.net/synapse/workspaces/workspace_name/warehouse/table_name")
```
## Next steps
[How to configure caching in Trino](./trino-caching.md)
