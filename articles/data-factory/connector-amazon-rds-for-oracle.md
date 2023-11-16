---
title: Copy data from Amazon RDS for Oracle
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from Amazon RDS for Oracle to supported sink stores, using Data Factory or Azure Synapse Analytics pipelines.
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 07/13/2023
ms.author: jianleishen
---

# Copy data from Amazon RDS for Oracle by using Azure Data Factory or Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the copy activity in Azure Data Factory to copy data from an Amazon RDS for Oracle database. It builds on the [copy activity overview](copy-activity-overview.md).

## Supported capabilities

This Amazon RDS for Oracle connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

 For a list of data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Amazon RDS for Oracle connector supports:

- The following versions of an Amazon RDS for Oracle database:
    - Amazon RDS for Oracle 19c R1 (19.1) and higher
    - Amazon RDS for Oracle 18c R1 (18.1) and higher
    - Amazon RDS for Oracle 12c R1 (12.1) and higher
    - Amazon RDS for Oracle 11g R1 (11.1) and higher
- Parallel copying from an Amazon RDS for Oracle source. See the [Parallel copy from Amazon RDS for Oracle](#parallel-copy-from-amazon-rds-for-oracle) section for details.

> [!Note]
> Amazon RDS for Oracle proxy server isn't supported.

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)] 

The integration runtime provides a built-in Amazon RDS for Oracle driver. Therefore, you don't need to manually install a driver when you copy data from Amazon RDS for Oracle.

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Amazon RDS for Oracle using UI

Use the following steps to create a linked service to Amazon RDS for Oracle in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

1. Search for Amazon RDS for Oracle and select the Amazon RDS for Oracle connector.

    :::image type="content" source="media/connector-amazon-rds-for-oracle/amazon-rds-for-oracle-connector.png" alt-text="Screenshot of the Amazon RDS for Oracle connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-amazon-rds-for-oracle/configure-amazon-rds-for-oracle-linked-service.png" alt-text="Screenshot of linked service configuration for Amazon RDS for Oracle.":::

## Connector configuration details

The following sections provide details about properties that are used to define entities specific to the Amazon RDS for Oracle connector.

## Linked service properties

