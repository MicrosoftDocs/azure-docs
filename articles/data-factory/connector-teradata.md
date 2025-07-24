---
title: Copy data from Teradata Vantage
description: The Teradata Connector in Azure Data Factory and Synapse Analytics lets you copy data from a Teradata Vantage to supported sink data stores. 
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 06/06/2025
ms.author: jianleishen
---

# Copy data from Teradata Vantage using Azure Data Factory and Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the copy activity in Azure Data Factory and Synapse Analytics pipelines to copy data from Teradata Vantage. It builds on the [copy activity overview](copy-activity-overview.md).

> [!IMPORTANT]
> The Teradata connector version 2.0 provides improved native Teradata support. If you are using Teradata connector version 1.0 in your solution, please [upgrade the Teradata connector](#upgrade-the-teradata-connector) before **September 30, 2025**. Refer to this [section](#differences-between-teradata-connector-version-20-and-version-10) for details on the difference between version 2.0 and version 1.0.

## Supported capabilities

This Teradata connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Teradata connector supports:

- Teradata **version 14.10, 15.0, 15.10, 16.0, 16.10, and 16.20**.
- Copying data by using **Basic**, **Windows**, or **LDAP** authentication.
- Parallel copying from a Teradata source. See the [Parallel copy from Teradata](#parallel-copy-from-teradata) section for details.

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)]

