---
title: Copy data from Google AdWords
description: Learn how to copy data from Google AdWords to supported sink data stores using a copy activity in an Azure Data Factory or Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 09/14/2023
---

# Copy data from Google AdWords using Azure Data Factory or Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]


This article outlines how to use the Copy Activity in an Azure Data Factory or Synapse Analytics pipeline to copy data from Google AdWords. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

This Google AdWords connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

For a list of data stores that are supported as sources/sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

The service provides a built-in driver to enable connectivity, therefore you don't need to manually install any driver using this connector.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Google AdWords using UI

Use the following steps to create a linked service to Google AdWords in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Google and select the Google AdWords connector.

   :::image type="content" source="media/connector-google-adwords/google-adwords-connector.png" alt-text="Screenshot of the Google AdWords connector.":::    


1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-google-adwords/configure-google-adwords-linked-service.png" alt-text="Screenshot of linked service configuration for Google AdWords.":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Google AdWords connector.

## Linked service properties

> [!Important]
> Due to the sunset of Google AdWords API by **April 27, 2022**, the service has upgraded to the new Google Ads API. Please refer this [document](connector-troubleshoot-google-adwords.md#migrate-to-the-new-version-of-google-ads-api) for detailed migration steps and recommendations. Please make sure the migration to be done before **April 27, 2022**.  

The following properties are supported for Google AdWords linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **GoogleAdWords** | Yes |
| connectionProperties | A group of properties that defines how to connect to Google AdWords. | Yes |
| ***Under `connectionProperties`:*** | | |
| googleAdsApiVersion | The Google Ads API version that you use. Please upgrade to the latest version before December 31, 2023. Learn how to upgrade your linked service [here](#upgrade-the-google-adwords-linked-service). | Yes |
| clientCustomerID | The Client customer ID of the AdWords account that you want to fetch report data for.  | Yes |
| loginCustomerID | The customer ID of the Google AdWords manager account through which you want to fetch report data of specific customer.| No |
| developerToken | The developer token associated with the manager account that you use to grant access to the AdWords API.  You can choose to mark this field as a SecureString to store it securely, or store password in Azure Key Vault and let the copy activity pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | Yes |
| authenticationType | The OAuth 2.0 authentication mechanism used for authentication. ServiceAuthentication can only be used on self-hosted IR. <br/>Allowed values are: **ServiceAuthentication**, **UserAuthentication** | Yes |
| refreshToken | The refresh token obtained from Google for authorizing access to AdWords for UserAuthentication. You can choose to mark this field as a SecureString to store it securely, or store password in Azure Key Vault and let the copy activity pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | No |
| clientId | The client ID of the Google application used to acquire the refresh token. You can choose to mark this field as a SecureString to store it securely, or store password in Azure Key Vault and let the copy activity pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | No |
| clientSecret | The client secret of the google application used to acquire the refresh token. You can choose to mark this field as a SecureString to store it securely, or store password in Azure Key Vault and let the copy activity pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | No |
| email | The service account email ID that is used for ServiceAuthentication and can only be used on self-hosted IR.  | No |
| privateKey | The service private key that is used for ServiceAuthentication for Google Ads API version v14. You can choose to mark this field as a SecureString to store it securely, or store password in Azure Key Vault and let the copy activity pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md).| No |
| keyFilePath | The full path to the `.p12` or `.json` key file that is used to authenticate the service account email address and can only be used on self-hosted IR. Specify this when you use ServiceAuthentication for Google Ads API version v12. | No |
| trustedCertPath | The full path of the .pem file containing trusted CA certificates for verifying the server when connecting over TLS. This property can only be set when using TLS on self-hosted IR. The default value is the cacerts.pem file installed with the IR. Specify this when you use ServiceAuthentication for Google Ads API version v12. | No |
| useSystemTrustStore | Specifies whether to use a CA certificate from the system trust store or from a specified PEM file. The default value is false. Specify this when you use ServiceAuthentication for Google Ads API version v12. | No |

**Example:**

```json
{
    "name": "GoogleAdWordsLinkedService",
    "properties": {
        "type": "GoogleAdWords",
        "typeProperties": {
            "connectionProperties": {
                "clientCustomerID": "<clientCustomerID>",
                "loginCustomerID": "<loginCustomerID>",
                "developerToken": {
                    "type": "SecureString",
                    "value": "<developerToken>"
                },
                "authenticationType": "ServiceAuthentication",
                "refreshToken": {
                    "type": "SecureString",
                    "value": "<refreshToken>"
                },
                "clientId": {
                    "type": "SecureString",
                    "value": "<clientId>"
                },
                "clientSecret": {
                    "type": "SecureString",
                    "value": "<clientSecret>"
                },
                "email": "<email>",
                "keyFilePath": "<keyFilePath>",
                "trustedCertPath": "<trustedCertPath>",
                "useSystemTrustStore": true,
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Google AdWords dataset.

To copy data from Google AdWords, set the type property of the dataset to **GoogleAdWordsObject**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **GoogleAdWordsObject** | Yes |
| tableName | Name of the table. | No (if "query" in activity source is specified) |

**Example**

```json
{
    "name": "GoogleAdWordsDataset",
    "properties": {
        "type": "GoogleAdWordsObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<GoogleAdWords linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}

```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Google AdWords source.

### Google AdWords as source

To copy data from Google AdWords, set the source type in the copy activity to **GoogleAdWordsSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **GoogleAdWordsSource** | Yes |
| query | Use the custom SQL query to read data. For example: `"SELECT * FROM MyTable"`. | No (if "tableName" in dataset is specified) |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromGoogleAdWords",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<GoogleAdWords input dataset name>",
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
                "type": "GoogleAdWordsSource",
                "query": "SELECT * FROM MyTable"
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

## Upgrade the Google AdWords linked service

To upgrade your Google AdWords linked service, you need update your linked service and learn how to migrate from SQL to Google AdWords query language (GAQL).

### Update the linked service configuration

In **Edit linked service** page, select **v14** in **Google Ads API version**. If you use **Service authentication**, note that the configuration for it has changed and you need to apply new configuration. Refer to [Linked service properties](#linked-service-properties) for the detailed configuration. 

### Migrate from SQL to GAQL

If you use SQL statements in your pipelines that refer to the old Google AdWords linked service, you need to update it to GAQL statements. 

In contrast to SQL, the query in GAQL is made up of six kinds of clauses:

- `SELECT`
- `FROM`
- `WHERE`
- `ORDER BY`
- `LIMIT`
- `PARAMETERS`

Go to [Google Ads Query Language Grammar](https://developers.google.com/google-ads/api/docs/query/grammar) for the introduction of GAQL.

Take the following SQL statement as an example:

`SELECT *|FieldName FROM ResourceName WHERE FieldName Operator Value`

You can follow the guidance below to convert the SQL statement to the corresponding GAQL statement:

1. If `*` (asterisk) is used after the `SELECT` clause, then you need to specify all the required fields in place of the asterisk as GAQL doesn't support `SELECT *`. Go to this [article](https://developers.google.com/google-ads/api/fields/v14/ad_group) to see all the selectable fields in the specific resource.
2. If the field name is used after the `SELECT` clause, then you need to convert the name to the corresponding field name in GAQL as they have different naming conventions. For example, the field name `campaign_id` in SQL query statement should be converted to `campaign.id` in GAQL. See [Field name](#field-name) for more details on field name conversion.
3. The resource name should be left as it is.
4. `WHERE` clause should be updated according to the [GAQL grammar](https://developers.google.com/google-ads/api/docs/query/grammar) as the operators supported by GAQL are not consistent with SQL, and field name should also be converted as described in the second point.

Here are two very useful tools offered by Google and they are highly recommended when building the corresponding GAQL query statements:

1. [Interactive GAQL query builder](https://developers.google.com/google-ads/api/fields/v14/overview_query_builder) 
2. [GAQL query validator](https://developers.google.com/google-ads/api/fields/v14/query_validator) 

### Field name

The field name used in SQL is not aligned with GAQL. You also need to learn the conversion rules from field names in SQL to field names in GAQL. The conversion rule can be summarized as follows:

1. If the field name belongs to a resource, the underscore (`_`) in SQL will be changed to dot (`.`) in GAQL. And for the words between the dot, the camelCase type statement used in SQL will be changed to standalone words with added underscores in between. The the first string of type PascalCase in SQL will be changed to normal words in GAQL.

2. If the field name belongs to segments or metrics, the prefix `segments.` or `metrics.` should be added in GAQL, then follow the same rule as described in the first point to convert the name.

Here are the concrete examples of the field name conversion:

| Category | Field names in SQL | Field  names in GAQL | 
|---------| --------|---------| 
| Resource fields | `Campaign_startDate` | `campaign.start_date` | 
| Resource fields | `Customer_conversionTrackingSetting_conversionTrackingStatus` | `customer.conversion_tracking_setting.conversion_tracking_status` | 
| Segments | `DayOfWeek` | `segments.day_of_week` | 
| Metrics | `VideoViews` | `metrics.video_views` | 

## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
