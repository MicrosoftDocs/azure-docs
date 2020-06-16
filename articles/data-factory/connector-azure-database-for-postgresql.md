---
title: Copy data to and from Azure Database for PostgreSQL
description: Learn how to copy data to and from Azure Database for PostgreSQL by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
ms.author: jingwang
author: linda33wj
manager: shwang
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 09/16/2019
---

# Copy data to and from Azure Database for PostgreSQL by using Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes how to use the copy activity feature in Azure Data Factory to copy data from Azure Database for PostgreSQL. It builds on the [Copy activity in Azure Data Factory](copy-activity-overview.md) article, which presents a general overview of copy activity.

This connector is specialized for the [Azure Database for PostgreSQL service](../postgresql/overview.md). To copy data from a generic PostgreSQL database located on-premises or in the cloud, use the [PostgreSQL connector](connector-postgresql.md).

## Supported capabilities

This Azure Database for PostgreSQL connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with a [supported source/sink matrix](copy-activity-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)

You can copy data from Azure Database for PostgreSQL to any supported sink data store. Or, you can copy data from any supported source data store to Azure Database for PostgreSQL. For a list of data stores that the copy activity supports as sources and sinks, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Azure Data Factory provides a built-in driver to enable connectivity. Therefore, you don't need to manually install any driver to use this connector.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections offer details about properties that are used to define Data Factory entities specific to Azure Database for PostgreSQL connector.

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

For a full list of sections and properties available for defining datasets, see [Datasets in Azure Data Factory](concepts-datasets-linked-services.md). This section provides a list of properties that Azure Database for PostgreSQL  supports in datasets.

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

For a full list of sections and properties available for defining activities, see [Pipelines and activities in Azure Data Factory](concepts-pipelines-activities.md). This section provides a list of properties supported by an Azure Database for PostgreSQL source.

### Azure Database for PostgreSql as source

To copy data from Azure Database for PostgreSQL, set the source type in the copy activity to **AzurePostgreSqlSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to **AzurePostgreSqlSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"` | No (if the tableName property in the dataset is specified) |

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
                "query": "<custom query e.g. SELECT * FROM MyTable>"
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
| writeBatchSize | Inserts data into the Azure Database for PostgreSQL table when the buffer size reaches writeBatchSize.<br>Allowed value is an integer that represents the number of rows. | No (default is 10,000) |
| writeBatchTimeout | Wait time for the batch insert operation to complete before it times out.<br>Allowed values are Timespan strings. An example is 00:30:00 (30 minutes). | No (default is 00:00:30) |

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
                "writeBatchSize": 100000
            }
        }
    }
]
```

## Lookup activity properties

For more information about the properties, see [Lookup activity in Azure Data Factory](control-flow-lookup-activity.md).

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
