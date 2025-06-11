---
title: Copy data from Presto
description: Learn how to copy data from Presto to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 06/06/2025
ms.author: jianleishen
---
# Copy data from Presto using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from Presto. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!IMPORTANT]
> The Presto connector version 2.0 provides improved native Presto support. If you are using Presto connector version 1.0 in your solution, please [upgrade the Presto connector](#upgrade-the-presto-connector) before **August 31, 2025**. Refer to this [section](#differences-between-presto-connector-version-20-and-version-10) for details on the difference between version 2.0 and version 1.0.

## Supported capabilities

This Presto connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

The service provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Presto using UI

Use the following steps to create a linked service to Presto in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Presto and select the Presto connector.

   :::image type="content" source="media/connector-presto/presto-connector.png" alt-text="Screenshot of the Presto connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-presto/configure-presto-linked-service.png" alt-text="Screenshot of linked service configuration for Presto.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Presto connector.

## Linked service properties

The Presto connector now supports version 2.0. Refer to this section to upgrade your Presto connector version from version 1.0. For the property details, see the corresponding sections.

- [Version 2.0](#version-20)
- [Version 1.0](#version-10)

### Version 2.0 

The Presto linked service supports the following properties when apply version 2.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Presto** | Yes |
| version | The version that you specify. The value is `2.0`. | Yes |
| host | The IP address or host name of the Presto server. (e.g. 192.168.222.160)  | Yes |
| catalog | The catalog context for all request against the server.  | Yes |
| port | The TCP port that the Presto server uses to listen for client connections. The default value is 8443.  | No |
| authenticationType | The authentication mechanism used to connect to the Presto server. <br/>Allowed values are: **Anonymous**, **LDAP** | Yes |
| username | The user name used to connect to the Presto server.  | No |
| password | The password corresponding to the user name. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| enableSsl | Specifies whether the connections to the server are encrypted using TLS. The default value is true.  | No |
| enableServerCertificateValidation | Specify whether to enable server SSL certificate validation when you connect. <br>Always use System Trust Store. The default value is true. | No |
| timeZoneID | The local time zone used by the connection. Valid values for this option are specified in the IANA Time Zone Database. The default value is the Presto system time zone.  | No |

**Example:**

```json
{
    "name": "PrestoLinkedService",
    "properties": {
        "type": "Presto",
        "version" : "2.0",
        "typeProperties": {
            "host" : "<host>",
            "catalog" : "<catalog>",
            "port" : 8443,
            "authenticationType" : "LDAP",
            "username" : "<username>",
            "password": {
                 "type": "SecureString",
                 "value": "<password>"
            },
            "enableSsl": true,
            "enableServerCertificateValidation": true,
            "timeZoneID" : ""
        }
    }
}
```

### Version 1.0

The Presto linked service supports the following properties when apply version 1.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Presto** | Yes |
| host | The IP address or host name of the Presto server. (e.g. 192.168.222.160)  | Yes |
| serverVersion | The version of the Presto server. (e.g. 0.148-t)  | Yes |
| catalog | The catalog context for all request against the server.  | Yes |
| port | The TCP port that the Presto server uses to listen for client connections. The default value is 8080.  | No |
| authenticationType | The authentication mechanism used to connect to the Presto server. <br/>Allowed values are: **Anonymous**, **LDAP** | Yes |
| username | The user name used to connect to the Presto server.  | No |
| password | The password corresponding to the user name. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| enableSsl | Specifies whether the connections to the server are encrypted using TLS. The default value is false.  | No |
| trustedCertPath | The full path of the .pem file containing trusted CA certificates for verifying the server when connecting over TLS. This property can only be set when using TLS on self-hosted IR. The default value is the cacerts.pem file installed with the IR.  | No |
| useSystemTrustStore | Specifies whether to use a CA certificate from the system trust store or from a specified PEM file. The default value is false.  | No |
| allowHostNameCNMismatch | Specifies whether to require a CA-issued TLS/SSL certificate name to match the host name of the server when connecting over TLS. The default value is false.  | No |
| allowSelfSignedServerCert | Specifies whether to allow self-signed certificates from the server. The default value is false.  | No |
| timeZoneID | The local time zone used by the connection. Valid values for this option are specified in the IANA Time Zone Database. The default value is the Azure Data Factory time zone.  | No |

**Example:**

```json
{
    "name": "PrestoLinkedService",
    "properties": {
        "type": "Presto",
        "typeProperties": {
            "host" : "<host>",
            "serverVersion" : "0.148-t",
            "catalog" : "<catalog>",
            "port" : "<port>",
            "authenticationType" : "LDAP",
            "username" : "<username>",
            "password": {
                 "type": "SecureString",
                 "value": "<password>"
            },
            "timeZoneID" : "Europe/Berlin"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Presto dataset.

To copy data from Presto, set the type property of the dataset to **PrestoObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **PrestoObject** | Yes |
| schema | Name of the schema. |No (if "query" in activity source is specified)  |
| table | Name of the table. |No (if "query" in activity source is specified)  |
| tableName | Name of the table with schema. This property is supported for backward compatibility. Use `schema` and `table` for new workload. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "PrestoDataset",
    "properties": {
        "type": "PrestoObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Presto linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Presto source.

### Presto as source

To copy data from Presto, set the source type in the copy activity to **PrestoSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **PrestoSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromPresto",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Presto input dataset name>",
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
                "type": "PrestoSource",
                "query": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Data type mapping for Presto

When you copy data from Presto, the following mappings apply from Presto's data types to the internal data types used by the service. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| Presto data type | Interim service data type (for version 2.0) | Interim service data type (for version 1.0) |
|:--- |:--- |:--- |
| ARRAY | String | String |
| BIGINT | Int64 | Int64 |
| BOOLEAN | Boolean | Boolean |
| CHAR | String | String |
| DATE | Date | Datetime |
| DECIMAL (Precision < 28) | Decimal | Decimal |
| DECIMAL (Precision >= 28) | Decimal | String |
| DOUBLE | Double | Decimal |
| INTEGER | Int32 | Int32 |
| INTERVAL_DAY_TO_SECOND | TimeSpan | Not supported. |
| INTERVAL_YEAR_TO_MONTH | String | Not supported. |
| IPADDRESS | String | Not supported. |
| JSON | String | String |
| MAP | String | String |
| REAL | Single | Single |
| ROW | String | String |
| SMALLINT | Int16 | Int16 |
| TIME | Time | TimeSpan |
| TIME_WITH_TIME_ZONE | String | String |
| TIMESTAMP | Datetime | Datetime |
| TIMESTAMPWITHTIMEZONE | Datetimeoffset | Not supported. |
| TINYINT | SByte | Int16 |
| UUID | Guid | Not supported. |
| VARBINARY | Byte[] | Byte[] |
| VARCHAR | String | String |

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Upgrade the Presto connector

Here are steps that help you upgrade the Presto connector:

1. In **Edit linked service** page, select version 2.0 and configure the linked service by referring to [linked service version 2.0 properties](#version-20).

2. The data type mapping for the Presto linked service version 2.0 is different from that for the version 1.0. To learn the latest data type mapping, see [Data type mapping for Presto](#data-type-mapping-for-presto).

## Differences between Presto connector version 2.0 and version 1.0

The Presto connector version 2.0 offers new functionalities and is compatible with most features of version 1.0. The following table shows the feature differences between version 2.0 and version 1.0.

| Version 2.0  | Version 1.0 | 
| :----------- | :------- |
| `serverVersion` is not supported. | `serverVersion` is supported. |
| The default value of `port` is 8443. | The default value of `port` is 8080. |
| The default value of `enableSSL` is true.<br><br> `enableServerCertificateValidation` is supported. <br><br>`trustedCertPath`, `useSystemTrustStore`, `allowHostNameCNMismatch` and `allowSelfSignedServerCert` are not supported.| The default value of `enableSSL` is false.<br><br>`enableServerCertificateValidation` is not supported. <br><br> `trustedCertPath`, `useSystemTrustStore`, `allowHostNameCNMismatch` and `allowSelfSignedServerCert` is supported. |
| The default value of `timeZoneID` is the Presto system time zone. | The default value of `timeZoneID` is the Azure Data Factory time zone. |
| The following mappings are used from Presto data types to interim service data type.<br><br>DATE -> Date <br>DECIMAL (Precision >= 28) -> Decimal <br> DOUBLE -> Double <br>INTERVAL_DAY_TO_SECOND -> TimeSpan <br>INTERVAL_YEAR_TO_MONTH -> String<br>IPADDRESS -> String<br>TIME -> Time<br>TIMESTAMPWITHTIMEZONE -> Datetimeoffset<br>TINYINT -> SByte<br>UUID -> Guid| The following mappings are used from Presto data types to interim service data type.<br><br>DATE -> Datetime <br>DECIMAL (Precision >= 28) -> String <br>DOUBLE -> Decimal <br>TIME -> TimeSpan<br>TINYINT -> Int16<br> Other mappings supported by version 2.0 listed left are not supported by version 1.0. |  

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
