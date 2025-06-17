---
title: Copy data from Impala
description: Learn how to copy data from Impala to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 06/16/2025
ms.author: jianleishen
---
# Copy data from Impala using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from Impala. It builds on the [Copy Activity overview](copy-activity-overview.md) article that presents a general overview of the copy activity.

> [!IMPORTANT]
> The Impala connector version 2.0 (Preview) provides improved native Impala support. If you are using the Impala connector version 1.0 in your solution, please [upgrade your Impala connector](#upgrade-the-impala-connector) before **September 30, 2025**. Refer to this [section](#differences-between-impala-version-20-and-version-10) for details on the difference between version 2.0 (Preview) and version 1.0.

## Supported capabilities

This Impala connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

The service provides a built-in driver to enable connectivity. Therefore, you don't need to manually install a driver to use this connector.

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)]

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Impala using UI

Use the following steps to create a linked service to Impala in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Impala and select the Impala connector.

   :::image type="content" source="media/connector-impala/impala-connector.png" alt-text="Screenshot of the Impala connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-impala/configure-impala-linked-service.png" alt-text="Screenshot of linked service configuration for Impala.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to the Impala connector.

## Linked service properties

The Impala connector now supports version 2.0 (Preview). Refer to this [section](#upgrade-the-impala-connector) to upgrade your Impala connector version from version 1.0. For the property details, see the corresponding sections.

- [Version 2.0 (Preview)](#version-20)
- [Version 1.0](#version-10)

### <a name="version-20"></a> Version 2.0 (Preview)

The Impala linked service supports the following properties when apply version 2.0 (Preview):

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **Impala**. | Yes |
| version | The version that you specify. The value is `2.0`. | Yes |
| host | The IP address or host name of the Impala server (that is, 192.168.222.160).  | Yes |
| port | The TCP port that the Impala server uses to listen for client connections. The default value is 21050.  | No |
| thriftTransportProtocol | The transport protocol to use in the Thrift layer. Allowed values are: **Binary**, **HTTP**. The default value is Binary. | Yes |
| authenticationType | The authentication type to use. <br/>Allowed values are **Anonymous** and **UsernameAndPassword**. | Yes |
| username | The user name used to access the Impala server. | No |
| password | The password that corresponds to the user name when you use UsernameAndPassword. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| enableSsl | Specifies whether the connections to the server are encrypted by using TLS. The default value is true.  | No |
| enableServerCertificateValidation | Specify whether to enable server SSL certificate validation when you connect. Always use System Trust Store. The default value is true. | No |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, it uses the default Azure Integration Runtime. |No |

**Example:**

```json
{
    "name": "ImpalaLinkedService",
    "properties": {
        "type": "Impala",
        "version": "2.0",
        "typeProperties": {
            "host" : "<host>",
            "port" : "<port>",
            "authenticationType" : "UsernameAndPassword",
            "username" : "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            },
            "enableSsl": true,
            "thriftTransportProtocol": "Binary",
            "enableServerCertificateValidation": true
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Version 1.0

The following properties are supported for Impala linked service when apply version 1.0:

The following properties are supported for Impala linked service.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **Impala**. | Yes |
| host | The IP address or host name of the Impala server (that is, 192.168.222.160).  | Yes |
| port | The TCP port that the Impala server uses to listen for client connections. The default value is 21050.  | No |
| authenticationType | The authentication type to use. <br/>Allowed values are **Anonymous**, **SASLUsername**, and **UsernameAndPassword**. | Yes |
| username | The user name used to access the Impala server. The default value is anonymous when you use SASLUsername.  | No |
| password | The password that corresponds to the user name when you use UsernameAndPassword. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| enableSsl | Specifies whether the connections to the server are encrypted by using TLS. The default value is **false**.  | No |
| trustedCertPath | The full path of the .pem file that contains trusted CA certificates used to verify the server when you connect over TLS. This property can be set only when you use TLS on Self-hosted Integration Runtime. The default value is the cacerts.pem file installed with the integration runtime.  | No |
| useSystemTrustStore | Specifies whether to use a CA certificate from the system trust store or from a specified PEM file. The default value is **false**.  | No |
| allowHostNameCNMismatch | Specifies whether to require a CA-issued TLS/SSL certificate name to match the host name of the server when you connect over TLS. The default value is **false**.  | No |
| allowSelfSignedServerCert | Specifies whether to allow self-signed certificates from the server. The default value is **false**.  | No |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, it uses the default Azure Integration Runtime. |No |

**Example:**

```json
{
    "name": "ImpalaLinkedService",
    "properties": {
        "type": "Impala",
        "typeProperties": {
            "host" : "<host>",
            "port" : "<port>",
            "authenticationType" : "UsernameAndPassword",
            "username" : "<username>",
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

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by the Impala dataset.

To copy data from Impala, set the type property of the dataset to **ImpalaObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **ImpalaObject** | Yes |
| schema | Name of the schema. |No (if "query" in activity source is specified)  |
| table | Name of the table. |No (if "query" in activity source is specified)  |
| tableName | Name of the table with schema. This property is supported for backward compatibility. Use `schema` and `table` for new workload. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "ImpalaDataset",
    "properties": {
        "type": "ImpalaObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Impala linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by the Impala source type.

### Impala as a source type

To copy data from Impala, set the source type in the copy activity to **ImpalaSource**. The following properties are supported in the copy activity **source** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to **ImpalaSource**. | Yes |
| query | Use the custom SQL query to read data. An example is `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromImpala",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Impala input dataset name>",
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
                "type": "ImpalaSource",
                "query": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Data type mapping for Impala

When you copy data from and to Impala, the following interim data type mappings are used within the service. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| Impala data type | Interim service data type (for version 2.0 (Preview)) | Interim service data type (for version 1.0) |
|:--- |:--- |:--- |
| ARRAY        | String                   | String                 |
| BIGINT       | Int64                    | Int64                  |
| BOOLEAN      | Boolean                  | Boolean                |
| CHAR         | String                   | String                 |
| DATE         | DateTime                 | DateTime               |
| DECIMAL      | Decimal                  | Decimal                |
| DOUBLE       | Double                   | Double                 |
| FLOAT        | Single                   | Single                 |
| INT          | Int32                    | Int32                  |
| MAP          | String                   | String                 |
| SMALLINT     | Int16                    | Int16                  |
| STRING       | String                   | String                 |
| STRUCT       | String                   | String                 |
| TIMESTAMP    | DateTimeOffset           | DateTime               |
| TINYINT      | SByte                    | Int16                  |
| VARCHAR      | String                   | String                 |

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## <a name="differences-between-impala-version-20-and-version-10"></a> Impala connector lifecycle and upgrade

The following table shows the release stage and change logs for different versions of the Impala connector:

| Version | Release stage | Change log |
| :----------- | :------- | :------- |
| Version 1.0 | End of support announced | / |
| Version 2.0 (Preview) | Preview version available | • SASLUsername authentication type is not supported. <br><br>• The default value of `enableSSL` is true. `trustedCertPath`, `useSystemTrustStore`, `allowHostNameCNMismatch` and `allowSelfSignedServerCert` are not supported.<br>`enableServerCertificateValidation` is supported.  <br><br>• TIMESTAMP is read as DateTimeOffset data type. <br><br>• TINYINT is read as SByte data type. |

### <a name="upgrade-the-impala-connector"></a> Upgrade the Impala connector from version 1.0 to version 2.0 (Preview)

1. In **Edit linked service** page, select version 2.0 (Preview) and configure the linked service by referring to [Linked service properties version 2.0 (Preview)](#version-20).

2. The data type mapping for the Impala linked service version 2.0 (Preview) is different from that for the version 1.0. To learn the latest data type mapping, see [Data type mapping for Impala](#data-type-mapping-for-impala).


## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
