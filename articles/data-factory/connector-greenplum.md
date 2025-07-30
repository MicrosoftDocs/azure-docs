---
title: Copy data from Greenplum
description: Learn how to copy data from Greenplum to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 06/06/2025
ms.author: jianleishen
---
# Copy data from Greenplum using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from Greenplum. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!IMPORTANT]
> The Greenplum connector version 2.0 provides improved native Greenplum support. If you are using Greenplum connector version 1.0 in your solution, please [upgrade the Greenplum connector](#upgrade-the-greenplum-connector) before **August 31, 2025**. Refer to this [section](#differences-between-greenplum-version-20-and-version-10) for details on the difference between version 2.0 and version 1.0.

## Supported capabilities

This Greenplum connector is supported for the following capabilities:

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

## Create a linked service to Greenplum using UI

Use the following steps to create a linked service to Greenplum in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Greenplum and select the Greenplum connector.

   :::image type="content" source="media/connector-greenplum/greenplum-connector.png" alt-text="Screenshot of the Greenplum connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-greenplum/configure-greenplum-linked-service.png" alt-text="Screenshot of linked service configuration for Greenplum.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Greenplum connector.

## Linked service properties

The Greenplum connector now supports version 2.0. Refer to this [section](#upgrade-the-greenplum-connector) to upgrade your Greenplum connector version from version 1.0. For the property details, see the corresponding sections.

- [Version 2.0](#version-20)
- [Version 1.0](#version-10)

### Version 2.0

The Greenplum linked service supports the following properties when apply version 2.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Greenplum** | Yes |
| version | The version that you specify. The value is `2.0`. | Yes |
| host | Specifies the host name - and optionally port - on which database is running.  | Yes |
| port | The TCP port of the database server. The default value is `5432`.| No |
| database | The database to connect to. | Yes |
| username | The username to connect with. Not required if using IntegratedSecurity. |Yes |
| password| The password to connect with. Not required if using IntegratedSecurity. Mark this field as **SecureString** to store it securely. Or, you can [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| sslMode | Controls whether SSL is used, depending on server support. <br/>- **Disable**: SSL is disabled. If the server requires SSL, the connection will fail. <br/>- **Allow**: Prefer non-SSL connections if the server allows them, but allow SSL connections. <br/>- **Prefer**: Prefer SSL connections if the server allows them, but allow connections without SSL. <br/>- **Require**: Fail the connection if the server doesn't support SSL. <br/>- **Verify-ca**: Fail the connection if the server doesn't support SSL. Also verifies server certificate. <br/>- **Verify-full**: Fail the connection if the server doesn't support SSL. Also verifies server certificate with host's name. <br/> Options: Disable (0) / Allow (1) / Prefer (2) / Require (3) **(Default)** / Verify-ca (4) / Verify-full (5) | Yes |
| authenticationType | Authentication type for connecting to the database. Only supports **Basic**. | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, it uses the default Azure Integration Runtime. |No |
| ***Additional connection properties:*** |  |  |
| connectionTimeout | The time to wait (in seconds) while trying to establish a connection before terminating the attempt and generating an error. The default value is `15`. | No |
| commandTimeout | The time to wait (in seconds) while trying to execute a command before terminating the attempt and generating an error. Set to zero for infinity. The default value is `30`. | No |

**Example:**

```json
{
    "name": "GreenplumLinkedService",
    "properties": {
        "type": "Greenplum",
        "version": "2.0",
        "typeProperties": {
            "host": "<host>",
            "port": 5432,
            "database": "<database>",
            "username": "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            },
            "sslMode": <sslmode>,
            "authenticationType": "Basic"
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
    "name": "GreenplumLinkedService",
    "properties": {
        "type": "Greenplum",
        "version": "2.0",
        "typeProperties": {
            "host": "<host>",
            "port": 5432,
            "database": "<database>",
            "username": "<username>",
            "password": { 
                "type": "AzureKeyVaultSecret", 
                "store": { 
                    "referenceName": "<Azure Key Vault linked service name>", 
                    "type": "LinkedServiceReference" 
                }, 
                "secretName": "<secretName>" 
            },
            "sslMode": <sslmode>,
            "authenticationType": "Basic"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Version 1.0 

The Greenplum linked service supports the following properties when apply version 1.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Greenplum** | Yes |
| connectionString | An ODBC connection string to connect to Greenplum. <br/>You can also put password in Azure Key Vault and pull the `pwd` configuration out of the connection string. Refer to the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details. | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, it uses the default Azure Integration Runtime. |No |

**Example:**

```json
{
    "name": "GreenplumLinkedService",
    "properties": {
        "type": "Greenplum",
        "typeProperties": {
            "connectionString": "HOST=<server>;PORT=<port>;DB=<database>;UID=<user name>;PWD=<password>"
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
    "name": "GreenplumLinkedService",
    "properties": {
        "type": "Greenplum",
        "typeProperties": {
            "connectionString": "HOST=<server>;PORT=<port>;DB=<database>;UID=<user name>;",
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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Greenplum dataset.

To copy data from Greenplum, set the type property of the dataset to **GreenplumTable**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **GreenplumTable** | Yes |
| schema | Name of the schema. |No (if "query" in activity source is specified)  |
| table | Name of the table. |No (if "query" in activity source is specified)  |
| tableName | Name of the table with schema. This property is supported for backward compatibility. Use `schema` and `table` for new workload. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "GreenplumDataset",
    "properties": {
        "type": "GreenplumTable",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Greenplum linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Greenplum source.

### GreenplumSource as source

To copy data from Greenplum, set the source type in the copy activity to **GreenplumSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **GreenplumSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromGreenplum",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Greenplum input dataset name>",
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
                "type": "GreenplumSource",
                "query": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Data type mapping for Greenplum

When you copy data from Greenplum, the following mappings apply from Greenplum's data types to the internal data types used by the service. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

|Greenplum data type | Interim service data type (for version 2.0) | Interim service data type (for version 1.0) |
|:---|:---|:---|
|SmallInt|Int16|Int16|
|Integer|Int32|Int32|
|BigInt|Int64|Int64|
|Decimal (Precision <= 28)|Decimal|Decimal|
|Decimal (Precision > 28)|Decimal |String|
|Numeric|Decimal|Decimal|
|Real|Single|Single|
|Double|Double|Double|
|SmallSerial|Int16|Int16|
|Serial|Int32|Int32|
|BigSerial|Int64|Int64|
|Money|Decimal|String|
|Char|String|String|
|Varchar|String|String|
|Text|String|String|
|Bytea|Byte[]|Byte[]|
|Timestamp|DateTime|DateTime|
|Timestamp with time zone|DateTimeOffset|String|
|Date|Date|DateTime|
|Time|TimeSpan|TimeSpan|
|Time with time zone|DateTimeOffset|String|
|Interval|TimeSpan|String|
|Boolean|Boolean|Boolean|
|Point|String|String|
|Line|String|String|
|Iseg|String|String|
|Box|String|String|
|Path|String|String|
|Polygon|String|String|
|Circle|String|String|
|Cidr|String|String|
|Inet|String|String|
|Macaddr|String|String|
|Macaddr8|String|String|
|Tsvector|String|String|
|Tsquery|String|String|
|UUID|Guid|Guid|
|Json|String|String|
|Jsonb|String|String|
|Array|String|String|
|Bit|Byte[]|Byte[]|
|Bit varying|Byte[]|Byte[]|
|XML|String|String|
|IntArray|String|String|
|TextArray|String|String|
|NumericArray|String|String|
|DateArray|String|String|
|Range|String|String|
|Bpchar|String|String|

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Upgrade the Greenplum connector

Here are steps that help you upgrade your Greenplum connector:

1. In **Edit linked service** page, select version 2.0 and configure the linked service by referring to [linked service version 2.0 properties](#version-20).

2. The data type mapping for the Greenplum linked service version 2.0 is different from that for the version 1.0. To learn the latest data type mapping, see [Data type mapping for Greenplum](#data-type-mapping-for-greenplum).

## Differences between Greenplum version 2.0 and version 1.0

The Greenplum connector version 2.0 offers new functionalities and is compatible with most features of version 1.0. The table below shows the feature differences between version 2.0 and version 1.0.

| Version 2.0| Version 1.0 |
| --- | --- |
| The following mappings are used from Greenplum data types to interim service data type. <br><br> Decimal (Precision > 28) -> Decimal <br> Money -> Decimal <br> Timestamp with time zone -> DateTimeOffset <br>Time with time zone -> DateTimeOffset <br>Interval -> TimeSpan | The following mappings are used from Greenplum data types to interim service data type. <br><br> Decimal (Precision > 28) -> String <br> Money -> String <br> Timestamp with time zone ->String <br>Time with time zone -> String <br>Interval -> String | 

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
