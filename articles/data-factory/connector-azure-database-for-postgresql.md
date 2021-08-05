---
title: Copy and transform data in Azure Database for PostgreSQL
description: Learn how to copy and transform data in Azure Database for PostgreSQL using Azure Data Factory and Synapse Analytics.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.topic: conceptual
ms.custom: synapse
ms.date: 06/16/2021
---

# Copy and transform data in Azure Database for PostgreSQL using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory and Synapse Analytics pipelines to copy data from and to Azure Database for PostgreSQL, and use Data Flow to transform data in Azure Database for PostgreSQL. To learn more, read the introductory articles for [Azure Data Factory](introduction.md) and [Synapse Analytics](../synapse-analytics/overview-what-is.md).

This connector is specialized for the [Azure Database for PostgreSQL service](../postgresql/overview.md). To copy data from a generic PostgreSQL database located on-premises or in the cloud, use the [PostgreSQL connector](connector-postgresql.md).

## Supported capabilities

This Azure Database for PostgreSQL connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with a [supported source/sink matrix](copy-activity-overview.md)
- [Mapping data flow](concepts-data-flow-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)

Currently, data flow supports Azure database for PostgreSQL Single Server but not Flexible Server or Hyperscale (Citus); data flow in Azure Synapse Analytics supports all PostgreSQL flavors.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

The following sections offer details about properties that are used to define entities specific to Azure Database for PostgreSQL connector.

## Linked service properties

