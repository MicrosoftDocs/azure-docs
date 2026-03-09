---
title: Copy data from HubSpot
description: Learn how to copy data from HubSpot to supported sink data stores by using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 11/05/2025
ms.author: jianleishen
ms.custom:
  - synapse
  - sfi-image-nochange
---
# Copy data from HubSpot using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from HubSpot. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!IMPORTANT]
> The HubSpot connector version 1.0 is at [removal stage](connector-release-stages-and-timelines.md). You are recommended to [upgrade the HubSpot connector](#hubspot-connector-lifecycle-and-upgrade) from version 1.0 to 2.0.

## Supported capabilities

This HubSpot connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources/sinks , see the [Supported data stores](connector-overview.md#supported-data-stores) table.

The service provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

The connector supports the Windows versions in this [article](create-self-hosted-integration-runtime.md#prerequisites).

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

The HubSpot connector now supports version 2.0. Refer to this [section](#upgrade-the-hubspot-connector-from-version-10-to-version-20) to upgrade your HubSpot connector version from version 1.0. For the property details, see the corresponding sections.

- [Version 2.0](#version-20)
- [Version 1.0](#version-10)

### <a name="version-20"></a> Version 2.0

The HubSpot linked service supports the following properties when apply version 2.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Hubspot** | Yes |
| version | The version that you specify. The value is `2.0`. | Yes |
| clientId | The client ID associated with your HubSpot application. Learn how to create an app in HubSpot from [here](https://developers.hubspot.com/docs/faq/how-do-i-create-an-app-in-hubspot). | Yes |
| clientSecret | The client secret associated with your HubSpot application. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| accessToken | The access token obtained when initially authenticating your OAuth integration. Learn how to get access token with your client ID and secret from [here](https://developers.hubspot.com/docs/methods/oauth2/get-access-and-refresh-tokens). Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| refreshToken | The refresh token obtained when initially authenticating your OAuth integration. Mark this field as a SecureString to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. If no value is specified, the property uses the default Azure integration runtime. | No |

**Example:**

```json
{
    "name": "HubSpotLinkedService",
    "properties": {
        "type": "Hubspot",
        "version": "2.0",
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

### Version 1.0

The HubSpot linked service supports the following properties when apply version 1.0:

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
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. If no value is specified, the property uses the default Azure integration runtime. | No |


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
| tableName | Name of the table. For version 2.0, the name of the table is `<HubSpot Category>.<Sub Category>.<Object Name>`, for example: `CRM.Commerce.Discounts`. | 	Yes for version 2.0.<br>No for version 1.0 (if "query" in activity source is specified) |

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

The connector version 2.0 supports the following HubSpot tables:

- Marketing.Campaigns
- Marketing.Emails.Marketing_Emails
- Marketing.Subscriptions
- Conversations.Inbox___Messages
- CMS.Authors
- CMS.Blog_Settings
- CMS.Content_Audit
- CMS.Domains
- CMS.Hubdb
- CMS.Pages
- CMS.Posts
- CMS.Site_Search
- CMS.Tags
- CMS.Url_Redirects
- CRM.Commerce.Carts
- CRM.Commerce.Discounts
- CRM.Commerce.Fees
- CRM.Commerce.Invoices
- CRM.Commerce.Orders
- CRM.Commerce.Quotes
- CRM.Commerce.Subscriptions
- CRM.Commerce.Taxes
- CRM.Engagements.Calls
- CRM.Engagements.Communications
- CRM.Engagements.Emails
- CRM.Engagements.Meetings
- CRM.Engagements.Notes
- CRM.Engagements.Postal_Mail
- CRM.Engagements.Tasks
- CRM.Objects.Companies
- CRM.Objects.Contacts
- CRM.Objects.Deals
- CRM.Objects.Feedback_Submissions
- CRM.Objects.Goal_Targets
- CRM.Objects.Leads
- CRM.Objects.Line_Items
- CRM.Objects.Products
- CRM.Objects.Tickets
- CRM.Owners

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by HubSpot source.

### HubspotSource as source

To copy data from HubSpot, set the source type in the copy activity to **HubspotSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **HubspotSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM Companies where Company_Id = xxx"`. | No (if "tableName" in dataset is specified)|

> [!NOTE]
> `query` is not supported in version 2.0.

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

## Data type mapping for HubSpot

When you copy data from HubSpot, the following mappings apply from HubSpot's data types to the internal data types used by the service. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

| HubSpot data type    | Interim service data type (for version 2.0) | Interim service data type (for version 1.0) |
|---------------------|-------------------------------------------------------|---------------------------------------------|
| bool                | Boolean                                               | Boolean                                     |
| boolean             | Boolean                                               | Boolean                                     |
| enumeration         | String                                                | String                                      |
| string              | String                                                | String                                      |
| object_coordinates  | String                                                | String                                      |
| phone_number        | String                                                | String                                      |
| json                | String                                                | String                                      |
| date                | DateTime                                                   | Not supported.                                         |
| datetime            | DateTime                                              | DateTime                                    |
| number              | Decimal                                               | Decimal                                     |
| integer             | Integer                                               | Integer                                     |
| object              | String                                                | Not supported.                                         |

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## HubSpot connector lifecycle and upgrade

The following table shows the release stage and change logs for different versions of the HubSpot connector:

| Version  | Release stage | Change log |  
| :----------- | :------- |:------- |
| Version 1.0 | Removed | Not applicable. |
| Version 2.0 | General availability |• The `tableName` value is `<HubSpot Category>.<Sub Category>.<Object Name>`, for example: `CRM.Commerce.Discounts`. <br><br>• date is read as DateTime data type. <br><br>• object is read as String data type.<br><br>•`useEncryptedEndpoints`, `useHostVerification`, `usePeerVerification` are not supported in the linked service. <br><br>  • `query` is not supported. <br><br>• Support specific HubSpot tables. For the supported table list, go to [Dataset properties](#dataset-properties).|

### <a name="upgrade-the-hubspot-connector-from-version-10-to-version-20"></a> Upgrade the HubSpot connector from version 1.0 to version 2.0

1. In **Edit linked service** page, select version 2.0 and configure the linked service by referring to [Linked service properties version 2.0](#version-20).

2. The data type mapping for the HubSpot linked service version 2.0 is different from that for the version 1.0. To learn the latest data type mapping, see [Data type mapping for HubSpot](#data-type-mapping-for-hubspot).

3. `query` is only supported in version 1.0. You should use the `tableName` instead of `query` in version 2.0.
4. Note that version 2.0 supports specific HubSpot tables. For the supported table list, go to [Dataset properties](#dataset-properties).

## Related content
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
