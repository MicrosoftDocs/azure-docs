---
title: Copy data from Impala using Azure Data Factory (Beta) | Microsoft Docs
description: Learn how to copy data from Impala to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/30/2017
ms.author: jingwang

---
# Copy data from Impala using Azure Data Factory (Beta)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from Impala. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Copy Activity in V1](v1/data-factory-data-movement-activities.md).

> [!IMPORTANT]
> This connector is currently in Beta. You can try it out and give us feedback. Do not use it in production environments.

## Supported capabilities

You can copy data from Impala to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Azure Data Factory provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Getting started

You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity.

The following sections provide details about properties that are used to define Data Factory entities specific to Impala connector.

## Linked service properties

The following properties are supported for Impala linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Impala** | Yes |
| host | The IP address or host name of the Impala server. (i.e. 192.168.222.160)  | Yes |
| port | The TCP port that the Impala server uses to listen for client connections. The default value is 21050.  | No |
| authenticationType | The authentication type to use. <br/>Allowed values are: **Anonymous**, **SASLUsername**, **UsernameAndPassword** | Yes |
| username | The user name used to access the Impala server. The default value is anonymous when using SASLUsername.  | No |
| password | The password corresponding to the user name when using UsernameAndPassword. You can choose to mark this field as a SecureString to store it securely in ADF, or store password in Azure Key Vault and let ADF copy acitivty pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | No |
| enableSsl | Specifies whether the connections to the server are encrypted using SSL. The default value is false.  | No |
| trustedCertPath | The full path of the .pem file containing trusted CA certificates for verifying the server when connecting over SSL. This property can only be set when using SSL on self-hosted IR. The default value is the cacerts.pem file installed with the IR.  | No |
| useSystemTrustStore | Specifies whether to use a CA certificate from the system trust store or from a specified PEM file. The default value is false.  | No |
| allowHostNameCNMismatch | Specifies whether to require a CA-issued SSL certificate name to match the host name of the server when connecting over SSL. The default value is false.  | No |
| allowSelfSignedServerCert | Specifies whether to allow self-signed certificates from the server. The default value is false.  | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Self-hosted Integration Runtime or Azure Integration Runtime (if your data store is publicly accessible). If not specified, it uses the default Azure Integration Runtime. |No |

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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Impala dataset.

To copy data from Impala, set the type property of the dataset to **ImpalaObject**. There is no additional type-specific property in this type of dataset.

**Example**

```json
{
    "name": "ImpalaDataset",
    "properties": {
        "type": "ImpalaObject",
        "linkedServiceName": {
            "referenceName": "<Impala linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Impala source.

### ImpalaSource as source

To copy data from Impala, set the source type in the copy activity to **ImpalaSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **ImpalaSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | Yes |

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
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
