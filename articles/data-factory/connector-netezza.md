---
title: Copy data from Netezza
description: Learn how to copy data from Netezza to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 07/01/2025
ms.author: jianleishen
---
# Copy data from Netezza by using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory or Synapse Analytics pipelines to copy data from Netezza. The article builds on [Copy Activity](copy-activity-overview.md), which presents a general overview of Copy Activity.

>[!TIP]
>For data migration scenario from Netezza to Azure, learn more from [Migrate data from on-premises Netezza server to Azure](data-migration-guidance-netezza-azure-sqldw.md).

> [!IMPORTANT]
> The Netezza connector version 2.0 (Preview) provides improved native Netezza support. If you are using the Netezza connector version 1.0 in your solution, please [upgrade your Netezza connector](#upgrade-the-netezza-connector) before **September 30, 2025**. Refer to this [section](#differences-between-netezza-version-20-and-version-10) for details on the difference between version 2.0 (Preview) and version 1.0.

## Supported capabilities

This Netezza connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; (only for version 1.0) &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; (only for version 1.0) &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that Copy Activity supports as sources and sinks, see [Supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).

This Netezza connector supports:

- Parallel copying from source. See the [Parallel copy from Netezza](#parallel-copy-from-netezza) section for details.
- Netezza Performance Server version 11.
- Windows versions in this [article](create-self-hosted-integration-runtime.md#prerequisites).

The service provides a built-in driver to enable connectivity. You don't need to manually install any driver to use this connector.

For version 2.0 (Preview), you need to install a [IBM's Netezza ODBC driver](https://knowledge.informatica.com/s/article/HOW-TO-Download-the-Netezza-ODBC-driver?language=en_US) manually and its version should be v11.02.02 or higher. For version 1.0, the service provides a built-in driver to enable connectivity. You don't need to manually install any driver to use this connector.

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)]

## Get started

You can create a pipeline that uses a copy activity by using the .NET SDK, the Python SDK, Azure PowerShell, the REST API, or an Azure Resource Manager template. See the [Copy Activity tutorial](quickstart-create-data-factory-dot-net.md)for step-by-step instructions to create a pipeline with a copy activity.

## Create a linked service to Netezza using UI

Use the following steps to create a linked service to Netezza in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Netezza and select the Netezza connector.

   :::image type="content" source="media/connector-netezza/netezza-connector.png" alt-text="Screenshot of the Netezza connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-netezza/configure-netezza-linked-service.png" alt-text="Screenshot of linked service configuration for Netezza.":::

## Connector configuration details

The following sections provide details about properties you can use to define entities that are specific to the Netezza connector.

## Linked service properties

The Netezza connector now supports version 2.0 (Preview). Refer to this [section](#upgrade-the-netezza-connector) to upgrade your Netezza connector version from version 1.0. For the property details, see the corresponding sections.

- [Version 2.0 (Preview)](#version-20)
- [Version 1.0](#version-10)

### <a name="version-20"></a> Version 2.0 (Preview)

The Netezza linked service supports the following properties when apply version 2.0 (Preview):

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property must be set to **Netezza**. | Yes |
| version | The version that you specify. The value is `2.0`. | Yes |
| server | The hostname or the IP address of the Netezza server. | Yes |
| port | The port number of the server listener. | Yes |
| database | Name of the Netezza database. | Yes |
| uid | The user id used to connect to the database. | Yes |
| pwd | The password used to connect to the database. | Yes |
| SecurityLevel | The level of security that the driver uses for the connection to the data store. <br>Example: `SecurityLevel=preferredUnSecured`. Supported values are:<br/>- **Only unsecured** (**onlyUnSecured**): The driver doesn't use SSL.<br/>- **Preferred unsecured (preferredUnSecured) (default)**: If the server provides a choice, the driver doesn't use SSL.  | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to use to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. You can only use the self-hosted integration runtime. |No |

**Example**

```json
{
    "name": "NetezzaLinkedService",
    "properties": {
        "type": "Netezza",
        "version": "2.0",
        "typeProperties": {
            "server": "<server>",
	        "port": "<port>",
            "database": "<database>",
 		    "uid": "<username>",
		    "pwd": {
                "type": "SecureString",
                "value": "<password>"
             },
		    "securityLevel": "preferredUnSecured"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Version 1.0

The following properties are supported for the Netezza linked service when apply version 1.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property must be set to **Netezza**. | Yes |
| connectionString | An ODBC connection string to connect to Netezza. <br/>You can also put password in Azure Key Vault and pull the `pwd` configuration out of the connection string. Refer to the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details. | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to use to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, the default Azure Integration Runtime is used. |No |

A typical connection string is `Server=<server>;Port=<port>;Database=<database>;UID=<user name>;PWD=<password>`. The following table describes more properties that you can set:

| Property | Description | Required |
|:--- |:--- |:--- |
| SecurityLevel | The level of security that the driver uses for the connection to the data store. <br>Example: `SecurityLevel=preferredUnSecured`. Supported values are:<br/>- **Only unsecured** (**onlyUnSecured**): The driver doesn't use SSL.<br/>- **Preferred unsecured (preferredUnSecured) (default)**: If the server provides a choice, the driver doesn't use SSL.  | No |

> [!NOTE]
> The connector doesn't support SSLv3 as it is [officially deprecated by Netezza](https://www.ibm.com/docs/en/netezza?topic=npssac-netezza-performance-server-client-encryption-security-1).

**Example**

```json
{
    "name": "NetezzaLinkedService",
    "properties": {
        "type": "Netezza",
        "typeProperties": {
            "connectionString": "Server=<server>;Port=<port>;Database=<database>;UID=<user name>;PWD=<password>"
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
    "name": "NetezzaLinkedService",
    "properties": {
        "type": "Netezza",
        "typeProperties": {
            "connectionString": "Server=<server>;Port=<port>;Database=<database>;UID=<user name>;",
            "pwd": { 
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

This section provides a list of properties that the Netezza dataset supports.

For a full list of sections and properties that are available for defining datasets, see [Datasets](concepts-datasets-linked-services.md).

To copy data from Netezza, set the **type** property of the dataset to **NetezzaTable**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **NetezzaTable** | Yes |
| schema | Name of the schema. |No (if "query" in activity source is specified)  |
| table | Name of the table. |No (if "query" in activity source is specified)  |
| tableName | Name of the table with schema. This property is supported for backward compatibility. Use `schema` and `table` for new workload. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "NetezzaDataset",
    "properties": {
        "type": "NetezzaTable",
        "linkedServiceName": {
            "referenceName": "<Netezza linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {}
    }
}
```

## Copy Activity properties

This section provides a list of properties that the Netezza source supports.

For a full list of sections and properties that are available for defining activities, see [Pipelines](concepts-pipelines-activities.md).

### Netezza as source

>[!TIP]
>To load data from Netezza efficiently by using data partitioning, learn more from [Parallel copy from Netezza](#parallel-copy-from-netezza) section.

To copy data from Netezza, set the **source** type in Copy Activity to **NetezzaSource**. The following properties are supported in the Copy Activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the Copy Activity source must be set to **NetezzaSource**. | Yes |
| query | Use the custom SQL query to read data. Example: `"SELECT * FROM MyTable"` | No (if "tableName" in dataset is specified) |
| partitionOptions | Specifies the data partitioning options used to load data from Netezza. <br>Allow values are: **None** (default), **DataSlice**, and **DynamicRange**.<br>When a partition option is enabled (that is, not `None`), the degree of parallelism to concurrently load data from a Netezza database is controlled by [`parallelCopies`](copy-activity-performance-features.md#parallel-copy) setting on the copy activity. | No |
| partitionSettings | Specify the group of the settings for data partitioning. <br>Apply when partition option isn't `None`. | No |
| partitionColumnName | Specify the name of the source column **in integer type** that will be used by range partitioning for parallel copy. If not specified, the primary key of the table is autodetected and used as the partition column. <br>Apply when the partition option is `DynamicRange`. If you use a query to retrieve the source data, hook `?AdfRangePartitionColumnName` in WHERE clause. See example in [Parallel copy from Netezza](#parallel-copy-from-netezza) section. | No |
| partitionUpperBound | The maximum value of the partition column to copy data out. <br>Apply when partition option is `DynamicRange`. If you use query to retrieve source data, hook `?AdfRangePartitionUpbound` in the WHERE clause. For an example, see the [Parallel copy from Netezza](#parallel-copy-from-netezza) section. | No |
| partitionLowerBound | The minimum value of the partition column to copy data out. <br>Apply when the partition option is `DynamicRange`. If you use a query to retrieve the source data, hook `?AdfRangePartitionLowbound` in the WHERE clause. For an example, see the [Parallel copy from Netezza](#parallel-copy-from-netezza) section. | No |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromNetezza",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Netezza input dataset name>",
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
                "type": "NetezzaSource",
                "query": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Parallel copy from Netezza

The Data Factory Netezza connector provides built-in data partitioning to copy data from Netezza in parallel. You can find data partitioning options on the **Source** table of the copy activity.

:::image type="content" source="./media/connector-netezza/connector-netezza-partition-options.png" alt-text="Screenshot of partition options":::

When you enable partitioned copy, the service runs parallel queries against your Netezza source to load data by partitions. The parallel degree is controlled by the [`parallelCopies`](copy-activity-performance-features.md#parallel-copy) setting on the copy activity. For example, if you set `parallelCopies` to four, the service concurrently generates and runs four queries based on your specified partition option and settings, and each query retrieves a portion of data from your Netezza database.

You are suggested to enable parallel copy with data partitioning especially when you load large amount of data from your Netezza database. The following are suggested configurations for different scenarios. When copying data into file-based data store, it's recommended to write to a folder as multiple files (only specify folder name), in which case the performance is better than writing to a single file.

| Scenario                                                     | Suggested settings                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Full load from large table.                                   | **Partition option**: Data Slice. <br><br/>During execution, the service automatically partitions the data based on [Netezza's built-in data slices](https://www.ibm.com/docs/en/psfa/7.1.0?topic=hardware-manage-data-slices), and copies data by partitions. |
| Load large amount of data by using a custom query.                 | **Partition option**: Data Slice.<br>**Query**: `SELECT * FROM <TABLENAME> WHERE mod(datasliceid, ?AdfPartitionCount) = ?AdfDataSliceCondition AND <your_additional_where_clause>`.<br>During execution, the service replaces `?AdfPartitionCount` (with parallel copy number set on copy activity) and `?AdfDataSliceCondition` with the data slice partition logic, and sends to Netezza. |
| Load large amount of data by using a custom query, having an integer column with evenly distributed value for range partitioning. | **Partition options**: Dynamic range partition.<br>**Query**: `SELECT * FROM <TABLENAME> WHERE ?AdfRangePartitionColumnName <= ?AdfRangePartitionUpbound AND ?AdfRangePartitionColumnName >= ?AdfRangePartitionLowbound AND <your_additional_where_clause>`.<br>**Partition column**: Specify the column used to partition data. You can partition against the column with integer data type.<br>**Partition upper bound** and **partition lower bound**: Specify if you want to filter against the partition column to retrieve data only between the lower and upper range.<br><br>During execution, the service replaces `?AdfRangePartitionColumnName`, `?AdfRangePartitionUpbound`, and `?AdfRangePartitionLowbound` with the actual column name and value ranges for each partition, and sends to Netezza. <br>For example, if your partition column "ID" set with the lower bound as 1 and the upper bound as 80, with parallel copy set as 4, the service retrieves data by 4 partitions. Their IDs are between [1,20], [21, 40], [41, 60], and [61, 80], respectively. |

**Example: query with data slice partition**

```json
"source": {
    "type": "NetezzaSource",
    "query": "SELECT * FROM <TABLENAME> WHERE mod(datasliceid, ?AdfPartitionCount) = ?AdfDataSliceCondition AND <your_additional_where_clause>",
    "partitionOption": "DataSlice"
}
```

**Example: query with dynamic range partition**

```json
"source": {
    "type": "NetezzaSource",
    "query": "SELECT * FROM <TABLENAME> WHERE ?AdfRangePartitionColumnName <= ?AdfRangePartitionUpbound AND ?AdfRangePartitionColumnName >= ?AdfRangePartitionLowbound AND <your_additional_where_clause>",
    "partitionOption": "DynamicRange",
    "partitionSettings": {
        "partitionColumnName": "<dynamic_range_partition_column_name>",
        "partitionUpperBound": "<upper_value_of_partition_column>",
        "partitionLowerBound": "<lower_value_of_partition_column>"
    }
}
```

## Data type mapping for Netezza

When you copy data from Netezza, the following mappings apply from Netezza's data types to the internal data types used by the service. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| Netezza data type | Interim service data type (for version 2.0 (Preview)) | Interim service data type (for version 1.0) |
|:--- |:--- |:--- |
| BOOLEAN | Boolean | Boolean |
| CHAR | String | String |
| VARCHAR | String | String |
| NCHAR | String | String |
| NVARCHAR | String | String |
| DATE | Date | DateTime |
| TIMESTAMP | DateTime | DateTime |
| TIME | Time | TimeSpan |
| INTERVAL | Not Supported | TimeSpan |
| TIME WITH TIME ZONE | String | String |
| NUMERIC(p,s) | Decimal | Decimal |
| REAL | Single | Single |
| DOUBLE PRECISION | Double | Double |
| INTEGER | Int32 | Int32 |
| BYTEINT | Int16 | SByte |
| SMALLINT | Int16 | Int16 |
| BIGINT | Int64 | Int64 |

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## <a name="differences-between-netezza-version-20-and-version-10"></a> Netezza connector lifecycle and upgrade

The following table shows the release stage and change logs for different versions of the Netezza connector:

| Version  | Release stage | Change log |  
| :----------- | :------- |:------- |
| Version 1.0 | End of support announced | / |  
| Version 2.0 (Preview) | GA version available | • DATE is read as Date data type. <br><br>• TIME is read as Time data type. <br><br>• INTERVAL is not supported. <br><br>• BYTEINT is read as Int16 data type. <br><br>• Only support the self-hosted integration runtime.|

### <a name="upgrade-the-netezza-connector"></a> Upgrade the Netezza connector from version 1.0 to version 2.0 (Preview)

1. In **Edit linked service** page, select 2.0 (Preview) for version. For more information, see [linked service version 2.0 (Preview) properties](#version-20).
1. The data type mapping for the Netezza linked service version 2.0 (Preview) is different from that for the version 1.0. To learn the latest data type mapping, see [Data type mapping for Netezza](#data-type-mapping-for-netezza).
1. Only support the self-hosted integration runtime. Azure integration runtime is not supported by version 2.0 (Preview).

## Related content

For a list of data stores that Copy Activity supports as sources and sinks, see [Supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).
