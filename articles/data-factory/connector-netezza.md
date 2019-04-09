---
title: Copy data from Netezza by using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from Netezza to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 02/01/2019
ms.author: jingwang

---
# Copy data from Netezza by using Azure Data Factory

This article outlines how to use Copy Activity in Azure Data Factory to copy data from Netezza. The article builds on [Copy Activity in Azure Data Factory](copy-activity-overview.md), which presents a general overview of Copy Activity.

## Supported capabilities

You can copy data from Netezza to any supported sink data store. For a list of data stores that Copy Activity supports as sources and sinks, see [Supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).

Azure Data Factory provides a built-in driver to enable connectivity. You don't need to manually install any driver to use this connector.

## Get started

You can create a pipeline that uses a copy activity by using the .NET SDK, the Python SDK, Azure PowerShell, the REST API, or an Azure Resource Manager template. See the [Copy Activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions on how to create a pipeline that has a copy activity.

The following sections provide details about properties you can use to define Data Factory entities that are specific to the Netezza connector.

## Linked service properties

The following properties are supported for the Netezza linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property must be set to **Netezza**. | Yes |
| connectionString | An ODBC connection string to connect to Netezza. <br/>Mark this field as a SecureString to store it securely in Data Factory. You can also put password in Azure Key Vault and pull the `pwd` configuration out of the connection string. Refer to the following samples and [Store credentials in Azure Key Vault](store-credentials-in-key-vault.md) article with more details. | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to use to connect to the data store. You can choose a self-hosted Integration Runtime or the Azure Integration Runtime (if your data store is publicly accessible). If not specified, the default Azure Integration Runtime is used. |No |

A typical connection string is `Server=<server>;Port=<port>;Database=<database>;UID=<user name>;PWD=<password>`. The following table describes more properties that you can set:

| Property | Description | Required |
|:--- |:--- |:--- |
| SecurityLevel | The level of security (SSL/TLS) that the driver uses for the connection to the data store. Example: `SecurityLevel=preferredSecured`. Supported values are:<br/>- **Only unsecured** (**onlyUnSecured**): The driver doesn't use SSL.<br/>- **Preferred unsecured (preferredUnSecured) (default)**: If the server provides a choice, the driver doesn't use SSL. <br/>- **Preferred secured (preferredSecured)**: If the server provides a choice, the driver uses SSL. <br/>- **Only secured (onlySecured)**: The driver doesn't connect unless an SSL connection is available. | No |
| CaCertFile | The full path to the SSL certificate that's used by the server. Example: `CaCertFile=<cert path>;`| Yes, if SSL is enabled |

**Example**

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

**Example: store password in Azure Key Vault**

```json
{
    "name": "NetezzaLinkedService",
    "properties": {
        "type": "Netezza",
        "typeProperties": {
            "connectionString": {
                 "type": "SecureString",
                 "value": "Server=<server>;Port=<port>;Database=<database>;UID=<user name>;"
            },
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
| tableName | Name of the table. | No (if "query" in activity source is specified) |

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

To copy data from Netezza, set the **source** type in Copy Activity to **NetezzaSource**. The following properties are supported in the Copy Activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the Copy Activity source must be set to **NetezzaSource**. | Yes |
| query | Use the custom SQL query to read data. Example: `"SELECT * FROM MyTable"` | No (if "tableName" in dataset is specified) |

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

For a list of data stores that Copy Activity supports as sources and sinks in Azure Data Factory, see [Supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).
