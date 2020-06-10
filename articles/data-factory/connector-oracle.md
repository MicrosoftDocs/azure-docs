---
title: Copy data to and from Oracle by using Azure Data Factory 
description: Learn how to copy data from supported source stores to an Oracle database, or from Oracle to supported sink stores, by using Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: shwang
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services


ms.topic: conceptual
ms.date: 04/09/2020
ms.author: jingwang

---
# Copy data from and to Oracle by using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-onprem-oracle-connector.md)
> * [Current version](connector-oracle.md)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the copy activity in Azure Data Factory to copy data from and to an Oracle database. It builds on the [copy activity overview](copy-activity-overview.md).

## Supported capabilities

This Oracle connector is supported for the following activities:

- [Copy activity](copy-activity-overview.md) with [supported source/sink matrix](copy-activity-overview.md)
- [Lookup activity](control-flow-lookup-activity.md)

You can copy data from an Oracle database to any supported sink data store. You also can copy data from any supported source data store to an Oracle database. For a list of data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Oracle connector supports:

- The following versions of an Oracle database:
    - Oracle 19c R1 (19.1) and higher
    - Oracle 18c R1 (18.1) and higher
    - Oracle 12c R1 (12.1) and higher
    - Oracle 11g R1 (11.1) and higher
    - Oracle 10g R1 (10.1) and higher
    - Oracle 9i R2 (9.2) and higher
    - Oracle 8i R3 (8.1.7) and higher
    - Oracle Database Cloud Exadata Service
- Parallel copying from an Oracle source. See the [Parallel copy from Oracle](#parallel-copy-from-oracle) section for details.

> [!Note]
> Oracle proxy server isn't supported.

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](../../includes/data-factory-v2-integration-runtime-requirements.md)] 

The integration runtime provides a built-in Oracle driver. Therefore, you don't need to manually install a driver when you copy data from and to Oracle.

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to the Oracle connector.

## Linked service properties