The following properties are supported for the Azure Database for PostgreSQL linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzurePostgreSql**. | Yes |
| connectionString | An ODBC connection string to connect to Azure Database for PostgreSQL.<br/>You can also put a password in Azure Key Vault and pull the `password` configuration out of the connection string. See the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) for more details. | Yes |
| connectVia | This property represents the [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Azure Integration Runtime or Self-hosted Integration Runtime (if your data store is located in private network). If not specified, it uses the default Azure Integration Runtime. |No |

A typical connection string is `Server=<server>.postgres.database.azure.com;Database=<database>;Port=<port>;UID=<username>;Password=<Password>`. Here are more properties you can set per your case:

| Property | Description | Options | Required |
|:--- |:--- |:--- |:--- |
| EncryptionMethod (EM)| The method the driver uses to encrypt data sent between the driver and the database server. For example,  `EncryptionMethod=<0/1/6>;`| 0 (No Encryption) **(Default)** / 1 (SSL) / 6 (RequestSSL) | No |
| ValidateServerCertificate (VSC) | Determines whether the driver validates the certificate that's sent by the database server when SSL encryption is enabled (Encryption Method=1). For example,  `ValidateServerCertificate=<0/1>;`| 0 (Disabled) **(Default)** / 1 (Enabled) | No |

**Example**:

```json
{
    "name": "AzurePostgreSqlLinkedService",
    "properties": {
        "type": "AzurePostgreSql",
        "typeProperties": {
            "connectionString": "Server=<server>.postgres.database.azure.com;Database=<database>;Port=<port>;UID=<username>;Password=<Password>"
        }
    }
}
```

**Example**:

***Store password in Azure Key Vault***

```json
{
    "name": "AzurePostgreSqlLinkedService",
    "properties": {
        "type": "AzurePostgreSql",
        "typeProperties": {
            "connectionString": "Server=<server>.postgres.database.azure.com;Database=<database>;Port=<port>;UID=<username>;",
            "password": { 
                "type": "AzureKeyVaultSecret", 
                "store": { 
                    "referenceName": "<Azure Key Vault linked service name>", 
                    "type": "LinkedServiceReference" 
                }, 
                "secretName": "<secretName>" 
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see [Datasets](concepts-datasets-linked-services.md). This section provides a list of properties that Azure Database for PostgreSQL  supports in datasets.

To copy data from Azure Database for PostgreSQL, set the type property of the dataset to **AzurePostgreSqlTable**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to **AzurePostgreSqlTable** | Yes |
| tableName | Name of the table | No (if "query" in activity source is specified) |

**Example**:

```json
{
    "name": "AzurePostgreSqlDataset",
    "properties": {
        "type": "AzurePostgreSqlTable",
        "linkedServiceName": {
            "referenceName": "<AzurePostgreSql linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {}
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see [Pipelines and activities](concepts-pipelines-activities.md). This section provides a list of properties supported by an Azure Database for PostgreSQL source.

### Azure Database for PostgreSql as source

To copy data from Azure Database for PostgreSQL, set the source type in the copy activity to **AzurePostgreSqlSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to **AzurePostgreSqlSource** | Yes |
| query | Use the custom SQL query to read data. For example: `SELECT * FROM mytable` or `SELECT * FROM "MyTable"`. Note in PostgreSQL, the entity name is treated as case-insensitive if not quoted. | No (if the tableName property in the dataset is specified) |

**Example**:

```json
"activities":[
    {
        "name": "CopyFromAzurePostgreSql",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<AzurePostgreSql input dataset name>",
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
                "type": "AzurePostgreSqlSource",
                "query": "<custom query e.g. SELECT * FROM mytable>"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

### Azure Database for PostgreSQL as sink

To copy data to Azure Database for PostgreSQL, the following properties are supported in the copy activity **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to **AzurePostgreSQLSink**. | Yes |
| preCopyScript | Specify a SQL query for the copy activity to execute before you write data into Azure Database for PostgreSQL in each run. You can use this property to clean up the preloaded data. | No |
| writeMethod | The method used to write data into Azure Database for PostgreSQL.<br>Allowed values are: **CopyCommand** (default, which is more performant), **BulkInsert**. | No |
| writeBatchSize | The number of rows loaded into Azure Database for PostgreSQL per batch.<br>Allowed value is an integer that represents the number of rows. | No (default is 1,000,000) |
| writeBatchTimeout | Wait time for the batch insert operation to complete before it times out.<br>Allowed values are Timespan strings. An example is 00:30:00 (30 minutes). | No (default is 00:30:00) |

**Example**:

```json
"activities":[
    {
        "name": "CopyToAzureDatabaseForPostgreSQL",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Azure PostgreSQL output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "AzurePostgreSQLSink",
                "preCopyScript": "<custom SQL script>",
                "writeMethod": "CopyCommand",
                "writeBatchSize": 1000000
            }
        }
    }
]
```

## Mapping data flow properties

When transforming data in mapping data flow, you can read and write to tables from Azure Database for PostgreSQL. For more information, see the [source transformation](data-flow-source.md) and [sink transformation](data-flow-sink.md) in mapping data flows. You can choose to use an Azure Database for PostgreSQL dataset or an [inline dataset](data-flow-source.md#inline-datasets) as source and sink type.

### Source transformation

The below table lists the properties supported by Azure Database for PostgreSQL source. You can edit these properties in the **Source options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Table | If you select Table as input, data flow fetches all the data from the table specified in the dataset. | No | - |*(for inline dataset only)*<br>tableName |
| Query | If you select Query as input, specify a SQL query to fetch data from source, which overrides any table you specify in dataset. Using queries is a great way to reduce rows for testing or lookups.<br><br>**Order By** clause is not supported, but you can set a full SELECT FROM statement. You can also use user-defined table functions. **select * from udfGetData()** is a UDF in SQL that returns a table that you can use in data flow.<br>Query example: `select * from mytable where customerId > 1000 and customerId < 2000` or `select * from "MyTable"`. Note in PostgreSQL, the entity name is treated as case-insensitive if not quoted.| No | String | query |
| Batch size | Specify a batch size to chunk large data into batches. | No | Integer | batchSize |
| Isolation Level | Choose one of the following isolation levels:<br>- Read Committed<br>- Read Uncommitted (default)<br>- Repeatable Read<br>- Serializable<br>- None (ignore isolation level) | No | <small>READ_COMMITTED<br/>READ_UNCOMMITTED<br/>REPEATABLE_READ<br/>SERIALIZABLE<br/>NONE</small> |isolationLevel |

#### Azure Database for PostgreSQL source script example

When you use Azure Database for PostgreSQL as source type, the associated data flow script is:

```
source(allowSchemaDrift: true,
    validateSchema: false,
    isolationLevel: 'READ_UNCOMMITTED',
    query: 'select * from mytable',
    format: 'query') ~> AzurePostgreSQLSource
```

### Sink transformation

The below table lists the properties supported by Azure Database for PostgreSQL sink. You can edit these properties in the **Sink options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Update method | Specify what operations are allowed on your database destination. The default is to only allow inserts.<br>To update, upsert, or delete rows, an [Alter row transformation](data-flow-alter-row.md) is required to tag rows for those actions. | Yes | `true` or `false` | deletable <br/>insertable <br/>updateable <br/>upsertable |
| Key columns | For updates, upserts and deletes, key column(s) must be set to determine which row to alter.<br>The column name that you pick as the key will be used as part of the subsequent update, upsert, delete. Therefore, you must pick a column that exists in the Sink mapping. | No | Array | keys |
| Skip writing key columns | If you wish to not write the value to the key column, select "Skip writing key columns". | No | `true` or `false` | skipKeyWrites |
| Table action |Determines whether to recreate or remove all rows from the destination table prior to writing.<br>- **None**: No action will be done to the table.<br>- **Recreate**: The table will get dropped and recreated. Required if creating a new table dynamically.<br>- **Truncate**: All rows from the target table will get removed. | No | `true` or `false` | recreate<br/>truncate |
| Batch size | Specify how many rows are being written in each batch. Larger batch sizes improve compression and memory optimization, but risk out of memory exceptions when caching data. | No | Integer | batchSize |
| Pre and Post SQL scripts | Specify multi-line SQL scripts that will execute before (pre-processing) and after (post-processing) data is written to your Sink database. | No | String | preSQLs<br>postSQLs |

#### Azure Database for PostgreSQL sink script example

When you use Azure Database for PostgreSQL as sink type, the associated data flow script is:

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
    skipDuplicateMapOutputs: true) ~> AzurePostgreSQLSink
```

## Lookup activity properties

For more information about the properties, see [Lookup activity](control-flow-lookup-activity.md).

## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
