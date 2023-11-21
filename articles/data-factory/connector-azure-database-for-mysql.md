---
title: Copy and transform data in Azure Database for MySQL
description: Learn how to copy and transform data in Azure Database for MySQL using Azure Data Factory or Synapse Analytics pipelines.
titleSuffix: Azure Data Factory & Azure Synapse
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 10/20/2023
---

# Copy and transform data in Azure Database for MySQL using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory or Synapse Analytics pipelines to copy data from and to Azure Database for MySQL, and use Data Flow to transform data in Azure Database for MySQL. To learn more, read the introductory articles for [Azure Data Factory](introduction.md) and [Synapse Analytics](../synapse-analytics/overview-what-is.md).

This connector is specialized for 
- [Azure Database for MySQL Single Server](../mysql/single-server-overview.md)
- [Azure Database for MySQL Flexible Server](../mysql/flexible-server/overview.md) 

 To copy data from generic MySQL database located on-premises or in the cloud, use [MySQL connector](connector-mysql.md).

## Prerequisites

This quickstart requires the following resources and configuration mentioned below as a starting point:

- An existing Azure database for MySQL Single server or MySQL Flexible Server with public access or private endpoint. 
- Enable **Allow public access from any Azure service within Azure to this server** in networking page of the MySQL server . This will allow you to use Data factory studio.

## Supported capabilities

This Azure Database for MySQL connector is supported for the following capabilities:

| Supported capabilities|IR | Managed private endpoint|
|---------| --------| --------|
|[Copy activity](copy-activity-overview.md) (source/sink)|&#9312; &#9313;|✓ |
|[Mapping data flow](concepts-data-flow-overview.md) (source/sink)|&#9312; |✓ |
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|✓ |

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Azure Database for MySQL using UI

Use the following steps to create a linked service to Azure Database for MySQL in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Create a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Create a new linked service with Azure Synapse UI.":::

2. Search for MySQL and select the Azure Database for MySQL connector.

   :::image type="content" source="media/connector-azure-database-for-mysql/azure-database-for-mysql-connector.png" alt-text="Select the Azure Database for MySQL connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-azure-database-for-mysql/configure-azure-database-for-mysql-linked-service.png" alt-text="Configure a linked service to Azure Database for MySQL.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Azure Database for MySQL connector.

## Linked service properties

The following properties are supported for Azure Database for MySQL linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzureMySql** | Yes |
| connectionString | Specify information needed to connect to the Azure Database for MySQL instance. <br/> You can also put password in Azure Key Vault and pull the `password` configuration out of the connection string. Refer to the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details. | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Azure Integration Runtime or Self-hosted Integration Runtime (if your data store is located in private network). If not specified, it uses the default Azure Integration Runtime. |No |

A typical connection string is `Server=<server>.mysql.database.azure.com;Port=<port>;Database=<database>;UID=<username>;PWD=<password>`. More properties you can set per your case:

| Property | Description | Options | Required |
|:--- |:--- |:--- |:--- |
| SSLMode | This option specifies whether the driver uses TLS encryption and verification when connecting to MySQL. E.g. `SSLMode=<0/1/2/3/4>`| DISABLED (0) / PREFERRED (1) **(Default)** / REQUIRED (2) / VERIFY_CA (3) / VERIFY_IDENTITY (4) | No |
| UseSystemTrustStore | This option specifies whether to use a CA certificate from the system trust store, or from a specified PEM file. E.g. `UseSystemTrustStore=<0/1>;`| Enabled (1) / Disabled (0) **(Default)** | No |

**Example:**