The Amazon RDS for Oracle linked service supports the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **AmazonRdsForOracle**. | Yes |
| connectionString | Specifies the information needed to connect to the Amazon RDS for Oracle Database instance. <br/>You can also put a password in Azure Key Vault, and pull the `password` configuration out of the connection string. Refer to the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) with more details. <br><br>**Supported connection type**: You can use **Amazon RDS for Oracle SID** or **Amazon RDS for Oracle Service Name** to identify your database:<br>- If you use SID: `Host=<host>;Port=<port>;Sid=<sid>;User Id=<username>;Password=<password>;`<br>- If you use Service Name: `Host=<host>;Port=<port>;ServiceName=<servicename>;User Id=<username>;Password=<password>;`<br>For advanced Amazon RDS for Oracle native connection options, you can choose to add an entry in [TNSNAMES.ORA](http://www.orafaq.com/wiki/Tnsnames.ora) file on the Amazon RDS for Oracle server, and in Amazon RDS for Oracle linked service, choose to use Amazon RDS for Oracle Service Name connection type and configure the corresponding service name. | Yes |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, the default Azure Integration Runtime is used. |No |

If you have multiple Amazon RDS for Oracle instances for failover scenario, you can create Amazon RDS for Oracle linked service and fill in the primary host, port, user name, password, etc., and add a new "**Additional connection properties**" with property name as `AlternateServers` and value as `(HostName=<secondary host>:PortNumber=<secondary port>:ServiceName=<secondary service name>)` - do not miss the brackets and pay attention to the colons (`:`) as separator. As an example, the following value of alternate servers defines two alternate database servers for connection failover:
`(HostName=AccountingAmazonRdsForOracleServer:PortNumber=1521:SID=Accounting,HostName=255.201.11.24:PortNumber=1522:ServiceName=ABackup.NA.MyCompany)`.

More connection properties you can set in connection string per your case:

| Property | Description | Allowed values |
|:--- |:--- |:--- |
| ArraySize |The number of bytes the connector can fetch in a single network round trip. For example, `ArraySize=‭10485760‬`.<br/><br/>Larger values increase throughput by reducing the number of times to fetch data across the network. Smaller values increase response time, as there is less of a delay waiting for the server to transmit data. | An integer from 1 to 4294967296 (4 GB). Default value is `60000`. The value 1 does not define the number of bytes, but indicates allocating space for exactly one row of data. |

To enable encryption on Amazon RDS for Oracle connection, you have two options:

-	To use **Triple-DES Encryption (3DES) and Advanced Encryption Standard (AES)**, on the Amazon RDS for Oracle server side, go to Oracle Advanced Security (OAS) and configure the encryption settings. For details, see this [Oracle documentation](https://docs.oracle.com/cd/E11882_01/network.112/e40393/asointro.htm#i1008759). The Amazon RDS for Oracle Application Development Framework (ADF) connector automatically negotiates the encryption method to use the one you configure in OAS when establishing a connection to Amazon RDS for Oracle.

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
    4.	In the service, configure the Amazon RDS for Oracle connection string with `EncryptionMethod=1` and the corresponding `TrustStore`/`TrustStorePassword`value. For example, `Host=<host>;Port=<port>;Sid=<sid>;User Id=<username>;Password=<password>;EncryptionMethod=1;TrustStore=C:\\MyTrustStoreFile;TrustStorePassword=<trust_store_password>`.

**Example:**

```json
{
    "name": "AmazonRdsForOracleLinkedService",
    "properties": {
        "type": "AmazonRdsForOracle",
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
    "name": "AmazonRdsForOracleLinkedService",
    "properties": {
        "type": "AmazonRdsForOracle",
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

This section provides a list of properties supported by the Amazon RDS for Oracle dataset. For a full list of sections and properties available for defining datasets, see [Datasets](concepts-datasets-linked-services.md). 

To copy data from Amazon RDS for Oracle, set the type property of the dataset to `AmazonRdsForOracleTable`. The following properties are supported.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to `AmazonRdsForOracleTable`. | Yes |
| schema | Name of the schema. | No |
| table | Name of the table/view. | No |
| tableName | Name of the table/view with schema. This property is supported for backward compatibility. For new workload, use `schema` and `table`. | No |

**Example:**

```json
{
    "name": "AmazonRdsForOracleDataset",
    "properties":
    {
        "type": "AmazonRdsForOracleTable",
        "schema": [],
        "typeProperties": {
            "schema": "<schema_name>",
            "table": "<table_name>"
        },
        "linkedServiceName": {
            "referenceName": "<Amazon RDS for Oracle linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

This section provides a list of properties supported by the Amazon RDS for Oracle source. For a full list of sections and properties available for defining activities, see [Pipelines](concepts-pipelines-activities.md). 

### Amazon RDS for Oracle as source

>[!TIP]
>To load data from Amazon RDS for Oracle efficiently by using data partitioning, learn more from [Parallel copy from Amazon RDS for Oracle](#parallel-copy-from-amazon-rds-for-oracle).

To copy data from Amazon RDS for Oracle, set the source type in the copy activity to `AmazonRdsForOracleSource`. The following properties are supported in the copy activity **source** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to `AmazonRdsForOracleSource`. | Yes |
| oracleReaderQuery | Use the custom SQL query to read data. An example is `"SELECT * FROM MyTable"`.<br>When you enable partitioned load, you need to hook any corresponding built-in partition parameters in your query. For examples, see the [Parallel copy from Amazon RDS for Oracle](#parallel-copy-from-amazon-rds-for-oracle) section. | No |
| partitionOptions | Specifies the data partitioning options used to load data from Amazon RDS for Oracle. <br>Allowed values are: **None** (default), **PhysicalPartitionsOfTable**, and **DynamicRange**.<br>When a partition option is enabled (that is, not `None`), the degree of parallelism to concurrently load data from an Amazon RDS for Oracle database is controlled by the [`parallelCopies`](copy-activity-performance-features.md#parallel-copy) setting on the copy activity. | No |
| partitionSettings | Specify the group of the settings for data partitioning. <br>Apply when the partition option isn't `None`. | No |
| partitionNames | The list of physical partitions that needs to be copied. <br>Apply when the partition option is `PhysicalPartitionsOfTable`. If you use a query to retrieve the source data, hook `?AdfTabularPartitionName` in the WHERE clause. For an example, see the [Parallel copy from Amazon RDS for Oracle](#parallel-copy-from-amazon-rds-for-oracle) section. | No |
| partitionColumnName | Specify the name of the source column **in integer type** that will be used by range partitioning for parallel copy. If not specified, the primary key of the table is auto-detected and used as the partition column. <br>Apply when the partition option is `DynamicRange`. If you use a query to retrieve the source data, hook  `?AdfRangePartitionColumnName` in the WHERE clause. For an example, see the [Parallel copy from Amazon RDS for Oracle](#parallel-copy-from-amazon-rds-for-oracle) section. | No |
| partitionUpperBound | The maximum value of the partition column to copy data out. <br>Apply when the partition option is `DynamicRange`. If you use a query to retrieve the source data, hook `?AdfRangePartitionUpbound` in the WHERE clause. For an example, see the [Parallel copy from Amazon RDS for Oracle](#parallel-copy-from-amazon-rds-for-oracle) section. | No |
| partitionLowerBound | The minimum value of the partition column to copy data out. <br>Apply when the partition option is `DynamicRange`. If you use a query to retrieve the source data, hook `?AdfRangePartitionLowbound` in the WHERE clause. For an example, see the [Parallel copy from Amazon RDS for Oracle](#parallel-copy-from-amazon-rds-for-oracle) section. | No |

**Example: copy data by using a basic query without partition**

```json
"activities":[
    {
        "name": "CopyFromAmazonRdsForOracle",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Amazon RDS for Oracle input dataset name>",
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
                "type": "AmazonRdsForOracleSource",
                "oracleReaderQuery": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Parallel copy from Amazon RDS for Oracle

The Amazon RDS for Oracle connector provides built-in data partitioning to copy data from Amazon RDS for Oracle in parallel. You can find data partitioning options on the **Source** tab of the copy activity.

:::image type="content" source="./media/connector-amazon-rds-for-oracle/connector-amazon-rds-for-oracle-partition-options.png" alt-text="Screenshot of partition options.":::

When you enable partitioned copy, the service runs parallel queries against your Amazon RDS for Oracle source to load data by partitions. The parallel degree is controlled by the [`parallelCopies`](copy-activity-performance-features.md#parallel-copy) setting on the copy activity. For example, if you set `parallelCopies` to four, the service concurrently generates and runs four queries based on your specified partition option and settings, and each query retrieves a portion of data from your Amazon RDS for Oracle database.

You are suggested to enable parallel copy with data partitioning especially when you load large amount of data from your Amazon RDS for Oracle database. The following are suggested configurations for different scenarios. When copying data into file-based data store, it's recommanded to write to a folder as multiple files (only specify folder name), in which case the performance is better than writing to a single file.

| Scenario                                                     | Suggested settings                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Full load from large table, with physical partitions.          | **Partition option**: Physical partitions of table. <br><br/>During execution, the service automatically detects the physical partitions, and copies data by partitions. |
| Full load from large table, without physical partitions, while with an integer column for data partitioning. | **Partition options**: Dynamic range partition.<br>**Partition column**: Specify the column used to partition data. If not specified, the primary key column is used. |
| Load a large amount of data by using a custom query, with physical partitions. | **Partition option**: Physical partitions of table.<br>**Query**: `SELECT * FROM <TABLENAME> PARTITION("?AdfTabularPartitionName") WHERE <your_additional_where_clause>`.<br>**Partition name**: Specify the partition name(s) to copy data from. If not specified, the service automatically detects the physical partitions on the table you specified in the Amazon RDS for Oracle dataset.<br><br>During execution, the service replaces `?AdfTabularPartitionName` with the actual partition name, and sends to Amazon RDS for Oracle. |
| Load a large amount of data by using a custom query, without physical partitions, while with an integer column for data partitioning. | **Partition options**: Dynamic range partition.<br>**Query**: `SELECT * FROM <TABLENAME> WHERE ?AdfRangePartitionColumnName <= ?AdfRangePartitionUpbound AND ?AdfRangePartitionColumnName >= ?AdfRangePartitionLowbound AND <your_additional_where_clause>`.<br>**Partition column**: Specify the column used to partition data. You can partition against the column with integer data type.<br>**Partition upper bound** and **partition lower bound**: Specify if you want to filter against partition column to retrieve data only between the lower and upper range.<br><br>During execution, the service replaces `?AdfRangePartitionColumnName`, `?AdfRangePartitionUpbound`, and `?AdfRangePartitionLowbound` with the actual column name and value ranges for each partition, and sends to Amazon RDS for Oracle. <br>For example, if your partition column "ID" is set with the lower bound as 1 and the upper bound as 80, with parallel copy set as 4, the service retrieves data by 4 partitions. Their IDs are between [1, 20], [21, 40], [41, 60], and [61, 80], respectively. |

> [!TIP]
> When copying data from a non-partitioned table, you can use "Dynamic range" partition option to partition against an integer column. If your source data doesn't have such type of column, you can leverage [ORA_HASH]( https://docs.oracle.com/database/121/SQLRF/functions136.htm) function in source query to generate a column and use it as partition column.

**Example: query with physical partition**

```json
"source": {
    "type": "AmazonRdsForOracleSource",
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
    "type": "AmazonRdsForOracleSource",
    "query": "SELECT * FROM <TABLENAME> WHERE ?AdfRangePartitionColumnName <= ?AdfRangePartitionUpbound AND ?AdfRangePartitionColumnName >= ?AdfRangePartitionLowbound AND <your_additional_where_clause>",
    "partitionOption": "DynamicRange",
    "partitionSettings": {
        "partitionColumnName": "<partition_column_name>",
        "partitionUpperBound": "<upper_value_of_partition_column>",
        "partitionLowerBound": "<lower_value_of_partition_column>"
    }
}
```

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
