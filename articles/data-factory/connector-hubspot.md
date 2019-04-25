---
title: Copy data from HubSpot using Azure Data Factory (Preview) | Microsoft Docs
description: Learn how to copy data from HubSpot to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
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
# Copy data from HubSpot using Azure Data Factory (Preview)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from HubSpot. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!IMPORTANT]
> This connector is currently in preview. You can try it out and give us feedback. If you want to take a dependency on preview connectors in your solution, please contact [Azure support](https://azure.microsoft.com/support/).

## Supported capabilities

You can copy data from HubSpot to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Azure Data Factory provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to HubSpot connector.

## Linked service properties

The following properties are supported for HubSpot linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Hubspot** | Yes |
| clientId | The client ID associated with your Hubspot application.  | Yes |
| clientSecret | The client secret associated with your Hubspot application. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| accessToken | The access token obtained when initially authenticating your OAuth integration. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| refreshToken | The refresh token obtained when initially authenticating your OAuth integration. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| useEncryptedEndpoints | Specifies whether the data source endpoints are encrypted using HTTPS. The default value is true.  | No |
| useHostVerification | Specifies whether to require the host name in the server's certificate to match the host name of the server when connecting over SSL. The default value is true.  | No |
| usePeerVerification | Specifies whether to verify the identity of the server when connecting over SSL. The default value is true.  | No |

**Example:**

```json
{
    "name": "HubspotLinkedService",
    "properties": {
        "type": "Hubspot",
        "typeProperties": {
            "clientId" : "<clientId>",
            "clientSecret": {
                "type": "SecureString",
                "value": "<clientSecret>"
            },
            "accessToken": {
                "type": "SecureString",
                "value": "<accessToken>"
            },
            "refreshToken": {
                "type": "SecureString",
                "value": "<refreshToken>"
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by HubSpot dataset.

To copy data from HubSpot, set the type property of the dataset to **HubspotObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **HubspotObject** | Yes |
| tableName | Name of the table. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "HubspotDataset",
    "properties": {
        "type": "HubspotObject",
        "linkedServiceName": {
            "referenceName": "<Hubspot linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {}
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by HubSpot source.

### HubspotSource as source

To copy data from HubSpot, set the source type in the copy activity to **HubspotSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **HubspotSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM Companies where Company_Id = xxx"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromHubspot",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Hubspot input dataset name>",
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
                "type": "HubspotSource",
                "query": "SELECT * FROM Companies where Company_Id = xxx"
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
