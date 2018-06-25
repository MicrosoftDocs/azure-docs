---
title: Copy data from Netezza using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from Netezza to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/15/2018
ms.author: jingwang

---
# Copy data from Netezza using Azure Data Factory 

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from Netezza. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

You can copy data from Netezza to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Azure Data Factory provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Getting started

You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity.

The following sections provide details about properties that are used to define Data Factory entities specific to Netezza connector.

## Linked service properties

The following properties are supported for Netezza linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Netezza** | Yes |
| connectionString | An ODBC connection string to connect to Netezza. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Self-hosted Integration Runtime or Azure Integration Runtime (if your data store is publicly accessible). If not specified, it uses the default Azure Integration Runtime. |No |

A typical connection string is `Server=<server>;Port=<port>;Database=<database>;UID=<user name>;PWD=<password>`. More properties you can set per your case:

| Property | Description | Required |
|:--- |:--- |:--- |:--- |
| SecurityLevel | The level of security (SSL/TLS) that the driver uses for the connection to the data store. E.g. `SecurityLevel=preferredSecured`. Supported values are:<br/>- Only Unsecured (**onlyUnSecured**): The driver does not use SSL.<br/>- **Preferred Unsecured (preferredUnSecured) (default)**: If the server provides a choice, the driver does not use SSL. <br/>- **Preferred Secured (preferredSecured)**: If the server provides a choice, the driver uses SSL. <br/>- **Only Secured (onlySecured)**: The driver does not connect unless an SSL connection is available | No |
| CaCertFile | The full path to the SSL certificate that is used by the server. E.g. `CaCertFile=<cert path>;`| Yes, if SSL is enabled |

**Example:**

```json
{
    "name": "NetezzaLinkedService",
    "properties": {
        "type": "Netezza",
        "typeProperties": {
            "connectionString": {
                 "type": "SecureString",
                 "value": "Server=<server>;Port=<port>;Database=<database>;UID=<user name>;PWD=<password>"
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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Netezza dataset.

To copy data from Netezza, set the type property of the dataset to **NetezzaTable**. There is no additional type-specific property in this type of dataset.

**Example**

```json
{
    "name": "NetezzaDataset",
    "properties": {
        "type": "NetezzaTable",
        "linkedServiceName": {
            "referenceName": "<Netezza linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Netezza source.

### Netezza as source

To copy data from Netezza, set the source type in the copy activity to **NetezzaSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **NetezzaSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | Yes |

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

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
