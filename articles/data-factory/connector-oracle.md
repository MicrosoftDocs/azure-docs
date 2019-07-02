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

ms.topic: conceptual
ms.date: 06/25/2019
ms.author: jingwang

---
# Copy data from and to Oracle by using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-onprem-oracle-connector.md)
> * [Current version](connector-oracle.md)

This article outlines how to use Copy Activity in Azure Data Factory to copy data from and to an Oracle database. It builds on the [Copy Activity overview](copy-activity-overview.md) article that presents a general overview of the copy activity.

## Supported capabilities

You can copy data from an Oracle database to any supported sink data store. You also can copy data from any supported source data store to an Oracle database. For a list of data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Oracle connector supports:

- The following versions of an Oracle database:
  - Oracle 12c R1 (12.1)
  - Oracle 11g R1, R2 (11.1, 11.2)
  - Oracle 10g R1, R2 (10.1, 10.2)
  - Oracle 9i R1, R2 (9.0.1, 9.2)
  - Oracle 8i R3 (8.1.7)
- Copying data using **Basic** or **OID** authentications.
- Parallel copy from Oracle source. See [Parallel copy from Oracle](#parallel-copy-from-oracle) section with details.

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
| connectionString | Specifies the information needed to connect to the Oracle Database instance. <br/>Mark this field as a SecureString to store it securely in Data Factory. You can also put password in Azure Key Vault and pull the `password` configuration out of the connection string. Refer to the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details. <br><br>**Supported connection type**: You can use **Oracle SID** or **Oracle Service Name** to identify your database:<br>- If you use SID: `Host=<host>;Port=<port>;Sid=<sid>;User Id=<username>;Password=<password>;`<br>- If you use Service Name: `Host=<host>;Port=<port>;ServiceName=<servicename>;User Id=<username>;Password=<password>;` | Yes |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Self-hosted Integration Runtime or Azure Integration Runtime (if your data store is publicly accessible). If not specified, it uses the default Azure Integration Runtime. |No |

>[!TIP]
>If you hit error saying "ORA-01025: UPI parameter out of range" and your Oracle is of version 8i, add `WireProtocolMode=1` to your connection string and try again.

**To enable encryption on Oracle connection**, you have two options:

1.	To use **Triple-DES Encryption (3DES) and Advanced Encryption Standard (AES)**, on Oracle server side, go to Oracle Advanced Security (OAS) and configure the encryption settings, refer to details [here](https://docs.oracle.com/cd/E11882_01/network.112/e40393/asointro.htm#i1008759). ADF Oracle connector automatically negotiates the encryption method to use the one you configure in OAS when establishing connection to Oracle.

2.	To use **SSL**, follow below steps:

    1.	Get SSL certificate info. Get the DER encoded certificate information of your SSL cert, and save the output (----- Begin Certificate … End Certificate -----) as a text file.

        ```
        openssl x509 -inform DER -in [Full Path to the DER Certificate including the name of the DER Certificate] -text
        ```

        **Example:** extract cert info from DERcert.cer; then, save the output to cert.txt

        ```
        openssl x509 -inform DER -in DERcert.cer -text
        Output:
        -----BEGIN CERTIFICATE-----
        XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        XXXXXXXXX
        -----END CERTIFICATE-----
        ```
    
    2.	Build the keystore or truststore. The following command creates the truststore file with or without a password in PKCS-12 format.

        ```
        openssl pkcs12 -in [Path to the file created in the previous step] -out [Path and name of TrustStore] -passout pass:[Keystore PWD] -nokeys -export
        ```

        **Example:** creates a PKCS12 truststore file named MyTrustStoreFile with a password

        ```
        openssl pkcs12 -in cert.txt -out MyTrustStoreFile -passout pass:ThePWD -nokeys -export  
        ```

    3.	Place the truststore file on the Self-hosted IR machine, e.g. at C:\MyTrustStoreFile.
    4.	In ADF, configure the Oracle connection string with `EncryptionMethod=1` and corresponding `TrustStore`/`TrustStorePassword`value, e.g. `Host=<host>;Port=<port>;Sid=<sid>;User Id=<username>;Password=<password>;EncryptionMethod=1;TrustStore=C:\\MyTrustStoreFile;TrustStorePassword=<trust_store_password>`.

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

**Example: store password in Azure Key Vault**

```json
{
    "name": "OracleLinkedService",
    "properties": {
        "type": "Oracle",
        "typeProperties": {
            "connectionString": {
                "type": "SecureString",
                "value": "Host=<host>;Port=<port>;Sid=<sid>;User Id=<username>;"
            },
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

> [!TIP]
>
> Learn more from [Parallel copy from Oracle](#parallel-copy-from-oracle) section on how to load data from Oracle efficiently using data partitioning.

To copy data from Oracle, set the source type in the copy activity to **OracleSource**. The following properties are supported in the copy activity **source** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to **OracleSource**. | Yes |
| oracleReaderQuery | Use the custom SQL query to read data. An example is `"SELECT * FROM MyTable"`.<br>When you enable partitioned load, you need to hook corresponding built-in partition parameter(s) in your query. See examples in [Parallel copy from Oracle](#parallel-copy-from-oracle) section. | No |
| partitionOptions | Specifies the data partitioning options used to load data from Oracle. <br>Allow values are: **None** (default), **PhysicalPartitionsOfTable** and **DynamicRange**.<br>When partition option is enabled (not 'None'), please also configure **[`parallelCopies`](copy-activity-performance.md#parallel-copy)** setting on copy activity e.g. as 4, which determines the parallel degree to concurrently load data from Oracle database. | No |
| partitionSettings | Specify the group of the settings for data partitioning. <br>Apply when partition option is not `None`. | No |
| partitionNames | The list of physical partitions that needs to be copied. <br>Apply when partition option is `PhysicalPartitionsOfTable`. If you use query to retrieve source data, hook `?AdfTabularPartitionName` in WHERE clause. See example in [Parallel copy from Oracle](#parallel-copy-from-oracle) section. | No |
| partitionColumnName | Specify the name of the source column **in integer type** that will be used by range partitioning for parallel copy. If not specified, the primary key of the table will be auto detected and used as partition column. <br>Apply when partition option is `DynamicRange`. If you use query to retrieve source data, hook  `?AdfRangePartitionColumnName` in WHERE clause. See example in [Parallel copy from Oracle](#parallel-copy-from-oracle) section. | No |
| partitionUpperBound | Maximum value of the partition column to copy data out. <br>Apply when partition option is `DynamicRange`. If you use query to retrieve source data, hook `?AdfRangePartitionUpbound` in WHERE clause. See example in [Parallel copy from Oracle](#parallel-copy-from-oracle) section. | No |
| PartitionLowerBound | Minimum value of the partition column to copy data out. <br>Apply when partition option is `DynamicRange`. If you use query to retrieve source data, hook `?AdfRangePartitionLowbound` in WHERE clause. See example in [Parallel copy from Oracle](#parallel-copy-from-oracle) section. | No |

**Example: copy data using basic query without partition**

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

See more examples in [Parallel copy from Oracle](#parallel-copy-from-oracle) section.

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

## Parallel copy from Oracle

Data factory Oracle connector provides built-in data partitioning to copy data from Oracle in parallel with great performance. You can find data partitioning options on copy activity -> Oracle source:

![Partition options](./media/connector-oracle/connector-oracle-partition-options.png)

When you enable partitioned copy, data factory runs parallel queries against your Oracle source to load data by partitions. The parallel degree is configured and controlled via **[`parallelCopies`](copy-activity-performance.md#parallel-copy)** setting on copy activity. For example, if you set `parallelCopies` as four, data factory concurrently generates and runs four queries based on your specified partition option and settings, each retrieving portion of data from your Oracle database.

You are suggested to enable parallel copy with data partitioning especially when you load large amount of data from Oracle database. The following are the suggested configurations for different scenarios:

| Scenario                                                     | Suggested settings                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Full load from large table with physical partitions          | **Partition option**: Physical partitions of table. <br><br/>During execution, data Factory automatically detect the physical partitions and copy data by partitions. |
| Full load from large table without physical partitions while with an integer column for data partitioning | **Partition options**: Dynamic range partition.<br>**Partition column**: Specify the column used to partition data. If not specified, primary key column is used. |
| Load large amount of data using custom query, underneath with physical partitions | **Partition option**: Physical partitions of table.<br>**Query**: `SELECT * FROM <TABLENAME> PARTITION("?AdfTabularPartitionName") WHERE <your_additional_where_clause>`.<br>**Partition name**: Specify the partition name(s) to copy data from. If not specified, ADF will automatically detect the physical partitions on the table you specified in Oracle dataset.<br><br>During execution, data factory replace `?AdfTabularPartitionName` with the actual partition name and send to Oracle. |
| Load large amount of data using custom query, underneath without physical partitions while with an integer column for data partitioning | **Partition options**: Dynamic range partition.<br>**Query**: `SELECT * FROM <TABLENAME> WHERE ?AdfRangePartitionColumnName <= ?AdfRangePartitionUpbound AND ?AdfRangePartitionColumnName >= ?AdfRangePartitionLowbound AND <your_additional_where_clause>`.<br>**Partition column**: Specify the column used to partition data. You can partition against column with integer data type.<br>**Partition upper bound** and **partition lower bound**: Specify if you want to filter against partition column to only retrieve data between lower and upper range.<br><br>During execution, data factory replace `?AdfRangePartitionColumnName`, `?AdfRangePartitionUpbound`, and `?AdfRangePartitionLowbound` with the actual column name and value ranges for each partition, and send to Oracle. <br>For example, if your partition column "ID" set with lower bound as 1 and upper bound as 80, with parallel copy set as 4, ADF retrieve data by 4 partitions with ID between [1,20], [21, 40], [41, 60], and [61, 80]. |

**Example: query with physical partition**

```json
"source": {
    "type": "OracleSource",
    "query": "SELECT * FROM <TABLENAME> PARTITION(\"?AdfTabularPartitionName\") WHERE <your_additional_where_clause>",
    "partitionOption": "PhysicalPartitionsOfTable",
    "partitionSettings": {
        "partitionNames": [
            "<partitionA_name>",
            "<partitionB_name>"
        ]
    }
}
```

**Example: query with dynamic range partition**

```json
"source": {
    "type": "OracleSource",
    "query": "SELECT * FROM <TABLENAME> WHERE ?AdfRangePartitionColumnName <= ?AdfRangePartitionUpbound AND ?AdfRangePartitionColumnName >= ?AdfRangePartitionLowbound AND <your_additional_where_clause>",
    "partitionOption": "DynamicRange",
    "partitionSettings": {
        "partitionColumnName": "<partition_column_name>",
        "partitionUpperBound": "<upper_value_of_partition_column>",
        "partitionLowerBound": "<lower_value_of_partition_column>"
    }
}
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
