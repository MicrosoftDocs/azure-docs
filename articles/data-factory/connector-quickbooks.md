---
title: Copy data from QuickBooks Online (Preview) 
description: Learn how to copy data from QuickBooks Online to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 01/18/2023
---

# Copy data from QuickBooks Online using Azure Data Factory or Synapse Analytics (Preview)
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from QuickBooks Online. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!IMPORTANT]
> This connector is currently in preview. You can try it out and give us feedback. If you want to take a dependency on preview connectors in your solution, please contact [Azure support](https://azure.microsoft.com/support/).

## Supported capabilities

This QuickBooks connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

This connector supports QuickBooks OAuth 2.0 authentication.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to QuickBooks using UI

Use the following steps to create a linked service to QuickBooks in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for QuickBooks and select the QuickBooks connector.

   :::image type="content" source="media/connector-quickbooks/quickbooks-connector.png" alt-text="Screenshot of the QuickBooks connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-quickbooks/configure-quickbooks-linked-service.png" alt-text="Screenshot of linked service configuration for QuickBooks.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to QuickBooks connector.

## Linked service properties

The following properties are supported for QuickBooks linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **QuickBooks** | Yes |
| connectionProperties | A group of properties that defines how to connect to QuickBooks. | Yes |
| ***Under `connectionProperties`:*** | | |
| endpoint | The endpoint of the QuickBooks Online server. (that is, quickbooks.api.intuit.com)  | Yes |
| companyId | The company ID of the QuickBooks company to authorize. For info about how to find the company ID, see [How do I find my Company ID](https://quickbooks.intuit.com/community/Getting-Started/How-do-I-find-my-Company-ID/m-p/185551). | Yes |
| consumerKey | The client ID of your QuickBooks Online application for OAuth 2.0 authentication. Learn more from [here](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0#obtain-oauth2-credentials-for-your-app). | Yes |
| consumerSecret | The client secret of your QuickBooks Online application for OAuth 2.0 authentication. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| refreshToken | The OAuth 2.0 refresh token associated with the QuickBooks application. Learn more from [here](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0#obtain-oauth2-credentials-for-your-app). Note refresh token will be expired after 180 days. Customer need to regularly update the refresh token. <br/>Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md).| Yes |
| useEncryptedEndpoints | Specifies whether the data source endpoints are encrypted using HTTPS. The default value is true.  | No |

**Example:**

```json
{
    "name": "QuickBooksLinkedService",
    "properties": {
        "type": "QuickBooks",
        "typeProperties": {
            "connectionProperties": {
                "endpoint": "quickbooks.api.intuit.com",
                "companyId": "<company id>",
                "consumerKey": "<consumer key>", 
                "consumerSecret": {
                     "type": "SecureString",
                     "value": "<clientSecret>"
            	},
                "refreshToken": {
                     "type": "SecureString",
                     "value": "<refresh token>"
            	},
                "useEncryptedEndpoints": true
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by QuickBooks dataset.

To copy data from QuickBooks Online, set the type property of the dataset to **QuickBooksObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **QuickBooksObject** | Yes |
| tableName | Name of the table. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "QuickBooksDataset",
    "properties": {
        "type": "QuickBooksObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<QuickBooks linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by QuickBooks source.

### QuickBooks as source

To copy data from QuickBooks Online, set the source type in the copy activity to **QuickBooksSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **QuickBooksSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM "Bill" WHERE Id = '123'"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromQuickBooks",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<QuickBooks input dataset name>",
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
                "type": "QuickBooksSource",
                "query": "SELECT * FROM \"Bill\" WHERE Id = '123' "
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```
## Copy data from Quickbooks Desktop

The Copy Activity in the service cannot copy data directly from Quickbooks Desktop. To copy data from Quickbooks Desktop, export your Quickbooks data to a comma-separated-values (CSV) file and then upload the file to Azure Blob Storage. From there, you can use the service to copy the data to the sink of your choice.

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).


## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
