---
title: Copy and transform data to and from SQL Server
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about how to copy and transform data to and from SQL Server database that is on-premises or in an Azure VM by using Azure Data Factory or Azure Synapse Analytics pipelines.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 07/13/2023
---

# Copy and transform data to and from SQL Server by using Azure Data Factory or Azure Synapse Analytics

> [!div class="op_single_selector" title1="Select the version of Azure Data Factory that you're using:"]
> * [Version 1](v1/data-factory-sqlserver-connector.md)
> * [Current version](connector-sql-server.md)
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the copy activity in Azure Data Factory and Azure Synapse pipelines to copy data from and to SQL Server database and use Data Flow to transform data in SQL Server database.  To learn more read the introductory article for [Azure Data Factory](introduction.md) or [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md).

## Supported capabilities

This SQL Server connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/sink)|&#9312; &#9313;|
|[Mapping data flow](concepts-data-flow-overview.md) (source/sink)|&#9312; |
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|
|[GetMetadata activity](control-flow-get-metadata-activity.md)|&#9312; &#9313;|
|[Script activity](transform-data-using-script.md)|&#9312; &#9313;|
|[Stored procedure activity](transform-data-using-stored-procedure.md)|&#9312; &#9313;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

For a list of data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this SQL Server connector supports:

- SQL Server version 2005 and above.
- Copying data by using SQL or Windows authentication.
- As a source, retrieving data by using a SQL query or a stored procedure. You can also choose to parallel copy from SQL Server source, see the [Parallel copy from SQL database](#parallel-copy-from-sql-database) section for details.
- As a sink, automatically creating destination table if not exists based on the source schema; appending data to a table or invoking a stored procedure with custom logic during copy. 

[SQL Server Express LocalDB](/sql/database-engine/configure-windows/sql-server-express-localdb) is not supported.


## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)]

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a SQL Server linked service using UI

Use the following steps to create a SQL Server linked service in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for SQL and select the SQL Server connector.

    :::image type="content" source="media/connector-sql-server/sql-server-connector.png" alt-text="Screenshot of the SQL Server connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-sql-server/configure-sql-server-linked-service.png" alt-text="Screenshot of configuration for SQL Server linked service.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory and Synapse pipeline entities specific to the SQL Server database connector.

## Linked service properties

This SQL server connector supports the following authentication types. See the corresponding sections for details.

- [SQL authentication](#sql-authentication)
- [Windows authentication](#windows-authentication)

>[!TIP]
>If you hit an error with the error code "UserErrorFailedToConnectToSqlServer" and a message like "The session limit for the database is XXX and has been reached," add `Pooling=false` to your connection string and try again.

### SQL authentication

To use SQL authentication, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **SqlServer**. | Yes |
| connectionString | Specify **connectionString** information that's needed to connect to the SQL Server database. Specify a login name as your user name, and ensure the database that you want to connect is mapped to this login. Refer to the following samples. | Yes |
| password | If you want to put a password in Azure Key Vault, pull the `password` configuration out of the connection string. For more information, see the JSON example following the table and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md). |No |
| alwaysEncryptedSettings | Specify **alwaysencryptedsettings** information that's needed to enable Always Encrypted to protect sensitive data stored in SQL server by using either managed identity or service principal. For more information, see the JSON example following the table and [Using Always Encrypted](#using-always-encrypted) section. If not specified, the default always encrypted setting is disabled. |No |
| connectVia | This [integration runtime](concepts-integration-runtime.md) is used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, the default Azure integration runtime is used. |No |

**Example: Use SQL authentication**

```json
{
    "name": "SqlServerLinkedService",
    "properties": {
        "type": "SqlServer",
        "typeProperties": {
            "connectionString": "Data Source=<servername>\\<instance name if using named instance>;Initial Catalog=<databasename>;Integrated Security=False;User ID=<username>;Password=<password>;"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```
**Example: Use SQL authentication with a password in Azure Key Vault**

```json
{
    "name": "SqlServerLinkedService",
    "properties": {
        "type": "SqlServer",
        "typeProperties": {
            "connectionString": "Data Source=<servername>\\<instance name if using named instance>;Initial Catalog=<databasename>;Integrated Security=False;User ID=<username>;",
            "password": { 
                "type": "AzureKeyVaultSecret", 
                "store": { 
                    "referenceName": "<Azure Key Vault linked service name>", 
                    "type": "LinkedServiceReference" 
                }, 
                "secretName": "<secretName>" 
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```
**Example: Use Always Encrypted**

```json
{
    "name": "SqlServerLinkedService",
    "properties": {
        "type": "SqlServer",
        "typeProperties": {
            "connectionString": "Data Source=<servername>\\<instance name if using named instance>;Initial Catalog=<databasename>;Integrated Security=False;User ID=<username>;Password=<password>;"
        },
        "alwaysEncryptedSettings": {
            "alwaysEncryptedAkvAuthType": "ServicePrincipal",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": {
                "type": "SecureString",
                "value": "<service principal key>"
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Windows authentication

To use Windows authentication, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **SqlServer**. | Yes |
| connectionString | Specify **connectionString** information that's needed to connect to the SQL Server database. Refer to the following samples.
| userName | Specify a user name. An example is **domainname\\username**. |Yes |
| password | Specify a password for the user account you specified for the user name. Mark this field as **SecureString** to store it securely. Or, you can [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). |Yes |
| alwaysEncryptedSettings | Specify **alwaysencryptedsettings** information that's needed to enable Always Encrypted to protect sensitive data stored in SQL server by using either managed identity or service principal. For more information, see [Using Always Encrypted](#using-always-encrypted) section. If not specified, the default always encrypted setting is disabled. |No |
| connectVia | This [integration runtime](concepts-integration-runtime.md) is used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, the default Azure integration runtime is used. |No |

> [!NOTE]
> Windows authentication is not supported in data flow.

**Example: Use Windows authentication**

```json
{
    "name": "SqlServerLinkedService",
    "properties": {
        "type": "SqlServer",
        "typeProperties": {
            "connectionString": "Data Source=<servername>\\<instance name if using named instance>;Initial Catalog=<databasename>;Integrated Security=True;",
            "userName": "<domain\\username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example: Use Windows authentication with a password in Azure Key Vault**

```json
{
    "name": "SqlServerLinkedService",
    "properties": {
        "annotations": [],
        "type": "SqlServer",
        "typeProperties": {
            "connectionString": "Data Source=<servername>\\<instance name if using named instance>;Initial Catalog=<databasename>;Integrated Security=True;",
            "userName": "<domain\\username>",
            "password": {
                "type": "AzureKeyVaultSecret",
                "store": {
                    "referenceName": "<Azure Key Vault linked service name>",
                    "type": "LinkedServiceReference"
                },
                "secretName": "<secretName>"
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the SQL Server dataset.

To copy data from and to a SQL Server database, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to **SqlServerTable**. | Yes |
| schema | Name of the schema. |No for source, Yes for sink  |
| table | Name of the table/view. |No for source, Yes for sink  |
| tableName | Name of the table/view with schema. This property is supported for backward compatibility. For new workload, use `schema` and `table`. | No for source, Yes for sink |

**Example**

```json
{
    "name": "SQLServerDataset",
    "properties":
    {
        "type": "SqlServerTable",
        "linkedServiceName": {
            "referenceName": "<SQL Server linked service name>",
            "type": "LinkedServiceReference"
        },
        "schema": [ < physical schema, optional, retrievable during authoring > ],
        "typeProperties": {
            "schema": "<schema_name>",
            "table": "<table_name>"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for use to define activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the SQL Server source and sink.

### SQL Server as a source

>[!TIP]
>To load data from SQL Server efficiently by using data partitioning, learn more from [Parallel copy from SQL database](#parallel-copy-from-sql-database).

To copy data from SQL Server, set the source type in the copy activity to **SqlSource**. The following properties are supported in the copy activity source section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to **SqlSource**. | Yes |
| sqlReaderQuery |Use the custom SQL query to read data. An example is `select * from MyTable`. |No |
| sqlReaderStoredProcedureName |This property is the name of the stored procedure that reads data from the source table. The last SQL statement must be a SELECT statement in the stored procedure. |No |
| storedProcedureParameters |These parameters are for the stored procedure.<br/>Allowed values are name or value pairs. The names and casing of parameters must match the names and casing of the stored procedure parameters. |No |
| isolationLevel | Specifies the transaction locking behavior for the SQL source. The allowed values are: **ReadCommitted**, **ReadUncommitted**, **RepeatableRead**, **Serializable**, **Snapshot**. If not specified, the database's default isolation level is used. Refer to [this doc](/dotnet/api/system.data.isolationlevel) for more details. | No |
| partitionOptions | Specifies the data partitioning options used to load data from SQL Server. <br>Allowed values are: **None** (default), **PhysicalPartitionsOfTable**, and **DynamicRange**.<br>When a partition option is enabled (that is, not `None`), the degree of parallelism to concurrently load data from SQL Server is controlled by the [`parallelCopies`](copy-activity-performance-features.md#parallel-copy) setting on the copy activity. | No |
| partitionSettings | Specify the group of the settings for data partitioning. <br>Apply when the partition option isn't `None`. | No |
| ***Under `partitionSettings`:*** | | |
| partitionColumnName | Specify the name of the source column **in integer or  date/datetime type** (`int`, `smallint`, `bigint`, `date`, `smalldatetime`, `datetime`, `datetime2`, or `datetimeoffset`) that will be used by range partitioning for parallel copy. If not specified, the index or the primary key of the table is auto-detected and used as the partition column.<br>Apply when the partition option is `DynamicRange`. If you use a query to retrieve the source data, hook  `?AdfDynamicRangePartitionCondition ` in the WHERE clause. For an example, see the [Parallel copy from SQL database](#parallel-copy-from-sql-database) section. | No |
| partitionUpperBound | The maximum value of the partition column for partition range splitting. This value is used to decide the partition stride, not for filtering the rows in table. All rows in the table or query result will be partitioned and copied. If not specified, copy activity auto detect the value.  <br>Apply when the partition option is `DynamicRange`. For an example, see the [Parallel copy from SQL database](#parallel-copy-from-sql-database) section. | No |
| partitionLowerBound | The minimum value of the partition column for partition range splitting. This value is used to decide the partition stride, not for filtering the rows in table. All rows in the table or query result will be partitioned and copied. If not specified, copy activity auto detect the value.<br>Apply when the partition option is `DynamicRange`. For an example, see the [Parallel copy from SQL database](#parallel-copy-from-sql-database) section. | No |

**Note the following points:**

- If **sqlReaderQuery** is specified for **SqlSource**, the copy activity runs this query against the SQL Server source to get the data. You also can specify a stored procedure by specifying **sqlReaderStoredProcedureName** and **storedProcedureParameters** if the stored procedure takes parameters.
- When using stored procedure in source to retrieve data, note if your stored procedure is designed as returning different schema when different parameter value is passed in, you may encounter failure or see unexpected result when importing schema from UI or when copying data to SQL database with auto table creation.

**Example: Use SQL query**

```json
"activities":[
    {
        "name": "CopyFromSQLServer",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<SQL Server input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "SqlSource",
                "sqlReaderQuery": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

**Example: Use a stored procedure**

```json
"activities":[
    {
        "name": "CopyFromSQLServer",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<SQL Server input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "SqlSource",
                "sqlReaderStoredProcedureName": "CopyTestSrcStoredProcedureWithParameters",
                "storedProcedureParameters": {
                    "stringData": { "value": "str3" },
                    "identifier": { "value": "$$Text.Format('{0:yyyy}', <datetime parameter>)", "type": "Int"}
                }
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

**The stored procedure definition**

```sql
CREATE PROCEDURE CopyTestSrcStoredProcedureWithParameters
(
    @stringData varchar(20),
    @identifier int
)
AS
SET NOCOUNT ON;
BEGIN
    select *
    from dbo.UnitTestSrcTable
    where dbo.UnitTestSrcTable.stringData != stringData
    and dbo.UnitTestSrcTable.identifier != identifier
END
GO
```

### SQL Server as a sink

> [!TIP]
> Learn more about the supported write behaviors, configurations, and best practices from [Best practice for loading data into SQL Server](#best-practice-for-loading-data-into-sql-server).

To copy data to SQL Server, set the sink type in the copy activity to **SqlSink**. The following properties are supported in the copy activity sink section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to **SqlSink**. | Yes |
| preCopyScript |This property specifies a SQL query for the copy activity to run before writing data into SQL Server. It's invoked only once per copy run. You can use this property to clean up the preloaded data. |No |
| tableOption | Specifies whether to [automatically create the sink table](copy-activity-overview.md#auto-create-sink-tables) if not exists based on the source schema. Auto table creation is not supported when sink specifies stored procedure. Allowed values are: `none` (default), `autoCreate`. |No |
| sqlWriterStoredProcedureName | The name of the stored procedure that defines how to apply source data into a target table. <br/>This stored procedure is *invoked per batch*. For operations that run only once and have nothing to do with source data, for example, delete or truncate, use the `preCopyScript` property.<br>See example from [Invoke a stored procedure from a SQL sink](#invoke-a-stored-procedure-from-a-sql-sink). | No |
| storedProcedureTableTypeParameterName |The parameter name of the table type specified in the stored procedure.  |No |
| sqlWriterTableType |The table type name to be used in the stored procedure. The copy activity makes the data being moved available in a temp table with this table type. Stored procedure code can then merge the data that's being copied with existing data. |No |
| storedProcedureParameters |Parameters for the stored procedure.<br/>Allowed values are name and value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. | No |
| writeBatchSize |Number of rows to insert into the SQL table *per batch*.<br/>Allowed values are integers for the number of rows. By default, the service dynamically determines the appropriate batch size based on the row size. |No |
| writeBatchTimeout |This property specifies the wait time for the batch insert operation to complete before it times out.<br/>Allowed values are for the timespan. An example is "00:30:00" for 30 minutes. If no value is specified, the timeout defaults to "02:00:00". |No |
| maxConcurrentConnections |The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections.| No |
| WriteBehavior | Specify the write behavior for copy activity to load data into SQL Server Database. <br/> The allowed value is **Insert** and **Upsert**. By default, the service uses insert to load data. | No |
| upsertSettings | Specify the group of the settings for write behavior. <br/> Apply when the WriteBehavior option is `Upsert`. | No |
| ***Under `upsertSettings`:*** | | |
| useTempDB | Specify whether to use the a global temporary table or physical table as the interim table for upsert. <br>By default, the service uses global temporary table as the interim table. value is `true`. | No |
| interimSchemaName | Specify the interim schema for creating interim table if physical table is used. Note: user need to have the permission for creating and deleting table. By default, interim table will share the same schema as sink table. <br/> Apply when the useTempDB option is `False`. | No |
| keys | Specify the column names for unique row identification. Either a single key or a series of keys can be used. If not specified, the primary key is used. | No |

**Example 1: Append data**

```json
"activities":[
    {
        "name": "CopyToSQLServer",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<SQL Server output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "SqlSink",
                "tableOption": "autoCreate",
                "writeBatchSize": 100000
            }
        }
    }
]
```

**Example 2: Invoke a stored procedure during copy**

Learn more details from [Invoke a stored procedure from a SQL sink](#invoke-a-stored-procedure-from-a-sql-sink).

```json
"activities":[
    {
        "name": "CopyToSQLServer",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<SQL Server output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "SqlSink",
                "sqlWriterStoredProcedureName": "CopyTestStoredProcedureWithParameters",
                "storedProcedureTableTypeParameterName": "MyTable",
                "sqlWriterTableType": "MyTableType",
                "storedProcedureParameters": {
                    "identifier": { "value": "1", "type": "Int" },
                    "stringData": { "value": "str1" }
                }
            }
        }
    }
]
```

**Example 3: Upsert data**

```json
"activities":[
    {
        "name": "CopyToSQLServer",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<SQL Server output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "SqlSink",
                "tableOption": "autoCreate",
                "writeBehavior": "upsert",
                "upsertSettings": {
                    "useTempDB": true,
                    "keys": [
                        "<column name>"
                    ]
                },
            }
        }
    }
]
```


## Parallel copy from SQL database

The SQL Server connector in copy activity provides built-in data partitioning to copy data in parallel. You can find data partitioning options on the **Source** tab of the copy activity.

:::image type="content" source="./media/connector-sql-server/connector-sql-partition-options.png" alt-text="Screenshot of partition options":::

When you enable partitioned copy, copy activity runs parallel queries against your SQL Server source to load data by partitions. The parallel degree is controlled by the [`parallelCopies`](copy-activity-performance-features.md#parallel-copy) setting on the copy activity. For example, if you set `parallelCopies` to four, the service concurrently generates and runs four queries based on your specified partition option and settings, and each query retrieves a portion of data from your SQL Server.

You are suggested to enable parallel copy with data partitioning especially when you load large amount of data from your SQL Server. The following are suggested configurations for different scenarios. When copying data into file-based data store, it's recommended to write to a folder as multiple files (only specify folder name), in which case the performance is better than writing to a single file.

| Scenario                                                     | Suggested settings                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Full load from large table, with physical partitions.        | **Partition option**: Physical partitions of table. <br><br/>During execution, the service automatically detects the physical partitions, and copies data by partitions. <br><br/>To check if your table has physical partition or not, you can refer to [this query](#sample-query-to-check-physical-partition). |
| Full load from large table, without physical partitions, while with an integer or datetime column for data partitioning. | **Partition options**: Dynamic range partition.<br>**Partition column** (optional): Specify the column used to partition data. If not specified, the primary key column is used.<br/>**Partition upper bound** and **partition lower bound** (optional): Specify if you want to determine the partition stride. This is not for filtering the rows in table, all rows in the table will be partitioned and copied. If not specified, copy activity auto detects the values and it can take long time depending on MIN and MAX values. It is recommended to provide upper bound and lower bound. <br><br>For example, if your partition column "ID" has values range from 1 to 100, and you set the lower bound as 20 and the upper bound as 80, with parallel copy as 4, the service retrieves data by 4 partitions - IDs in range <=20, [21, 50], [51, 80], and >=81, respectively. |
| Load a large amount of data by using a custom query, without physical partitions, while with an integer or date/datetime column for data partitioning. | **Partition options**: Dynamic range partition.<br>**Query**: `SELECT * FROM <TableName> WHERE ?AdfDynamicRangePartitionCondition AND <your_additional_where_clause>`.<br>**Partition column**: Specify the column used to partition data.<br>**Partition upper bound** and **partition lower bound** (optional): Specify if you want to determine the partition stride. This is not for filtering the rows in table, all rows in the query result will be partitioned and copied. If not specified, copy activity auto detect the value.<br><br>During execution, the service replaces `?AdfRangePartitionColumnName` with the actual column name and value ranges for each partition, and sends to SQL Server. <br>For example, if your partition column "ID" has values range from 1 to 100, and you set the lower bound as 20 and the upper bound as 80, with parallel copy as 4, the service retrieves data by 4 partitions- IDs in range <=20, [21, 50], [51, 80], and >=81, respectively. <br><br>Here are more sample queries for different scenarios:<br> 1. Query the whole table: <br>`SELECT * FROM <TableName> WHERE ?AdfDynamicRangePartitionCondition`<br> 2. Query from a table with column selection and additional where-clause filters: <br>`SELECT <column_list> FROM <TableName> WHERE ?AdfDynamicRangePartitionCondition AND <your_additional_where_clause>`<br> 3. Query with subqueries: <br>`SELECT <column_list> FROM (<your_sub_query>) AS T WHERE ?AdfDynamicRangePartitionCondition AND <your_additional_where_clause>`<br> 4. Query with partition in subquery: <br>`SELECT <column_list> FROM (SELECT <your_sub_query_column_list> FROM <TableName> WHERE ?AdfDynamicRangePartitionCondition) AS T`
|

Best practices to load data with partition option:

1. Choose distinctive column as partition column (like primary key or unique key) to avoid data skew. 
2. If the table has built-in partition, use partition option "Physical partitions of table" to get better performance.    
3. If you use Azure Integration Runtime to copy data, you can set larger "[Data Integration Units (DIU)](copy-activity-performance-features.md#data-integration-units)" (>4) to utilize more computing resource. Check the applicable scenarios there.
4. "[Degree of copy parallelism](copy-activity-performance-features.md#parallel-copy)" control the partition numbers, setting this number too large sometime hurts the performance, recommend setting this number as (DIU or number of Self-hosted IR nodes) * (2 to 4).

**Example: full load from large table with physical partitions**

```json
"source": {
    "type": "SqlSource",
    "partitionOption": "PhysicalPartitionsOfTable"
}
```

**Example: query with dynamic range partition**

```json
"source": {
    "type": "SqlSource",
    "query": "SELECT * FROM <TableName> WHERE ?AdfDynamicRangePartitionCondition AND <your_additional_where_clause>",
    "partitionOption": "DynamicRange",
    "partitionSettings": {
        "partitionColumnName": "<partition_column_name>",
        "partitionUpperBound": "<upper_value_of_partition_column (optional) to decide the partition stride, not as data filter>",
        "partitionLowerBound": "<lower_value_of_partition_column (optional) to decide the partition stride, not as data filter>"
    }
}
```

### Sample query to check physical partition

```sql
SELECT DISTINCT s.name AS SchemaName, t.name AS TableName, pf.name AS PartitionFunctionName, c.name AS ColumnName, iif(pf.name is null, 'no', 'yes') AS HasPartition
FROM sys.tables AS t
LEFT JOIN sys.objects AS o ON t.object_id = o.object_id
LEFT JOIN sys.schemas AS s ON o.schema_id = s.schema_id
LEFT JOIN sys.indexes AS i ON t.object_id = i.object_id 
LEFT JOIN sys.index_columns AS ic ON ic.partition_ordinal > 0 AND ic.index_id = i.index_id AND ic.object_id = t.object_id 
LEFT JOIN sys.columns AS c ON c.object_id = ic.object_id AND c.column_id = ic.column_id 
LEFT JOIN sys.partition_schemes ps ON i.data_space_id = ps.data_space_id 
LEFT JOIN sys.partition_functions pf ON pf.function_id = ps.function_id 
WHERE s.name='[your schema]' AND t.name = '[your table name]'
```

If the table has physical partition, you would see "HasPartition" as "yes" like the following.

:::image type="content" source="./media/connector-azure-sql-database/sql-query-result.png" alt-text="Sql query result":::

## Best practice for loading data into SQL Server

When you copy data into SQL Server, you might require different write behavior:

- [Append](#append-data): My source data has only new records.
- [Upsert](#upsert-data): My source data has both inserts and updates.
- [Overwrite](#overwrite-the-entire-table): I want to reload the entire dimension table each time.
- [Write with custom logic](#write-data-with-custom-logic): I need extra processing before the final insertion into the destination table.

See the respective sections for how to configure and best practices.

### Append data

Appending data is the default behavior of this SQL Server sink connector. the service does a bulk insert to write to your table efficiently. You can configure the source and sink accordingly in the copy activity.

### Upsert data

Copy activity now supports natively loading data into a database temporary table and then update the data in sink table if key exists and otherwise insert new data. To learn more about upsert settings in copy activities, see [SQL Server as a sink](#sql-server-as-a-sink).

### Overwrite the entire table

You can configure the **preCopyScript** property in a copy activity sink. In this case, for each copy activity that runs, the service runs the script first. Then it runs the copy to insert the data. For example, to overwrite the entire table with the latest data, specify a script to first delete all the records before you bulk load the new data from the source.

### Write data with custom logic

The steps to write data with custom logic are similar to those described in the [Upsert data](#upsert-data) section. When you need to apply extra processing before the final insertion of source data into the destination table, you can load to a staging table then invoke stored procedure activity, or invoke a stored procedure in copy activity sink to apply data.

## <a name="invoke-a-stored-procedure-from-a-sql-sink"></a> Invoke a stored procedure from a SQL sink

When you copy data into SQL Server database, you also can configure and invoke a user-specified stored procedure with additional parameters on each batch of the source table. The stored procedure feature takes advantage of [table-valued parameters](/dotnet/framework/data/adonet/sql/table-valued-parameters).  Note that the service automatically wraps the stored procedure in its own transaction, so any transaction created inside the stored procedure will become a nested transaction, and could have implications for exception handling.

You can use a stored procedure when built-in copy mechanisms don't serve the purpose. An example is when you want to apply extra processing before the final insertion of source data into the destination table. Some extra processing examples are when you want to merge columns, look up additional values, and insert into more than one table.

The following sample shows how to use a stored procedure to do an upsert into a table in the SQL Server database. Assume that the input data and the sink **Marketing** table each have three columns: **ProfileID**, **State**, and **Category**. Do the upsert based on the **ProfileID** column, and only apply it for a specific category called "ProductA".

1. In your database, define the table type with the same name as **sqlWriterTableType**. The schema of the table type is the same as the schema returned by your input data.

    ```sql
    CREATE TYPE [dbo].[MarketingType] AS TABLE(
        [ProfileID] [varchar](256) NOT NULL,
        [State] [varchar](256) NOT NULL,
        [Category] [varchar](256) NOT NULL
    )
    ```

2. In your database, define the stored procedure with the same name as **sqlWriterStoredProcedureName**. It handles input data from your specified source and merges into the output table. The parameter name of the table type in the stored procedure is the same as **tableName** defined in the dataset.

    ```sql
    CREATE PROCEDURE spOverwriteMarketing @Marketing [dbo].[MarketingType] READONLY, @category varchar(256)
    AS
    BEGIN
    MERGE [dbo].[Marketing] AS target
    USING @Marketing AS source
    ON (target.ProfileID = source.ProfileID and target.Category = @category)
    WHEN MATCHED THEN
        UPDATE SET State = source.State
    WHEN NOT MATCHED THEN
        INSERT (ProfileID, State, Category)
        VALUES (source.ProfileID, source.State, source.Category);
    END
    ```

3. Define the **SQL sink** section in the copy activity as follows:

    ```json
    "sink": {
        "type": "SqlSink",
        "sqlWriterStoredProcedureName": "spOverwriteMarketing",
        "storedProcedureTableTypeParameterName": "Marketing",
        "sqlWriterTableType": "MarketingType",
        "storedProcedureParameters": {
            "category": {
                "value": "ProductA"
            }
        }
    }
    ```

## Mapping data flow properties

When transforming data in mapping data flow, you can read and write to tables from SQL Server Database. For more information, see the [source transformation](data-flow-source.md) and [sink transformation](data-flow-sink.md) in mapping data flows.

> [!NOTE]
> To access on premise SQL Server, you need to use Azure Data Factory or Synapse workspace [Managed Virtual Network](managed-virtual-network-private-endpoint.md) using a private endpoint. Refer to this [tutorial](tutorial-managed-virtual-network-on-premise-sql-server.md) for detailed steps.

### Source transformation

The below table lists the properties supported by SQL Server source. You can edit these properties in the **Source options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Table | If you select Table as input, data flow fetches all the data from the table specified in the dataset. | No | - |- |
| Query | If you select Query as input, specify a SQL query to fetch data from source, which overrides any table you specify in dataset. Using queries is a great way to reduce rows for testing or lookups.<br><br>**Order By** clause is not supported, but you can set a full SELECT FROM statement. You can also use user-defined table functions. **select * from udfGetData()** is a UDF in SQL that returns a table that you can use in data flow.<br>Query example: `Select * from MyTable where customerId > 1000 and customerId < 2000`| No | String | query |
| Batch size | Specify a batch size to chunk large data into reads. | No | Integer | batchSize |
| Isolation Level | Choose one of the following isolation levels:<br>- Read Committed<br>- Read Uncommitted (default)<br>- Repeatable Read<br>- Serializable<br>- None (ignore isolation level) | No | <small>READ_COMMITTED<br/>READ_UNCOMMITTED<br/>REPEATABLE_READ<br/>SERIALIZABLE<br/>NONE</small> |isolationLevel |
| Enable incremental extract | Use this option to tell ADF to only process rows that have changed since the last time that the pipeline executed. | No | - |- |
| Incremental date column | When using the incremental extract feature, you must choose the date/time column that you wish to use as the watermark in your source table. | No | - |- |
| Enable native change data capture(Preview) | Use this option to tell ADF to only process delta data captured by [SQL change data capture technology](/sql/relational-databases/track-changes/about-change-data-capture-sql-server) since the last time that the pipeline executed. With this option, the delta data including row insert, update and deletion will be loaded automatically without any incremental date column required. You need to [enable change data capture](/sql/relational-databases/track-changes/enable-and-disable-change-data-capture-sql-server) on SQL Server before using this option in ADF. For more information about this option in ADF, see [native change data capture](#native-change-data-capture). | No | - |- |
| Start reading from beginning | Setting this option with incremental extract will instruct ADF to read all rows on first execution of a pipeline with incremental extract turned on. | No | - |- |




> [!TIP]
> The [common table expression (CTE)](/sql/t-sql/queries/with-common-table-expression-transact-sql?view=sql-server-ver15&preserve-view=true) in SQL is not supported in the mapping data flow **Query** mode, because the prerequisite of using this mode is that queries can be used in the SQL query FROM clause but CTEs cannot do this.
>To use CTEs, you need to create a stored procedure using the following query:
>```SQL
> CREATE PROC CTESP @query nvarchar(max)
> AS
> BEGIN
> EXECUTE sp_executesql @query;
> END
>```
>Then use the **Stored procedure** mode in the source transformation of the mapping data flow and set the `@query` like example `with CTE as (select 'test' as a) select * from CTE`. Then you can use CTEs as expected.

#### SQL Server source script example

When you use SQL Server as source type, the associated data flow script is:

```
source(allowSchemaDrift: true,
    validateSchema: false,
    isolationLevel: 'READ_UNCOMMITTED',
    query: 'select * from MYTABLE',
    format: 'query') ~> SQLSource
```

### Sink transformation

The below table lists the properties supported by SQL Server sink. You can edit these properties in the **Sink options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Update method | Specify what operations are allowed on your database destination. The default is to only allow inserts.<br>To update, upsert, or delete rows, an [Alter row transformation](data-flow-alter-row.md) is required to tag rows for those actions. | Yes | `true` or `false` | deletable <br/>insertable <br/>updateable <br/>upsertable |
| Key columns | For updates, upserts and deletes, key column(s) must be set to determine which row to alter.<br>The column name that you pick as the key will be used as part of the subsequent update, upsert, delete. Therefore, you must pick a column that exists in the Sink mapping. | No | Array | keys |
| Skip writing key columns | If you wish to not write the value to the key column, select "Skip writing key columns". | No | `true` or `false` | skipKeyWrites |
| Table action |Determines whether to recreate or remove all rows from the destination table prior to writing.<br>- **None**: No action will be done to the table.<br>- **Recreate**: The table will get dropped and recreated. Required if creating a new table dynamically.<br>- **Truncate**: All rows from the target table will get removed. | No | `true` or `false` | recreate<br/>truncate |
| Batch size | Specify how many rows are being written in each batch. Larger batch sizes improve compression and memory optimization, but risk out of memory exceptions when caching data. | No | Integer | batchSize |
| Pre and Post SQL scripts | Specify multi-line SQL scripts that will execute before (pre-processing) and after (post-processing) data is written to your Sink database. | No | String | preSQLs<br>postSQLs |

> [!TIP]
> 1. It's recommended to break single batch scripts with multiple commands into multiple batches.
> 2. Only Data Definition Language (DDL) and Data Manipulation Language (DML) statements that return a simple update count can be run as part of a batch. Learn more from [Performing batch operations](/sql/connect/jdbc/performing-batch-operations)

#### SQL Server sink script example

When you use SQL Server as sink type, the associated data flow script is:

```
IncomingStream sink(allowSchemaDrift: true,
    validateSchema: false,
    deletable:false,
    insertable:true,
    updateable:true,
    upsertable:true,
    keys:['keyColumn'],
    format: 'table',
    skipDuplicateMapInputs: true,
    skipDuplicateMapOutputs: true) ~> SQLSink
```

## Data type mapping for SQL Server

When you copy data from and to SQL Server, the following mappings are used from SQL Server data types to Azure Data Factory interim data types. Synapse pipelines, which implement Data Factory, use the same mappings.  To learn how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| SQL Server data type | Data Factory interim data type |
|:--- |:--- |
| bigint |Int64 |
| binary |Byte[] |
| bit |Boolean |
| char |String, Char[] |
| date |DateTime |
| Datetime |DateTime |
| datetime2 |DateTime |
| Datetimeoffset |DateTimeOffset |
| Decimal |Decimal |
| FILESTREAM attribute (varbinary(max)) |Byte[] |
| Float |Double |
| image |Byte[] |
| int |Int32 |
| money |Decimal |
| nchar |String, Char[] |
| ntext |String, Char[] |
| numeric |Decimal |
| nvarchar |String, Char[] |
| real |Single |
| rowversion |Byte[] |
| smalldatetime |DateTime |
| smallint |Int16 |
| smallmoney |Decimal |
| sql_variant |Object |
| text |String, Char[] |
| time |TimeSpan |
| timestamp |Byte[] |
| tinyint |Int16 |
| uniqueidentifier |Guid |
| varbinary |Byte[] |
| varchar |String, Char[] |
| xml |String |

>[!NOTE]
> For data types that map to the Decimal interim type, currently Copy activity supports precision up to 28. If you have data that requires precision larger than 28, consider converting to a string in a SQL query.  
>
> When copying data from SQL Server using Azure Data Factory, the bit data type is mapped to the Boolean interim data type. If you have data that need to be kept as the bit data type, use queries with [T-SQL CAST or CONVERT](/sql/t-sql/functions/cast-and-convert-transact-sql?view=sql-server-ver15&preserve-view=true). 

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## GetMetadata activity properties

To learn details about the properties, check [GetMetadata activity](control-flow-get-metadata-activity.md) 

## Using Always Encrypted

When you copy data from/to SQL Server with [Always Encrypted](/sql/relational-databases/security/encryption/always-encrypted-database-engine), follow below steps: 

1. Store the [Column Master Key (CMK)](/sql/relational-databases/security/encryption/create-and-store-column-master-keys-always-encrypted?view=sql-server-ver15&preserve-view=true) in an [Azure Key Vault](../key-vault/general/overview.md). Learn more on [how to configure Always Encrypted by using Azure Key Vault](/azure/azure-sql/database/always-encrypted-azure-key-vault-configure?tabs=azure-powershell)

2. Make sure to grant access to the key vault where the [Column Master Key (CMK)](/sql/relational-databases/security/encryption/create-and-store-column-master-keys-always-encrypted?view=sql-server-ver15&preserve-view=true) is stored. Refer to this [article](/sql/relational-databases/security/encryption/create-and-store-column-master-keys-always-encrypted?view=sql-server-ver15&preserve-view=true#key-vaults) for required permissions.

3. Create linked service to connect to your SQL database and enable 'Always Encrypted' function by using either managed identity or service principal. 


>[!NOTE]
>SQL Server [Always Encrypted](/sql/relational-databases/security/encryption/always-encrypted-database-engine) supports below scenarios: 
>1. Either source or sink data stores is using managed identity or service principal as key provider authentication type.
>2. Both source and sink data stores are using managed identity as key provider authentication type.
>3. Both source and sink data stores are using the same service principal as key provider authentication type.

>[!NOTE]
>Currently, SQL Server [**Always Encrypted**](/sql/relational-databases/security/encryption/always-encrypted-database-engine?view=sql-server-ver15&preserve-view=true) is only supported for source transformation in mapping data flows.


## Native change data capture

Azure Data Factory can support native change data capture capabilities for SQL Server, Azure SQL DB and Azure SQL MI. The changed data including row insert, update and deletion in SQL stores can be automatically detected and extracted by ADF mapping dataflow. With the no code experience in mapping dataflow, users can easily achieve data replication scenario from SQL stores by appending a database as destination store.  What is more, users can also compose any data transform logic in between to achieve incremental ETL scenario from SQL stores.

Make sure you keep the pipeline and activity name unchanged, so that the checkpoint can be recorded by ADF for you to get changed data from the last run automatically. If you change your pipeline name or activity name, the checkpoint will be reset, which leads you to start from beginning or get changes from now in the next run. If you do want to change the pipeline name or activity name but still keep the checkpoint to get changed data from the last run automatically, please use your own Checkpoint key in dataflow activity to achieve that.

When you debug the pipeline, this feature works the same. Be aware that the checkpoint will be reset when you refresh your browser during the debug run. After you are satisfied with the pipeline result from debug run, you can go ahead to publish and trigger the pipeline. At the moment when you first time trigger your published pipeline, it automatically restarts from the beginning or gets changes from now on.

In the monitoring section, you always have the chance to rerun a pipeline. When you are doing so, the changed data is always captured from the previous checkpoint of your selected pipeline run.

### Example 1:

When you directly chain a source transform referenced to SQL CDC enabled dataset with a sink transform referenced to a database in a mapping dataflow, the changes happened on SQL source will be automatically applied to the target database, so that you will easily get data replication scenario between databases. You can use update method in sink transform to select whether you want to allow insert, allow update or allow delete on target database. The example script in mapping dataflow is as below.

```json
source(output(
		id as integer,
		name as string
	),
	allowSchemaDrift: true,
	validateSchema: false,
	enableNativeCdc: true,
	netChanges: true,
	skipInitialLoad: false,
	isolationLevel: 'READ_UNCOMMITTED',
	format: 'table') ~> source1
source1 sink(allowSchemaDrift: true,
	validateSchema: false,
	deletable:true,
	insertable:true,
	updateable:true,
	upsertable:true,
	keys:['id'],
	format: 'table',
	skipDuplicateMapInputs: true,
	skipDuplicateMapOutputs: true,
	errorHandlingOption: 'stopOnFirstError') ~> sink1
```

### Example 2:

If you want to enable ETL scenario instead of data replication between database via SQL CDC, you can use expressions in mapping dataflow including isInsert(1), isUpdate(1) and isDelete(1) to differentiate the rows with different operation types.  The following is one of the example scripts for mapping dataflow on deriving one column with the value: 1 to indicate inserted rows, 2 to indicate updated rows and 3 to indicate deleted rows for downstream transforms to process the delta data.

```json
source(output(
		id as integer,
		name as string
	),
	allowSchemaDrift: true,
	validateSchema: false,
	enableNativeCdc: true,
	netChanges: true,
	skipInitialLoad: false,
	isolationLevel: 'READ_UNCOMMITTED',
	format: 'table') ~> source1
source1 derive(operationType = iif(isInsert(1), 1, iif(isUpdate(1), 2, 3))) ~> derivedColumn1
derivedColumn1 sink(allowSchemaDrift: true,
	validateSchema: false,
	skipDuplicateMapInputs: true,
	skipDuplicateMapOutputs: true) ~> sink1
```

### Known limitation:

*    Only **net changes** from SQL CDC will be loaded by ADF via [cdc.fn_cdc_get_net_changes_](/sql/relational-databases/system-functions/cdc-fn-cdc-get-net-changes-capture-instance-transact-sql?source=recommendations).

## Troubleshoot connection issues

1. Configure your SQL Server instance to accept remote connections. Start **SQL Server Management Studio**, right-click **server**, and select **Properties**. Select **Connections** from the list, and select the **Allow remote connections to this server** check box.

    :::image type="content" source="media/copy-data-to-from-sql-server/AllowRemoteConnections.png" alt-text="Enable remote connections":::

    For detailed steps, see [Configure the remote access server configuration option](/sql/database-engine/configure-windows/configure-the-remote-access-server-configuration-option).

2. Start **SQL Server Configuration Manager**. Expand **SQL Server Network Configuration** for the instance you want, and select **Protocols for MSSQLSERVER**. Protocols appear in the right pane. Enable TCP/IP by right-clicking **TCP/IP** and selecting **Enable**.

    :::image type="content" source="./media/copy-data-to-from-sql-server/EnableTCPProptocol.png" alt-text="Enable TCP/IP":::

    For more information and alternate ways of enabling TCP/IP protocol, see [Enable or disable a server network protocol](/sql/database-engine/configure-windows/enable-or-disable-a-server-network-protocol).

3. In the same window, double-click **TCP/IP** to launch the **TCP/IP Properties** window.
4. Switch to the **IP Addresses** tab. Scroll down to see the **IPAll** section. Write down the **TCP Port**. The default is **1433**.
5. Create a **rule for the Windows Firewall** on the machine to allow incoming traffic through this port. 
6. **Verify connection**: To connect to SQL Server by using a fully qualified name, use SQL Server Management Studio from a different machine. An example is `"<machine>.<domain>.corp.<company>.com,1433"`.

## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