### For version 2.0

 You need to [install .NET Data Provider](https://downloads.teradata.com/download/connectivity/net-data-provider-teradata) with version 20.00.03.00 or above on your self-hosted integration runtime if you use it.
### For version 1.0

If you use Self-hosted Integration Runtime, note it provides a built-in Teradata driver starting from version 3.18. You don't need to manually install any driver. The driver requires "Visual C++ Redistributable 2012 Update 4" on the self-hosted integration runtime machine. If you don't yet have it installed, download it from [here](https://www.microsoft.com/en-sg/download/details.aspx?id=30679).

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Teradata using UI

Use the following steps to create a linked service to Teradata in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Create a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Create a new linked service with Azure Synapse UI.":::

2. Search for Teradata and select the Teradata connector.

    :::image type="content" source="media/connector-teradata/teradata-connector.png" alt-text="Select the Teradata connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-teradata/configure-teradata-linked-service.png" alt-text="Configure a linked service to Teradata.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to the Teradata connector.

## Linked service properties

The Teradata connector now supports version 2.0. Refer to this [section](#upgrade-the-teradata-connector) to upgrade your Teradata connector version from version 1.0. For the property details, see the corresponding sections.

- [Version 2.0](#version-20)
- [Version 1.0](#version-10)

### Version 2.0

The Teradata linked service supports the following properties when apply version 2.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **Teradata**. | Yes |
| version | The version that you specify. The value is `2.0`.  | Yes |
| server | The Teradata server name.  | Yes |
| authenticationType | The authentication type to connect to Teradata. Valid values including **Basic**, **Windows**, and **LDAP**  | Yes |
| username | Specify a user name to connect to Teradata. | Yes |
| password | Specify a password for the user account you specified for the user name. You can also choose to [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, it uses the default Azure Integration Runtime. |No |

More connection properties you can set in connection string per your case:

| Property | Description | Default value |
|:--- |:--- |:--- |
| sslMode | The SSL mode for connections to the database. Valid values including `Disable`, `Allow`, `Prefer`, `Require`, `Verify-CA`, `Verify-Full`.  | `Verify-Full` |
| portNumber  |The port numbers when connecting to server through non-HTTPS/TLS connections.  | 1025|
| httpsPortNumber |The port numbers when connecting to server through HTTPS/TLS connections. |443 |
| UseDataEncryption | Specifies whether to encrypt all communication with the Teradata database. Allowed values are 0 or 1.<br><br/>- **0 (disabled)**: Encrypts authentication information only.<br/>- **1 (enabled, default)**: Encrypts all data that is passed between the driver and the database. This setting is ignored for HTTPS/TLS connections.| `1` |
| CharacterSet | The character set to use for the session. For example, `CharacterSet=UTF16`.<br><br/>This value can be a user-defined character set, or one of the following predefined character sets: <br/>- ASCII<br/>- ARABIC1256_6A0<br/>- CYRILLIC1251_2A0<br/>- HANGUL949_7R0<br/>- HEBREW1255_5A0<br/>- KANJI932_1S0<br/>- KANJISJIS_0S<br/>- LATIN1250_1A0<br/>- LATIN1252_3A0<br/>- LATIN1254_7A0<br/>- LATIN1258_8A0<br/>- SCHINESE936_6R0<br/>- TCHINESE950_8R0<br/>- THAI874_4A0<br/>- UTF8<br/>- UTF16  | `ASCII` |
| MaxRespSize |The maximum size of the response buffer for SQL requests, in bytes. For example, `MaxRespSize=10485760`.<br/><br/>Range of permissible values are from `4096` to `16775168`. The default value is `524288`.  | `524288`  |

**Example**

```json
{
    "name": "TeradataLinkedService",
    "properties": {
        "type": "Teradata",
        "version": "2.0",
        "typeProperties": {
            "server": "<server name>", 
            "username": "<user name>", 
            "password": "<password>", 
            "authenticationType": "<authentication type>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```
### Version 1.0 

The Teradata linked service supports the following properties when apply version 1.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **Teradata**. | Yes |
| connectionString | Specifies the information needed to connect to the Teradata instance. Refer to the following samples.<br/>You can also put a password in Azure Key Vault, and pull the `password` configuration out of the connection string. Refer to [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) with more details. | Yes |
| username | Specify a user name to connect to Teradata. Applies when you are using Windows authentication. | No |
| password | Specify a password for the user account you specified for the user name. You can also choose to [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). <br>Applies when you are using Windows authentication, or referencing a password in Key Vault for basic authentication. | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, it uses the default Azure Integration Runtime. |No |

More connection properties you can set in connection string per your case:

| Property | Description | Default value |
|:--- |:--- |:--- |
| TdmstPortNumber | The number of the port used to access Teradata database.<br>Do not change this value unless instructed to do so by Technical Support. | 1025 |
| UseDataEncryption | Specifies whether to encrypt all communication with the Teradata database. Allowed values are 0 or 1.<br><br/>- **0 (disabled, default)**: Encrypts authentication information only.<br/>- **1 (enabled)**: Encrypts all data that is passed between the driver and the database. | `0` |
| CharacterSet | The character set to use for the session. E.g., `CharacterSet=UTF16`.<br><br/>This value can be a user-defined character set, or one of the following pre-defined character sets: <br/>- ASCII<br/>- UTF8<br/>- UTF16<br/>- LATIN1252_0A<br/>- LATIN9_0A<br/>- LATIN1_0A<br/>- Shift-JIS (Windows, DOS compatible, KANJISJIS_0S)<br/>- EUC (Unix compatible, KANJIEC_0U)<br/>- IBM Mainframe (KANJIEBCDIC5035_0I)<br/>- KANJI932_1S0<br/>- BIG5 (TCHBIG5_1R0)<br/>- GB (SCHGB2312_1T0)<br/>- SCHINESE936_6R0<br/>- TCHINESE950_8R0<br/>- NetworkKorean (HANGULKSC5601_2R4)<br/>- HANGUL949_7R0<br/>- ARABIC1256_6A0<br/>- CYRILLIC1251_2A0<br/>- HEBREW1255_5A0<br/>- LATIN1250_1A0<br/>- LATIN1254_7A0<br/>- LATIN1258_8A0<br/>- THAI874_4A0 | `ASCII` |
| MaxRespSize |The maximum size of the response buffer for SQL requests, in kilobytes (KBs). E.g., `MaxRespSize=‭10485760‬`.<br/><br/>For Teradata Database version 16.00 or later, the maximum value is 7361536. For connections that use earlier versions, the maximum value is 1048576. | `65536` |
| MechanismName | To use the LDAP protocol to authenticate the connection, specify `MechanismName=LDAP`. | N/A |

**Example using basic authentication**

```json
{
    "name": "TeradataLinkedService",
    "properties": {
        "type": "Teradata",
        "typeProperties": {
            "connectionString": "DBCName=<server>;Uid=<username>;Pwd=<password>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example using Windows authentication**

```json
{
    "name": "TeradataLinkedService",
    "properties": {
        "type": "Teradata",
        "typeProperties": {
            "connectionString": "DBCName=<server>",
            "username": "<username>",
            "password": "<password>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example using LDAP authentication**

```json
{
    "name": "TeradataLinkedService",
    "properties": {
        "type": "Teradata",
        "typeProperties": {
            "connectionString": "DBCName=<server>;MechanismName=LDAP;Uid=<username>;Pwd=<password>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

> [!NOTE]
>
> The following payload is still supported. Going forward, however, you should use the new one.

**Previous payload:**

```json
{
    "name": "TeradataLinkedService",
    "properties": {
        "type": "Teradata",
        "typeProperties": {
            "server": "<server>",
            "authenticationType": "<Basic/Windows>",
            "username": "<username>",
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

## Dataset properties

This section provides a list of properties supported by the Teradata dataset. For a full list of sections and properties available for defining datasets, see [Datasets](concepts-datasets-linked-services.md).

To copy data from Teradata, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to `TeradataTable`. | Yes |
| database | The name of the Teradata instance. | No (if "query" in activity source is specified) |
| table | The name of the table in the Teradata instance. | No (if "query" in activity source is specified) |

**Example:**

```json
{
    "name": "TeradataDataset",
    "properties": {
        "type": "TeradataTable",
        "typeProperties": {},
        "schema": [],        
        "linkedServiceName": {
            "referenceName": "<Teradata linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

> [!NOTE]
>
> `RelationalTable` type dataset is still supported. However, we recommend that you use the new dataset.

**Previous payload:**

```json
{
    "name": "TeradataDataset",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": {
            "referenceName": "<Teradata linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {}
    }
}
```

## Copy activity properties

This section provides a list of properties supported by Teradata source. For a full list of sections and properties available for defining activities, see [Pipelines](concepts-pipelines-activities.md). 

### Teradata as source

>[!TIP]
>To load data from Teradata efficiently by using data partitioning, learn more from [Parallel copy from Teradata](#parallel-copy-from-teradata) section.

To copy data from Teradata, the following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to `TeradataSource`. | Yes |
| query | Use the custom SQL query to read data. An example is `"SELECT * FROM MyTable"`.<br>When you enable partitioned load, you need to hook any corresponding built-in partition parameters in your query. For examples, see the [Parallel copy from Teradata](#parallel-copy-from-teradata) section. | No (if table in dataset is specified) |
| partitionOptions | Specifies the data partitioning options used to load data from Teradata. <br>Allow values are: **None** (default), **Hash** and **DynamicRange**.<br>When a partition option is enabled (that is, not `None`), the degree of parallelism to concurrently load data from Teradata is controlled by the [`parallelCopies`](copy-activity-performance-features.md#parallel-copy) setting on the copy activity. | No |
| partitionSettings | Specify the group of the settings for data partitioning. <br>Apply when partition option isn't `None`. | No |
| partitionColumnName | Specify the name of the source column that will be used by range partition or Hash partition for parallel copy. If not specified, the primary index of the table is autodetected and used as the partition column. <br>Apply when the partition option is `Hash` or `DynamicRange`. If you use a query to retrieve the source data, hook `?AdfHashPartitionCondition` or  `?AdfRangePartitionColumnName` in WHERE clause. See example in [Parallel copy from Teradata](#parallel-copy-from-teradata) section. | No |
| partitionUpperBound | The maximum value of the partition column to copy data out. <br>Apply when partition option is `DynamicRange`. If you use query to retrieve source data, hook `?AdfRangePartitionUpbound` in the WHERE clause. For an example, see the [Parallel copy from Teradata](#parallel-copy-from-teradata) section. | No |
| partitionLowerBound | The minimum value of the partition column to copy data out. <br>Apply when the partition option is `DynamicRange`. If you use a query to retrieve the source data, hook `?AdfRangePartitionLowbound` in the WHERE clause. For an example, see the [Parallel copy from Teradata](#parallel-copy-from-teradata) section. | No |

> [!NOTE]
>
> `RelationalSource` type copy source is still supported, but it doesn't support the new built-in parallel load from Teradata (partition options). However, we recommend that you use the new dataset.

**Example: copy data by using a basic query without partition**

```json
"activities":[
    {
        "name": "CopyFromTeradata",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Teradata input dataset name>",
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
                "type": "TeradataSource",
                "query": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Parallel copy from Teradata

The Teradata connector provides built-in data partitioning to copy data from Teradata in parallel. You can find data partitioning options on the **Source** table of the copy activity.

:::image type="content" source="./media/connector-teradata/connector-teradata-partition-options.png" alt-text="Screenshot of partition options":::

When you enable partitioned copy, the service runs parallel queries against your Teradata source to load data by partitions. The parallel degree is controlled by the [`parallelCopies`](copy-activity-performance-features.md#parallel-copy) setting on the copy activity. For example, if you set `parallelCopies` to four, the service concurrently generates and runs four queries based on your specified partition option and settings, and each query retrieves a portion of data from your Teradata.

You are suggested to enable parallel copy with data partitioning especially when you load large amount of data from your Teradata. The following are suggested configurations for different scenarios. When copying data into file-based data store, it's recommended to write to a folder as multiple files (only specify folder name), in which case the performance is better than writing to a single file.

| Scenario                                                     | Suggested settings                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Full load from large table.                                   | **Partition option**: Hash. <br><br/>During execution, the service automatically detects the primary index column, applies a hash against it, and copies data by partitions. |
| Load large amount of data by using a custom query.                 | **Partition option**: Hash.<br>**Query**: `SELECT * FROM <TABLENAME> WHERE ?AdfHashPartitionCondition AND <your_additional_where_clause>`.<br>**Partition column**: Specify the column used for apply hash partition. If not specified, the service automatically detects the PK column of the table you specified in the Teradata dataset.<br><br>During execution, the service replaces `?AdfHashPartitionCondition` with the hash partition logic, and sends to Teradata. |
| Load large amount of data by using a custom query, having an integer column with evenly distributed value for range partitioning. | **Partition options**: Dynamic range partition.<br>**Query**: `SELECT * FROM <TABLENAME> WHERE ?AdfRangePartitionColumnName <= ?AdfRangePartitionUpbound AND ?AdfRangePartitionColumnName >= ?AdfRangePartitionLowbound AND <your_additional_where_clause>`.<br>**Partition column**: Specify the column used to partition data. You can partition against the column with integer data type.<br>**Partition upper bound** and **partition lower bound**: Specify if you want to filter against the partition column to retrieve data only between the lower and upper range.<br><br>During execution, the service replaces `?AdfRangePartitionColumnName`, `?AdfRangePartitionUpbound`, and `?AdfRangePartitionLowbound` with the actual column name and value ranges for each partition, and sends to Teradata. <br>For example, if your partition column "ID" is set with the lower bound as 1 and the upper bound as 80, with parallel copy set as 4, the service retrieves data by 4 partitions. Their IDs are between [1,20], [21, 40], [41, 60], and [61, 80], respectively. |

**Example: query with hash partition**

```json
"source": {
    "type": "TeradataSource",
    "query": "SELECT * FROM <TABLENAME> WHERE ?AdfHashPartitionCondition AND <your_additional_where_clause>",
    "partitionOption": "Hash",
    "partitionSettings": {
        "partitionColumnName": "<hash_partition_column_name>"
    }
}
```

**Example: query with dynamic range partition**

```json
"source": {
    "type": "TeradataSource",
    "query": "SELECT * FROM <TABLENAME> WHERE ?AdfRangePartitionColumnName <= ?AdfRangePartitionUpbound AND ?AdfRangePartitionColumnName >= ?AdfRangePartitionLowbound AND <your_additional_where_clause>",
    "partitionOption": "DynamicRange",
    "partitionSettings": {
        "partitionColumnName": "<dynamic_range_partition_column_name>",
        "partitionUpperBound": "<upper_value_of_partition_column>",
        "partitionLowerBound": "<lower_value_of_partition_column>"
    }
}
```

## Data type mapping for Teradata

When you copy data from Teradata, the following mappings apply from Teradata's data types to the internal data types used by the service. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| Teradata data type | Interim service data type (for version 2.0) | Interim service data type (for version 1.0) |
|:--- |:--- |:--- |
| BigInt | Int64 | Int64 | 
| Blob | Byte[] | Byte[] | 
| Byte | Byte[] | Byte[] | 
| ByteInt | Int16 | Int16 | 
| Char | String | String | 
| Clob | String | String | 
| Date | Date | DateTime | 
| Decimal |  Decimal   | Decimal | 
| Double | Double | Double | 
| Graphic | String | Not supported. Apply explicit cast in source query. | 
| Integer | Int32 | Int32 | 
| Interval Day  | TimeSpan | Not supported. Apply explicit cast in source query. | 
| Interval Day To Hour | TimeSpan | Not supported. Apply explicit cast in source query. | 
| Interval Day To Minute | TimeSpan | Not supported. Apply explicit cast in source query. | 
| Interval Day To Second | TimeSpan | Not supported. Apply explicit cast in source query. | 
| Interval Hour | TimeSpan | Not supported. Apply explicit cast in source query. | 
| Interval Hour To Minute | TimeSpan | Not supported. Apply explicit cast in source query. | 
| Interval Hour To Second | TimeSpan | Not supported. Apply explicit cast in source query. | 
| Interval Minute | TimeSpan | Not supported. Apply explicit cast in source query. | 
| Interval Minute To Second | TimeSpan | Not supported. Apply explicit cast in source query. | 
| Interval Month | String | Not supported. Apply explicit cast in source query. | 
| Interval Second | TimeSpan | Not supported. Apply explicit cast in source query. | 
| Interval Year | String | Not supported. Apply explicit cast in source query. | 
| Interval Year To Month | String | Not supported. Apply explicit cast in source query. | 
| Number | Double | Double | 
| Period (Date) | String | Not supported. Apply explicit cast in source query. | 
| Period (Time) | String | Not supported. Apply explicit cast in source query. | 
| Period (Time With Time Zone) | String | Not supported. Apply explicit cast in source query. | 
| Period (Timestamp) | String | Not supported. Apply explicit cast in source query. | 
| Period (Timestamp With Time Zone) | String | Not supported. Apply explicit cast in source query. | 
| SmallInt | Int16 | Int16 | 
| Time | Time | TimeSpan | 
| Time With Time Zone | String   | TimeSpan | 
| Timestamp | DateTime | DateTime | 
| Timestamp With Time Zone | DateTimeOffset | DateTime | 
| VarByte | Byte[] | Byte[] | 
| VarChar | String | String | 
| VarGraphic | String | Not supported. Apply explicit cast in source query. | 
| Xml | String | Not supported. Apply explicit cast in source query. | 


## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Upgrade the Teradata connector

Here are steps that help you upgrade the Teradata connector:

1. In **Edit linked service** page, select 2.0 version and configure the linked service by referring to [linked service version 2.0 properties](#version-20).

2. The data type mapping for the Teradata linked service version 2.0 is different from that for the version 1.0. To learn the latest data type mapping, see [Data type mapping for Teradata](#data-type-mapping-for-teradata).


## Differences between Teradata connector version 2.0 and version 1.0

The Teradata connector version 2.0 offers new functionalities and is compatible with most features of version 1.0. The following table shows the feature differences between version 2.0 and version 1.0.

| Version 2.0 | Version 1.0 | 
| :----------- | :------- |
| The default value of `sslMode` is `Verify-Full`. | The default value of `sslMode` is `Prefer`. |
| The default value of `UseDataEncryption` is `1`. | The default value of `UseDataEncryption` is `0`. |
| The following mappings are used from Teradata data types to interim service data type.<br><br>Date -> Date<br>Time With Time Zone -> String <br>Timestamp With Time Zone -> DateTimeOffset <br>Graphic -> String<br>Interval Day  -> TimeSpan<br>Interval Day To Hour -> TimeSpan<br>Interval Day To Minute -> TimeSpan<br>Interval Day To Second -> TimeSpan<br>Interval Hour -> TimeSpan<br>Interval Hour To Minute -> TimeSpan<br>Interval Hour To Second -> TimeSpan<br>Interval Minute -> TimeSpan<br>Interval Minute To Second -> TimeSpan<br>Interval Month -> String<br>Interval Second -> TimeSpan<br>Interval Year -> String<br>Interval Year To Month -> String<br>Number -> Double<br>Period (Date) -> String<br>Period (Time) -> String<br>Period (Time With Time Zone) -> String<br>Period (Timestamp) -> String<br>Period (Timestamp With Time Zone) -> String<br>VarGraphic -> String<br>Xml -> String | The following mappings are used from Teradata data types to interim service data type.<br><br>Date -> DateTime<br>Time With Time Zone ->  TimeSpan    <br>Timestamp With Time Zone -> DateTime <br>Other mappings supported by version 2.0 listed left are not supported by version 1.0. Please apply an explicit cast in the source query.   |  


## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
