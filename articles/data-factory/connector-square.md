---
title: Copy data from Square (Preview) 
description: Learn how to copy data from Square to supported sink data stores by using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 07/13/2023
---

# Copy data from Square using Azure Data Factory or Synapse Analytics (Preview)
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from Square. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!IMPORTANT]
> This connector is currently in preview. You can try it out and give us feedback. If you want to take a dependency on preview connectors in your solution, please contact [Azure support](https://azure.microsoft.com/support/).

> [!Note]
> Currently, this connector doesn't support sandbox accounts.

## Supported capabilities

This Square connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

The service provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Square using UI

Use the following steps to create a linked service to Square in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Square and select the Square connector.

   :::image type="content" source="media/connector-square/square-connector.png" alt-text="Screenshot of the Square connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-square/configure-square-linked-service.png" alt-text="Screenshot of linked service configuration for Square.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Square connector.

## Linked service properties

The following properties are supported for Square linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Square** | Yes |
| connectionProperties | A group of properties that defines how to connect to Square. | Yes |
| ***Under `connectionProperties`:*** | | |
| host | The URL of the Square instance. (i.e. mystore.mysquare.com)  | Yes |
| clientId | The client ID associated with your Square application.  | Yes |
| clientSecret | The client secret associated with your Square application. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| accessToken | The access token obtained from Square. Grants limited access to a Square account by asking an authenticated user for explicit permissions. OAuth access tokens expires 30 days after issued, but refresh tokens do not expire. Access tokens can be refreshed by refresh token.<br>Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md).  | Yes |
| refreshToken | The refresh token obtained from Square. Used to obtain new access tokens when the current one expires.<br>Mark this field as a SecureString to store it securelyFactory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| useEncryptedEndpoints | Specifies whether the data source endpoints are encrypted using HTTPS. The default value is true.  | No |
| useHostVerification | Specifies whether to require the host name in the server's certificate to match the host name of the server when connecting over TLS. The default value is true.  | No |
| usePeerVerification | Specifies whether to verify the identity of the server when connecting over TLS. The default value is true.  | No |

Square support two types of access token: **personal** and **OAuth**.

- Personal access tokens are used to get unlimited Connect API access to resources in your own Square account.
- OAuth access tokens are used to get authenticated and scoped Connect API access to any Square account. Use them when your app accesses resources in other Square accounts on behalf of account owners. OAuth access tokens can also be used to access resources in your own Square account.

    >[!Important]
    > To perform **Test connection** in the linked service, `MERCHANT_PROFILE_READ` is required to get a scoped OAuth access token. For permissions to access other tables, see [Square OAuth Permissions Reference](https://developer.squareup.com/docs/oauth-api/square-permissions).


Authentication via personal access token only needs `accessToken`, while authentication via OAuth requires `accessToken` and `refreshToken`. Learn how to retrieve access token from [here](https://developer.squareup.com/docs/build-basics/access-tokens).

**Example:**

```json
{
    "name": "SquareLinkedService",
    "properties": {
        "type": "Square",
        "typeProperties": {
            "connectionProperties": {
                "host": "<e.g. mystore.mysquare.com>", 
                "clientId": "<client ID>", 
                "clientSecrect": {
                    "type": "SecureString",
                    "value": "<clientSecret>"
                }, 
                "accessToken": {
                    "type": "SecureString",
                    "value": "<access token>"
                }, 
                "refreshToken": {
                    "type": "SecureString",
                    "value": "<refresh token>"
                }, 
                "useEncryptedEndpoints": true, 
                "useHostVerification": true, 
                "usePeerVerification": true 
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Square dataset.

To copy data from Square, set the type property of the dataset to **SquareObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **SquareObject** | Yes |
| tableName | Name of the table. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "SquareDataset",
    "properties": {
        "type": "SquareObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Square linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Square source.

### Square as source

To copy data from Square, set the source type in the copy activity to **SquareSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **SquareSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM Business"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromSquare",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Square input dataset name>",
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
                "type": "SquareSource",
                "query": "SELECT * FROM Business"
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
