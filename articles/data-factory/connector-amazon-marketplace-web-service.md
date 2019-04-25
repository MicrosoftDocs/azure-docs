---
title: Copy data from Amazon Marketplace Web Service using Azure Data Factory (Preview) | Microsoft Docs
description: Learn how to copy data from Amazon Marketplace Web Service to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
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
# Copy data from Amazon Marketplace Web Service using Azure Data Factory (Preview)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from Amazon Marketplace Web Service. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!IMPORTANT]
> This connector is currently in preview. You can try it out and give us feedback. If you want to take a dependency on preview connectors in your solution, please contact [Azure support](https://azure.microsoft.com/support/).

## Supported capabilities

You can copy data from Amazon Marketplace Web Service to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Azure Data Factory provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to Amazon Marketplace Web Service connector.

## Linked service properties

The following properties are supported for Amazon Marketplace Web Service linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AmazonMWS** | Yes |
| endpoint | The endpoint of the Amazon MWS server, (that is, mws.amazonservices.com)  | Yes |
| marketplaceID | The Amazon Marketplace ID you want to retrieve data from. To retrieve data from multiple Marketplace IDs, separate them with a comma (`,`). (that is, A2EUQ1WTGCTBG2)  | Yes |
| sellerID | The Amazon seller ID.  | Yes |
| mwsAuthToken | The Amazon MWS authentication token. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| accessKeyId | The access key ID used to access data.  | Yes |
| secretKey | The secret key used to access data. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| useEncryptedEndpoints | Specifies whether the data source endpoints are encrypted using HTTPS. The default value is true.  | No |
| useHostVerification | Specifies whether to require the host name in the server's certificate to match the host name of the server when connecting over SSL. The default value is true.  | No |
| usePeerVerification | Specifies whether to verify the identity of the server when connecting over SSL. The default value is true.  | No |

**Example:**

```json
{
    "name": "AmazonMWSLinkedService",
    "properties": {
        "type": "AmazonMWS",
        "typeProperties": {
            "endpoint" : "mws.amazonservices.com",
            "marketplaceID" : "A2EUQ1WTGCTBG2",
            "sellerID" : "<sellerID>",
            "mwsAuthToken": {
                 "type": "SecureString",
                 "value": "<mwsAuthToken>"
            },
            "accessKeyId" : "<accessKeyId>",
            "secretKey": {
                 "type": "SecureString",
                 "value": "<secretKey>"
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Amazon Marketplace Web Service dataset.

To copy data from Amazon Marketplace Web Service, set the type property of the dataset to **AmazonMWSObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **AmazonMWSObject** | Yes |
| tableName | Name of the table. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "AmazonMWSDataset",
    "properties": {
        "type": "AmazonMWSObject",
        "linkedServiceName": {
            "referenceName": "<AmazonMWS linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {}
    }
}

```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Amazon Marketplace Web Service source.

### Amazon MWS as source

To copy data from Amazon Marketplace Web Service, set the source type in the copy activity to **AmazonMWSSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **AmazonMWSSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM Orders where  Amazon_Order_Id = 'xx'"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromAmazonMWS",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<AmazonMWS input dataset name>",
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
                "type": "AmazonMWSSource",
                "query": "SELECT * FROM Orders where Amazon_Order_Id = 'xx'"
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