```json
{
    "name": "AzureDatabaseForMySQLLinkedService",
    "properties": {
        "type": "AzureMySql",
        "typeProperties": {
            "connectionString": "Server=<server>.mysql.database.azure.com;Port=<port>;Database=<database>;UID=<username>;PWD=<password>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example: store password in Azure Key Vault**

```json
{
    "name": "AzureDatabaseForMySQLLinkedService",
    "properties": {
        "type": "AzureMySql",
        "typeProperties": {
            "connectionString": "Server=<server>.mysql.database.azure.com;Port=<port>;Database=<database>;UID=<username>;",
            "password": { 
                "type": "AzureKeyVaultSecret", 
                "store": { 
                    "referenceName": "<Azure Key Vault linked service name>", 
                    "type": "LinkedServiceReference" 
                }, 
                "secretName": "<secretName>" 
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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Azure Database for MySQL dataset.

To copy data from Azure Database for MySQL, set the type property of the dataset to **AzureMySqlTable**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **AzureMySqlTable** | Yes |
| tableName | Name of the table in the MySQL database. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "AzureMySQLDataset",
    "properties": {
        "type": "AzureMySqlTable",
        "linkedServiceName": {
            "referenceName": "<Azure MySQL linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "tableName": "<table name>"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Azure Database for MySQL source and sink.

### Azure Database for MySQL as source

To copy data from Azure Database for MySQL, the following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **AzureMySqlSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |
| queryCommandTimeout | The wait time before the query request times out. Default is 120 minutes (02:00:00) | No |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromAzureDatabaseForMySQL",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Azure MySQL input dataset name>",
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
                "type": "AzureMySqlSource",
                "query": "<custom query e.g. SELECT * FROM MyTable>"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

### Azure Database for MySQL as sink

To copy data to Azure Database for MySQL, the following properties are supported in the copy activity **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to: **AzureMySqlSink** | Yes |
| preCopyScript | Specify a SQL query for the copy activity to execute before writing data into Azure Database for MySQL in each run. You can use this property to clean up the preloaded data. | No |
| writeBatchSize | Inserts data into the Azure Database for MySQL table when the buffer size reaches writeBatchSize.<br>Allowed value is integer representing number of rows. | No (default is 10,000) |
| writeBatchTimeout | Wait time for the batch insert operation to complete before it times out.<br>Allowed values are Timespan. An example is 00:30:00 (30 minutes). | No (default is 00:00:30) |

**Example:**

```json
"activities":[
    {
        "name": "CopyToAzureDatabaseForMySQL",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Azure MySQL output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "AzureMySqlSink",
                "preCopyScript": "<custom SQL script>",
                "writeBatchSize": 100000
            }
        }
    }
]
```

## Mapping data flow properties

When transforming data in mapping data flow, you can read and write to tables from Azure Database for MySQL. For more information, see the [source transformation](data-flow-source.md) and [sink transformation](data-flow-sink.md) in mapping data flows. You can choose to use an Azure Database for MySQL dataset or an [inline dataset](data-flow-source.md#inline-datasets) as source and sink type.

### Source transformation

The below table lists the properties supported by Azure Database for MySQL source. You can edit these properties in the **Source options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Table | If you select Table as input, data flow fetches all the data from the table specified in the dataset. | No | - |*(for inline dataset only)*<br>tableName |
| Query | If you select Query as input, specify a SQL query to fetch data from source, which overrides any table you specify in dataset. Using queries is a great way to reduce rows for testing or lookups.<br><br>**Order By** clause is not supported, but you can set a full SELECT FROM statement. You can also use user-defined table functions. **select * from udfGetData()** is a UDF in SQL that returns a table that you can use in data flow.<br>Query example: `select * from mytable where customerId > 1000 and customerId < 2000` or `select * from "MyTable"`.| No | String | query |
| Stored procedure | If you select Stored procedure as input, specify a name of the stored procedure to read data from the source table, or select Refresh to ask the service to discover the procedure names.| Yes (if you select Stored procedure as input) | String | procedureName |
| Procedure parameters | If you select Stored procedure as input, specify any input parameters for the stored procedure in the order set in the procedure, or select Import to import all procedure parameters using the form `@paraName`. | No | Array | inputs |
| Batch size | Specify a batch size to chunk large data into batches. | No | Integer | batchSize |
| Isolation Level | Choose one of the following isolation levels:<br>- Read Committed<br>- Read Uncommitted (default)<br>- Repeatable Read<br>- Serializable<br>- None (ignore isolation level) | No | READ_COMMITTED<br/>READ_UNCOMMITTED<br/>REPEATABLE_READ<br/>SERIALIZABLE<br/>NONE |isolationLevel |

#### Azure Database for MySQL source script example

When you use Azure Database for MySQL as source type, the associated data flow script is:

```
source(allowSchemaDrift: true,
    validateSchema: false,
    isolationLevel: 'READ_UNCOMMITTED',
    query: 'select * from mytable',
    format: 'query') ~> AzureMySQLSource
```

### Sink transformation

The below table lists the properties supported by Azure Database for MySQL sink. You can edit these properties in the **Sink options** tab.

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

* Enable incremental extract: Use this option to tell ADF to only process rows that have changed since the last time that the pipeline executed.

* Incremental column: When using the incremental extract feature, you must choose the date/time or numeric column that you wish to use as the watermark in your source table.

* Start reading from beginning: Setting this option with incremental extract will instruct ADF to read all rows on first execution of a pipeline with incremental extract turned on.

#### Azure Database for MySQL sink script example

When you use Azure Database for MySQL as sink type, the associated data flow script is:

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
    skipDuplicateMapOutputs: true) ~> AzureMySQLSink
```

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Data type mapping for Azure Database for MySQL

When copying data from Azure Database for MySQL, the following mappings are used from MySQL data types to interim data types used internally within the service. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

| Azure Database for MySQL data type | Interim service data type |
|:--- |:--- |
| `bigint` |`Int64` |
| `bigint unsigned` |`Decimal` |
| `bit` |`Boolean` |
| `bit(M), M>1`|`Byte[]`|
| `blob` |`Byte[]` |
| `bool` |`Int16` |
| `char` |`String` |
| `date` |`Datetime` |
| `datetime` |`Datetime` |
| `decimal` |`Decimal, String` |
| `double` |`Double` |
| `double precision` |`Double` |
| `enum` |`String` |
| `float` |`Single` |
| `int` |`Int32` |
| `int unsigned` |`Int64`|
| `integer` |`Int32` |
| `integer unsigned` |`Int64` |
| `long varbinary` |`Byte[]` |
| `long varchar` |`String` |
| `longblob` |`Byte[]` |
| `longtext` |`String` |
| `mediumblob` |`Byte[]` |
| `mediumint` |`Int32` |
| `mediumint unsigned` |`Int64` |
| `mediumtext` |`String` |
| `numeric` |`Decimal` |
| `real` |`Double` |
| `set` |`String` |
| `smallint` |`Int16` |
| `smallint unsigned` |`Int32` |
| `text` |`String` |
| `time` |`TimeSpan` |
| `timestamp` |`Datetime` |
| `tinyblob` |`Byte[]` |
| `tinyint` |`Int16` |
| `tinyint unsigned` |`Int16` |
| `tinytext` |`String` |
| `varchar` |`String` |
| `year` |`Int32` |

## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
