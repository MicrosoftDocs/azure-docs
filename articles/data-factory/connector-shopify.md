---
title: Copy data from Shopify
description: Learn how to copy data from Shopify to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
ms.author: jianleishen
author: jianleishen
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 10/12/2025
---

# Copy data from Shopify using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from Shopify. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.


> [!IMPORTANT]
> The Shopify connector version 1.0 is at [removal stage](connector-release-stages-and-timelines.md). You are recommended to [upgrade the Shopify connector](#shopify-connector-lifecycle-and-upgrade) from version 1.0 to 2.0.

## Supported capabilities

This Shopify connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

The service provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

The connector supports the Windows versions in this [article](create-self-hosted-integration-runtime.md#prerequisites).

The billing_on column property was removed from the Recurring_Application_Charges and UsageCharge tables due to Shopify's official deprecation of billing_on field.

> [!NOTE]
> For version 2.0, column names retain the Shopify GraphQL structure, such as `data.customers.edges.node.createdAt`. For version 1.0, column names use simplified names, for example, `Created_At`.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Shopify using UI

Use the following steps to create a linked service to Shopify in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Shopify and select the Shopify connector.

   :::image type="content" source="media/connector-shopify/shopify-connector.png" alt-text="Screenshot of the Shopify connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-shopify/configure-shopify-linked-service.png" alt-text="Screenshot of linked service configuration for Shopify.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Shopify connector.

## Linked service properties

The Shopify connector now supports version 2.0. Refer to this [section](#upgrade-the-shopify-connector-from-version-10-to-version-20) to upgrade your Shopify connector version from version 1.0. For the property details, see the corresponding sections.

- [Version 2.0](#version-20)
- [Version 1.0](#version-10)

### <a name="version-20"></a>Version 2.0

The Shopify linked service supports the following properties when apply version 2.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Shopify** | Yes |
| version | The version that you specify. The value is `2.0`.  | Yes |
| host | The endpoint of the Shopify server. (that is, mystore.myshopify.com)  | Yes |
| accessToken | The API access token that can be used to access Shopify’s data. The token does not expire if it is offline mode. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |

**Example:**

```json
{
    "name": "ShopifyLinkedService",
    "properties": {
        "type": "Shopify",
        "version": "2.0",
        "typeProperties": {
            "host" : "mystore.myshopify.com",
            "accessToken": {
                 "type": "SecureString",
                 "value": "<accessToken>"
            }
        }
    }
}
```

### Version 1.0 

The Shopify linked service supports the following properties when apply version 1.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Shopify** | Yes |
| host | The endpoint of the Shopify server. (that is, mystore.myshopify.com)  | Yes |
| accessToken | The API access token that can be used to access Shopify’s data. The token does not expire if it is offline mode. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| useEncryptedEndpoints | Specifies whether the data source endpoints are encrypted using HTTPS. The default value is true.  | No |
| useHostVerification | Specifies whether to require the host name in the server's certificate to match the host name of the server when connecting over TLS. The default value is true.  | No |
| usePeerVerification | Specifies whether to verify the identity of the server when connecting over TLS. The default value is true.  | No |

**Example:**

```json
{
    "name": "ShopifyLinkedService",
    "properties": {
        "type": "Shopify",
        "typeProperties": {
            "host" : "mystore.myshopify.com",
            "accessToken": {
                 "type": "SecureString",
                 "value": "<accessToken>"
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Shopify dataset.

To copy data from Shopify, set the type property of the dataset to **ShopifyObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **ShopifyObject** | Yes |
| tableName | Name of the table. <br><br>For version 2.0, table names retain the Shopify GraphQL structure, for example `customers`. <br><br>For version 1.0, table names use simplified names with prefixes, for example, `"Shopify"."Customers"`.| No (if "query" in activity source is specified) |

> [!NOTE]
> *tags* column can not be read when you specify `tableName` in the dataset. To read this column, [use `query`](#shopify-as-source).

**Example**

```json
{
    "name": "ShopifyDataset",
    "properties": {
        "type": "ShopifyObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<Shopify linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Shopify source.

### Shopify as source

To copy data from Shopify, set the source type in the copy activity to **ShopifySource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **ShopifySource** | Yes |
| query |For version 2.0, use the GraphQL query to read data. To learn more about this query, see this [article](https://shopify.dev/docs/api/admin-graphql). Note that the pagination query is only supported for outer tables, and each record in the outer table can include up to 250 inner table records. <br><br>For version 1.0, use the custom SQL query to read data. For example: `"SELECT * FROM "Products" WHERE Product_Id = '123'"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromShopify",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Shopify input dataset name>",
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
                "type": "ShopifySource"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Data type mapping for Shopify

When you copy data from Shopify, the following mappings apply from Shopify's data types to the internal data types used by the service. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| Shopify data type | Interim service data type (for version 2.0) | Interim service data type (for version 1.0) |
|------------------|----------------------------------|----------------------|
| Boolean          | Boolean                          | Boolean              |
| Int              | Int                              | Int                  |
| UnsignedInt64    | UInt64                           | UInt64               |
| Decimal          | Decimal                          | Decimal              |
| Float            | Double                           | Double               |
| String           | String                           | String               |
| Date             | Date                             | Date                 |
| DateTime         | DateTime                         | DateTime             |
| ID               | String                           | String               |
| URL              | String                           | String               |
| CountryCode      | String                           | String               |
| Other custom datatypes | String                     | String               |


## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Shopify connector lifecycle and upgrade

The following table shows the release stage and change logs for different versions of the Shopify connector:

| Version  | Release stage | Change log |  
| :----------- | :------- |:------- |
| Version 1.0 | Removed | Not applicable. |
| Version 2.0 | General availability |• Table and column names retain the Shopify GraphQL structure. <br><br> • Support GraphQL query only. <br><br>• `useEncryptedEndpoints`, `useHostVerification`, `usePeerVerification` are not supported in the linked service. |

### <a name="upgrade-the-shopify-connector-from-version-10-to-version-20"></a> Upgrade the Shopify connector from version 1.0 to version 2.0

1. In **Edit linked service** page, select 2.0 for version. For more information, see [linked service version 2.0 properties](#version-20).
1. For version 2.0, note that table and column names retain the Shopify GraphQL structure.
1. If you use SQL query in the copy activity source or the lookup activity that refers to the version 1.0 linked service, you need to convert them to the GraphQL query. To learn more about this query, see this [article](https://shopify.dev/docs/api/admin-graphql)

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
