---
title: Copy data from Square
description: Learn how to copy data from Square to supported sink data stores by using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
ms.author: jianleishen
author: jianleishen
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 08/27/2025
ms.custom:
  - synapse
  - sfi-image-nochange
---

# Copy data from Square using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from Square. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.


> [!IMPORTANT]
> The Square connector version 1.0 is at [removal stage](connector-release-stages-and-timelines.md). You are recommended to [upgrade the Square connector](#square-connector-lifecycle-and-upgrade) from version 1.0 to 2.0.

## Supported capabilities

This Square connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

The service provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

The connector supports the Windows versions in this [article](create-self-hosted-integration-runtime.md#prerequisites).

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)]

> [!NOTE]
> Version 2.0 is supported with the self-hosted integration runtime version 5.56.0.0 or above.

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

The Square connector now supports version 2.0. Refer to this [section](#upgrade-the-square-connector-from-version-10-to-version-20) to upgrade your Square connector version from version 1.0. For the property details, see the corresponding sections.

- [Version 2.0](#version-20)
- [Version 1.0](#version-10)

### <a name="version-20"></a>Version 2.0

The Square linked service supports the following properties when apply version 2.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Square** | Yes |
| version | The version that you specify. The value is `2.0`.  | Yes |
| host | The URL of the Square instance. (i.e. mystore.mysquare.com)  | Yes |
| clientId | The client ID associated with your Square application.  | Yes |
| clientSecret | The client secret associated with your Square application. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| accessToken | The access token obtained from Square. Grants limited access to a Square account by asking an authenticated user for explicit permissions. OAuth access tokens expires 30 days after issued, but refresh tokens do not expire. Access tokens can be refreshed by refresh token.<br>Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). For more information about access token types, see [Access token types](#access-token-types). | Yes |
| refreshToken | The refresh token obtained from Square. Used to obtain new access tokens when the current one expires.<br>Mark this field as a SecureString to store it securelyFactory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. If not specified, it uses the default Azure Integration Runtime. You can use the self-hosted integration runtime and its version should be 5.56.0.0 or above. |No |

**Example:**

```json
{
    "name": "SquareLinkedService",
    "properties": {
        "type": "Square",
        "version": "2.0",
        "typeProperties": {
            "host": "<e.g. mystore.mysquare.com>", 
            "clientId": "<client ID>", 
            "clientSecret": {
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
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Version 1.0

The Square linked service supports the following properties when apply version 1.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Square** | Yes |
| connectionProperties | A group of properties that defines how to connect to Square. | Yes |
| ***Under `connectionProperties`:*** | | |
| host | The URL of the Square instance. (i.e. mystore.mysquare.com)  | Yes |
| clientId | The client ID associated with your Square application.  | Yes |
| clientSecret | The client secret associated with your Square application. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| accessToken | The access token obtained from Square. Grants limited access to a Square account by asking an authenticated user for explicit permissions. OAuth access tokens expires 30 days after issued, but refresh tokens do not expire. Access tokens can be refreshed by refresh token.<br>Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). For more information about access token types, see [Access token types](#access-token-types). | Yes |
| refreshToken | The refresh token obtained from Square. Used to obtain new access tokens when the current one expires.<br>Mark this field as a SecureString to store it securelyFactory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
| useEncryptedEndpoints | Specifies whether the data source endpoints are encrypted using HTTPS. The default value is true.  | No |
| useHostVerification | Specifies whether to require the host name in the server's certificate to match the host name of the server when connecting over TLS. The default value is true.  | No |
| usePeerVerification | Specifies whether to verify the identity of the server when connecting over TLS. The default value is true.  | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. If not specified, it uses the default Azure Integration Runtime. |No |

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
                "clientSecret": {
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

### Access token types

Square support two types of access token: **personal** and **OAuth**.

- Personal access tokens are used to get unlimited Connect API access to resources in your own Square account.
- OAuth access tokens are used to get authenticated and scoped Connect API access to any Square account. Use them when your app accesses resources in other Square accounts on behalf of account owners. OAuth access tokens can also be used to access resources in your own Square account.

    >[!Important]
    > To perform **Test connection** in the linked service, `MERCHANT_PROFILE_READ` is required to get a scoped OAuth access token. For permissions to access other tables, see [Square OAuth Permissions Reference](https://developer.squareup.com/docs/oauth-api/square-permissions).


Authentication via personal access token only needs `accessToken`, while authentication via OAuth requires `accessToken` and `refreshToken`. Learn how to retrieve access token from [here](https://developer.squareup.com/docs/build-basics/access-tokens).

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Square dataset.

To copy data from Square, set the type property of the dataset to **SquareObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **SquareObject** | Yes |
| tableName | Name of the table. | Yes for version 2.0.<br> No for version 1.0 (if "query" in activity source is specified) |

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

> [!Note]
> `query` is not supported in version 2.0.

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

## Data type mapping for Square

When you copy data from Square, the following mappings apply from Square's data types to the internal data types used by the service. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| Square data type | Interim service data type (for version 2.0) | Interim service data type (for version 1.0) |
|------------------|----------------------------------|----------------------|
| String           | String                           | String               |
| Integer          | Int32                            | Int32                |
| Long             | Int64                            | Int64                |
| Boolean          | Boolean                          | Boolean              |
| Date             | String                           | Not supported.       |
| Timestamp        | String                           | Not supported.       |
| Timestamp with offset   |String                     | Not supported.       |
| Duration (full)  | String                           | String               |
| Duration (time only) | String                       | String               |
| Money            | Int64                            | Int64                |

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Square connector lifecycle and upgrade

The following table shows the release stage and change logs for different versions of the Square connector:

| Version  | Release stage | Change log |  
| :----------- | :------- |:------- |
| Version 1.0 | Removed | Not applicable. |
| Version 2.0 | General availability |  • The self-hosted integration runtime version should be 5.56.0.0 or above. <br><br>• Date, Timestamp and Timestamp with offset are read as String data type. <br><br> • `useEncryptedEndpoints`, `useHostVerification`, `usePeerVerification` are not supported in the linked service.   <br><br>• `query` is not supported.  |

### <a name="upgrade-the-square-connector-from-version-10-to-version-20"></a> Upgrade the Square connector from version 1.0 to version 2.0

1. In **Edit linked service** page, select 2.0 for version. For more information, see [linked service version 2.0 properties](#version-20).

1. The data type mapping for the Square linked service version 2.0 is different from that for the version 1.0. To learn the latest data type mapping, see [Data type mapping for Square](#data-type-mapping-for-square).

1. Apply a self-hosted integration runtime with version 5.56.0.0 or above.

1. `query` is only supported in version 1.0. You should use the `tableName` instead of `query` in version 2.0.


## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
