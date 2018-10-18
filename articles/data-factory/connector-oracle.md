---
title: Copy data to and from Oracle by using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from supported source stores to an Oracle database or from Oracle to supported sink stores by using Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/14/2018
ms.author: jingwang

---
# Copy data from and to Oracle by using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-onprem-oracle-connector.md)
> * [Current version](connector-oracle.md)

This article outlines how to use Copy Activity in Azure Data Factory to copy data from and to an Oracle database. It builds on the [Copy Activity overview](copy-activity-overview.md) article that presents a general overview of the copy activity.

## Supported capabilities

You can copy data from an Oracle database to any supported sink data store. You also can copy data from any supported source data store to an Oracle database. For a list of data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Oracle connector supports the following versions of an Oracle database. It also supports Basic or OID authentications:

- Oracle 12c R1 (12.1)
- Oracle 11g R1, R2 (11.1, 11.2)
- Oracle 10g R1, R2 (10.1, 10.2)
- Oracle 9i R1, R2 (9.0.1, 9.2)
- Oracle 8i R3 (8.1.7)

> [!Note]
> Oracle proxy server is not supported.

## Prerequisites

To copy data from and to an Oracle database that isn't publicly accessible, you need to set up a Self-hosted Integration Runtime. For more information about integration runtime, see [Self-hosted Integration Runtime](create-self-hosted-integration-runtime.md). The integration runtime provides a built-in Oracle driver. Therefore, you don't need to manually install a driver when you copy data from and to Oracle.

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to the Oracle connector.

## Linked service properties

The following properties are supported for the Oracle linked service.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **Oracle**. | Yes |
| connectionString | Specifies the information needed to connect to the Oracle Database instance. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md).<br><br>**Supported connection type**: You can use **Oracle SID** or **Oracle Service Name** to identify your database:<br>- If you use SID: `Host=<host>;Port=<port>;Sid=<sid>;User Id=<username>;Password=<password>;`<br>- If you use Service Name: `Host=<host>;Port=<port>;ServiceName=<servicename>;User Id=<username>;Password=<password>;` | Yes |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Self-hosted Integration Runtime or Azure Integration Runtime (if your data store is publicly accessible). If not specified, it uses the default Azure Integration Runtime. |No |

>[!TIP]
>If you hit error saying "ORA-01025: UPI parameter out of range" and your Oracle is of version 8i, add `WireProtocolMode=1` to your connection string and try again.

To enable encryption on Oracle connection, you have two options:

1.	On Oracle server side, go to Oracle Advanced Security (OAS) and configure the encryption settings, which supports Triple-DES Encryption (3DES) and Advanced Encryption Standard (AES), refer to details [here](https://docs.oracle.com/cd/E11882_01/network.112/e40393/asointro.htm#i1008759). ADF Oracle connector automatically negotiates the encryption method to use the one you configure in OAS when establishing connection to Oracle.

2.	On client side, you can add `EncryptionMethod=1` in the connection string. This will use SSL/TLS as the encryption method. To use this, you need to disable non-SSL encryption settings in OAS on the Oracle server side to avoid encryption conflict.

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

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the Oracle dataset.

To copy data from and to Oracle, set the type property of the dataset to **OracleTable**. The following properties are supported.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to **OracleTable**. | Yes |
| tableName |The name of the table in the Oracle database that the linked service refers to. | Yes |

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

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the Oracle source and sink.

### Oracle as a source type

To copy data from Oracle, set the source type in the copy activity to **OracleSource**. The following properties are supported in the copy activity **source** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to **OracleSource**. | Yes |
| oracleReaderQuery | Use the custom SQL query to read data. An example is `"SELECT * FROM MyTable"`. | No |

If you don't specify "oracleReaderQuery", the columns defined in the "structure" section of the dataset are used to construct a query (`select column1, column2 from mytable`) to run against the Oracle database. If the dataset definition doesn't have "structure", all columns are selected from the table.

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

### Oracle as a sink type

To copy data to Oracle, set the sink type in the copy activity to **OracleSink**. The following properties are supported in the copy activity **sink** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to **OracleSink**. | Yes |
| writeBatchSize | Inserts data into the SQL table when the buffer size reaches writeBatchSize.<br/>Allowed values are Integer (number of rows). |No (default is 10,000) |
| writeBatchTimeout | Wait time for the batch insert operation to complete before it times out.<br/>Allowed values are Timespan. An example is 00:30:00 (30 minutes). | No |
| preCopyScript | Specify a SQL query for the copy activity to execute before writing data into Oracle in each run. You can use this property to clean up the preloaded data. | No |

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

When you copy data from and to Oracle, the following mappings are used from Oracle data types to Data Factory interim data types. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| Oracle data type | Data Factory interim data type |
|:--- |:--- |
| BFILE |Byte[] |
| BLOB |Byte[]<br/>(only supported on Oracle 10g and higher) |
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
> The data types INTERVAL YEAR TO MONTH and INTERVAL DAY TO SECOND aren't supported.


## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Data Factory, see [Supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).
