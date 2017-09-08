---
title: Copy data to/from Oracle using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from supported source stores to Oracle database (or) from Oracle to supported sink stores by using Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/30/2017
ms.author: jingwang

---
# Copy data from and to Oracle using Azure Data Factory

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from and to an Oracle database. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported scenarios

You can copy data from Oracle database to any supported sink data store, or copy data from any supported source data store to Oracle database. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Oracle connector supports the following versions of Oracle database:

    - Oracle 12c R1 (12.1)
    - Oracle 11g R1, R2 (11.1, 11.2)
    - Oracle 10g R1, R2 (10.1, 10.2)
    - Oracle 9i R1, R2 (9.0.1, 9.2)
    - Oracle 8i R3 (8.1.7)

## Prerequisites

To copy data from/to an Oracle database that is not publicly accessible, you need to set up a self-hosted Integration Runtime. See [Self-hosted Integration Runtime](create-self-hosted-integration-runtime.md) article for details about integration runtime. The Integration Runtime provides a built-in Oracle driver, therefore you don't need to manually install any driver when copying data from/to Oracle.

## Getting started
You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity.

The following sections provide details about properties that are used to define Data Factory entities specific to Oracle connector.

## Linked service properties

The following properties are supported for Oracle linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Oracle** | Yes |
| connectionString | Specify information needed to connect to the Oracle Database instance. The sample uses a Microsoft built-in Oracle driver. | Yes |

**Example:**

```json
{
    "name": "OracleLinkedService",
    "properties": {
        "type": "Oracle",
        "typeProperties": {
            "connectionString": {
                "type": "SecureString",
                "value": "Host=<host>;Port=<port>;Sid=<sid>;User Id=<username>;Password=<password>;"
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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Oracle dataset.

To copy data from/to Oracle, set the type property of the dataset to **OracleTable**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **OracleTable** | Yes |
| tableName |Name of the table in the Oracle Database that the linked service refers to. | Yes |

**Example:**

```json
{
    "name": "OracleDataset",
    "properties":
    {
        "type": "OracleTable",
        "linkedServiceName": {
            "referenceName": "<Oracle linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "tableName": "MyTable"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Oracle source and sink.

### Oracle as source

To copy data from Oracle, set the source type in the copy activity to **OracleSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **OracleSource** | Yes |
| oracleReaderQuery | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | No |

If you do not specify "oracleReaderQuery", the columns defined in the "structure" section of the dataset are used to construct a query (`select column1, column2 from mytable`) to run against the Oracle database. If the dataset definition does not have the "structure", all columns are selected from the table.

**Example:**

```json
"activities":[
    {
        "name": "CopyFromOracle",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Oracle input dataset name>",
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
                "type": "OracleSource",
                "oracleReaderQuery": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

### Oracle as sink

To copy data to Oracle, set the sink type in the copy activity to **OracleSink**. The following properties are supported in the copy activity **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **OracleSink** | Yes |
| writeBatchSize | Inserts data into the SQL table when the buffer size reaches writeBatchSize.<br/>Allowed values are: Integer (number of rows). |No (default is 10000) |
| writeBatchTimeout | Wait time for the batch insert operation to complete before it times out.<br/>Allowed values are: Timespan. Example: 00:30:00 (30 minutes). | No |
| preCopyScript | Specify a SQL query for Copy Activity to execute before writing data into Oracle in each run. You can use this property to clean up the pre-loaded data. | No |

**Example:**

```json
"activities":[
    {
        "name": "CopyToOracle",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Oracle output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "OracleSink"
            }
        }
    }
]
```

## Data type mapping for Oracle

When copying data from/to Oracle, the following mappings are used from Oracle data types to Azure Data Factory interim data types. See [Schema and data type mappings](copy-activity-map-columns.md) to learn about how copy activity maps the source schema and data type to the sink.

| Oracle data type | Data factory interim data type |
|:--- |:--- |
| BFILE |Byte[] |
| BLOB |Byte[] |
| CHAR |String |
| CLOB |String |
| DATE |DateTime |
| FLOAT |Decimal, String (if precision > 28) |
| INTEGER |Decimal, String (if precision > 28) |
| LONG |String |
| LONG RAW |Byte[] |
| NCHAR |String |
| NCLOB |String |
| NUMBER |Decimal, String (if precision > 28) |
| NVARCHAR2 |String |
| RAW |Byte[] |
| ROWID |String |
| TIMESTAMP |DateTime |
| TIMESTAMP WITH LOCAL TIME ZONE |String |
| TIMESTAMP WITH TIME ZONE |String |
| UNSIGNED INTEGER |Number |
| VARCHAR2 |String |
| XML |String |

> [!NOTE]
> Data type INTERVAL YEAR TO MONTH and INTERVAL DAY TO SECOND are not supported.


## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).