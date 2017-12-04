---
title: Copy data from Paypal using Azure Data Factory (Beta) | Microsoft Docs
description: Learn how to copy data from Paypal to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
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
# Copy data from Paypal using Azure Data Factory (Beta)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from Paypal. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Copy Activity in V1](v1/data-factory-data-movement-activities.md).

> [!IMPORTANT]
> This connector is currently in Beta. You can try it out and give us feedback. Do not use it in production environments.

## Supported capabilities

You can copy data from Paypal to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Azure Data Factory provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Getting started

You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity.

The following sections provide details about properties that are used to define Data Factory entities specific to Paypal connector.

## Linked service properties

The following properties are supported for Paypal linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Paypal** | Yes |
| host | The URL of the PayPal instance. (i.e. api.sandbox.paypal.com)  | Yes |
| clientId | The client ID associated with your PayPal application.  | Yes |
| clientSecret | The client secret associated with your PayPal application. You can choose to mark this field as a SecureString to store it securely in ADF, or store password in Azure Key Vault and let ADF copy acitivty pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | Yes |
| useEncryptedEndpoints | Specifies whether the data source endpoints are encrypted using HTTPS. The default value is true.  | No |
| useHostVerification | Specifies whether to require the host name in the server's certificate to match the host name of the server when connecting over SSL. The default value is true.  | No |
| usePeerVerification | Specifies whether to verify the identity of the server when connecting over SSL. The default value is true.  | No |

**Example:**

```json
{
    "name": "PaypalLinkedService",
    "properties": {
        "type": "Paypal",
        "typeProperties": {
            "host" : "api.sandbox.paypal.com",
            "clientId" : "<clientId>",
            "clientSecret": {
                 "type": "SecureString",
                 "value": "<clientSecret>"
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Paypal dataset.

To copy data from Paypal, set the type property of the dataset to **PaypalObject**. There is no additional type-specific property in this type of dataset.

**Example**

```json
{
    "name": "PaypalDataset",
    "properties": {
        "type": "PaypalObject",
        "linkedServiceName": {
            "referenceName": "<Paypal linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Paypal source.

### PaypalSource as source

To copy data from Paypal, set the source type in the copy activity to **PaypalSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **PaypalSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM Payment_Experience"`. | Yes |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromPaypal",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Paypal input dataset name>",
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
                "type": "PaypalSource",
                "query": "SELECT * FROM Payment_Experience"
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
