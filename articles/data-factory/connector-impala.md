---
title: Copy data from Impala by using Azure Data Factory (Preview) | Microsoft Docs
description: Learn how to copy data from Impala to supported sink data stores by using a copy activity in a data factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 12/07/2018
ms.author: jingwang

---
# Copy data from Impala by using Azure Data Factory (Preview)

This article outlines how to use Copy Activity in Azure Data Factory to copy data from Impala. It builds on the [Copy Activity overview](copy-activity-overview.md) article that presents a general overview of the copy activity.

> [!IMPORTANT]
> This connector is currently in preview. You can try it out and provide feedback. If you want to take a dependency on preview connectors in your solution, please contact [Azure support](https://azure.microsoft.com/support/).

## Supported capabilities

You can copy data from Impala to any supported sink data store. For a list of data stores that are supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

 Data Factory provides a built-in driver to enable connectivity. Therefore, you don't need to manually install a driver to use this connector.

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to the Impala connector.

## Linked service properties

The following properties are supported for Impala linked service.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **Impala**. | Yes |
| host | The IP address or host name of the Impala server (that is, 192.168.222.160).  | Yes |
| port | The TCP port that the Impala server uses to listen for client connections. The default value is 21050.  | No |
| authenticationType | The authentication type to use. <br/>Allowed values are **Anonymous**, **SASLUsername**, and **UsernameAndPassword**. | Yes |
| username | The user name used to access the Impala server. The default value is anonymous when you use SASLUsername.  | No |
| password | The password that corresponds to the user name when you use UsernameAndPassword. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| enableSsl | Specifies whether the connections to the server are encrypted by using SSL. The default value is **false**.  | No |
| trustedCertPath | The full path of the .pem file that contains trusted CA certificates used to verify the server when you connect over SSL. This property can be set only when you use SSL on Self-hosted Integration Runtime. The default value is the cacerts.pem file installed with the integration runtime.  | No |
| useSystemTrustStore | Specifies whether to use a CA certificate from the system trust store or from a specified PEM file. The default value is **false**.  | No |
| allowHostNameCNMismatch | Specifies whether to require a CA-issued SSL certificate name to match the host name of the server when you connect over SSL. The default value is **false**.  | No |
| allowSelfSignedServerCert | Specifies whether to allow self-signed certificates from the server. The default value is **false**.  | No |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Self-hosted Integration Runtime or Azure Integration Runtime (if your data store is publicly accessible). If not specified, it uses the default Azure Integration Runtime. |No |

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
| tableName | Name of the table. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "ImpalaDataset",
    "properties": {
        "type": "ImpalaObject",
        "linkedServiceName": {
            "referenceName": "<Impala linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {}
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

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Data Factory, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
