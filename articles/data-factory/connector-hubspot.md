---
title: Copy data from HubSpot
description: Learn how to copy data from HubSpot to supported sink data stores by using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 10/20/2023
ms.author: jianleishen
---
# Copy data from HubSpot using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from HubSpot. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

This HubSpot connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

For a list of data stores that are supported as sources/sinks , see the [Supported data stores](connector-overview.md#supported-data-stores) table.

The service provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to HubSpot using UI

Use the following steps to create a linked service to HubSpot in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Create a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Create a new linked service with Azure Synapse UI.":::

2. Search for HubSpot and select the HubSpot connector.

   :::image type="content" source="media/connector-hubspot/hubspot-connector.png" alt-text="Select the HubSpot connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-hubspot/configure-hubspot-linked-service.png" alt-text="Configure a linked service to HubSpot.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to HubSpot connector.

## Linked service properties

The following properties are supported for HubSpot linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Hubspot** | Yes |
| clientId | The client ID associated with your HubSpot application. Learn how to create an app in HubSpot from [here](https://developers.hubspot.com/docs/faq/how-do-i-create-an-app-in-hubspot). | Yes |
| clientSecret | The client secret associated with your HubSpot application. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| accessToken | The access token obtained when initially authenticating your OAuth integration. Learn how to get access token with your client ID and secret from [here](https://developers.hubspot.com/docs/methods/oauth2/get-access-and-refresh-tokens). Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| refreshToken | The refresh token obtained when initially authenticating your OAuth integration. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| useEncryptedEndpoints | Specifies whether the data source endpoints are encrypted using HTTPS. The default value is true.  | No |
| useHostVerification | Specifies whether to require the host name in the server's certificate to match the host name of the server when connecting over TLS. The default value is true.  | No |
| usePeerVerification | Specifies whether to verify the identity of the server when connecting over TLS. The default value is true.  | No |

**Example:**

```json
{
    "name": "HubSpotLinkedService",
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
    "name": "HubSpotDataset",
    "properties": {
        "type": "HubspotObject",
        "typeProperties": {},
        "schema": [],        
        "linkedServiceName": {
            "referenceName": "<HubSpot linked service name>",
            "type": "LinkedServiceReference"
        }
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
                "referenceName": "<HubSpot input dataset name>",
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

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).


## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
