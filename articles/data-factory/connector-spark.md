---
title: Copy data from Spark
description: Learn how to copy data from Spark to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
ms.author: jianleishen
author: jianleishen
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 06/06/2025
---

# Copy data from Spark using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from Spark. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!IMPORTANT]
> The Spark connector version 2.0 provides improved native Spark support. If you are using Spark connector version 1.0 in your solution, please [upgrade the Spark connector](#upgrade-the-spark-connector) before **September 30, 2025**. Refer to this [section](#differences-between-spark-version-20-and-version-10) for details on the difference between version 2.0 and version 1.0.

## Supported capabilities

This Spark connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

The service provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)]

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Spark using UI

Use the following steps to create a linked service to Spark in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Spark and select the Spark connector.

   :::image type="content" source="media/connector-spark/spark-connector.png" alt-text="Screenshot of the Spark connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-spark/configure-spark-linked-service.png" alt-text="Screenshot of linked service configuration for Spark.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Spark connector.

## Linked service properties

The Spark connector now supports version 2.0. Refer to this [section](#upgrade-the-spark-connector) to upgrade your Spark connector version from version 1.0. For the property details, see the corresponding sections.

- [Version 2.0](#version-20)
- [Version 1.0](#version-10)

### Version 2.0

The following properties are supported for Spark linked service version 2.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Spark** | Yes |
| version | The version that you specify. The value is `2.0`.  | Yes |
| host | IP address or host name of the Spark server  | Yes |
| port | The TCP port that the Spark server uses to listen for client connections. If you connect to Azure HDInsight, specify port as 443. | Yes |
| serverType | The type of Spark server. <br/>The allowed value is: **SparkThriftServer** | No |
| thriftTransportProtocol | The transport protocol to use in the Thrift layer. <br/>The allowed value is: **HTTP** | No |
| authenticationType | The authentication method used to access the Spark server. <br/>Allowed values are: **Anonymous**, **UsernameAndPassword**, **WindowsAzureHDInsightService** | Yes |
| username | The user name that you use to access Spark Server.  | No |
| password | The password corresponding to the user. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| httpPath | The partial URL corresponding to the Spark server.  | No |
| enableSsl | Specifies whether the connections to the server are encrypted using TLS. The default value is true.  | No |
| enableServerCertificateValidation | Specify whether to enable server SSL certificate validation when you connect. <br>Always use System Trust Store. The default value is true. | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, it uses the default Azure Integration Runtime. |No |

**Example:**

```json
{
    "name": "SparkLinkedService",
    "properties": {
        "type": "Spark",
        "version": "2.0",
        "typeProperties": {
            "host": "<cluster>.azurehdinsight.net",
            "port": "<port>",
            "authenticationType": "WindowsAzureHDInsightService",
            "username": "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            }
        }
    }
}
```

### Version 1.0

The following properties are supported for Spark linked service version 1.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Spark** | Yes |
| host | IP address or host name of the Spark server  | Yes |
| port | The TCP port that the Spark server uses to listen for client connections. If you connect to Azure HDInsight, specify port as 443. | Yes |
| serverType | The type of Spark server. <br/>Allowed values are: **SharkServer**, **SharkServer2**, **SparkThriftServer** | No |
| thriftTransportProtocol | The transport protocol to use in the Thrift layer. <br/>Allowed values are: **Binary**, **SASL**, **HTTP** | No |
| authenticationType | The authentication method used to access the Spark server. <br/>Allowed values are: **Anonymous**, **Username**, **UsernameAndPassword**, **WindowsAzureHDInsightService** | Yes |
| username | The user name that you use to access Spark Server.| No |
| password | The password corresponding to the user. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md).| No |
| httpPath | The partial URL corresponding to the Spark server.| No |
| enableSsl | Specifies whether the connections to the server are encrypted using TLS. The default value is false.  | No |
| trustedCertPath | The full path of the .pem file containing trusted CA certificates for verifying the server when connecting over TLS. This property can only be set when using TLS on self-hosted IR. The default value is the cacerts.pem file installed with the IR.  | No |
| useSystemTrustStore | Specifies whether to use a CA certificate from the system trust store or from a specified PEM file. The default value is false.  | No |
| allowHostNameCNMismatch | Specifies whether to require a CA-issued TLS/SSL certificate name to match the host name of the server when connecting over TLS. The default value is false.  | No |
| allowSelfSignedServerCert | Specifies whether to allow self-signed certificates from the server. The default value is false.  | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, it uses the default Azure Integration Runtime. |No |

**Example:**

```json
{
    "name": "SparkLinkedService",
    "properties": {
        "type": "Spark",
        "typeProperties": {
            "host": "<cluster>.azurehdinsight.net",
            "port": "<port>",
            "authenticationType": "WindowsAzureHDInsightService",
            "username": "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Spark dataset.

To copy data from Spark, set the type property of the dataset to **SparkObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **SparkObject** | Yes |
| schema | Name of the schema. |No (if "query" in activity source is specified)  |
| table | Name of the table. |No (if "query" in activity source is specified)  |
| tableName | Name of the table with schema. This property is supported for backward compatibility. Use `schema` and `table` for new workload. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "SparkDataset",
    "properties": {
        "type": "SparkObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Spark linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Spark source.

### Spark as source

To copy data from Spark, set the source type in the copy activity to **SparkSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **SparkSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromSpark",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Spark input dataset name>",
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
                "type": "SparkSource",
                "query": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Data type mapping for Spark

When you copy data from and to Spark, the following interim data type mappings are used within the service. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| Spark data type | Interim service data type (for version 2.0) | Interim service data type (for version 1.0) | 
|:--- |:--- |:--- |
| BooleanType  | Boolean  | Boolean  | 
| ByteType  | Sbyte  | Int16  | 
| ShortType  | Int16  | Int16  | 
| IntegerType  | Int32  | Int32  | 
| LongType  | Int64  | Int64  | 
| FloatType  | Single  | Single  | 
| DoubleType  | Double  | Double  | 
| DateType  | DateTime  | DateTime  | 
| TimestampType  | DateTimeOffset  | DateTime  | 
| StringType  | String  | String  | 
| BinaryType  | Byte[]  | Byte[]  | 
| DecimalType  | Decimal  | Decimal  | 
| ArrayType  | String  | String  | 
| StructType  | String  | String  | 
| MapType  | String  | String  | 
| TimestampNTZType  | DateTime  | DateTime  | 
| YearMonthIntervalType  | String  | Not supported.  | 
| DayTimeIntervalType  | String  | Not supported. | 

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Upgrade the Spark connector

1. In **Edit linked service** page, select 2.0 for version and configure the linked service by referring to [Linked service properties version 2.0](#version-20).

1. The data type mapping for the Spark linked service version 2.0 is different from that for the version 1.0. To learn the latest data type mapping, see [Data type mapping for Spark](#data-type-mapping-for-spark).

## Differences between Spark version 2.0 and version 1.0

The Spark connector version 2.0 offers new functionalities and is compatible with most features of version 1.0. The following table shows the feature differences between version 2.0 and version 1.0.

| Version 2.0 | Version 1.0  | 
|:--- |:--- |
| SharkServer and SharkServer2 are not supported for `serverType`. | Support SharkServer and SharkServer2 for `serverType`. | 
| Binary and SASL are not supported for `thriftTransportProtocl`. | Support Binary and SASL for `thriftTransportProtocl`. | 
| Username authentication type is not supported. | Support Username authentication type. |
| The default value of `enableSSL` is true. `trustedCertPath`, `useSystemTrustStore`, `allowHostNameCNMismatch` and `allowSelfSignedServerCert` are not supported. <br><br> `enableServerCertificateValidation` is supported. | The default value of `enableSSL` is false. Additionally, support `trustedCertPath`, `useSystemTrustStore`, `allowHostNameCNMismatch` and `allowSelfSignedServerCert`. <br><br>`enableServerCertificateValidation` is not supported.	 |  
| The following mappings are used from Spark data types to interim service data types used by the service internally.<br><br>TimestampType -> DateTimeOffset <br>YearMonthIntervalType -> String<br>DayTimeIntervalType -> String | The following mappings are used from Spark data types to interim service data types used by the service internally.<br><br>TimestampType -> DateTime<br>Other mappings supported by version 2.0 (Preview) listed left are not supported by version 1.0. | 

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
