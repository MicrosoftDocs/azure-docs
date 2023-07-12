---
title: Copy data from Phoenix
description: Learn how to copy data from Phoenix to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 01/25/2023
ms.author: jianleishen
---
# Copy data from Phoenix using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from Phoenix. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

This Phoenix connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

The service provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)]

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Phoenix using UI

Use the following steps to create a linked service to Phoenix in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Phoenix and select the Phoenix connector.

   :::image type="content" source="media/connector-phoenix/phoenix-connector.png" alt-text="Screenshot of the Phoenix connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-phoenix/configure-phoenix-linked-service.png" alt-text="Screenshot of linked service configuration for Phoenix.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Phoenix connector.

## Linked service properties

The following properties are supported for Phoenix linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Phoenix** | Yes |
| host | The IP address or host name of the Phoenix server. (that is, 192.168.222.160)  | Yes |
| port | The TCP port that the Phoenix server uses to listen for client connections. The default value is 8765. If you connect to Azure HDInsights, specify port as 443. | No |
| httpPath | The partial URL corresponding to the Phoenix server. (that is, /gateway/sandbox/phoenix/version). Specify `/hbasephoenix0` if using HDInsights cluster.  | No |
| authenticationType | The authentication mechanism used to connect to the Phoenix server. <br/>Allowed values are: **Anonymous**, **UsernameAndPassword**, **WindowsAzureHDInsightService** | Yes |
| username | The user name used to connect to the Phoenix server.  | No |
| password | The password corresponding to the user name. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| enableSsl | Specifies whether the connections to the server are encrypted using TLS. The default value is false.  | No |
| trustedCertPath | The full path of the .pem file containing trusted CA certificates for verifying the server when connecting over TLS. This property can only be set when using TLS on self-hosted IR. The default value is the cacerts.pem file installed with the IR.  | No |
| useSystemTrustStore | Specifies whether to use a CA certificate from the system trust store or from a specified PEM file. The default value is false.  | No |
| allowHostNameCNMismatch | Specifies whether to require a CA-issued TLS/SSL certificate name to match the host name of the server when connecting over TLS. The default value is false.  | No |
| allowSelfSignedServerCert | Specifies whether to allow self-signed certificates from the server. The default value is false.  | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, it uses the default Azure Integration Runtime. |No |

>[!NOTE]
>If your cluster doesn't support sticky session e.g. HDInsight, explicitly add node index at the end of the http path setting, e.g. specify `/hbasephoenix0` instead of `/hbasephoenix`.

**Example:**

```json
{
    "name": "PhoenixLinkedService",
    "properties": {
        "type": "Phoenix",
        "typeProperties": {
            "host" : "<cluster>.azurehdinsight.net",
            "port" : "443",
            "httpPath" : "/hbasephoenix0",
            "authenticationType" : "WindowsAzureHDInsightService",
            "username" : "<username>",
            "password": {
                 "type": "SecureString",
                 "value": "<password>"
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Phoenix dataset.

To copy data from Phoenix, set the type property of the dataset to **PhoenixObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **PhoenixObject** | Yes |
| schema | Name of the schema. |No (if "query" in activity source is specified)  |
| table | Name of the table. |No (if "query" in activity source is specified)  |
| tableName | Name of the table with schema. This property is supported for backward compatibility. Use `schema` and `table` for new workload. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "PhoenixDataset",
    "properties": {
        "type": "PhoenixObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Phoenix linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Phoenix source.

### Phoenix as source

To copy data from Phoenix, set the source type in the copy activity to **PhoenixSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **PhoenixSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromPhoenix",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Phoenix input dataset name>",
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
                "type": "PhoenixSource",
                "query": "SELECT * FROM MyTable"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