The Oracle linked service supports the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **Oracle**. | Yes |
| connectionString | Specifies the information needed to connect to the Oracle Database instance. <br/>You can also put a password in Azure Key Vault, and pull the `password` configuration out of the connection string. Refer to the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) with more details. <br><br>**Supported connection type**: You can use **Oracle SID** or **Oracle Service Name** to identify your database:<br>- If you use SID: `Host=<host>;Port=<port>;Sid=<sid>;User Id=<username>;Password=<password>;`<br>- If you use Service Name: `Host=<host>;Port=<port>;ServiceName=<servicename>;User Id=<username>;Password=<password>;`<br>For advanced Oracle native connection options, you can choose to add an entry in [TNSNAMES.ORA](http://www.orafaq.com/wiki/Tnsnames.ora) file on the Oracle server, and in ADF Oracle linked service, choose to use Oracle Service Name connection type and configure the corresponding service name. | Yes |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, the default Azure Integration Runtime is used. |No |

>[!TIP]
>If you get an error, "ORA-01025: UPI parameter out of range", and your Oracle version is 8i, add `WireProtocolMode=1` to your connection string. Then try again.

More connection properties you can set in connection string per your case:

| Property | Description | Allowed values |
|:--- |:--- |:--- |
| ArraySize |The number of bytes the connector can fetch in a single network round trip. E.g., `ArraySize=‭10485760‬`.<br/><br/>Larger values increase throughput by reducing the number of times to fetch data across the network. Smaller values increase response time, as there is less of a delay waiting for the server to transmit data. | An integer from 1 to 4294967296 (4 GB). Default value is `60000`. The value 1 does not define the number of bytes, but indicates allocating space for exactly one row of data. |

To enable encryption on Oracle connection, you have two options:

-	To use **Triple-DES Encryption (3DES) and Advanced Encryption Standard (AES)**, on the Oracle server side, go to Oracle Advanced Security (OAS) and configure the encryption settings. For details, see this [Oracle documentation](https://docs.oracle.com/cd/E11882_01/network.112/e40393/asointro.htm#i1008759). The Oracle Application Development Framework (ADF) connector automatically negotiates the encryption method to use the one you configure in OAS when establishing a connection to Oracle.

-	To use **TLS**:

    1.	Get the TLS/SSL certificate info. Get the Distinguished Encoding Rules (DER)-encoded certificate information of your TLS/SSL cert, and save the output (----- Begin Certificate … End Certificate -----) as a text file.

        ```
        openssl x509 -inform DER -in [Full Path to the DER Certificate including the name of the DER Certificate] -text
        ```

        **Example:** Extract cert info from DERcert.cer, and then save the output to cert.txt.

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
    
    2.	Build the `keystore` or `truststore`. The following command creates the `truststore` file, with or without a password, in PKCS-12 format.

        ```
        openssl pkcs12 -in [Path to the file created in the previous step] -out [Path and name of TrustStore] -passout pass:[Keystore PWD] -nokeys -export
        ```

        **Example:** Create a PKCS12 `truststore` file, named MyTrustStoreFile, with a password.

        ```
        openssl pkcs12 -in cert.txt -out MyTrustStoreFile -passout pass:ThePWD -nokeys -export  
        ```

    3.	Place the `truststore` file on the self-hosted IR machine. For example, place the file at C:\MyTrustStoreFile.
    4.	In Azure Data Factory, configure the Oracle connection string with `EncryptionMethod=1` and the corresponding `TrustStore`/`TrustStorePassword`value. For example, `Host=<host>;Port=<port>;Sid=<sid>;User Id=<username>;Password=<password>;EncryptionMethod=1;TrustStore=C:\\MyTrustStoreFile;TrustStorePassword=<trust_store_password>`.

**Example:**

```json
{
    "name": "OracleLinkedService",
    "properties": {
        "type": "Oracle",
        "typeProperties": {
            "connectionString": "Host=<host>;Port=<port>;Sid=<sid>;User Id=<username>;Password=<password>;"
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
            "connectionString": "Host=<host>;Port=<port>;Sid=<sid>;User Id=<username>;",
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

This section provides a list of properties supported by the Oracle dataset. For a full list of sections and properties available for defining datasets, see [Datasets](concepts-datasets-linked-services.md). 

To copy data from and to Oracle, set the type property of the dataset to `OracleTable`. The following properties are supported.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to `OracleTable`. | Yes |
| schema | Name of the schema. |No for source, Yes for sink  |
| table | Name of the table/view. |No for source, Yes for sink  |
| tableName | Name of the table/view with schema. This property is supported for backward compatibility. For new workload, use `schema` and `table`. | No for source, Yes for sink |

**Example:**

```json
{
    "name": "OracleDataset",
    "properties":
    {
        "type": "OracleTable",
        "schema": [],
        "typeProperties": {
            "schema": "<schema_name>",
            "table": "<table_name>"
        },
        "linkedServiceName": {
            "referenceName": "<Oracle linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

This section provides a list of properties supported by the Oracle source and sink. For a full list of sections and properties available for defining activities, see [Pipelines](concepts-pipelines-activities.md). 

### Oracle as source

>[!TIP]
>To load data from Oracle efficiently by using data partitioning, learn more from [Parallel copy from Oracle](#parallel-copy-from-oracle).

To copy data from Oracle, set the source type in the copy activity to `OracleSource`. The following properties are supported in the copy activity **source** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to `OracleSource`. | Yes |
| oracleReaderQuery | Use the custom SQL query to read data. An example is `"SELECT * FROM MyTable"`.<br>When you enable partitioned load, you need to hook any corresponding built-in partition parameters in your query. For examples, see the [Parallel copy from Oracle](#parallel-copy-from-oracle) section. | No |
| partitionOptions | Specifies the data partitioning options used to load data from Oracle. <br>Allowed values are: **None** (default), **PhysicalPartitionsOfTable** ,and **DynamicRange**.<br>When a partition option is enabled (that is, not `None`), the degree of parallelism to concurrently load data from an Oracle database is controlled by the [`parallelCopies`](copy-activity-performance-features.md#parallel-copy) setting on the copy activity. | No |
| partitionSettings | Specify the group of the settings for data partitioning. <br>Apply when the partition option isn't `None`. | No |
| partitionNames | The list of physical partitions that needs to be copied. <br>Apply when the partition option is `PhysicalPartitionsOfTable`. If you use a query to retrieve the source data, hook `?AdfTabularPartitionName` in the WHERE clause. For an example, see the [Parallel copy from Oracle](#parallel-copy-from-oracle) section. | No |
| partitionColumnName | Specify the name of the source column **in integer type** that will be used by range partitioning for parallel copy. If not specified, the primary key of the table is auto-detected and used as the partition column. <br>Apply when the partition option is `DynamicRange`. If you use a query to retrieve the source data, hook  `?AdfRangePartitionColumnName` in the WHERE clause. For an example, see the [Parallel copy from Oracle](#parallel-copy-from-oracle) section. | No |
| partitionUpperBound | The maximum value of the partition column to copy data out. <br>Apply when the partition option is `DynamicRange`. If you use a query to retrieve the source data, hook `?AdfRangePartitionUpbound` in the WHERE clause. For an example, see the [Parallel copy from Oracle](#parallel-copy-from-oracle) section. | No |
| partitionLowerBound | The minimum value of the partition column to copy data out. <br>Apply when the partition option is `DynamicRange`. If you use a query to retrieve the source data, hook `?AdfRangePartitionLowbound` in the WHERE clause. For an example, see the [Parallel copy from Oracle](#parallel-copy-from-oracle) section. | No |

**Example: copy data by using a basic query without partition**

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

To copy data to Oracle, set the sink type in the copy activity to `OracleSink`. The following properties are supported in the copy activity **sink** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to `OracleSink`. | Yes |
| writeBatchSize | Inserts data into the SQL table when the buffer size reaches `writeBatchSize`.<br/>Allowed values are Integer (number of rows). |No (default is 10,000) |
| writeBatchTimeout | The wait time for the batch insert operation to complete before it times out.<br/>Allowed values are Timespan. An example is 00:30:00 (30 minutes). | No |
| preCopyScript | Specify a SQL query for the copy activity to run before writing data into Oracle in each run. You can use this property to clean up the preloaded data. | No |

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

The Data Factory Oracle connector provides built-in data partitioning to copy data from Oracle in parallel. You can find data partitioning options on the **Source** tab of the copy activity.

![Screenshot of partition options](./media/connector-oracle/connector-oracle-partition-options.png)

When you enable partitioned copy, Data Factory runs parallel queries against your Oracle source to load data by partitions. The parallel degree is controlled by the [`parallelCopies`](copy-activity-performance-features.md#parallel-copy) setting on the copy activity. For example, if you set `parallelCopies` to four, Data Factory concurrently generates and runs four queries based on your specified partition option and settings, and each query retrieves a portion of data from your Oracle database.

You are suggested to enable parallel copy with data partitioning especially when you load large amount of data from your Oracle database. The following are suggested configurations for different scenarios. When copying data into file-based data store, it's recommanded to write to a folder as multiple files (only specify folder name), in which case the performance is better than writing to a single file.

| Scenario                                                     | Suggested settings                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Full load from large table, with physical partitions.          | **Partition option**: Physical partitions of table. <br><br/>During execution, Data Factory automatically detects the physical partitions, and copies data by partitions. |
| Full load from large table, without physical partitions, while with an integer column for data partitioning. | **Partition options**: Dynamic range partition.<br>**Partition column**: Specify the column used to partition data. If not specified, the primary key column is used. |
| Load a large amount of data by using a custom query, with physical partitions. | **Partition option**: Physical partitions of table.<br>**Query**: `SELECT * FROM <TABLENAME> PARTITION("?AdfTabularPartitionName") WHERE <your_additional_where_clause>`.<br>**Partition name**: Specify the partition name(s) to copy data from. If not specified, Data Factory automatically detects the physical partitions on the table you specified in the Oracle dataset.<br><br>During execution, Data Factory replaces `?AdfTabularPartitionName` with the actual partition name, and sends to Oracle. |
| Load a large amount of data by using a custom query, without physical partitions, while with an integer column for data partitioning. | **Partition options**: Dynamic range partition.<br>**Query**: `SELECT * FROM <TABLENAME> WHERE ?AdfRangePartitionColumnName <= ?AdfRangePartitionUpbound AND ?AdfRangePartitionColumnName >= ?AdfRangePartitionLowbound AND <your_additional_where_clause>`.<br>**Partition column**: Specify the column used to partition data. You can partition against the column with integer data type.<br>**Partition upper bound** and **partition lower bound**: Specify if you want to filter against partition column to retrieve data only between the lower and upper range.<br><br>During execution, Data Factory replaces `?AdfRangePartitionColumnName`, `?AdfRangePartitionUpbound`, and `?AdfRangePartitionLowbound` with the actual column name and value ranges for each partition, and sends to Oracle. <br>For example, if your partition column "ID" is set with the lower bound as 1 and the upper bound as 80, with parallel copy set as 4, Data Factory retrieves data by 4 partitions. Their IDs are between [1,20], [21, 40], [41, 60], and [61, 80], respectively. |

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

When you copy data from and to Oracle, the following mappings apply. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

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

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Data Factory, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
