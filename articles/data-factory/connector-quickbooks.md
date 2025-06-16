---
title: Copy data from QuickBooks Online
description: Learn how to copy data from QuickBooks Online to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.author: jianleishen
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 06/11/2025
---

# Copy data from QuickBooks Online using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from QuickBooks Online. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!IMPORTANT]
> This connector version 1.0 is currently in preview. You can try it out and give us feedback. If you want to take a dependency on preview connectors in your solution, please contact [Azure support](https://azure.microsoft.com/support/).

> [!IMPORTANT]
> The QuickBooks connector version 2.0 provides improved native QuickBooks support. If you are using QuickBooks connector version 1.0 (Preview) in your solution, please [upgrade the QuickBooks connector](#upgrade-the-quickbooks-connector-from-version-10-to-version-20) before **August 31, 2025**. Refer to this [section](#quickbooks-connector-lifecycle-and-upgrade) for details on the difference between version 2.0 and version 1.0 (Preview).

## Supported capabilities

This QuickBooks connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

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

The QuickBooks connector now supports version 2.0. Refer to this [section](#upgrade-the-quickbooks-connector-from-version-10-to-version-20) to upgrade your QuickBooks connector version from version 1.0 (Preview). For the property details, see the corresponding sections.

- [Version 2.0](#version-20)
- [Version 1.0 (Preview)](#version-10)

### Version 2.0

The QuickBooks linked service supports the following properties when apply version 2.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **QuickBooks** | Yes |
| version | The version that you specify. The value is `2.0`. | Yes |
| endpoint | The endpoint of the QuickBooks Online server. (that is, quickbooks.api.intuit.com)  | Yes |
| companyId | The company ID of the QuickBooks company to authorize. For info about how to find the company ID, see [How do I find my Company ID](https://quickbooks.intuit.com/community/Getting-Started/How-do-I-find-my-Company-ID/m-p/185551). | Yes |
| consumerKey | The client ID of your QuickBooks Online application for OAuth 2.0 authentication. Learn more from [here](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0#obtain-oauth2-credentials-for-your-app). | Yes |
| consumerSecret | The client secret of your QuickBooks Online application for OAuth 2.0 authentication. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| refreshToken | The OAuth 2.0 refresh token associated with the QuickBooks application. Learn more from [here](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0#obtain-oauth2-credentials-for-your-app). Note refresh token will be expired after 180 days. Customer need to regularly update the refresh token. <br/>Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md).| Yes |

**Example:**

```json
{
    "name": "QuickBooksLinkedService",
    "properties": {
        "type": "QuickBooks",
        "version": "2.0",
        "typeProperties": {
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
            }
        }
    }
}
```

### <a name="version-10"></a> Version 1.0 (Preview)

The following properties are supported for QuickBooks linked service when apply version 1.0 (Preview):

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

### Handling refresh tokens for the linked service

When you use the QuickBooks Online connector in a linked service, it's important to manage OAuth 2.0 refresh tokens from QuickBooks correctly. The linked service uses a refresh token to obtain new access tokens. However, QuickBooks Online periodically updates the refresh token, invalidating the previous one. The linked service does not automatically update the refresh token in Azure Key Vault, so you need to manage updating the refresh token to ensure uninterrupted connectivity. Otherwise you might encounter authentication failures once the refresh token expires.

You can manually update the refresh token in Azure Key Vault based on QuickBooks Online's refresh token expiry policy. But another approach is to automate updates with a scheduled task or [Azure Function](https://github.com/Azure-Samples/serverless-keyvault-secret-rotation-handling) that checks for a new refresh token and updates it in Azure Key Vault.

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
| query | Use the custom SQL query to read data. <br><br>For version 2.0, you can only use QuickBooks native query with limitations. For more information, see [query operations and syntax](https://developer.intuit.com/app/developer/qbo/docs/learn/explore-the-quickbooks-online-api/data-queries). Note that the `tableName` specified in the query must match the `tableName` in the dataset. <br><br>For version 1.0 (Preview), you can use SQL-92 query. For example: `"SELECT * FROM "Bill" WHERE Id = '123'"`. | No (if "tableName" in dataset is specified) |

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

## Data type mapping for Quickbooks

When you copy data from Quickbooks, the following mappings apply from Quickbooks's data types to the internal data types used by the service. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| Quickbooks data type | Interim service data type (for version 2.0) | Interim service data type (for version 1.0) |
|:--- |:--- |:--- |
| String       | string            | string                 |
| Boolean      | bool              | bool                   |
| DateTime     | datetime          | datetime               |
| Decimal      | decimal (15,2)    | decimal (15, 2)        |
| Enum         | string            | string                 |
| Date         | datetime          | datetime               |
| BigDecimal   | decimal (15,2)    | Decimal (15, 2)        |
| Integer      | int               | int                    |

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Quickbooks connector lifecycle and upgrade

The following table shows the release stage and change logs for different versions of the QuickBooks connector:

| Version  | Release stage | Change log |  
| :----------- | :------- |:------- |
| Version 1.0 (Preview) | End of support announced | / |  
| Version 2.0 | GA version available | • `useEncryptedEndpoints` is not supported. <br><br>• SQL-92 query is not supported.  <br><br>• Support Quickbooks native query with limitations. GROUP BY clauses, JOIN clauses and Aggregate Function (Avg, Max, Sum) aren't supported. For more information, see [query operations and syntax](https://developer.intuit.com/app/developer/qbo/docs/learn/explore-the-quickbooks-online-api/data-queries). <br><br>• The `tableName` specified in the `query` must match the `tableName` in the dataset.  |

### <a name="upgrade-the-quickbooks-connector-from-version-10-to-version-20"></a> Upgrade the Quickbooks connector from version 1.0 (Preview) to version 2.0

1. In **Edit linked service** page, select 2.0 for version. For more information, see [linked service version 2.0 properties](#version-20).
1. If you use SQL query in the copy activity source or the lookup activity that refers to the version 1.0 (Preview) linked service, you need to convert them to the QuickBooks native query. Learn more about native query from [Quickbooks as a source type](#quickbooks-as-source) and [query operations and syntax](https://developer.intuit.com/app/developer/qbo/docs/learn/explore-the-quickbooks-online-api/data-queries).

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
